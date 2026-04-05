'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9F5F0] text-[#1F2521] flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <Image
          src="/sip-sage-ai-logo.png"
          alt="SIP SAGE AI"
          width={420}
          height={160}
          priority
          className="mx-auto drop-shadow-lg mb-8"
        />
        <p className="text-sm uppercase tracking-[2px] text-[#9C2C2C] font-medium mb-6">
          Instant Expertise. Effortless Hosting
        </p>
        <Link
          href="/recommendations"
          className="block w-full py-6 rounded-3xl bg-[#9C2C2C] text-white text-2xl font-medium hover:bg-[#8B2525] transition-all"
        >
          Start Tasting
        </Link>
      </div>
    </div>
  );
}
