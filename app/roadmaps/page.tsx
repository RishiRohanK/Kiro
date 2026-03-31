"use client";

import Navbar from "../components/home/Navbar";
import SubNavbar from "../components/home/SubNavbar";
import Footer from "../components/home/Footer";
import CTA from "../components/home/CTA";
import { Search, Clock, Users, ArrowRight, Heart, Download } from "lucide-react";
import { useState, useMemo } from "react";

const roadmaps = [
    {
      title: "Web Development",
      description: "Build beautiful websites and web apps that everyone can use.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg",
      skills: ["HTML & CSS", "JavaScript", "React & Next.js", "Node.js Basics", "Database & Deploy"],
      level: "Beginner",
      pdfUrl: "https://ik.imagekit.io/dypkhqxip/frontend.pdf"
    },
    {
      title: "App Development",
      description: "Create high-quality mobile applications for both iOS and Android phones.",
      logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
      skills: ["Mobile UI Design", "Flutter & Dart", "React Native", "Firebase Auth", "Play Store Publish"],
      level: "Intermediate",
      pdfUrl: "https://ik.imagekit.io/dypkhqxip/android.pdf"
    },
    {
      title: "Backend Core",
      description: "Design powerful servers and databases that keep modern apps running.",
      logo: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
      skills: ["Server Setup", "API Design", "SQL Databases", "Security Basics", "Cloud Hosting"],
      level: "Advanced",
      pdfUrl: "https://ik.imagekit.io/dypkhqxip/backend.pdf"
    }
];

export default function RoadmapsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRoadmaps = useMemo(() => {
    return roadmaps.filter(map => 
      map.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      map.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100">
      <Navbar />
      <SubNavbar />
      
      <main>
        {/* Simple Header */}
        <section className="bg-zinc-900 py-10 md:py-12 border-b border-white/5 relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10 text-left">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex h-4 items-center px-1.5 border border-white/10 bg-white/5 text-blue-400 text-[8px] font-bold uppercase tracking-widest leading-none">
                Learning Paths
              </div>
              <h1 className="text-3xl md:text-4xl font-normal tracking-tighter text-white leading-tight">
                Tech <span className="text-blue-500">Roadmaps</span> <br /> 
                Simple steps to learn new <span className="text-emerald-500">skills</span>.
              </h1>
              <p className="text-[14px] text-zinc-400 font-normal max-w-xl">
                Choose a path and follow the steps. No more guessing what to learn next.
              </p>
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <section className="py-4 bg-zinc-50 border-b border-zinc-100 sticky top-[64px] z-40">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                    <input 
                        type="text" 
                        placeholder="Search for a roadmap..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-9 pr-4 bg-white border border-zinc-200 text-[12px] focus:outline-none focus:border-zinc-800 font-bold placeholder:text-zinc-400 rounded-none"
                    />
                </div>
            </div>
        </section>

        {/* Simple Card Grid */}
        <section className="py-12 md:py-20 bg-white min-h-[600px]">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRoadmaps.map((map, index) => (
                        <div key={index} className="group border border-zinc-100 p-8 flex flex-col justify-between hover:border-black transition-all duration-300 bg-white">
                            <div className="space-y-6">
                                <div className="flex justify-between items-start">
                                    <img src={map.logo} alt={map.title} className="h-10 w-auto transition-all group-hover:scale-110" />
                                    <div className="text-[8px] font-bold text-zinc-400 border border-zinc-100 px-2 py-0.5 uppercase tracking-widest">{map.level}</div>
                                </div>

                                <div className="space-y-1 text-left">
                                    <h3 className="text-xl font-extrabold tracking-tight text-zinc-900">{map.title}</h3>
                                    <p className="text-zinc-500 text-[12px] font-medium leading-relaxed">{map.description}</p>
                                </div>

                                <div className="space-y-3 pt-4 text-left">
                                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">What you will learn:</p>
                                    <div className="space-y-2">
                                        {map.skills.map((skill, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="h-1 w-1 bg-zinc-300 rounded-full" />
                                                <span className="text-[12px] font-bold text-zinc-600">{skill}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-6">
                                <a 
                                    href={map.pdfUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full h-11 bg-black text-white text-[13px] font-medium hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                                >
                                    <Download size={16} /> Download the path
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredRoadmaps.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="text-zinc-400 font-bold uppercase tracking-widest text-[11px]">No roadmaps found for your search.</p>
                    </div>
                )}
            </div>
        </section>

        <CTA />
      </main>

      <Footer />
    </div>
  );
}
