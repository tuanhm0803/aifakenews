from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    database_url: str
    gemini_api_key: str = ""
    openai_api_key: str = ""
    ai_provider: str = "gemini"  # "gemini" or "openai"
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
