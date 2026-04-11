"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Timer, 
  User,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react";
import { EXAM_QUESTIONS } from "@/lib/exam-questions";

const COLORS = {
  not_visited: "#ffffff",
  not_answered: "#ee7033",
  answered: "#2d8e36",
  marked_for_review: "#7355a6",
};

export default function ExamPanelPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [status, setStatus] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(3600);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [shuffledQuestions] = useState(() => [...EXAM_QUESTIONS].sort(() => Math.random() - 0.5));

  const violationsRef = useRef(0);
  const isSubmittedRef = useRef(false);

  const syncSession = useCallback(async (statusStr: string, finalScore: number | null, vCount: number, currentAnswers?: any) => {
    const storedUser = localStorage.getItem("intern_user");
    if (!storedUser) return;
    const u = JSON.parse(storedUser);

    try {
      const res = await fetch("/api/exams/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: u.id,
          status: statusStr,
          score: finalScore,
          violations: vCount,
          answers: currentAnswers,
          questionMapping: shuffledQuestions
        })
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Sync Error Details:", errorData);
      }
    } catch (err) {
      console.error("Fetch Network error:", err);
    }
  }, [shuffledQuestions]);

  const handleSubmit = useCallback(() => {
    if (isSubmittedRef.current) return;
    isSubmittedRef.current = true;
    syncSession("SUBMITTED", null, violationsRef.current, answers);
    setIsSubmitted(true);
    setShowConfirm(false);

    if (typeof document !== "undefined" && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
    }
  }, [answers, syncSession]);

  useEffect(() => {
    const storedUser = localStorage.getItem("intern_user");
    if (!storedUser) {
      router.push("/exams");
      return;
    }
    const u = JSON.parse(storedUser);
    setUser(u);

    const handleVisibilityChange = () => {
      if (document.hidden && !isSubmittedRef.current) {
        violationsRef.current += 1;
        syncSession("STARTED", null, violationsRef.current);
        alert("Warning: Do not change tabs.");
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const forbidden = ["F5", "F11", "F12"];
      if (forbidden.includes(e.key) || (e.ctrlKey && ["r", "w", "t", "n"].includes(e.key.toLowerCase()))) {
        e.preventDefault();
        handleSubmit(); 
      }
    };

    const handleFullScreenExit = () => {
        if (!document.fullscreenElement && !isSubmittedRef.current) {
            alert("Exited full screen. Submission triggered.");
            handleSubmit();
        }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullScreenExit);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullScreenExit);
    };
  }, [router, handleSubmit, syncSession]);

  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) {
        if (timeLeft <= 0 && !isSubmitted) handleSubmit();
        return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, handleSubmit]);

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const handleSaveNext = () => {
    const newStatus = { ...status };
    if (answers[currentIdx] === undefined) {
        newStatus[currentIdx] = 'not_answered';
    } else {
        newStatus[currentIdx] = 'answered';
    }
    setStatus(newStatus);
    if (currentIdx < shuffledQuestions.length - 1) setCurrentIdx(prev => prev + 1);
    else setShowConfirm(true);
  };

  const handleMarkReview = () => {
    setStatus({ ...status, [currentIdx]: 'marked_for_review' });
    if (currentIdx < shuffledQuestions.length - 1) setCurrentIdx(prev => prev + 1);
    else setShowConfirm(true);
  };

  const handleClear = () => {
    setAnswers({ ...answers, [currentIdx]: undefined as any });
    setStatus({ ...status, [currentIdx]: 'not_answered' });
  };

  if (!user) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-blue-700" /></div>;

  if (isSubmitted) {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10">
            <CheckCircle2 size={60} className="text-green-600 mb-6" />
            <h1 className="text-2xl font-bold text-blue-900 mb-2">Exam Submitted</h1>
            <p className="text-gray-500 mb-10 text-sm">Thanks for giving the exam.</p>
            <button 
                onClick={() => { localStorage.removeItem("intern_user"); router.push("/exams"); }}
                className="bg-blue-600 text-white px-10 py-3 font-bold border rounded shadow"
            >
                Log Out
            </button>
        </div>
    );
  }

  const q = shuffledQuestions[currentIdx];
  const summary = {
    answered: Object.values(status).filter(s => s === 'answered').length,
    marked: Object.values(status).filter(s => s === 'marked_for_review').length,
    not_answered: shuffledQuestions.length - Object.values(status).filter(s => s === 'answered').length - Object.values(status).filter(s => s === 'marked_for_review').length
  };

  return (
    <div className="h-screen bg-white flex flex-col select-none relative overflow-hidden font-sans">
      
      {/* Simple Tiled Watermark Grid */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.05] overflow-hidden select-none">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-y-24 gap-x-12 p-10 h-full w-full">
              {[...Array(50)].map((_, i) => (
                  <div key={i} className="flex items-center justify-center -rotate-12">
                     <span className="text-xl font-black whitespace-nowrap">STUDENT FORGE</span>
                  </div>
              ))}
          </div>
      </div>

      {/* Header - Simple Simple Look */}
      <header className="h-16 bg-blue-700 text-white px-8 flex justify-between items-center shadow-md relative z-20">
        <div>
           <h1 className="text-lg font-bold">Full Stack Exam</h1>
           <p className="text-[10px] font-bold opacity-70">Student Forge Technologies</p>
        </div>
        <div className="flex items-center gap-6">
            <div className="bg-blue-800 px-4 py-1 border border-blue-400 font-bold text-xl">
               Time Left: {formatTime(timeLeft)}
            </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex overflow-hidden relative z-10">
        
        {/* Question Area - NO OVERSIZING */}
        <div className="flex-1 flex flex-col border-r border-gray-300">
           
           <div className="bg-gray-50 p-3 border-b border-gray-300 flex justify-between items-center shrink-0">
              <span className="text-blue-800 font-bold text-xs">Question: {currentIdx + 1}</span>
              <div className="flex gap-4 text-[10px] font-bold text-gray-400 uppercase">
                 <span className="text-green-600">Correct: +3</span>
                 <span className="text-red-500">Negative: -1</span>
              </div>
           </div>

           <div className="flex-1 p-10 md:p-14 overflow-y-auto custom-scrollbar" data-lenis-prevent>
              <div className="max-w-4xl mx-auto">
                  <h2 className="text-xl font-bold text-gray-800 border-b pb-6 mb-8 leading-relaxed">
                     {q.question}
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    {q.options.map((opt, idx) => (
                        <label 
                           key={idx}
                           className={`flex items-start gap-4 p-5 border transition-all cursor-pointer ${
                              answers[currentIdx] === idx ? 'border-blue-700 bg-blue-50' : 'border-gray-100 hover:border-gray-200'
                           }`}
                        >
                           <input type="radio" checked={answers[currentIdx] === idx} onChange={() => setAnswers({ ...answers, [currentIdx]: idx })} className="mt-1 h-4 w-4 accent-blue-700" />
                           <p className="text-sm font-bold text-gray-700">
                              <span className="text-gray-400 mr-4">{String.fromCharCode(65 + idx)}.</span>
                              {opt}
                           </p>
                        </label>
                    ))}
                  </div>
              </div>
           </div>

           {/* Buttons - Simple Look */}
           <div className="bg-gray-100 p-4 border-t border-gray-300 flex justify-between items-center shrink-0">
              <div className="flex gap-3">
                 <button onClick={handleMarkReview} className="bg-purple-700 text-white px-5 py-2 text-[10px] font-bold uppercase shadow">Mark Review</button>
                 <button onClick={handleClear} className="bg-white border border-gray-300 text-gray-600 px-5 py-2 text-[10px] font-bold uppercase">Clear Answer</button>
              </div>
              <div className="flex gap-3">
                 <button onClick={() => setShowConfirm(true)} className="bg-red-600 text-white px-6 py-2 text-[10px] font-bold uppercase shadow">Submit</button>
                 <button onClick={handleSaveNext} className="bg-blue-700 text-white px-8 py-2 text-[10px] font-bold uppercase shadow">Save and Next</button>
              </div>
           </div>
        </div>

        {/* Palette - Simple Sidebar */}
        <div className="w-full md:w-72 bg-gray-50 flex flex-col border-l border-gray-300 shrink-0">
           
           <div className="p-6 bg-white border-b border-gray-300 text-center">
              <div className="h-16 w-16 bg-gray-100 border border-gray-300 mx-auto mb-3 flex items-center justify-center text-gray-400">
                 <User size={30} />
              </div>
              <p className="text-xs font-bold text-gray-800 uppercase">{user.name}</p>
              <p className="text-[10px] text-gray-400 font-bold">Candidate</p>
           </div>

           <div className="flex-1 overflow-y-auto p-5 custom-scrollbar" data-lenis-prevent>
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-3 pb-1 border-b">Question Grid (1-50)</p>
              <div className="grid grid-cols-4 gap-2">
                 {shuffledQuestions.map((_, i) => {
                    const s = status[i];
                    return (
                        <button key={i} onClick={() => setCurrentIdx(i)} className={`h-9 w-9 text-[11px] font-bold border transition-all flex items-center justify-center ${currentIdx === i ? 'border-blue-700 border-2' : ''}`}
                           style={{ backgroundColor: s === 'answered' ? COLORS.answered : s === 'not_answered' ? COLORS.not_answered : s === 'marked_for_review' ? COLORS.marked_for_review : '#fff', color: s ? '#fff' : '#444' }}>
                           {i + 1}
                        </button>
                    );
                 })}
              </div>
           </div>

           <div className="p-6 bg-white border-t border-gray-300 text-[10px] font-bold uppercase space-y-3 shrink-0">
              <div className="flex items-center gap-3"><div className="h-4 w-4 bg-white border border-gray-300" /><span className="text-gray-400">Not Visited</span></div>
              <div className="flex items-center gap-3"><div className="h-4 w-4 bg-[#ee7033]" /><span className="text-gray-400">Not Answered</span></div>
              <div className="flex items-center gap-3"><div className="h-4 w-4 bg-[#2d8e36]" /><span className="text-gray-400">Answered</span></div>
              <div className="flex items-center gap-3"><div className="h-4 w-4 bg-[#7355a6]" /><span className="text-gray-400">Marked Review</span></div>
           </div>

        </div>

      </main>

      {/* Simple Footer */}
      <footer className="h-10 bg-gray-200 border-t border-gray-300 flex justify-between px-8 items-center shrink-0 relative z-20">
         <div className="flex gap-6">
             <button onClick={() => currentIdx > 0 && setCurrentIdx(prev => prev - 1)} className="text-[10px] font-bold text-blue-800 uppercase">Previous</button>
             <button onClick={() => currentIdx < shuffledQuestions.length - 1 && setCurrentIdx(prev => prev + 1)} className="text-[10px] font-bold text-blue-800 uppercase">Next</button>
         </div>
         <p className="text-[9px] text-gray-500 font-bold uppercase">Assessment Terminal</p>
      </footer>

      {/* Confirmation Summary - Simple Simple English */}
      {showConfirm && (
          <div className="absolute inset-0 z-[100] bg-black/60 flex items-center justify-center p-6 backdrop-blur-sm">
             <div className="bg-white max-w-xl w-full p-10 border border-gray-300 shadow-2xl">
                <h3 className="text-xl font-bold text-blue-800 border-b pb-4 mb-8 uppercase text-center">Summary</h3>
                <table className="w-full border text-sm mb-10">
                   <tbody className="font-bold text-gray-700">
                      <tr><td className="p-4 border-b border-r bg-gray-50 uppercase text-[10px]">Total Nodes</td><td className="p-4 border-b text-center text-lg">{shuffledQuestions.length}</td></tr>
                      <tr><td className="p-4 border-b border-r text-green-700 uppercase text-[10px]">Answered</td><td className="p-4 border-b text-center text-lg text-green-700">{summary.answered}</td></tr>
                      <tr><td className="p-4 border-b border-r text-purple-700 uppercase text-[10px]">Review Marked</td><td className="p-4 border-b text-center text-lg text-purple-700">{summary.marked}</td></tr>
                      <tr><td className="p-4 border-r text-orange-700 uppercase text-[10px]">Not Answered</td><td className="p-4 text-center text-lg text-orange-700">{summary.not_answered}</td></tr>
                   </tbody>
                </table>
                <p className="text-[10px] text-gray-500 font-bold mb-10 text-center uppercase tracking-tight">Do you want to submit? Changes are not allowed after this.</p>
                <div className="flex gap-6">
                    <button onClick={() => setShowConfirm(false)} className="flex-1 h-12 border bg-gray-50 text-gray-600 font-bold uppercase text-[10px]">No, Go Back</button>
                    <button onClick={handleSubmit} className="flex-1 h-12 bg-blue-700 text-white font-bold uppercase text-[10px] shadow-lg">Yes, Submit</button>
                </div>
             </div>
          </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; }
      `}</style>
    </div>
  );
}
