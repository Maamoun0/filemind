from fastapi import APIRouter, UploadFile, File, HTTPException
from ..security.magic_validator import validate_file_magic
import pandas as pd
import io

router = APIRouter(prefix="/excel", tags=["excel"])

@router.post("/process")
async def process_excel(file: UploadFile = File(...)):
    content = await file.read()
    validate_file_magic(content, file.filename)
    try:
        df = pd.read_excel(io.BytesIO(content))
        return {
            "filename": file.filename,
            "rows": len(df),
            "columns": list(df.columns),
            "summary": "Excel file processed successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing Excel: {str(e)}")