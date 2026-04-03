'use client';

import { useState } from 'react';

// FORCED FRESH BUILD - $(date) - Voice input removed to fix Vercel TypeScript error

export default function Recommendations() {
  const [preferences, setPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

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

      if (!res.ok) throw new Error('Backend error');

      const data = await res.json();
      setResult(data);

      setHistory(prev => [{
        preferences,
        timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        result: data
      }, ...prev].slice(0, 6));

    } catch (error) {
      console.error('Error:', error);
      alert('Could not get recommendations. Is the backend running?');
    }
    setLoading(false);
  };

  const clearAll = () => {
    setPreferences('');
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F4EB] text-gray-900 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-gradient-to-r from-[#4A0F1F] to-[#A65E3C] rounded-full"></div>
            <span className="text-sm tracking-[4px] text-[#4A0F1F] font-medium">WILLAMETTE VALLEY • OREGON</span>
          </div>
          <h1 className="text-7xl font-serif text-[#2C2C2C] tracking-tighter leading-none mb-4">
            SIP SAGE AI
          </h1>
          <p className="text-2xl text-[#6F7F5F] font-light tracking-wide">
            Wine is better when it's personal
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-12 mb-16 border border-[#D4C9B8]">
          <form onSubmit={handleSubmit}>
            <label className="text-base uppercase tracking-widest text-[#6F7F5F] font-medium block mb-4">
              Guest's Taste Profile
            </label>

            <textarea
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="Describe the guest's taste (e.g. bright fruit-forward Pinot Noir with good acidity)"
              className="w-full h-52 p-8 text-2xl border border-[#D4C9B8] rounded-3xl focus:outline-none focus:border-[#4A0F1F] resize-y bg-white text-black placeholder:text-gray-400 leading-relaxed"
              disabled={loading}
            />

            <div className="flex gap-4 mt-10">
              <button
                type="submit"
                disabled={loading || !preferences.trim()}
                className="flex-1 bg-[#4A0F1F] hover:bg-[#5C1328] disabled:bg-gray-400 text-white py-7 rounded-3xl text-2xl font-semibold tracking-wide transition-all active:scale-[0.985]"
              >
                {loading ? 'Consulting the vines...' : 'Find Matches'}
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="px-12 py-7 border border-[#D4C9B8] rounded-3xl text-xl text-gray-600 hover:bg-[#F8F4EB] transition font-medium"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {result && (
          <div className="space-y-16">
            <div className="bg-white border border-[#D4C9B8] rounded-3xl p-12 text-center">
              <p className="text-3xl text-[#2C2C2C] leading-relaxed font-light italic">
                {result.explanation}
              </p>
            </div>

            {result.recommendations && result.recommendations.length > 0 && (
              <div className="space-y-16">
                {result.recommendations.map((wine: any, index: number) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-3xl overflow-hidden border border-[#D4C9B8] shadow-sm hover:shadow-2xl transition-all duration-700"
                  >
                    <div className="h-2.5 bg-gradient-to-r from-[#4A0F1F] via-[#A65E3C] to-[#C17A5A]"></div>
                    
                    <div className="p-16">
                      <div className="mb-14">
                        <h3 className="text-6xl font-serif text-[#2C2C2C] tracking-[-1.5px] font-semibold leading-none">
                          {wine.wine_name} <span className="text-5xl font-semibold text-[#6F7F5F]">{wine.vintage}</span>
                        </h3>
                      </div>

                      <p className="text-gray-800 text-[21px] leading-[1.75] mb-14">
                        {wine.tasting_note}
                      </p>

                      <div className="bg-[#F8F4EB] border-l-4 border-[#4A0F1F] pl-12 py-9 rounded-r-3xl mb-14">
                        <p className="uppercase text-sm tracking-[2.5px] text-[#4A0F1F] font-medium mb-5">The Match</p>
                        <p className="text-gray-800 text-[21px] leading-relaxed">
                          {wine.why_it_matches}
                        </p>
                      </div>

                      <div className="space-y-12">
                        <div className="flex items-center gap-8">
                          <div className="w-40">
                            <div className="text-sm uppercase tracking-[3px] text-[#2C2C2C] font-medium">BOTTLE</div>
                          </div>
                          <div className="text-6xl font-bold text-[#2C2C2C]">
                            ${wine.price_bottle}
                          </div>
                        </div>

                        <div className="flex items-center gap-8">
                          <div className="w-40">
                            <div className="text-sm uppercase tracking-[3px] text-[#A65E3C] font-medium">BY THE GLASS</div>
                          </div>
                          <div className="text-6xl font-bold text-[#4A0F1F]">
                            ${wine.price_glass}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-24 pt-16 border-t border-gray-200">
            <p className="uppercase text-sm tracking-[3px] text-[#6F7F5F] mb-8 font-medium">Recent Guest Conversations</p>
            <div className="space-y-5">
              {history.map((item, i) => (
                <div key={i} className="bg-white px-8 py-6 rounded-3xl text-xl text-gray-700 flex justify-between items-center border border-[#D4C9B8]">
                  <span className="line-clamp-1">{item.preferences}</span>
                  <span className="text-base text-gray-400 font-mono">{item.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// Fresh commit to force Vercel build - Fri Apr  3 13:02:32 PDT 2026
