'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wine, Sparkles, Heart, Share2, RefreshCw, ChevronDown } from 'lucide-react';

export default function Recommendations() {
  const [preferences, setPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favoritesOpen, setFavoritesOpen] = useState(true);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  const toggleFavorite = (wine: any) => {
    const exists = favorites.some((f) => f.wine_name === wine.wine_name);
    let newFavorites = exists 
      ? favorites.filter((f) => f.wine_name !== wine.wine_name)
      : [...favorites, wine];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const shareIndividual = async (wine: any) => {
    const text = `${wine.wine_name} ${wine.vintage} — ${wine.why_it_matches}`;
    if (navigator.share) await navigator.share({ title: wine.wine_name, text });
    else {
      await navigator.clipboard.writeText(text);
      alert('✅ Copied to clipboard!');
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
        body: JSON.stringify({ preferences, tenant_id: 'mcminnville-test' }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15, delay: i * 0.08 } })
  };

  return (
    <div className="min-h-screen pb-12 bg-[#F9F5F0] text-[#1F2521]">
      {/* Centered Header */}
      <div className="flex items-center justify-center pt-6 pb-4 border-b border-[#EDE8E0]">
        <div className="flex items-center gap-3">
          <Wine className="w-8 h-8 text-[#C36A4F]" />
          <h1 className="text-4xl font-bold tracking-tighter">SIP SAGE AI</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6">
        <form onSubmit={handleSubmit} className="mt-8">
          <textarea
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="Tell me what you're craving today..."
            className="w-full h-32 p-6 rounded-3xl border border-[#EDE8E0] bg-white text-[#1F2521] text-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#C36A4F]"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full py-7 rounded-3xl bg-[#C36A4F] hover:bg-[#B05A44] text-white text-2xl font-medium flex items-center justify-center gap-3 transition-all"
          >
            {loading ? <>Thinking <Sparkles className="animate-spin" /></> : <>Get Recommendations <Sparkles /></>}
          </button>
        </form>

        {result && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-light">Your Recommendations</h2>
              <button onClick={() => setResult(null)} className="text-[#C36A4F] flex items-center gap-2">
                <RefreshCw size={20} /> New Search
              </button>
            </div>

            <div className="grid gap-12">
              {result.recommendations.map((wine: any, index: number) => (
                <motion.div
                  key={index}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  whileHover={{ y: -8 }}
                  whileTap={{ scale: 0.98 }}
                  className="wine-card bg-white rounded-3xl shadow-md border border-[#EDE8E0] overflow-hidden p-8"
                >
                  <h3 className="text-4xl font-serif font-bold">{wine.wine_name} {wine.vintage}</h3>
                  <p className="mt-6 text-lg leading-relaxed opacity-90">{wine.tasting_note}</p>
                  <p className="mt-4 text-[#C36A4F] font-medium">{wine.why_it_matches}</p>

                  <div className="mt-12 grid grid-cols-2 gap-8">
                    <div>
                      <div className="text-xs uppercase tracking-widest opacity-60">BOTTLE</div>
                      <div className="text-6xl font-bold">${wine.price_bottle}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-widest opacity-60">BY THE GLASS</div>
                      <div className="text-6xl font-bold">${wine.price_glass}</div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-6 mt-8">
                    <motion.button onClick={() => toggleFavorite(wine)} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }} className="text-4xl">❤️</motion.button>
                    <motion.button onClick={() => shareIndividual(wine)} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }} className="text-[#1F2521]">
                      <Share2 size={32} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {favorites.length > 0 && (
          <div className="mt-16">
            <button onClick={() => setFavoritesOpen(!favoritesOpen)} className="flex items-center gap-3 text-xl font-medium">
              ❤️ Your Favorites
              <ChevronDown className={`transition-transform ${favoritesOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {favoritesOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-6 space-y-8">
                  {favorites.map((wine, i) => (
                    <motion.div key={i} className="flex justify-between items-start bg-white p-6 rounded-3xl border border-[#EDE8E0]">
                      <div>
                        <h4 className="text-2xl font-semibold">{wine.wine_name} {wine.vintage}</h4>
                        <p className="text-sm opacity-70">{wine.why_it_matches}</p>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={() => toggleFavorite(wine)} className="text-3xl">🗑️</button>
                        <button onClick={() => shareIndividual(wine)}><Share2 size={28} /></button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
