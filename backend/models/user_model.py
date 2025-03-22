from datetime import datetime
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from bson import ObjectId
from typing import List, Optional, Annotated
from pydantic.functional_validators import BeforeValidator

# Helper to convert ObjectId to string
PyObjectId = Annotated[str, BeforeValidator(str)]

class ChatMessage(BaseModel):
    question: str
    answer: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserInDB(UserBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    hashed_password: str
    chat_history: List[ChatMessage] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
        populate_by_name=True,
    )

class UserResponse(UserBase):
    id: str = Field(alias="_id")
    chat_history: List[ChatMessage] = []
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(
        json_encoders={ObjectId: str},
        populate_by_name=True,
    )

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None