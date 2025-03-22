import os
from typing import List, Dict, Any
from langchain_core.documents import Document
from langchain_core.vectorstores import VectorStore
from langchain_community.vectorstores import FAISS
from rag.embeddings import EmbeddingManager
from config.settings import settings

class VectorStoreManager:
    def __init__(self):
        self.embedding_manager = EmbeddingManager()
        self.embeddings = self.embedding_manager.get_embeddings()
        self.vector_db_path = settings.VECTOR_DB_DIR
    
    def create_vector_store(self, documents: List[Document]) -> VectorStore:
        """Create a vector store from documents"""
        vector_store = FAISS.from_documents(documents, self.embeddings)
        
        # Create directory if it doesn't exist
        os.makedirs(self.vector_db_path, exist_ok=True)
        
        # Save vector store to disk
        vector_store.save_local(self.vector_db_path)
        print(f"Saved vector store to {self.vector_db_path}")
        
        return vector_store
    
    def load_vector_store(self) -> VectorStore:
        """Load vector store from disk"""
        if not os.path.exists(self.vector_db_path):
            raise FileNotFoundError(f"Vector store not found at {self.vector_db_path}")
        
        vector_store = FAISS.load_local(
            self.vector_db_path, 
            self.embeddings,
            allow_dangerous_deserialization=True  # Add this parameter
        )
    
        print(f"Loaded vector store from {self.vector_db_path}")
        return vector_store
    
    def vector_store_exists(self) -> bool:
        """Check if vector store exists"""
        return os.path.exists(self.vector_db_path) and os.path.isdir(self.vector_db_path)