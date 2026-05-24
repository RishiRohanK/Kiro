'use client';

import React from 'react';
import Link from 'next/link';
import { StickyBanner } from '@/components/ui/sticky-banner';

export default function MaintenancePage() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-white text-[#495057] font-sans flex flex-col items-center selection:bg-blue-50">
      <StickyBanner className="bg-gradient-to-b from-red-600 to-red-700 border-b border-red-800">
        <p className="mx-0 max-w-[90%] text-white drop-shadow-md text-[12px] md:text-[13px] font-medium leading-tight text-center">
          Under Maintenance: Our platform is currently undergoing essential updates. We expect to be back online very shortly. Thank you for your patience and understanding.
        </p>
      </StickyBanner>

      <div className="flex-1 flex items-center justify-center p-4 w-full overflow-hidden">
        <div className="flex items-center justify-center w-full max-w-[1200px]">
          {/* Lottie Animation Centered and Large */}
          <div className="w-[85vw] h-[85vw] max-w-[55vh] max-h-[55vh] md:max-w-[60vh] md:max-h-[60vh] flex-shrink-0 animate-in fade-in zoom-in-95 duration-1000 flex items-center justify-center">
            {React.createElement('dotlottie-wc', {
              src: "/maintenance.lottie",
              style: { width: '100%', height: '100%' },
              autoplay: true,
              loop: true
            } as any)}
          </div>
        </div>
      </div>

      {/* Main Page Footer */}
      <footer className="w-full flex-none bg-white border-t border-slate-200 px-6 md:px-20 py-5 relative z-30">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <Link href="https://kiro.redlix.co.in/lms">
              <img 
                src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-05-14_at_17.46.09-removebg-preview.png?updatedAt=1778760997901" 
                alt="Official Logo" 
                className="h-12 w-auto opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
              />
            </Link>
            <div className="h-8 w-px bg-slate-200 hidden md:block" />
            <div>
              <p className="text-[12px] text-slate-500 font-medium">
                © {new Date().getFullYear()} Student Forge Technologies Pvt Ltd.
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Powered by Cheetah Servers • Redlix Systems, Hyderabad
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-[11px] font-medium text-slate-500 hover:text-slate-900">Privacy Policy</Link>
            <Link href="/terms" className="text-[11px] font-medium text-slate-500 hover:text-slate-900">Terms of Use</Link>
            <Link href="/security" className="text-[11px] font-medium text-slate-500 hover:text-slate-900">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
