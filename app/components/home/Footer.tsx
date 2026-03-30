"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <footer className="w-full bg-white py-12 border-t border-zinc-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-10 px-6 sm:flex-row lg:px-10">

        {/* Left Side: Branding & Live Status */}
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-black text-zinc-900 uppercase tracking-tighter">
              Student Forge
            </span>
            <div className="h-4 w-[1px] bg-zinc-200" />
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest">
                Systems live
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Corporate Info & Back to Top */}
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
           <span className="text-[11px] text-zinc-400 font-medium tracking-tight">
              © 2026 Student Forge Technologies Pvt. Ltd.
            </span>
            {mounted && (
              <>
                <div className="hidden md:block h-1 w-1 bg-zinc-200 rounded-full" />
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-[11px] font-black text-zinc-900 hover:text-blue-600 transition-colors uppercase tracking-[0.2em] pb-0.5 border-b border-zinc-100"
                >
                  To top ↑
                </button>
              </>
            )}
        </div>

        {/* Right Side: Version & Portal access */}
        <div className="flex items-center gap-8">
            <Link 
              href="/payment-gateway/login" 
              className="text-[11px] text-zinc-500 hover:text-zinc-900 transition-colors font-bold uppercase tracking-wider"
            >
              Access Portal
            </Link>
            <div className="text-[10px] text-zinc-300 font-mono tracking-tighter">
              v2.0.4.RLX
            </div>
        </div>

      </div>
    </footer>
  );
}