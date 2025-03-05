from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import shutil
import requests
import google.generativeai as genai
from dotenv import load_dotenv
import os
import supabase
import faiss
import numpy as np
import firecrawl
import uvicorn
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
import logging

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
ELEVEN_LABS_API_KEY = os.getenv("ELEVEN_LABS_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")
FIRECRAWL_API_KEY = os.getenv("FIRECRAWL_KEY")
FIRECRAWL_API_ENDPOINT = "https://api.firecrawl.com/v1/search"

# Configure Gemini
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel(
    model_name="gemini-2.0-flash-exp",
    generation_config=None,
    system_instruction="""
    You are a Real Estate Communication Assistant, designed to analyze and process multilingual conversations between real estate agents and their clients. Your primary goal is to extract key information, provide summaries, perform translations, and assist in follow-up task generation.

    Here are your specific responsibilities:

    1. **Transcription and Translation:**
        * You will receive text transcripts of conversations, which may be in various languages (Hindi, Marathi, Telugu, English, or mixed languages).
        * Translate all non-English text into clear, accurate English.
        * Maintain the original context and nuance of the conversation.

    2. **Information Extraction:**
        * Identify and extract key information from the English transcript, including:
            * Client name and contact details.
            * Property preferences (type, size, location, amenities).
            * Budget range.
            * Desired timeframe for purchase or rental.
            * Specific questions or concerns raised by the client.
            * Any dates or deadlines that are mentioned.
        * Present the extracted information in a structured, easily readable format (e.g., JSON, bullet points).

    3. **Sentiment Analysis:**
        * Analyze the emotional tone of the conversation.
        * Determine if the client's sentiment is positive, negative, or neutral.
        * Provide a brief summary of the client's emotional state.

    4. **Summarization:**
        * Provide concise summaries of the conversation, highlighting the main points discussed.
        * Summaries should be short and to the point.

    5. **Follow-up Task Generation:**
        * Based on the conversation, generate a list of potential follow-up tasks for the real estate agent.
        * Examples: "Schedule a property viewing," "Send property listings," "Follow up on client's questions," "Set a reminder for the clients desired contact date."
        * Tasks should be actionable and include relevant details.

    6. **RAG functionality:**
        * You will be provided with chunks of conversation.
        * When provided with a question, answer the question using the provided conversation chunks.

    7. **Output Format:**
        * Provide your responses in a clear and structured format.
        * Use JSON for structured data.
        * Use clear, concise language for summaries and task lists.

    8. **Language Detection:**
        * If you are provided with text, and no language is specified, determine the language of the text.

    **Important Considerations:**

    * Pay close attention to context and avoid making assumptions.
    * Prioritize accuracy and clarity in your responses.
    * Be mindful of cultural nuances and avoid offensive or inappropriate language.
    * When provided with conversation chunks, only answer questions based on the provided information.
    """
)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (for development, consider specifying origins in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Eleven Labs API settings
ELEVEN_LABS_API_ENDPOINT = "https://api.elevenlabs.io/v1/audio/transcribe"

# Initialize global variable
transcription_result = None

# Supabase Client
supabase_client = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

def chunk_text(text, chunk_size=500):
    """Chunks the text into smaller segments."""
    chunks = []
    for i in range(0, len(text), chunk_size):
        chunks.append(text[i:i + chunk_size])
    return chunks

def get_embedding(text):
    """Generates embeddings for the given text."""
    result = genai.embed_content(
        model="embedding-001",  # Fixed model name
        content=text,
        task_type="retrieval_query"
    )
    return result["embedding"]

def create_index_from_chunks(text):
    """Creates a FAISS index from text chunks."""
    chunks = chunk_text(text)
    chunk_embeddings = np.array([get_embedding(chunk) for chunk in chunks])
    chunk_embeddings = chunk_embeddings / np.linalg.norm(chunk_embeddings, axis=1, keepdims=True)

    dimension = len(chunk_embeddings[0])
    index = faiss.IndexFlatIP(dimension)
    index.add(chunk_embeddings)

    return index, chunks

def retrieve_chunks(index, chunks, query, k=3):
    """Retrieves relevant chunks based on a query."""
    query_embedding = get_embedding(query)
    query_embedding = np.array([query_embedding])
    query_embedding = query_embedding / np.linalg.norm(query_embedding)

    scores, indices = index.search(query_embedding, k)

    results = []
    for i, idx in enumerate(indices[0]):
        if idx < len(chunks):  # Add check to prevent index out of bounds
            results.append({
                "content": chunks[idx],
                "score": scores[0][i]
            })

    return results

def generate_rag_response(text, query, k=3):
    """Generates a response using RAG based on text chunks."""
    index, chunks = create_index_from_chunks(text)
    retrieved_chunks = retrieve_chunks(index, chunks, query, k)

    context = "\n\n".join([chunk["content"] for chunk in retrieved_chunks])

    prompt = f"""
    Context information:
    {context}

    Based on the context information, please answer the following question:
    {query}

    If the context doesn't contain relevant information, please say so.
    """

    response = model.generate_content(prompt)

    return {
        "query": query,
        "retrieved_chunks": retrieved_chunks,
        "response": response.text
    }

def firecrawl_search(query):
    headers = {
        "Authorization": f"Bearer {FIRECRAWL_API_KEY}",
        "Content-Type": "application/json"
    }
    params = {
        "query": query
    }
    response = requests.get(FIRECRAWL_API_ENDPOINT, headers=headers, params=params)
    return response.json()

class QueryRequest(BaseModel):
    query: str
    text: str #transcribed text

@app.post("/rag-query")
async def rag_query(query_request: QueryRequest):
    """Endpoint to handle RAG queries."""
    try:
        response = generate_rag_response(query_request.text, query_request.query)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...)):
    try:
        # Save the audio file
        file_path = "recorded_audio.mp3"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        print(f"Received file: {file.filename}")
        print(f"Content type: {file.content_type}")
        print(f"Saved as: {file_path}")

        # Prepare for Eleven Labs API
        with open(file_path, "rb") as audio:
            files = {
                'audio': ('audio.mp3', audio, 'audio/mp3')
            }
            headers = {
                "xi-api-key": ELEVEN_LABS_API_KEY
            }
            
            print("Sending to Eleven Labs API...")
            response = requests.post(
                ELEVEN_LABS_API_ENDPOINT,
                headers=headers,
                files=files
            )

        if response.status_code == 200:
            transcription_result = response.json()
            text = transcription_result["text"]
            print("Transcription successful")

            # Chunk, embed, and store
            chunks = chunk_text(text)
            for chunk in chunks:
                embeddings = get_embedding(chunk)
                supabase_client.table("text_embeddings").insert({"text_chunk": chunk, "embeddings": embeddings}).execute()

            return {"filename": file.filename, "message": "Transcription and embeddings stored successfully"}
        else:
            print(f"Eleven Labs API Error: Status {response.status_code}")
            print(f"Response: {response.text}")
            return {"filename": file.filename, "error": f"Failed to transcribe audio: {response.status_code} - {response.text}"}

    except Exception as e:
        print(f"Error processing audio: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-response")
