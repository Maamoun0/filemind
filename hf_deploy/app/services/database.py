import asyncpg
from ..config import get_settings

_pool = None

async def get_db_pool():
    global _pool
    if _pool is None:
        settings = get_settings()
        try:
            _pool = await asyncpg.create_pool(
                dsn=settings.DATABASE_URL, 
                min_size=2, 
                max_size=10, 
                command_timeout=5
            )
            print("[fileMind-DB] Connected")
        except Exception as e:
            print(f"[fileMind-DB] Error: {e}")
            _pool = "MOCK"
    return _pool

async def close_db_pool():
    global _pool
    if _pool and _pool != "MOCK":
        await _pool.close()
        _pool = None