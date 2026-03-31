from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter(prefix="/ai-review", tags=["ai-review"])

class ReviewRequest(BaseModel):
    text: str
    criteria: List[str]

@router.post("/analyze")
async def analyze_text(request: ReviewRequest):
    try:
        return {
            "analysis": "Text analyzed successfully",
            "score": 0.95,
            "suggestions": [f"Reviewing for {c}" for c in request.criteria]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))