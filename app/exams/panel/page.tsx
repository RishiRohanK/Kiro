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
        handleSubmit(); // Auto-submit on forbidden keys as per policy
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
    if (answers[currentIdx] === undefined) {
        setStatus({ ...status, [currentIdx]: 'not_answered' });
    } else {
        setStatus({ ...status, [currentIdx]: 'answered' });
    }
    if (currentIdx < questions.length - 1) setCurrentIdx(prev => prev + 1);
  };

  const handleMarkReview = () => {
    setStatus({ ...status, [currentIdx]: 'marked_for_review' });
    if (currentIdx < questions.length - 1) setCurrentIdx(prev => prev + 1);
  };

  const handleClear = () => {
    setAnswers({ ...answers, [currentIdx]: undefined as any });
    setStatus({ ...status, [currentIdx]: 'not_answered' });
  };

  if (!user) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

  if (isSubmitted) {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 font-sans">
            <CheckCircle2 size={80} className="text-blue-600 mb-6" />
            <h1 className="text-3xl font-bold text-blue-900 mb-4">Exam Completed</h1>
            <p className="text-gray-500 mb-10 text-lg">Thanks for attempting the exam I given.</p>
            <button 
                onClick={() => { localStorage.removeItem("intern_user"); router.push("/exams"); }}
                className="bg-blue-600 text-white px-10 py-3 font-bold hover:bg-blue-700 active:scale-95 transition"
            >
                Secure Logout
            </button>
        </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col font-sans select-none relative">
      
      {/* 10 CROSS WATERMARKS */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] select-none flex flex-col justify-around rotate-[-25deg] scale-150 overflow-hidden">
          {[...Array(10)].map((_, i) => (
              <div key={i} className="flex justify-around text-4xl font-black tracking-[1em] whitespace-nowrap">
                  <span>STUDENT FORGE</span>
                  <span>STUDENT FORGE</span>
              </div>
          ))}
      </div>

      {/* Header - Government Style */}
      <header className="bg-blue-700 text-white px-6 py-3 flex justify-between items-center shadow-md relative z-10">
        <div>
           <h1 className="text-lg font-bold">Full Stack Development Exam 2026</h1>
           <p className="text-[10px] opacity-80 uppercase tracking-widest">Student Forge Technologies Private Limited</p>
        </div>
        <div className="bg-blue-800 px-4 py-2 border border-blue-500 text-sm flex items-center gap-3">
           <Timer size={16} className="text-blue-300" />
           <span className="font-bold">Time Left: {formatTime(timeLeft)}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row relative z-10">
        
        {/* Left Side: Question Area */}
        <div className="flex-1 flex flex-col border-r border-gray-300 bg-white">
           
           <div className="bg-gray-100 p-3 border-b border-gray-300 flex justify-between items-center">
              <span className="text-blue-800 font-bold text-xs uppercase">Question No: {currentIdx + 1}</span>
              <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold">
                 <span className="bg-white px-2 py-0.5 border border-gray-200">Type: MCQ</span>
                 <span className="bg-white px-2 py-0.5 border border-gray-200 text-green-600">Marks: +1.0</span>
                 <span className="bg-white px-2 py-0.5 border border-gray-200 text-red-600">Neg: 0.0</span>
              </div>
           </div>

           <div className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[calc(100vh-250px)]">
              <h2 className="text-lg font-bold text-gray-800 mb-10 leading-relaxed">
                 {q.question}
              </h2>

              <div className="space-y-4">
                 {q.options.map((opt, idx) => (
                    <label 
                       key={idx}
                       className={`flex items-center gap-4 p-4 border transition-all cursor-pointer group ${
                          answers[currentIdx] === idx ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'
                       }`}
                    >
                       <input 
                          type="radio" 
                          name="quiz"
                          className="h-5 w-5 accent-blue-700"
                          checked={answers[currentIdx] === idx}
                          onChange={() => setAnswers({ ...answers, [currentIdx]: idx })}
                       />
                       <span className="text-sm font-medium text-gray-700 leading-none">
                          <span className="mr-4 text-gray-400 font-bold">{String.fromCharCode(65 + idx)}.</span>
                          {opt}
                       </span>
                    </label>
                 ))}
              </div>
           </div>

           {/* Footer Buttons - Government Style */}
           <div className="bg-gray-100 p-4 border-t border-gray-300 flex flex-wrap justify-between gap-4">
              <div className="flex gap-2">
                 <button 
                    onClick={handleMarkReview}
                    className="bg-purple-600 text-white px-4 py-2 text-xs font-bold uppercase hover:bg-purple-700 shadow"
                 > Mark for Review & Next </button>
                 <button 
                    onClick={handleClear}
                    className="bg-white border border-gray-300 text-gray-600 px-4 py-2 text-xs font-bold uppercase hover:bg-gray-50 shadow"
                 > Clear Response </button>
              </div>
              <div className="flex gap-2">
                 <button 
                    onClick={handleSubmit}
                    className="bg-green-600 text-white px-8 py-2 text-xs font-bold uppercase hover:bg-green-700 shadow"
                 > Submit </button>
                 <button 
                    onClick={handleSaveNext}
                    className="bg-blue-700 text-white px-8 py-2 text-xs font-bold uppercase hover:bg-blue-800 shadow"
                 > Save & Next </button>
              </div>
           </div>

        </div>

        {/* Right Side: Sidebar Panel */}
        <div className="w-full md:w-80 bg-gray-50 flex flex-col border-l border-gray-300">
           
           {/* Candidate Profile Box */}
           <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-400">
                    <User size={24} />
                 </div>
                 <div className="overflow-hidden">
                    <p className="text-xs font-bold text-gray-800 truncate">{user.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Candidate</p>
                 </div>
              </div>
           </div>

           {/* Question Palette */}
           <div className="flex-1 p-6 overflow-y-auto">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-4 tracking-widest">Question Palette</p>
              <div className="grid grid-cols-5 gap-2">
                 {questions.map((_, i) => {
                    const s = status[i];
                    return (
                        <button 
                           key={i}
                           onClick={() => setCurrentIdx(i)}
                           className={`h-9 w-9 text-[10px] font-bold border transition-all flex items-center justify-center relative ${
                               currentIdx === i ? 'ring-2 ring-blue-700 ring-offset-1' : ''
                           }`}
                           style={{
                              backgroundColor: s === 'answered' ? COLORS.answered : s === 'not_answered' ? COLORS.not_answered : s === 'marked_for_review' ? COLORS.marked_for_review : '#fff',
                              color: s ? '#fff' : '#444',
                              borderColor: s ? 'transparent' : '#ddd'
                           }}
                        >
                           {i + 1}
                        </button>
                    );
                 })}
              </div>
           </div>

           {/* Legend */}
           <div className="p-6 bg-white border-t border-gray-300 text-[9px] font-bold uppercase space-y-3">
              <div className="flex items-center gap-3">
                 <div className="h-4 w-4 bg-white border border-gray-300" />
                 <span className="text-gray-400">Not Visited</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="h-4 w-4 bg-[#ee7033]" />
                 <span className="text-gray-400">Not Answered</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="h-4 w-4 bg-[#2d8e36]" />
                 <span className="text-gray-400">Answered</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="h-4 w-4 bg-[#7355a6]" />
                 <span className="text-gray-400">Marked for Review</span>
              </div>
           </div>

        </div>

      </main>

      {/* Footer Details */}
      <footer className="bg-gray-100 p-2 border-t border-gray-300 flex justify-between px-6 items-center flex-wrap gap-2 relative z-10">
         <div className="flex gap-4">
             <button onClick={() => currentIdx > 0 && setCurrentIdx(prev => prev - 1)} className="text-[10px] font-bold text-blue-800 hover:underline flex items-center gap-1">
                 <ChevronLeft size={12} /> BACK
             </button>
             <button onClick={() => currentIdx < 49 && setCurrentIdx(prev => prev + 1)} className="text-[10px] font-bold text-blue-800 hover:underline flex items-center gap-1">
                 NEXT <ChevronRight size={12} />
             </button>
         </div>
         <p className="text-[9px] text-gray-400 font-bold uppercase">Student Forge - Assessment Node v2.0</p>
      </footer>

    </div>
  );
}
