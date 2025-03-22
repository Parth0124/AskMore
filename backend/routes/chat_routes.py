from typing import List, Dict, Any, Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from services.chat_service import ChatService
from core.security import get_current_user, get_current_user_optional
from models.user_model import ChatMessage

chat_router = APIRouter()
chat_service = ChatService()

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    question: str
    answer: str

@chat_router.get("/", response_model=List[ChatMessage])
async def get_chat_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> List[ChatMessage]:
    """Get user's chat history"""
    try:
        chat_history = await chat_service.get_chat_history(current_user["user_id"], skip, limit)
        return chat_history
    except Exception as e:
        print(f"Error getting chat history: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve chat history"
        )

@chat_router.post("/ask", response_model=ChatResponse)
async def create_chat(
    chat_request: ChatRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional)
) -> ChatResponse:
    """Process a chat message and get response from RAG pipeline"""
    question = chat_request.question

    # Process question through RAG pipeline
    answer = await chat_service.process_question(question)

    # Store chat history only if user is logged in
    if current_user and current_user.get("user_id"):
        try:
            await chat_service.store_chat_message(current_user["user_id"], question, answer)
        except Exception as e:
            print(f"Error storing chat message: {str(e)}")

    return ChatResponse(question=question, answer=answer)
