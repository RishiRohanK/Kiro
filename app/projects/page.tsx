"use client";

import Navbar from "../components/home/Navbar";
import SubNavbar from "../components/home/SubNavbar";
import Footer from "../components/home/Footer";
import CTA from "../components/home/CTA";
import { FolderKanban, ArrowRight, Star, Clock, User, Bookmark, ExternalLink, Code2, Layers, Search, Filter, Cpu, Database, Layout, Smartphone } from "lucide-react";
import { useState } from "react";

const blueprints = [
    {
      title: "Real-time SaaS Dashboard",
      difficulty: "Advanced",
      duration: "4-6 Weeks",
      stars: 4.9,
      category: "Fullstack",
      description: "Build a high-performance analytics dashboard with real-time charting, multi-tenant auth, and automated reporting.",
      techStack: ["Next.js", "Recoil", "Prism", "Chart.js"],
      icon: <Layers size={24} className="text-blue-500" />,
      color: "border-blue-500/20 bg-blue-500/5 hover:border-blue-500",
      textColor: "text-blue-600"
    },
    {
      title: "Decentralized Voting System",
      difficulty: "Expert",
      duration: "6-8 Weeks",
      stars: 4.8,
      category: "Blockchain",
      description: "Create a tamper-proof voting engine with Ethereum smart contracts and a clean, responsive admin interface.",
      techStack: ["Solidity", "Hardhat", "React", "Ethers.js"],
      icon: <Cpu size={24} className="text-emerald-500" />,
      color: "border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500",
      textColor: "text-emerald-600"
    },
    {
      title: "E-Commerce Mobile Engine",
      difficulty: "Intermediate",
      duration: "3-5 Weeks",
      stars: 4.7,
      category: "Mobile",
      description: "Develop a high-conversion mobile shop with cross-platform support, Stripe payments, and offline caching.",
      techStack: ["React Native", "Firebase", "Stripe API", "Redux"],
      icon: <Smartphone size={24} className="text-orange-500" />,
      color: "border-orange-500/20 bg-orange-500/5 hover:border-orange-500",
      textColor: "text-orange-600"
    },
    {
      title: "AI Chat Application",
      difficulty: "Advanced",
      duration: "5-7 Weeks",
      stars: 4.9,
      category: "AI / ML",
      description: "Build a persistent chat bot that integrates OpenAI API, captures user context, and provides intelligent technical support.",
      techStack: ["OpenAI", "Node.js", "MongoDB", "Tailwind"],
      icon: <Database size={24} className="text-violet-500" />,
      color: "border-violet-500/20 bg-violet-500/5 hover:border-violet-500",
      textColor: "text-violet-600"
    },
    {
      title: "Low-Latency Video Streamer",
      difficulty: "Expert",
      duration: "8-10 Weeks",
      stars: 4.8,
      category: "Systems",
      description: "Implement a video streaming engine using WebRTC with real-time peer-to-peer data coordination and cloud recording.",
      techStack: ["WebRTC", "Go", "Redis", "Amazon S3"],
      icon: <Code2 size={24} className="text-rose-500" />,
      color: "border-rose-500/20 bg-rose-500/5 hover:border-rose-500",
      textColor: "text-rose-600"
    }
];

