"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  Loader2,
  AlertTriangle
} from "lucide-react";

export default function ExamReviewPage() {
  const router = useRouter();
  const [submission, setSubmission] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("intern_user");
    const storedSubmission = localStorage.getItem("exam_submission");
    
    if (!storedUser || !storedSubmission) {
      router.push("/exams");
      return;
    }
    
    setUser(JSON.parse(storedUser));
    setSubmission(JSON.parse(storedSubmission));
  }, [router]);

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      await fetch("/api/exams/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          status: "SUBMITTED",
          violations: submission.violations,
          answers: submission.answers,
          questionMapping: submission.shuffledQuestions,
          typedExitKey: submission.exitKey
        })
      });
      
      localStorage.removeItem("exam_submission");
      setIsSubmitted(true);
      if (typeof document !== "undefined" && document.exitFullscreen) document.exitFullscreen().catch(() => {});
    } catch (err) {
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <CheckCircle2 size={60} className="text-green-600 mb-6" />
        <h1 className="text-2xl font-bold text-blue-900 mb-2">Exam Submitted Successfully</h1>
        <p className="text-gray-500 mb-8 max-w-sm">
           Thank you for completing the exam. Your reports will be available in the 
           <strong className="text-blue-700"> Intern Dashboard &gt; Reports</strong>.
        </p>
        <button 
          onClick={() => { localStorage.removeItem("intern_user"); router.push("/exams"); }}
          className="bg-blue-700 text-white px-10 py-3 font-semibold rounded shadow hover:bg-blue-800 transition-all"
        >
          Logout
        </button>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-700" />
      </div>
    );
  }

  const { status, shuffledQuestions } = submission;
  const answeredCount = Object.values(status).filter(s => s === 'answered' || s === 'marked_for_review').length;
  const totalCount = shuffledQuestions.length;
  const unansweredCount = totalCount - answeredCount;

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col text-gray-700">
      
      {/* Header */}
      <header className="bg-blue-700 text-white p-6 shadow-md">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
           <h1 className="text-lg font-bold">Exam Summary</h1>
           <p className="text-xs opacity-80">{user.name}</p>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white border border-gray-300 shadow-sm overflow-hidden">
          
          <div className="bg-gray-100 p-4 border-b border-gray-300">
             <h2 className="text-blue-800 font-bold text-center text-sm">Review Your Performance</h2>
          </div>

          <div className="p-8 space-y-8">
             
             {/* Simple Stats */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 border border-gray-200 text-center rounded-lg bg-gray-50">
                   <p className="text-3xl font-bold text-gray-800 mb-1">{totalCount}</p>
                   <p className="text-xs text-gray-400 font-medium">Total Questions</p>
                </div>
                <div className="p-6 border border-green-200 text-center rounded-lg bg-green-50">
                   <p className="text-3xl font-bold text-green-700 mb-1">{answeredCount}</p>
                   <p className="text-xs text-green-600 font-medium">Answered</p>
                </div>
                <div className="p-6 border border-amber-200 text-center rounded-lg bg-amber-50">
                   <p className="text-3xl font-bold text-amber-700 mb-1">{unansweredCount}</p>
                   <p className="text-xs text-amber-600 font-medium">Unanswered</p>
                </div>
             </div>

             {/* Important Note */}
             <div className="p-4 bg-blue-50 border border-blue-100 flex items-start gap-4">
                <AlertTriangle className="text-blue-700 shrink-0" size={20} />
                <div>
                   <p className="text-sm font-semibold text-blue-900 mb-1">Final Submission</p>
                   <p className="text-sm text-blue-700/80 leading-relaxed">
                      Please check your details. Once you click "Final Submit," you cannot make any changes.
                      Your results will be visible in your dashboard after submission.
                   </p> 
                </div>
             </div>

             {/* Buttons */}
             <div className="flex flex-col md:flex-row gap-4 pt-6">
                <button 
                   onClick={() => router.push("/exams/panel")}
                   disabled={loading}
                   className="flex-1 h-12 border border-blue-700 text-blue-700 font-bold text-sm rounded hover:bg-blue-50"
                >
                   Go Back
                </button>
                <button 
                   onClick={handleFinalSubmit}
                   disabled={loading}
                   className="flex-1 h-12 bg-blue-700 text-white font-bold text-sm rounded shadow hover:bg-blue-800 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                   {loading ? <Loader2 className="animate-spin" size={20} /> : "Final Submit"}
                </button>
             </div>
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-xs text-gray-400">
        Student Forge Technologies © 2026
      </footer>

    </div>
  );
}
