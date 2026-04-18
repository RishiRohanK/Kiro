"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Calendar, Clock, AlertCircle, ShieldCheck, Lock } from "lucide-react";

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
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={32} />
        <p className="text-sm font-medium text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col relative select-none">
      
      {/* Top Banner with Exam Details */}
      <div className="w-full bg-violet-600 border-b border-violet-700 py-2.5 px-6">
         <div className="max-w-[900px] mx-auto flex justify-between items-center text-white">
            <div className="flex items-center gap-4">
               <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 border-r border-white/20 pr-4">Assessment Mode</div>
               <div className="text-xs font-bold truncate max-w-[300px]">
                  {exam?.title || "Exam Portal"} • {exam?.date || "No date set"} • {exam?.time || "Time not set"}
               </div>
            </div>
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
               <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Secure Node Active</span>
            </div>
         </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 pb-32">
        
        <div className="w-full max-w-[900px] bg-white border border-gray-200 flex flex-col md:flex-row overflow-hidden relative z-10 shadow-sm">
          
          {/* Left Side: Branding */}
          <div className="md:w-1/2 bg-violet-50 p-10 md:p-14 flex flex-col justify-center relative border-b md:border-b-0 md:border-r border-gray-100">
             <div className="space-y-8">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 bg-violet-600 rounded flex items-center justify-center text-white">
                      <ShieldCheck size={24} />
                   </div>
                   <h1 className="text-violet-900 font-bold text-lg tracking-tight leading-tight">Exam Portal</h1>
                </div>

                <div className="space-y-2">
                   <h2 className="text-violet-900 text-3xl font-bold leading-tight tracking-tight">
                       {exam?.title || "Assessment"}
                   </h2>
                   <p className="text-violet-600/70 text-sm font-medium tracking-wide">Student Forge Technologies</p>
                </div>
             </div>

             <div className="hidden md:block absolute bottom-14 left-10 md:left-14">
                <p className="text-[10px] font-bold text-violet-300 uppercase tracking-widest leading-none">
                   Official Assessment Gateway
                </p>
             </div>
          </div>

          {/* Right Side: Form Section */}
          <div className="md:w-1/2 p-10 md:p-14 bg-white">
             <div className="max-w-[340px] mx-auto">
                
                <div className="mb-10">
                   <h3 className="text-xl font-bold text-slate-800">Student Login</h3>
                   <p className="text-xs text-slate-400 font-medium mt-1">Log in to start your exam.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                   
                   <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email address</label>
                      <input 
                          type="email" 
                          required
                          placeholder="your@email.com"
                          className="w-full h-11 px-4 bg-slate-50 border border-slate-200 text-sm outline-none transition-all focus:border-indigo-600 focus:bg-white rounded-none"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                      />
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                      <div className="relative">
                         <input 
                             type="password" 
                             required
                             placeholder="Enter password"
                             className="w-full h-11 px-4 bg-slate-50 border border-slate-200 text-sm outline-none transition-all focus:border-indigo-600 focus:bg-white rounded-none"
                             value={password}
                             onChange={(e) => setPassword(e.target.value)}
                         />
                         <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      </div>
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">What is 5 + 7?</label>
                      <input 
                          type="number" 
                          required
                          placeholder="Answer"
                          className="w-full h-11 px-4 bg-slate-50 border border-slate-200 text-sm outline-none transition-all focus:border-indigo-600 focus:bg-white rounded-none"
                          value={mathAnswer}
                          onChange={(e) => setMathAnswer(e.target.value)}
                      />
                   </div>

                   {error && (
                      <div className="p-3 bg-red-50 border border-red-100 rounded-none flex items-center gap-3">
                         <AlertCircle size={14} className="text-red-500 shrink-0" />
                         <p className="text-[10px] text-red-600 font-bold uppercase tracking-tight">{error}</p>
                      </div>
                   )}

                   <div className="pt-4">
                      <button 
                         type="submit"
                         disabled={loading || !exam}
                         className="w-full h-12 bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 rounded-none"
                      >
                         {loading ? <Loader2 className="animate-spin" size={16} /> : "Start Exam"}
                      </button>
                   </div>

                </form>

             </div>
          </div>

        </div>

      </div>

      {/* Standard Intern Footer */}
      <footer className="absolute bottom-0 left-0 w-full bg-zinc-100 border-t border-zinc-200 py-6 px-6">
          <div className="max-w-[900px] mx-auto flex flex-col items-center gap-2">
              <p className="text-[11px] text-[#6c757d] font-medium text-center">
                  © 2025-2026 Student Forge Technologies Private Limited. All Rights Reserved.
                  Unauthorized access or use of this platform is strictly prohibited.
              </p>
              <p className="text-[10px] text-zinc-400 font-bold text-center">
                  platform.studentforge.in is a registered trademark. Secured with enterprise-grade encryption.
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
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    }>
      <ExamLoginContent />
    </Suspense>
  );
}

