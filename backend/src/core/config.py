from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List

class Settings(BaseSettings):
    # Supabase
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_KEY: str

    # Database
    DATABASE_URL: str

    # AI Providers (optional for now)
    ANTHROPIC_API_KEY: str = ""
    GROQ_API_KEY: str = ""

    # Vector DB (for later)
    PINECONE_API_KEY: str = ""
    PINECONE_INDEX_NAME: str = "oregon-wine-host"

    # App settings
    ENVIRONMENT: str = "development"
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

@lru_cache()
def get_settings() -> Settings:
    return Settings()
