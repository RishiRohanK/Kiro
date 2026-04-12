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
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <Link href="/cleed/dashboard" className="text-[10px] font-bold text-zinc-400 hover:text-black transition-colors flex items-center gap-1 uppercase tracking-widest mb-2">
              <ChevronLeft size={12} /> Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-zinc-900">Submission Records</h1>
            <p className="text-zinc-500 text-xs">View candidate responses and project links.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
            <input 
              type="text"
              placeholder="Search by name..."
              className="h-10 w-full md:w-64 pl-9 pr-4 bg-white border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-zinc-400 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-zinc-200">
          <button 
            onClick={() => setActiveTab("feedback")}
            className={`px-6 py-3 text-xs font-bold transition-all border-b-2 ${activeTab === "feedback" ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-400 hover:text-zinc-600"}`}
          >
            Feedback ({data.feedback.length})
          </button>
          <button 
            onClick={() => setActiveTab("uiux")}
            className={`px-6 py-3 text-xs font-bold transition-all border-b-2 ${activeTab === "uiux" ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-400 hover:text-zinc-600"}`}
          >
            Task Links ({data.uiux.length})
          </button>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="py-20 flex flex-col items-center justify-center gap-2 text-zinc-400"
            >
              <div className="h-5 w-5 border-2 border-zinc-200 border-t-zinc-800 rounded-full animate-spin" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Loading...</p>
            </motion.div>
          ) : activeTab === "feedback" ? (
            <motion.div 
              key="feedback" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-4"
            >
              {filteredFeedback.length > 0 ? filteredFeedback.map((f) => (
                <div key={f.id} className="bg-white border border-zinc-200 p-6 rounded-lg shadow-sm hover:border-zinc-300 transition-all">
                   <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-zinc-900">{f.name}</h3>
                        <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-1">
                          <School size={12} /> {f.college}
                          <span className="text-zinc-300">•</span>
                          <Calendar size={12} /> {new Date(f.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-zinc-50 border border-zinc-100 rounded text-[10px] font-bold text-zinc-500 uppercase tracking-tight h-fit">
                        Response
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Exam Experience</p>
                        <p className="text-xs leading-relaxed text-zinc-700">{f.examExperience}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Improvements</p>
                        <p className="text-xs leading-relaxed text-zinc-700">{f.upgradeSuggestions}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Goals</p>
                        <p className="text-xs leading-relaxed text-zinc-700">{f.learningGoals}</p>
                      </div>
                   </div>
                </div>
              )) : (
                <div className="py-20 text-center bg-white border border-dashed rounded-lg border-zinc-200">
                  <p className="text-zinc-400 text-xs font-medium">No results found.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="uiux" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-100">
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Name</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Task</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Links</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {filteredUIUX.length > 0 ? filteredUIUX.map((s) => (
                      <tr key={s.id} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                              <div className="h-7 w-7 bg-zinc-800 text-white rounded flex items-center justify-center text-[10px] font-bold">
                                {s.userName[0]}
                              </div>
                              <span className="text-xs font-bold text-zinc-900">{s.userName}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-zinc-600">{s.taskName}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <a 
                              href={s.taskLink} target="_blank" rel="noopener noreferrer"
                              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                              Live link <ExternalLink size={10} />
                            </a>
                            {s.githubLink && (
                               <a 
                                href={s.githubLink} target="_blank" rel="noopener noreferrer"
                                className="text-[10px] font-bold text-zinc-500 hover:text-zinc-800 flex items-center gap-1"
                              >
                                Code <Github size={10} />
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-[10px] font-bold text-zinc-300">{new Date(s.createdAt).toLocaleDateString()}</span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="py-20 text-center text-zinc-400 text-xs font-medium">No links received.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
