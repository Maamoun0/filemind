"""
fileMind Backend — Excel Analysis Router
Dedicated endpoint for the Smart Excel Analyzer (pandas-powered).
"""
from fastapi import APIRouter, UploadFile, File, HTTPException

from ..models.schemas import ToolType, ExcelAnalysisResult
from ..security.magic_validator import validate_file_magic
from ..services.excel_analyzer import analyze_excel

router = APIRouter(prefix="/api/excel", tags=["Smart Excel"])


@router.post("/analyze", response_model=ExcelAnalysisResult)
async def analyze_excel_file(file: UploadFile = File(...)):
    """
    Upload an Excel (.xlsx) or CSV file for instant analysis.
    Returns: duplicate count, empty cells, per-column statistics.
    No queuing needed — runs synchronously via pandas.
    """
    # Validate magic bytes
    content = await validate_file_magic(file, ToolType.EXCEL_ANALYZER)
    
    filename = file.filename or "upload.xlsx"
    
    try:
        result = analyze_excel(content, filename)
        print(f"[fileMind-API] Excel analysis complete: {result.total_rows} rows × {result.total_columns} cols")
        return result
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Failed to analyze file: {str(e)}"
        )
