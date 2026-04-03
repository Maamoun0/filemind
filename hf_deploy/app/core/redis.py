import redis
import os
import logging

logger = logging.getLogger(__name__)

# Load Redis URL from environment or default to local
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

def get_redis_client():
    try:
        client = redis.from_url(REDIS_URL, decode_responses=True)
        # Test connection
        client.ping()
        return client
    except Exception as e:
        logger.error(f"Failed to connect to Redis at {REDIS_URL}: {e}")
        return None

# Singleton-ish instance for app usage
redis_client = get_redis_client()
