'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Wine, Sparkles, Heart, Share2, RefreshCw, ChevronDown, Star } from 'lucide-react';

export default function Recommendations() {
  const [preferences, setPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favoritesOpen, setFavoritesOpen] = useState(true);
  const [ratings, setRatings] = useState<{[key: string]: number}>({});

  const getAverageRating = (wine: any) => {
    const key = `${wine.wine_name}-${wine.vintage || ''}`;
    const averages: {[key: string]: {rating: number, count: number}} = {
      'Domaine Drouhin': { rating: 4.7, count: 23 },
      'Eyrie Vineyards': { rating: 4.9, count: 31 },
      'Patricia Green': { rating: 4.4, count: 15 },
    };
    return averages[key] || { rating: 4.5, count: 18 };
  };

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const savedRatings = JSON.parse(localStorage.getItem('wineRatings') || '{}');
    setFavorites(savedFavorites);
    setRatings(savedRatings);
  }, []);

  const getWineKey = (wine: any) => `${wine.wine_name}-${wine.vintage || ''}`;

  const rateWine = (wine: any, rating: number) => {
    const key = getWineKey(wine);
    const newRatings = { ...ratings, [key]: rating };
    setRatings(newRatings);
    localStorage.setItem('wineRatings', JSON.stringify(newRatings));
  };

  const toggleFavorite = (wine: any) => {
    const key = getWineKey(wine);
    const exists = favorites.some((f) => getWineKey(f) === key);
    let newFavorites = exists 
      ? favorites.filter((f) => getWineKey(f) !== key)
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
    hidden: { opacity: 0, y: 60 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 90, damping: 18, delay: i * 0.07 }
    })
  };

  // Parallax Background Setup
  const { scrollYProgress } = useScroll();
  const bg1 = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);
  const bg2 = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);

  return (
    <div className="min-h-screen pb-12 bg-[#F9F5F0] text-[#1F2521] relative overflow-hidden">
      {/* Parallax Background Layers */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        {/* Layer 1 - Base soft gradient (slowest) */}
        <motion.div
          style={{ y: bg1 }}
          className="absolute inset-0 bg-[radial-gradient(at_top_left,#F9F5F0_0%,#F0E9DF_100%)]"
        />
        
        {/* Layer 2 - Subtle glowing orbs (medium speed) */}
        <motion.div
          style={{ y: bg2 }}
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at 20% 30%, rgba(156,44,44,0.08) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(156,44,44,0.06) 0%, transparent 50%)`,
          }}
        />

        {/* Layer 3 - Very faint texture (fastest) */}
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ['0%', '-45%']) }}
          className="absolute inset-0 opacity-10 bg-[radial-gradient(#9C2C2C_0.8px,transparent_0)] bg-[length:40px_40px]"
        />
      </div>

      {/* Centered Header */}
      <div className="flex items-center justify-center pt-6 pb-4 border-b border-[#EDE8E0] relative z-10">
        <div className="flex items-center gap-3">
          <Wine className="w-8 h-8 text-[#9C2C2C]" />
          <h1 className="text-4xl font-bold tracking-tighter">SIP SAGE AI</h1>
        </div>
      </div>

      {/* Favorites at top */}
      {favorites.length > 0 && (
        <div className="max-w-2xl mx-auto px-6 mt-10 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-[#EDE8E0]"></div>
            <button 
              onClick={() => setFavoritesOpen(!favoritesOpen)} 
              className="flex items-center gap-3 text-xl font-medium text-[#1F2521] hover:text-[#9C2C2C] transition-colors"
            >
              ❤️ Your Favorites
              <ChevronDown className={`transition-transform ${favoritesOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className="h-px flex-1 bg-[#EDE8E0]"></div>
          </div>

          <AnimatePresence>
            {favoritesOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-8">
                {favorites.map((wine, i) => (
                  <motion.div key={i} className="wine-card bg-white rounded-3xl shadow-md border border-[#EDE8E0] overflow-hidden p-8">
                    <h4 className="text-2xl font-serif font-bold">{wine.wine_name} {wine.vintage}</h4>
                    <p className="mt-4 text-sm opacity-70">{wine.why_it_matches}</p>
                    <div className="flex justify-end gap-6 mt-8">
                      <motion.button onClick={() => toggleFavorite(wine)} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="transition-all">
                        <Heart className={`w-9 h-9 ${true ? 'text-[#9C2C2C] fill-[#9C2C2C]' : 'text-[#9C2C2C]'}`} strokeWidth={2} />
                      </motion.button>
                      <motion.button onClick={() => shareIndividual(wine)} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }} className="text-[#1F2521]">
                        <Share2 size={32} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-6 relative z-10">
        <form onSubmit={handleSubmit} className="mt-8">
          <textarea
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="Tell me what you're craving today..."
            className="w-full h-32 p-6 rounded-3xl border border-[#EDE8E0] bg-white text-[#1F2521] text-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#9C2C2C]"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full py-7 rounded-3xl bg-[#9C2C2C] hover:bg-[#8B2525] text-white text-2xl font-medium flex items-center justify-center gap-3 transition-all"
          >
            {loading ? <>Thinking <Sparkles className="animate-spin" /></> : <>Get Recommendations <Sparkles /></>}
          </button>
        </form>

        {result && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-light">Your Recommendations</h2>
              <button onClick={() => setResult(null)} className="text-[#9C2C2C] flex items-center gap-2">
                <RefreshCw size={20} /> New Search
              </button>
            </div>

            <div className="grid gap-12">
              {result.recommendations.map((wine: any, index: number) => {
                const key = `${wine.wine_name}-${wine.vintage || ''}`;
                const userRating = ratings[key] || 0;
                const avg = getAverageRating(wine);
                const isFavorited = favorites.some((f) => `${f.wine_name}-${f.vintage || ''}` === key);
                return (
                  <motion.div
                    key={index}
                    custom={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={cardVariants}
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="wine-card bg-white rounded-3xl shadow-md border border-[#EDE8E0] overflow-hidden p-8"
                  >
                    <h3 className="text-4xl font-serif font-bold">{wine.wine_name} {wine.vintage}</h3>
                    <p className="mt-6 text-lg leading-relaxed opacity-90">{wine.tasting_note}</p>
                    <p className="mt-4 text-[#9C2C2C] font-medium">{wine.why_it_matches}</p>

                    <div className="mt-12 space-y-8">
                      <div className="flex items-baseline gap-5">
                        <div className="text-xs uppercase tracking-widest opacity-60 w-28">BY THE GLASS</div>
                        <div className="text-6xl font-bold">${wine.price_glass}</div>
                      </div>
                      <div className="flex items-baseline gap-5">
                        <div className="text-xs uppercase tracking-widest opacity-60 w-28">BOTTLE</div>
                        <div className="text-6xl font-bold">${wine.price_bottle}</div>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center gap-3">
                      <span className="text-sm uppercase tracking-widest opacity-60">Guest Average</span>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-6 h-6 ${avg.rating >= s ? 'text-[#9C2C2C] fill-[#9C2C2C]' : 'text-[#EDE8E0]'}`} />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-[#9C2C2C]">
                        {avg.rating} ({avg.count} guests)
                      </span>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      <span className="text-sm uppercase tracking-widest opacity-60">Your Rating</span>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(star => (
                          <button key={star} onClick={() => rateWine(wine, star)} className="transition-all hover:scale-110">
                            <Star className={`w-8 h-8 ${userRating >= star ? 'text-[#9C2C2C] fill-[#9C2C2C]' : 'text-[#EDE8E0]'}`} />
                          </button>
                        ))}
                      </div>
                      {userRating > 0 && <span className="ml-2 text-sm font-medium text-[#9C2C2C]">{userRating}/5</span>}
                    </div>

                    <div className="flex justify-end gap-6 mt-8">
                      <motion.button
                        onClick={() => toggleFavorite(wine)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="transition-all"
                      >
                        <Heart className={`w-9 h-9 ${isFavorited ? 'text-[#9C2C2C] fill-[#9C2C2C]' : 'text-[#9C2C2C]'}`} strokeWidth={isFavorited ? 0 : 2} />
                      </motion.button>
                      <motion.button
                        onClick={() => shareIndividual(wine)}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.85 }}
                        className="text-[#1F2521]"
                      >
                        <Share2 size={32} />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
