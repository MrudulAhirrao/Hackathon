from fastapi import APIRouter, HTTPException
from schemas.paper import PaperRequest
from services.generator import generate_paper_with_llama
import traceback

router = APIRouter()

@router.post("/generate-paper/")
async def generate_paper(request: PaperRequest):
    try:
        print(f"🚀 Received request: {request.topic}, {request.paper_type}, {request.paper_format}")
        
        # Validate request
        if not request.topic.strip():
            raise HTTPException(status_code=400, detail="Topic cannot be empty")
        if len(request.topic.strip()) < 10:
            raise HTTPException(status_code=400, detail="Topic must be at least 10 characters long")
        
        generated = await generate_paper_with_llama(
            topic=request.topic,
            paper_type=request.paper_type,
            paper_format=request.paper_format
        )
        
        # Validate generated content
        if not generated or not any(generated.values()):
            raise HTTPException(status_code=500, detail="Failed to generate paper content")
        
        print("✅ Paper generated successfully")
        return {"paper": generated, "status": "success"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error in generate_paper: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to generate paper: {str(e)}")

# Test endpoint
@router.get("/test")
async def test_endpoint():
    return {"message": "Generate router is working", "status": "ok"}