"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

/**
 * Maintenance Page with Red Container
 * Focused on a bold, high-contrast "red container" look.
 * Regular web visitors see the maintenance message.
 * PWA users are redirected to the Cleed Login gateway.
 */
export default function Home() {
  const router = useRouter();
  const [isStandalone, setIsStandalone] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone || 
      document.referrer.includes('android-app://');
    
    if (isStandaloneMode) {
      setIsStandalone(true);
      router.push("/cleed/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading || isStandalone) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="h-8 w-8 border-2 border-zinc-200 border-t-red-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between bg-[#FAFAFA] font-sans">
      
      {/* Spacer to push content to center */}
      <div />

      <div className="w-full flex flex-col items-center justify-center p-6">
        {/* Brand Logo - Increased Size */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <img 
            src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1773390835/Screenshot_2026-03-13_at_14.02.11-removebg-preview_lryxoy.png" 
            alt="Forge Logo" 
            className="h-16 md:h-24 w-auto object-contain mx-auto"
          />
        </motion.div>

        {/* Sharp-Edged Red Content Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl w-full bg-[#E11D48] text-white rounded-none p-12 md:p-24 text-center shadow-2xl shadow-red-500/10"
        >
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
              Platform is currently <br className="hidden md:block" /> closed for maintenance
            </h1>
            <p className="text-red-100 text-lg md:text-xl font-normal leading-relaxed max-w-xl mx-auto">
              We are enhancing our learning platform to provide a world-class experience. 
              We will be back online shortly with new features.
            </p>
          </div>

          {/* Minimalist Status */}
          <div className="pt-12">
            <div className="inline-block px-10 py-3 rounded-none bg-white text-[#E11D48] text-[10px] font-black uppercase tracking-[0.2em]">
              System Upgrade
            </div>
          </div>
        </motion.div>
      </div>

      {/* Grey Colour Footer */}
      <footer className="w-full bg-zinc-100 py-10 border-t border-zinc-200 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-zinc-500 text-[11px] font-semibold tracking-widest leading-loose">
            &copy; {new Date().getFullYear()} Student Forge Technologies Private Ltd. <br className="md:hidden" /> All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}



