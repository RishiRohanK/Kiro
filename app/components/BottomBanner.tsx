"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Cpu, Globe } from "lucide-react";

export function BottomBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-zinc-900 border-t border-white/5 py-4 px-6 md:px-12 mt-auto"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand Group */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#F5332C]" />
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">System Terminal</span>
          </div>
          <div className="h-4 w-px bg-white/10 hidden md:block" />
          <div className="flex items-center gap-2">
            <Shield size={12} className="text-zinc-500" />
            <span className="text-[10px] font-medium text-zinc-400">ISO/IEC 27001 Certified</span>
          </div>
        </div>

        {/* Real-time Status */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider leading-none">Security</span>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Active</span>
            </div>
            <Lock size={14} className="text-emerald-500" />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider leading-none">Network</span>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">Encrypted</span>
            </div>
            <Globe size={14} className="text-blue-400" />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider leading-none">Core</span>
              <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest mt-1">Stable</span>
            </div>
            <Cpu size={14} className="text-zinc-300" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
