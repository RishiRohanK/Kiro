"use client";

import React from "react";
import { Home, User, FileText, HelpCircle, ArrowRight } from "lucide-react";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();

  const tabs = [
    { title: "Home", icon: Home, href: "/" },
    { title: "Intern Portal", icon: User, href: "/intern/signin" },
    { type: "separator" as const },
    { title: "Courses", icon: FileText, href: "/courses" },
    { title: "Support", icon: HelpCircle, href: "https://www.redlix.co.in/intern-support" },
  ];

  const handleTabChange = (index: number | null) => {
    if (index !== null) {
      const tab = tabs[index];
      if (tab && "href" in tab && tab.href) {
        if (tab.href.startsWith("http")) {
          window.location.href = tab.href;
        } else {
          router.push(tab.href);
        }
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-zinc-950 p-4 md:p-6 flex items-center justify-center font-sans">
      {/* Floating Hero Background Container with Rounded Edges and Border */}
      <div className="relative w-full h-full bg-zinc-900/50 border border-white/10 rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl flex flex-col items-center justify-center">
        {/* Background Image with Gradient Mask */}
        <div
          className="absolute inset-0 z-0 bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/a72ca2f3-9dd1-4fe4-84ba-fe86468a5237_3840w.webp?w=800&q=80)] bg-cover bg-center opacity-40"
          style={{
            maskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
            WebkitMaskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
          }}
        />

        {/* Floating Navbar */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
          <ExpandableTabs
            tabs={tabs as any}
            onChange={handleTabChange}
            activeColor="text-blue-400"
            className="border-white/10 bg-zinc-900/80 backdrop-blur-md text-white shadow-lg"
          />
        </div>

        {/* Centered Hero Content Block */}
        <div className="relative z-10 max-w-2xl px-6 text-center space-y-6 flex flex-col items-center justify-center">
          {/* Subtle Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">
              Student Forge Technologies
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight"
          >
            A Workspace for <br />
            <span className="bg-gradient-to-r from-white via-white to-amber-300 bg-clip-text text-transparent">
              Next-Gen Engineers
            </span>
          </motion.h1>

          {/* Subtitle Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm sm:text-base text-zinc-400 max-w-lg leading-relaxed font-medium"
          >
            Access your daily internship tasks, track learning curricula, and discover industry-vetted engineering courses in one unified space.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-3.5 pt-2"
          >
            <button
              onClick={() => router.push("/intern/signin")}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3 text-xs font-bold text-zinc-950 transition-all hover:scale-[1.02] hover:bg-zinc-200 active:scale-[0.98] cursor-pointer"
            >
              Intern Portal
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => router.push("/courses")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3 text-xs font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/25 active:scale-[0.98] cursor-pointer"
            >
              Explore Courses
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
