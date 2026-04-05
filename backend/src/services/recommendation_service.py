from pydantic_settings import BaseSettings
import requests
import json
import re
from typing import Dict, Any

class Settings(BaseSettings):
    GROK_API_KEY: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

class RecommendationService:
    def __init__(self):
        self.grok_key = settings.GROK_API_KEY.strip()
        if not self.grok_key:
            print("⚠️  WARNING: GROK_API_KEY is missing from .env file")
        else:
            print(f"✅ Grok API key loaded ({len(self.grok_key)} characters)")

    def _dynamic_mock(self, preferences: str) -> Dict[str, Any]:
        """Safe fallback when Grok fails"""
        return {
            "explanation": f"Based on your preference: {preferences}",
            "recommendations": [
                {
                    "wine_name": "Domaine Drouhin Oregon Pinot Noir",
                    "vintage": "2020",
                    "tasting_note": "Elegant with bright cherry, raspberry, and subtle earth notes. Classic Dundee Hills Pinot.",
                    "why_it_matches": "Matches your preference for bright, fruit-forward Pinots with good acidity.",
                    "price_glass": 18,
                    "price_bottle": 68
                },
                {
                    "wine_name": "Eyrie Vineyards Original Vines Pinot Noir",
                    "vintage": "2022",
                    "tasting_note": "Complex with forest floor, red currant, and silky texture.",
                    "why_it_matches": "Perfect for someone who enjoys earthy, old-world style Pinots.",
                    "price_glass": 22,
                    "price_bottle": 85
                }
            ]
        }

    def get_recommendations(self, preferences: str, tenant_id: str = "default") -> Dict[str, Any]:
        if not self.grok_key:
            print("No Grok key found - using mock")
            return self._dynamic_mock(preferences)

        try:
            prompt = f"""You are an expert sommelier at a Willamette Valley tasting room.
Guest preference: "{preferences}"

Return exactly 3 current wines from our inventory in this exact JSON format:
{{
  "explanation": "One short friendly sentence",
  "recommendations": [
    {{
      "wine_name": "Full wine name",
      "vintage": "Year",
      "tasting_note": "Beautiful tasting note",
      "why_it_matches": "Why it matches the guest",
      "price_glass": number,
      "price_bottle": number
    }}
  ]
}}

Only return valid JSON. No extra text."""

            response = requests.post(
                "https://api.x.ai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.grok_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "grok-3",
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.7,
                    "max_tokens": 1200
                },
                timeout=35
            )

            if response.status_code == 200:
                data = response.json()
                ai_text = data["choices"][0]["message"]["content"]
                
                # Try to extract JSON
                json_match = re.search(r'\{.*\}', ai_text, re.DOTALL)
                if json_match:
                    try:
                        return json.loads(json_match.group(0))
                    except:
                        pass
                
                # Fallback if JSON parsing fails
                return {"explanation": ai_text.strip(), "recommendations": []}
            
            else:
                print(f"Grok API error {response.status_code}: {response.text[:200]}")
                return self._dynamic_mock(preferences)

        except Exception as e:
            print(f"Grok call failed: {str(e)}")
            return self._dynamic_mock(preferences)

# Singleton
recommendation_service = RecommendationService()
