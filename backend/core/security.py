from datetime import datetime, timedelta
from typing import Optional, Union, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from fastapi.security.utils import get_authorization_scheme_param
from pydantic import BaseModel
from config.settings import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

class OAuth2PasswordBearerOptional:
    def __init__(self, tokenUrl: str):
        self.oauth2_scheme = OAuth2PasswordBearer(tokenUrl=tokenUrl, auto_error=False)

    async def __call__(self, request: Request) -> Optional[str]:
        authorization = request.headers.get("Authorization")
        if not authorization:
            return None
        scheme, param = get_authorization_scheme_param(authorization)
        if scheme.lower() != "bearer":
            return None
        return param

oauth2_scheme_optional = OAuth2PasswordBearerOptional(tokenUrl="/api/auth/login")

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hashed password"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password for storing"""
    return pwd_context.hash(password)

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create a new JWT token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict[str, Any]:
    """Get current user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        user_id: str = payload.get("user_id")
        
        if email is None or user_id is None:
            raise credentials_exception
            
        token_data = TokenData(email=email, user_id=user_id)
        return {"email": token_data.email, "user_id": token_data.user_id}
    except JWTError as e:
        print(f"JWT Error: {str(e)}")
        raise credentials_exception

async def get_current_user_optional(token: str = Depends(oauth2_scheme_optional)) -> Optional[Dict[str, Any]]:
    """
    Get current user from JWT token but return None if no valid token is provided
    instead of raising an exception.
    """
    if not token:
        return None
        
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        user_id: str = payload.get("user_id")
        
        if email is None or user_id is None:
            return None
            
        return {"email": email, "user_id": user_id}
    except JWTError as e:
        print(f"Optional JWT Error: {str(e)}")
        return None