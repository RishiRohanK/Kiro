"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full border-b border-zinc-100 bg-white overflow-hidden">
      {/* Background Decorative Grid */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #d4d4d8 1px, transparent 1px), linear-gradient(to bottom, #d4d4d8 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          opacity: 0.4,
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-14 md:py-20 flex flex-col items-center text-center">

        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 border border-zinc-800 bg-black px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[12px] font-medium text-white tracking-wide ">
            Introducing Skill Grid
          </span>
        </div>

        {/* Heading */}
        <h1 className="max-w-4xl text-5xl md:text-6xl font-normal tracking-tight text-zinc-900 leading-[1.1]">
          Your{" "}
          <span className="text-violet-500">skill</span>{" "}
          <span className="text-emerald-500">development</span>{" "}
          <span className="text-blue-500">network</span>,{" "}
          <br className="hidden sm:block" />built for the{" "}
          <span className="text-orange-400">real</span>{" "}
          <span className="text-pink-500">world</span>.
        </h1>

        {/* Description */}
        <p className="mt-6 max-w-2xl text-[16px] md:text-[17px] leading-relaxed text-zinc-500 font-normal">
          Skill Grid by <span className="font-semibold text-zinc-800">Student Forge</span> is a structured learning & internship ecosystem
          where students acquire job-ready skills, build real projects, and earn
          verifiable credentials — all in one place.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link
            href="/get-started"
            className="flex h-11 items-center justify-center gap-2 bg-blue-600 px-8 text-[14px] text-white font-medium transition-all hover:bg-blue-700 active:scale-[0.98] rounded-none"
          >
            Get started free
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/courses"
            className="flex h-11 items-center justify-center border border-zinc-200 bg-white px-8 text-[14px] text-zinc-900 font-medium transition-all hover:border-zinc-800 active:scale-[0.98] rounded-none"
          >
            Explore courses
          </Link>
        </div>

        {/* Social proof */}
        <p className="mt-6 text-[13px] text-zinc-400 font-normal">
          Trusted by <span className="text-zinc-700 font-medium">500+ students</span> across India · Powered by Student Forge
        </p>



      </div>
    </section>
  );
}