import redis.asyncio as aioredis
import json
from ..config import get_settings

_redis = None

async def get_redis():
    global _redis
    if _redis is None:
        settings = get_settings()
        try:
            _redis = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
            await _redis.ping()
            print("[fileMind-Queue] Connected")
        except Exception as e:
            print(f"[fileMind-Queue] Failed: {e}")
            _redis = "DISABLED"
    return _redis

async def close_redis():
    global _redis
    if _redis and _redis != "DISABLED":
        await _redis.close()
        _redis = None

async def add_job_to_queue(job_id, tool_type, file_path, original_name):
    r = await get_redis()
    if r == "DISABLED":
        return job_id
    print(f"[fileMind-Queue] Job {job_id} queued")
    return job_id