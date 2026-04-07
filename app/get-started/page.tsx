"use client";

import { ArrowRight, GraduationCap, Building, ShieldCheck, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Navbar from "../components/home/Navbar";
import SubNavbar from "../components/home/SubNavbar";
import Footer from "../components/home/Footer";
import CTA from "../components/home/CTA";

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-blue-100">
      
      {}
      <Navbar />
      <SubNavbar />

      <main className="w-full">
        
        {}
        <section className="relative bg-zinc-900 py-16 md:py-20 lg:py-24 overflow-hidden">
          {}
          <div className="absolute top-0 right-0 w-[50%] h-full bg-blue-600/10 blur-[100px] pointer-events-none" />
          
          <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/10 bg-white/5 text-blue-400 text-[10px] font-bold uppercase tracking-widest leading-none">
                Onboarding Overview
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white leading-[1.1]">
                Let's get your <br />
                <span className="text-blue-500">career moving.</span>
              </h1>
              <p className="text-[16px] md:text-[17px] text-zinc-400 leading-relaxed font-normal max-w-lg">
                Welcome to Skill Grid by Student Forge. Your journey from academic learning to professional excellence starts here.
              </p>
            </div>
          </div>
        </section>

        {}
        <section className="bg-white py-12 md:py-16 border-b border-zinc-100">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="max-w-3xl mb-8">
              <h2 className="text-3xl md:text-5xl font-normal tracking-tight text-zinc-900 leading-[1.15] mb-6">
                Building the <span className="text-violet-500">future</span> of <span className="text-emerald-500">engineering</span> <br />
                with the <span className="text-blue-500">Skill Grid</span> <span className="text-orange-400">infrastructure</span>.
              </h2>
              
              <p className="text-[16px] md:text-[17px] text-zinc-500 leading-relaxed font-normal mb-8">
                Created by <span className="font-bold text-zinc-900">Student Forge</span>, Skill Grid is the world's most 
                complete ecosystem for professional growth. We replace disjointed learning platforms with a single, 
                <span className="text-zinc-900 font-medium"> high-performance system</span> that integrates learning, 
                building, and career placement directly into your workflow.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
                {[
                  "Direct access to industry-curated curriculum",
                  "Automated professional portfolio building",
                  "Verified internship placements with partners",
                  "Global networking with technical mentors",
                  "Real-world project certification modules",
                  "24/7 technical support and peer review"
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-blue-600 mt-1 shrink-0" />
                    <span className="text-[14px] text-zinc-600 font-medium leading-relaxed">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {}
        <section className="bg-zinc-50/50 py-16 md:py-20 overflow-hidden relative">
          {}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

          <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              
              {}
              <div className="space-y-4">
                <div className="inline-flex h-6 items-center px-3 border border-zinc-200 bg-white text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
                  The Ecosystem
                </div>
                <h2 className="text-4xl font-medium tracking-tighter text-zinc-900 leading-none">
                  About <br /> <span className="text-blue-600">Skill Grid.</span>
                </h2>
                <div className="space-y-4 max-w-md">
                  <p className="text-[15px] text-zinc-500 leading-relaxed font-normal">
                    The Skill Grid is a specialized vertical infrastructure built for the next generation of engineers. 
                    It's not just a platform; it's a verifiable pipeline from learning to placement.
                  </p>
                  <div className="pt-2 grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-[20px] font-bold text-zinc-900 leading-none">500+</h4>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1 tracking-wider">Placements</p>
                    </div>
                    <div>
                      <h4 className="text-[20px] font-bold text-zinc-900 leading-none">98%</h4>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1 tracking-wider">Success Rate</p>
                    </div>
                  </div>
                </div>
              </div>

              {}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 opacity-20 blur-[20px] group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />
                <Link 
                  href="/intern/signup" 
                  className="relative block p-8 bg-white border border-zinc-200 hover:border-zinc-900 transition-all duration-500 shadow-xl shadow-blue-500/5 rounded-none overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 bg-zinc-900 flex items-center justify-center text-white">
                      <GraduationCap size={24} />
                    </div>
                    <div className="bg-blue-100/50 px-2 py-0.5 text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                      Student Access
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    <h3 className="text-[24px] font-bold tracking-tighter text-zinc-900">Join the Skill Grid</h3>
                    <p className="text-[14px] text-zinc-500 leading-relaxed font-medium max-w-sm">
                      Access your dashboard, track mastery, and unlock exclusive internship opportunities.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                    <span className="text-[11px] font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                       Continue to Onboarding <ArrowRight size={14} />
                    </span>
                    <CheckCircle2 className="text-blue-600 opacity-20 group-hover:opacity-100 transition-opacity" size={20} />
                  </div>
                </Link>
              </div>

            </div>
          </div>
        </section>

        {}
        <CTA />

      </main>

      {}
      <Footer />
    </div>
  );
}

