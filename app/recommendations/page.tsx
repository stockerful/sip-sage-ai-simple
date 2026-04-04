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
    <div className="min-h-screen bg-[#F9F5ED] font-sans pb-20">
      {/* Header */}
      <div className="pt-10 pb-8 text-center border-b border-[#E5D9C8]">
        <h1 className="text-5xl font-serif tracking-[-1px] text-[#1F1F1F]">
          SIP SAGE AI
        </h1>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-8">
        {/* Prompt */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#E5D9C8] p-8 mb-12">
          <h2 className="text-2xl font-medium text-[#1F1F1F] mb-6 text-center">
            What kind of wine are you craving today?
          </h2>
          
          <form onSubmit={handleSubmit}>
            <textarea
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="Bright fruit-forward Pinot Noir... Earthy reds... Crisp Chardonnay..."
              className="w-full h-40 px-6 py-6 text-xl border border-[#E5D9C8] rounded-3xl focus:outline-none focus:border-[#3F1A2E] resize-none leading-relaxed"
              disabled={loading}
            />
            
            <button
              type="submit"
              disabled={loading || !preferences.trim()}
              className="mt-8 w-full bg-[#3F1A2E] hover:bg-[#2C1321] active:scale-[0.97] disabled:bg-gray-300 text-white text-2xl font-medium py-7 rounded-3xl transition-all flex items-center justify-center gap-3 shadow-lg"
            >
              {loading ? (
                <>
                  <Sparkles className="animate-spin" size={28} />
                  Thinking...
                </>
              ) : (
                <>
                  <Wine size={28} />
                  Get My Recommendations
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-16">
            <div className="text-center px-4">
              <p className="text-[#5E7A5E] text-lg leading-relaxed">
                {result.explanation || "Here are your personalized recommendations from the Willamette Valley."}
              </p>
            </div>

            <div className="space-y-16">
              {result.recommendations?.map((wine: any, index: number) => (
                <div
                  key={index}
                  className="wine-card bg-white rounded-3xl shadow-md border border-[#E5D9C8] overflow-hidden p-8 active:scale-[1.02] transition-all"
                >
                  {index > 0 && (
                    <div className="h-px bg-gradient-to-r from-transparent via-[#D4A017] to-transparent mb-10"></div>
                  )}

                  <h3 className="text-4xl font-serif font-semibold text-[#1F1F1F] leading-none mb-1">
                    {wine.wine_name}
                  </h3>
                  <span className="text-3xl text-[#5E7A5E] block mb-8">{wine.vintage}</span>

                  <p className="text-[#3F1A2E] text-xl leading-relaxed mb-8">
                    {wine.tasting_note}
                  </p>

                  <div className="border-t border-[#E5D9C8] pt-8">
                    <div className="text-[#5E7A5E] uppercase text-sm tracking-widest mb-2">Why it matches</div>
                    <p className="text-[#1F1F1F] text-lg leading-relaxed">
                      {wine.why_it_matches}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mt-12">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-[#D4A017]">By the Glass</div>
                      <div className="text-5xl font-bold text-[#3F1A2E]">${wine.price_glass}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-widest text-[#1F1F1F]">Bottle</div>
                      <div className="text-5xl font-bold text-[#1F1F1F]">${wine.price_bottle}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={clearAll}
              className="w-full flex items-center justify-center gap-3 py-6 text-[#3F1A2E] font-medium text-xl border-2 border-[#E5D9C8] rounded-3xl hover:bg-white active:scale-95 transition-all mx-auto max-w-xs"
            >
              <RefreshCw size={24} />
              New Recommendation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
