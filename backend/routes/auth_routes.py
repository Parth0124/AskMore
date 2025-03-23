from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Form
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any
from models.user_model import UserCreate, UserResponse, Token, LoginRequest
from services.auth_service import AuthService
from config.settings import settings

auth_router = APIRouter()
auth_service = AuthService()

@auth_router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate) -> Any:
    """Register a new user"""
    existing_user = await auth_service.get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists"
        )
    user = await auth_service.create_user(user_data)
    return user

@auth_router.post("/login", response_model=Token)
async def login_with_form(form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    """Authenticate and login user with form data"""
    user = await auth_service.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_service.generate_access_token(
        data={"sub": user["email"], "user_id": str(user["_id"])},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@auth_router.post("/login/json", response_model=Token)
async def login_with_json(login_data: LoginRequest) -> Any:
    """Authenticate and login user with JSON data"""
    user = await auth_service.authenticate_user(login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_service.generate_access_token(
        data={"sub": user["email"], "user_id": str(user["_id"])},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}