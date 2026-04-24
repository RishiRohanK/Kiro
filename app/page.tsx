"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, HelpCircle, X, ShieldCheck } from "lucide-react";

export default function PortalPage() {
  const options = [
    {
      title: "Student Login",
      description: "Access your courses, community, and events.",
      href: "/signin",
      illustration: "https://ik.imagekit.io/dypkhqxip/Teacher%20student-pana.svg",
      color: "bg-emerald-50",
      hoverColor: "group-hover:bg-emerald-600",
      delay: 0.1,
    },
    {
      title: "Intern Login",
      description: "Manage your tasks, attendance, and progress.",
      href: "/intern/signin",
      illustration: "https://ik.imagekit.io/dypkhqxip/Happy%20student-bro.svg",
      color: "bg-blue-50",
      hoverColor: "group-hover:bg-blue-600",
      delay: 0.2,
    },
    {
      title: "School Login",
      description: "Management tools for schools and colleges.",
      href: "/cleed/login",
      illustration: "https://ik.imagekit.io/dypkhqxip/High%20School-bro.svg",
      color: "bg-red-50",
      hoverColor: "group-hover:bg-red-600",
      delay: 0.3,
    },
  ];

  const [showGuide, setShowGuide] = useState(false);
  const [showCookies, setShowCookies] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("sf_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setShowCookies(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("sf_cookie_consent", "true");
    setShowCookies(false);
  };

  return (
    <div className="h-screen bg-white flex flex-col selection:bg-zinc-100 selection:text-black relative overflow-hidden font-sans">

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

      <div className="absolute top-6 right-8 z-50 flex items-center gap-4">
        <button
          onClick={() => setShowGuide(true)}
          className="flex items-center gap-2 px-4 py-1.5 border border-zinc-100 bg-white text-[12px] font-bold text-zinc-400 hover:text-black transition-all"
        >
          <HelpCircle size={14} />
          Platform Guide
        </button>
        <Link
          href="/support"
          className="flex items-center gap-2 px-4 py-1.5 border border-zinc-100 bg-white text-[12px] font-medium text-zinc-500 hover:text-black hover:border-zinc-300 transition-all"
        >
          <div className="w-1 h-1 rounded-full bg-emerald-500" />
          Technical Support
        </Link>
      </div>

      {/* Walkthrough Modal */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white max-w-lg w-full p-10 shadow-2xl relative border border-zinc-100"
            >
              <button
                onClick={() => setShowGuide(false)}
                className="absolute top-6 right-6 text-zinc-300 hover:text-zinc-500 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-zinc-900">Platform Walkthrough</h2>
                  <p className="text-[13px] text-zinc-400 font-medium">Quick guide to our new unified gateway</p>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-zinc-800">Student Access</h4>
                      <p className="text-[12px] text-zinc-500 leading-relaxed">Login here to access your courses, community boards, and upcoming events.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-zinc-800">Intern Dashboard</h4>
                      <p className="text-[12px] text-zinc-500 leading-relaxed">Manage your internship tasks, track your attendance, and review performance metrics.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-red-500 opacity-40" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-zinc-800">Institutional (School)</h4>
                      <p className="text-[12px] text-zinc-500 leading-relaxed">Management portal for schools. Currently under scheduled maintenance.</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowGuide(false)}
                  className="w-full py-3 bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors"
                >
                  Got it, Thanks
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col items-start justify-center px-6 md:px-24 py-8 relative z-10 overflow-hidden">
        <div className="w-full max-w-5xl flex flex-col items-start">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-start gap-4 mb-10"
          >
            <div className="flex items-center gap-4">
              <img
                src="https://ik.imagekit.io/dypkhqxip/sflogo"
                alt="Logo"
                className="h-10 md:h-12 w-auto object-contain"
              />
              <div className="h-4 w-px bg-zinc-200" />
              <img
                src="https://ik.imagekit.io/dypkhqxip/platform?updatedAt=1776791557303"
                alt="Platform"
                className="h-6 md:h-8 w-auto object-contain"
              />
            </div>

            <div className="text-left space-y-1">
              <h1 className="text-2xl md:text-4xl font-semibold tracking-tight text-zinc-900">
                Welcome back.
              </h1>
              <p className="text-zinc-400 text-[14px] font-medium">
                Select an option to continue to your dashboard.
              </p>
            </div>
          </motion.div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {options.map((option) => {
              const isFrozen = option.title === "School Login";

              return (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: option.delay }}
                >
                  <div className={`group block bg-white border border-zinc-100 p-0 transition-all duration-300 shadow-sm overflow-hidden ${isFrozen ? 'opacity-80' : 'hover:bg-zinc-50 cursor-pointer'}`}>
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
        className="w-full bg-zinc-50 border-t border-zinc-100 py-6 px-6 relative z-10"
      >
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-4 text-center">
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
              © 2025-2026 Student Forge Technologies Private Limited. All Rights Reserved.
              Unauthorized access or use of this platform is strictly prohibited.
            </p>
            <p className="text-[10px] text-zinc-400 font-bold">
              platform.studentforge.in is a registered trademark. Secured with enterprise-grade encryption.
            </p>
          </div>

          <div className="flex items-center gap-6 pt-4 border-t border-zinc-100 w-full justify-center">
            <Link href="/home" className="text-[11px] font-bold text-zinc-400 hover:text-black transition-colors">
              Public Home
            </Link>
            <Link href="/support" className="text-[11px] font-bold text-zinc-400 hover:text-black transition-colors">
              Technical Support
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
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md"
          >
            <div className="bg-white border border-zinc-100 shadow-2xl p-5 flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
                  <ShieldCheck size={18} className="text-emerald-600" />
                </div>
                <p className="text-[12px] text-zinc-500 font-medium leading-tight">
                  We use essential cookies to ensure the best portal experience.
                </p>
              </div>
              <button 
                onClick={acceptCookies}
                className="px-5 py-2 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-colors shrink-0"
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
    <>
      <div className={`h-32 w-full ${option.color} flex items-center justify-center p-6 overflow-hidden relative`}>
        {isFrozen && (
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <div className="bg-white/90 px-3 py-1 border border-zinc-200 shadow-sm">
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                Maintenance
              </span>
            </div>
          </div>
        )}
        <img
          src={option.illustration}
          alt={option.title}
          className={`w-full h-full object-contain mix-blend-multiply transition-transform duration-500 ${!isFrozen && 'group-hover:scale-105'}`}
        />
      </div>

      <div className="p-6 space-y-2">
        <h3 className="text-[16px] font-bold text-zinc-900">
          {option.title}
        </h3>
        <p className="text-zinc-500 text-[13px] leading-relaxed line-clamp-2">
          {isFrozen ? "This portal is currently undergoing scheduled maintenance." : option.description}
        </p>

        <div className="pt-2">
          <div className={`inline-flex items-center justify-center px-5 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${isFrozen
            ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
            : `bg-zinc-900 text-white ${option.hoverColor} group-hover:shadow-xl group-hover:-translate-y-0.5`
            }`}>
            {isFrozen ? "Access Locked" : "Continue"} {!isFrozen && <ArrowRight size={14} className="ml-2" />}
          </div>
        </div>
      </div>
    </>
  );
}
