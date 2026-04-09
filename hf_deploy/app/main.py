from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import get_settings
from .services.database import get_db_pool, close_db_pool
from .services.queue import close_redis
from .routers import tools, excel, ai_review, roadmap, usage

@asynccontextmanager
async def lifespan(app: FastAPI):
        # Warm up DB pool on startup
        await get_db_pool()
        yield
        # Cleanup on shutdown
        await close_db_pool()
        await close_redis()

app = FastAPI(title="fileMind Backend API", lifespan=lifespan)

app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["Content-Disposition"]
)

@app.get("/")
async def health_check():
        return {"status": "healthy", "service": "fileMind Backend API"}

app.include_router(tools.router)
app.include_router(excel.router)
app.include_router(ai_review.router)
app.include_router(roadmap.router)
app.include_router(usage.router)