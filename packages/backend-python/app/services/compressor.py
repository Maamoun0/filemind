import zipfile
import io
import os

def compress_file_to_zip(content: bytes, filename: str) -> bytes:
    """
    Compress a single file into a ZIP archive for size reduction.
    """
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as zip_file:
        zip_file.writestr(filename, content)
    
    return buffer.getvalue()
