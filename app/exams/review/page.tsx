"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  Loader2,
  AlertTriangle,
  FileText
} from "lucide-react";

export default function ExamReviewPage() {
  const router = useRouter();
  const [submission, setSubmission] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("intern_user");
    const storedSubmission = localStorage.getItem("exam_submission");
    
    if (!storedUser || !storedSubmission) {
      router.push("/exams");
      return;
    }
    
    setUser(JSON.parse(storedUser));
    setSubmission(JSON.parse(storedSubmission));
  }, [router]);

  const syncSession = async (status: string, answers: any, questions: any, vCount: number) => {
    try {
      await fetch("/api/exams/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          status,
          violations: vCount,
          answers,
          questionMapping: questions
        })
      });
    } catch (err) {
      console.error("Sync error");
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      if (typeof document !== "undefined" && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }

      await syncSession("SUBMITTED", submission.answers, submission.shuffledQuestions, submission.violations);
      
      localStorage.removeItem("exam_submission");
      setIsSubmitted(true);
    } catch (err) {
      alert("Submission failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 font-sans">
        <CheckCircle2 size={80} className="text-green-600 mb-8" />
        <h1 className="text-3xl font-black text-blue-900 mb-4 uppercase tracking-tighter">Exam Submitted</h1>
        <p className="text-zinc-500 mb-12 font-bold text-sm uppercase">Your answers have been securely synced with Student Forge.</p>
        <button 
          onClick={() => { localStorage.removeItem("intern_user"); router.push("/exams"); }}
          className="bg-blue-700 text-white px-16 py-4 font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-blue-800 transition-all"
        >
          Logout Terminal
        </button>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-sans">
        <Loader2 className="animate-spin text-blue-700" />
      </div>
    );
  }

  const { answers, status, shuffledQuestions } = submission;
  const answeredCount = Object.values(status).filter(s => s === 'answered' || s === 'marked_for_review').length;
  const totalCount = shuffledQuestions.length;
  const unansweredCount = totalCount - answeredCount;

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col select-none">
      
      {/* Simple Header */}
      <header className="h-20 bg-blue-700 text-white px-10 flex justify-between items-center shadow-lg relative z-20">
        <div>
           <h1 className="text-xl font-black uppercase tracking-tight">Final Summary</h1>
           <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Candidate Verification Node</p>
        </div>
        <div className="h-10 w-10 bg-blue-800 border border-blue-500 flex items-center justify-center rounded shadow-inner">
           <FileText size={20} />
        </div>
      </header>

      <main className="flex-1 p-8 md:p-20 overflow-y-auto bg-zinc-50/50">
        <div className="max-w-3xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
             <h2 className="text-4xl font-black text-blue-900 uppercase tracking-tighter leading-none">Review Your Status</h2>
             <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em]">Check carefully before final submission</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white border-2 border-zinc-100 p-8 text-center shadow-sm">
                <p className="text-4xl font-black text-blue-700 mb-2">{totalCount}</p>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Nodes</p>
             </div>
             <div className="bg-white border-2 border-green-500/20 p-8 text-center shadow-sm border-b-green-500">
                <p className="text-4xl font-black text-green-600 mb-2">{answeredCount}</p>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Answered</p>
             </div>
             <div className="bg-white border-2 border-amber-500/20 p-8 text-center shadow-sm border-b-amber-500">
                <p className="text-4xl font-black text-amber-600 mb-2">{unansweredCount}</p>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Unanswered</p>
             </div>
          </div>

          {/* Warning Node */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 flex items-start gap-4">
             <AlertTriangle className="text-amber-600 shrink-0" size={24} />
             <div>
                <h4 className="text-xs font-black text-amber-900 uppercase tracking-tight mb-1">Final Submission Warning</h4>
                <p className="text-xs text-amber-800 font-bold leading-relaxed opacity-80 uppercase tracking-tight">
                   Once submitted, you cannot go back and modify any answers. Ensure all modules have been attempted.
                </p>
             </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-6 pt-10">
             <button 
                onClick={() => router.push("/exams/panel")}
                className="flex-1 h-16 border-2 border-zinc-200 text-zinc-600 font-black uppercase text-xs tracking-widest hover:bg-zinc-100 transition-all"
             >
                Back to Questions
             </button>
             <button 
                onClick={handleFinalSubmit}
                disabled={loading}
                className="flex-1 h-16 bg-blue-700 text-white font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-blue-800 transition-all flex items-center justify-center disabled:opacity-50"
             >
                {loading ? <Loader2 className="animate-spin" /> : "Final Submit"}
             </button>
          </div>

        </div>
      </main>

      {/* Tiled Background Watermark */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] overflow-hidden select-none">
          <div className="grid grid-cols-3 gap-y-32 gap-x-12 p-10 h-full w-full">
              {[...Array(30)].map((_, i) => (
                  <div key={i} className="flex items-center justify-center -rotate-12">
                     <span className="text-2xl font-black whitespace-nowrap">STUDENT FORGE</span>
                  </div>
              ))}
          </div>
      </div>

    </div>
  );
}
