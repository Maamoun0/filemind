"""
fileMind Backend — Tools Router (Upload, Status, Download)
Direct port from Express routes/tools.ts → FastAPI
"""
import os
import uuid
import aiofiles
from datetime import datetime, timedelta
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse

from ..models.schemas import ToolType, JobStatus, JobResponse
from ..security.magic_validator import validate_file_magic
from ..services.database import get_db_pool
from ..services.queue import add_job_to_queue
from ..config import get_settings

router = APIRouter(prefix="/api/tools", tags=["Tools"])


@router.post("/upload", response_model=JobResponse, status_code=202)
async def upload_file(
    file: UploadFile = File(...),
    toolType: str = Form(...),
):
    """
    Upload a file for processing.
    1. Validates magic bytes (Blue Team security)
    2. Creates a job record in Postgres
    3. Queues the job for the Node.js worker via BullMQ-compatible Redis push
    """
    settings = get_settings()
    
    # Parse and validate tool type
    try:
        tool_type = ToolType(toolType)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid tool type: '{toolType}'")
    
    # ── BLUE TEAM: Magic Bytes Validation ──
    file_content = await validate_file_magic(file, tool_type)
    file_size = len(file_content)
    
    # Generate unique job ID
    job_id = str(uuid.uuid4())
    
    # Save file to temp directory
    temp_dir = Path(settings.TEMP_DIR)
    upload_dir = temp_dir / "uploads" / job_id
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    # Preserve original extension
    original_name = file.filename or "upload"
    ext = Path(original_name).suffix.lower()
    file_path = upload_dir / f"source{ext}"
    
    async with aiofiles.open(file_path, "wb") as f:
        await f.write(file_content)
    
    # Calculate expiry (Zero Permanent Storage: 1 hour)
    delete_at = datetime.utcnow() + timedelta(hours=settings.FILE_EXPIRY_HOURS)
    
    # Insert job record into Postgres
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        await conn.execute(
            """INSERT INTO jobs (id, tool_type, status, file_size, delete_at) 
               VALUES ($1, $2, $3, $4, $5)""",
            uuid.UUID(job_id), tool_type.value, JobStatus.PENDING.value, file_size, delete_at
        )
    
    # Queue for the BullMQ worker
    await add_job_to_queue(job_id, tool_type.value, str(file_path), original_name)
    
    print(f"[fileMind-API] Job {job_id} created → {tool_type.value} ({file_size} bytes)")
    
    return JobResponse(
        job_id=job_id,
        status=JobStatus.PENDING,
        message="File uploaded and queued for processing successfully.",
        expires_at=delete_at,
    )


@router.get("/status/{job_id}", response_model=dict)
async def check_job_status(job_id: str):
    """Check the status of a processing job, including AI Double-Check review info."""
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """SELECT id, status, tool_type, error_message, created_at, delete_at,
                      review_status, review_confidence, review_notes, revisions_applied
               FROM jobs WHERE id = $1""",
            uuid.UUID(job_id)
        )
    
    if not row:
        raise HTTPException(status_code=404, detail="Job not found or already deleted.")
    
    response = {
        "jobId": str(row["id"]),
        "status": row["status"],
        "toolType": row["tool_type"],
        "errorMessage": row["error_message"],
        "createdAt": row["created_at"].isoformat() if row["created_at"] else None,
        "expiresAt": row["delete_at"].isoformat() if row["delete_at"] else None,
    }

    # Include AI Double-Check review info if available
    if row["review_status"]:
        response["reviewInfo"] = {
            "verdict": row["review_status"],
            "confidence": float(row["review_confidence"]) if row["review_confidence"] else None,
            "reviewerNotes": row["review_notes"],
            "revisionsApplied": row["revisions_applied"] or 0,
        }

    return response


@router.get("/download/{job_id}")
async def download_result(job_id: str):
    """Download the processed output file for a completed job."""
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """SELECT id, status, tool_type FROM jobs WHERE id = $1""",
            uuid.UUID(job_id)
        )
    
    if not row:
        raise HTTPException(status_code=404, detail="Job not found or already deleted.")
    
    if row["status"] != JobStatus.COMPLETED.value:
        raise HTTPException(status_code=400, detail="Job is not completed yet.")
    
    settings = get_settings()
    output_dir = Path(settings.TEMP_DIR) / "outputs" / job_id
    
    if not output_dir.exists():
        raise HTTPException(status_code=404, detail="Output files not found or have been cleaned up.")
    
    files = list(output_dir.iterdir())
    if not files:
        raise HTTPException(status_code=404, detail="Result file is missing.")
    
    result_file = files[0]
    return FileResponse(
        path=str(result_file),
        filename=f"fileMind_Result_{result_file.name}",
        media_type="application/octet-stream",
    )
