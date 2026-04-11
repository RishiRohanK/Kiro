"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  ChevronRight, 
  ShieldCheck, 
  Clock, 
  ClipboardList,
  User,
  AlertCircle
} from "lucide-react";

export default function ExamGuidelinesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [hasAgreed, setHasAgreed] = useState(false);
  const [examActive, setExamActive] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkExamStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/exams/status");
      const data = await res.json();
      setExamActive(data.isActive);
    } catch (err) {
      console.error("Status check failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("intern_user");
    if (!storedUser) {
      router.push("/exams");
    } else {
      setUser(JSON.parse(storedUser));
    }

    checkExamStatus();
    const interval = setInterval(checkExamStatus, 15000); 
    return () => clearInterval(interval);
  }, [router, checkExamStatus]);

  const startExam = async () => {
    if (!hasAgreed) {
        alert("Please click the checkbox to agree.");
        return;
    }

    const res = await fetch("/api/exams/status");
    const data = await res.json();
    if (!data.isActive) {
        alert("Exam not active yet. Wait for admin.");
        setExamActive(false);
        return;
    }

    try {
        if (typeof document !== "undefined" && document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
        }
        
        await fetch("/api/exams/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id })
        });

        router.push("/exams/panel");
    } catch (err) {
        router.push("/exams/panel");
    }
  };

  if (!user || loading) {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-700" />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans flex flex-col select-none">
      
      {/* Industrial Top Section */}
      <div className="h-64 bg-blue-700 relative overflow-hidden shrink-0">
          <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-6 gap-4 p-8">
                  {[...Array(24)].map((_, i) => (
                      <div key={i} className="h-20 border border-white/20 rounded-lg" />
                  ))}
              </div>
          </div>
          
          <header className="relative z-10 h-full flex items-center justify-center">
              <div className="max-w-6xl w-full px-8 flex flex-col md:flex-row justify-between items-center text-white">
                  <div className="text-center md:text-left">
                     <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                        <ShieldCheck className="text-blue-200" size={24} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Secure Terminal Node</span>
                     </div>
                     <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">Full Stack Development</h1>
                     <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Assessment Schedule: 12-04-2026 | 10:45 AM - 11:45 AM</p>
                  </div>
                  <div className="mt-8 md:mt-0 bg-blue-800/50 backdrop-blur-md border border-white/10 p-6 rounded-xl flex items-center gap-6 shadow-2xl">
                      <div className="h-12 w-12 bg-white flex items-center justify-center rounded-lg shadow-inner">
                         <User className="text-blue-700" size={24} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Authentication ID</p>
                         <p className="text-lg font-black uppercase tracking-tight leading-none">{user.name}</p>
                         <p className="text-[10px] font-bold mt-1 opacity-40">SF-{user.id?.slice(-8)}</p>
                      </div>
                  </div>
              </div>
          </header>
      </div>

      <main className="flex-1 -mt-16 relative z-20 px-4 pb-20 overflow-y-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Syllabus & Modules */}
              <div className="lg:col-span-4 space-y-6">
                 <div className="bg-white border-b-4 border-blue-700 p-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-8">
                       <ClipboardList className="text-blue-700" size={20} />
                       <h3 className="text-sm font-black uppercase tracking-widest text-zinc-800">Syllabus Overview</h3>
                    </div>
                    
                    <div className="space-y-8">
                       {[
                         { title: "MERN Stack", items: ["React Hooks & Context", "Next.js SSR/Static Nodes"] },
                         { title: "Cloud Systems", items: ["AWS Infrastructure", "Docker & Kubernetes"] },
                         { title: "API Protocols", items: ["TRPC Type-safety", "JSON-REST Architecture"] }
                       ].map((mod, i) => (
                          <div key={i} className="group">
                             <h4 className="text-[10px] font-black text-blue-700 uppercase mb-3 flex items-center gap-2">
                                <span className="h-1 w-1 bg-blue-700 rounded-full" />
                                {mod.title}
                             </h4>
                             <ul className="space-y-2 border-l-2 border-zinc-100 pl-4">
                                {mod.items.map((item, j) => (
                                   <li key={j} className="text-xs font-bold text-zinc-500 hover:text-blue-700 transition-colors cursor-default">• {item}</li>
                                ))}
                             </ul>
                          </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-zinc-900 p-8 text-white shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                       <Clock className="text-blue-400" size={20} />
                       <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Time Constraints</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-3xl font-black">60m</p>
                       <p className="text-[10px] font-bold opacity-40 uppercase">Total Duration Window</p>
                    </div>
                 </div>
              </div>

              {/* Right Column: Rules & Initiation */}
              <div className="lg:col-span-8 space-y-8">
                 <div className="bg-white p-10 shadow-xl border-l-[12px] border-blue-700">
                    <div className="flex items-center gap-4 mb-10 pb-6 border-b border-zinc-100">
                       <AlertCircle className="text-zinc-800" size={28} />
                       <div>
                          <h2 className="text-2xl font-black text-zinc-800 uppercase tracking-tighter">Initiation Protocol</h2>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">System Readiness Checklist</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                       {[
                          "Full-screen session will be enforced dynamically.",
                          "Window/Tab switching triggers disqualification nodes.",
                          "Assessment marking standard is fixed (+3 / -1).",
                          "Real-time monitoring of DOM API violations is active.",
                          "Encryption keys for answers remain isolated in backend.",
                          "Browser hardware keys (F5, F12) are internally blocked."
                       ].map((rule, i) => (
                          <div key={i} className="flex gap-4 group">
                             <div className="h-6 w-6 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-200 group-hover:bg-blue-700 group-hover:text-white transition-all">
                                <span className="text-[10px] font-black">{i + 1}</span>
                             </div>
                             <p className="text-xs font-bold text-zinc-600 leading-relaxed uppercase tracking-tight">{rule}</p>
                          </div>
                       ))}
                    </div>

                    <div className="mt-16 pt-8 border-t border-zinc-100">
                       <div className="flex flex-col items-center justify-center space-y-8">
                          <label className="flex items-center gap-6 group cursor-pointer">
                             <div className={`h-8 w-8 rounded-lg border-2 transition-all flex items-center justify-center ${hasAgreed ? 'bg-blue-700 border-blue-700 text-white' : 'bg-white border-zinc-200'}`}>
                                {hasAgreed && <ShieldCheck size={20} />}
                             </div>
                             <input 
                                type="checkbox" 
                                className="hidden"
                                checked={hasAgreed}
                                onChange={(e) => setHasAgreed(e.target.checked)}
                             />
                             <div>
                                <p className="text-sm font-black text-zinc-800 uppercase tracking-tight">Accept Terms</p>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">I certify readiness for this assessment.</p>
                             </div>
                          </label>

                          <div className="text-center w-full max-w-sm">
                             <button 
                                onClick={startExam}
                                disabled={!hasAgreed || !examActive}
                                className={`w-full group h-16 rounded-xl flex items-center justify-center gap-4 transition-all ${
                                    (hasAgreed && examActive)
                                    ? 'bg-blue-700 text-white shadow-[0_20px_50px_rgba(29,78,216,0.3)] hover:scale-[1.02]' 
                                    : 'bg-zinc-100 text-zinc-300 border-2 border-zinc-200 cursor-not-allowed'
                                }`}
                             >
                                <span className="text-xs font-black uppercase tracking-[0.2em]">{examActive ? 'Initialize Module' : 'System Locked'}</span>
                                {examActive && <ChevronRight className="group-hover:translate-x-1 transition-transform" size={18} />}
                             </button>
                             {!examActive && (
                                <p className="text-[10px] text-zinc-400 font-bold uppercase mt-4 tracking-tighter">Terminal will synchronize at 10:45 AM.</p>
                             )}
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6 pb-20">
                    <div className="bg-white p-6 border border-zinc-200 text-center">
                       <p className="text-lg font-black text-zinc-800">150</p>
                       <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Mark Scaling</p>
                    </div>
                    <div className="bg-white p-6 border border-zinc-200 text-center">
                       <p className="text-lg font-black text-zinc-800">50</p>
                       <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Assessment Logic Nodes</p>
                    </div>
                 </div>
              </div>

          </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 h-10 bg-white border-t border-zinc-200 flex items-center justify-center px-8 z-[30]">
         <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.4em]">STDFG Assessment Core Node (L-Grid Architecture)</p>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; }
      `}</style>
    </div>
  );
}