export default function ProjectsPage() {
  const [filter, setFilter] = useState("All");

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100">
      <Navbar />
      <SubNavbar />
      
      <main>
        {}
        <section className="bg-zinc-900 py-16 md:py-20 lg:py-24 overflow-hidden relative border-b border-white/5">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-orange-600/10 blur-[100px] pointer-events-none" />
          <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex h-6 items-center px-3 border border-white/10 bg-white/5 text-orange-400 text-[10px] font-bold uppercase tracking-widest leading-none">
                Portfolio Engineering
              </div>
              <h1 className="text-4xl md:text-6xl font-normal tracking-tighter text-white leading-[1.1]">
                Build robust <span className="text-orange-500">portfolio-worthy</span> <br /> 
                <span className="text-blue-500">projects</span> <span className="text-emerald-500">quickly</span>.
              </h1>
              <p className="text-[16px] md:text-[18px] text-zinc-400 leading-relaxed font-normal max-w-xl">
                Skill Grid Projects provide architectural blueprints for high-impact software. 
                Move from ideation to production with curated stacks and real-world logic.
              </p>
              <div className="pt-6">
                <button className="h-12 px-8 bg-zinc-800 text-white text-[12px] font-bold uppercase tracking-widest hover:bg-zinc-700 transition-colors flex items-center gap-2 border border-white/10">
                    <FolderKanban size={18} /> Manage My Blueprints
                </button>
              </div>
            </div>
          </div>
        </section>

        {}
        <section className="py-20 bg-white min-h-[600px]">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
                <div className="mb-16 flex flex-col md:flex-row items-center justify-between gap-8 py-8 border-b border-zinc-100">
                    <div className="relative group w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-600 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Find a blueprint for your next build..."
                            className="w-full h-12 pl-12 pr-4 bg-zinc-50 border border-zinc-200 text-[14px] focus:outline-none focus:border-orange-600 transition-all font-medium"
                        />
                    </div>
                    <div className="flex gap-4 scroll-x overflow-x-auto w-full md:w-auto pb-4 md:pb-0 no-scrollbar">
                        {["All", "Fullstack", "Web3 Core", "Systems"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`whitespace-nowrap px-5 h-10 text-[11px] font-bold uppercase tracking-widest transition-all ${
                                    filter === f ? "bg-zinc-900 text-white shadow-xl shadow-zinc-200" : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100"
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {blueprints.map((project, index) => (
                        <div 
                            key={index}
                            className={`group flex flex-col border p-12 transition-all duration-300 relative overflow-hidden ${project.color}`}
                        >
                            <div className="flex justify-between items-start mb-10">
                                <div className="p-5 bg-white border border-zinc-100 shadow-sm transition-transform group-hover:scale-110 duration-500">
                                    {project.icon}
                                </div>
                                <div className="flex items-center gap-1.5 text-zinc-400">
                                    <Star size={12} className="text-orange-400 fill-orange-400" />
                                    <span className="text-[12px] font-bold">{project.stars}</span>
                                </div>
                            </div>

                            <div className="mb-8">
                                <p className={`text-[11px] font-bold uppercase tracking-widest mb-1 ${project.textColor}`}>{project.difficulty}</p>
                                <h3 className="text-2xl font-bold text-zinc-900 leading-tight mb-4 group-hover:text-zinc-900 transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-zinc-500 text-[14px] font-medium leading-relaxed">
                                    {project.description}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-10">
                                {project.techStack.map(tech => (
                                    <span key={tech} className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 uppercase tracking-widest">
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between mt-auto pt-10 border-t border-zinc-100">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
                                        <Clock size={12} /> Timeframe
                                    </p>
                                    <p className="text-[14px] font-bold text-zinc-900">{project.duration}</p>
                                </div>
                                <button className={`flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest ${project.textColor} hover:translate-x-1 transition-transform`}>
                                    View Logic <ArrowRight size={16} />
                                </button>
                            </div>

                            {}
                            <div className="absolute top-0 right-0 w-12 h-12 bg-zinc-100 transform rotate-45 translate-x-6 -translate-y-6 group-hover:bg-zinc-900 transition-colors" />
                        </div>
                    ))}
                    
                    {}
                    <div className="border border-dashed border-zinc-200 p-12 text-center group cursor-pointer hover:bg-zinc-50 transition-colors flex flex-col justify-center min-h-[450px]">
                        <div className="mx-auto w-16 h-16 bg-zinc-50 border border-zinc-200 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white transition-all text-zinc-300 group-hover:text-orange-500 border-dashed">
                            <Bookmark size={24} />
                        </div>
                        <h3 className="text-[14px] font-bold text-zinc-400 uppercase tracking-widest group-hover:text-zinc-900 transition-colors">Submit a Blueprint?</h3>
                        <p className="text-[11px] text-zinc-400 mt-2 font-medium italic group-hover:text-zinc-500">Share your production logic with the global community.</p>
                    </div>
                </div>
            </div>
        </section>

        <CTA />
      </main>

      <Footer />
    </div>
  );
}