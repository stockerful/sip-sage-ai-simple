'use client';

import { useState, useEffect } from 'react';
import { Wine } from 'lucide-react';

export default function Welcome() {
  const [showToast, setShowToast] = useState(false);

  const handleGuest = () => {
    window.location.href = '/recommendations';
  };

  const handleAuthClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2800);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] font-sans flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Background subtle accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F0] via-[#FAF7F0] to-[#F5F0E6] pointer-events-none" />

      <div className="relative z-10 text-center max-w-md w-full">
        {/* Animated title */}
        <div className="animate-[fadeInScale_0.8s_ease-out_forwards] opacity-0">
          <h1 className="text-6xl font-serif tracking-[-2px] text-[#2C2C2C] mb-3">
            SIP SAGE AI
          </h1>
        </div>

        {/* Subtitle with delay */}
        <div className="animate-[fadeInUp_0.9s_200ms_ease-out_forwards] opacity-0 text-[#6F7F5F] text-xl tracking-wider mb-16">
          Your personal wine host
        </div>

        {/* Welcome message */}
        <div className="animate-[fadeInUp_1s_400ms_ease-out_forwards] opacity-0 text-[#2C2C2C] text-2xl leading-tight mb-16">
          Welcome to the tasting room.<br />
          Let’s find your perfect glass.
        </div>

        {/* Buttons with stagger animation */}
        <div className="space-y-5">
          {/* Guest Button - appears first */}
          <button
            onClick={handleGuest}
            className="w-full bg-[#4A0F1F] text-white text-2xl font-medium py-7 rounded-3xl active:scale-[0.97] transition-all shadow-lg flex items-center justify-center gap-3 animate-[fadeInUp_1.1s_600ms_ease-out_forwards] opacity-0"
          >
            <Wine size={28} />
            Continue as Guest
          </button>

          {/* Log In - second */}
          <button
            onClick={handleAuthClick}
            className="w-full border-2 border-[#4A0F1F] text-[#4A0F1F] text-2xl font-medium py-7 rounded-3xl active:scale-[0.97] transition-all animate-[fadeInUp_1.1s_750ms_ease-out_forwards] opacity-0"
          >
            Log In
          </button>

          {/* Sign Up - third */}
          <button
            onClick={handleAuthClick}
            className="w-full border-2 border-[#4A0F1F] text-[#4A0F1F] text-2xl font-medium py-7 rounded-3xl active:scale-[0.97] transition-all animate-[fadeInUp_1.1s_900ms_ease-out_forwards] opacity-0"
          >
            Sign Up
          </button>
        </div>

        {/* Footer */}
        <p className="text-[#8C6F5C] text-sm mt-20 text-center animate-[fadeIn_1.4s_1s_ease-out_forwards] opacity-0">
          Perfect for tasting rooms • Willamette Valley
        </p>
      </div>

      {/* Toast notification */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#2C2C2C] text-white text-lg px-8 py-4 rounded-3xl shadow-2xl animate-[toastSlideUp_0.4s_ease-out_forwards]">
          Coming soon • Full accounts coming soon!
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes toastSlideUp {
          from { opacity: 0; transform: translate(-50%, 30px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
