"""
fileMind Backend — FastAPI Application Entry Point
Replaces the Express/Node.js backend with Python for:
- Magic Bytes file validation (Blue Team security)
- Smart Excel analysis (pandas)
- Job queue management (BullMQ-compatible Redis)
- Rate limiting
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from .config import get_settings
from .services.database import get_db_pool, close_db_pool
from .services.queue import close_redis
from .routers import tools, excel, ai_review


# ── Rate Limiter ──
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup & shutdown lifecycle."""
    settings = get_settings()
    print(f"[fileMind-API] Starting {settings.APP_NAME} Backend (Python/FastAPI)...")
    
    # Warm up DB pool on startup
    await get_db_pool()
    
    yield  # App is running
    
    # Cleanup on shutdown
    await close_db_pool()
    await close_redis()
    print("[fileMind-API] Shutdown complete.")


# ── App Instance ──
app = FastAPI(
    title="fileMind Backend API",
    description="Smart, Secure, & Fast File Processing — Python/FastAPI Gateway",
    version="2.0.0",
    lifespan=lifespan,
)

# ── Rate Limiting ──
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS ──
settings = get_settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health Check ──
@app.get("/")
async def health_check():
    return {"status": "healthy", "service": "fileMind Backend API", "stack": "Python/FastAPI"}


# ── Register Routers ──
app.include_router(tools.router)
app.include_router(excel.router)
app.include_router(ai_review.router)
