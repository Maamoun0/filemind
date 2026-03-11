"""
fileMind Backend — Smart Excel Analyzer Service (pandas)
Analyzes uploaded Excel/CSV files for duplicates, empty cells, and column statistics.
"""
import pandas as pd
import io
from ..models.schemas import ExcelAnalysisResult


def analyze_excel(content: bytes, filename: str) -> ExcelAnalysisResult:
    """
    Analyze an Excel or CSV file using pandas.
    Returns structured analysis with duplicate detection, empty cell count, and per-column stats.
    """
    # Determine file type from filename extension
    if filename.endswith(".csv"):
        df = pd.read_csv(io.BytesIO(content))
    else:
        df = pd.read_excel(io.BytesIO(content), engine="openpyxl")
    
    total_rows = len(df)
    total_columns = len(df.columns)
    
    # Duplicate detection
    duplicate_rows = int(df.duplicated().sum())
    
    # Empty / null cells
    empty_cells = int(df.isnull().sum().sum())
    
    # Per-column statistics
    column_stats = {}
    for col in df.columns:
        col_data = df[col]
        stats: dict = {
            "dtype": str(col_data.dtype),
            "nulls": int(col_data.isnull().sum()),
            "unique": int(col_data.nunique()),
        }
        
        # Add numeric stats if applicable
        if pd.api.types.is_numeric_dtype(col_data):
            stats["mean"] = round(float(col_data.mean()), 2) if not col_data.isnull().all() else None
            stats["min"] = float(col_data.min()) if not col_data.isnull().all() else None
            stats["max"] = float(col_data.max()) if not col_data.isnull().all() else None
            stats["std"] = round(float(col_data.std()), 2) if not col_data.isnull().all() else None
        
        column_stats[str(col)] = stats
    
    return ExcelAnalysisResult(
        total_rows=total_rows,
        total_columns=total_columns,
        duplicate_rows=duplicate_rows,
        empty_cells=empty_cells,
        column_stats=column_stats,
        message=f"Analyzed {total_rows} rows × {total_columns} columns. "
                f"Found {duplicate_rows} duplicate rows and {empty_cells} empty cells.",
    )
