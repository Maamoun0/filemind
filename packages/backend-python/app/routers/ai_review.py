"""
fileMind Backend — AI Double-Check Router
Internal API endpoint for triggering and querying AI reviews.
"""
import uuid
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from ..models.schemas import JobStatus, DoubleCheckResult, ReviewVerdict
from ..services.ai_double_check import double_check_engine
from ..services.database import get_db_pool
from ..services.cache import cleanup_expired_cache

router = APIRouter(prefix="/api/ai-review", tags=["AI Double-Check"])


class TriggerReviewRequest(BaseModel):
    job_id: str
    tool_type: str
    output_content: Optional[str] = None
    original_name: str = "unknown"


@router.post("/trigger", response_model=DoubleCheckResult)
async def trigger_double_check(request: TriggerReviewRequest):
    """
    Trigger AI Double-Check review for a specific job.
    This endpoint is called internally by the Node.js worker.
    """
    # Verify job exists and is in a valid state for review
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT id, status, tool_type FROM jobs WHERE id = $1",
            uuid.UUID(request.job_id)
        )

    if not row:
        raise HTTPException(status_code=404, detail="Job not found")

    # Update status to REVIEWING
    async with pool.acquire() as conn:
        await conn.execute(
            "UPDATE jobs SET status = $1 WHERE id = $2",
            JobStatus.REVIEWING.value, uuid.UUID(request.job_id)
        )

    # Run the double-check engine
    try:
        result = await double_check_engine.run_double_check(
            job_id=request.job_id,
            tool_type=request.tool_type,
            output_content=request.output_content,
            original_name=request.original_name,
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI Double-Check failed: {str(e)}"
        )


@router.get("/status/{job_id}")
async def get_review_status(job_id: str):
    """Get the AI Double-Check review status for a specific job."""
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """SELECT id, review_status, review_confidence, review_notes, revisions_applied
               FROM jobs WHERE id = $1""",
            uuid.UUID(job_id)
        )

    if not row:
        raise HTTPException(status_code=404, detail="Job not found")

    if not row["review_status"]:
        return {"jobId": str(row["id"]), "reviewStatus": "not_started"}

    return {
        "jobId": str(row["id"]),
        "reviewStatus": row["review_status"],
        "confidence": float(row["review_confidence"]) if row["review_confidence"] else None,
        "reviewNotes": row["review_notes"],
        "revisionsApplied": row["revisions_applied"] or 0,
    }


@router.post("/cache/cleanup")
async def trigger_cache_cleanup():
    """Manually trigger cleanup of expired cache entries."""
    deleted = await cleanup_expired_cache()
    return {"deleted": deleted, "message": f"Cleaned up {deleted} expired cache entries"}
