import os
import zipfile
from pathlib import Path

async def process_compress_file(job_id: str, input_path: str, output_path: str):
    """
    Compresses a given file into a ZIP archive with highest compression.
    """
    try:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Use ZIP_DEFLATED for standard compression, compresslevel=9 is max
        with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as zipf:
            # We want the file inside the zip to have its original name
            original_filename = Path(input_path).name.replace("original", "fileMind_file")
            zipf.write(input_path, arcname=original_filename)
            
        return True
    except Exception as e:
        print(f"[fileMind-Engine] Compress File Error for {job_id}: {e}")
        raise e
