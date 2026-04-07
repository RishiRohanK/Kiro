"use client";

import { useState, useEffect, useMemo } from "react";
import { Users, MessageSquare, Globe, Heart, Shield, Sparkles, Zap, ArrowRight, Github, Twitter, Linkedin, Plus, MessageCircle, X, Search, Lightbulb, Share2, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import Navbar from "../components/home/Navbar";
import SubNavbar from "../components/home/SubNavbar";
import Footer from "../components/home/Footer";
import Breadcrumbs from "../components/Breadcrumbs";
import { motion, AnimatePresence } from "framer-motion";

interface Idea {
  id: string;
  name: string;
  subline: string;
  title: string;
  description: string;
  likes: number;
  shares: number;
  createdAt: string;
}

export default function CommunityPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    subline: "",
    title: "",
    description: ""
  });

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const res = await fetch("/api/community/ideas");
      const data = await res.json();
      setIdeas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching ideas:", error);
    }
  };

  const filteredIdeas = useMemo(() => {
    return ideas.filter(idea => 
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [ideas, searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/community/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ name: "", subline: "", title: "", description: "" });
        fetchIdeas();
      }
    } catch (error) {
      console.error("Error submitting idea:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (idea: Idea) => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: idea.title,
          text: `Check out this idea from ${idea.name} on Student Forge!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Sharing failed or cancelled");
      }
    } else {
      const shareUrl = window.location.href;
      const shareText = `Check out this idea from ${idea.name} on Student Forge:\n\n${idea.title}\n\n${shareUrl}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
    }
    handleEngage(idea.id, "share");
  };

  const handleEngage = async (id: string, type: "like" | "share") => {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id === id) {
          return {
            ...idea,
            likes: type === "like" ? (idea.likes || 0) + 1 : idea.likes,
            shares: type === "share" ? (idea.shares || 0) + 1 : idea.shares,
          };
        }
        return idea;
      })
    );

    try {
      await fetch(`/api/community/ideas/${id}/engage`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
    } catch (error) {
       console.error(`Engagement error:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-indigo-100">
      <Navbar />
      <SubNavbar />
      
      <main className="w-full">
        {}
        <section className="bg-zinc-900 py-12 md:py-16 border-b border-white/5 overflow-hidden relative text-left">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-indigo-600/5 blur-[120px] pointer-events-none" />
          <div className="mx-auto max-w-7xl px-6 relative z-10">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex h-4 items-center px-1.5 border border-white/10 bg-white/5 text-indigo-400 text-[9px] font-bold leading-none">
                Collective intelligence
              </div>
              <h1 className="text-3xl md:text-5xl font-normal tracking-tighter text-white leading-tight">
                Community <span className="text-indigo-500">Board</span>.
              </h1>
              <p className="text-zinc-400 text-[14px] md:text-[15px] font-normal max-w-xl leading-relaxed">
                A high-speed registry for student innovation. Forge connections, exchange ideas, and synchronize with the next generation of technical leaders.
              </p>
            </div>
          </div>
        </section>

        {}
        <section className="sticky top-[56px] z-40 bg-white/95 backdrop-blur-md border-b border-zinc-100 py-3 shadow-sm">
           <div className="mx-auto max-w-7xl px-6 lg:px-10 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                <input
                  type="text"
                  placeholder="Scan ideas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-10 pr-4 bg-zinc-50 border border-zinc-200 text-[12px] focus:outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                 <div className="hidden lg:flex items-center gap-2 text-[11px] font-bold text-zinc-400 px-4">
                    <TrendingUp size={12} className="text-indigo-500" />
                    <span>{filteredIdeas.length} active missions</span>
                 </div>
                 <button 
                  onClick={() => setIsModalOpen(true)}
                  className="h-9 px-6 bg-zinc-900 text-white text-[10px] font-bold flex items-center gap-2 hover:bg-indigo-600 transition-all rounded-none w-full md:w-auto justify-center"
                >
                  <Plus size={14} /> Initiate idea
                </button>
              </div>
           </div>
        </section>

        {}
        <section className="py-12 md:py-16 bg-zinc-50 min-h-[600px]">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            {filteredIdeas.length === 0 ? (
               <div className="py-24 text-center bg-white border border-dashed border-zinc-200">
                  <Lightbulb className="mx-auto h-12 w-12 text-zinc-200 mb-4" />
                  <p className="text-zinc-400 text-[13px] font-bold uppercase tracking-widest">No active missions forged yet.</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIdeas.map((idea, index) => (
                  <motion.div 
                    key={idea.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-col bg-white border border-zinc-200 hover:border-indigo-600 transition-all duration-200 p-8 rounded-none group"
                  >
                    <div className="flex justify-between items-start mb-6">
                       <div className="inline-flex h-5 items-center px-2 bg-zinc-50 text-[9px] font-bold text-zinc-500 border border-zinc-100 group-hover:border-indigo-100 group-hover:text-indigo-600 transition-colors">
                         {idea.subline}
                       </div>
                       <span className="text-[9px] text-zinc-300 font-bold tracking-tighter">
                         {new Date(idea.createdAt).toLocaleDateString()}
                       </span>
                    </div>
                    
                    <h3 className="text-[18px] font-bold tracking-tight text-zinc-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-1">{idea.title}</h3>
                    <p className="text-zinc-400 text-[13px] leading-relaxed mb-8 line-clamp-3 h-[60px]">
                       {idea.description}
                    </p>
                    
                    <div className="mt-auto pt-6 border-t border-zinc-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded-none bg-zinc-900 flex items-center justify-center text-white text-[10px] font-bold border border-white/10 group-hover:bg-indigo-600 transition-colors">
                             {idea.name[0]?.toUpperCase()}
                           </div>
                           <span className="text-[11px] font-bold text-zinc-900 tracking-wide">{idea.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleEngage(idea.id, "like")}
                              className="flex items-center gap-1.5 text-zinc-300 hover:text-red-500 transition-colors"
                            >
                               <Heart size={14} className={(idea.likes || 0) > 0 ? "fill-red-500 text-red-500" : ""} />
                               <span className="text-[10px] font-bold">{idea.likes || 0}</span>
                            </button>
                            <button 
                              onClick={() => handleShare(idea)}
                              className="flex items-center gap-1.5 text-zinc-300 hover:text-indigo-600 transition-colors"
                            >
                               <Share2 size={14} />
                               <span className="text-[10px] font-bold">{idea.shares || 0}</span>
                            </button>
                        </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="relative w-full max-w-2xl bg-zinc-900 p-10 shadow-2xl border border-white/10"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="mb-10 space-y-3">
                 <div className="inline-flex h-4 items-center px-1.5 border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-[9px] font-bold leading-none">
                    Innovation lab
                 </div>
                 <h2 className="text-3xl font-normal tracking-tighter text-white">Share <span className="text-indigo-500">Mission</span>.</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-zinc-500">Identity</label>
                       <input 
                         required
                         type="text" 
                         className="w-full h-11 bg-white/5 border border-white/10 px-4 text-[13px] text-white outline-none focus:border-indigo-600 transition-all placeholder:text-zinc-700" 
                         placeholder="Your name..."
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                       />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-bold text-zinc-500">Classification</label>
                       <input 
                         required
                         type="text" 
                         className="w-full h-11 bg-white/5 border border-white/10 px-4 text-[13px] text-white outline-none focus:border-indigo-600 transition-all placeholder:text-zinc-700" 
                         placeholder="e.g. Tech Strategy..."
                         value={formData.subline}
                         onChange={(e) => setFormData({...formData, subline: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500">Mission title</label>
                    <input 
                      required
                      type="text" 
                      className="w-full h-11 bg-white/5 border border-white/10 px-4 text-[13px] text-white outline-none focus:border-indigo-600 transition-all placeholder:text-zinc-700" 
                      placeholder="What are you forgoing?"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500">Mission brief</label>
                    <textarea 
                      required
                      className="w-full bg-white/5 border border-white/10 p-4 text-[13px] text-white outline-none focus:border-indigo-600 transition-all resize-none min-h-[100px] placeholder:text-zinc-700" 
                      placeholder="Describe your vision..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                 </div>

                 <button 
                   disabled={loading}
                   type="submit"
                   className="w-full h-14 bg-indigo-600 text-white text-[12px] font-bold transition-all disabled:opacity-50 rounded-none"
                 >
                   {loading ? "Synchronizing..." : "Post to collective"}
                 </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
