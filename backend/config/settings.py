import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    MONGO_CONNECTION_STRING: str = os.getenv("MONGO_CONNECTION_STRING", "mongodb://localhost:27017")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "academic_chatbot")
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    CHAT_MODEL: str = "gpt-4-turbo"
    
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    DATA_DIR: str = os.getenv("DATA_DIR", "data")
    
    VECTOR_DB_DIR: str = os.getenv("VECTOR_DB_DIR", "vector_db")

settings = Settings()