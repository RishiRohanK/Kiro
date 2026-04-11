"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Timer, 
  UserCircle,
  Send,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";

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

export default function ExamPanelPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(3600);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [violations, setViolations] = useState(0);
  
  const [questions] = useState(() => [...QUESTIONS_DATA].sort(() => Math.random() - 0.5));

  const violationsRef = useRef(0);
  const isSubmittedRef = useRef(false);

  const syncSession = useCallback(async (status: string, finalScore: number | null, vCount: number) => {
    const storedUser = localStorage.getItem("intern_user");
    if (!storedUser) return;
    const u = JSON.parse(storedUser);

    try {
      await fetch("/api/exams/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: u.id,
          status,
          score: finalScore,
          violations: vCount
        })
      });
    } catch (err) {
      console.error("Sync failure");
    }
  }, []);

  const handleSubmit = useCallback((status: string = "SUBMITTED") => {
    if (isSubmittedRef.current) return;
    isSubmittedRef.current = true;
    
    const finalScore = questions.reduce((acc, q, idx) => {
        return acc + (answers[idx] === q.correct ? 1 : 0);
    }, 0);

    syncSession(status, finalScore, violationsRef.current);
    setIsSubmitted(true);

    if (typeof document !== "undefined" && document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
    }
  }, [answers, syncSession, questions]);

  const checkAdminStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/exams/status");
      const data = await res.json();
      if (!data.isActive && !isSubmittedRef.current) {
        alert("Exam finished by admin.");
        handleSubmit("DISQUALIFIED");
      }
    } catch (err) {
      console.error("Link failure");
    }
  }, [handleSubmit]);

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
        alert("Rule Break: Do not switch windows.");
      }
    };

    const handleFullScreenChange = () => {
      if (!document.fullscreenElement && !isSubmittedRef.current) {
        alert("Exam closed because full screen was exited.");
        handleSubmit("DISQUALIFIED");
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const forbiddenKeys = ["F5", "F11", "F12"];
      if (forbiddenKeys.includes(e.key) || (e.ctrlKey && ["r", "w", "t", "n"].includes(e.key.toLowerCase()))) {
        e.preventDefault();
        alert("Key blocked.");
        handleSubmit("DISQUALIFIED");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("keydown", handleKeyDown);
    
    const statusInterval = setInterval(checkAdminStatus, 10000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("keydown", handleKeyDown);
      clearInterval(statusInterval);
    };
  }, [router, handleSubmit, checkAdminStatus, syncSession]);

  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) {
        if (timeLeft <= 0 && !isSubmitted) handleSubmit();
        return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, handleSubmit]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!user) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" />
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="flex justify-center">
             <div className="h-20 w-20 bg-blue-600 flex items-center justify-center text-white shadow-xl">
                <Send size={40} />
             </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-blue-900 uppercase tracking-tighter">Exam Submitted</h2>
            <p className="text-lg font-medium text-gray-400">
               Thanks for attempting the exam I given.
            </p>
          </div>
          <div className="pt-10 border-t border-gray-100 mt-10">
            <button 
                onClick={() => {
                    localStorage.removeItem("intern_user");
                    router.push("/exams");
                }} 
                className="h-12 w-full bg-gray-50 border border-gray-200 text-gray-500 font-bold hover:bg-gray-100 transition-all uppercase text-xs tracking-widest"
            >
                Secure Exit
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col relative overflow-hidden">
      
      {/* 10 CROSS WATERMARKS */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] select-none flex flex-col justify-around rotate-[-25deg] scale-150">
          {[...Array(10)].map((_, i) => (
              <div key={i} className="flex justify-around text-4xl font-black tracking-[1em] whitespace-nowrap">
                  <span>STUDENT FORGE</span>
                  <span>STUDENT FORGE</span>
              </div>
          ))}
      </div>

      <header className="h-14 bg-blue-600 text-white flex items-center justify-between px-6 border-b-2 border-blue-700 relative z-10">
         <div className="flex items-center gap-4 text-xs font-bold">
            <span className="bg-blue-800 px-3 py-1 font-black">EXAM NODE</span>
            <div className="flex items-center gap-2">
                <UserCircle size={14} className="text-blue-200" />
                <span>{user.name}</span>
                <span className="opacity-50">|</span>
                <span>SF-{user.id?.slice(-8)}</span>
            </div>
         </div>
         <div className="flex items-center gap-4 bg-blue-800 px-4 py-1 border border-blue-500">
            <Timer size={14} className="text-blue-300" />
            <span className="text-xs font-bold uppercase tracking-widest">Time: {formatTime(timeLeft)}</span>
         </div>
      </header>

      <main className="flex-1 p-4 md:p-8 relative z-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          <div className="lg:col-span-9">
            <div className="bg-white border border-gray-200 p-8 shadow-sm border-t-4 border-t-blue-600">
               
               <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-100">
                  <span className="text-xs font-black text-blue-600 uppercase tracking-tighter">Question {currentQuestion + 1} of 50</span>
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Type: MCQ | Marks: 1.0</span>
               </div>

               <div className="min-h-[250px]">
                 <h2 className="text-lg font-bold text-gray-800 mb-10 leading-relaxed">
                    {question.question}
                 </h2>

                 <div className="space-y-3">
                    {question.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => setAnswers({ ...answers, [currentQuestion]: idx })}
                        className={`w-full flex border transition-all overflow-hidden ${
                          answers[currentQuestion] === idx 
                          ? 'border-blue-600 bg-blue-50 shadow-md' 
                          : 'border-gray-100 hover:border-blue-200 bg-white'
                        }`}
                      >
                        <div className={`h-12 w-12 flex items-center justify-center font-black text-xs border-r ${
                            answers[currentQuestion] === idx ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-400 border-gray-100'
                        }`}>
                           {String.fromCharCode(65 + idx)}
                        </div>
                        <div className="flex-1 px-5 flex items-center text-sm font-medium text-gray-700">
                          {option}
                        </div>
                      </button>
                    ))}
                 </div>
               </div>

               <div className="mt-12 flex items-center justify-between pt-8 border-t border-gray-100 bg-gray-50/50 -mx-8 -mb-8 px-8 pb-8">
                  <button 
                    disabled={currentQuestion === 0}
                    onClick={() => setCurrentQuestion(prev => prev - 1)}
                    className="px-8 h-10 border border-gray-300 text-gray-600 text-[10px] font-black uppercase tracking-widest hover:bg-white disabled:opacity-30"
                  >
                    PREV
                  </button>
                  
                  <div className="flex gap-4">
                    <button 
                        onClick={() => setAnswers({ ...answers, [currentQuestion]: undefined as any })}
                        className="text-orange-600 text-[10px] font-black uppercase tracking-widest hover:underline"
                    >
                        Reset
                    </button>
                    
                    {currentQuestion < questions.length - 1 ? (
                        <button 
                        onClick={() => setCurrentQuestion(prev => prev + 1)}
                        className="bg-blue-600 text-white px-10 h-10 text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-700"
                        >
                        Next Item
                        </button>
                    ) : (
                        <button 
                        onClick={() => { if(confirm("Submit all answers secure?")) handleSubmit(); }}
                        className="bg-green-600 text-white px-10 h-10 text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-green-700"
                        >
                        Final Finish
                        </button>
                    )}
                  </div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xs font-black text-gray-400 mb-6 border-b border-gray-50 pb-2 uppercase tracking-tighter">MAP</h3>
                <div className="grid grid-cols-5 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {questions.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentQuestion(idx)}
                          className={`h-9 w-9 text-[10px] font-black border flex items-center justify-center transition-all ${
                            currentQuestion === idx 
                              ? 'border-blue-600 border-2 text-blue-600 bg-blue-50' 
                              : answers[idx] !== undefined 
                                ? 'bg-green-600 border-green-600 text-white' 
                                : 'bg-white border-gray-100 text-gray-300 hover:border-gray-200'
                          }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>

                <div className="mt-8 space-y-3 pt-6 border-t border-gray-100">
                   <div className="flex items-center gap-3">
                      <div className="h-3 w-3 bg-green-600" />
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Done</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="h-3 w-3 bg-blue-50 border border-blue-600" />
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Current</span>
                   </div>
                </div>
            </div>

            <div className="mt-6 text-center">
               <p className="text-[9px] text-gray-300 font-black uppercase tracking-[0.2em] leading-relaxed">
                  STUDENT FORGE<br/>ASSESSMENT TERMINAL
               </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
