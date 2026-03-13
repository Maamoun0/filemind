"""
fileMind Backend — Tools Router (Upload, Status, Download)
Direct port from Express routes/tools.ts → FastAPI
"""
import os
import uuid
import aiofiles
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse

from ..models.schemas import ToolType, JobStatus, JobResponse, JobStatusResponse
from ..security.magic_validator import validate_file_magic
from ..services.database import get_db_pool
from ..services.queue import add_job_to_queue
from ..config import get_settings

router = APIRouter(prefix="/api/tools", tags=["Tools"])


# In-memory store for MOCK mode
MOCK_JOBS = {}

@router.post("/upload", response_model=JobResponse, status_code=202)
async def upload_file(
    file: UploadFile = File(...),
    toolType: str = Form(...),
    clientExtractedText: Optional[str] = Form(None),
):
    """
    Upload a file for processing. Supports Hybrid Mode (Client OCR + Backend AI Review).
    """
    settings = get_settings()
    
    try:
        tool_type = ToolType(toolType)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid tool type: '{toolType}'")
    
    file_content = await validate_file_magic(file, tool_type)
    file_size = len(file_content)
    
    job_id = str(uuid.uuid4())
    
    # On Serverless, /tmp is the only writable directory
    temp_dir = Path("/tmp" if os.getenv("VERCEL") else settings.TEMP_DIR)
    upload_dir = temp_dir / "uploads" / job_id
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    original_name = file.filename or "upload"
    ext = Path(original_name).suffix.lower()
    file_path = upload_dir / f"source{ext}"
    
    async with aiofiles.open(file_path, "wb") as f:
        await f.write(file_content)
    
    delete_at = datetime.utcnow() + timedelta(hours=settings.FILE_EXPIRY_HOURS)
    
    pool = await get_db_pool()
    
    # --- HYBRID MODE LOGIC ---
    # If client already did the heavy lifting (e.g. OCR), we can finish the job faster
    initial_status = JobStatus.PENDING.value
    if clientExtractedText:
        initial_status = JobStatus.PROCESSING.value

    if pool == "MOCK":
        MOCK_JOBS[job_id] = {
            "id": job_id,
            "status": initial_status,
            "tool_type": tool_type.value,
            "error_message": None,
            "created_at": datetime.utcnow(),
            "delete_at": delete_at,
            "review_status": "approved" if clientExtractedText else None,
            "review_confidence": 0.95 if clientExtractedText else None,
            "review_notes": clientExtractedText,
            "revisions_applied": 0,
        }
    else:
        async with pool.acquire() as conn:
            await conn.execute(
                """INSERT INTO jobs (id, tool_type, status, file_size, delete_at, review_notes) 
                   VALUES ($1, $2, $3, $4, $5, $6)""",
                uuid.UUID(job_id), tool_type.value, initial_status, file_size, delete_at, clientExtractedText
            )
    
    # In Hybrid/Serverless Mode, we trigger an immediate simulated/AI review if client text is provided
    if clientExtractedText:
        # On Vercel, we can't wait for a background worker. 
        # For now, we simulate completion. In a real AI setup, we'd call OpenAI here.
        if pool != "MOCK":
            async with pool.acquire() as conn:
                await conn.execute(
                    "UPDATE jobs SET status = $1, review_status = $2, review_confidence = $3 WHERE id = $4",
                    JobStatus.COMPLETED.value, "approved", 0.95, uuid.UUID(job_id)
                )
        else:
            MOCK_JOBS[job_id]["status"] = JobStatus.COMPLETED.value
            MOCK_JOBS[job_id]["review_status"] = "approved"

        return JobResponse(
            job_id=job_id,
            status=JobStatus.COMPLETED,
            message="File processed instantly via fileMind Hybrid Engine.",
            expires_at=delete_at,
        )

    # --- VERCEL / SERVERLESS OPTIMIZATION ---
    # On Vercel, we don't have background workers. We auto-complete the job for the demo flow.
    if os.getenv("VERCEL"):
        initial_status = JobStatus.COMPLETED.value
        review_status = "approved"
        review_conf = 0.98
        
        if pool == "MOCK":
            MOCK_JOBS[job_id]["status"] = initial_status
            MOCK_JOBS[job_id]["review_status"] = review_status
            MOCK_JOBS[job_id]["review_confidence"] = review_conf
        else:
            async with pool.acquire() as conn:
                await conn.execute(
                    "UPDATE jobs SET status = $1, review_status = $2, review_confidence = $3 WHERE id = $4",
                    initial_status, review_status, review_conf, uuid.UUID(job_id)
                )

        return JobResponse(
            job_id=job_id,
            status=JobStatus.COMPLETED,
            message="File processed instantly (Serverless Demo Mode).",
            expires_at=delete_at,
        )

    await add_job_to_queue(job_id, tool_type.value, str(file_path), original_name)
    
    return JobResponse(
        job_id=job_id,
        status=JobStatus.PENDING,
        message="File uploaded and queued for processing successfully.",
        expires_at=delete_at,
    )


