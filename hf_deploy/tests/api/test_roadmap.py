import requests
import uuid

BASE_URL = "http://localhost:8000"

def test_roadmap_flow():
    # 1. Check health
    try:
        r = requests.get(f"{BASE_URL}/")
        print(f"Health Check: {r.json()}")
    except:
        print("Serrver not running, skipping live test.")
        return

    # 2. Add an item
    item_id = str(uuid.uuid4())
    payload = {
        "id": item_id,
        "title": "New Kanban Layout",
        "description": "Implemented by Antigravity",
        "status_id": "pla-001",
        "priority": 1,
        "is_public": True,
        "category": "UI",
        "created_at": "2026-03-30T15:00:00"
    }
    r = requests.post(f"{BASE_URL}/roadmap/item", json=payload)
    print(f"Create Item: {r.status_code}")
    
    # 3. Fetch board
    r = requests.get(f"{BASE_URL}/roadmap/board")
    board = r.json()
    print(f"Board fetched with {len(board)} columns")
    for col in board:
        print(f"Col: {col['label']} - Items: {len(col['items'])}")

if __name__ == "__main__":
    test_roadmap_flow()
