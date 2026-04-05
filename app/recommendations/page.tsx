'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wine, Sparkles, Heart, Share2, RefreshCw, ChevronDown, Star, Home, Clock, User, Plus } from 'lucide-react';

export default function Recommendations() {
  const [preferences, setPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [ratings, setRatings] = useState<{[key: string]: number}>({});
  const [activeTab, setActiveTab] = useState<'discover' | 'favorites' | 'history' | 'profile'>('discover');

  const getAverageRating = (wine: any) => {
    const key = `${wine.wine_name}-${wine.vintage || ''}`;
    const averages: {[key: string]: {rating: number, count: number}} = {
      'Domaine Drouhin': { rating: 4.7, count: 23 },
      'Eyrie Vineyards': { rating: 4.9, count: 31 },
      'Patricia Green': { rating: 4.4, count: 15 },
      'Bergström Cumberland': { rating: 4.8, count: 19 },
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
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15, delay: i * 0.08 } })
  };

  return (
    <div className="min-h-screen bg-[#F9F5F0] text-[#1F2521] pb-20">
      {/* Header */}
      <div className="flex items-center justify-center pt-6 pb-4 border-b border-[#EDE8E0]">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tighter">SIP SAGE AI</h1>
          <div className="h-px w-48 mx-auto bg-gradient-to-r from-transparent via-[#EDE8E0] to-transparent my-3"></div>
          <p className="text-sm uppercase tracking-[1.5px] text-[#9C2C2C] font-medium">
            Instant Expertise. Effortless Hosting
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 pt-6">
        {activeTab === 'discover' && (
          <>
            <form onSubmit={handleSubmit} className="mt-2">
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
                        animate="visible"
                        variants={cardVariants}
                        whileHover={{ y: -8 }}
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

                        <div className="mt-6 flex items-center gap-3">
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

                        <div className="flex justify-end gap-6 mt-8">
                          <motion.button onClick={() => toggleFavorite(wine)} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="transition-all">
                            <Heart className={`w-9 h-9 ${isFavorited ? 'text-[#9C2C2C] fill-[#9C2C2C]' : 'text-[#9C2C2C]'}`} strokeWidth={isFavorited ? 0 : 2} />
                          </motion.button>
                          <motion.button onClick={() => shareIndividual(wine)} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }} className="text-[#1F2521]">
                            <Share2 size={32} />
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'favorites' && (
          <div className="mt-8">
            <h2 className="text-3xl font-light mb-6">Your Favorites</h2>
            {favorites.length > 0 ? (
              <div className="space-y-8">
                {favorites.map((wine, i) => (
                  <motion.div key={i} className="wine-card bg-white rounded-3xl shadow-md border border-[#EDE8E0] overflow-hidden p-8">
                    <h4 className="text-2xl font-serif font-bold">{wine.wine_name} {wine.vintage}</h4>
                    <p className="mt-4 text-sm opacity-70">{wine.why_it_matches}</p>
                    <div className="flex justify-end gap-6 mt-8">
                      <motion.button onClick={() => toggleFavorite(wine)} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="transition-all">
                        <Heart className={`w-9 h-9 text-[#9C2C2C] fill-[#9C2C2C]`} strokeWidth={0} />
                      </motion.button>
                      <motion.button onClick={() => shareIndividual(wine)} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }} className="text-[#1F2521]">
                        <Share2 size={32} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-[#9C2C2C]/60 py-12">No favorites yet. Start favoriting wines!</p>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="mt-8">
            <h2 className="text-3xl font-light mb-6">History</h2>
            <p className="text-[#9C2C2C]/60">Your past recommendations and rated wines will appear here.</p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="mt-8 text-center">
            <h2 className="text-3xl font-light mb-6">Profile</h2>
            <div className="bg-white rounded-3xl p-8">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-[#EDE8E0] rounded-2xl flex items-center justify-center text-5xl">👤</div>
              </div>
              <h3 className="text-2xl font-medium">McMinnville Taster</h3>
              <p className="text-[#9C2C2C]">Wine Enthusiast • Oregon</p>
              <div className="grid grid-cols-3 gap-4 mt-10">
                <div>
                  <div className="text-4xl font-bold text-[#9C2C2C]">24</div>
                  <div className="text-xs uppercase tracking-widest">Wines Rated</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#9C2C2C]">12</div>
                  <div className="text-xs uppercase tracking-widest">Favorites</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#9C2C2C]">8</div>
                  <div className="text-xs uppercase tracking-widest">Sessions</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Premium Bottom Tab Bar - Always visible */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#EDE8E0] z-50 safe-area-bottom">
        <div className="max-w-2xl mx-auto flex items-center justify-around py-2 px-4">
          <button 
            onClick={() => setActiveTab('discover')} 
            className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-2xl transition-all ${activeTab === 'discover' ? 'bg-[#9C2C2C]/10 text-[#9C2C2C]' : 'text-[#1F2521]/60'}`}
          >
            <Home size={28} />
            <span className="text-xs font-medium">Discover</span>
          </button>

          <button 
            onClick={() => setActiveTab('favorites')} 
            className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-2xl transition-all ${activeTab === 'favorites' ? 'bg-[#9C2C2C]/10 text-[#9C2C2C]' : 'text-[#1F2521]/60'}`}
          >
            <Heart size={28} className={activeTab === 'favorites' ? 'fill-[#9C2C2C]' : ''} />
            <span className="text-xs font-medium">Favorites</span>
          </button>

          <button 
            onClick={() => setActiveTab('history')} 
            className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-2xl transition-all ${activeTab === 'history' ? 'bg-[#9C2C2C]/10 text-[#9C2C2C]' : 'text-[#1F2521]/60'}`}
          >
            <Clock size={28} />
            <span className="text-xs font-medium">History</span>
          </button>

          <button 
            onClick={() => setActiveTab('profile')} 
            className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-2xl transition-all ${activeTab === 'profile' ? 'bg-[#9C2C2C]/10 text-[#9C2C2C]' : 'text-[#1F2521]/60'}`}
          >
            <User size={28} />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
