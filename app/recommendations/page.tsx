'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wine, Sparkles, RefreshCw, Heart, Share2 } from 'lucide-react';

export default function Recommendations() {
  const [preferences, setPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('sipSageFavorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const saveFavorites = (newFavorites: any[]) => {
    setFavorites(newFavorites);
    localStorage.setItem('sipSageFavorites', JSON.stringify(newFavorites));
  };

  const toggleFavorite = (wine: any) => {
    const isFavorited = favorites.some(f => f.wine_name === wine.wine_name);
    if (isFavorited) {
      saveFavorites(favorites.filter(f => f.wine_name !== wine.wine_name));
    } else {
      saveFavorites([...favorites, wine]);
    }
  };

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

  const shareFavorites = async () => {
    if (favorites.length === 0) return;

    const lines = favorites.map(w => 
      `• ${w.wine_name} ${w.vintage} — Bottle $${w.price_bottle} | Glass $${w.price_glass}`
    );

    const text = `My SIP SAGE AI Favorites from the tasting room:\n\n${lines.join('\n')}\n\nRecommended by SIP SAGE AI 🍷`;

    try {
      // Try native share first (best on iPhone)
      if (navigator.share) {
        await navigator.share({
          title: 'My Wine Favorites',
          text: text,
        });
        return;
      }

      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(text);
      setToast('✅ Copied to clipboard – ready to share!');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      console.error(err);
      setToast('Could not share. Try copying manually.');
      setTimeout(() => setToast(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9F7] font-sans pb-20">
      <div className="pt-10 pb-8 text-center border-b border-[#EDE8E0]">
        <h1 className="text-5xl font-serif tracking-[-1px] text-[#1F2521]">
          SIP SAGE AI
        </h1>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-8">
        {/* Prompt */}
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

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Heart className="text-red-500" size={24} fill="currentColor" />
                <h3 className="text-2xl font-medium text-[#1F2521]">Your Favorites</h3>
              </div>
              <button
                onClick={shareFavorites}
                className="flex items-center gap-2 text-[#1A3C35] font-medium text-sm border border-[#1A3C35]/30 px-5 py-2 rounded-3xl hover:bg-white transition-colors"
              >
                <Share2 size={18} />
                Share Favorites
              </button>
            </div>

            <div className="space-y-8">
              {favorites.map((wine, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl shadow-sm border border-[#EDE8E0] p-8"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-3xl font-serif font-semibold text-[#1F2521]">
                        {wine.wine_name} <span className="text-2xl text-[#8A9E8E]">{wine.vintage}</span>
                      </h4>
                      <p className="text-[#1A3C35] mt-3 line-clamp-2">{wine.tasting_note}</p>
                    </div>
                    <button
                      onClick={() => toggleFavorite(wine)}
                      className="text-3xl text-red-500 hover:text-red-600 transition-colors"
                    >
                      ❤️
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Current Results */}
        {result && (
          <div className="space-y-16">
            <div className="text-center px-4">
              <p className="text-[#8A9E8E] text-lg leading-relaxed">
                {result.explanation || "Here are your personalized recommendations from the Willamette Valley."}
              </p>
            </div>

            <div className="space-y-16">
              {result.recommendations?.map((wine: any, index: number) => (
                <motion.div
                  key={index}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08 } })
                  }}
                  whileHover={{ y: -8 }}
                  whileTap={{ scale: 0.98 }}
                  className="wine-card bg-white rounded-3xl shadow-md border border-[#EDE8E0] overflow-hidden p-8"
                >
                  {index > 0 && (
                    <div className="h-px bg-gradient-to-r from-transparent via-[#C36A4F] to-transparent mb-10"></div>
                  )}

                  <div className="flex justify-between items-start">
                    <h3 className="text-4xl font-serif font-semibold text-[#1F2521] leading-none mb-8">
                      {wine.wine_name} <span className="text-4xl">{wine.vintage}</span>
                    </h3>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(wine); }}
                      className="text-3xl transition-colors"
                    >
                      {favorites.some(f => f.wine_name === wine.wine_name) ? '❤️' : '♡'}
                    </button>
                  </div>

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
                </motion.div>
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

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#1F2521] text-white text-lg px-8 py-4 rounded-3xl shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
}
