from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import router as api_router

app = FastAPI(title="SIP SAGE AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://sip-sage-ai-simple.vercel.app",
        "https://sip-sage-ai-simple-git-main-stockerful.vercel.app",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {"status": "ok", "message": "SIP SAGE AI Backend is running"}
