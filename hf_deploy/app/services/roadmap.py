from ..db.engine import get_db_connection
from ..schemas.roadmap import StatusColumn, RoadmapItem
from typing import List, Dict

def get_roadmap_board(is_admin: bool = False) -> List[StatusColumn]:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # 1. Fetch Columns
    cursor.execute("SELECT * FROM status_columns ORDER BY display_order ASC")
    columns_raw = [dict(row) for row in cursor.fetchall()]
    
    # 2. Fetch Items
    visibility_clause = "" if is_admin else "WHERE is_public = 1"
    cursor.execute(f"SELECT * FROM roadmap_items {visibility_clause} ORDER BY priority ASC, created_at DESC")
    items_raw = [dict(row) for row in cursor.fetchall()]
    
    # 3. Create Map of items by status_id
    items_by_status: Dict[str, List[RoadmapItem]] = {}
    backlog_items = []
    
    for item in items_raw:
        # Convert raw to pydantic
        item_obj = RoadmapItem(**item)
        sid = item["status_id"]
        if sid:
            if sid not in items_by_status:
                items_by_status[sid] = []
            items_by_status[sid].append(item_obj)
        else:
            backlog_items.append(item_obj)
            
    # 4. Assembly
    board = []
    for col in columns_raw:
        sid = col["id"]
        col_obj = StatusColumn(**col)
        # Handle Option A (Default column gets unassigned items)
        if col["is_default"]:
            col_obj.items = backlog_items + items_by_status.get(sid, [])
        else:
            col_obj.items = items_by_status.get(sid, [])
        board.append(col_obj)
        
    conn.close()
    return board

def add_roadmap_item(item: RoadmapItem) -> RoadmapItem:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO roadmap_items (id, title, description, status_id, priority, is_public, category) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (item.id, item.title, item.description, item.status_id, item.priority, item.is_public, item.category)
    )
    conn.commit()
    conn.close()
    return item
