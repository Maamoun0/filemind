from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class RoadmapItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: int = 3
    is_public: bool = True
    category: Optional[str] = None

class RoadmapItemCreate(RoadmapItemBase):
    status_id: Optional[str] = None

class RoadmapItem(RoadmapItemBase):
    id: str
    status_id: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class StatusColumnBase(BaseModel):
    label: str
    display_order: int
    is_default: bool = False

class StatusColumn(StatusColumnBase):
    id: str
    items: List[RoadmapItem] = []
    model_config = ConfigDict(from_attributes=True)