async def generate_response():
    """Generates a response based on the transcribed text."""
    global transcription_result
    if transcription_result is None:
        return {"error": "Transcription result not available"}

    text = transcription_result["text"]
    prompt = text + "this is the talk between a client and a real estate agent give me bullet points of the key points of the conversation"
    response = model.generate_content(prompt)

    return {"response": response.text}

@app.get("/get-transcription-result")
async def get_transcription_result():
    """Retrieves the transcription result."""
    global transcription_result
    return transcription_result

class FirecrawlRequest(BaseModel):
    bullet_points: str

@app.post("/firecrawl-properties")
async def firecrawl_properties(firecrawl_request: FirecrawlRequest):
    try:
        # Use Gemini to extract location and property type from bullet points
        prompt = f"From the following bullet points: '{firecrawl_request.bullet_points}', extract the location and property type. Format your response exactly like this: 'Location: [location], Property Type: [property_type]'"
        location_property_response = model.generate_content(prompt)
        location_property_text = location_property_response.text
        
        # Improved parsing logic
        try:
            location_part = location_property_text.split("Location:")[1].split(",")[0].strip()
            property_type_part = location_property_text.split("Property Type:")[1].strip()
        except (IndexError, AttributeError):
            # Fallback if parsing fails
            location_part = "New York"
            property_type_part = "Apartment"

        # Use Firecrawl to scrape properties
        results = firecrawl_search(f"{property_type_part} in {location_part}")
        return results

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during Firecrawl: {str(e)}")

