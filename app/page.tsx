'use client';

import { useState } from 'react';
import { Wine } from 'lucide-react';

export default function Welcome() {
  const [showToast, setShowToast] = useState(false);

  const handleGuest = () => {
    window.location.href = '/recommendations';
  };

  const handleAuthClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] font-sans flex flex-col items-center justify-center px-6">
      {/* Branding */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-serif tracking-[-2px] text-[#2C2C2C] mb-3">
          SIP SAGE AI
        </h1>
        <p className="text-[#6F7F5F] text-xl tracking-wider">
          Your personal wine host
        </p>
      </div>

      {/* Welcome message */}
      <div className="text-center max-w-md mb-16">
        <p className="text-[#2C2C2C] text-2xl leading-tight">
          Welcome to the tasting room.<br />
          Let’s find your perfect glass.
        </p>
      </div>

      {/* Action buttons - large and iOS-app style */}
      <div className="w-full max-w-md space-y-5">
        {/* Guest - primary button */}
        <button
          onClick={handleGuest}
          className="w-full bg-[#4A0F1F] text-white text-2xl font-medium py-7 rounded-3xl active:scale-95 transition-all shadow-lg flex items-center justify-center gap-3"
        >
          <Wine size={28} />
          Continue as Guest
        </button>

        {/* Log In */}
        <button
          onClick={handleAuthClick}
          className="w-full border-2 border-[#4A0F1F] text-[#4A0F1F] text-2xl font-medium py-7 rounded-3xl active:scale-95 transition-all"
        >
          Log In
        </button>

        {/* Sign Up */}
        <button
          onClick={handleAuthClick}
          className="w-full border-2 border-[#4A0F1F] text-[#4A0F1F] text-2xl font-medium py-7 rounded-3xl active:scale-95 transition-all"
        >
          Sign Up
        </button>
      </div>

      {/* Footer note */}
      <p className="text-[#8C6F5C] text-sm mt-16 text-center">
        Perfect for tasting rooms • Willamette Valley
      </p>

      {/* Toast for Log In / Sign Up */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#2C2C2C] text-white text-lg px-8 py-4 rounded-3xl shadow-xl">
          Coming soon • We’ll add full accounts soon!
        </div>
      )}
    </div>
  );
}
