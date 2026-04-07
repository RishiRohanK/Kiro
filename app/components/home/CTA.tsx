"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative w-full bg-white py-10 md:py-14 overflow-hidden border-t border-zinc-100">
      {}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(to right, #d4d4d8 1px, transparent 1px), linear-gradient(to bottom, #d4d4d8 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          opacity: 0.25,
        }} 
      />
      
      {}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          {}
          <div className="mb-4 inline-flex items-center gap-2 border border-zinc-800 bg-black px-4 py-1.5 ">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[12px] font-medium text-white tracking-wide">
              Final entry portal
            </span>
          </div>

          <h2 className="max-w-4xl text-3xl md:text-5xl font-normal tracking-tight text-zinc-900 leading-[1.1]">
            Ready to <span className="text-blue-600">master</span> your <span className="text-zinc-400">engineering</span> future?
          </h2>

          <p className="max-w-2xl mx-auto text-[15px] md:text-[16px] text-zinc-500 leading-relaxed font-normal">
            Join the <span className="text-zinc-900 font-bold">learn grid</span> operations hub and bridge the gap between 
            academic theory and high-performance industry placement.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/get-started"
              className="group flex h-11 items-center justify-center bg-blue-600 px-8 text-[14px] font-medium text-white transition-all hover:bg-blue-700 active:scale-[0.98] rounded-none w-full sm:w-auto"
            >
              Get started now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link
              href="/mentorship"
              className="flex h-11 items-center justify-center border border-zinc-200 bg-white px-8 text-[14px] font-medium text-zinc-900 transition-all hover:bg-zinc-50 active:scale-[0.98] rounded-none w-full sm:w-auto"
            >
              Talk to a mentor
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}