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
    Designed for scanned documents (books, printed papers, etc.)
    Converts each PDF page to an image, runs Tesseract OCR (Arabic + English),
    and assembles the extracted text into an editable Word document.
    """
    try:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        print(f"[fileMind-Engine] Job {job_id}: OCR Scan → Word conversion started.")

        # Convert all PDF pages to high-resolution images
        images = convert_from_path(input_path, dpi=300)
        word_doc = Document()

        total_pages = len(images)
        for i, image in enumerate(images):
            print(f"[fileMind-Engine] Job {job_id}: OCR processing page {i+1}/{total_pages}...")

            # Run Tesseract OCR with Arabic + English language support
            extracted_text = pytesseract.image_to_string(image, lang='ara+eng')

            # Add extracted text to Word document
            if extracted_text.strip():
                word_doc.add_paragraph(extracted_text)

            # Add page break between pages (not after the last one)
            if i < total_pages - 1:
                word_doc.add_page_break()

        word_doc.save(output_path)
        print(f"[fileMind-Engine] Job {job_id}: OCR Scan → Word completed ({total_pages} pages processed).")

        return True
    except Exception as e:
        print(f"[fileMind-Engine] OCR PDF to Word Error for {job_id}: {e}")
        raise e

