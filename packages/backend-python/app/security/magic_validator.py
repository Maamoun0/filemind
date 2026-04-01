"""
fileMind Backend — Blue Team Security: Magic Bytes File Validation
Uses python-magic (libmagic) to inspect actual file content, NOT extensions or MIME headers.
"""

import magic
from fastapi import UploadFile, HTTPException
from ..models.schemas import (
    ToolType,
    ALLOWED_MAGIC_TYPES,
    MAX_FILE_SIZES,
    DEFAULT_MAX_FILE_SIZE,
)


async def validate_file_magic(file: UploadFile, tool_type: ToolType) -> None:
    """
    Validates file:
    1. File size against tool-specific limits (using UploadFile.size)
    2. Actual file type via magic bytes (reading only the first 2KB)

    Raises HTTPException if validation fails.
    """
    # ── Step 1: Size Validation ──
    file_size = file.size
    max_size = MAX_FILE_SIZES.get(tool_type, DEFAULT_MAX_FILE_SIZE)
    if file_size is not None and file_size > max_size:
        max_mb = max_size // (1024 * 1024)
        raise HTTPException(
            status_code=413,
            detail=f"File size ({file_size} bytes) exceeds the {max_mb}MB limit for {tool_type.value}.",
        )

    # ── Step 2: Magic Bytes Validation ──
    # Read only the first 2KB for magic byte check
    header = await file.read(2048)
    await file.seek(0)  # Reset for downstream consumers

    detected_type = magic.from_buffer(header, mime=True)

    allowed_types = ALLOWED_MAGIC_TYPES.get(tool_type)
    if allowed_types is None:
        raise HTTPException(
            status_code=400,
            detail=f"Tool type '{tool_type.value}' has no defined allowed file types.",
        )

    if "*" not in allowed_types and detected_type not in allowed_types:
        raise HTTPException(
            status_code=415,
            detail=(
                f"File type mismatch. Expected one of {allowed_types} for tool '{tool_type.value}', "
                f"but detected '{detected_type}' from file content (magic bytes). "
            ),
        )
