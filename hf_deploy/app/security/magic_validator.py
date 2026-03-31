import magic
from fastapi import HTTPException, status

ALLOWED_EXTENSIONS = {'.pdf', '.png', '.jpg', '.jpeg'}
ALLOWED_MIME_TYPES = {'application/pdf', 'image/png', 'image/jpeg'}

def validate_file_magic(content: bytes, filename: str):
    if '.' not in filename:
        ext = ".bin"
    else:
        ext = f".{filename.split('.')[-1].lower()}"
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Extension {ext} not allowed")
    try:
        mime = magic.Magic(mime=True)
        detected_type = mime.from_buffer(content)
        if detected_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"MIME type {detected_type} not allowed")
        return True
    except Exception:
        return True