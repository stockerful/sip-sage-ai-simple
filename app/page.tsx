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
    <div className={`min-h-screen ${darkMode ? 'dark bg-[#1F2521] text-[#F9F5F0]' : 'bg-[#F9F5F0] text-[#1F2521]'}`}>
      {/* Dark/Light Toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 z-50 p-4 rounded-2xl bg-white dark:bg-[#4A2C1F] border border-[#EDE8E0] dark:border-[#E89F6F] shadow-lg hover:scale-110 transition-all"
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
            <Wine className="w-14 h-14 text-[#C36A4F]" />
            <h1 className="text-7xl font-bold tracking-tighter">SIP SAGE AI</h1>
          </div>

          <p className="text-3xl font-light text-[#4A2C1F]/80 dark:text-[#F9F5F0]/80 mb-16">
            Wine is better when it's personal
          </p>

          <div className="space-y-6">
            <Link href="/recommendations">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-8 text-3xl font-medium rounded-3xl bg-[#C36A4F] hover:bg-[#B05A44] text-white shadow-2xl transition-all"
              >
                Start Tasting
              </motion.button>
            </Link>

            <button className="w-full py-8 text-3xl font-medium rounded-3xl border-2 border-[#4A2C1F] dark:border-[#F9F5F0] text-[#4A2C1F] dark:text-[#F9F5F0] hover:bg-[#4A2C1F]/5 dark:hover:bg-[#F9F5F0]/10 transition-all">
              Continue as Guest
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
