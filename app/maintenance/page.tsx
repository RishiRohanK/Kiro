'use client';

import React from 'react';
import Link from 'next/link';
import { CircleUser } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-white text-[#495057] font-sans flex flex-col items-center selection:bg-blue-50">
      {/* Header with Breadcrumbs and Login */}
      <div className="w-full max-w-[1000px] pt-12 px-6 flex justify-between items-center">
        <nav className="flex items-center gap-2 text-[13px] font-medium text-zinc-400 opacity-50">
          <span>Portal</span>
          <span className="text-zinc-200 text-[10px]">/</span>
          <span className="text-zinc-900">Maintenance</span>
        </nav>

        <Link
          href="/intern/signin"
          className="flex h-9 items-center gap-2 border border-zinc-200 bg-white px-5 text-[12px] font-bold text-zinc-700 transition-all hover:border-zinc-800 hover:text-black active:scale-[0.98] shadow-sm rounded-none"
        >
          <CircleUser className="h-4 w-4 text-[#003366]" />
          Intern Login
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 w-full">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 max-w-[1000px] w-full">
          
          {/* Lottie Animation on the Left */}
          <div className="hidden md:block w-[450px] h-[450px] flex-shrink-0 animate-in fade-in duration-1000">
            {React.createElement('dotlottie-wc', {
              src: "https://lottie.host/1ccc4870-054d-4dae-bac2-0c0e156ad970/tFd2HvuoPI.lottie",
              style: { width: '450px', height: '450px' },
              autoplay: true,
              loop: true
            } as any)}
          </div>

          {/* Maintenance Message Container on the Right */}
          <div className="w-full max-w-[500px] bg-white border border-zinc-200 p-8 md:p-12 relative z-10 shadow-sm animate-in slide-in-from-right-4 duration-700">
            {/* Logo */}
            <div className="mb-10 flex items-center gap-5">
              <img
                src="https://ik.imagekit.io/dypkhqxip/platform?updatedAt=1776791557303"
                alt="Student Forge"
                className="h-12 w-auto"
              />
              <div className="w-[1px] h-10 bg-zinc-200"></div>
              <img
                src="https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858"
                alt="SF Logo"
                className="h-12 w-auto"
              />
            </div>

            {/* Maintenance Message */}
            <div className="space-y-6">
              <div className="mb-6">
                <h1 className="text-lg font-medium text-zinc-800">Under Maintenance</h1>
                <p className="text-[12px] text-zinc-400 font-medium">Temporary Downtime</p>
              </div>

              <div className="space-y-4 text-[13px] text-zinc-500 leading-relaxed">
                <p>
                  Our platform is currently undergoing essential updates to provide you with a more secure and efficient environment.
                </p>
                <p>
                  We expect to be back online very shortly. Thank you for your patience and understanding.
                </p>
              </div>

              <div className="pt-8 border-t border-zinc-100">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-widest">
                    Status: Updating Servers
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full bg-zinc-50 border-t border-zinc-100 py-10 px-6 mt-auto">
        <div className="max-w-[850px] mx-auto flex flex-col items-center gap-6 text-center">
          <div className="space-y-4">
            <p className="text-[12px] text-zinc-500 font-normal leading-relaxed">
              © 2025-2026 Student Forge Technologies Private Limited. All Rights Reserved. 
              Unauthorized access or use of this platform is strictly prohibited.
            </p>
            <p className="text-[11px] text-zinc-400 font-normal tracking-wide">
              platform.studentforge.in is a registered trademark. Secured with enterprise-grade encryption.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
