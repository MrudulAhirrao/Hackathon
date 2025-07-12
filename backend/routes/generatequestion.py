
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import aiohttp
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")  # store this in .env

class JobRequest(BaseModel):
    job_title: str

class QuestionResponse(BaseModel):
    questions: list[str]

@router.post("/generate-questions", response_model=QuestionResponse, tags=["Interview AI"])
async def generate_interview_questions(payload: JobRequest):
    if not payload.job_title:
        raise HTTPException(status_code=400, detail="Job title is required.")

    prompt = f"""
    Generate 5 diverse interview questions for the job role: {payload.job_title}.
    Include technical, behavioral, and situational questions.
    Return them as a list.
    """

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }

    body = {
        "model": "google/gemma-2-9b-it:free",  # OpenRouter Gemini free model
        "messages": [{"role": "user", "content": prompt}],
    }

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=body) as response:
                data = await response.json()
                content = data.get("choices", [{}])[0].get("message", {}).get("content", "")

                # Clean and split into question list
                questions = [q.strip(" -•\n") for q in content.split("\n") if len(q.strip()) > 10]

                if not questions:
                    raise ValueError("No valid questions returned from model")

                return {"questions": questions}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")
