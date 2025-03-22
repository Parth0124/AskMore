from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from bson.objectid import ObjectId
from fastapi import HTTPException, status
from models.user_model import UserCreate, UserInDB, UserResponse
from core.database import get_database
from core.security import get_password_hash, verify_password, create_access_token

class AuthService:
    def __init__(self):
        self.db = None
        self.users_collection = None
        
    def _ensure_db(self):
        """Ensure database connection is established"""
        if self.db is None:
            self.db = get_database()
            self.users_collection = self.db["users"]
            
    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email"""
        self._ensure_db()
        user = await self.users_collection.find_one({"email": email})
        if user and "_id" in user:
            user["_id"] = str(user["_id"])  # Convert ObjectId to string
        return user
        
    async def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by id"""
        self._ensure_db()
        try:
            user = await self.users_collection.find_one({"_id": ObjectId(user_id)})
            if user and "_id" in user:
                user["_id"] = str(user["_id"])  # Convert ObjectId to string
            return user
        except Exception as e:
            print(f"Error fetching user by ID: {str(e)}")
            return None
            
    async def create_user(self, user_data: UserCreate) -> Dict[str, Any]:
        self._ensure_db()
        db_user = UserInDB(
            email=user_data.email,
            hashed_password=get_password_hash(user_data.password),
            chat_history=[]
        )
        
        # Exclude id field to let MongoDB generate ObjectId
        user_dict = db_user.model_dump(by_alias=True, exclude={"id"})
        
        result = await self.users_collection.insert_one(user_dict)
        created_user = await self.users_collection.find_one({"_id": result.inserted_id})
        
        if created_user:
            created_user["_id"] = str(created_user["_id"])
        return created_user
        
    async def authenticate_user(self, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate user with email and password"""
        self._ensure_db()
        user = await self.get_user_by_email(email)
        if not user:
            return None
        if not verify_password(password, user["hashed_password"]):
            return None
        return user
        
    # This method was causing confusion - it's already imported from core.security
    # Let's rename it to avoid the name conflict
    def generate_access_token(self, data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
        """Create access token"""
        return create_access_token(data, expires_delta)