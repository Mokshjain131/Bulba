from fastapi import FastAPI, HTTPException, Request, Response, Depends
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import os
from dotenv import load_dotenv
import uvicorn
import asyncio
import requests
from supabase import create_client, Client
from firecrawl import FirecrawlApp
import logging
from typing import List, Dict, Optional
import numpy as np
import json
import faiss
from pydantic import BaseModel
from agno.agent import Agent
from agno.models.google import Gemini
from agno.tools.duckduckgo import DuckDuckGoTools
import pandas as pd
import numpy as np

load_dotenv()
google_api_key = os.getenv("GOOGLE_API_KEY")

genai.configure(api_key=google_api_key)
genai_model = genai.GenerativeModel('gemini-2.0-flash')

def generate_random_documents(num_docs = 100):
    topics = ["Technology", "Science", "History", "Art", "Business"]
    documents = []

    for i in range(num_docs):
        topic = np.random.choice(topics)
        content = f"This is document {i} about {topic}. "
        content += f"It contains random information related to {topic}. "
        content += f"You can use this document to test your RAG system."

        documents.append({
            "content": content,
            "metadata": {"id": i, "topic": topic}
        })

    return documents

documents = generate_random_documents()

def get_embedding(text):
    result = genai.embed_content(
        model="models/embedding-001",
        content=text,
        task_type="retrieval_query"
    )
    return result['embedding']

document_texts = [doc["content"] for doc in documents]
document_embeddings = np.array([get_embedding(text) for text in document_texts])

document_embeddings = document_embeddings / np.linalg.norm(document_embeddings, axis = 1, keepdims = True)

dimension = len(document_embeddings[0])
index = faiss.IndexFlatIP(dimension)
index.add(document_embeddings)

def retrieve_documents(query, k=3):
    # Get query embedding
    query_embedding = get_embedding(query)
    query_embedding = np.array([query_embedding])

    # Normalize query embedding
    query_embedding = query_embedding / np.linalg.norm(query_embedding)

    # Search in the index
    scores, indices = index.search(query_embedding, k)

    # Return the top k documents
    results = []
    for i, idx in enumerate(indices[0]):
        results.append({
            "content": documents[idx]["content"],
            "metadata": documents[idx]["metadata"],
            "score": scores[0][i]
        })

    return results

def generate_rag_response(query):
    # Retrieve relevant documents
    retrieved_docs = retrieve_documents(query, k=3)

    # Format context from retrieved documents
    context = "\n\n".join([doc["content"] for doc in retrieved_docs])

    # Create prompt with context
    prompt = f"""
    Context information:
    {context}

    Based on the context information, please answer the following question:
    {query}

    If the context doesn't contain relevant information, please say so.
    """

    response = genai_model.generate_content(prompt)

    return {
        "query": query,
        "retrieved_documents": retrieved_docs,
        "response": response.text
    }

# Example query
result = generate_rag_response("Tell me about technology")
print("Query:", result["query"])
print("\nResponse:", result["response"])
print("\nRetrieved Documents:")
for i, doc in enumerate(result["retrieved_documents"]):
    print(f"{i+1}. {doc['content']} (Score: {doc['score']:.4f})")

# Test with multiple questions
test_questions = [
    "What information do you have about Science?",
    "Tell me something about History",
    "What business topics are covered?"
]

for question in test_questions:
    print("\n" + "="*50)
    result = generate_rag_response(question)
    print(f"Question: {question}")
    print(f"Response: {result['response']}")

google_api_key = os.getenv("GOOGLE_API_KEY")

agent = Agent(
    name="basic",
    model=Gemini(id="gemini-2.0-flash", api_key=google_api_key),
    description="agent which answers a question.",
    tools=[DuckDuckGoTools()],
    show_tool_calls=True
    # instructions=[
    #     'Search your knowledge base for the answer.',
    #     'If you cannot find the answer, say "I do not know."',
    # ],
)

agent.print_response("what is the capital of France? and what is its latest news?", stream=True)

# Boilerplate. Load envs, load fastapi app, firecrawl, and configure gemini, supabase
app = FastAPI()

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

fcapp = FirecrawlApp(api_key=os.getenv("FIRECRAWL_KEY"))
genai.configure(api_key=os.getenv("GEMINI_KEY"))
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")
supabase_secret = os.getenv("SUPABASE_SECRET_KEY")
supabase_pass = os.getenv("SUPABASE_PASS")
redirect_url = os.getenv("REDIRECT_URL")
supabase_jwt_secret = os.getenv("JWT_SECRET")
supabase: Client = create_client(supabase_url, supabase_key)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
# 2024-03-20 10:30:45,123 - INFO - Successfully generated summary
# 2024-03-20 10:30:46,456 - ERROR - Failed to fetch content from URL

@app.get("/status/")
async def status():
    return {"status":"ok"}

generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain"
}

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash-exp",  # Using experimental model for best results. Use 1.5 flash if this ever goes out of public access
    generation_config=generation_config,
    system_instruction= """ ONLY PRINT THE RESPONSE KEY NOT THE WHOLE JSON IN EVERY RESPONSE.You are a highly intelligent, multilingual AI real estate assistant, designed to help agents and clients communicate effortlessly. Your primary goals are to break language barriers, capture key client preferences, provide instant insights, and streamline real estate negotiations. You deliver professional, accurate, and friendly responses while ensuring no critical details are overlooked. Always prioritize clarity, efficiency, and responsiveness to enhance the real estate experience.1. Multilingual Client Communication
"Automatically detect and respond in the client’s preferred language. Ensure that translations are accurate, natural, and contextually appropriate for real estate discussions. Adapt communication style based on formality, cultural considerations, and local real estate terminology."

2. Client Preference Capture & Retention
"Actively listen and remember key client preferences such as budget, property type, location, amenities, and deal-breakers. Ensure all responses and property recommendations align with the client's expressed needs. Retrieve past conversations to maintain personalized interactions."

3. Instant Market Insights & Property Matching
"Analyze real estate market trends and property listings in real time. Provide comparative insights, pricing recommendations, and property suggestions based on the client’s needs and preferences. Highlight unique selling points for each property."

4. Negotiation & Deal Assistance
"Support agents in negotiations by summarizing client interests, providing pricing insights, and suggesting persuasive talking points. Offer quick access to key details such as contract terms, financing options, and competitor property pricing."

5. Follow-ups & Lead Nurturing
"Ensure no opportunity is lost by proactively suggesting follow-ups, reminders, and automated messages. Help agents maintain strong relationships by providing personalized follow-up messages and tracking client interest over time."
ONLY PRINT THE RESPONSE KEY NOT THE WHOLE JSON IN EVERY RESPONSE.
ONLY PRINT THE RESPONSE KEY NOT THE WHOLE JSON IN EVERY RESPONSE.
ONLY PRINT THE RESPONSE KEY NOT THE WHOLE JSON IN EVERY RESPONSE.
ONLY PRINT THE RESPONSE KEY NOT THE WHOLE JSON IN EVERY RESPONSE.
ONLY PRINT THE RESPONSE KEY NOT THE WHOLE JSON IN EVERY RESPONSE.
ONLY PRINT THE RESPONSE KEY NOT THE WHOLE JSON IN EVERY RESPONSE.
ONLY PRINT THE RESPONSE KEY NOT THE WHOLE JSON IN EVERY RESPONSE.
ONLY PRINT THE RESPONSE KEY NOT THE WHOLE JSON IN EVERY RESPONSE.
ONLY PRINT THE RESPONSE KEY NOT THE WHOLE JSON IN EVERY RESPONSE.
ONLY PRINT THE RESPONSE KEY NOT THE WHOLE JSON IN EVERY RESPONSE.
6. Smart Scheduling & Task Automation
"Assist in scheduling property visits, setting reminders for follow-ups, and automating key tasks like document management and appointment confirmations. Ensure agents can focus on closing deals rather than administrative work.
these are some samples conversations: Multilingual Client Communication
Q: A client speaks in a mix of Hindi and English. How should I respond?
A: Detect the mixed-language input and respond naturally in the same language blend while ensuring clarity.

Q: A client asks about a property in Telugu, but the agent only understands English. What should I do?
A: Translate the client's query into English for the agent and provide an English response. Also, give the option to send the Telugu translation back to the client.

Q: A client says, "Mujhe ek accha gated society chahiye, jo affordable ho." What does this mean?
A: The client is looking for an affordable gated community. Respond with suitable property suggestions while maintaining the preferred language.

Client Preference Capture & Retention
Q: A client mentioned their budget once but didn’t repeat it in later messages. Should I remember it?
A: Yes, retain and refer to previous budget details when suggesting properties unless the client updates their preference.

Q: How do I capture a client’s interest in a specific location?
A: If a client mentions interest in a location, store it and prioritize properties from that area in future recommendations.

Q: The client said, “I want a house near my kid’s school.” What information should I extract?
A: Identify the school’s location and filter properties within a suitable distance.

Instant Market Insights & Property Matching
Q: A client asks, "What’s the average price for a 2BHK in Bandra?" What should I do?
A: Provide the latest market price range for 2BHK properties in Bandra, along with key insights on price trends.

Q: How should I recommend a property?
A: Suggest properties based on budget, location, and preferences while highlighting unique features (e.g., “This apartment has a sea view and falls within your budget”).

Q: The client says, "Mujhe ek achha 3BHK chahiye but price high lag raha hai." How should I respond?
A: Acknowledge their concern and suggest nearby alternatives or negotiate pricing insights.

Negotiation & Deal Assistance
Q: A client is hesitant about pricing. How can I assist?
A: Provide comparative market analysis and highlight negotiation points to help the agent close the deal.

Q: The client wants to negotiate but is unsure how. What should I suggest?
A: Offer insights on average price reductions in the area and guide the agent on potential counteroffers.

Q: The client asks, "Can I get a better deal on this property?" What should I do?
A: Check recent price drops or seller flexibility and provide negotiation strategies.

Follow-ups & Lead Nurturing
Q: How do I ensure follow-ups are not missed?
A: Set automated reminders and suggest personalized messages based on past conversations.

Q: A client showed interest last week but didn’t respond since. What should I do?
A: Recommend a polite follow-up message, possibly with updated listings matching their preferences.

Q: A client says, "I'll think about it." How should I respond?
A: Offer additional information, such as market trends or limited-time offers, to encourage a decision.""""
)

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

