'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
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

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 110, damping: 14 }
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F5ED] font-sans flex flex-col items-center justify-center px-6 overflow-hidden">
      <motion.div 
        className="text-center max-w-md w-full"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        <motion.h1 variants={item} className="text-6xl font-serif tracking-[-2px] text-[#1F1F1F] mb-3">
          SIP SAGE AI
        </motion.h1>
        
        <motion.p variants={item} className="text-[#5E7A5E] text-xl tracking-wider mb-16">
          Your personal wine host
        </motion.p>

        <motion.p variants={item} className="text-[#1F1F1F] text-2xl leading-tight mb-16">
          Welcome to the tasting room.<br />
          Let’s find your perfect glass.
        </motion.p>

        <motion.div variants={container} className="space-y-5">
          <motion.button
            onClick={handleGuest}
            variants={item}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="w-full bg-[#3F1A2E] text-white text-2xl font-medium py-7 rounded-3xl flex items-center justify-center gap-3 shadow-lg"
          >
            <Wine size={28} />
            Continue as Guest
          </motion.button>

          <motion.button
            onClick={handleAuthClick}
            variants={item}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="w-full border-2 border-[#3F1A2E] text-[#3F1A2E] text-2xl font-medium py-7 rounded-3xl"
          >
            Log In
          </motion.button>

          <motion.button
            onClick={handleAuthClick}
            variants={item}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="w-full border-2 border-[#3F1A2E] text-[#3F1A2E] text-2xl font-medium py-7 rounded-3xl"
          >
            Sign Up
          </motion.button>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#1F1F1F] text-white text-lg px-8 py-4 rounded-3xl shadow-2xl"
          >
            Coming soon • Full accounts coming soon!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
