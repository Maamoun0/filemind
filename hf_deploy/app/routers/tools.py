import uuid, aiofiles
from datetime import datetime, timedelta
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from ..models.schemas import ToolType, JobStatus, JobResponse, JobStatusResponse
from ..services.database import get_db_pool
from ..services.pdf_service import process_pdf_to_word

router = APIRouter(prefix="/api/tools", tags=["Tools"])

# Simple In-memory Job Store for MOCK mode
job_store = {}

@router.post("/upload", response_model=JobResponse, status_code=202)
async def upload_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    toolType: str = Form(...),
):
    try:
        tool_enum = ToolType(toolType)
    except ValueError:
        raise HTTPException(400, detail="Invalid tool type")
        
    job_id = str(uuid.uuid4())
    temp_dir = Path("/tmp")
    upload_path = temp_dir / "uploads" / job_id / f"original{Path(file.filename or '').suffix}"
    output_path = temp_dir / "outputs" / job_id / f"{Path(file.filename or '').stem}.docx"
    
    upload_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Write file to persistent tmp storage
    file_content = await file.read()
    async with aiofiles.open(upload_path, "wb") as f:
        await f.write(file_content)
        
    # Store initial status
    job_store[job_id] = {
        "status": JobStatus.PROCESSING,
        "tool_type": tool_enum,
        "created_at": datetime.utcnow()
    }
    
    # Task to run conversion
    async def run_conversion():
        try:
            if tool_enum == ToolType.PDF_TO_WORD:
                await process_pdf_to_word(job_id, str(upload_path), str(output_path))
                job_store[job_id]["status"] = JobStatus.COMPLETED
            else:
                # Other tools still mock for now
                job_store[job_id]["status"] = JobStatus.FAILED
        except Exception as e:
            job_store[job_id]["status"] = JobStatus.FAILED
            print(f"[fileMind-Engine] Job {job_id} failed: {e}")

    background_tasks.add_task(run_conversion)
    
    delete_at = datetime.utcnow() + timedelta(hours=1)
    return JobResponse(
        job_id=job_id, 
        status=JobStatus.PROCESSING, 
        message="Your file is being processed. Hold tight!", 
        expires_at=delete_at
    )

@router.get("/status/{job_id}", response_model=JobStatusResponse)
async def check_job_status(job_id: str):
    if job_id in job_store:
        job = job_store[job_id]
        return JobStatusResponse(
            job_id=job_id,
            status=job["status"],
            tool_type=job["tool_type"]
        )
        
    pool = await get_db_pool()
    if pool == "MOCK":
        raise HTTPException(404, detail="Job not found in cache")
        
    async with pool.acquire() as conn:
        row = await conn.fetchrow("SELECT id, status, tool_type FROM jobs WHERE id = $1", uuid.UUID(job_id))
        if not row: raise HTTPException(404)
        return JobStatusResponse(job_id=str(row["id"]), status=row["status"], tool_type=row["tool_type"])

@router.get("/download/{job_id}")
async def download_result(job_id: str):
    output_dir = Path("/tmp") / "outputs" / job_id
    if output_dir.exists():
        files = list(output_dir.iterdir())
        if files:
            return FileResponse(path=str(files[0]), filename=files[0].name)
    raise HTTPException(404, detail="Converted file not found or expired.")
