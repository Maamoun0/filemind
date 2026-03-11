"""
fileMind Backend — AI Double-Check Cache Service
Uses Redis + Postgres hybrid caching for review results.
Content-hashed lookups enable instant results for identical files.
"""
import json
import hashlib
import uuid
from datetime import datetime, timedelta
from typing import Optional

from ..config import get_settings
from ..services.database import get_db_pool
from .queue import get_redis


# ── Cache Configuration ──
CACHE_TTL_HOURS = 24        # Cache review results for 24 hours
CACHE_KEY_PREFIX = "filemind:dc_cache:"  # Redis key prefix


def compute_content_hash(content: bytes, tool_type: str) -> str:
    """
    Generate a SHA-256 hash of file content + tool type.
    This ensures cache hits only for the exact same content + same tool.
    """
    hasher = hashlib.sha256()
    hasher.update(content)
    hasher.update(tool_type.encode("utf-8"))
    return hasher.hexdigest()


async def get_cached_review(content_hash: str) -> Optional[dict]:
    """
    Check Redis first (fast L1), then Postgres (persistent L2).
    Returns cached review result dict or None.
    """
    # ── L1: Redis (in-memory, fast) ──
    try:
        redis = await get_redis()
        cache_key = f"{CACHE_KEY_PREFIX}{content_hash}"
        cached = await redis.get(cache_key)
        if cached:
            print(f"[fileMind-Cache] L1 HIT (Redis) for hash {content_hash[:12]}...")
            return json.loads(cached)
    except Exception as e:
        print(f"[fileMind-Cache] Redis L1 lookup failed: {e}")

    # ── L2: Postgres (persistent, slower) ──
    try:
        pool = await get_db_pool()
        async with pool.acquire() as conn:
            row = await conn.fetchrow(
                """SELECT processor_result, reviewer_result, verdict, confidence
                   FROM ai_double_check_cache
                   WHERE content_hash = $1 AND expires_at > NOW()""",
                content_hash
            )
            if row:
                # Promote back to Redis for faster future lookups
                result = {
                    "processor_result": row["processor_result"],
                    "reviewer_result": row["reviewer_result"],
                    "verdict": row["verdict"],
                    "confidence": float(row["confidence"]),
                    "cached": True,
                }
                try:
                    redis = await get_redis()
                    await redis.setex(
                        f"{CACHE_KEY_PREFIX}{content_hash}",
                        CACHE_TTL_HOURS * 3600,
                        json.dumps(result)
                    )
                except Exception:
                    pass  # Non-critical: Redis promotion failed

                # Bump hit count
                await conn.execute(
                    "UPDATE ai_double_check_cache SET hit_count = hit_count + 1 WHERE content_hash = $1",
                    content_hash
                )

                print(f"[fileMind-Cache] L2 HIT (Postgres) for hash {content_hash[:12]}... (promoted to L1)")
                return result
    except Exception as e:
        print(f"[fileMind-Cache] Postgres L2 lookup failed: {e}")

    print(f"[fileMind-Cache] MISS for hash {content_hash[:12]}...")
    return None


async def store_review_in_cache(
    content_hash: str,
    tool_type: str,
    processor_result: str,
    reviewer_result: str,
    verdict: str,
    confidence: float,
) -> None:
    """
    Store review result in both Redis (L1) and Postgres (L2).
    """
    result_data = {
        "processor_result": processor_result,
        "reviewer_result": reviewer_result,
        "verdict": verdict,
        "confidence": confidence,
        "cached": True,
    }

    # ── L1: Redis ──
    try:
        redis = await get_redis()
        cache_key = f"{CACHE_KEY_PREFIX}{content_hash}"
        await redis.setex(
            cache_key,
            CACHE_TTL_HOURS * 3600,
            json.dumps(result_data)
        )
        print(f"[fileMind-Cache] Stored in L1 (Redis) for hash {content_hash[:12]}...")
    except Exception as e:
        print(f"[fileMind-Cache] Redis L1 store failed: {e}")

    # ── L2: Postgres ──
    try:
        expires_at = datetime.utcnow() + timedelta(hours=CACHE_TTL_HOURS)
        pool = await get_db_pool()
        async with pool.acquire() as conn:
            await conn.execute(
                """INSERT INTO ai_double_check_cache 
                   (id, content_hash, tool_type, processor_result, reviewer_result, verdict, confidence, expires_at)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                   ON CONFLICT (content_hash) DO UPDATE SET
                       processor_result = EXCLUDED.processor_result,
                       reviewer_result = EXCLUDED.reviewer_result,
                       verdict = EXCLUDED.verdict,
                       confidence = EXCLUDED.confidence,
                       expires_at = EXCLUDED.expires_at,
                       hit_count = ai_double_check_cache.hit_count + 1""",
                uuid.uuid4(), content_hash, tool_type,
                processor_result, reviewer_result, verdict, confidence, expires_at
            )
        print(f"[fileMind-Cache] Stored in L2 (Postgres) for hash {content_hash[:12]}...")
    except Exception as e:
        print(f"[fileMind-Cache] Postgres L2 store failed: {e}")


async def cleanup_expired_cache() -> int:
    """Remove expired cache entries from Postgres. Called by cron."""
    try:
        pool = await get_db_pool()
        async with pool.acquire() as conn:
            result = await conn.execute(
                "DELETE FROM ai_double_check_cache WHERE expires_at < NOW()"
            )
            deleted = int(result.split(" ")[-1]) if result else 0
            if deleted > 0:
                print(f"[fileMind-Cache] Cleaned up {deleted} expired cache entries")
            return deleted
    except Exception as e:
        print(f"[fileMind-Cache] Cleanup failed: {e}")
        return 0
