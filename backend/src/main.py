from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from src.services.recommendation_service import recommendation_service

app = FastAPI(title="SIP SAGE AI")

# CORS - Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RecommendationRequest(BaseModel):
    preferences: str
    tenant_id: str = "default"

@app.post("/api/recommend")
async def get_recommendations(request: RecommendationRequest):
    try:
        # Call the service (no await needed anymore)
        result = recommendation_service.get_recommendations(
            preferences=request.preferences,
            tenant_id=request.tenant_id
        )
        return result
    except Exception as e:
        print(f"Error in /api/recommend: {str(e)}")
        return {
            "explanation": "Sorry, something went wrong. Here's a safe recommendation.",
            "recommendations": []
        }

@app.get("/")
def health_check():
    return {"status": "healthy", "message": "SIP SAGE AI backend is running"}
