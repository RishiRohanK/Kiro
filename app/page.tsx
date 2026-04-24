"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, HelpCircle, X, ShieldCheck, Bell, GraduationCap, Briefcase, Building2, ArrowUpRight } from "lucide-react";

export default function PortalPage() {
  const options = [
    {
      title: "Student Login",
      description: "Access your courses, community, and events.",
      href: "/signin",
      icon: GraduationCap,
      color: "bg-emerald-50/60",
      iconColor: "text-emerald-600",
      hoverColor: "group-hover:bg-emerald-600",
      delay: 0.1,
    },
    {
      title: "Intern Login",
      description: "Manage your tasks, attendance, and progress.",
      href: "/intern/signin",
      icon: Briefcase,
      color: "bg-blue-50/60",
      iconColor: "text-blue-600",
      hoverColor: "group-hover:bg-blue-600",
      delay: 0.2,
    },
    {
      title: "School Login",
      description: "Management tools for schools and colleges.",
      href: "/cleed/login",
      icon: Building2,
      color: "bg-red-50/60",
      iconColor: "text-red-600",
      hoverColor: "group-hover:bg-red-600",
      delay: 0.3,
    },
  ];

  const [showUpdateToast, setShowUpdateToast] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowUpdateToast(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const [showGuide, setShowGuide] = useState(false);
  const [showCookies, setShowCookies] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("sf_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setShowCookies(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("sf_cookie_consent", "true");
    setShowCookies(false);
  };
  return (
    <div className="min-h-screen md:h-screen bg-white flex flex-col selection:bg-zinc-100 selection:text-black relative overflow-hidden font-sans">
      
      {/* System Update Notification */}
      <AnimatePresence>
        {showUpdateToast && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-2 md:top-6 left-0 right-0 z-[200] px-4"
          >
            <div className="bg-blue-600 shadow-2xl px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3 rounded-xl border border-blue-500 max-w-2xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                  <Bell size={16} className="text-white animate-pulse" />
                </div>
                <div className="space-y-0.5 overflow-hidden">
                  <p className="text-[11px] md:text-[13px] text-white font-bold tracking-tight">System updated</p>
                  <p className="text-[9px] md:text-[11px] text-blue-100 font-medium truncate">Better login. Updated: April 24, 7:52 PM</p>
                </div>
              </div>
              <button 
                onClick={() => setShowUpdateToast(false)}
                className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition-all shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{ 
            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <div className="fixed md:absolute top-auto bottom-20 md:bottom-auto md:top-6 left-4 right-4 md:left-auto md:right-8 z-50 flex items-center justify-center md:justify-end gap-0">
        <button
          onClick={() => setShowGuide(true)}
          className="flex-1 md:flex-none relative flex items-center justify-center gap-2 px-3 md:px-6 py-2.5 md:py-3 border border-zinc-200 bg-white text-[10px] md:text-[12px] font-bold text-zinc-600 hover:text-black hover:border-zinc-300 transition-all rounded-none shadow-sm md:shadow-none"
        >
          <HelpCircle size={14} className="shrink-0" />
          <span>Guide</span>
          <span className="hidden md:inline ml-1">Platform</span>
          
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            1
          </span>
        </button>
        <Link
          href="/support"
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 md:px-6 py-2.5 md:py-3 border border-zinc-200 bg-white text-[10px] md:text-[12px] font-medium text-zinc-600 hover:text-black hover:border-zinc-300 transition-all rounded-none border-l-0 shadow-sm md:shadow-none"
        >
          <span>Support</span>
          <span className="hidden md:inline ml-1">Technical</span>
        </Link>
      </div>

      {/* Decorative Background Illustration */}
      <div className="absolute right-[-5%] bottom-[-5%] z-0 pointer-events-none select-none">
        <img 
          src="https://ik.imagekit.io/dypkhqxip/Nerd-bro.svg" 
          alt="Decorative Background" 
          className="h-[50vh] md:h-[80vh] w-auto object-contain opacity-40"
        />
      </div>

      {/* Walkthrough Modal */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-lg w-full p-6 md:p-10 shadow-2xl relative border border-zinc-100"
            >
              <button 
                onClick={() => setShowGuide(false)}
                className="absolute top-4 md:top-6 right-4 md:right-6 text-zinc-300 hover:text-zinc-500 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="space-y-6 md:space-y-8">
                <div className="space-y-2">
                  <h2 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight text-center">What's New</h2>
                  <p className="text-[12px] md:text-[13px] text-zinc-400 font-medium text-center">Everything you need to know about this update</p>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <div className="flex gap-4 md:gap-5 items-start">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-[13px] md:text-[14px] font-bold text-zinc-800">Horizontal Access Hub</h4>
                      <p className="text-[11px] md:text-[12px] text-zinc-500 leading-relaxed">We changed the login cards to a wide horizontal layout for easier reading on all devices.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 md:gap-5 items-start">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-[13px] md:text-[14px] font-bold text-zinc-800">Color-Coded Portals</h4>
                      <p className="text-[11px] md:text-[12px] text-zinc-500 leading-relaxed">Unique color themes for Emerald, Blue, and Red portals to help you quickly find your way.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 md:gap-5 items-start">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-zinc-900" />
                    </div>
                    <div>
                      <h4 className="text-[13px] md:text-[14px] font-bold text-zinc-800">Live System Alerts</h4>
                      <p className="text-[11px] md:text-[12px] text-zinc-500 leading-relaxed">Top notifications now show exactly when and what changed in the system.</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowGuide(false)}
                  className="w-full py-3 md:py-3.5 bg-zinc-900 text-white text-[10px] md:text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-lg shadow-zinc-200 rounded-none"
                >
                  Explore Update
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col items-start justify-center px-6 md:px-24 py-12 md:py-8 relative z-10 overflow-hidden">
        <div className="w-full max-w-5xl flex flex-col items-start">

          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-start gap-4 mb-6 md:mb-10"
          >
            <div className="flex items-center gap-3 md:gap-4">
              <img 
                src="https://ik.imagekit.io/dypkhqxip/sflogo" 
                alt="Logo" 
                className="h-8 md:h-12 w-auto object-contain"
              />
              <div className="h-4 w-px bg-zinc-200" />
              <img 
                src="https://ik.imagekit.io/dypkhqxip/platform?updatedAt=1776791557303" 
                alt="Platform" 
                className="h-5 md:h-8 w-auto object-contain"
              />
            </div>

            <div className="text-left space-y-1">
              <h1 className="text-xl md:text-4xl font-semibold tracking-tight text-zinc-900">
                Welcome back.
              </h1>
              <p className="text-zinc-400 text-[12px] md:text-[14px] font-medium">
                Select an option to continue to your dashboard.
              </p>
            </div>
          </motion.div>

          {/* Options Stack (Horizontal Design) */}
          <div className="flex flex-col gap-3 md:gap-4 w-full max-w-4xl">
            {options.map((option) => {
              const isFrozen = option.title === "School Login";

              return (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: option.delay }}
                >
                  <div className={`group relative ${option.color} border border-zinc-100 shadow-sm overflow-hidden transition-all duration-300 ${isFrozen ? 'opacity-80' : 'hover:border-zinc-300 hover:shadow-md cursor-pointer'}`}>
                    {isFrozen ? (
                      <div className="contents">
                        <CardContent option={option} isFrozen={isFrozen} />
                      </div>
                    ) : (
                      <Link href={option.href} className="contents">
                        <CardContent option={option} isFrozen={isFrozen} />
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Full-Width Grey Footer */}
      <motion.footer 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full bg-zinc-50 border-t border-zinc-100 py-6 px-6 relative z-10 mt-auto"
      >
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-4 text-center">
          <div className="space-y-1">
            <p className="text-[9px] md:text-[10px] text-zinc-500 font-medium leading-relaxed max-w-lg">
              © 2025-2026 Student Forge Technologies Private Limited. 
              Unauthorized access or use of this platform is strictly prohibited.
            </p>
            <p className="text-[8px] md:text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
              platform.studentforge.in • Enterprise-grade encryption
            </p>
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-zinc-100 w-full justify-center">
            <Link href="/home" className="text-[9px] md:text-[10px] font-bold text-zinc-400 hover:text-black transition-colors uppercase tracking-widest">
              Home
            </Link>
            <Link href="/support" className="text-[9px] md:text-[10px] font-bold text-zinc-400 hover:text-black transition-colors uppercase tracking-widest">
              Support
            </Link>
          </div>
        </div>
      </motion.footer>

      {/* Minimalist Cookie Consent */}
      <AnimatePresence>
        {showCookies && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 md:bottom-8 left-0 right-0 z-[100] px-4"
          >
            <div className="bg-white border border-zinc-200 shadow-2xl p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
                  <ShieldCheck size={16} className="text-emerald-600" />
                </div>
                <p className="text-[11px] md:text-[12px] text-zinc-500 font-medium leading-tight">
                  We use essential cookies to ensure the best portal experience.
                </p>
              </div>
              <button 
                onClick={acceptCookies}
                className="w-full sm:w-auto px-6 py-2 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors shrink-0 rounded-none"
              >
                Got it
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CardContent({ option, isFrozen }: { option: any, isFrozen: boolean }) {
  return (
    <div className="flex flex-col md:flex-row items-center h-auto md:h-28">
      {/* Text Area (Main Content) */}
      <div className="flex-1 p-5 md:p-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 w-full">
        <div className="text-center md:text-left space-y-1">
          <h3 className="text-lg md:text-xl font-bold text-zinc-900 flex items-center gap-3 justify-center md:justify-start">
            {option.title}
            {isFrozen && (
              <span className="text-[8px] md:text-[10px] bg-white px-2 py-0.5 border border-zinc-200 text-zinc-400 font-bold uppercase tracking-widest">
                Maintenance
              </span>
            )}
          </h3>
          <p className="text-zinc-500 text-[11px] md:text-[13px] font-medium leading-relaxed max-w-lg">
            {isFrozen ? "Scheduled maintenance for infrastructure upgrades." : option.description}
          </p>
        </div>

        <div className="shrink-0 w-full md:w-auto mt-2 md:mt-0">
          <div className={`inline-flex w-full md:w-auto items-center justify-center px-6 md:px-10 py-2.5 md:py-3 text-[11px] md:text-[13px] font-medium transition-all rounded-none ${
            isFrozen 
            ? 'bg-white/50 text-zinc-400 cursor-not-allowed border border-zinc-200' 
            : `bg-zinc-900 text-white ${option.hoverColor} group-hover:shadow-xl group-hover:-translate-y-0.5`
          }`}>
            {isFrozen ? "Locked" : "Enter portal"} {!isFrozen && <ArrowUpRight size={14} className="ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />}
          </div>
        </div>
      </div>
    </div>
  );
}
