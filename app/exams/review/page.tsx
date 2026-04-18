"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  Loader2,
  AlertTriangle,
  FileText
} from "lucide-react";

function ExamReviewContent() {
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

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      await fetch("/api/exams/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          status: "SUBMITTED",
          violations: submission.violations,
          answers: submission.answers,
          questionMapping: submission.questions || submission.shuffledQuestions, // Fallback for old sessions
          typedExitKey: submission.exitKey
        })
      });
      
      localStorage.removeItem("exam_submission");
      setIsSubmitted(true);
      if (typeof document !== "undefined" && document.exitFullscreen) document.exitFullscreen().catch(() => {});
    } catch (err) {
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <CheckCircle2 size={80} className="text-emerald-600 mb-6" />
        <h1 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Assessment Submitted</h1>
        <p className="text-slate-400 mb-10 max-w-sm text-sm font-medium">
           Your assessment has been successfully recorded and verified. 
           You may now close this window and check your intern dashboard for further updates.
        </p>
        <button 
          onClick={() => { localStorage.removeItem("intern_user"); router.push("/exams"); }}
          className="bg-indigo-600 text-white px-12 py-4 font-bold uppercase text-[11px] tracking-widest hover:bg-indigo-700 transition-all rounded"
        >
          Exit Assessment
        </button>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center flex-col gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Verifying Submission Node...</p>
      </div>
    );
  }

  const { status, questions, shuffledQuestions } = submission;
  const currentQuestions = questions || shuffledQuestions || [];
  const answeredCount = Object.values(status).filter(s => s === 'answered' || s === 'marked_for_review').length;
  const totalCount = currentQuestions.length;
  const unansweredCount = totalCount - answeredCount;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col text-slate-700">
      
      {/* Header */}
      <header className="bg-indigo-600 text-white p-8 shadow-md border-b-2 border-indigo-700">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
           <div>
              <h1 className="text-xl font-bold tracking-tight">Final Verification</h1>
              <p className="text-[10px] font-semibold opacity-60 uppercase tracking-widest mt-1 italic">Session ID: {user.id?.slice(-8).toUpperCase()}</p>
           </div>
           <div className="bg-indigo-700 px-6 py-2 border border-indigo-400/20 rounded flex items-center gap-3">
              <span className="text-[10px] font-bold opacity-60 uppercase">Candidate</span>
              <span className="text-sm font-bold">{user.name}</span>
           </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white border border-slate-200 shadow-sm rounded overflow-hidden">
          
          <div className="bg-slate-50 p-5 border-b border-slate-200 flex justify-center items-center gap-2">
             <FileText size={18} className="text-indigo-600" />
             <h2 className="text-slate-800 font-bold text-xs uppercase tracking-widest">Submission Summary</h2>
          </div>

          <div className="p-8 md:p-12 space-y-12">
             
             {/* Stats */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 border border-slate-100 text-center rounded bg-slate-50 flex flex-col justify-center">
                   <p className="text-4xl font-bold text-slate-800 mb-1">{totalCount}</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Nodes</p>
                </div>
                <div className="p-8 border border-emerald-100 text-center rounded bg-emerald-50/50 flex flex-col justify-center">
                   <p className="text-4xl font-bold text-emerald-600 mb-1">{answeredCount}</p>
                   <p className="text-[10px] text-emerald-600/70 font-bold uppercase tracking-widest">Answered</p>
                </div>
                <div className="p-8 border border-amber-100 text-center rounded bg-amber-50/50 flex flex-col justify-center">
                   <p className="text-4xl font-bold text-amber-600 mb-1">{unansweredCount}</p>
                   <p className="text-[10px] text-amber-600/70 font-bold uppercase tracking-widest">Skipped</p>
                </div>
             </div>

             {/* Important Note */}
             <div className="p-8 border border-indigo-100 bg-indigo-50/30 flex items-start gap-6 rounded relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
                <AlertTriangle className="text-indigo-600 shrink-0 mt-0.5" size={20} />
                <div className="space-y-2">
                   <p className="text-xs font-bold text-indigo-900 uppercase tracking-widest">Irreversible Action</p>
                   <p className="text-sm text-indigo-800/80 leading-relaxed font-medium">
                      Final submission is permanent. Once submitted, your answers will be locked and sent to the examination authority for evaluation. This action cannot be undone.
                   </p> 
                </div>
             </div>

             {/* Buttons */}
             <div className="flex flex-col md:flex-row gap-4 pt-10 border-t border-slate-100">
                <button 
                   onClick={() => router.push("/exams/panel")}
                   disabled={loading}
                   className="flex-1 h-12 border border-slate-300 text-slate-400 font-bold text-[11px] uppercase tracking-widest rounded hover:bg-slate-50 transition-all active:scale-95"
                >
                   ← Return to Exam
                </button>
                <button 
                   onClick={handleFinalSubmit}
                   disabled={loading}
                   className="flex-1 h-12 bg-indigo-600 text-white font-bold text-[11px] uppercase tracking-widest rounded shadow-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                   {loading ? <Loader2 className="animate-spin" size={16} /> : "Finalize & Submit Session"}
                </button>
             </div>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        Student Forge Technologies © 2026 • Official Assessment Module
      </footer>

    </div>
  );
}

export default function ExamReviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    }>
      <ExamReviewContent />
    </Suspense>
  );
}
