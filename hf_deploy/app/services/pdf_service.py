import os
from pathlib import Path
from pdf2docx import Converter

async def process_pdf_to_word(job_id: str, input_path: str, output_path: str):
    """
    Highly precise PDF to Word conversion service.
    Handles tables, fonts, and layouts. 
    """
    try:
        # Create output directory if not exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        cv = Converter(input_path)
        # Convert all pages (default)
        cv.convert(output_path, start=0, end=None)
        cv.close()
        
        return True
    except Exception as e:
        print(f"[fileMind-Engine] PDF to Word Error for {job_id}: {e}")
        raise e
