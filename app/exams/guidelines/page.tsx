"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, FileText, Info, CheckCircle2, Calendar, Clock } from "lucide-react";

export default function ExamGuidelinesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [exam, setExam] = useState<any>(null);
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

  const fetchExamDetails = async () => {
    try {
        const storedExam = localStorage.getItem("active_exam");
        if (storedExam) {
            setExam(JSON.parse(storedExam));
            return;
        }

        const res = await fetch("/api/exams/details");
        const data = await res.json();
        if (data.success) {
            setExam(data.exam);
        }
    } catch (err) {
        console.error("Failed to fetch exam details");
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("intern_user");
    if (!storedUser) {
      router.push("/exams");
      return;
    } 
    
    const u = JSON.parse(storedUser);
    setUser(u);

    fetchExamDetails();
    checkExamStatus();
    const interval = setInterval(checkExamStatus, 15000); 
    return () => clearInterval(interval);
  }, [router, checkExamStatus]);

  const startExam = async () => {
    if (!hasAgreed) {
        alert("Please confirm that you have read all instructions.");
        return;
    }

    const res = await fetch("/api/exams/status");
    const data = await res.json();
    if (!data.isActive) {
        alert("The exam is not active yet. Please wait for the administrator to start.");
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
            body: JSON.stringify({ userId: user.id, examId: exam?.id })
        });

        router.push("/exams/panel");
    } catch (err) {
        router.push("/exams/panel");
    }
  };

  if (!user || loading) {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <Loader2 className="animate-spin text-violet-600" size={32} />
        </div>
    );
  }

  const guidelines = Array.isArray(exam?.guidelines) 
    ? exam.guidelines 
    : [
        `You have ${exam?.duration || 120} minutes for the complete assessment.`,
        "The exam will run in mandatory full-screen mode. Do not exit it.",
        "Do not change tabs or your session will be strictly disqualified.",
        "Keyboard security: Keys like F5, F11, and F12 are disabled.",
        "Ensure you click 'Save and Next' to record your progress."
      ];

  return (
    <div className="h-screen bg-slate-50 font-sans flex flex-col text-slate-800 overflow-hidden">
      
      {/* Slim Top Bar */}
      <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 relative z-10">
         <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-violet-600 rounded flex items-center justify-center text-white">
               <ShieldCheck size={18} />
            </div>
            <h1 className="text-sm font-bold tracking-tight text-slate-800">
               {exam?.title || "Exam Rules"}
            </h1>
         </div>
         <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-2 px-3 py-1 bg-violet-50 text-violet-600 rounded">
               <Clock size={12}/> {exam?.duration || "0"} Minutes
            </span>
         </div>
      </header>

      {/* Main Dashboard Layout */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* Left Sidebar: Identity & Action */}
         <aside className="w-full md:w-[380px] bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto">
            
            <div className="p-8 space-y-8">
               
               {/* Candidate Card */}
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="h-14 w-14 bg-slate-50 border border-slate-100 rounded flex items-center justify-center text-slate-300">
                        <Info size={24} />
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Student Name</p>
                        <h2 className="text-lg font-bold text-slate-800 leading-tight">{user.name}</h2>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 pt-2">
                     <div className="p-4 bg-slate-50 border border-slate-100 rounded">
                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Email</p>
                        <p className="text-xs font-medium text-slate-600 truncate">{user.email}</p>
                     </div>
                     <div className="p-4 bg-slate-50 border border-slate-100 rounded">
                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Student ID</p>
                        <p className="text-sm font-bold text-violet-700">SF-{user.id?.slice(-8).toUpperCase()}</p>
                     </div>
                  </div>
               </div>

               {/* Checklist / Action Area */}
               <div className="pt-8 border-t border-slate-100 space-y-6">
                  <div className="space-y-2">
                     <h3 className="text-sm font-bold text-slate-800">Ready to start?</h3>
                     <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                        Please read the rules on the right before you start.
                     </p>
                  </div>

                  <label className="flex items-start gap-4 cursor-pointer group select-none">
                     <div className="pt-0.5">
                        <input 
                           type="checkbox" 
                           className="h-5 w-5 accent-violet-600 rounded border-gray-300 cursor-pointer"
                           checked={hasAgreed}
                           onChange={(e) => setHasAgreed(e.target.checked)}
                        />
                     </div>
                     <span className="text-xs font-bold text-slate-600 group-hover:text-violet-600 transition-colors leading-relaxed">
                        I have read and agree to follow all the rules.
                     </span>
                  </label>

                  <div className="pt-4 space-y-4">
                     <button 
                        onClick={startExam}
                        disabled={!hasAgreed || !examActive}
                        className={`w-full py-4 text-xs font-bold uppercase tracking-widest transition-all rounded shadow-sm flex items-center justify-center gap-3 ${
                           (hasAgreed && examActive)
                           ? 'bg-violet-600 text-white hover:bg-violet-700 active:scale-[0.98]' 
                           : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                     >
                        {examActive ? (
                           <>Start Exam Now <CheckCircle2 size={16}/></>
                        ) : 'Wait for admin'}
                     </button>
                     
                     {!examActive && (
                        <div className="p-4 bg-amber-50 border border-amber-100 rounded flex gap-3">
                           <Loader2 size={14} className="animate-spin text-amber-600 shrink-0 mt-0.5" />
                           <p className="text-[10px] text-amber-700 font-bold leading-normal">
                              The admin has not started the exam yet. This page will refresh soon.
                           </p>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            <div className="mt-auto p-8 border-t border-slate-100">
               <div className="flex items-center gap-3 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                  <ShieldCheck size={14} /> SECURE MODE
               </div>
            </div>
         </aside>

         {/* Content Area: Instructions & Syllabus */}
         <main className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-12">
            <div className="max-w-3xl mx-auto space-y-10 pb-20">
               
               {/* Syllabus Branding Section */}
               <section className="bg-white border border-gray-200 rounded-none shadow-sm overflow-hidden">
                  <div className="bg-zinc-50 px-8 py-4 border-b border-gray-100 flex justify-between items-center">
                     <span className="text-[10px] font-bold text-violet-800 uppercase tracking-widest">Exam Syllabus</span>
                     <span className="text-[10px] font-bold text-slate-400 uppercase">{exam?.date || "No date set"}</span>
                  </div>
                  <div className="p-8 px-10">
                     <div className="text-sm font-medium text-slate-600 leading-8 whitespace-pre-wrap">
                        {exam?.syllabus || "Please wait for syllabus details."}
                     </div>
                  </div>
               </section>

               {/* Detailed Instructions */}
               <section className="space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="h-px bg-slate-200 flex-1"></div>
                     <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">Rules to Follow</h3>
                     <div className="h-px bg-slate-200 flex-1"></div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                     {guidelines.map((g: string, i: number) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-none p-6 flex gap-6 items-start transition-all hover:border-violet-200 group">
                           <span className="flex-shrink-0 w-8 h-8 bg-slate-50 text-violet-600 rounded-full flex items-center justify-center text-sm font-bold group-hover:bg-violet-600 group-hover:text-white transition-all">
                              {i + 1}
                           </span>
                           <div className="space-y-1">
                              <p className="text-sm font-bold text-slate-800 leading-relaxed uppercase tracking-tight">Rule {i + 1}</p>
                              <p className="text-[13px] font-medium text-slate-500 leading-relaxed">{g}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>

               {/* Footer Note */}
               <div className="text-center pt-10">
                  <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                     Exam Portal • Student Forge Technologies
                  </p>
               </div>

            </div>
         </main>

      </div>
    </div>
  );
}

