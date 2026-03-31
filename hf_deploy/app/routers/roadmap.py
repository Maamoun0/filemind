from fastapi import APIRouter, Depends, HTTPException
from ..services.roadmap import get_roadmap_board, add_roadmap_item
from ..schemas.roadmap import StatusColumn, RoadmapItem
from typing import List
import uuid

router = APIRouter(prefix="/roadmap", tags=["roadmap"])

@router.get("/board", response_model=List[StatusColumn])
async def get_board():
    """
    Returns the dynamic Kanban board with columns and items.
    Visible only to public (is_public=True).
    Items without status go to the 'Default' column (Option A).
    """
    try:
        return get_roadmap_board(is_admin=False)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/item", response_model=RoadmapItem)
async def create_item(item: RoadmapItem):
    """
    Create a new roadmap item.
    Typically called by Admin, but public for now for testing.
    """
    if not item.id:
        item.id = str(uuid.uuid4())
    try:
        return add_roadmap_item(item)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
