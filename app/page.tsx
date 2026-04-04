'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Wine, Sun, Moon } from 'lucide-react';

export default function Welcome() {
  const [darkMode, setDarkMode] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) {
      const isDark = saved === 'true';
      setDarkMode(isDark);
      if (isDark) document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleGuest = () => window.location.href = '/recommendations';
  const handleAuthClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2800);
  };

  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.3 } } };
  const item = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 110, damping: 14 } } };

  return (
    <div className={`min-h-screen font-sans flex flex-col items-center justify-center px-6 overflow-hidden ${darkMode ? 'dark bg-[#1F2521]' : 'bg-[#F8F4EF]'}`}>
      {/* Dark/Light Toggle - Top Right, clear of text */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 z-50 bg-white dark:bg-[#1F2521] border border-[#EDE8E0] dark:border-[#E07A5F] rounded-2xl p-3 shadow-lg text-[#1F2521] dark:text-[#F8F4EF]"
      >
        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      <motion.div className="text-center max-w-md w-full" initial="hidden" animate="visible" variants={container}>
        <motion.h1 variants={item} className="text-6xl font-serif tracking-[-2px] text-[#1F2521] dark:text-[#F8F4EF] mb-3">
          SIP SAGE AI
        </motion.h1>
        
        <motion.p variants={item} className="text-[#8A9E8E] dark:text-[#E07A5F] text-xl tracking-wider mb-16">
          Your personal wine host
        </motion.p>

        <motion.p variants={item} className="text-[#1F2521] dark:text-[#F8F4EF] text-2xl leading-tight mb-16">
          Welcome to the tasting room.<br />
          Let’s find your perfect glass.
        </motion.p>

        <motion.div variants={container} className="space-y-5">
          <motion.button onClick={handleGuest} variants={item} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} className="w-full bg-[#3F1C2B] dark:bg-[#E07A5F] text-white dark:text-[#1F2521] text-2xl font-medium py-7 rounded-3xl flex items-center justify-center gap-3 shadow-lg">
            <Wine size={28} /> Continue as Guest
          </motion.button>

          <motion.button onClick={handleAuthClick} variants={item} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} className="w-full border-2 border-[#3F1C2B] dark:border-[#E07A5F] text-[#3F1C2B] dark:text-[#E07A5F] text-2xl font-medium py-7 rounded-3xl">
            Log In
          </motion.button>

          <motion.button onClick={handleAuthClick} variants={item} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} className="w-full border-2 border-[#3F1C2B] dark:border-[#E07A5F] text-[#3F1C2B] dark:text-[#E07A5F] text-2xl font-medium py-7 rounded-3xl">
            Sign Up
          </motion.button>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#1F2521] dark:bg-[#E07A5F] text-white dark:text-[#1F2521] text-lg px-8 py-4 rounded-3xl shadow-2xl">
            Coming soon • Full accounts coming soon!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