@app.post("/pitch/generate/")
async def generate_pitch(request: Request):
    try:
        data = await request.json()
        business_info = data.get("business_info")

        if not business_info:
            raise HTTPException(status_code=400, detail="Business info required")

        prompt = f"""Generate a compelling pitch deck outline for the following business, the response should be 150 words or less dont exceed that limit, MAKE SURE THE RESPONSE IS 150 WORDS OR LESSER, IT CANNOT EXCEED 150 WORDS AT ALL IT IS ABSOLUTELY IMPORTANT THAT IT IS LESS THAN 150 WORDS:
        {business_info}

        Include the following sections:
        1. Problem Statement
        2. Solution
        3. Market Opportunity
        4. Business Model
        5. Financial Projections

        (the response should be 150 words or less) dont exceed that limit
        don't mention keeping it under 150 words in the response
        """

        response = model.generate_content(prompt)
        pitch_content = response.text

        return {
            "success": True,
            "pitch": pitch_content,
            "pitch_id": "temp-id-123"  # You might want to generate a unique ID here
        }
    except Exception as e:
        logging.error(f"Pitch generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/validate_idea/")
async def validate_idea(request: Request):
    try:
        data = await request.json()
        logging.info(f"Received data: {data}")  # Log the incoming request data
        idea = data.get("idea")

        if not idea:
            raise HTTPException(status_code=400, detail="Business idea is required")

        # Generate validation response using Gemini
        prompt = f"Validate the following idea: '{idea}'. Provide insights on feasibility, competition, and potential demand."
        response = model.generate_content(prompt)
        analysis = response.text  # Get the validation analysis from Gemini

        return {
            "success": True,
            "analysis": analysis,
        }
    except Exception as e:
        logging.error(f"Idea validation error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/pitch/review/")
async def review_pitch(request: Request):
    try:
        data = await request.json()
        pitch_content = data.get("pitch_content")

        if not pitch_content:
            raise HTTPException(status_code=400, detail="Pitch content required")

        # Generate review for the pitch
        prompt = f"Review and provide detailed feedback on this pitch: {pitch_content} MAKE SURE THE RESPONSE IS 200 WORDS OR LESSER, IT CANNOT EXCEED 200 WORDS AT ALL IT IS ABSOLUTELY IMPORTANT THAT IT IS LESS THAN 200 WORDS don't mention keeping it under 200 words in the response"
        response = model.generate_content(prompt)
        review = response.text

        return {
            "success": True,
            "review": review,
        }
    except Exception as e:
        logging.error(f"Pitch review error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/match_investors/")
async def match_investors(request: Request):
    try:
        data = await request.json()
        pitch_content = data.get("pitch_content")

        if not pitch_content:
            raise HTTPException(status_code=400, detail="Pitch content required")

        # Generate investor matchmaking tips based on the pitch
        prompt = f"Based on this pitch content: {pitch_content}, suggest ideal investors including their industry focus, investment stage, typical check size, geographic preferences, and key value-adds needed. (the response should be 200 words or less) dont exceed that limit,MAKE SURE THE RESPONSE IS 200 WORDS OR LESSER, IT CANNOT EXCEED 200 WORDS AT ALL IT IS ABSOLUTELY IMPORTANT THAT IT IS LESS THAN 200 WORDS don't mention keeping it under 200 words in the response"
        response = model.generate_content(prompt)
        matching_criteria = response.text

        return {
            "success": True,
            "matching_criteria": matching_criteria,
        }
    except Exception as e:
        logging.error(f"Investor matching error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/strategic_advice/")
async def get_strategic_advice(request: Request):
    try:
        data = await request.json()
        business_idea = data.get("business_idea")

        if not business_idea:
            raise HTTPException(status_code=400, detail="Business idea required")

        # Generate strategic advice using Gemini
        prompt = f"Provide tailored strategic advice for the business idea '{business_idea}'."
        response = model.generate_content(prompt)
        advice = response.text

        return {
            "success": True,
            "advice": advice,
        }
    except Exception as e:
        logging.error(f"Strategic advice error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/scaling/")
async def get_scaling_advice(request: Request):
    try:
        data = await request.json()
        business_idea = data.get("business_idea")

        if not business_idea:
            raise HTTPException(status_code=400, detail="Business idea required")

        # Generate scaling advice using Gemini
        prompt = f"Provide a detailed scaling plan for the business idea '{business_idea}'."
        response = model.generate_content(prompt)
        scaling_plan = response.text

        return {
            "success": True,
            "scaling_plan": scaling_plan,
        }
    except Exception as e:
        logging.error(f"Scaling advice error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)