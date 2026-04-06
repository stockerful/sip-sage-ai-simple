'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wine, Sparkles, Heart, Share2, RefreshCw, Star, Home, Clock, User } from 'lucide-react';

export default function Recommendations() {
  const [preferences, setPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [ratings, setRatings] = useState<{[key: string]: number}>({});
  const [activeTab, setActiveTab] = useState<'discover' | 'favorites' | 'history' | 'profile'>('discover');

  const getWineKey = (wine: any) => `${wine.wine_name}-${wine.vintage || ''}`;

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const savedRatings = JSON.parse(localStorage.getItem('wineRatings') || '{}');
    setFavorites(savedFavorites);
    setRatings(savedRatings);
  }, []);

  const toggleFavorite = (wine: any) => {
    const key = getWineKey(wine);
    const exists = favorites.some(f => getWineKey(f) === key);
    const newFavorites = exists
      ? favorites.filter(f => getWineKey(f) !== key)
      : [...favorites, wine];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const rateWine = (wine: any, rating: number) => {
    const key = getWineKey(wine);
    const newRatings = { ...ratings, [key]: rating };
    setRatings(newRatings);
    localStorage.setItem('wineRatings', JSON.stringify(newRatings));
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
      console.log('🔥 Backend response:', data); // ← Debug: check if Grok-3 is being used
      let recommendations = data.recommendations || [];
      // Guarantee exactly 4 cards
      if (recommendations.length < 4) {
        const mockExtras = [
          { wine_name: "Bergström Cumberland Reserve Pinot Noir", vintage: "2021", tasting_note: "Earthy complexity with loamy soil, dried herbs, and smoked meat notes.", why_it_matches: "Deep savory profile that matches your preference.", price_glass: 20, price_bottle: 72 },
          { wine_name: "Willakenzie Estate Pinot Noir", vintage: "2020", tasting_note: "Wet earth, cedar, and brambly blackberry with firm tannins.", why_it_matches: "Classic earthy Oregon Pinot.", price_glass: 16, price_bottle: 58 },
          { wine_name: "Domaine Drouhin Oregon Pinot Noir", vintage: "2022", tasting_note: "Elegant cherry, raspberry, and subtle earth with silky texture.", why_it_matches: "Bright and balanced classic.", price_glass: 18, price_bottle: 68 }
        ];
        recommendations = [...recommendations, ...mockExtras].slice(0, 4);
      }
      setResult({ ...data, recommendations });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15, delay: i * 0.08 }
    })
  };

  return (
    <div className="min-h-screen bg-[#F9F5F0] text-[#1F2521] pb-24">
      {/* Header */}
      <div className="pt-8 pb-4 border-b border-[#EDE8E0] text-center">
        <h1 className="text-4xl font-bold tracking-tighter">SIP SAGE AI</h1>
        <div className="h-px w-48 mx-auto bg-gradient-to-r from-transparent via-[#EDE8E0] to-transparent my-3"></div>
        <p className="text-sm uppercase tracking-[1.5px] text-[#9C2C2C]">Instant Expertise. Effortless Hosting</p>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 pt-8">
        {activeTab === 'discover' && (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              <textarea
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="Tell me what you're craving today..."
                className="w-full h-32 p-6 rounded-3xl border border-[#EDE8E0] bg-white text-[#1F2521] text-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#9C2C2C]"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-7 rounded-3xl bg-[#9C2C2C] hover:bg-[#8B2525] text-white text-2xl font-medium flex items-center justify-center gap-3 transition-all"
              >
                {loading ? <>Thinking <Sparkles className="animate-spin" /></> : <>Get Recommendations <Sparkles /></>}
              </button>
            </form>

            {result && result.recommendations && (
              <div className="mt-12">
                <div className="grid gap-12">
                  {result.recommendations.map((wine: any, index: number) => {
                    const key = getWineKey(wine);
                    const userRating = ratings[key] || 0;
                    const isFavorited = favorites.some(f => getWineKey(f) === key);
                    return (
                      <motion.div
                        key={index}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                        whileHover={{ y: -8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-white rounded-3xl shadow-md border border-[#EDE8E0] p-8"
                      >
                        <h3 className="text-4xl font-serif font-bold">{wine.wine_name} {wine.vintage}</h3>
                        <p className="mt-6 text-lg leading-relaxed">{wine.tasting_note}</p>
                        <p className="mt-4 text-[#9C2C2C] font-medium">{wine.why_it_matches}</p>

                        <div className="mt-10 flex items-baseline gap-8">
                          <div>
                            <div className="text-xs uppercase tracking-widest text-gray-500">BY THE GLASS</div>
                            <div className="text-5xl font-bold">${wine.price_glass}</div>
                          </div>
                          <div>
                            <div className="text-xs uppercase tracking-widest text-gray-500">BOTTLE</div>
                            <div className="text-5xl font-bold">${wine.price_bottle}</div>
                          </div>
                        </div>

                        <div className="mt-8 flex items-center justify-between">
                          <div>
                            <div className="text-xs uppercase tracking-widest text-gray-500 mb-1">Your Rating</div>
                            <div className="flex gap-1">
                              {[1,2,3,4,5].map(s => (
                                <button key={s} onClick={() => rateWine(wine, s)}>
                                  <Star className={`w-7 h-7 ${userRating >= s ? 'text-[#9C2C2C] fill-[#9C2C2C]' : 'text-gray-300'}`} />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-6">
                            <motion.button onClick={() => toggleFavorite(wine)} whileTap={{ scale: 0.9 }}>
                              <Heart className={`w-9 h-9 ${isFavorited ? 'text-[#9C2C2C] fill-[#9C2C2C]' : 'text-[#9C2C2C]'}`} strokeWidth={isFavorited ? 0 : 2} />
                            </motion.button>
                            <motion.button onClick={() => shareIndividual(wine)} whileTap={{ scale: 0.9 }}>
                              <Share2 size={36} className="text-[#1F2521]" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* Other tabs */}
        {activeTab === 'favorites' && <div className="mt-8 text-center text-gray-500">Your favorites will appear here.</div>}
        {activeTab === 'history' && <div className="mt-8 text-center text-gray-500">Your history will appear here.</div>}
        {activeTab === 'profile' && <div className="mt-8 text-center text-gray-500">Profile coming soon.</div>}
      </div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#EDE8E0] z-50">
        <div className="max-w-2xl mx-auto flex justify-around py-3">
          <button onClick={() => setActiveTab('discover')} className={`flex-1 flex flex-col items-center ${activeTab === 'discover' ? 'text-[#9C2C2C]' : 'text-gray-400'}`}>
            <Home size={28} />
            <span className="text-xs mt-1">Discover</span>
          </button>
          <button onClick={() => setActiveTab('favorites')} className={`flex-1 flex flex-col items-center ${activeTab === 'favorites' ? 'text-[#9C2C2C]' : 'text-gray-400'}`}>
            <Heart size={28} />
            <span className="text-xs mt-1">Favorites</span>
          </button>
          <button onClick={() => setActiveTab('history')} className={`flex-1 flex flex-col items-center ${activeTab === 'history' ? 'text-[#9C2C2C]' : 'text-gray-400'}`}>
            <Clock size={28} />
            <span className="text-xs mt-1">History</span>
          </button>
          <button onClick={() => setActiveTab('profile')} className={`flex-1 flex flex-col items-center ${activeTab === 'profile' ? 'text-[#9C2C2C]' : 'text-gray-400'}`}>
            <User size={28} />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
