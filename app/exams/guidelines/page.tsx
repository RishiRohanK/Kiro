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
      return;
    } 
    
    const u = JSON.parse(storedUser);
    setUser(u);

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
    <div className="min-h-screen bg-white font-sans flex flex-col text-gray-700">
      
      {/* Simple Header */}
      <header className="bg-blue-700 text-white p-6 shadow-md shrink-0">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-xl font-bold">Full Stack Development Exam</h1>
            <p className="text-sm mt-1 opacity-80">12-04-2026 | 10:45 AM to 11:45 AM</p>
          </div>
          <div className="mt-4 md:mt-0 text-xs font-semibold opacity-70">
             Student Forge Technologies
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 md:p-10 bg-gray-50/50 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* Candidate Table */}
          <div className="bg-white border border-gray-300">
             <div className="bg-gray-100 p-3 border-b border-gray-300 font-semibold text-blue-800 text-sm">
                Candidate Information
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-300">
                <div className="p-4">
                   <p className="text-xs text-gray-400 font-medium mb-1">Intern Name</p>
                   <p className="text-sm font-semibold">{user.name}</p>
                </div>
                <div className="p-4 border-t md:border-t-0 border-gray-300">
                   <p className="text-xs text-gray-400 font-medium mb-1">Registration ID</p>
                   <p className="text-sm font-semibold">SF-{user.id?.slice(-8)}</p>
                </div>
             </div>
          </div>

          {/* Syllabus */}
          <div className="bg-white border border-gray-300">
             <div className="bg-gray-100 p-3 border-b border-gray-300 font-semibold text-blue-800 text-sm">
                Exam Syllabus
             </div>
             <table className="w-full text-sm border-collapse">
                <tbody>
                   <tr className="border-b border-gray-200">
                      <td className="p-4 bg-gray-50 border-r border-gray-300 w-1/3 font-medium">MERN stack</td>
                      <td className="p-4 text-gray-600">React, Next.js, Node.js and MongoDB</td>
                   </tr>
                   <tr className="border-b border-gray-200">
                      <td className="p-4 bg-gray-50 border-r border-gray-300 font-medium">Cloud and DevOps</td>
                      <td className="p-4 text-gray-600">AWS S3, Docker, CI/CD and Kubernetes</td>
                   </tr>
                   <tr>
                      <td className="p-4 bg-gray-50 border-r border-gray-300 font-medium">Advanced topics</td>
                      <td className="p-4 text-gray-600">TRPC, WebRTC and JWT Security</td>
                   </tr>
                </tbody>
             </table>
          </div>

          {/* Instructions */}
          <div className="bg-white border border-gray-300">
             <div className="bg-gray-100 p-3 border-b border-gray-300 font-semibold text-blue-800 text-sm">
                Exam Instructions
             </div>
             <div className="p-6 md:p-8 space-y-4 text-sm leading-relaxed">
                <ul className="list-decimal pl-5 space-y-4 text-gray-600">
                   <li>You have 60 minutes for 50 questions.</li>
                   <li>You get 3 marks for correct answers and 1 mark is deducted for wrong ones.</li>
                   <li>The exam will run in full-screen mode. Do not exit it.</li>
                   <li>Do not change tabs or your session will be disqualified.</li>
                   <li>Keyboard keys like F5 and F12 are blocked.</li>
                   <li>Click "Save and Next" after every question to save your progress.</li>
                   <li>Rules are strictly monitored by the system.</li>
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
                <span className="text-sm font-medium hover:text-blue-700 transition-colors">I have read the rules and I am ready.</span>
             </label>

             <div className="space-y-4">
                <button 
                   onClick={startExam}
                   disabled={!hasAgreed || !examActive}
                   className={`h-11 px-20 text-xs font-semibold transition-all shadow-lg rounded ${
                       (hasAgreed && examActive)
                       ? 'bg-blue-700 text-white hover:bg-blue-800' 
                       : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                   }`}
                >
                   {examActive ? 'Start Exam' : 'Wait for Admin'}
                </button>
                {!examActive && (
                   <p className="text-xs text-gray-400 font-medium">System will activate at 10:45 AM</p>
                )}
             </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-gray-400 bg-white border-t border-gray-300">
        Student Forge Technologies Private Limited © 2026
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc; }
      `}</style>
    </div>
  );
}
