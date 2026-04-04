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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 15 }
    },
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] font-sans flex flex-col items-center justify-center px-6 overflow-hidden">
      <motion.div 
        className="relative z-10 text-center max-w-md w-full"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Animated Title */}
        <motion.h1 
          variants={itemVariants}
          className="text-6xl font-serif tracking-[-2px] text-[#2C2C2C] mb-3"
        >
          SIP SAGE AI
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          variants={itemVariants}
          className="text-[#6F7F5F] text-xl tracking-wider mb-16"
        >
          Your personal wine host
        </motion.p>

        {/* Welcome message */}
        <motion.p 
          variants={itemVariants}
          className="text-[#2C2C2C] text-2xl leading-tight mb-16"
        >
          Welcome to the tasting room.<br />
          Let’s find your perfect glass.
        </motion.p>

        {/* Buttons with stagger */}
        <motion.div 
          className="space-y-5"
          variants={containerVariants}
        >
          {/* Guest Button */}
          <motion.button
            onClick={handleGuest}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="w-full bg-[#4A0F1F] text-white text-2xl font-medium py-7 rounded-3xl flex items-center justify-center gap-3 shadow-lg"
          >
            <Wine size={28} />
            Continue as Guest
          </motion.button>

          {/* Log In */}
          <motion.button
            onClick={handleAuthClick}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="w-full border-2 border-[#4A0F1F] text-[#4A0F1F] text-2xl font-medium py-7 rounded-3xl"
          >
            Log In
          </motion.button>

          {/* Sign Up */}
          <motion.button
            onClick={handleAuthClick}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="w-full border-2 border-[#4A0F1F] text-[#4A0F1F] text-2xl font-medium py-7 rounded-3xl"
          >
            Sign Up
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Toast with Framer Motion */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#2C2C2C] text-white text-lg px-8 py-4 rounded-3xl shadow-2xl"
          >
            Coming soon • Full accounts coming soon!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
