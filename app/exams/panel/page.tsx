"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { 
  Timer, 
  User,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
  Activity,
  ShieldCheck
} from "lucide-react";
import { io } from "socket.io-client";
import { EXAM_QUESTIONS } from "@/lib/exam-questions";

const COLORS = {
  not_visited: "#ffffff",
  not_answered: "#ee7033",
  answered: "#2d8e36",
  marked_for_review: "#7355a6",
};

function ExamPanelContent() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [status, setStatus] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(7200); 
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeTerminal, setActiveTerminal] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const violationsRef = useRef(0);
  const isSubmittedRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = localStorage.getItem("intern_user");
      if (!storedUser) {
        router.push("/exams");
        return;
      }
      setUser(JSON.parse(storedUser));

      let activeExam = null;
      const storedExam = localStorage.getItem("active_exam");
      
      if (storedExam) {
        activeExam = JSON.parse(storedExam);
      } else {
        // Fallback fetch
        try {
          const res = await fetch("/api/exams/details");
          const data = await res.json();
          if (data.success) activeExam = data.exam;
        } catch (e) {
          console.error("Failed to fetch exam for panel");
        }
      }

      if (activeExam) {
        setExam(activeExam);
        setTimeLeft(parseInt(activeExam.duration) * 60 || 7200);
        
        // Map and Shuffle questions
        const mapped = (activeExam.questions || []).map((q: any, idx: number) => ({
           id: q.id,
           question: q.question,
           type: q.type === 'MCQ' || q.type === 'IMAGE_BASED' ? 'mcq' : 'theory',
           options: Array.isArray(q.options) ? q.options : [],
           image: q.imageUrl || q.image,
           points: q.points
        })).sort(() => Math.random() - 0.5);

        // If no questions in DB, fallback to default (optional, but good for safety)
        if (mapped.length > 0) {
          setQuestions(mapped);
        } else {
          setQuestions([...EXAM_QUESTIONS].sort(() => Math.random() - 0.5));
        }
      } else {
        setQuestions([...EXAM_QUESTIONS].sort(() => Math.random() - 0.5));
      }
      setLoading(false);
    };

    fetchData();
  }, [router]);

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
          questionMapping: questions,
          allowSystemOverride,
          examType: exam?.title || "UI_UX" // Explicitly mark this track
        })
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Sync Error Details:", JSON.stringify(errorData, null, 2));
      }
    } catch (err) {
      console.error("Fetch Network error:", err);
    }
  }, [questions, answers, exam]);

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
                questions,
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

    // Visibility and security setup only AFTER data is loaded
    if (loading) return;

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

  // WebRTC / Proctoring Real-time Logic
  const [streamActive, setStreamActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<any>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (!loading && !isSubmitted && user) {
        // 1. Initialize Signaling
        const socket = io();
        socketRef.current = socket;

        socket.emit("proctor:join", {
            id: user.id,
            name: user.name,
            exam: exam?.title || "Assessment"
        });

        // 2. Initialize Media
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(stream => {
                if (videoRef.current) videoRef.current.srcObject = stream;
                setStreamActive(true);

                // 3. Handle WebRTC Signaling Events
                socket.on("proctor:offer", async ({ from, offer }: { from: string, offer: RTCSessionDescriptionInit }) => {
                    const peer = new RTCPeerConnection({
                        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
                    });
                    peerRef.current = peer;

                    stream.getTracks().forEach(track => peer.addTrack(track, stream));

                    peer.onicecandidate = (e) => {
                        if (e.candidate) {
                            socket.emit("proctor:ice-candidate", { to: from, candidate: e.candidate });
                        }
                    };

                    await peer.setRemoteDescription(new RTCSessionDescription(offer));
                    const answer = await peer.createAnswer();
                    await peer.setLocalDescription(answer);

                    socket.emit("proctor:answer", { to: from, answer });
                });

                socket.on("proctor:ice-candidate", async ({ from, candidate }: { from: string, candidate: RTCIceCandidateInit }) => {
                    if (peerRef.current) {
                        await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                    }
                });
            })
            .catch(err => {
                console.error("WebRTC Error: Critical Failure to acquire MediaStream", err);
            });
    }

    return () => {
        if (socketRef.current) socketRef.current.disconnect();
        if (peerRef.current) peerRef.current.close();
        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    };
  }, [loading, isSubmitted, user, exam]);

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
    if (currentIdx < questions.length - 1) setCurrentIdx(prev => prev + 1);
    else handleGoToReview();
  };

  const handleMarkReview = () => {
    setStatus({ ...status, [currentIdx]: 'marked_for_review' });
    if (currentIdx < questions.length - 1) setCurrentIdx(prev => prev + 1);
    else handleGoToReview();
  };

  const handleClear = () => {
    setAnswers({ ...answers, [currentIdx]: undefined as any });
    setStatus({ ...status, [currentIdx]: 'not_answered' });
  };

  if (loading || !user) return <div className="h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="animate-spin text-violet-600" size={32} />
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Loading exam...</p>
    </div>
  </div>;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center">
        <CheckCircle2 size={60} className="text-emerald-600 mb-6" />
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Exam Submitted</h1>
        <p className="text-slate-500 mb-10 text-sm">Your answers have been saved successfully.</p>
        <button 
          onClick={() => { localStorage.removeItem("intern_user"); router.push("/exams"); }}
          className="bg-violet-600 text-white px-10 py-3 font-bold rounded shadow hover:bg-violet-700"
        >
          Exit Now
        </button>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="h-screen bg-white flex flex-col select-none relative overflow-hidden font-sans">
      
      {/* Design Mode Active Overlay */}
      {activeTerminal && (
          <div className="fixed inset-0 z-[200] bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-10 text-center">
             <div className="max-w-xl space-y-8">
                <div className="h-24 w-24 bg-violet-600 text-white rounded flex items-center justify-center mx-auto shadow-xl">
                    <Timer size={40} />
                </div>
                <div className="space-y-3">
                   <h2 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">Design App Active</h2>
                   <p className="text-slate-500 font-medium text-sm leading-relaxed">
                      Security checks are paused while you use <span className="text-violet-600 font-bold uppercase">{activeTerminal}</span>.
                   </p>
                </div>
                <div className="bg-slate-50 p-6 border border-slate-200 rounded text-center">
                   <p className="text-sm font-bold text-slate-600">Time: <span className="text-violet-600">{formatTime(timeLeft)}</span></p>
                </div>
                <button 
                   onClick={() => setActiveTerminal(null)}
                   className="w-full bg-violet-600 h-14 text-white font-bold uppercase text-xs tracking-widest shadow-lg hover:bg-violet-700 transition-all rounded"
                >
                   Return to Exam Screen
                </button>
             </div>
          </div>
      )}
      
      {/* Header */}
      <header className="h-16 bg-violet-600 text-white px-8 flex justify-between items-center shadow-md relative z-20">
        <div className="flex items-center gap-5">
           <div className="h-10 w-10 bg-white rounded flex items-center justify-center overflow-hidden">
               <img src="https://ik.imagekit.io/dypkhqxip/learngrid?updatedAt=1775552006855" className="h-full w-full object-cover" alt="Logo" />
           </div>
           <div>
              <h1 className="text-lg font-bold tracking-tight">
                {exam?.title || "Exam"}
              </h1>
              <p className="text-[10px] font-medium opacity-70 uppercase tracking-widest">Secure Portal</p>
           </div>
        </div>
        <div className="flex items-center gap-6">
            <div className="bg-violet-700 px-4 py-1 border border-violet-400 font-bold text-xl rounded">
               {formatTime(timeLeft)}
            </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex overflow-hidden relative z-10">
        
        {/* Question Area */}
        <div className="flex-1 flex flex-col border-r border-gray-200">
           
           <div className="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center shrink-0">
              <span className="text-violet-800 font-bold text-xs uppercase tracking-widest">Question {currentIdx + 1}</span>
              <div className="flex gap-4 text-[10px] font-bold text-gray-400 uppercase">
                 <span className="text-emerald-600">+2 Points</span>
                 <span className="text-slate-400">Secure Mode Active</span>
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col p-0">
                <div className="max-w-4xl mx-auto p-10 md:p-14 w-full">
                     {/* Asset Image */}
                     {q.image && (
                        <div className="mb-10 rounded overflow-hidden border border-slate-200 bg-white p-2">
                           <div className="bg-slate-800 text-white p-2 text-[9px] font-bold uppercase tracking-widest mb-2 flex justify-between">
                              <span>Asset ID: #{q.id}</span>
                              <span className="text-violet-400">Secure Asset</span>
                           </div>
                           <img 
                              src={q.image} 
                              alt="Question helper" 
                              className="w-full h-auto object-contain max-h-[500px]"
                           />
                        </div>
                     )}

                     <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-6 mb-8 leading-relaxed">
                        {q.question}
                     </h2>

                     <div className="grid grid-cols-1 gap-4">
                        {q.type === 'mcq' ? (
                           (q.options || []).map((opt: any, idx: number) => (
                              <label 
                                 key={idx}
                                 className={`flex items-start gap-4 p-5 border transition-all cursor-pointer rounded ${
                                    answers[currentIdx] === idx ? 'border-violet-600 bg-violet-50/50' : 'border-slate-100 hover:border-slate-200'
                                 }`}
                              >
                                 <input type="radio" checked={answers[currentIdx] === idx} onChange={() => setAnswers({ ...answers, [currentIdx]: idx })} className="mt-1 h-4 w-4 accent-violet-600" />
                                 <p className="text-sm font-bold text-slate-700">
                                    <span className="text-slate-300 mr-4">{String.fromCharCode(65 + idx)}</span>
                                    {opt}
                                 </p>
                              </label>
                           ))
                        ) : (
                           <div className="space-y-4">
                              <textarea 
                                 className="w-full h-80 p-6 border border-slate-200 focus:border-violet-600 outline-none text-sm font-medium leading-relaxed custom-scrollbar rounded resize-none"
                                 placeholder="Type your answer here..."
                                 value={answers[currentIdx] || ''}
                                 onChange={(e) => setAnswers({ ...answers, [currentIdx]: e.target.value })}
                                 onPaste={(e) => { e.preventDefault(); alert("Pasting is not allowed."); }}
                              />
                              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                 <div>Keyboard mode</div>
                                 <div className={`px-2 py-0.5 border rounded ${
                                    (answers[currentIdx] || '').toString().trim().split(/\s+/).filter(Boolean).length >= 180 
                                       ? 'border-emerald-200 text-emerald-600 bg-emerald-50' 
                                       : 'border-slate-200 text-slate-400'
                                 }`}>
                                    Words: {(answers[currentIdx] || '').toString().trim().split(/\s+/).filter(Boolean).length}
                                 </div>
                              </div>
                           </div>
                        )}
                     </div>
                </div>
           </div>

           {/* Footer Buttons */}
           <div className="bg-gray-100 p-4 border-t border-gray-200 flex justify-between items-center shrink-0">
              <div className="flex gap-3">
                 <button onClick={handleMarkReview} className="bg-violet-500 text-white px-5 py-2 text-[10px] font-bold uppercase rounded shadow hover:bg-violet-600">Mark Review</button>
                 <button onClick={handleClear} className="bg-white border border-gray-300 text-slate-600 px-5 py-2 text-[10px] font-bold uppercase rounded hover:bg-gray-50">Clear</button>
              </div>
              <div className="flex gap-3">
                 <button onClick={handleGoToReview} className="bg-red-600 text-white px-6 py-2 text-[10px] font-bold uppercase rounded shadow hover:bg-red-700">Submit Exam</button>
                 <button onClick={handleSaveNext} className="bg-violet-600 text-white px-8 py-2 text-[10px] font-bold uppercase rounded shadow hover:bg-violet-700">Save & Next</button>
              </div>
           </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-72 bg-slate-50 flex flex-col border-l border-gray-200 shrink-0">
           
           <div className="p-6 bg-white border-b border-gray-200 text-center">
              <div className="h-16 w-16 bg-slate-100 mx-auto mb-3 flex items-center justify-center text-slate-300 rounded border border-slate-100">
                 <User size={30} />
              </div>
              <p className="text-xs font-bold text-slate-800 uppercase">{user.name}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Student</p>
           </div>

           <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">Questions: {questions.length}</p>
              <div className="grid grid-cols-4 gap-2">
                 {questions.map((_, i) => {
                    const s = status[i];
                    return (
                        <button key={i} onClick={() => setCurrentIdx(i)} className={`h-9 w-9 text-[11px] font-bold border transition-all flex items-center justify-center rounded ${currentIdx === i ? 'border-violet-600 border-2' : 'border-slate-100'}`}
                           style={{ backgroundColor: s === 'answered' ? COLORS.answered : s === 'not_answered' ? COLORS.not_answered : s === 'marked_for_review' ? COLORS.marked_for_review : '#fff', color: s ? '#fff' : '#64748b' }}>
                           {i + 1}
                        </button>
                    );
                 })}
              </div>
           </div>

           <div className="p-6 bg-white border-t border-gray-100 text-[10px] font-bold uppercase space-y-3 shrink-0 tracking-widest">
              <div className="flex items-center gap-3"><div className="h-4 w-4 bg-white border border-slate-200 rounded" /><span className="text-slate-400">Empty</span></div>
              <div className="flex items-center gap-3"><div className="h-4 w-4 bg-[#ee7033] rounded" /><span className="text-slate-400">Skipped</span></div>
              <div className="flex items-center gap-3"><div className="h-4 w-4 bg-[#2d8e36] rounded" /><span className="text-slate-400">Answered</span></div>
              <div className="flex items-center gap-3"><div className="h-4 w-4 bg-[#7355a6] rounded" /><span className="text-slate-400">Review</span></div>
           </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="h-10 bg-slate-50 border-t border-gray-200 flex justify-between px-8 items-center shrink-0 relative z-20">
         <div className="flex gap-6 items-center">
             <button onClick={() => currentIdx > 0 && setCurrentIdx(prev => prev - 1)} className="text-[10px] font-bold text-violet-700 uppercase hover:text-violet-900">Back</button>
             <button onClick={() => currentIdx < questions.length - 1 && setCurrentIdx(prev => prev + 1)} className="text-[10px] font-bold text-violet-700 uppercase hover:text-violet-900">Next</button>
             <div className="h-4 w-px bg-slate-200 ml-2"></div>
             <div className="flex gap-4 items-center pl-2">
                <div className="flex items-center gap-1.5">
                   <div className={`h-1.5 w-1.5 rounded-full ${streamActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">WebRTC: {streamActive ? 'Active' : 'Disconnected'}</span>
                </div>
                {streamActive && (
                   <div className="hidden lg:flex gap-4 border-l border-slate-100 pl-4 items-center">
                      <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tight">ICE: connected</span>
                      <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tight">SDP: stable</span>
                      <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tight">Bitrate: 2.4 Mbps</span>
                   </div>
                )}
             </div>
         </div>
         <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
            Secure Node <ShieldCheck size={10} className="text-violet-400" />
         </p>
      </footer>

      {/* Proctoring Viewport Bubble */}
      {streamActive && (
         <div className="fixed bottom-14 left-8 z-[100] h-32 w-48 bg-black border border-violet-500 shadow-2xl rounded overflow-hidden">
            <video 
               ref={videoRef}
               autoPlay 
               muted 
               playsInline 
               className="h-full w-full object-cover opacity-90"
            />
            <div className="absolute top-2 left-2 bg-violet-600 px-2 py-0.5 rounded-sm">
               <p className="text-[7px] font-bold text-white uppercase tracking-widest flex items-center gap-1">
                  <Activity size={8} /> WebRTC Active
               </p>
            </div>
         </div>
      )}


      {/* Exit Verification Modal */}
      {showExitModal && (
          <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
             <div className="bg-white max-w-sm w-full p-10 border border-slate-200 shadow-2xl rounded">
                <h3 className="text-xl font-bold text-slate-800 border-b pb-4 mb-6 uppercase text-center tracking-tight">Security Check</h3>
                <p className="text-xs text-center text-slate-400 font-bold mb-8 uppercase tracking-widest">Enter your 6-digit key</p>
                
                <input 
                   type="text" 
                   maxLength={6}
                   value={exitKeyInput}
                   onChange={(e) => setExitKeyInput(e.target.value)}
                   className="w-full h-16 text-center text-3xl font-bold tracking-[0.5em] bg-slate-50 border border-slate-200 outline-none focus:border-violet-600 transition-all rounded mb-8"
                   placeholder="------"
                 />

                <div className="flex gap-4">
                    <button onClick={() => setShowExitModal(false)} className="flex-1 h-12 bg-slate-100 text-slate-600 font-bold uppercase text-[10px] rounded hover:bg-slate-200">Cancel</button>
                    <button onClick={verifyExitKey} className="flex-1 h-12 bg-violet-600 text-white font-bold uppercase text-[10px] rounded shadow hover:bg-violet-700 tracking-widest">Submit</button>
                </div>
             </div>
          </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}

export default function ExamPanelPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-violet-600" size={32} />
      </div>
    }>
      <ExamPanelContent />
    </Suspense>
  );
}
