"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Calendar, Clock, AlertCircle, ShieldCheck, Lock, User } from "lucide-react";
import { motion } from "framer-motion";

function ExamLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examId = searchParams.get("id");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mathAnswer, setMathAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exam, setExam] = useState<any>(null);
  const [fetchingExam, setFetchingExam] = useState(true);

  useEffect(() => {
    const handleContext = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContext);
    
    const fetchExamDetails = async () => {
      try {
        const url = examId ? `/api/exams/details?id=${examId}` : "/api/exams/details";
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setExam(data.exam);
        } else {
          setError(data.error || "No active assessment found.");
        }
      } catch (err) {
        setError("Network failure while fetching exam metadata.");
      } finally {
        setFetchingExam(false);
      }
    };

    fetchExamDetails();
    return () => document.removeEventListener("contextmenu", handleContext);
  }, [examId]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mathAnswer !== "12") {
        setError("Security verification failed. Try again.");
        setLoading(false);
        return;
    }

    try {
      const res = await fetch("/api/exams/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, examId: exam?.id }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("intern_user", JSON.stringify(data.user));
        localStorage.setItem("active_exam", JSON.stringify(exam));
        router.push("/exams/guidelines");
      } else {
        setError(data.error || "Authentication failed. Check credentials.");
      }
    } catch (err) {
      setError("Server connection failure.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingExam) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#003366] mb-4" size={32} />
        <p className="text-sm font-medium text-gray-400">Initializing secure session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col relative select-none">
      
      {/* Top Banner with Exam Details */}
      <div className="w-full bg-[#003366] py-2.5 px-6 shadow-sm z-20">
         <div className="max-w-[800px] mx-auto flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
               <div className="text-[10px] font-bold uppercase tracking-widest opacity-50 border-r border-white/10 pr-3 hidden sm:block">Secure Session</div>
               <div className="text-xs font-bold truncate max-w-[200px] sm:max-w-[300px]">
                  {exam?.title || "Exam Portal"}
               </div>
            </div>
            <div className="flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-emerald-400"></div>
               <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">Connected</span>
            </div>
         </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 lg:p-10 pb-32">
        
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[800px] bg-white rounded-xl flex flex-col md:flex-row overflow-hidden relative z-10 shadow-lg border border-zinc-200"
        >
          
          {/* Left Side: Info */}
          <div className="md:w-[40%] bg-[#E0E7FF] p-8 flex flex-col justify-between relative">
             <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-3">
                   <div className="h-9 w-9 bg-[#003366] rounded-lg flex items-center justify-center text-white">
                      <ShieldCheck size={18} />
                   </div>
                   <h1 className="text-[#003366] font-bold text-sm uppercase tracking-wider">Assessment</h1>
                </div>

                <div className="space-y-3">
                   <h2 className="text-[#003366] text-2xl font-bold leading-tight tracking-tight">
                       {exam?.title || "Online Examination"}
                   </h2>
                   <div className="space-y-2 pt-2">
                      <div className="flex items-center gap-2 text-[#003366]/60">
                         <Clock size={12} />
                         <span className="text-[11px] font-bold">{exam?.duration || "Set"} mins</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#003366]/60">
                         <Calendar size={12} />
                         <span className="text-[11px] font-bold">{exam?.date || "TBA"}</span>
                      </div>
                   </div>
                </div>
             </div>

             <div className="mt-8 relative z-10">
                <div className="p-4 bg-[#003366] rounded-lg text-white">
                   <p className="text-[11px] font-medium leading-relaxed opacity-90">
                      Stable connection required. Monitor active.
                   </p>
                </div>
             </div>
          </div>

          {/* Right Side: Form Section */}
          <div className="md:w-[60%] p-8 md:p-10 bg-white">
             <div className="max-w-[300px] mx-auto">
                
                <div className="mb-8">
                   <h3 className="text-xl font-bold text-[#003366]">Candidate Login</h3>
                   <p className="text-[12px] text-zinc-400 font-medium mt-1">Access the secure portal.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                   
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Email address</label>
                      <input 
                          type="email" 
                          required
                          placeholder="scholar@studentforge.in"
                          className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 text-sm font-medium outline-none transition-all focus:border-[#003366] rounded-lg"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                      />
                   </div>

                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Password</label>
                      <input 
                          type="password" 
                          required
                          placeholder="••••••••"
                          className="w-full h-11 px-4 bg-zinc-50 border border-zinc-200 text-sm font-medium outline-none transition-all focus:border-[#003366] rounded-lg"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                      />
                   </div>

                   <div className="p-4 bg-[#E0E7FF]/30 border border-[#003366]/5 rounded-lg space-y-2">
                      <label className="text-[10px] font-bold text-[#003366] uppercase tracking-widest text-center block">Security: 5 + 7?</label>
                      <input 
                          type="number" 
                          required
                          placeholder="Answer"
                          className="w-full h-10 px-4 bg-white border border-[#003366]/10 text-sm font-bold outline-none transition-all focus:border-[#003366] rounded-md text-center"
                          value={mathAnswer}
                          onChange={(e) => setMathAnswer(e.target.value)}
                      />
                   </div>

                   {error && (
                      <div className="p-2.5 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2">
                         <AlertCircle size={12} className="text-red-500 shrink-0" />
                         <p className="text-[9px] text-red-600 font-bold uppercase tracking-tight">{error}</p>
                      </div>
                   )}

                   <div className="pt-2">
                      <button 
                         type="submit"
                         disabled={loading || !exam}
                         className="w-full h-11 bg-[#003366] text-white text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 rounded-lg"
                      >
                         {loading ? <Loader2 className="animate-spin" size={14} /> : "Authenticate"}
                      </button>
                   </div>

                </form>

             </div>
          </div>

        </motion.div>

      </div>

      <footer className="absolute bottom-0 left-0 w-full py-6 px-6 opacity-40">
          <div className="max-w-[800px] mx-auto flex flex-col items-center gap-2 text-center">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Powered by Redlix Secure</span>
              <p className="text-[9px] text-zinc-400 font-semibold max-w-xs leading-tight">
                  © 2025-2026 Student Forge. Evaluation purposes only.
              </p>
          </div>
      </footer>

    </div>
  );
}

export default function ExamLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-[#003366]" size={32} />
      </div>
    }>
      <ExamLoginContent />
    </Suspense>
  );
}
