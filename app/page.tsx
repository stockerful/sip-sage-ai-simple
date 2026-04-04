'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9F5F0] text-[#1F2521]">
      <div className="max-w-2xl mx-auto px-6 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center"
        >
          {/* Bigger logo - optimized for iPhone */}
          <div className="mb-8">
            <Image
              src="/sip-sage-ai-logo.png"
              alt="SIP SAGE AI"
              width={420}
              height={160}
              priority
              className="drop-shadow-lg mx-auto"
              style={{ width: 'auto', height: '160px' }}
            />
          </div>

          <p className="text-3xl font-light text-[#4A2C1F]/80 mb-16">
            Wine is better when it's personal
          </p>

          <div className="space-y-6">
            <Link href="/recommendations">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-8 text-3xl font-medium rounded-3xl bg-[#9C2C2C] hover:bg-[#8B2525] text-white shadow-2xl transition-all"
              >
                Start Tasting
              </motion.button>
            </Link>

            <div className="grid grid-cols-2 gap-4">
              <button className="py-8 text-3xl font-medium rounded-3xl border-2 border-[#4A2C1F] text-[#4A2C1F] hover:bg-[#4A2C1F]/5 transition-all">
                Log In
              </button>
              <button className="py-8 text-3xl font-medium rounded-3xl border-2 border-[#4A2C1F] text-[#4A2C1F] hover:bg-[#4A2C1F]/5 transition-all">
                Sign Up
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
