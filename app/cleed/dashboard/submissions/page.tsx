"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Paperclip, 
  ChevronLeft, 
  ExternalLink, 
  Github, 
  Search, 
  Filter,
  ArrowRight,
  User,
  School,
  Calendar
} from "lucide-react";
import Link from "next/link";

export default function SubmissionsVault() {
  const [data, setData] = useState<{ feedback: any[], uiux: any[] }>({ feedback: [], uiux: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"feedback" | "uiux">("feedback");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/cleed/submissions");
      const json = await res.json();
      if (json.feedback) setData(json);
    } catch (err) {
      console.error("Submissions load failure", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFeedback = data.feedback.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.college.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUIUX = data.uiux.filter(s => 
    s.userName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.taskName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <Link href="/cleed/dashboard" className="text-xs font-bold text-zinc-400 hover:text-blue-600 transition-colors flex items-center gap-1.5 uppercase tracking-widest mb-4">
              <ChevronLeft size={14} /> Back to dashboard
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Submissions Vault</h1>
            <p className="text-zinc-500 text-sm font-medium">Review candidate feedback and technical task submissions.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text"
                placeholder="Search candidates..."
                className="h-11 w-64 pl-10 pr-4 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex p-1.5 bg-zinc-100 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab("feedback")}
            className={`px-8 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === "feedback" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
          >
            <MessageSquare size={14} /> Candidate Feedback ({data.feedback.length})
          </button>
          <button 
            onClick={() => setActiveTab("uiux")}
            className={`px-8 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === "uiux" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
          >
            <Paperclip size={14} /> UI/UX Task Links ({data.uiux.length})
          </button>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-400"
            >
              <div className="h-6 w-6 border-2 border-zinc-300 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-xs font-bold uppercase tracking-widest">Accessing Vault...</p>
            </motion.div>
          ) : activeTab === "feedback" ? (
            <motion.div 
              key="feedback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 gap-6"
            >
              {filteredFeedback.length > 0 ? filteredFeedback.map((f) => (
                <div key={f.id} className="bg-white border border-zinc-200 p-8 rounded-2xl shadow-sm hover:border-zinc-300 transition-all group">
                   <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-zinc-900">{f.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-zinc-500 font-medium">
                          <span className="flex items-center gap-1.5"><School size={14} /> {f.college}</span>
                          <span className="text-zinc-200">•</span>
                          <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(f.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="shrink-0 p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <MessageSquare size={20} />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Exam Experience</label>
                        <p className="text-sm leading-relaxed text-zinc-600 italic">"{f.examExperience}"</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Improvements</label>
                        <p className="text-sm leading-relaxed text-zinc-600 italic">"{f.upgradeSuggestions}"</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Learning goals</label>
                        <p className="text-sm leading-relaxed text-zinc-600 italic">"{f.learningGoals}"</p>
                      </div>
                   </div>
                </div>
              )) : (
                <div className="py-20 text-center bg-white border border-dashed rounded-2xl border-zinc-200">
                  <p className="text-zinc-400 text-sm font-medium">No feedback entries found.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="uiux" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden"
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50 border-b border-zinc-100">
                    <th className="px-8 py-5 text-xs font-bold text-zinc-400 uppercase tracking-widest">Candidate</th>
                    <th className="px-8 py-5 text-xs font-bold text-zinc-400 uppercase tracking-widest">Project Name</th>
                    <th className="px-8 py-5 text-xs font-bold text-zinc-400 uppercase tracking-widest">Technical Links</th>
                    <th className="px-8 py-5 text-xs font-bold text-zinc-400 uppercase tracking-widest text-right">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {filteredUIUX.length > 0 ? filteredUIUX.map((s) => (
                    <tr key={s.id} className="hover:bg-zinc-50/30 transition-colors group">
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-3">
                            <div className="h-9 w-9 bg-zinc-900 text-white rounded-lg flex items-center justify-center text-xs font-bold">
                              {s.userName[0]}
                            </div>
                            <span className="text-sm font-bold text-zinc-900">{s.userName}</span>
                         </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-medium text-zinc-600">{s.taskName}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <a 
                            href={s.taskLink} target="_blank" rel="noopener noreferrer"
                            className="h-8 px-3 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg flex items-center gap-1.5 hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
                          >
                            LIVE VIEW <ExternalLink size={12} />
                          </a>
                          {s.githubLink && (
                             <a 
                              href={s.githubLink} target="_blank" rel="noopener noreferrer"
                              className="h-8 px-3 bg-zinc-900 text-white text-[10px] font-bold rounded-lg flex items-center gap-1.5 hover:bg-black transition-all"
                            >
                              GITHUB <Github size={12} />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className="text-xs font-bold text-zinc-400 lowercase">{new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(s.createdAt).toLocaleDateString()}</span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-zinc-400 text-sm font-medium">No task submissions received yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