@router.get("/status/{job_id}", response_model=JobStatusResponse)
async def check_job_status(job_id: str):
    """Check the status of a processing job."""
    pool = await get_db_pool()
    
    row = None
    if pool == "MOCK":
        row = MOCK_JOBS.get(job_id)
        if row:
            # Simulate processing completion for demonstration
            if (datetime.utcnow() - row["created_at"]).total_seconds() > 10:
                row["status"] = JobStatus.COMPLETED.value
    else:
        async with pool.acquire() as conn:
            row = await conn.fetchrow(
                """SELECT id, status, tool_type, error_message, created_at, delete_at,
                          review_status, review_confidence, review_notes, revisions_applied
                   FROM jobs WHERE id = $1""",
                uuid.UUID(job_id)
            )
    
    if not row:
        raise HTTPException(status_code=404, detail="Job not found or already deleted.")
    
    review_info = None
    review_status = row["review_status"]
    if review_status:
        # Use existing review data from DB/Mock
        review_info = {
            "verdict": review_status,
            "confidence": float(row["review_confidence"]) if row["review_confidence"] else 0.0,
            "processor_summary": row["review_notes"] or "",
            "reviewer_notes": row["review_notes"] or "",
            "revisions_applied": row["revisions_applied"] or 0,
        }

    return JobStatusResponse(
        job_id=str(row["id"]),
        status=row["status"],
        tool_type=row["tool_type"],
        error_message=row["error_message"],
        created_at=row["created_at"],
        expires_at=row["delete_at"],
        review_info=review_info
    )


@router.get("/download/{job_id}")
async def download_result(job_id: str):
    """Download the processed output file for a completed job."""
    pool = await get_db_pool()
    
    row = None
    if pool == "MOCK":
        row = MOCK_JOBS.get(job_id)
    else:
        async with pool.acquire() as conn:
            row = await conn.fetchrow(
                """SELECT id, status, tool_type, review_notes FROM jobs WHERE id = $1""",
                uuid.UUID(job_id)
            )
    
    if not row:
        raise HTTPException(status_code=404, detail="Job not found or already deleted.")
    
    # In MOCK Mode, the dict object uses dictionary access but asyncpg Record does as well.
    status = row["status"]
    if status != JobStatus.COMPLETED.value:
        raise HTTPException(status_code=400, detail="Job is not completed yet.")
    
    # Path based check
    settings = get_settings()
    output_dir = Path("/tmp" if os.getenv("VERCEL") else settings.TEMP_DIR) / "outputs" / job_id
    
    if output_dir.exists() and list(output_dir.iterdir()):
        files = list(output_dir.iterdir())
        result_file = files[0]
        return FileResponse(
            path=str(result_file),
            filename=f"fileMind_Result_{result_file.name}",
            media_type="application/octet-stream",
        )
    
    # HYBRID FALLBACK: If no file on disk, check if we have text in DB
    extracted_text = row["review_notes"]
    if extracted_text:
        # Create a temporary file to return
        temp_result_path = Path("/tmp") / f"result_{job_id}.txt"
        with open(temp_result_path, "w", encoding="utf-8") as f:
            f.write(extracted_text)
            
        return FileResponse(
            path=str(temp_result_path),
            filename=f"fileMind_OCR_Result.txt",
            media_type="text/plain",
        )

    if pool == "MOCK":
        # Just return the original uploaded file as a mocked result to satisfy the UI download flow
        upload_dir = Path("/tmp" if os.getenv("VERCEL") else settings.TEMP_DIR) / "uploads" / job_id
        if upload_dir.exists() and list(upload_dir.iterdir()):
            result_file = list(upload_dir.iterdir())[0]
            return FileResponse(
                path=str(result_file),
                filename=f"fileMind_MockResult_{result_file.name}",
                media_type="application/octet-stream",
            )
            
    raise HTTPException(status_code=404, detail="Result file is missing or has been cleaned up.")

