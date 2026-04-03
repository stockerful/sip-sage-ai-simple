from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import os

app = FastAPI(title="SIP SAGE AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://sip-sage-ai-simple.vercel.app", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROK_API_KEY = os.getenv("GROK_API_KEY")

@app.get("/")
async def root():
    return {"status": "ok", "message": "SIP SAGE AI Backend is running"}

@app.post("/api/recommend")
async def get_recommendations(data: dict):
    preferences = data.get("preferences", "")
    
    if not GROK_API_KEY:
        return {"error": "GROK_API_KEY not set", "recommendations": [], "explanation": "Backend key missing"}

    # Call Grok-3
    try:
        response = requests.post(
            "https://api.x.ai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROK_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "grok-3",
                "messages": [
                    {"role": "system", "content": "You are a wine expert for Willamette Valley tasting rooms. Return ONLY valid JSON with keys: 'explanation' and 'recommendations' (array of 3 wines with wine_name, vintage, tasting_note, why_it_matches, price_glass, price_bottle)."},
                    {"role": "user", "content": f"Guest said: {preferences}. Recommend 3 wines from Oregon."}
                ],
                "temperature": 0.7
            },
            timeout=30
        )
        grok_data = response.json()
        content = grok_data["choices"][0]["message"]["content"]
        
        # Try to parse JSON from Grok response
        import json
        try:
            result = json.loads(content)
        except:
            result = {"explanation": content, "recommendations": []}
            
        return result
    except Exception as e:
        return {"error": str(e), "recommendations": [], "explanation": "Grok call failed"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
