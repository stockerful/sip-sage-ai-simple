'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wine, Sparkles, Heart, Share2, RefreshCw, ChevronDown, Moon, Sun } from 'lucide-react';

export default function Recommendations() {
  const [preferences, setPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favoritesOpen, setFavoritesOpen] = useState(true);

  useEffect(() => {
    const savedDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDark);
    if (savedDark) document.documentElement.classList.add('dark');

    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    if (newMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

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
    <div className={`min-h-screen pb-12 ${darkMode ? 'dark bg-black text-[#E7E9EA]' : 'bg-white text-[#0F1419]'}`}>
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#CFD9DE] dark:border-[#2F3336]">
        <div className="flex items-center gap-3">
          <Wine className="w-8 h-8 text-[#1D9BF0]" />
          <h1 className="text-4xl font-bold tracking-tighter">SIP SAGE AI</h1>
        </div>
        <button onClick={toggleDarkMode} className="p-3 rounded-2xl bg-white dark:bg-[#2F3336] border border-[#CFD9DE] dark:border-[#2F3336] hover:scale-110 transition-all">
          {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-6">
        <form onSubmit={handleSubmit} className="mt-8">
          <textarea
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="Tell me what you're craving today..."
            className="w-full h-32 p-6 rounded-3xl border border-[#CFD9DE] dark:border-[#2F3336] bg-white dark:bg-[#16181C] text-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#1D9BF0]"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full py-7 rounded-3xl bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white text-2xl font-medium flex items-center justify-center gap-3 transition-all"
          >
            {loading ? <>Thinking <Sparkles className="animate-spin" /></> : <>Get Recommendations <Sparkles /></>}
          </button>
        </form>

        {result && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-light">Your Recommendations</h2>
              <button onClick={() => setResult(null)} className="text-[#1D9BF0] flex items-center gap-2">
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
                  className="wine-card bg-white dark:bg-[#16181C] rounded-3xl shadow-md border border-[#CFD9DE] dark:border-[#2F3336] overflow-hidden p-8"
                >
                  <h3 className="text-4xl font-serif font-bold">{wine.wine_name} {wine.vintage}</h3>
                  <p className="mt-6 text-lg leading-relaxed opacity-90">{wine.tasting_note}</p>
                  <p className="mt-4 text-[#1D9BF0] font-medium">{wine.why_it_matches}</p>

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
                    <motion.button onClick={() => shareIndividual(wine)} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }} className="text-[#0F1419] dark:text-[#E7E9EA]">
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
                    <motion.div key={i} className="flex justify-between items-start bg-white dark:bg-[#16181C] p-6 rounded-3xl border border-[#CFD9DE] dark:border-[#2F3336]">
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
