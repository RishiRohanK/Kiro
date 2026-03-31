"use client";

import Navbar from "../components/home/Navbar";
import SubNavbar from "../components/home/SubNavbar";
import Footer from "../components/home/Footer";
import CTA from "../components/home/CTA";
import { Lightbulb, Users, ArrowRight, MessageSquare, Plus, Heart, Share2, Filter, Search, Globe, Rocket, Terminal, Target, X, Github } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IdeasPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ideas, setIdeas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pitch State
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pitchSuccess, setPitchSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    stack: "",
    usp: "",
    outcomes: "",
    name: "",
    developer: "",
    subline: ""
  });

  // Join State
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<any>(null);
  const [joinData, setJoinData] = useState({ name: "", email: "" });
  const [isJoining, setIsJoining] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);

  // Aerodynamic Color Palette
  const palettes = [
    { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-600", accent: "bg-emerald-600", hover: "hover:border-emerald-600 shadow-xl shadow-emerald-500/5" },
    { bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-600", accent: "bg-blue-600", hover: "hover:border-blue-600 shadow-xl shadow-blue-500/5" },
    { bg: "bg-violet-50", border: "border-violet-100", text: "text-violet-600", accent: "bg-violet-600", hover: "hover:border-violet-600 shadow-xl shadow-violet-500/5" },
    { bg: "bg-rose-50", border: "border-rose-100", text: "text-rose-600", accent: "bg-rose-600", hover: "hover:border-rose-600 shadow-xl shadow-rose-500/5" },
    { bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-600", accent: "bg-amber-600", hover: "hover:border-amber-600 shadow-xl shadow-amber-500/5" },
    { bg: "bg-indigo-50", border: "border-indigo-100", text: "text-indigo-600", accent: "bg-indigo-600", hover: "hover:border-indigo-600 shadow-xl shadow-indigo-500/5" }
  ];

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const res = await fetch("/api/ideas");
      const data = await res.json();
      if (data.success) {
        setIdeas(data.pitches);
      }
    } catch (err) {
      console.error("Failed to synchronize ideas repository.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (ideaId: string) => {
    try {
        // Optimistic update
        setIdeas(prev => prev.map(idea => 
            idea.id === ideaId ? { ...idea, likes: idea.likes + 1 } : idea
        ));

        const res = await fetch("/api/ideas/like", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ideaId })
        });
        if (!res.ok) {
            fetchIdeas();
        }
    } catch (err) {
        console.error("Like transmission failure.");
        fetchIdeas();
    }
  };

  const handlePitchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setPitchSuccess(true);
        setFormData({ title: "", description: "", stack: "", usp: "", outcomes: "", name: "", developer: "", subline: "" });
        setTimeout(() => {
          setPitchSuccess(false);
          setIsPitchModalOpen(false);
          fetchIdeas(); // Refresh registry
        }, 3000);
      }
    } catch (err) {
      console.error("Pitch transmission failure.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIdea) return;
    setIsJoining(true);
    try {
      const res = await fetch("/api/ideas/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            ideaId: selectedIdea.id, 
            name: joinData.name, 
            email: joinData.email 
        })
      });
      if (res.ok) {
        setJoinSuccess(true);
        setTimeout(() => {
          setJoinSuccess(false);
          setIsJoinModalOpen(false);
          setJoinData({ name: "", email: "" });
        }, 2000);
      }
    } catch (err) {
      console.error("Collaboration Protocol Failure:", err);
    } finally {
      setIsJoining(false);
    }
  };
  
  const filteredIdeas = useMemo(() => {
    return ideas.filter(idea => 
        (idea.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (idea.stack || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (idea.name || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, ideas]);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100">
      <Navbar />
      <SubNavbar />
      
      <main>
        {/* Condensed Hero Section */}
        <section className="bg-zinc-900 py-10 md:py-12 overflow-hidden relative border-b border-white/5">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-emerald-600/5 blur-[100px] pointer-events-none" />
          <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10 text-left">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex h-4 items-center px-1.5 border border-white/10 bg-white/5 text-emerald-400 text-[8px] font-bold uppercase tracking-widest leading-none">
                Incubation Base
              </div>
              <h1 className="text-3xl md:text-4xl font-normal tracking-tighter text-white leading-tight">
                Collaborate on <span className="text-emerald-500">ideas</span> <br /> 
                within our <span className="text-blue-500">student</span> ecosystem.
              </h1>
              <p className="text-[14px] text-zinc-400 font-normal max-w-xl">
                The Ideas Portal is the starting line for your next venture. Find creators, join 
                existing project modules, or pitch your vision to our global community.
              </p>
              
              <div className="pt-4">
                <button 
                  onClick={() => setIsPitchModalOpen(true)}
                  className="h-10 px-6 bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-500 transition-colors flex items-center gap-2"
                >
                    <Plus size={16} /> Pitch New Concept
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Condensed Search Bar */}
        <section className="py-4 bg-zinc-50 border-b border-zinc-100 sticky top-[64px] z-40">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-600 transition-colors" size={14} />
                        <input 
                            type="text" 
                            placeholder="Find inspiration or partners..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 pl-9 pr-4 bg-white border border-zinc-200 text-[12px] focus:outline-none focus:border-zinc-800 transition-all font-bold placeholder:text-zinc-400"
                        />
                    </div>
                    <div className="flex gap-4 items-center">
                        <span className="hidden md:block text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none mr-2">Authorized Concept Nodes: {ideas.length}</span>
                        <button className="flex items-center gap-2 px-4 h-10 text-[11px] font-bold text-zinc-500 hover:text-zinc-900 transition-colors uppercase tracking-widest">
                            <Filter size={14} /> Latest
                        </button>
                    </div>
                </div>
            </div>
        </section>

        {/* High-Density Multi-Colored Registry */}
        <section className="py-12 md:py-20 bg-white min-h-[600px]">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                        {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                            <div key={i} className="h-64 bg-zinc-50 border border-zinc-100 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                        {filteredIdeas.map((idea, index) => {
                            const palette = palettes[index % palettes.length];
                            return (
                                <div 
                                    key={idea.id} 
                                    className={`group ${palette.bg} border ${palette.border} p-6 ${palette.hover} transition-all duration-300 flex flex-col justify-between relative overflow-hidden`}
                                >
                                    <div className="absolute top-0 right-0 p-4">
                                        <div className="flex items-center gap-2">
                                            <Github size={12} className="text-zinc-300 opacity-20 group-hover:opacity-100 group-hover:text-zinc-600 transition-all" />
                                            <div className={`h-1.5 w-1.5 ${palette.accent} rounded-full`} />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className={`text-[8px] font-bold ${palette.text} uppercase tracking-widest border ${palette.border} px-2 py-0.5 bg-white/50`}>
                                                {idea.subline || "Authorized"}
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="text-lg font-bold text-zinc-900 leading-tight">
                                                {idea.title}
                                            </h3>
                                            <p className={`text-[10px] font-bold ${palette.text} uppercase tracking-widest opacity-70`}>by {idea.developer || idea.name}</p>
                                        </div>

                                        <p className="text-zinc-600 text-[12px] font-medium leading-relaxed line-clamp-3">
                                            {idea.description}
                                        </p>
                                    </div>

                                    <div className={`mt-8 pt-4 border-t ${palette.border} flex items-center justify-between`}>
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLike(idea.id);
                                                }}
                                                className={`flex items-center gap-1.5 ${palette.text} opacity-50 hover:opacity-100 transition-all hover:scale-110 active:scale-95`}
                                            >
                                                <Heart size={12} className={idea.likes > 0 ? "fill-current" : ""} />
                                                <span className="text-[10px] font-bold">{idea.likes}</span>
                                            </button>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setSelectedIdea(idea);
                                                setIsJoinModalOpen(true);
                                            }}
                                            className={`text-[10px] font-bold ${palette.text} uppercase tracking-widest flex items-center gap-1.5 hover:translate-x-1 transition-transform`}
                                        >
                                            Join <ArrowRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {!isLoading && filteredIdeas.length === 0 && (
                    <div className="py-32 text-center flex flex-col items-center justify-center space-y-4">
                        <Lightbulb className="w-10 h-10 text-zinc-100" />
                        <h2 className="text-lg font-bold text-zinc-300 uppercase tracking-tighter">No Matching Concepts Synchronized</h2>
                        <button 
                            onClick={() => setIsPitchModalOpen(true)}
                            className="bg-black text-white px-6 h-10 text-[10px] font-bold uppercase tracking-widest"
                        >
                            Open Pipeline
                        </button>
                    </div>
                )}
            </div>
        </section>

        {/* Pitch Modal */}
        <AnimatePresence>
            {isPitchModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPitchModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-white max-w-2xl w-full relative z-10 border border-zinc-200 p-8 md:p-12 overflow-y-auto max-h-[90vh] rounded-none">
                        <button onClick={() => setIsPitchModalOpen(false)} className="absolute top-8 right-8 text-zinc-400 hover:text-black transition-colors"><X size={24} /></button>
                        <div className="mb-10 text-left"><div className="h-4 w-4 bg-emerald-500 mb-4" /><h2 className="text-3xl font-extrabold tracking-tighter mb-2">Pitch New Concept</h2><p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest">Entry subject to mandatory Cleed dashboard oversight</p></div>
                        <form onSubmit={handlePitchSubmit} className="space-y-6 text-left">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2"><label className="text-[10px] font-bold uppercase text-zinc-400 ml-1">Submitter Identity</label><input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full h-12 bg-zinc-50 border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-emerald-600 transition-all rounded-none" placeholder="Your full name" /></div>
                                <div className="space-y-2"><label className="text-[10px] font-bold uppercase text-zinc-400 ml-1">Project Tagline</label><input value={formData.subline} onChange={(e) => setFormData({...formData, subline: e.target.value})} className="w-full h-12 bg-zinc-50 border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-emerald-600 transition-all rounded-none" placeholder="e.g., AI Healthcare Subsystem" /></div>
                            </div>
                            <div className="space-y-2"><label className="text-[10px] font-bold uppercase text-zinc-400 ml-1">Venture Title</label><input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full h-12 bg-zinc-50 border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-emerald-600 transition-all rounded-none" placeholder="The definitive project name" /></div>
                            <div className="space-y-2"><label className="text-[10px] font-bold uppercase text-zinc-400 ml-1">Mission Description</label><textarea required rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 p-4 text-sm font-bold outline-none focus:border-emerald-600 transition-all rounded-none resize-none" placeholder="What problem are you solving?" /></div>
                            <div className="space-y-2 text-left"><label className="text-[10px] font-bold uppercase text-zinc-400 ml-1 flex gap-2 items-center"><Terminal size={12} /> Technology Stack</label><input required value={formData.stack} onChange={(e) => setFormData({...formData, stack: e.target.value})} className="w-full h-12 bg-zinc-50 border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-emerald-600 transition-all rounded-none" placeholder="e.g., Next.js, FastAPI, PostgreSQL" /></div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2"><label className="text-[10px] font-bold uppercase text-zinc-400 ml-1 flex gap-2 items-center"><Target size={12} /> Project USP</label><input required value={formData.usp} onChange={(e) => setFormData({...formData, usp: e.target.value})} className="w-full h-12 bg-zinc-50 border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-emerald-600 transition-all rounded-none" placeholder="Your unique advantage" /></div>
                                <div className="space-y-2"><label className="text-[10px] font-bold uppercase text-zinc-400 ml-1 flex gap-2 items-center"><Rocket size={12} /> Target Outcomes</label><input required value={formData.outcomes} onChange={(e) => setFormData({...formData, outcomes: e.target.value})} className="w-full h-12 bg-zinc-50 border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-emerald-600 transition-all rounded-none" placeholder="What does success look like?" /></div>
                            </div>
                            <button disabled={isSubmitting} className="w-full h-14 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-black/5 disabled:opacity-50">{isSubmitting ? "Transmitting..." : "Dispatch Pitch to Dashboard"}</button>
                            {pitchSuccess && <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">Pitch Transmitted. Awaiting Cleed Authorization.</p>}
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        {/* Join Collective Modal */}
        <AnimatePresence>
            {isJoinModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsJoinModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white max-w-md w-full relative z-10 border border-zinc-200 p-8 md:p-10 shadow-2xl rounded-none">
                        <button onClick={() => setIsJoinModalOpen(false)} className="absolute top-8 right-8 text-zinc-400 hover:text-black transition-colors"><X size={20} /></button>
                        <div className="mb-8 text-left">
                            <h2 className="text-2xl font-extrabold tracking-tighter mb-2">Join {selectedIdea?.title}</h2>
                            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Collaborate with {selectedIdea?.developer || selectedIdea?.name} on this project core.</p>
                        </div>
                        <form onSubmit={handleJoinSubmit} className="space-y-5 text-left">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold uppercase text-zinc-400 ml-1">Collaborator Name</label>
                                <input required value={joinData.name} onChange={(e) => setJoinData({...joinData, name: e.target.value})} className="w-full h-12 bg-zinc-50 border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-zinc-800 transition-all rounded-none" placeholder="Your full name" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-bold uppercase text-zinc-400 ml-1">Mission Email</label>
                                <input required type="email" value={joinData.email} onChange={(e) => setJoinData({...joinData, email: e.target.value})} className="w-full h-12 bg-zinc-50 border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-zinc-800 transition-all rounded-none" placeholder="your@email.com" />
                            </div>
                            <button disabled={isJoining} className="w-full h-14 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-black/10">
                                {isJoining ? "Synchronizing..." : "Dispatch Collaboration Memo"}
                            </button>
                            {joinSuccess && <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">Request Transmitted. Collaborator Alerted.</p>}
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        <CTA />
      </main>

      <Footer />
    </div>
  );
}
