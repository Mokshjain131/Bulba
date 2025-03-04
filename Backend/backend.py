from fastapi import FastAPI, UploadFile, File, HTTPException
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

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
ELEVEN_LABS_API_KEY = os.getenv("ELEVEN_LABS_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
FIRECRAWL_API_KEY = os.getenv("FIRECRAWL_KEY")

# Configure Gemini
genai.configure(api_key=GOOGLE_API_KEY)
MODEL = genai.GenerativeModel(
    model_name="gemini-2.0-flash-exp",
    generation_config=None,
    system_instruction="""
    You are a Real Estate Communication Assistant, designed to analyze and process multilingual conversations between real estate agents and their clients. Your primary goal is to extract key information, provide summaries, perform translations, and assist in follow-up task generation.
    """
)

app = FastAPI()

# Eleven Labs API settings
ELEVEN_LABS_API_ENDPOINT = "https://api.elevenlabs.io/v1/transcribe"

transcription_result = None

# Supabase Client
supabase_client = supabase.create_client(SUPABASE_URL, SUPABASE_KEY)

# Firecrawl Client
firecrawl_client = firecrawl.Client(FIRECRAWL_API_KEY)

def chunk_text(text, chunk_size=500):
    """Chunks the text into smaller segments."""
    chunks = []
    for i in range(0, len(text), chunk_size):
        chunks.append(text[i:i + chunk_size])
    return chunks

def get_embedding(text):
    """Generates embeddings for the given text."""
    result = genai.embed_content(
        model="models/embedding-001",
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

    response = MODEL.generate_content(prompt)

    return {
        "query": query,
        "retrieved_chunks": retrieved_chunks,
        "response": response.text
    }

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
async def upload_audio(audio_file: UploadFile = File(...)):
    """Uploads an audio file, transcribes it, and stores embeddings."""
    global transcription_result
    try:
        # Save the audio file
        file_path = "recorded_audio.webm"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(audio_file.file, buffer)

        # Prepare for Eleven Labs API
        with open(file_path, "rb") as audio:
            headers = {
                "Authorization": f"Bearer {ELEVEN_LABS_API_KEY}",
                "Content-Type": "application/octet-stream"
            }
            response = requests.post(ELEVEN_LABS_API_ENDPOINT, headers=headers, data=audio.read())

        if response.status_code == 200:
            transcription_result = response.json()
            text = transcription_result["text"]

            # Chunk, embed, and store
            chunks = chunk_text(text)
            for chunk in chunks:
                embeddings = get_embedding(chunk)
                supabase_client.table("text_embeddings").insert({"text_chunk": chunk, "embeddings": embeddings}).execute()

            return {"filename": audio_file.filename, "message": "Transcription and embeddings stored successfully"}
        else:
            return {"filename": audio_file.filename, "error": f"Failed to transcribe audio: {response.status_code} - {response.text}"}

    except Exception as e:
        return {"filename": audio_file.filename, "error": f"An error occurred: {str(e)}"}

@app.post("/generate-response")
async def generate_response():
    """Generates a response based on the transcribed text."""
    global transcription_result
    if transcription_result is None:
        return {"error": "Transcription result not available"}

    text = transcription_result["text"]
    prompt = text + "this is the talk between a client and a real estate agent give me bullet points of the key points of the conversation"
    response = MODEL.generate_content(prompt)

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
    """Scrapes real estate websites based on bullet points."""
    try:
        # Use Gemini to extract location and property type from bullet points
        prompt = f"From the following bullet points: '{firecrawl_request.bullet_points}', extract the location and property type."
        location_property_response = MODEL.generate_content(prompt)
        location_property_text = location_property_response.text
        # Parse the location and property type from the response. This part needs robust parsing.
        # Example: "Location: New York, Property Type: Apartment"
        location = "New York" #Replace with better parsing.
        property_type="Apartment" #Replace with better parsing.

        # Use Firecrawl to scrape properties
        results = firecrawl_client.search(
            query=f"{property_type} in {location}",
            category="real_estate"
        )
        return results

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during Firecrawl: {str(e)}")
    
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)