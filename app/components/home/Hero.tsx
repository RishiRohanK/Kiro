"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full border-b border-zinc-100 bg-white overflow-hidden">
      {/* Structural Grid Background - Subtly present */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #d4d4d8 1px, transparent 1px), linear-gradient(to bottom, #d4d4d8 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          opacity: 0.3,
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 py-10 lg:py-14 flex flex-col items-center text-center">
        
        {/* Centered Mission Node */}
        <div className="mb-8 inline-flex items-center gap-2 border border-zinc-800 bg-black px-4 py-1.5 ">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[12px] font-medium text-white tracking-wide uppercase">
            Introducing Platform
          </span>
        </div>

        <h1 className="max-w-4xl text-5xl md:text-6xl font-normal tracking-tight text-zinc-900 leading-[1.1] mb-8">
          Your <span className="text-violet-500">learn</span> <span className="text-emerald-500">development</span> <span className="text-blue-500">network</span>, <br className="hidden sm:block" />
          built for the <span className="text-orange-400">real</span> <span className="text-pink-500">world</span>.
        </h1>

        <p className="max-w-2xl text-[17px] md:text-[18px] leading-relaxed text-zinc-500 font-normal mb-8">
          Platform by <span className="font-semibold text-zinc-800">Student Forge</span> is a structured learning & internship ecosystem
          where students acquire job-ready skills and earn verifiable credentials.
        </p>

        <div className="mt-4 flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center justify-center">
          <Link
            href="/get-started"
            className="flex h-12 items-center justify-center gap-2 bg-[#0055FF] px-10 text-[14px] text-white font-bold transition-all hover:bg-blue-700 active:scale-[0.98] rounded-none shadow-lg shadow-blue-500/10"
          >
            Get started free
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/courses"
            className="flex h-12 items-center justify-center border border-zinc-200 bg-white px-10 text-[14px] text-zinc-900 font-bold transition-all hover:border-zinc-800 active:scale-[0.98] rounded-none"
          >
            Explore courses
          </Link>
        </div>

        <p className="mt-12 text-[12px] text-zinc-400 font-bold uppercase tracking-widest pt-6 border-t border-zinc-50 w-full max-w-lg">
          Trusted by <span className="text-zinc-700 font-medium">500+ students</span> across India · Student Forge
        </p>

      </div>
    </section>
  );
}