def firecrawl_search(query):
    headers = {
        "Authorization": f"Bearer {FIRECRAWL_API_KEY}",
        "Content-Type": "application/json"
    }
    params = {
        "query": query
    }
    response = requests.get(FIRECRAWL_API_ENDPOINT, headers=headers, params=params)
    return response.json()

@app.post("/ai/")
async def search(userquery: Request):
    try:
        # Parse the incoming request
        request = await userquery.json()
        query_text = request.get("query")

        if not query_text:
            raise HTTPException(status_code=400, detail="Query text is required")

        # Generate response using Gemini
        response = model.generate_content(query_text)

        # Return the response in a structured format
        return {
            "success": True,
            "response": response.text,
            "query": query_text
        }

    except Exception as e:
        logging.error(f"Error during search: {e}")
        raise HTTPException(status_code=500, detail=f"Error during search: {str(e)}")

@app.post("/login/")
async def login(request: Request):
    try:
        # Extract email and password from the request body
        body = await request.json()
        email = body.get('email')
        password = body.get('password')

        if not email or not password:
            raise HTTPException(status_code=400, detail="Email and password are required")

        data = {
            'email': email,
            'password': password
        }

        response = requests.post(
            f'{supabase_url}/auth/v1/token',
            headers={
                'Content-Type': 'application/json',
                'apikey': supabase_key,
                'Authorization': f'Bearer {supabase_key}'
            },
            json={
                'grant_type': 'password',
                'email': email,
                'password': password
            }
        )

        if response.status_code == 200:
            return response.json()  # Return the response from Supabase
        else:
            raise HTTPException(status_code=response.status_code, detail=response.json())

    except Exception as e:
        logging.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/signup/")
async def signup(request: Request):
    try:
        # Extract email and password from the request body
        body = await request.json()
        email = body.get('email')
        password = body.get('password')

        if not email or not password:
            raise HTTPException(status_code=400, detail="Email and password are required")

        data = {
            'email': email,
            'password': password
        }

        response = requests.post(
            f'{supabase_url}/auth/v1/signup',
            headers={
                'Content-Type': 'application/json',
                'apikey': supabase_key,
                'Authorization': f'Bearer {supabase_key}'
            },
            json=data
        )

        if response.status_code == 200:
            return response.json()  # Return the response from Supabase
        else:
            raise HTTPException(status_code=response.status_code, detail=response.json())

    except Exception as e:
        logging.error(f"Sign-up error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class OAuthProvider(BaseModel):
    provider: str
    redirect_to: Optional[str] = None

@app.post("/auth/oauth")
async def oauth_signin(provider_data: OAuthProvider):
    try:
        provider = provider_data.provider
        redirect_to = provider_data.redirect_to or redirect_url

        if not provider:
            raise HTTPException(status_code=400, detail="Provider is required")

        # Request OAuth URL from Supabase
        response = requests.post(
            f'{supabase_url}/auth/v1/authorize',
            headers={
                'Content-Type': 'application/json',
                'apikey': supabase_key,
                'Authorization': f'Bearer {supabase_key}'
            },
            json={
                'provider': provider,
                'redirect_to': redirect_to
            }
        )

        if response.status_code == 200:
            data = response.json()
            # Return the OAuth URL that the frontend should redirect to
            return {"url": data.get("url")}
        else:
            raise HTTPException(status_code=response.status_code, detail=response.json())

    except Exception as e:
        logging.error(f"OAuth error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Optional: Callback endpoint to handle the OAuth redirect
@app.get("/auth/callback")
async def oauth_callback(code: str = None, error: str = None):
    if error:
        return {"error": error}

    if not code:
        return {"error": "No code provided"}

    try:
        # Exchange code for session
        response = requests.post(
            f'{supabase_url}/auth/v1/token',
            headers={
                'Content-Type': 'application/json',
                'apikey': supabase_key,
                'Authorization': f'Bearer {supabase_key}'
            },
            json={
                'grant_type': 'authorization_code',
                'code': code
            }
        )

        if response.status_code == 200:
            return response.json()
        else:
            return {"error": response.json()}

    except Exception as e:
        logging.error(f"OAuth callback error: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)