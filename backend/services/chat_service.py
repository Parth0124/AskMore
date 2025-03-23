from typing import List, Dict, Any
from datetime import datetime
from bson.objectid import ObjectId
from fastapi import HTTPException, status
from core.database import get_database
from rag.pipeline import RAGPipeline
from models.user_model import ChatMessage

class ChatService:
    def __init__(self):
        self.db = None
        self.users_collection = None
        self.rag_pipeline = RAGPipeline()

    async def _ensure_db(self):
        """Ensure database connection is established"""
        if self.db is None:
            self.db = get_database()
            self.users_collection = self.db["users"]

    async def get_chat_history(self, user_id: str, skip: int = 0, limit: int = 50) -> List[ChatMessage]:
        """Get chat history for a user"""
        await self._ensure_db()
        try:
            user = await self.users_collection.find_one({"_id": ObjectId(user_id)})
            if not user:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

            chat_history = user.get("chat_history", [])
            sorted_history = sorted(chat_history, key=lambda x: x.get("timestamp", datetime.min), reverse=True)
            return sorted_history[skip:skip + limit]
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    async def store_chat_message(self, user_id: str, question: str, answer: str) -> None:
        self._ensure_db()
        try:
            user = await self.users_collection.find_one({"_id": ObjectId(user_id)})
            if not user:
                raise HTTPException(status_code=404, detail="User not found")

            chat_message = {
                "question": question,
                "answer": answer,
                "timestamp": datetime.utcnow()
            }

            result = await self.users_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$push": {"chat_history": chat_message}}
            )

            if result.modified_count == 0:
                print(f"No documents modified for user {user_id}")
            
        except Exception as e:
            print(f"Storage Error: {str(e)}")
            raise HTTPException(status_code=500, detail="Chat save failed")
    
    async def process_question(self, question: str) -> str:
        """Process a question through the RAG pipeline"""
        try:
            return await self.rag_pipeline.query(question)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
