"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Timer, 
  User,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { EXAM_QUESTIONS } from "@/lib/exam-questions";

const COLORS = {
  not_visited: "#ffffff",
  not_answered: "#ee7033", // Orange
  answered: "#2d8e36",     // Green
  marked_for_review: "#7355a6", // Purple
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
  const [violations, setViolations] = useState(0);
  
  // Shuffled questions - only done once
  const [shuffledQuestions] = useState(() => [...EXAM_QUESTIONS].sort(() => Math.random() - 0.5));

  const violationsRef = useRef(0);
  const isSubmittedRef = useRef(false);

  const syncSession = useCallback(async (statusStr: string, finalScore: number | null, vCount: number, currentAnswers?: any) => {
    const storedUser = localStorage.getItem("intern_user");
    if (!storedUser) return;
    const u = JSON.parse(storedUser);

    try {
      await fetch("/api/exams/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: u.id,
          status: statusStr,
          score: finalScore,
          violations: vCount,
          answers: currentAnswers,
          questionMapping: shuffledQuestions // Send mapping so server knows which question is which index
        })
      });
    } catch (err) {
      console.error("Sync error");
    }
  }, [shuffledQuestions]);

  const handleSubmit = useCallback(() => {
    if (isSubmittedRef.current) return;
    isSubmittedRef.current = true;
    
    // Server handles the scoring now
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
        setViolations(violationsRef.current);
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

    const checkStatus = setInterval(async () => {
        const res = await fetch("/api/exams/status");
        const data = await res.json();
        if (!data.isActive) handleSubmit();
    }, 15000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullScreenExit);
      clearInterval(checkStatus);
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
    
    if (currentIdx < shuffledQuestions.length - 1) {
        setCurrentIdx(prev => prev + 1);
    } else {
        setShowConfirm(true);
    }
  };

  const handleMarkReview = () => {
    setStatus({ ...status, [currentIdx]: 'marked_for_review' });
    if (currentIdx < shuffledQuestions.length - 1) {
        setCurrentIdx(prev => prev + 1);
    } else {
        setShowConfirm(true);
    }
  };

  const handleClear = () => {
    setAnswers({ ...answers, [currentIdx]: undefined as any });
    setStatus({ ...status, [currentIdx]: 'not_answered' });
  };

  if (!user) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-700" /></div>;

  if (isSubmitted) {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 font-sans">
            <CheckCircle2 size={80} className="text-blue-600 mb-6" />
            <h1 className="text-3xl font-bold text-blue-900 mb-2 uppercase">Test Submitted</h1>
            <p className="text-gray-500 mb-10 text-lg">Thanks for attempting the exam I given.</p>
            <button 
                onClick={() => { localStorage.removeItem("intern_user"); router.push("/exams"); }}
                className="bg-blue-600 text-white px-12 py-4 font-bold border-2 border-blue-900 shadow-xl"
            >
                Secure Exit
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
    <div className="h-screen bg-[#f8f9fa] flex flex-col font-sans select-none relative overflow-hidden">
      
      {/* 10 CROSS WATERMARKS */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.05] overflow-hidden">
          <div className="h-full w-full flex flex-col justify-between">
              {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex justify-between w-[200%] -ml-[50%] rotate-[-20deg] py-8">
                     <span className="text-4xl font-black tracking-[3em]">STUDENT FORGE</span>
                     <span className="text-4xl font-black tracking-[3em]">STUDENT FORGE</span>
                  </div>
              ))}
          </div>
          <div className="absolute inset-0 flex flex-col justify-between">
              {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex justify-between w-[200%] -ml-[50%] rotate-[20deg] py-8 border-t border-gray-900/10">
                     <span className="text-4xl font-black tracking-[3em]">STUDENT FORGE</span>
                     <span className="text-4xl font-black tracking-[3em]">STUDENT FORGE</span>
                  </div>
              ))}
          </div>
      </div>

      {/* Header - Government Style */}
      <header className="h-20 bg-blue-700 text-white px-8 flex justify-between items-center shadow-lg relative z-20 border-b-2 border-blue-900">
        <div className="flex flex-col">
           <h1 className="text-xl font-bold uppercase tracking-tight">Full Stack Development Exam 2026</h1>
           <p className="text-xs opacity-70 font-bold uppercase tracking-widest">Assessment Node v2.0</p>
        </div>
        <div className="flex items-center gap-6">
            <div className="bg-blue-800 px-6 py-2 border-2 border-blue-400 font-mono font-bold text-2xl">
               TIME LEFT: {formatTime(timeLeft)}
            </div>
            <button 
                onClick={() => setShowConfirm(true)}
                className="bg-red-600 hover:bg-red-700 h-12 px-8 text-xs font-black uppercase tracking-[0.2em] transition-all shadow-lg hidden md:block"
            >
                Submit Exam
            </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative z-10">
        
        {/* Left Side: Question Area */}
        <div className="flex-1 flex flex-col border-r-2 border-gray-300 bg-white">
           
           <div className="bg-gray-100 p-4 border-b-2 border-gray-300 flex justify-between items-center shrink-0">
              <span className="text-blue-800 font-black text-xs uppercase tracking-tighter">Question No: {currentIdx + 1}</span>
              <div className="flex items-center gap-6 text-[10px] text-gray-500 font-black uppercase">
                 <span className="bg-white px-3 py-1 border border-gray-200 text-green-700">Marks: +1.0</span>
                 <span className="bg-white px-3 py-1 border border-gray-200 text-red-600">Negative: 0.0</span>
              </div>
           </div>

           <div className="flex-1 p-16 md:p-24 overflow-y-auto custom-scrollbar">
              <div className="max-w-5xl mx-auto space-y-16">
                  {/* INCREASED QUESTION SPACE AND SIZE */}
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug border-b-2 border-gray-100 pb-16">
                     {q.question}
                  </h2>

                  <div className="grid grid-cols-1 gap-6">
                    {q.options.map((opt, idx) => (
                        <label 
                           key={idx}
                           className={`flex items-start gap-8 p-8 border-2 transition-all cursor-pointer rounded-none min-h-[100px] ${
                              answers[currentIdx] === idx ? 'border-blue-700 bg-blue-50 shadow-lg' : 'border-gray-100 hover:border-gray-200'
                           }`}
                        >
                           <div className={`mt-1 h-8 w-8 rounded-full border-2 flex items-center justify-center shrink-0 ${
                               answers[currentIdx] === idx ? 'border-blue-800 bg-blue-800' : 'border-gray-300'
                           }`}>
                               {answers[currentIdx] === idx && <div className="h-3 w-3 bg-white rounded-full" />}
                           </div>
                           <div className="flex-1">
                               <p className="text-lg md:text-xl font-bold text-gray-700 leading-tight">
                                  <span className="text-gray-400 mr-6 font-black">{String.fromCharCode(65 + idx)}.</span>
                                  {opt}
                               </p>
                           </div>
                           <input type="radio" className="hidden" checked={answers[currentIdx] === idx} onChange={() => setAnswers({ ...answers, [currentIdx]: idx })} />
                        </label>
                    ))}
                  </div>
              </div>
           </div>

           {/* Footer Buttons */}
           <div className="bg-gray-100 p-6 border-t-2 border-gray-300 flex flex-wrap justify-between items-center shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
              <div className="flex gap-4">
                 <button 
                    onClick={handleMarkReview}
                    className="bg-purple-700 text-white px-8 h-12 text-xs font-bold uppercase tracking-widest hover:bg-purple-800 transition-all shadow"
                 > Mark for Review & Next </button>
                 <button 
                    onClick={handleClear}
                    className="bg-white border-2 border-gray-300 text-gray-600 px-8 h-12 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-all shadow"
                 > Clear Response </button>
              </div>
              <div className="flex gap-4">
                 <button 
                    onClick={handleSaveNext}
                    className="bg-blue-700 text-white px-12 h-12 text-xs font-bold uppercase tracking-widest hover:bg-blue-800 transition-all shadow-xl"
                 >
                    {currentIdx === shuffledQuestions.length - 1 ? "Finish and Go To Summary" : "Save and Next"}
                 </button>
              </div>
           </div>
        </div>

        {/* Right Side: Sidebar Panel */}
        <div className="w-full md:w-80 bg-[#f8f9fa] flex flex-col border-l-2 border-gray-300 shrink-0">
           {/* Candidate Node */}
           <div className="p-8 bg-white border-b-2 border-gray-300 text-center">
              <div className="h-20 w-20 bg-gray-100 border-2 border-gray-200 mx-auto mb-4 flex items-center justify-center text-gray-400">
                 <User size={40} />
              </div>
              <p className="text-sm font-black text-gray-800 truncate uppercase">{user.name}</p>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Intern Profile node</p>
           </div>

           {/* Question Palette */}
           <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest border-b border-gray-100 pb-2">Entry Grid (1 - 50)</p>
              <div className="grid grid-cols-4 gap-2">
                 {shuffledQuestions.map((_, i) => {
                    const s = status[i];
                    return (
                        <button 
                           key={i}
                           onClick={() => setCurrentIdx(i)}
                           className={`h-11 w-11 text-[11px] font-black flex items-center justify-center transition-all border-2 ${
                               currentIdx === i ? 'ring-2 ring-blue-700 ring-offset-2 scale-105' : 'border-transparent'
                           }`}
                           style={{
                              backgroundColor: s === 'answered' ? COLORS.answered : s === 'not_answered' ? COLORS.not_answered : s === 'marked_for_review' ? COLORS.marked_for_review : '#fff',
                              color: s ? '#fff' : '#444'
                           }}
                        >
                           {i + 1}
                        </button>
                    );
                 })}
              </div>
           </div>

           {/* Legend */}
           <div className="p-8 bg-white border-t-2 border-gray-300 text-[10px] font-black uppercase space-y-4 shrink-0">
              <div className="flex items-center gap-4">
                 <div className="h-4 w-4 bg-white border-2 border-gray-300" />
                 <span className="text-gray-400">Not Visited</span>
              </div>
              <div className="flex items-center gap-4">
                 <div className="h-4 w-4 bg-[#ee7033]" />
                 <span className="text-gray-400">Not Answered</span>
              </div>
              <div className="flex items-center gap-4">
                 <div className="h-4 w-4 bg-[#2d8e36]" />
                 <span className="text-gray-400">Answered Node</span>
              </div>
              <div className="flex items-center gap-4">
                 <div className="h-4 w-4 bg-[#7355a6]" />
                 <span className="text-gray-400">Marked Review</span>
              </div>
           </div>
        </div>

      </main>

      {/* Footer Nav */}
      <footer className="h-10 bg-gray-200 border-t-2 border-gray-300 flex justify-between px-8 items-center shrink-0 relative z-20">
         <div className="flex gap-8">
             <button onClick={() => currentIdx > 0 && setCurrentIdx(prev => prev - 1)} className="text-[11px] font-black text-blue-800 hover:text-blue-900 flex items-center gap-2 uppercase">
                Previous Node
             </button>
             <button onClick={() => currentIdx < shuffledQuestions.length - 1 && setCurrentIdx(prev => prev + 1)} className="text-[11px] font-black text-blue-800 hover:text-blue-900 flex items-center gap-2 uppercase">
                Next Node
             </button>
         </div>
         <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em]">Student Forge System Terminal</p>
      </footer>

      {/* SUBMISSION SUMMARY - GOVT STYLES */}
      {showConfirm && (
          <div className="absolute inset-0 z-[100] bg-black/70 flex items-center justify-center p-6 backdrop-blur-sm">
             <div className="bg-white max-w-2xl w-full p-12 border-2 border-gray-300 shadow-2xl">
                <h3 className="text-2xl font-bold text-blue-800 border-b-4 border-blue-100 pb-4 mb-10 uppercase text-center">Exam Final Summary</h3>
                <table className="w-full border-2 border-gray-200 text-sm mb-12">
                   <tbody className="font-bold text-gray-700">
                      <tr><td className="p-5 border-b-2 border-r-2 bg-gray-50 uppercase text-xs">Total Questions</td><td className="p-5 border-b-2 text-center text-lg">{shuffledQuestions.length}</td></tr>
                      <tr><td className="p-5 border-b-2 border-r-2 text-green-700 uppercase text-xs">Answered Node</td><td className="p-5 border-b-2 text-center text-lg text-green-700">{summary.answered}</td></tr>
                      <tr><td className="p-5 border-b-2 border-r-2 text-purple-700 uppercase text-xs">Marked For Review</td><td className="p-5 border-b-2 text-center text-lg text-purple-700">{summary.marked}</td></tr>
                      <tr><td className="p-5 border-r-2 text-orange-700 uppercase text-xs">Not Answered / Remaining</td><td className="p-5 text-center text-lg text-orange-700">{summary.not_answered}</td></tr>
                   </tbody>
                </table>
                <p className="text-xs text-gray-500 font-black mb-12 text-center uppercase tracking-tighter">
                   Do you want to submit your final answers? No changes allowed after this.
                </p>
                <div className="flex gap-6">
                    <button onClick={() => setShowConfirm(false)} className="flex-1 h-16 bg-gray-100 border-2 border-gray-300 text-gray-700 font-black uppercase text-xs">No, Back to Exam</button>
                    <button onClick={handleSubmit} className="flex-1 h-16 bg-blue-700 text-white font-black uppercase text-xs border-2 border-blue-900 shadow-xl">Yes, Final Submit</button>
                </div>
             </div>
          </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; }
      `}</style>
    </div>
  );
}
