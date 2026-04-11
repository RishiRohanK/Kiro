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
      
      {/* Simple Official Header */}
      <header className="bg-blue-700 text-white p-6 shadow-md shrink-0">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-tight">Full Stack Development Assessment</h1>
            <p className="text-xs opacity-70 font-bold uppercase tracking-widest mt-1">12-04-2026 | 10:45 AM to 11:45 AM</p>
          </div>
          <div className="mt-4 md:mt-0 bg-blue-800 p-2 border border-blue-400 text-[10px] font-bold uppercase">
             Student Forge Technologies
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 md:p-10 bg-gray-50/50 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* Candidate Table - Government Style */}
          <div className="bg-white border border-gray-300">
             <div className="bg-gray-100 p-3 border-b border-gray-300 font-bold text-blue-800 text-xs uppercase text-center">
                Candidate Information Terminal
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-300">
                <div className="p-4 flex flex-col items-center md:items-start">
                   <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Intern Name</p>
                   <p className="text-sm font-bold text-gray-700 uppercase">{user.name}</p>
                </div>
                <div className="p-4 flex flex-col items-center md:items-start border-t md:border-t-0 border-gray-300">
                   <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Registration ID</p>
                   <p className="text-sm font-bold text-gray-700 uppercase">SF-{user.id?.slice(-8)}</p>
                </div>
             </div>
          </div>

          {/* Syllabus - Government Style Table */}
          <div className="bg-white border border-gray-300">
             <div className="bg-gray-100 p-3 border-b border-gray-300 font-bold text-blue-800 text-xs uppercase text-center">
                Examination Syllabus (MERN & Cloud)
             </div>
             <table className="w-full text-[11px] font-bold text-gray-600 border-collapse">
                <tbody>
                   <tr className="border-b border-gray-200">
                      <td className="p-4 bg-gray-50 border-r border-gray-300 w-1/3 uppercase">MERN Architecture</td>
                      <td className="p-4 uppercase">React Hooks, Next.js Clusters, Node Event Loop, MongoDB Schemas</td>
                   </tr>
                   <tr className="border-b border-gray-200">
                      <td className="p-4 bg-gray-50 border-r border-gray-300 uppercase">Cloud & DevOps</td>
                      <td className="p-4 uppercase">AWS S3/CloudFront, Dockerized Environments, CI/CD, Kubernetes Pods</td>
                   </tr>
                   <tr>
                      <td className="p-4 bg-gray-50 border-r border-gray-300 uppercase">Advanced Protocols</td>
                      <td className="p-4 uppercase">TRPC Type-Safety, WebRTC Signaling, JWT Authentication, OAuth Nodes</td>
                   </tr>
                </tbody>
             </table>
          </div>

          {/* Instructions Box */}
          <div className="bg-white border border-gray-300">
             <div className="bg-gray-100 p-3 border-b border-gray-300 font-bold text-blue-800 text-xs uppercase text-center">
                Instructions for Candidate
             </div>
             <div className="p-6 md:p-8 space-y-4 text-xs font-bold text-gray-600 leading-relaxed uppercase">
                <ul className="list-decimal pl-5 space-y-4">
                   <li>Total assessment time: 60 minutes for 50 questions.</li>
                   <li>Marking Algorithm: <span className="text-green-700">+3.0</span> for correct and <span className="text-red-700">-1.0</span> for incorrect answers.</li>
                   <li>Terminal will operate in dynamic full-screen. Do not force exit.</li>
                   <li>Tab switching or focus loss will trigger severe violation reports.</li>
                   <li>Hardware keys (F5, F12, Ctrl+T) are internally blocked by the terminal.</li>
                   <li>Click "Save and Next" to finalize every Node state.</li>
                   <li>Disqualification triggers immediately on rule violation nodes.</li>
                </ul>
             </div>
          </div>

          {/* Agreement Section */}
          <div className="bg-blue-50/50 p-8 border border-blue-200 text-center space-y-8">
             <label className="flex items-center justify-center gap-4 cursor-pointer group">
                <input 
                   type="checkbox" 
                   className="h-5 w-5 accent-blue-700"
                   checked={hasAgreed}
                   onChange={(e) => setHasAgreed(e.target.checked)}
                />
                <span className="text-xs font-bold text-blue-900 uppercase tracking-tight hover:text-blue-700 transition-colors">I accept all terminal rules and protocol nodes.</span>
             </label>

             <div className="space-y-4">
                <button 
                   onClick={startExam}
                   disabled={!hasAgreed || !examActive}
                   className={`h-11 px-20 text-[10px] font-bold uppercase tracking-[0.2em] transition-all shadow-lg ${
                       (hasAgreed && examActive)
                       ? 'bg-blue-700 text-white hover:bg-blue-800' 
                       : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                   }`}
                >
                   {examActive ? 'Initialize Exam' : 'Wait for Admin'}
                </button>
                {!examActive && (
                   <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Protocol Sync at 10:45 AM</p>
                )}
             </div>
          </div>

        </div>
      </main>

      {/* Official Footer */}
      <footer className="p-6 text-center text-[9px] font-bold text-gray-400 bg-white border-t border-gray-300 uppercase tracking-[0.3em]">
        Student Forge Technologies Private Limited © Assessment Core V2.5.0
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; }
      `}</style>
    </div>
  );
}
