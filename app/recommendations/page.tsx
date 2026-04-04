'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wine, Sparkles, RefreshCw, X } from 'lucide-react';

export default function Recommendations() {
  const [preferences, setPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [selectedWine, setSelectedWine] = useState<any>(null);

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

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15, delay: i * 0.08 }
    })
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
                <motion.div
                  key={index}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedWine(wine)}
                  className="wine-card cursor-pointer bg-white rounded-3xl shadow-md border border-[#EDE8E0] overflow-hidden p-8"
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

      {/* Enhanced Modal */}
      <AnimatePresence>
        {selectedWine && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedWine(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopImmediatePropagation()}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            >
              {/* Large bottle image */}
              <div className="h-96 bg-[#F8F9F7] flex items-center justify-center relative">
                <img
                  src="https://picsum.photos/id/1015/800/800"
                  alt={selectedWine.wine_name}
                  className="h-full object-contain drop-shadow-2xl"
                />
                <button
                  onClick={() => setSelectedWine(null)}
                  className="absolute top-6 right-6 bg-white/90 hover:bg-white rounded-2xl p-3 shadow-lg transition-colors"
                >
                  <X size={24} className="text-[#1F2521]" />
                </button>
              </div>

              <div className="p-8">
                <h2 className="text-4xl font-serif font-semibold text-[#1F2521] leading-none">
                  {selectedWine.wine_name} <span className="text-3xl text-[#8A9E8E]">{selectedWine.vintage}</span>
                </h2>

                <p className="text-[#1A3C35] text-xl leading-relaxed my-6">
                  {selectedWine.tasting_note}
                </p>

                <div className="border-t border-[#EDE8E0] pt-6">
                  <div className="text-[#8A9E8E] uppercase text-sm tracking-widest mb-2">Why it matches</div>
                  <p className="text-[#1F2521] text-lg leading-relaxed">
                    {selectedWine.why_it_matches}
                  </p>
                </div>

                {/* Cool details */}
                <div className="mt-8 grid grid-cols-2 gap-8">
                  <div>
                    <div className="font-medium text-[#1F2521]">Cool Fact</div>
                    <p className="text-[#8A9E8E] mt-1">Grown in the historic Dundee Hills AVA with volcanic soils that give it incredible minerality.</p>
                  </div>
                  <div>
                    <div className="font-medium text-[#1F2521]">Perfect Pairing</div>
                    <p className="text-[#8A9E8E] mt-1">Salmon, mushroom risotto, aged cheeses, or roasted duck.</p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="mt-10 flex justify-between items-center border-t border-[#EDE8E0] pt-8">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-[#C36A4F]">BY THE GLASS</div>
                    <div className="text-4xl font-bold text-[#C36A4F]">${selectedWine.price_glass}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-widest text-[#1F2521]">BOTTLE</div>
                    <div className="text-4xl font-bold text-[#1F2521]">${selectedWine.price_bottle}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
