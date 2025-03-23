from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routes.auth_routes import auth_router
from routes.chat_routes import chat_router
from core.database import connect_to_mongodb, close_mongodb_connection
import uvicorn

app = FastAPI(title="Academic Chatbot API", description="Backend for academic-specific chatbot with RAG pipeline")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to the AskMore Backend API"}

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(chat_router, prefix="/api/chat", tags=["Chats"])

@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongodb()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongodb_connection()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)