from typing import List, Dict, Any
from langchain_openai import OpenAIEmbeddings
from langchain_core.documents import Document
from config.settings import settings

class EmbeddingManager:
    def __init__(self):
        self.model_name = settings.EMBEDDING_MODEL
        self.embeddings = OpenAIEmbeddings(
            model=self.model_name,
            openai_api_key=settings.OPENAI_API_KEY
        )
    
    def get_embeddings(self):
        """Get embedding model"""
        return self.embeddings