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

const QUESTIONS_DATA = [
  { id: 1, question: "What does HTML stand for?", options: ["Hyper Trainer Marking Language", "Hyper Text Markup Language", "Hyper Text Marketing Language", "High Text Markup Language"], correct: 1 },
  { id: 2, question: "Which of the following is a frontend language?", options: ["Java", "Python", "JavaScript", "SQL"], correct: 2 },
  { id: 3, question: "Which is used for styling web pages?", options: ["HTML", "CSS", "Node.js", "MongoDB"], correct: 1 },
  { id: 4, question: "What is Node.js mainly used for?", options: ["Designing UI", "Backend development", "Database storage", "Styling"], correct: 1 },
  { id: 5, question: "Which database is NoSQL?", options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"], correct: 2 },
  { id: 6, question: "What is an API?", options: ["Design tool", "Connects frontend and backend", "Database", "Programming language"], correct: 1 },
  { id: 7, question: "Which HTTP method is used to fetch data?", options: ["POST", "GET", "PUT", "DELETE"], correct: 1 },
  { id: 8, question: "Which HTTP method is used to send data?", options: ["GET", "POST", "FETCH", "CONNECT"], correct: 1 },
  { id: 9, question: "What is React?", options: ["Database", "Backend framework", "Frontend library", "Programming language"], correct: 2 },
  { id: 10, question: "Which is used for backend routing?", options: ["React", "Express.js", "CSS", "Bootstrap"], correct: 1 },
  { id: 11, question: "What does JSON stand for?", options: ["JavaScript Object Notation", "Java Source Open Network", "Java Standard Object Name", "None"], correct: 0 },
  { id: 12, question: "Which is a version control system?", options: ["Git", "Docker", "AWS", "Linux"], correct: 0 },
  { id: 13, question: "What is the purpose of a database?", options: ["Styling", "Store and manage data", "Build UI", "Run code"], correct: 1 },
  { id: 14, question: "What is a responsive website?", options: ["Fast website", "Works on all devices", "Only mobile", "Only desktop"], correct: 1 },
  { id: 15, question: "What is JWT used for?", options: ["Styling", "Authentication", "Database", "Hosting"], correct: 1 },
  { id: 16, question: "What does CRUD stand for?", options: ["Create, Read, Update, Delete", "Copy, Run, Update, Delete", "Create, Run, Use, Deploy", "None"], correct: 0 },
  { id: 17, question: "Which tool is used to test APIs?", options: ["Figma", "Postman", "Canva", "VS Code"], correct: 1 },
  { id: 18, question: "Which is used to deploy frontend apps?", options: ["Vercel", "MySQL", "Java", "C++"], correct: 0 },
  { id: 19, question: "What is middleware in Express?", options: ["Database", "Function between request and response", "UI component", "CSS tool"], correct: 1 },
  { id: 20, question: "What is the main role of backend?", options: ["Design UI", "Handle logic and data", "Styling", "Animation"], correct: 1 },
  { id: 21, question: "Which of the following is a frontend framework/library?", options: ["Django", "Flask", "React", "Spring"], correct: 2 },
  { id: 22, question: "What is REST API?", options: ["UI design pattern", "Communication between systems using HTTP", "Database", "Programming language"], correct: 1 },
  { id: 23, question: "Which command initializes a Git repository?", options: ["git start", "git init", "git create", "git new"], correct: 1 },
  { id: 24, question: "What is the use of CSS Flexbox?", options: ["Database management", "Layout design and alignment", "Backend routing", "API testing"], correct: 1 },
  { id: 25, question: "What is the purpose of environment variables?", options: ["Styling", "Store sensitive/config data", "UI design", "Animation"], correct: 1 },
  { id: 26, question: "Which of the following is NOT part of the MERN stack?", options: ["MongoDB", "Express", "React", "Django"], correct: 3 },
  { id: 27, question: "What happens when you call setState in React?", options: ["Reloads page", "Updates UI and re-renders component", "Deletes state", "Stops execution"], correct: 1 },
  { id: 28, question: "Which HTTP status code means “Not Found”?", options: ["200", "201", "404", "500"], correct: 2 },
  { id: 29, question: "What is the purpose of useEffect in React?", options: ["Styling", "Handling side effects (API calls, etc.)", "Routing", "State creation"], correct: 1 },
  { id: 30, question: "Which method is idempotent?", options: ["POST", "GET", "PATCH", "CONNECT"], correct: 1 },
  { id: 31, question: "What does middleware do in Express?", options: ["Handles UI", "Processes request before response", "Stores data", "Build frontend"], correct: 1 },
  { id: 32, question: "What is CORS?", options: ["Database system", "Security feature for cross-origin requests", "CSS tool", "API method"], correct: 1 },
  { id: 33, question: "Which database query finds all documents in MongoDB?", options: ["findAll()", "select()", "find()", "get()"], correct: 2 },
  { id: 34, question: "What is the purpose of package.json?", options: ["UI design", "Stores dependencies and scripts", "Backend logic", "CSS styles"], correct: 1 },
  { id: 35, question: "Which command installs dependencies?", options: ["npm start", "npm install", "npm run", "npm build"], correct: 1 },
  { id: 36, question: "What is JWT mainly used for?", options: ["Styling", "Authentication & authorization", "Database", "Deployment"], correct: 1 },
  { id: 37, question: "What is the role of a controller in backend?", options: ["UI rendering", "Handles request logic", "Styling", "Database schema"], correct: 1 },
  { id: 38, question: "Which hook is used for state in React?", options: ["useFetch", "useState", "useAPI", "useRender"], correct: 1 },
  { id: 39, question: "What is the purpose of .env file?", options: ["UI design", "Store config & secret keys", "Database schema", "Routing"], correct: 1 },
  { id: 40, question: "Which method updates data in REST API?", options: ["GET", "POST", "PUT", "FETCH"], correct: 2 },
  { id: 41, question: "What is asynchronous programming?", options: ["Sequential execution", "Non-blocking execution", "CSS styling", "Database query"], correct: 1 },
  { id: 42, question: "Which of the following handles routing in React apps?", options: ["Express", "React Router", "MongoDB", "Node"], correct: 1 },
  { id: 43, question: "What is the purpose of map() in JavaScript?", options: ["Store data", "Loop and transform array", "API call", "CSS styling"], correct: 1 },
  { id: 44, question: "What is a REST API principle?", options: ["Stateful", "Stateless", "Dynamic", "Secure"], correct: 1 },
  { id: 45, question: "Which command starts a Node server?", options: ["node app.js", "run app", "start node", "npm node"], correct: 0 },
  { id: 46, question: "What is the purpose of await?", options: ["Stop program", "Wait for async operation", "Loop", "Style UI"], correct: 1 },
  { id: 47, question: "Which of the following improves performance in React?", options: ["useState", "useMemo", "useCSS", "useHTML"], correct: 1 },
  { id: 48, question: "What is a schema in MongoDB?", options: ["UI design", "Structure of data", "API", "CSS"], correct: 1 },
  { id: 49, question: "What is deployment?", options: ["Writing code", "Running app on server for users", "Debugging", "Styling"], correct: 1 },
  { id: 50, question: "What is error handling used for?", options: ["Styling", "Handling unexpected issues in code", "Routing", "Database"], correct: 1 }
];

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
  
  // Shuffled questions
  const [questions] = useState(() => [...QUESTIONS_DATA].sort(() => Math.random() - 0.5));

  const violationsRef = useRef(0);
  const isSubmittedRef = useRef(false);

  const syncSession = useCallback(async (statusStr: string, finalScore: number | null, vCount: number) => {
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
          violations: vCount
        })
      });
    } catch (err) {
      console.error("Sync error");
    }
  }, []);

  const handleSubmit = useCallback(() => {
    if (isSubmittedRef.current) return;
    isSubmittedRef.current = true;
    
    const finalScore = questions.reduce((acc, q, idx) => {
        return acc + (answers[idx] === q.correct ? 1 : 0);
    }, 0);

    syncSession("SUBMITTED", finalScore, violationsRef.current);
    setIsSubmitted(true);
    setShowConfirm(false);

    if (typeof document !== "undefined" && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
    }
  }, [answers, syncSession, questions]);

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
    
    if (currentIdx < questions.length - 1) {
        setCurrentIdx(prev => prev + 1);
    } else {
        setShowConfirm(true);
    }
  };

  const handleMarkReview = () => {
    setStatus({ ...status, [currentIdx]: 'marked_for_review' });
    if (currentIdx < questions.length - 1) {
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
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Exam Completed</h1>
            <p className="text-gray-500 mb-10 text-lg">Thanks for attempting the exam I given.</p>
            <button 
                onClick={() => { localStorage.removeItem("intern_user"); router.push("/exams"); }}
                className="bg-blue-600 text-white px-12 py-4 font-bold hover:bg-blue-700 active:scale-95 transition shadow-lg"
            >
                Secure Exit
            </button>
        </div>
    );
  }

  const q = questions[currentIdx];
  const summary = {
    answered: Object.values(status).filter(s => s === 'answered').length,
    marked: Object.values(status).filter(s => s === 'marked_for_review').length,
    not_answered: questions.length - Object.values(status).filter(s => s === 'answered').length - Object.values(status).filter(s => s === 'marked_for_review').length
  };

  return (
    <div className="h-screen bg-[#f8f9fa] flex flex-col font-sans select-none relative overflow-hidden">
      
      {/* IMPROVED DIAGONAL WATERMARKS */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.04] select-none flex flex-col justify-around rotate-[-30deg] scale-125">
          {[...Array(12)].map((_, i) => (
              <div key={i} className="flex justify-around text-5xl font-black tracking-[1.5em] whitespace-nowrap py-10">
                  <span>STUDENT FORGE</span>
                  <span>STUDENT FORGE</span>
                  <span>STUDENT FORGE</span>
              </div>
          ))}
      </div>

      {/* Header - Industrial Style */}
      <header className="h-16 bg-blue-700 text-white px-8 flex justify-between items-center shadow-lg relative z-20">
        <div className="flex flex-col">
           <h1 className="text-base font-bold tracking-tight">Full Stack Development Exam 2026</h1>
           <p className="text-[9px] opacity-70 uppercase font-black">Student Forge Technologies Pvt Ltd</p>
        </div>
        <div className="flex items-center gap-6">
            <div className="bg-blue-800 px-5 py-2 border border-blue-500/50 flex items-center gap-3 rounded-none">
               <Timer size={18} className="text-blue-200" />
               <span className="font-mono font-black text-lg">{formatTime(timeLeft)}</span>
            </div>
            <button 
                onClick={() => setShowConfirm(true)}
                className="bg-red-600 hover:bg-red-700 h-10 px-6 text-[11px] font-black uppercase tracking-widest transition-all shadow-lg hidden md:block"
            >
                Final Submit
            </button>
        </div>
      </header>

      {/* Main Content Area - FIXED HEIGHTS FOR SCROLLING */}
      <main className="flex-1 flex overflow-hidden relative z-10">
        
        {/* Left Side: Question Area */}
        <div className="flex-1 flex flex-col border-r border-gray-300 bg-white">
           
           <div className="bg-gray-50 p-4 border-b border-gray-300 flex justify-between items-center shrink-0">
              <span className="text-blue-800 font-black text-xs uppercase tracking-tighter">Item Node: {currentIdx + 1} of 50</span>
              <div className="flex items-center gap-5 text-[10px] text-gray-400 font-black uppercase">
                 <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /> Correct: +1.0</span>
                 <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Negative: 0.0</span>
              </div>
           </div>

           <div className="flex-1 p-10 md:p-14 overflow-y-auto scroll-smooth custom-scrollbar">
              <div className="max-w-4xl mx-auto space-y-12">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed border-b border-gray-100 pb-10">
                     {q.question}
                  </h2>

                  <div className="grid grid-cols-1 gap-5">
                    {q.options.map((opt, idx) => (
                        <label 
                           key={idx}
                           className={`flex items-start gap-6 p-6 border-2 transition-all cursor-pointer group rounded-none ${
                              answers[currentIdx] === idx ? 'border-blue-600 bg-blue-50/50 shadow-md ring-1 ring-blue-600' : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50/50'
                           }`}
                        >
                           <div className={`mt-1 h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                               answers[currentIdx] === idx ? 'border-blue-700 bg-blue-700' : 'border-gray-300 group-hover:border-gray-400'
                           }`}>
                               {answers[currentIdx] === idx && <div className="h-2 w-2 bg-white rounded-full" />}
                           </div>
                           <div className="flex-1">
                               <p className="text-sm md:text-base font-bold text-gray-700 leading-tight">
                                  <span className="text-gray-400 mr-4 font-black">{String.fromCharCode(65 + idx)}.</span>
                                  {opt}
                               </p>
                           </div>
                           <input 
                              type="radio" 
                              name="quiz"
                              className="hidden"
                              checked={answers[currentIdx] === idx}
                              onChange={() => setAnswers({ ...answers, [currentIdx]: idx })}
                           />
                        </label>
                    ))}
                  </div>
              </div>
           </div>

           {/* Footer Buttons - Industrial Fixed Bottom */}
           <div className="bg-gray-100 p-5 border-t border-gray-300 flex flex-wrap justify-between gap-4 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
              <div className="flex gap-3">
                 <button 
                    onClick={handleMarkReview}
                    className="bg-purple-600 text-white px-6 h-12 text-[11px] font-black uppercase tracking-widest hover:bg-purple-700 transition-all shadow"
                 > Mark for Review </button>
                 <button 
                    onClick={handleClear}
                    className="bg-white border border-gray-300 text-gray-500 px-6 h-12 text-[11px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow"
                 > Clear Entry </button>
              </div>
              <div className="flex gap-3">
                 <button 
                    onClick={handleSaveNext}
                    className="bg-blue-700 text-white px-10 h-12 text-[11px] font-black uppercase tracking-widest hover:bg-blue-800 transition-all shadow-xl"
                 >
                    {currentIdx === 49 ? "Finish Exam" : "Save and Next"}
                 </button>
              </div>
           </div>
        </div>

        {/* Right Side: Sidebar Panel - SCROLLABLE PALETTE */}
        <div className="w-full md:w-80 bg-[#f8f9fa] flex flex-col border-l border-gray-300 shrink-0">
           
           {/* Candidate Node */}
           <div className="p-8 bg-white border-b border-gray-200 flex items-center gap-4">
              <div className="h-14 w-14 bg-blue-50 border-2 border-blue-100 flex items-center justify-center text-blue-600 rounded-none transform rotate-3">
                 <User size={28} />
              </div>
              <div className="overflow-hidden">
                 <p className="text-sm font-black text-gray-800 truncate">{user.name}</p>
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Assessment Node</p>
              </div>
           </div>

           {/* Question Palette - SCROLLABLE */}
           <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-6 tracking-widest border-b border-gray-100 pb-2">Entry Grid (1 - 50)</p>
              <div className="grid grid-cols-4 gap-3">
                 {questions.map((_, i) => {
                    const s = status[i];
                    return (
                        <button 
                           key={i}
                           onClick={() => setCurrentIdx(i)}
                           className={`h-10 w-10 text-[11px] font-black flex items-center justify-center transition-all border-2 ${
                               currentIdx === i ? 'scale-110 shadow-lg border-blue-700' : 'border-transparent'
                           }`}
                           style={{
                              backgroundColor: s === 'answered' ? COLORS.answered : s === 'not_answered' ? COLORS.not_answered : s === 'marked_for_review' ? COLORS.marked_for_review : '#fff',
                              color: s ? '#fff' : '#ced4da',
                              boxShadow: currentIdx === i ? '0 0 10px rgba(26,95,122,0.2)' : 'none'
                           }}
                        >
                           {i + 1}
                        </button>
                    );
                 })}
              </div>
           </div>

           {/* Legend - Fixed Bottom of Sidebar */}
           <div className="p-8 bg-white border-t border-gray-300 text-[10px] font-black uppercase space-y-4 shrink-0">
              <div className="flex items-center gap-4">
                 <div className="h-4 w-4 bg-white border-2 border-gray-200" />
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
                 <span className="text-gray-400">Review Priority</span>
              </div>
           </div>

        </div>

      </main>

      {/* FOOTER NAV */}
      <footer className="h-10 bg-gray-200 border-t border-gray-300 flex justify-between px-8 items-center shrink-0 relative z-20">
         <div className="flex gap-4">
             <button onClick={() => currentIdx > 0 && setCurrentIdx(prev => prev - 1)} className="text-[10px] font-black text-blue-800 hover:text-blue-900 flex items-center gap-2 uppercase tracking-widest">
                 <ChevronLeft size={14} /> Back
             </button>
             <button onClick={() => currentIdx < 49 && setCurrentIdx(prev => prev + 1)} className="text-[10px] font-black text-blue-800 hover:text-blue-900 flex items-center gap-2 uppercase tracking-widest">
                 Next <ChevronRight size={14} />
             </button>
         </div>
         <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.3em]">Student Forge System Terminal</p>
      </footer>

      {/* CONFIRMATION OVERLAY */}
      {showConfirm && (
          <div className="absolute inset-0 z-[100] bg-black/60 flex items-center justify-center p-6 backdrop-blur-sm">
             <div className="bg-white max-w-lg w-full p-10 border-t-4 border-blue-700 shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 bg-blue-50 text-blue-700 flex items-center justify-center">
                        <AlertTriangle size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 leading-tight">Exam Review & Submit</h3>
                        <p className="text-xs text-gray-400 font-black uppercase tracking-widest">Final Validation Node</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="p-4 bg-gray-50 border-l-4 border-green-500">
                        <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Answered</p>
                        <p className="text-2xl font-black text-green-700">{summary.answered}</p>
                    </div>
                    <div className="p-4 bg-gray-50 border-l-4 border-purple-500">
                        <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Marked Review</p>
                        <p className="text-2xl font-black text-purple-700">{summary.marked}</p>
                    </div>
                    <div className="p-4 bg-gray-50 border-l-4 border-orange-500 col-span-2">
                        <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Not Entered / Current</p>
                        <p className="text-2xl font-black text-orange-700">{summary.not_answered}</p>
                    </div>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed font-medium mb-10 text-center">
                   Once submitted, you cannot change any answers. The system will record your final response node.
                </p>

                <div className="flex gap-4">
                    <button 
                        onClick={() => setShowConfirm(false)}
                        className="flex-1 h-14 border-2 border-gray-200 text-gray-600 font-black uppercase text-xs tracking-widest hover:bg-gray-50 transition-all"
                    > Back to Exam </button>
                    <button 
                        onClick={handleSubmit}
                        className="flex-1 h-14 bg-green-600 text-white font-black uppercase text-xs tracking-widest hover:bg-green-700 transition-all shadow-xl"
                    > Submit My Results </button>
                </div>
             </div>
          </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #dee2e6;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ced4da;
        }
      `}</style>
    </div>
  );
}
