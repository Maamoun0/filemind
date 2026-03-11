"""
fileMind Backend — Pydantic Models (mirrors shared/types)
"""
from enum import Enum
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
import uuid


class JobStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    REVIEWING = "reviewing"        # AI Double-Check: Expert B reviewing Expert A's output
    COMPLETED = "completed"
    FAILED = "failed"


class ReviewVerdict(str, Enum):
    APPROVED = "approved"
    NEEDS_REVISION = "needs_revision"
    REJECTED = "rejected"


class ToolCategory(str, Enum):
    PDF = "pdf"
    IMAGE = "image"
    AUDIO = "audio"
    SMART = "smart"


class ToolType(str, Enum):
    # PDF Tools
    PDF_TO_WORD = "pdf-to-word"
    WORD_TO_PDF = "word-to-pdf"
    MERGE_PDF = "merge-pdf"
    SPLIT_PDF = "split-pdf"
    COMPRESS_PDF = "compress-pdf"
    EXTRACT_TEXT = "extract-text"
    AI_SUMMARY_PDF = "ai-summary-pdf"
    
    # Image Tools
    IMAGE_TO_PDF = "image-to-pdf"
    OCR_IMAGE = "ocr-image"
    FORMAT_CONVERSION = "format-conversion"
    
    # Audio Tools
    AUDIO_TO_TEXT = "audio-to-text"
    NOISE_REDUCTION = "noise-reduction"
    
    # Smart Tools
    EXCEL_ANALYZER = "excel-analyzer"


# ── Tool-specific max file sizes (bytes) ──
MAX_FILE_SIZES: dict[ToolType, int] = {
    ToolType.PDF_TO_WORD: 50 * 1024 * 1024,
    ToolType.COMPRESS_PDF: 100 * 1024 * 1024,
    ToolType.AI_SUMMARY_PDF: 20 * 1024 * 1024,
    ToolType.OCR_IMAGE: 15 * 1024 * 1024,
    ToolType.AUDIO_TO_TEXT: 50 * 1024 * 1024,
    ToolType.EXCEL_ANALYZER: 50 * 1024 * 1024,
}
DEFAULT_MAX_FILE_SIZE = 30 * 1024 * 1024  # 30MB fallback


# ── Magic Bytes Signatures (Blue Team Security) ──
# Maps ToolType to allowed magic byte prefixes
ALLOWED_MAGIC_TYPES: dict[ToolType, list[str]] = {
    ToolType.PDF_TO_WORD: ["application/pdf"],
    ToolType.WORD_TO_PDF: [
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
    ],
    ToolType.MERGE_PDF: ["application/pdf"],
    ToolType.SPLIT_PDF: ["application/pdf"],
    ToolType.COMPRESS_PDF: ["application/pdf"],
    ToolType.EXTRACT_TEXT: ["application/pdf"],
    ToolType.AI_SUMMARY_PDF: ["application/pdf"],
    ToolType.IMAGE_TO_PDF: ["image/jpeg", "image/png", "image/webp"],
    ToolType.OCR_IMAGE: ["image/jpeg", "image/png", "image/webp", "image/tiff"],
    ToolType.FORMAT_CONVERSION: ["image/jpeg", "image/png", "image/webp", "image/bmp"],
    ToolType.AUDIO_TO_TEXT: [
        "audio/mpeg", "audio/ogg", "audio/wav", "audio/x-wav",
        "audio/mp4", "audio/x-m4a", "audio/webm",
    ],
    ToolType.NOISE_REDUCTION: [
        "audio/mpeg", "audio/ogg", "audio/wav", "audio/x-wav",
    ],
    ToolType.EXCEL_ANALYZER: [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
    ],
}


class JobRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    tool_type: ToolType
    status: JobStatus = JobStatus.PENDING
    file_size: int
    processing_time: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    delete_at: Optional[datetime] = None
    error_message: Optional[str] = None


class DoubleCheckResult(BaseModel):
    """AI Double-Check System result from debate between Expert A and Expert B."""
    verdict: ReviewVerdict
    confidence: float = Field(ge=0.0, le=1.0)
    processor_summary: str          # Expert A's brief summary
    reviewer_notes: str             # Expert B's review notes
    revisions_applied: int = 0      # Number of corrections made
    cached_result: bool = False     # Whether result came from cache


class DoubleCheckCacheEntry(BaseModel):
    content_hash: str
    tool_type: ToolType
    processor_result: str
    reviewer_result: str
    verdict: ReviewVerdict
    confidence: float


class JobResponse(BaseModel):
    job_id: str
    status: JobStatus
    message: Optional[str] = None
    expires_at: Optional[datetime] = None
    review_info: Optional[DoubleCheckResult] = None  # AI Double-Check result


class ExcelAnalysisResult(BaseModel):
    total_rows: int
    total_columns: int
    duplicate_rows: int
    empty_cells: int
    column_stats: dict  # column name → {dtype, nulls, unique, mean, min, max}
    message: str

