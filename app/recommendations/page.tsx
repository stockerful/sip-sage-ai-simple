'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wine, Sparkles, RefreshCw, Heart, Share2, ChevronDown } from 'lucide-react';

export default function Recommendations() {
  const [preferences, setPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
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

  const shareIndividual = async (wine: any) => {
    const text = `🍷 SIP SAGE AI Favorite\n${wine.wine_name} ${wine.vintage}\n${wine.tasting_note}\n\nBottle $${wine.price_bottle} | Glass $${wine.price_glass}\n\n#SipSageAI #OregonWine`;

    try {
      if (navigator.share) {
        await navigator.share({ title: 'My Wine Favorite', text });
      } else {
        await navigator.clipboard.writeText(text);
        setToast('✅ Copied to clipboard!');
        setTimeout(() => setToast(''), 2500);
      }
    } catch (err) {
      console.error(err);
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

  return (
    <div className="min-h-screen bg-[#F8F9F7] font-sans pb-20">
      <div className="pt-10 pb-8 text-center border-b border-[#EDE8E0]">
        <h1 className="text-5xl font-serif tracking-[-1px] text-[#1F2521]">
          SIP SAGE AI
        </h1>
      </div>

      <div className="max-w-3xl mx-auto px-6 pt-8">
        {/* Prompt Area */}
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

        {/* Favorites Section - Collapsible */}
        {favorites.length > 0 && (
          <div className="mb-16">
            <button
              onClick={() => setFavoritesOpen(!favoritesOpen)}
              className="w-full flex items-center justify-between bg-white rounded-3xl shadow-sm border border-[#EDE8E0] px-8 py-6 text-left hover:bg-[#F8F9F7] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Heart className="text-red-500" size={24} fill="currentColor" />
                <h3 className="text-2xl font-medium text-[#1F2521]">Your Favorites</h3>
                <span className="text-sm text-[#8A9E8E] bg-[#F8F9F7] px-3 py-1 rounded-2xl">{favorites.length}</span>
              </div>
              <ChevronDown size={24} className={`transition-transform ${favoritesOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {favoritesOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-6 mt-6 overflow-hidden"
                >
                  {favorites.map((wine, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-3xl shadow-sm border border-[#EDE8E0] p-8"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="text-3xl font-serif font-semibold text-[#1F2521]">
                            {wine.wine_name} <span className="text-2xl text-[#8A9E8E]">{wine.vintage}</span>
                          </h4>
                          <p className="text-[#1A3C35] mt-3 line-clamp-2">{wine.tasting_note}</p>
                        </div>

                        <div className="flex items-center gap-6">
                          {/* Seamless X.com-style Heart */}
                          <button
                            onClick={() => toggleFavorite(wine)}
                            className="text-3xl transition-all hover:scale-110 active:scale-95 text-red-500"
                          >
                            ❤️
                          </button>

                          {/* Seamless X.com-style Share */}
                          <button
                            onClick={() => shareIndividual(wine)}
                            className="text-[#1F2521] hover:text-[#1A3C35] transition-all hover:scale-110 active:scale-95"
                          >
                            <Share2 size={26} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
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
                      className="text-3xl transition-all hover:scale-110 active:scale-95 text-red-500"
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
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#1F2521] text-white text-lg px-8 py-4 rounded-3xl shadow-2xl z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
