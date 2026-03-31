import sqlite3
import os
from contextlib import contextmanager

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "simplix_v2.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Status Columns
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS status_columns (
            id TEXT PRIMARY KEY,
            label TEXT NOT NULL,
            display_order INTEGER NOT NULL,
            is_default BOOLEAN DEFAULT 0
        )
    ''')
    
    # Roadmap Items
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS roadmap_items (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            status_id TEXT,
            priority INTEGER DEFAULT 3,
            is_public BOOLEAN DEFAULT 1,
            category TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (status_id) REFERENCES status_columns (id)
        )
    ''')
    
    # Seed default columns if empty
    cursor.execute("SELECT COUNT(*) FROM status_columns")
    if cursor.fetchone()[0] == 0:
        columns = [
            ("bac-001", "Backlog", 0, 1),
            ("pla-001", "Planned", 1, 0),
            ("ip-001", "In Progress", 2, 0),
            ("don-001", "Done", 3, 0)
        ]
        cursor.executemany("INSERT INTO status_columns VALUES (?, ?, ?, ?)", columns)
    
    conn.commit()
    conn.close()
    print(f"[Simplix-DB] Initialized at {DB_PATH}")

if __name__ == "__main__":
    init_db()
