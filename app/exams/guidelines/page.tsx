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
            <h1 className="text-xl font-bold">UI/UX Development Exam</h1>
            <p className="text-sm mt-1 opacity-80">12-04-2026 | 3:30 PM to 5:30 PM</p>
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
                       <td className="p-4 bg-gray-50 border-r border-gray-300 w-1/3 font-medium">UI & UX Concepts</td>
                       <td className="p-4 text-gray-600">Basics of UI & UX and Visual hierarchy</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                       <td className="p-4 bg-gray-50 border-r border-gray-300 font-medium">Layout design</td>
                       <td className="p-4 text-gray-600">Wireframing, layout design and Responsive design</td>
                    </tr>
                    <tr>
                       <td className="p-4 bg-gray-50 border-r border-gray-300 font-medium">Design principles</td>
                       <td className="p-4 text-gray-600">Spacing, typography, consistency and CTA</td>
                    </tr>
                </tbody>
             </table>
          </div>

          {/* Exam Structure */}
          <div className="bg-white border border-gray-300">
             <div className="bg-gray-100 p-3 border-b border-gray-300 font-semibold text-blue-800 text-sm">
                Exam Structure
             </div>
             <div className="p-0 overflow-x-auto text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-gray-200 border-b border-gray-200">
                   <div className="p-5 space-y-2">
                       <p className="text-zinc-800 text-xs font-bold">Section A – MCQs</p>
                       <p className="text-blue-600">10 Marks</p>
                       <p className="text-[10px] lowercase font-medium text-zinc-500 normal-case tracking-normal">Basic concepts of UI/UX</p>
                   </div>
                   <div className="p-5 space-y-2">
                       <p className="text-zinc-800 text-xs font-bold">Section B – Theory</p>
                       <p className="text-blue-600">15 Marks</p>
                       <p className="text-[10px] lowercase font-medium text-zinc-500 normal-case tracking-normal">Understanding of design principles</p>
                   </div>
                   <div className="p-5 space-y-2 bg-blue-50/10">
                       <p className="text-zinc-800 text-xs font-bold">Section C – Practical</p>
                       <p className="text-blue-600">25 Marks</p>
                       <p className="text-[10px] normal-case font-bold text-blue-700 tracking-normal">Design-based question (most important)</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Instructions */}
          <div className="bg-white border border-gray-300">
             <div className="bg-gray-100 p-3 border-b border-gray-300 font-semibold text-blue-800 text-sm">
                Exam Instructions
             </div>
             <div className="p-6 md:p-8 space-y-4 text-sm leading-relaxed">
                <ul className="list-decimal pl-5 space-y-4 text-gray-600">
                   <li>You have 120 minutes (3:30 PM to 5:30 PM) for the complete assessment.</li>
                   <li>The exam consists of three sections: MCQs, Theory, and a Practical Design task.</li>
                   <li>Total weightage of the assessment is 50 Marks.</li>
                   <li>The exam will run in mandatory full-screen mode. Do not exit it.</li>
                   <li>Do not change tabs or your session will be strictly disqualified.</li>
                   <li>High security: Keyboard keys like F5, F11, and F12 are blocked.</li>
                   <li>Ensure you click "Save and Next" to persist your progress to the server.</li>
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
                   <p className="text-xs text-gray-400 font-medium">System will activate at 3:30 PM</p>
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
