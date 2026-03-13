"""
fileMind Backend — Configuration & Environment
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    APP_NAME: str = "fileMind"
    DEBUG: bool = False
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    FRONTEND_URL: str = "https://filemind-ai.vercel.app"
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/filemind"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # File Processing
    TEMP_DIR: str = "./temp_uploads"
    MAX_UPLOAD_SIZE_MB: int = 150  # Hard ceiling
    FILE_EXPIRY_HOURS: int = 1    # Zero permanent storage
    
    # C# DocService (Phase 3)
    DOCSERVICE_URL: str = "http://localhost:5000"
    
    # AI Double-Check System
    AI_DOUBLE_CHECK_ENABLED: bool = True
    AI_API_KEY: str = ""                    # OpenAI/Anthropic key for production
    AI_REVIEW_CACHE_TTL_HOURS: int = 24     # Cache review results for 24 hours
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()
