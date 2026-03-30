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
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FAFAFA] p-6 font-sans relative">
      
      {/* Brand Logo in Top Left */}
      <div className="absolute top-8 left-8 md:top-12 md:left-12">
        <img 
          src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1773390835/Screenshot_2026-03-13_at_14.02.11-removebg-preview_lryxoy.png" 
          alt="Forge Logo" 
          className="h-10 md:h-12 w-auto object-contain"
        />
      </div>

      {/* Bold Red Content Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl w-full bg-[#E11D48] text-white rounded-[40px] p-12 md:p-20 text-center shadow-2xl shadow-red-500/20"
      >
        {/* Simple Grammar and Copy */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Platform is closed for maintenance
          </h1>
          <p className="text-red-100 text-lg md:text-xl font-medium leading-relaxed max-w-lg mx-auto">
            We are updating our learning platform. We will be back soon with new courses and better tools for you.
          </p>
        </div>

        {/* Minimalist Status */}
        <div className="pt-10">
          <div className="inline-block px-6 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium tracking-[0.05em]">
            System Upgrade in Progress
          </div>
        </div>
      </motion.div>

      {/* Footer Credit */}
      <div className="mt-12 text-center">
        <p className="text-zinc-400 text-[10px] font-medium tracking-widest">
          &copy; {new Date().getFullYear()} Forge Digital Technologies.
        </p>
      </div>
    </div>
  );
}



