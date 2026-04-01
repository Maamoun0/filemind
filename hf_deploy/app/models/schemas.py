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
    PDF_TO_WORD = "pdf-to-word"
    WORD_TO_PDF = "word-to-pdf"
    COMPRESS_PDF = "compress-pdf"
    OCR_IMAGE = "ocr-image"
    AUDIO_TO_TEXT = "audio-to-text"
    EXCEL_STYLING = "excel-styling"
    DOCUMENT_TRANSLATION = "document-translation"
    ROADMAP = "roadmap"
    COMPRESS_FILES = "compress-files"

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
    tool_type: Optional[str] = None
    result: Optional[JobResult] = None
    error: Optional[str] = None

                    