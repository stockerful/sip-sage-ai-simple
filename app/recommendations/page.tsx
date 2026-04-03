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
    <div className="min-h-screen bg-[#F8F4EB] font-sans">
      {/* Header */}
      <div className="bg-white border-b border-[#D4C9B8] shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4A0F1F] rounded-2xl flex items-center justify-center text-white text-2xl">🍷</div>
            <div>
              <h1 className="text-3xl font-serif tracking-tight text-[#2C2C2C]">SIP SAGE AI</h1>
              <p className="text-[#6F7F5F] text-sm tracking-widest">Willamette Valley • Oregon</p>
            </div>
          </div>
          <button
            onClick={clearAll}
            className="flex items-center gap-2 px-5 py-3 text-[#4A0F1F] hover:bg-[#F8F4EB] rounded-3xl transition-colors font-medium"
          >
            <RefreshCw size={20} />
            New Recommendation
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Prompt Area */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#D4C9B8] p-8 mb-12">
          <h2 className="text-2xl font-medium text-[#2C2C2C] mb-6">What kind of wine are you craving today?</h2>
          
          <form onSubmit={handleSubmit}>
            <textarea
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="Bright fruit-forward Pinot Noir... Earthy reds... Crisp Chardonnay..."
              className="w-full h-32 px-6 py-5 text-xl border border-[#D4C9B8] rounded-3xl focus:outline-none focus:border-[#4A0F1F] resize-none"
              disabled={loading}
            />
            
            <button
              type="submit"
              disabled={loading || !preferences.trim()}
              className="mt-6 w-full bg-[#4A0F1F] hover:bg-[#3A0C18] disabled:bg-gray-300 text-white text-2xl font-medium py-6 rounded-3xl transition-all flex items-center justify-center gap-3"
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

        {/* Results */}
        {result && (
          <div className="space-y-12">
            <div className="text-center">
              <p className="text-[#6F7F5F] text-lg max-w-md mx-auto">
                {result.explanation || "Here are your personalized recommendations from the Willamette Valley."}
              </p>
            </div>

            <div className="grid gap-12">
              {result.recommendations?.map((wine: any, index: number) => (
                <div
                  key={index}
                  className="wine-card bg-white rounded-3xl shadow-sm border border-[#D4C9B8] overflow-hidden p-8"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-4xl font-serif font-semibold text-[#2C2C2C] leading-none">
                        {wine.wine_name} <span className="text-3xl text-[#6F7F5F]">{wine.vintage}</span>
                      </h3>
                    </div>
                  </div>

                  <p className="text-[#4A0F1F] text-xl leading-relaxed mb-8">
                    {wine.tasting_note}
                  </p>

                  <div className="border-t border-[#D4C9B8] pt-8">
                    <div className="text-[#6F7F5F] uppercase text-sm tracking-widest mb-2">Why it matches</div>
                    <p className="text-[#2C2C2C] text-lg leading-relaxed">
                      {wine.why_it_matches}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mt-10">
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
          </div>
        )}
      </div>
    </div>
  );
}
