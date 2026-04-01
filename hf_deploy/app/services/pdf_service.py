import os
from pathlib import Path
from pdf2docx import Converter
import fitz  # PyMuPDF
from pdf2image import convert_from_path
import pytesseract
from docx import Document

async def process_pdf_to_word(job_id: str, input_path: str, output_path: str):
    """
    Highly precise PDF to Word conversion service with Smart OCR fallback.
    If the document is a scanned PDF, it uses Tesseract OCR to extract text
    and builds an editable Word document instead of outputting blank/image pages.
    """
    try:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # 1. Analyze PDF using PyMuPDF to detect if it's scanned
        is_scanned = False
        try:
            doc = fitz.open(input_path)
            empty_pages = 0
            num_pages = min(len(doc), 5) # Check first 5 pages max for speed
            
            for i in range(num_pages):
                page = doc[i]
                text = page.get_text().strip()
                # If page has extremely little text, it's effectively a scanned image or blank page
                if len(text) < 100:
                    empty_pages += 1
            
            # If majority of sampled pages are empty of text, mark as scanned
            if num_pages > 0 and (empty_pages / num_pages) >= 0.5:
                is_scanned = True
                
            doc.close()
        except Exception as analyze_err:
            print(f"[fileMind-Engine] Analysis error, defaulting to standard converter: {analyze_err}")

        # 2. Route based on analysis
        if is_scanned:
            print(f"[fileMind-Engine] Job {job_id}: Detected SCANNED PDF. Redirecting to Smart OCR Engine.")
            
            images = convert_from_path(input_path)
            word_doc = Document()
            
            for i, image in enumerate(images):
                # Run OCR on the image
                extracted_text = pytesseract.image_to_string(image, lang='ara+eng')
                
                # Add text to word document
                if extracted_text.strip():
                    word_doc.add_paragraph(extracted_text)
                
                # Add page break if it's not the last page
                if i < len(images) - 1:
                    word_doc.add_page_break()
                    
            word_doc.save(output_path)
            print(f"[fileMind-Engine] Job {job_id}: OCR to Word completed.")
            
        else:
            print(f"[fileMind-Engine] Job {job_id}: Detected NORMAL PDF. Using layout preserver.")
            cv = Converter(input_path)
            cv.convert(output_path, start=0, end=None)
            cv.close()
            
        return True
    except Exception as e:
        print(f"[fileMind-Engine] PDF to Word Error for {job_id}: {e}")
        raise e
