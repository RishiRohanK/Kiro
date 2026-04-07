"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full border-b border-zinc-100 bg-white overflow-hidden">
      {/* Structural Grid Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #d4d4d8 1px, transparent 1px), linear-gradient(to bottom, #d4d4d8 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          opacity: 0.3,
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Focused Learning Propositions */}
          <div className="col-span-1 lg:col-span-5 flex flex-col items-start text-left">
            <div className="mb-6 inline-flex items-center gap-2 border border-zinc-900 bg-black px-3 py-1 mt-0">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-bold text-white tracking-widest uppercase leading-none">
                Learn Grid
              </span>
            </div>

            <h1 className="max-w-xl text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.1] mb-6">
              Your <span className="text-violet-500">learn</span> network,<br />
              built for the <span className="text-blue-500">real world</span>.
            </h1>

            <p className="max-w-md text-[15px] md:text-[16px] leading-relaxed text-zinc-500 font-medium">
              Acquire job-ready skills, build real projects, and earn verifiable credentials — all on the official Learn Grid platform.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                href="/get-started"
                className="flex h-11 items-center justify-center gap-2 bg-[#0055FF] px-8 text-[13px] text-white font-bold transition-all hover:opacity-90 active:scale-[0.98] rounded-none shadow-xl shadow-blue-500/10"
              >
                Join Now
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <Link
                href="/courses"
                className="flex h-11 items-center justify-center border border-zinc-200 bg-white px-8 text-[13px] text-zinc-900 font-bold transition-all hover:border-zinc-800 active:scale-[0.98] rounded-none"
              >
                Explore
              </Link>
            </div>

            <p className="mt-8 text-[11px] text-zinc-400 font-bold uppercase tracking-widest ">
              Batch 2 · 500+ Active nodes across India
            </p>
          </div>

          {/* Right Column: High-Density Visual (Maximum presence) */}
          <div className="col-span-1 lg:col-span-7 relative group lg:block hidden animate-in fade-in slide-in-from-right-12 duration-1000">
             <div className="absolute -inset-10 bg-gradient-to-r from-blue-50 to-transparent opacity-40 blur-[50px] pointer-events-none" />
             <img 
                src="https://ik.imagekit.io/dypkhqxip/bgimage.png" 
                alt="Student Forge Learn Grid Architecture" 
                className="relative w-full h-auto scale-110 lg:scale-[1.25] object-contain origin-left transform hover:scale-[1.28] transition-transform duration-1000" 
             />
          </div>

        </div>
      </div>
    </section>
  );
}