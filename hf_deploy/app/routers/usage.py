from fastapi import APIRouter, Request, Response
from app.services.usage_service import UsageService
import uuid

router = APIRouter(prefix="/usage", tags=["Usage Tracking"])

@router.get("/status")
async def get_usage_status(request: Request, response: Response):
    # Retrieve or create visitor ID from secure cookie
    visitor_id = request.cookies.get("visitor_id")
    if not visitor_id:
        visitor_id = str(uuid.uuid4())
        response.set_cookie(
            key="visitor_id", 
            value=visitor_id, 
            httponly=True, 
            max_age=86400 * 365, # 1 year
            samesite="lax"
        )
    
    # Get client IP (considering forwarders like Cloudflare/Railway)
    ip_address = request.client.host
    if "x-forwarded-for" in request.headers:
        ip_address = request.headers["x-forwarded-for"].split(",")[0]
        
    is_limit_reached, current_count = UsageService.check_limit(visitor_id, ip_address)
    
    return {
        "visitorId": visitor_id,
        "usageCount": current_count,
        "dailyLimit": UsageService.DAILY_LIMIT,
        "isLimitReached": is_limit_reached
    }
