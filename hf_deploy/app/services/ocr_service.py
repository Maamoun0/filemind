import os
from pathlib import Path
from PIL import Image
import pytesseract
from pdf2image import convert_from_path

async def process_ocr_image(job_id: str, input_path: str, output_path: str):
    """
    Extracts text from images or PDFs using OCR (Tesseract).
    Handles both Arabic and English.
    """
    try:
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        extracted_text = ""
        ext = Path(input_path).suffix.lower()
        
        if ext == '.pdf':
            # Convert PDF to images
            images = convert_from_path(input_path)
            for i, image in enumerate(images):
                text = pytesseract.image_to_string(image, lang='ara+eng')
                extracted_text += f"\n--- Page {i+1} ---\n{text}"
        else:
            # Assume image
            image = Image.open(input_path)
            extracted_text = pytesseract.image_to_string(image, lang='ara+eng')
            
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(extracted_text)
            
        return True
    except Exception as e:
        print(f"[fileMind-Engine] OCR Error for {job_id}: {e}")
        raise e
