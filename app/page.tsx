'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Automatically redirect to the main recommendations page
    window.location.href = '/recommendations';
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-serif tracking-tighter text-[#2C2C2C] mb-4">
          SIP SAGE AI
        </h1>
        <p className="text-[#6F7F5F] text-xl">Loading your wine host...</p>
      </div>
    </div>
  );
}
