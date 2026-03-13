"""
fileMind Backend — Redis / Task Queue Service
Uses redis-py for job queuing (compatible with BullMQ protocol on the Node.js worker side).
"""
import redis.asyncio as aioredis
import json
import uuid
from ..config import get_settings

_redis: aioredis.Redis | None = None


async def get_redis() -> aioredis.Redis:
    global _redis
    if _redis is None:
        settings = get_settings()
        try:
            _redis = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
            # Ping to check connection
            await _redis.ping()
            print(f"[fileMind-Queue] Redis connected -> {settings.REDIS_URL}")
        except Exception as e:
            print(f"[fileMind-Queue] Warning: Could not connect to Redis: {e}")
            print("[fileMind-Queue] Continuing with Redis disabled.")
            _redis = "DISABLED" # type: ignore
    return _redis # type: ignore


async def close_redis():
    global _redis
    if _redis:
        await _redis.close()
        _redis = None


async def add_job_to_queue(
    job_id: str,
    tool_type: str,
    file_path: str,
    original_name: str,
) -> str:
    """
    Enqueue a job into the BullMQ-compatible queue.
    """
    r = await get_redis()
    if r == "DISABLED":
        print(f"[fileMind-Queue] MOCK: Skipping Redis enqueue for Job {job_id}")
        return job_id
    
    try:
        # BullMQ job data structure
        job_data = {
            "jobId": job_id,
            "toolType": tool_type,
            "filePath": file_path,
            "originalName": original_name,
        }
        
        bullmq_job = {
            "name": tool_type,
            "data": job_data,
            "opts": {
                "jobId": job_id,
                "attempts": 3,
                "backoff": {"type": "exponential", "delay": 1000},
                "removeOnComplete": True,
                "removeOnFail": False,
            },
            "id": job_id,
            "timestamp": int(__import__("time").time() * 1000),
            "attemptsMade": 0,
        }
        
        # Store the job hash
        job_key = f"bull:filemind-processing:{job_id}"
        await r.hset(job_key, mapping={
            "name": tool_type,
            "data": json.dumps(job_data),
            "opts": json.dumps(bullmq_job["opts"]),
            "timestamp": str(bullmq_job["timestamp"]),
            "attemptsMade": "0",
        })
        
        # Push to wait list (BullMQ picks from here)
        await r.rpush("bull:filemind-processing:wait", job_id)
        
        # Publish event for BullMQ worker to wake up
        await r.publish("bull:filemind-processing:waiting@null", job_id)
        
        print(f"[fileMind-Queue] Job {job_id} queued for {tool_type}")
    except Exception as e:
        print(f"[fileMind-Queue] Error adding to queue: {e}")
        
    return job_id
