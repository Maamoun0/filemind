import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
        APP_NAME: str = "fileMind Backend"
        DATABASE_URL: str = os.getenv("DATABASE_URL", "postgres://user:pass@localhost:5432/db")
        REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")

def get_settings():
                return Settings()