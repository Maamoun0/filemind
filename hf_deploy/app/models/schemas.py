from enum import Enum
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class JobStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class ToolType(str, Enum):
    OCR_ARABIC = "OCR_ARABIC"
    OCR_LATIN = "OCR_LATIN"
    TRANSLATION = "TRANSLATION"
    EXCEL_STYLING = "EXCEL_STYLING"

class JobResult(BaseModel):
    extracted_text: Optional[str] = None
    translated_text: Optional[str] = None
    file_url: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

class JobResponse(BaseModel):
    job_id: str
    status: JobStatus
    message: str
    expires_at: datetime

class JobStatusResponse(BaseModel):
    job_id: str
    status: JobStatus
    result: Optional[JobResult] = None
    error: Optional[str] = None

                    