"""
fileMind Backend — Database Service (asyncpg)
"""
import asyncpg
from ..config import get_settings

_pool: asyncpg.Pool | None = None


async def get_db_pool() -> asyncpg.Pool:
    global _pool
    if _pool is None:
        settings = get_settings()
        try:
            _pool = await asyncpg.create_pool(
                dsn=settings.DATABASE_URL,
                min_size=2,
                max_size=10,
                command_timeout=5,
            )
            print(f"[fileMind-DB] Connection pool established -> {settings.DATABASE_URL.split('@')[1]}")
        except Exception as e:
            print(f"[fileMind-DB] Warning: Could not connect to Postgres: {e}")
            print("[fileMind-DB] Continuing in MOCK MODE (In-Memory Jobs)")
            _pool = "MOCK" # type: ignore
    return _pool # type: ignore


async def close_db_pool():
    global _pool
    if _pool and _pool != "MOCK":
        await _pool.close()
        _pool = None
        print("[fileMind-DB] Connection pool closed.")
