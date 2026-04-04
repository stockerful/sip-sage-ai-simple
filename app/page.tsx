'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wine, Sparkles, Moon, Sun } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode') === 'true';
    setDarkMode(saved);
    if (saved) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    if (newMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-black text-[#E7E9EA]' : 'bg-white text-[#0F1419]'}`}>
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 z-50 p-4 rounded-2xl bg-white dark:bg-[#2F3336] border border-[#CFD9DE] dark:border-[#2F3336] shadow-lg hover:scale-110 transition-all"
      >
        {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>

      <div className="max-w-2xl mx-auto px-6 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <Wine className="w-14 h-14 text-[#1D9BF0]" />
            <h1 className="text-7xl font-bold tracking-tighter">SIP SAGE AI</h1>
          </div>

          <p className="text-3xl font-light mb-16 text-[#536471] dark:text-[#71767B]">
            Wine is better when it's personal
          </p>

          <div className="space-y-6">
            <Link href="/recommendations">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-8 text-3xl font-medium rounded-3xl bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white shadow-2xl transition-all"
              >
                Start Tasting
              </motion.button>
            </Link>

            <button className="w-full py-8 text-3xl font-medium rounded-3xl border-2 border-[#CFD9DE] dark:border-[#2F3336] text-[#0F1419] dark:text-[#E7E9EA] hover:bg-[#F7F9F9] dark:hover:bg-[#2F3336] transition-all">
              Continue as Guest
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
