"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ExamGuidelinesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
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

  useEffect(() => {
    const storedUser = localStorage.getItem("intern_user");
    if (!storedUser) {
      router.push("/exams");
    } else {
      setUser(JSON.parse(storedUser));
    }

    checkExamStatus();
    const interval = setInterval(checkExamStatus, 15000); 
    return () => clearInterval(interval);
  }, [router, checkExamStatus]);

  const startExam = async () => {
    if (!hasAgreed) {
        alert("Please click the check box to agree.");
        return;
    }

    const res = await fetch("/api/exams/status");
    const data = await res.json();
    if (!data.isActive) {
        alert("Exam not active yet. Wait for admin.");
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
            body: JSON.stringify({ userId: user.id })
        });

        router.push("/exams/panel");
    } catch (err) {
        router.push("/exams/panel");
    }
  };

  if (!user || loading) {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-700" />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      
      {/* Simple Header */}
      <header className="bg-blue-700 text-white p-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-xl font-bold">Full Stack Development Exam</h1>
            <p className="text-xs opacity-70">12-04-2026 | 10:00 AM to 11:00 AM</p>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Simple Details Table */}
          <div className="border border-gray-200">
             <div className="bg-gray-50 p-3 border-b border-gray-200 font-bold text-blue-800 text-xs uppercase">
                Candidate Details
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-200 divide-y md:divide-y-0">
                <div className="p-4">
                   <p className="text-[10px] text-gray-400 font-bold uppercase">Name</p>
                   <p className="text-sm font-bold text-gray-700">{user.name}</p>
                </div>
                <div className="p-4">
                   <p className="text-[10px] text-gray-400 font-bold uppercase">Intern ID</p>
                   <p className="text-sm font-bold text-gray-700">SF-{user.id?.slice(-8)}</p>
                </div>
             </div>
          </div>

          {/* Simple Instructions Section */}
          <div className="border border-gray-200">
             <div className="bg-gray-50 p-3 border-b border-gray-200 font-bold text-blue-800 text-xs uppercase">
                Instructions
             </div>
             <div className="p-6 md:p-8 space-y-6 text-sm text-gray-600 leading-relaxed">
                <ul className="list-decimal pl-5 space-y-4">
                   <li>Total time is 60 minutes for 50 questions.</li>
                   <li>The exam will run in full screen. Do not exit it.</li>
                   <li>Do not change tabs or open other applications.</li>
                   <li>Keys like F5, F12, and Ctrl keys are blocked.</li>
                   <li>Click "Save and Next" after every question.</li>
                   <li>Breaking any rules will stop your exam immediately.</li>
                </ul>
             </div>
          </div>

          {/* Agreement and Start */}
          <div className="space-y-6 pt-6 flex flex-col items-center">
             <label className="flex items-center gap-4 cursor-pointer">
                <input 
                   type="checkbox" 
                   className="h-5 w-5 accent-blue-700"
                   checked={hasAgreed}
                   onChange={(e) => setHasAgreed(e.target.checked)}
                />
                <span className="text-sm font-bold text-gray-600">I have read the rules and I am ready.</span>
             </label>

             <div className="text-center space-y-4">
                <button 
                   onClick={startExam}
                   disabled={!hasAgreed || !examActive}
                   className={`h-12 px-16 text-xs font-bold uppercase tracking-widest transition-all ${
                       (hasAgreed && examActive)
                       ? 'bg-blue-700 text-white shadow-lg' 
                       : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                   }`}
                >
                   {examActive ? 'Start Exam' : 'Wait for Admin'}
                </button>
                {!examActive && (
                   <p className="text-[10px] text-yellow-600 font-bold uppercase">Test is not active yet.</p>
                )}
             </div>
          </div>

        </div>
      </main>

      {/* Simple Footer */}
      <footer className="p-6 text-center text-xs text-gray-400 bg-gray-50 border-t border-gray-200">
        Student Forge Technologies Private Limited © 2026
      </footer>

    </div>
  );
}
