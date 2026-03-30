"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full border-b border-zinc-100 bg-white">
      <div className="mx-auto flex flex-col lg:flex-row min-h-[450px] lg:h-[60vh]">

        {/* 1. Left Content Section - Reduced Sizes & Compact Alignment */}
        <div className="flex flex-[0.8] flex-col justify-center px-6 py-8 sm:px-10 lg:pl-20 lg:pr-10 xl:pl-32">

          {/* Subtle Indicator */}
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[1px] w-5 bg-blue-600" />
            <span className="text-[13px] font-medium text-blue-600 tracking-tight">
              Academic portal
            </span>
          </div>

          {/* Reduced Heading - Medium Weight, Sentence Case */}
          <h1 className="max-w-md text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-zinc-900 leading-[1.15]">
            Engineering education, <br />
            simplified.
          </h1>

          {/* Reduced Description - Normal Weight, Compact */}
          <p className="mt-4 max-w-sm text-[15px] md:text-[16px] leading-relaxed text-zinc-500 font-normal">
            Master industrial skills through guided projects and earn
            professional certifications in one streamlined environment.
          </p>

          {/* Compact Buttons - Sharp Edges */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/courses"
              className="flex h-11 items-center justify-center bg-black px-8 text-[14px] text-white transition-all hover:bg-zinc-800 active:scale-[0.98] font-normal"
            >
              Start learning
            </Link>

            <Link
              href="/projects"
              className="flex h-11 items-center justify-center border border-zinc-200 px-8 text-[14px] text-zinc-900 transition-all hover:bg-zinc-50 active:scale-[0.98] font-normal"
            >
              View projects
            </Link>
          </div>

          {/* Mini Learning Steps - Reduced Sizes */}
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-zinc-100 pt-6 max-w-md">
            <div>
              <p className="text-[11px] font-medium text-zinc-400 mb-1">01. Learn</p>
              <p className="text-[13px] text-zinc-900 font-medium">Curriculum</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-zinc-400 mb-1">02. Build</p>
              <p className="text-[13px] text-zinc-900 font-medium">Projects</p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-zinc-400 mb-1">03. Certify</p>
              <p className="text-[13px] text-zinc-900 font-medium">Certification</p>
            </div>
          </div>
        </div>

        {/* 2. Right Image Section - Full Fit with Frame Overlay */}
        <div className="relative flex-1 bg-zinc-50 overflow-hidden group">
          <img
            src="https://www.usnews.com/object/image/00000189-da73-d234-afff-ff772a960000/gettyimages-1414982113.jpg?update-time=1691587242372&size=responsive640"
            alt="Engineering Workspace"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Decorative Corner Overlays (Frame Effect) */}
          <div className="absolute inset-x-8 inset-y-8 pointer-events-none ring-1 ring-white/20 border-white/10" />
          <div className="absolute top-10 right-10 h-12 w-12 border-t-2 border-r-2 border-white/40 pointer-events-none" />
          <div className="absolute bottom-10 left-10 h-12 w-12 border-b-2 border-l-2 border-white/40 pointer-events-none" />

          {/* Subtle Color Fade Overlay */}
          <div className="absolute inset-0 bg-black/5 pointer-events-none" />
        </div>

      </div>
    </section>
  );
}