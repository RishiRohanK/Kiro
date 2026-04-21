"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="relative w-full bg-zinc-50 py-16 md:py-24 border-t border-zinc-200 overflow-hidden">
      
      {}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <div className="flex items-center gap-4 text-6xl md:text-8xl lg:text-[160px] font-black opacity-[0.06] whitespace-nowrap leading-none select-none">
          <span className="text-violet-900 lowercase">learn.</span>
          <span className="text-emerald-900 lowercase">build.</span>
          <span className="text-blue-900 lowercase">grow.</span>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-12 px-6 lg:px-10 md:flex-row">
        
        {}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[15px] font-bold text-zinc-900 tracking-tighter hover:text-indigo-600 transition-colors">
              Student Forge
            </Link>
            <div className="h-4 w-[1px] bg-zinc-200" />
            <img 
              src="https://ik.imagekit.io/dypkhqxip/platform?updatedAt=1776791557303"
              alt="Platform"
              className="h-6 w-auto object-contain greyscale opacity-80 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="h-4 w-[1px] bg-zinc-200" />
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />
            <span className="text-[11px] text-zinc-400 font-medium lowercase">
              live
            </span>
          </div>
        </div>

        {}
        <div className="flex flex-col md:flex-row items-center gap-8 md:ml-auto">
          <span className="text-[11px] text-zinc-500 font-medium">
            © 2026 Student Forge Technologies Private Limited
          </span>
          {mounted && (
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[11px] font-medium text-zinc-400 hover:text-zinc-900 transition-all border-b border-transparent hover:border-zinc-900 pb-0.5"
            >
              Back to top
            </button>
          )}
        </div>

      </div>
    </footer>
  );
}