'use client';

import { useState } from 'react';
import { Wine, Sparkles, RefreshCw } from 'lucide-react';

export default function Recommendations() {
  const [preferences, setPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferences.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('https://sip-sage-ai-backend.onrender.com/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const clearAll = () => {
    setPreferences('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] font-sans pb-12">
      {/* Clean centered header */}
      <div className="pt-8 pb-6 text-center border-b border-[#E8E2D5]">
        <h1 className="text-5xl font-serif tracking-tighter text-[#2C2C2C]">
          SIP SAGE AI
        </h1>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-8">
        {/* Prompt Area - more app-like */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#D4C9B8] p-8 mb-12">
          <h2 className="text-2xl font-medium text-[#2C2C2C] mb-6 text-center">
            What kind of wine are you craving today?
          </h2>
          
          <form onSubmit={handleSubmit}>
            <textarea
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="Bright fruit-forward Pinot Noir... Earthy reds... Crisp Chardonnay..."
              className="w-full h-36 px-6 py-5 text-xl border border-[#D4C9B8] rounded-3xl focus:outline-none focus:border-[#4A0F1F] resize-none leading-relaxed"
              disabled={loading}
            />
            
            <button
              type="submit"
              disabled={loading || !preferences.trim()}
              className="mt-6 w-full bg-[#4A0F1F] hover:bg-[#3A0C18] active:scale-[0.97] disabled:bg-gray-300 text-white text-2xl font-medium py-7 rounded-3xl transition-all flex items-center justify-center gap-3 shadow-md"
            >
              {loading ? (
                <>
                  <Sparkles className="animate-spin" size={28} />
                  Finding perfect matches...
                </>
              ) : (
                <>
                  <Wine size={28} />
                  Get Recommendations
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results - addictive card flow */}
        {result && (
          <div className="space-y-16">
            <div className="text-center">
              <p className="text-[#6F7F5F] text-lg max-w-md mx-auto">
                {result.explanation || "Here are your personalized recommendations from the Willamette Valley."}
              </p>
            </div>

            <div className="space-y-16">
              {result.recommendations?.map((wine: any, index: number) => (
                <div
                  key={index}
                  className="wine-card bg-white rounded-3xl shadow-md border border-[#D4C9B8] overflow-hidden p-8 active:scale-[1.02] transition-all"
                >
                  {/* Strong visible divider */}
                  {index > 0 && (
                    <div className="h-1 bg-[#8C6F5C] w-20 mx-auto mb-10 rounded-full"></div>
                  )}

                  <div>
                    <h3 className="text-4xl font-serif font-semibold text-[#2C2C2C] leading-none mb-1">
                      {wine.wine_name}
                    </h3>
                    <span className="text-3xl text-[#6F7F5F]">{wine.vintage}</span>
                  </div>

                  <p className="text-[#4A0F1F] text-xl leading-relaxed my-8">
                    {wine.tasting_note}
                  </p>

                  <div className="border-t border-[#D4C9B8] pt-8">
                    <div className="text-[#6F7F5F] uppercase text-sm tracking-widest mb-2">Why it matches</div>
                    <p className="text-[#2C2C2C] text-lg leading-relaxed">
                      {wine.why_it_matches}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mt-12">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-[#A65E3C]">By the Glass</div>
                      <div className="text-5xl font-bold text-[#4A0F1F]">${wine.price_glass}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-widest text-[#2C2C2C]">Bottle</div>
                      <div className="text-5xl font-bold text-[#2C2C2C]">${wine.price_bottle}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* New Recommendation button - always visible after results */}
            <button
              onClick={clearAll}
              className="w-full flex items-center justify-center gap-3 py-5 text-[#4A0F1F] font-medium text-xl border border-[#D4C9B8] rounded-3xl hover:bg-white active:scale-95 transition-all"
            >
              <RefreshCw size={22} />
              Try Another Recommendation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
