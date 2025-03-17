from fastapi import FastAPI
from routes.auth import router as auth_router
from routes.chat import router as chat_router

app = FastAPI(title="Academic Chatbot API")

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(chat_router, prefix="/chat", tags=["Chat"])

@app.get("/")
def root():
    return {"message": "Welcome to the Academic Chatbot API"}
