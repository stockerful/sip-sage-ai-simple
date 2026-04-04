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
    <div className="min-h-screen bg-[#F8F9F7] font-sans pb-20">
      <div className="pt-10 pb-8 text-center border-b border-[#EDE8E0]">
        <h1 className="text-5xl font-serif tracking-[-1px] text-[#1F2521]">
          SIP SAGE AI
        </h1>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-8">
        <div className="bg-white rounded-3xl shadow-sm border border-[#EDE8E0] p-8 mb-12">
          <h2 className="text-2xl font-medium text-[#1F2521] mb-6 text-center">
            What kind of wine are you craving today?
          </h2>
          
          <form onSubmit={handleSubmit}>
            <textarea
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="Bright fruit-forward Pinot Noir... Earthy reds... Crisp Chardonnay..."
              className="w-full h-40 px-6 py-6 text-xl border border-[#EDE8E0] rounded-3xl focus:outline-none focus:border-[#1A3C35] resize-none leading-relaxed"
              disabled={loading}
            />
            
            <button
              type="submit"
              disabled={loading || !preferences.trim()}
              className="mt-8 w-full bg-[#1A3C35] hover:bg-[#132B28] active:scale-[0.97] disabled:bg-gray-300 text-white text-2xl font-medium py-7 rounded-3xl transition-all flex items-center justify-center gap-3 shadow-lg"
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

        {result && (
          <div className="space-y-16">
            <div className="text-center px-4">
              <p className="text-[#8A9E8E] text-lg leading-relaxed">
                {result.explanation || "Here are your personalized recommendations from the Willamette Valley."}
              </p>
            </div>

            <div className="space-y-16">
              {result.recommendations?.map((wine: any, index: number) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl shadow-md border border-[#EDE8E0] overflow-hidden p-8"
                >
                  {index > 0 && (
                    <div className="h-px bg-gradient-to-r from-transparent via-[#C36A4F] to-transparent mb-10"></div>
                  )}

                  <h3 className="text-4xl font-serif font-semibold text-[#1F2521] leading-none mb-8">
                    {wine.wine_name} <span className="text-4xl">{wine.vintage}</span>
                  </h3>

                  <p className="text-[#1A3C35] text-xl leading-relaxed mb-8">
                    {wine.tasting_note}
                  </p>

                  <div className="border-t border-[#EDE8E0] pt-8">
                    <div className="text-[#8A9E8E] uppercase text-sm tracking-widest mb-2">Why it matches</div>
                    <p className="text-[#1F2521] text-lg leading-relaxed">
                      {wine.why_it_matches}
                    </p>
                  </div>

                  <div className="mt-12 space-y-8">
                    <div className="flex items-baseline gap-4">
                      <div className="text-xs uppercase tracking-widest text-[#1F2521]">BOTTLE</div>
                      <div className="text-5xl font-bold text-[#1F2521]">${wine.price_bottle}</div>
                    </div>
                    <div className="flex items-baseline gap-4">
                      <div className="text-xs uppercase tracking-widest text-[#C36A4F]">BY THE GLASS</div>
                      <div className="text-5xl font-bold text-[#C36A4F]">${wine.price_glass}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={clearAll}
              className="w-full flex items-center justify-center gap-3 py-6 text-[#1A3C35] font-medium text-xl border-2 border-[#EDE8E0] rounded-3xl hover:bg-white active:scale-95 transition-all mx-auto max-w-xs"
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
