import os
from pathlib import Path
from pdf2docx import Converter
from pdf2image import convert_from_path
import pytesseract
from docx import Document


async def process_pdf_to_word(job_id: str, input_path: str, output_path: str):
    """
    Standard PDF to Word conversion.
    Preserves formatting, tables, fonts, and layouts from digital/text-based PDFs.
    Uses pdf2docx for high-fidelity layout preservation.
    """
    try:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        print(f"[fileMind-Engine] Job {job_id}: Standard PDF → Word conversion started.")
        cv = Converter(input_path)
        cv.convert(output_path, start=0, end=None)
        cv.close()
        print(f"[fileMind-Engine] Job {job_id}: Standard PDF → Word completed.")

        return True
    except Exception as e:
        print(f"[fileMind-Engine] PDF to Word Error for {job_id}: {e}")
        raise e


async def process_ocr_pdf_to_word(job_id: str, input_path: str, output_path: str):
    """
    OCR-powered PDF to Word conversion.
    Memory-optimized for server environments to prevent OOM crashes.
    """
    try:
        import gc
        from pdf2image import pdfinfo_from_path
        
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        print(f"[fileMind-Engine] Job {job_id}: OCR Scan → Word conversion (Memory Optimized) started.")

        # Get PDF info first to avoid loading everything
        info = pdfinfo_from_path(input_path)
        total_pages = info["Pages"]
        
        word_doc = Document()

        for i in range(1, total_pages + 1):
            print(f"[fileMind-Engine] Job {job_id}: Processing page {i}/{total_pages}...")
            
            # Convert ONLY the current page to image at a more balanced 150 DPI
            page_images = convert_from_path(input_path, dpi=150, first_page=i, last_page=i)
            
            if page_images:
                image = page_images[0]
                # Run OCR
                extracted_text = pytesseract.image_to_string(image, lang='ara+eng')
                
                # Add to Word
                if extracted_text.strip():
                    word_doc.add_paragraph(extracted_text)
                
                # Add page break
                if i < total_pages:
                    word_doc.add_page_break()
                
                # Explicitly close and clear image from memory
                image.close()
                del page_images
                del image
                gc.collect() # Force garbage collection for heavy image objects

        word_doc.save(output_path)
        print(f"[fileMind-Engine] Job {job_id}: OCR Scan → Word completed successfully.")

        return True
    except Exception as e:
        print(f"[fileMind-Engine] OCR PDF to Word Error for {job_id}: {e}")
        raise e


