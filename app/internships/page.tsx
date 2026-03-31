"use client";

import Navbar from "../components/home/Navbar";
import SubNavbar from "../components/home/SubNavbar";
import Footer from "../components/home/Footer";
import CTA from "../components/home/CTA";
import { Search, Briefcase, MapPin, Clock, DollarSign, ExternalLink, Filter, Building2, Terminal, Rocket, Layout, Globe, Cpu, Plus, Target } from "lucide-react";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";

export default function InternshipsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [internships, setInternships] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const res = await fetch("/api/internships");
      const data = await res.json();
      if (data.success) {
        setInternships(data.internships);
      }
    } catch (err) {
      console.error("Failed to synchronize internships repository.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInternships = useMemo(() => {
    return internships.filter(item => 
        (item.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.company || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.role || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, internships]);

  const categories = [
    { name: "Technical", icon: <Terminal size={12} />, color: "text-blue-600 bg-blue-50 border-blue-100" },
    { name: "Creative", icon: <Layout size={12} />, color: "text-rose-600 bg-rose-50 border-rose-100" },
    { name: "Management", icon: <Briefcase size={12} />, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { name: "Research", icon: <Cpu size={12} />, color: "text-violet-600 bg-violet-50 border-violet-100" }
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100">
      <Navbar />
      <SubNavbar />
      
      <main>
        {/* Condensed Hero Section */}
        <section className="bg-zinc-900 py-10 md:py-12 overflow-hidden relative border-b border-white/5">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-blue-600/5 blur-[100px] pointer-events-none" />
          <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10 text-left">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex h-4 items-center px-1.5 border border-white/10 bg-white/5 text-blue-400 text-[8px] font-bold uppercase tracking-widest leading-none">
                Opportunity Hub
              </div>
              <h1 className="text-3xl md:text-4xl font-normal tracking-tighter text-white leading-tight">
                Accelerate your <span className="text-blue-500">career</span> <br /> 
                with high-impact <span className="text-emerald-500">internships</span>.
              </h1>
              <p className="text-[14px] text-zinc-400 font-normal max-w-xl">
                Explore a curated registry of technical and management internships added daily 
                via the Cleed administrative dashboard.
              </p>
              
              <div className="pt-6 flex gap-4">
                <Link href="/internships/post" className="h-10 px-6 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                    <Plus size={14} /> Register Opportunity
                </Link>
                <button className="h-10 px-6 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 transition-colors flex items-center justify-center gap-2">
                    <Target size={14} /> Technical Filter
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filter Bar */}
        <section className="py-4 bg-zinc-50 border-b border-zinc-100 sticky top-[64px] z-40">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                        <input 
                            type="text" 
                            placeholder="Find roles, companies, or technologies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 pl-9 pr-4 bg-white border border-zinc-200 text-[12px] focus:outline-none focus:border-zinc-800 transition-all font-bold placeholder:text-zinc-400 rounded-none"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                        {categories.map((cat) => (
                            <button key={cat.name} className={`flex items-center gap-2 px-3 h-8 text-[9px] font-bold uppercase tracking-widest border transition-all ${cat.color} hover:shadow-sm`}>
                                {cat.icon} {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* High-Density Opportunity Registry */}
        <section className="py-12 md:py-20 bg-white min-h-[600px]">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-48 bg-zinc-50 border border-zinc-100 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredInternships.map((job) => (
                            <div key={job.id} className="group border border-zinc-100 p-8 flex flex-col justify-between hover:border-zinc-900 transition-all duration-300 relative overflow-hidden bg-white">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className="h-12 w-12 bg-zinc-50 border border-zinc-100 p-2.5 flex items-center justify-center transition-colors group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900">
                                            <Building2 size={24} />
                                        </div>
                                        <div className="text-[8px] font-bold text-zinc-400 border border-zinc-100 px-2 py-0.5 uppercase tracking-widest leading-none">
                                            {job.role || "Professional"}
                                        </div>
                                    </div>

                                    <div className="space-y-1 text-left">
                                        <h3 className="text-xl font-extrabold tracking-tight text-zinc-900 leading-tight">
                                            {job.title}
                                        </h3>
                                        <p className="text-blue-600 text-[11px] font-bold uppercase tracking-widest">{job.company}</p>
                                    </div>

                                    <p className="text-zinc-500 text-[12px] font-medium leading-relaxed line-clamp-3 text-left">
                                        {job.description}
                                    </p>

                                    <div className="flex flex-wrap gap-4 pt-2">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                            <MapPin size={12} className="text-zinc-300" /> {job.location || "Remote"}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                            <Clock size={12} className="text-zinc-300" /> {job.duration || "Self-Paced"}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                            <DollarSign size={12} className="text-zinc-300" /> {job.stipend || "Competitive"}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 pt-6 border-t border-zinc-50">
                                    <a 
                                        href={job.applyLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="w-full h-11 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                                    >
                                        Apply Now <ExternalLink size={14} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && filteredInternships.length === 0 && (
                    <div className="py-32 text-center flex flex-col items-center justify-center space-y-4">
                        <Rocket className="w-10 h-10 text-zinc-100" />
                        <h2 className="text-lg font-bold text-zinc-300 uppercase tracking-tighter">No Active Missions Synchronized</h2>
                        <button onClick={fetchInternships} className="bg-black text-white px-6 h-10 text-[10px] font-bold uppercase tracking-widest">Refresh Registry</button>
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
