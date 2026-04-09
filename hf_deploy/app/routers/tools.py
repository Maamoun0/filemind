import uuid, aiofiles, urllib.parse
from datetime import datetime, timedelta
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks, Request, Response
from fastapi.responses import FileResponse
from ..models.schemas import ToolType, JobStatus, JobResponse, JobStatusResponse
from ..services.usage_service import UsageService
from ..services.database import get_db_pool
from ..services.pdf_service import process_pdf_to_word, process_ocr_pdf_to_word

router = APIRouter(prefix="/api/tools", tags=["Tools"])

# Simple In-memory Job Store for MOCK mode
job_store = {}

@router.post("/upload", response_model=JobResponse, status_code=202)
async def upload_file(
    request: Request,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    toolType: str = Form(...),
):
    # Usage tracking
    visitor_id = request.cookies.get("visitor_id") or "anonymous"
    ip_address = request.headers.get("x-forwarded-for", "").split(",")[0] or request.client.host
    
    is_reached, current = UsageService.check_limit(visitor_id, ip_address)
    if is_reached:
        raise HTTPException(429, detail="لقد وصلت للحد اليومي لجميع العمليات. يرجى التسجيل للمتابعة.")
    
    UsageService.increment_usage(visitor_id, ip_address)
    
    try:
        tool_enum = ToolType(toolType)
    except ValueError:
        raise HTTPException(400, detail="Invalid tool type")
        
    job_id = str(uuid.uuid4())
    temp_dir = Path("/tmp")
    upload_path = temp_dir / "uploads" / job_id / f"original{Path(file.filename or '').suffix}"
    output_path = temp_dir / "outputs" / job_id / f"{Path(file.filename or '').stem}.docx"
    if tool_enum == ToolType.OCR_PDF_TO_WORD:
        output_path = temp_dir / "outputs" / job_id / f"{Path(file.filename or '').stem}.docx"
    elif tool_enum == ToolType.COMPRESS_FILES:
        output_path = temp_dir / "outputs" / job_id / f"{Path(file.filename or '').stem}.zip"
    elif tool_enum == ToolType.OCR_IMAGE:
        output_path = temp_dir / "outputs" / job_id / f"{Path(file.filename or '').stem}.txt"
    
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
        from ..services.compress_service import process_compress_file
        from ..services.ocr_service import process_ocr_image
        
        try:
            if tool_enum == ToolType.PDF_TO_WORD:
                await process_pdf_to_word(job_id, str(upload_path), str(output_path))
                job_store[job_id]["status"] = JobStatus.COMPLETED
            elif tool_enum == ToolType.OCR_PDF_TO_WORD:
                await process_ocr_pdf_to_word(job_id, str(upload_path), str(output_path))
                job_store[job_id]["status"] = JobStatus.COMPLETED
            elif tool_enum == ToolType.COMPRESS_FILES:
                await process_compress_file(job_id, str(upload_path), str(output_path))
                job_store[job_id]["status"] = JobStatus.COMPLETED
            elif tool_enum == ToolType.OCR_IMAGE:
                await process_ocr_image(job_id, str(upload_path), str(output_path))
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
    print(f"[fileMind-Engine] Download request received for job: {job_id}")
    output_dir = Path("/tmp") / "outputs" / job_id
    
    if not output_dir.exists():
        print(f"[fileMind-Engine] Error: Output directory not found: {output_dir}")
        raise HTTPException(404, detail="Converted file folder not found.")
        
    files = [f for f in output_dir.iterdir() if f.is_file()]
    print(f"[fileMind-Engine] Files found in output dir: {[f.name for f in files]}")
    
    if not files:
        print(f"[fileMind-Engine] Error: No files found in output directory: {output_dir}")
        raise HTTPException(404, detail="Converted file not found in storage.")
        
    # Take the first file (should be the converted one)
    target_file = files[0]
    original_filename = target_file.name
    viral_filename = f"filemind_{original_filename}"
    
    print(f"[fileMind-Engine] Serving file: {target_file} with download name: {viral_filename}")
    
    # RFC 5987 compliant filename encoding for non-ASCII (Arabic) support
    encoded_filename = urllib.parse.quote(viral_filename)
    
    headers = {
        "Content-Disposition": f'attachment; filename="{viral_filename}"; filename*=UTF-8\'\'{encoded_filename}'
    }
    
    print(f"[fileMind-Engine] Serving file: {target_file} with encoded name for RFC 5987")
    
    return FileResponse(
        path=str(target_file),
        headers=headers,
        media_type="application/octet-stream"
    )
