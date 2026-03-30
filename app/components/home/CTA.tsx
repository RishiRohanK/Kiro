"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative w-full bg-blue-600 overflow-hidden">
      <div className="mx-auto flex flex-col lg:flex-row lg:h-[400px]">

        {/* Left Side: Image with Sharp Cross-Slant Look */}
        <div className="relative w-full lg:w-[40%] h-[250px] lg:h-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
            alt="Engineering Workspace"
            className="h-full w-full object-cover grayscale brightness-75 transition-transform duration-700 hover:scale-105"
          />
          {/* The Slant Divider - Sharp architectural cut */}
          <div
            className="absolute inset-y-0 -right-1 w-32 bg-blue-600 hidden lg:block"
            style={{ clipPath: 'polygon(100% 0, 0% 0, 100% 100%)' }}
          />
        </div>

        {/* Right Side: Content - Aligned and Compact */}
        <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-20">
          <div className="max-w-xl">
            {/* Minimal Indicator */}
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[1px] w-5 bg-white/40" />
              <span className="text-[13px] font-medium text-white/80 tracking-tight">
                Enrollment portal
              </span>
            </div>

            {/* Heading - Medium Weight, Sentence Case, Reduced Size */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-[1.15]">
              Your engineering career <br />
              starts with us.
            </h2>

            {/* Description - Normal weight, No blurs */}
            <p className="mt-6 text-[15px] md:text-[17px] leading-relaxed text-blue-100 font-normal">
              Join a global network of ambitious builders. Unlock high-impact
              internships and professional opportunities designed for the
              next generation.
            </p>

            {/* Action Buttons - Sharp Edges, Normal Weight */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="flex h-12 items-center justify-center bg-black px-10 text-[14px] text-white transition-all hover:bg-zinc-900 active:scale-[0.98] font-normal"
              >
                Join now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              <Link
                href="/mentorship"
                className="flex h-12 items-center justify-center border border-white/20 bg-white/5 px-10 text-[14px] text-white transition-all hover:bg-white/10 active:scale-[0.98] font-normal"
              >
                Book free mentorship
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}