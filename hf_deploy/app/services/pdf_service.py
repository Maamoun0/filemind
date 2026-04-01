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
            scanned_pages = 0
            num_pages = min(len(doc), 5) # Check first 5 pages max for speed
            
            for i in range(num_pages):
                page = doc[i]
                images = page.get_image_info()
                text = page.get_text().strip()
                
                is_page_scanned = False
                
                # Check 1: Extremely little text means it's an image/blank
                if len(text) < 100:
                    is_page_scanned = True
                
                # Check 2: Even if there is text (hidden OCR layer), check if there's a full-page image
                if not is_page_scanned and images:
                    page_area = page.rect.width * page.rect.height
                    if page_area > 0:
                        for img in images:
                            box = img['bbox']
                            width = box[2] - box[0]
                            height = box[3] - box[1]
                            # If a single image covers > 80% of the page, it's a scanned page
                            if (width * height) / page_area > 0.8:
                                is_page_scanned = True
                                break
                                
                if is_page_scanned:
                    scanned_pages += 1
            
            # If majority of sampled pages are scanned, mark as scanned
            if num_pages > 0 and (scanned_pages / num_pages) >= 0.5:
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
