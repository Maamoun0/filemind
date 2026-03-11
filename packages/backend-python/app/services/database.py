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
        _pool = await asyncpg.create_pool(
            dsn=settings.DATABASE_URL,
            min_size=2,
            max_size=10,
        )
        print(f"[fileMind-DB] Connection pool established -> {settings.DATABASE_URL.split('@')[1]}")
    return _pool


async def close_db_pool():
    global _pool
    if _pool:
        await _pool.close()
        _pool = None
        print("[fileMind-DB] Connection pool closed.")
