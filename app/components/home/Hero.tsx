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
          opacity: 0.4,
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 py-10 md:py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Learning Propositions */}
          <div className="flex flex-col items-start text-left">
            <div className="mb-8 inline-flex items-center gap-2 border border-zinc-800 bg-black px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[12px] font-medium text-white tracking-wide ">
                Introducing Learn Grid
              </span>
            </div>

            <h1 className="max-w-4xl text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-zinc-900 leading-[1.05]">
              Your{" "}
              <span className="text-violet-500">learn</span>{" "}
              <span className="text-emerald-500">development</span>{" "}
              <br className="hidden lg:block" />
              <span className="text-blue-500">network</span>, built for 
              <br className="hidden lg:block" /> the{" "}
              <span className="text-orange-400">real</span>{" "}
              <span className="text-pink-500">world</span>.
            </h1>

            <p className="mt-8 max-w-xl text-[16px] md:text-[17px] leading-relaxed text-zinc-500 font-normal">
              Learn Grid by <span className="font-semibold text-zinc-800">Student Forge</span> is a structured learning & internship ecosystem
              where students acquire job-ready skills, build real projects, and earn
              verifiable credentials — all in one place.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                href="/get-started"
                className="flex h-12 items-center justify-center gap-2 bg-blue-600 px-10 text-[14px] text-white font-medium transition-all hover:bg-blue-700 active:scale-[0.98] rounded-none shadow-lg shadow-blue-500/10"
              >
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/courses"
                className="flex h-12 items-center justify-center border border-zinc-200 bg-white px-10 text-[14px] text-zinc-900 font-medium transition-all hover:border-zinc-800 active:scale-[0.98] rounded-none"
              >
                Explore courses
              </Link>
            </div>

            <p className="mt-10 text-[13px] text-zinc-400 font-normal border-t border-zinc-100 pt-6 w-full lg:w-fit">
              Trusted by <span className="text-zinc-700 font-medium">500+ students</span> across India · Powered by Student Forge
            </p>
          </div>

          {/* Right Column: Visual Component */}
          <div className="relative group lg:block hidden animate-in fade-in slide-in-from-right-8 duration-1000">
             <div className="absolute -inset-4 bg-gradient-to-r from-blue-50 to-violet-50 opacity-50 blur-[40px] pointer-events-none" />
             <img 
                src="https://ik.imagekit.io/dypkhqxip/bgimage.png" 
                alt="Student Forge Learn Grid Architecture" 
                className="relative w-full h-auto object-contain transform group-hover:scale-[1.02] transition-transform duration-700" 
             />
          </div>

        </div>
      </div>
    </section>
  );
}