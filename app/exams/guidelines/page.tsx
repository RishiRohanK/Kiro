"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

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
    const res = await fetch("/api/exams/status");
    const data = await res.json();
    if (!data.isActive) {
        alert("The exam is locked. Wait for the admin to start.");
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
            <Loader2 className="animate-spin text-blue-600" />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 p-6">
      <div className="max-w-3xl mx-auto border border-gray-100 shadow-sm overflow-hidden">
        
        <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
            <h1 className="text-2xl font-bold uppercase tracking-tight">Exam Rules</h1>
            <div className="text-right">
                <p className="text-sm font-bold">{user.name}</p>
                <p className="text-[10px] opacity-70 font-bold uppercase tracking-widest">SF-{user.id?.slice(-8)}</p>
            </div>
        </div>

        {!examActive && (
            <div className="bg-blue-50 border-b border-blue-100 p-4 flex items-center gap-3">
                <Lock size={16} className="text-blue-600" />
                <p className="text-xs font-bold text-blue-800 uppercase tracking-widest leading-loose">
                    Exam is locked. Wait for admin to press start.
                </p>
            </div>
        )}

        <div className="p-8 md:p-12 space-y-10 min-h-[50vh]">
            
            <div className="space-y-6 text-sm">
                <p className="font-bold text-blue-600 uppercase tracking-widest text-[11px]">Instructions:</p>
                
                <ul className="space-y-6 pl-4 border-l-2 border-blue-100">
                    <li><span className="font-bold">Total Time:</span> 60 minutes.</li>
                    <li><span className="font-bold">Window:</span> This will go to full screen. Do not exit it.</li>
                    <li><span className="font-bold">Rules:</span> Do not change tabs. Do not use keyboard keys.</li>
                    <li><span className="font-bold">Safety:</span> If you break rules, the exam will stop immediately.</li>
                    <li><span className="font-bold">Answers:</span> Click Save after every question.</li>
                </ul>
            </div>

            <div className="bg-gray-50 p-6 border border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase leading-relaxed">
                    By starting the test, you promise to follow all rules and work honestly.
                </p>
            </div>
        </div>

        <div className="bg-white border-t border-gray-100 p-8 flex flex-col items-center gap-8">
            <label className="flex items-center gap-4 cursor-pointer select-none">
                <input 
                    type="checkbox" 
                    className="h-6 w-6 accent-blue-600"
                    checked={hasAgreed}
                    onChange={(e) => setHasAgreed(e.target.checked)}
                />
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">I have read the rules and I am ready.</span>
            </label>

            <button 
                onClick={startExam}
                disabled={!hasAgreed || !examActive}
                className={`h-14 px-20 text-xs font-bold uppercase tracking-[0.2em] shadow-xl transition-all ${
                    (hasAgreed && examActive)
                    ? 'bg-blue-600 text-white hover:scale-105 active:scale-95' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
                {examActive ? 'Start Exam' : 'Portal Locked'}
            </button>
        </div>

      </div>
    </div>
  );
}
