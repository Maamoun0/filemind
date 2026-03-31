import os, uuid, aiofiles
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

@router.post("/upload", response_model=JobResponse, status_code=202)
async def upload_file(
    file: UploadFile = File(...),
    toolType: str = Form(...),
    clientExtractedText: Optional[str] = Form(None),
):
    settings = get_settings()
    try:
        tool_enum = ToolType(toolType)
    except ValueError:
        raise HTTPException(400, detail="Invalid tool type")
        
    file_content = await file.read()
    validate_file_magic(file_content, file.filename)
    
    job_id = str(uuid.uuid4())
    temp_dir = Path("/tmp")
    upload_dir = temp_dir / "uploads" / job_id
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    file_ext = Path(file.filename or "upload").suffix
    file_path = upload_dir / f"source{file_ext}"
    
    async with aiofiles.open(file_path, "wb") as f:
        await f.write(file_content)
        
    delete_at = datetime.utcnow() + timedelta(hours=24)
    # await add_job_to_queue(job_id, tool_enum.value, str(file_path), file.filename or "upload")
    
    return JobResponse(
        job_id=job_id, 
        status=JobStatus.PENDING, 
        message="Queued.", 
        expires_at=delete_at
    )

@router.get("/status/{job_id}", response_model=JobStatusResponse)
async def check_job_status(job_id: str):
    pool = await get_db_pool()
    if pool == "MOCK":
        return JobStatusResponse(
            job_id=job_id,
            status=JobStatus.COMPLETED,
            tool_type="MOCK",
            created_at=datetime.utcnow(),
            expires_at=datetime.utcnow() + timedelta(hours=1)
        )
        
    async with pool.acquire() as conn:
        try:
            row = await conn.fetchrow(
                "SELECT id, status, tool_type, delete_at FROM jobs WHERE id = $1", 
                uuid.UUID(job_id)
            )
        except Exception:
            raise HTTPException(400, detail="Invalid job ID format")
            
        if not row:
            raise HTTPException(404, detail="Job not found")
            
        return JobStatusResponse(
            job_id=str(row["id"]),
            status=row["status"],
            tool_type=row["tool_type"],
            created_at=datetime.utcnow(),
            expires_at=row["delete_at"]
        )

@router.get("/download/{job_id}")
async def download_result(job_id: str):
    base_temp = Path("/tmp")
    output_dir = base_temp / "outputs" / job_id
    
    if output_dir.exists():
        files = list(output_dir.iterdir())
        if files:
            result_file = files[0]
            return FileResponse(
                path=str(result_file), 
                filename=f"result_{result_file.name}"
            )
            
    raise HTTPException(404, detail="Result file not found")
