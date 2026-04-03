from datetime import datetime
import hashlib
from app.core.redis import redis_client
import logging

logger = logging.getLogger(__name__)

class UsageService:
    DAILY_LIMIT = 10
    
    @staticmethod
    def get_user_key(visitor_id: str, ip_address: str):
        # Mixed (IP + Cookie) strategy
        # We hash the IP to avoid storing PII
        ip_hash = hashlib.sha256(ip_address.encode()).hexdigest()
        date_str = datetime.utcnow().strftime("%Y%m%d")
        
        # Primary key is visitor_id (cookie)
        # We also associate it with IP hash to prevent simple cookie clearing
        return f"usage:v:{visitor_id}:{date_str}", f"usage:ip:{ip_hash}:{date_str}"

    @classmethod
    def get_usage(cls, visitor_id: str, ip_address: str):
        if not redis_client:
            return 0
        
        v_key, ip_key = cls.get_user_key(visitor_id, ip_address)
        
        # Get counts for both ID and IP
        v_count = int(redis_client.get(v_key) or 0)
        ip_count = int(redis_client.get(ip_key) or 0)
        
        # Return the higher count to ensure limit is enforced if one is bypassed
        return max(v_count, ip_count)

    @classmethod
    def increment_usage(cls, visitor_id: str, ip_address: str):
        if not redis_client:
            return
        
        v_key, ip_key = cls.get_user_key(visitor_id, ip_address)
        
        # Increment both with 24h TTL
        pipe = redis_client.pipeline()
        pipe.incr(v_key)
        pipe.expire(v_key, 86400)
        pipe.incr(ip_key)
        pipe.expire(ip_key, 86400)
        pipe.execute()
        
        logger.info(f"Usage incremented for visitor {visitor_id} (IP hashed: {ip_key})")

    @classmethod
    def check_limit(cls, visitor_id: str, ip_address: str):
        current = cls.get_usage(visitor_id, ip_address)
        return current >= cls.DAILY_LIMIT, current
