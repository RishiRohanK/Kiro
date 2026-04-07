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

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Learning Propositions (Hard-Fixed 2-Line Configuration) */}
          <div className="flex flex-col items-start text-left">
            <div className="mb-6 inline-flex items-center gap-2 border border-zinc-800 bg-black px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-bold text-white tracking-widest uppercase leading-none">
                Introducing Learn Grid
              </span>
            </div>

            <h1 className="max-w-3xl text-4xl md:text-5xl lg:text-5xl font-normal tracking-tight text-zinc-900 leading-[1.1] mb-8">
              Your <span className="text-violet-500">learn</span> <span className="text-emerald-500">development</span> <span className="text-blue-500">network</span>, <br className="hidden md:block" />
              built for the <span className="text-orange-400">real</span> <span className="text-pink-500">world</span>.
            </h1>

            <p className="max-w-md text-[16px] md:text-[17px] leading-relaxed text-zinc-500 font-normal mb-8">
              Learn Grid by <span className="font-semibold text-zinc-800">Student Forge</span> is a structured learning & internship ecosystem
              where students acquire job-ready skills and earn verifiable credentials.
            </p>

            <div className="mt-2 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                href="/get-started"
                className="flex h-11 items-center justify-center gap-2 bg-[#0055FF] px-10 text-[13px] text-white font-bold transition-all hover:bg-blue-700 active:scale-[0.98] rounded-none shadow-lg shadow-blue-500/10"
              >
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/courses"
                className="flex h-11 items-center justify-center border border-zinc-200 bg-white px-10 text-[13px] text-zinc-900 font-bold transition-all hover:border-zinc-800 active:scale-[0.98] rounded-none advocacy-node"
              >
                Explore courses
              </Link>
            </div>

            <p className="mt-10 text-[11px] text-zinc-400 font-bold uppercase tracking-widest pt-4">
              Trusted by <span className="text-zinc-700 font-medium">500+ students</span> across India · Student Forge
            </p>
          </div>

          {/* Right Column: Visual Component (High-Resolution Balance) */}
          <div className="relative group lg:block hidden animate-in fade-in slide-in-from-right-12 duration-1000">
             <div className="absolute -inset-10 bg-gradient-to-r from-blue-50 to-transparent opacity-40 blur-[50px] pointer-events-none" />
             <img 
                src="https://ik.imagekit.io/dypkhqxip/bgimage.png" 
                alt="Student Forge Learn Grid Architecture" 
                className="relative w-full h-auto scale-110 lg:scale-[1.15] object-contain origin-left transform hover:scale-[1.18] transition-transform duration-1000" 
             />
          </div>

        </div>
      </div>
    </section>
  );
}