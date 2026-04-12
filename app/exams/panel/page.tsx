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
  not_answered: "#ee7033",
  answered: "#2d8e36",
  marked_for_review: "#7355a6",
};

export default function ExamPanelPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [status, setStatus] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours for UI/UX
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeTerminal, setActiveTerminal] = useState<string | null>(null);
  
  const [shuffledQuestions] = useState(() => [...EXAM_QUESTIONS].sort(() => Math.random() - 0.5));

  const violationsRef = useRef(0);
  const isSubmittedRef = useRef(false);

  const syncSession = useCallback(async (statusStr: string, finalScore: number | null, vCount: number, currentAnswers?: any, allowSystemOverride = false) => {
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
          answers: currentAnswers || answers,
          questionMapping: shuffledQuestions,
          allowSystemOverride,
          examType: "UI_UX" // Explicitly mark this track
        })
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Sync Error Details:", JSON.stringify(errorData, null, 2));
      }
    } catch (err) {
      console.error("Fetch Network error:", err);
    }
  }, [shuffledQuestions, answers]);

  const handleSubmit = useCallback(async () => {
    if (isSubmittedRef.current) return;
    isSubmittedRef.current = true;
    // Auto-submission uses system override to bypass exit key requirement
    await syncSession("SUBMITTED", null, violationsRef.current, answers, true);
    setIsSubmitted(true);
    setShowConfirm(false);
    if (typeof document !== "undefined" && document.exitFullscreen) document.exitFullscreen().catch(() => {});
  }, [answers, syncSession]);

  const [showExitModal, setShowExitModal] = useState(false);
  const [exitKeyInput, setExitKeyInput] = useState("");

  const handleGoToReview = useCallback(() => {
    setShowExitModal(true);
  }, []);

  const verifyExitKey = async () => {
    try {
        const res = await fetch("/api/exams/verify-exit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: exitKeyInput })
        });
        const data = await res.json();
        
        if (data.success) {
            localStorage.setItem("exam_submission", JSON.stringify({
                answers,
                status,
                shuffledQuestions,
                violations: violationsRef.current,
                exitKey: exitKeyInput // Store the key to pass it later for final submit
            }));
            router.push("/exams/review");
        } else {
            alert(data.error || "Invalid Assessment Key.");
        }
    } catch (e) {
        alert("Server error verifying key.");
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

    const handleVisibilityChange = () => {
      // DONT increment violations if user is in "Designing State" (activeTerminal is set)
      if (document.hidden && !isSubmittedRef.current && !activeTerminal) {
        violationsRef.current += 1;
        syncSession("STARTED", null, violationsRef.current);
        alert("Warning: Do not change tabs.");
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const forbidden = ["F5", "F11", "F12"];
      if (forbidden.includes(e.key) || (e.ctrlKey && ["r", "w", "t", "n"].includes(e.key.toLowerCase()))) {
        e.preventDefault();
        if (!activeTerminal) handleSubmit(); 
      }
    };

    const handleFullScreenExit = () => {
        // DONT trigger submission if user is designing (popups shift focus)
        if (!document.fullscreenElement && !isSubmittedRef.current && !activeTerminal) {
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
  }, [router, handleSubmit, syncSession, activeTerminal]);

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
    else handleGoToReview();
  };

  const handleMarkReview = () => {
    setStatus({ ...status, [currentIdx]: 'marked_for_review' });
    if (currentIdx < shuffledQuestions.length - 1) setCurrentIdx(prev => prev + 1);
    else handleGoToReview();
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

  const getTerminalUrl = () => {
    if (activeTerminal === 'figma') return 'https://www.figma.com';
    if (activeTerminal === 'canva') return 'https://www.canva.com';
    if (activeTerminal === 'adobe') return 'https://www.adobe.com/express/';
    return '';
  };

  return (
    <div className="h-screen bg-white flex flex-col select-none relative overflow-hidden font-sans">
      
      {/* Design Mode Active Overlay (Safe Popup Strategy) */}
      {activeTerminal && (
          <div className="fixed inset-0 z-[200] bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-10 text-center animate-in fade-in duration-500">
             <div className="max-w-xl space-y-8">
                <div className="relative inline-block">
                   <div className="absolute inset-0 bg-blue-100 animate-ping rounded-full opacity-20"></div>
                   <div className="h-24 w-24 bg-blue-600 text-white rounded-full flex items-center justify-center relative shadow-xl">
                      <Timer className="animate-pulse" size={40} />
                   </div>
                </div>
                <div className="space-y-3">
                   <h2 className="text-3xl font-black text-blue-900 uppercase tracking-tight">Studio Design Mode Active</h2>
                   <p className="text-zinc-500 font-medium text-sm leading-relaxed">
                      Security monitoring is temporarily **PAUSED** to allow you to use <span className="text-blue-600 font-bold uppercase">{activeTerminal}</span>.
                   </p>
                </div>
                <div className="bg-zinc-100 p-6 border border-zinc-200 rounded grid grid-cols-1 gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-left">
                   <p className="flex items-center gap-3"><span className="h-2 w-2 bg-emerald-500 rounded-full"></span> Time is still running: <span className="text-blue-600">{formatTime(timeLeft)}</span></p>
                   <p className="flex items-center gap-3"><span className="h-2 w-2 bg-emerald-500 rounded-full"></span> Return here to finish and submit your work.</p>
                </div>
                <button 
                   onClick={() => setActiveTerminal(null)}
                   className="w-full bg-blue-700 h-14 text-white font-black uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-blue-800 transition-all rounded"
                >
                   ← Return to Exam Terminal
                </button>
             </div>
          </div>
      )}
      
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
        <div className="flex items-center gap-5">
           <div className="h-10 w-10 bg-white rounded flex items-center justify-center shadow-inner overflow-hidden">
               <img src="https://img.freepik.com/free-vector/gradient-robot-logo-with-slogan_23-2148834418.jpg" className="h-full w-full object-cover" alt="Student Forge" />
           </div>
           <div>
              <h1 className="text-lg font-bold uppercase tracking-tight font-sans">UI/UX Exam (3:30 PM - 5:30 PM)</h1>
              <p className="text-[10px] font-bold opacity-70">Student Forge Technologies</p>
           </div>
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
                 <span className="text-emerald-600">Correct: +2</span>
                 <span className="text-zinc-400">No Negative Marking</span>
              </div>
           </div>
           <div className={`flex-1 overflow-y-auto custom-scrollbar flex ${q.type === 'practical' ? 'flex-row' : 'flex-col'} p-0`} data-lenis-prevent>
               {q.type === 'practical' ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-gray-50 border-2 border-dashed border-gray-200 m-8 rounded">
                     <AlertTriangle size={48} className="text-amber-500 mb-4" />
                     <h3 className="text-lg font-bold text-gray-800 uppercase">Section Paused</h3>
                     <p className="text-sm text-gray-500 max-w-sm">The practical section of this exam has been temporarily disabled. Please proceed to the next question.</p>
                  </div>
               ) : (
                  <div className="max-w-4xl mx-auto p-10 md:p-14">
                     {/* Visual Analysis Image */}
                     {q.image && (
                        <div className="mb-10 rounded-lg overflow-hidden border-4 border-zinc-100 shadow-xl bg-white p-2">
                           <div className="bg-zinc-800 text-white p-2 text-[9px] font-black uppercase tracking-[0.2em] mb-2 flex justify-between">
                              <span>Visual Reference Asset #{q.id}</span>
                              <span className="text-blue-400">UI/UX Assessment Node</span>
                           </div>
                           <img 
                              src={q.image} 
                              alt="Visual Analysis" 
                              className="w-full h-auto object-contain max-h-[500px]"
                           />
                        </div>
                     )}

                     <h2 className="text-xl font-bold text-gray-800 border-b pb-6 mb-8 leading-relaxed">
                        {q.question}
                     </h2>

                     <div className="grid grid-cols-1 gap-4">
                        {q.type === 'mcq' ? (
                           (q.options || []).map((opt: any, idx: number) => (
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
                           ))
                        ) : (
                           <div className="space-y-4">
                              <textarea 
                                 className="w-full h-80 p-6 border-2 border-gray-100 focus:border-blue-700 outline-none text-sm font-medium leading-relaxed custom-scrollbar whitespace-pre-wrap rounded resize-none"
                                 placeholder="Provide your detailed response here..."
                                 value={answers[currentIdx] || ''}
                                 onChange={(e) => setAnswers({ ...answers, [currentIdx]: e.target.value })}
                                 onPaste={(e) => { e.preventDefault(); alert("Paste is disabled for this section."); }}
                                 onCopy={(e) => e.preventDefault()}
                                 onCut={(e) => e.preventDefault()}
                                 onContextMenu={(e) => e.preventDefault()}
                              />
                              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                                 <div className="flex items-center gap-4">
                                    <span className="text-gray-400">Theory Response</span>
                                    <span className="text-zinc-300">|</span>
                                    <span className="text-gray-400">Security: Copy/Paste Disabled</span>
                                 </div>
                                 <div className="flex items-center gap-4">
                                    <span className={`px-2 py-0.5 border ${
                                       (answers[currentIdx] || '').toString().trim().split(/\s+/).filter(Boolean).length >= 180 
                                          ? 'border-emerald-200 text-emerald-600 bg-emerald-50' 
                                          : 'border-zinc-200 text-zinc-500'
                                    }`}>
                                       Words: {(answers[currentIdx] || '').toString().trim().split(/\s+/).filter(Boolean).length} / 200 approx.
                                    </span>
                                 </div>
                              </div>
                              <p className="text-[9px] text-zinc-400 italic">
                                 * Please use the keyboard only. Copying from external sources is strictly prohibited.
                              </p>
                           </div>
                        )}
                     </div>
                  </div>
               )}
            </div>

           {/* Buttons - Simple Look */}
           <div className="bg-gray-100 p-4 border-t border-gray-300 flex justify-between items-center shrink-0">
              <div className="flex gap-3">
                 <button onClick={handleMarkReview} className="bg-purple-700 text-white px-5 py-2 text-[10px] font-bold uppercase shadow">Mark Review</button>
                 <button onClick={handleClear} className="bg-white border border-gray-300 text-gray-600 px-5 py-2 text-[10px] font-bold uppercase">Clear Answer</button>
              </div>
              <div className="flex gap-3">
                 <button onClick={handleGoToReview} className="bg-red-600 text-white px-6 py-2 text-[10px] font-bold uppercase shadow">Submit / Review</button>
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


      {/* Exit Verification Modal */}
      {showExitModal && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
             <div className="bg-white max-w-md w-full p-10 border border-gray-300 shadow-2xl rounded">
                <h3 className="text-xl font-bold text-blue-900 border-b pb-4 mb-6 uppercase text-center tracking-tight">Security Check</h3>
                <p className="text-xs text-center text-gray-500 font-bold mb-8 uppercase tracking-widest">Type your 6-digit Unlock Key to exit</p>
                
                <input 
                   type="text" 
                   maxLength={6}
                   value={exitKeyInput}
                   onChange={(e) => setExitKeyInput(e.target.value)}
                   className="w-full h-16 text-center text-3xl font-black tracking-[0.5em] bg-gray-50 border-2 border-zinc-200 outline-none focus:border-blue-700 transition-all rounded mb-8"
                   placeholder="------"
                />

                <div className="flex gap-4">
                    <button onClick={() => setShowExitModal(false)} className="flex-1 h-12 bg-gray-100 text-gray-600 font-bold uppercase text-[10px] rounded hover:bg-gray-200">Cancel</button>
                    <button onClick={verifyExitKey} className="flex-1 h-12 bg-blue-700 text-white font-bold uppercase text-[10px] rounded shadow-lg hover:bg-blue-800 tracking-widest">Verify & Finish</button>
                </div>
                <p className="mt-6 text-[9px] text-gray-400 text-center font-bold uppercase italic">Note: If you have lost your key, contact the admin immediately.</p>
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
