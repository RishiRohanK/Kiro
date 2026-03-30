"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function QuoteSection() {
  return (
    <section className="relative overflow-hidden bg-blue-600 py-3 lg:py-4">
      {/* Decorative Overlays - More Compact */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-[70px] -ml-24 -mb-24" />

      <div className="mx-auto max-w-4xl px-4 lg:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-10">
          
          {/* Quote Icon - Smaller and Side-aligned if space permits */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="shrink-0"
          >
            <div className="bg-white/10 p-3 rounded-full border border-white/20">
              <Quote className="text-white w-5 h-5 rotate-180" />
            </div>
          </motion.div>

          {/* The Quote - More Compact Typography */}
          <motion.div
            initial={{ y: 5, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <blockquote className="relative">
              <p className="text-base lg:text-lg font-medium tracking-tight text-white leading-tight lg:leading-tight">
                "Programs must be written for people to read, and only incidentally for machines to execute."
              </p>
              <footer className="mt-2 flex items-center justify-center md:justify-start gap-3">
                <div className="h-[1px] w-6 bg-white/30" />
                <cite className="text-[11px] font-bold uppercase tracking-widest text-white/60 not-italic">
                  Harold Abelson
                </cite>
              </footer>
            </blockquote>
          </motion.div>
        </div>
      </div>

      {/* Background Animated Scroller (Subtle) */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full opacity-[0.02] select-none pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="whitespace-nowrap text-8xl font-black text-white px-6"
        >
          STUDENT FORGE ACADEMY STUDENT FORGE ACADEMY STUDENT FORGE ACADEMY
        </motion.div>
      </div>
    </section>
  );
}
