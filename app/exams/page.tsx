"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ChevronLeft, Calendar, Clock, HelpCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

function ExamDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examId = searchParams.get("id");
  
  const [exam, setExam] = useState<any>(null);
  const [fetchingExam, setFetchingExam] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("intern_user");
    if (stored) {
       setUser(JSON.parse(stored));
    }

    const fetchExamDetails = async () => {
      try {
        const url = examId ? `/api/exams/details?id=${examId}` : "/api/exams/details";
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setExam(data.exam);
        } else {
          setError(data.error || "Assessment not found.");
        }
      } catch (err) {
        setError("Connection error.");
      } finally {
        setFetchingExam(false);
      }
    };

    fetchExamDetails();
  }, [examId]);

  const guidelines = [
    "Ensure you have a stable internet connection before starting the test.",
    "Do not refresh the page or navigate away during the assessment.",
    "Use a laptop or desktop for the best experience; mobile devices are not recommended.",
    "Your camera and screen may be monitored during the exam session.",
    "Keep your surroundings quiet and well-lit during the entire duration.",
    "Read each question carefully before selecting or typing your answer.",
    "The test will automatically submit when the timer reaches zero.",
    "Do not use any external resources, books, or websites during the test.",
    "If you face any technical issues, contact support immediately.",
    "Double-check your answers before clicking the final submit button."
  ];

  if (fetchingExam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#6366F1]" size={24} />
      </div>
    );
  }

  const isEnded = exam ? new Date(exam.date) < new Date() : true;

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans flex flex-col select-none text-zinc-800">
      
      {/* Header */}
      <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
             <div className="h-10 px-2 flex items-center justify-center">
                <img 
                    src="https://ik.imagekit.io/dypkhqxip/sflogo" 
                    alt="College Logo" 
                    className="h-8 w-auto object-contain" 
                />
             </div>
             <div className="h-4 w-px bg-zinc-200" />
             <span className="text-[12px] font-medium text-zinc-400">Assessment Portal</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="h-10 px-4 bg-zinc-50 border border-zinc-200 rounded-full flex items-center gap-3">
                <div className="h-7 w-7 bg-[#6366F1] rounded-full flex items-center justify-center text-[10px] font-medium text-white">
                   {user?.name?.split(" ").map((n: any) => n[0]).join("") || "KR"}
                </div>
                <span className="text-[12px] font-medium text-zinc-600">{user?.name || "Candidate"}</span>
             </div>
          </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
         
         {/* Left Column: Info & Actions */}
         <div className="w-full lg:w-[450px] bg-[#EBEBEB] p-8 lg:p-12 flex flex-col gap-10 overflow-y-auto">
            <button 
               onClick={() => router.back()}
               className="flex items-center gap-1 text-[13px] font-medium text-[#4F46E5] hover:underline w-fit"
            >
               <ChevronLeft size={16} /> Go Back
            </button>

            <div className="space-y-6">
               <h1 className="text-3xl lg:text-4xl font-medium text-zinc-800 leading-[1.1] tracking-tight">
                  {exam?.title || "Assessment Overview"}
               </h1>

               <div className="inline-flex items-center gap-2 bg-zinc-200/50 px-3 py-1.5 rounded-md text-zinc-600">
                  <Clock size={14} />
                  <span className="text-[13px] font-medium">{exam?.date || "No date set"}</span>
               </div>

               <div className="grid grid-cols-2 bg-white/50 border border-zinc-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="p-4 border-r border-zinc-200 space-y-1">
                     <p className="text-xl font-medium text-zinc-800 leading-none">{exam?.duration || "60"} mins</p>
                     <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Duration</p>
                  </div>
                  <div className="p-4 space-y-1">
                     <p className="text-xl font-medium text-zinc-800 leading-none">
                        {exam?.questions?.length || 75}
                     </p>
                     <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Questions</p>
                  </div>
               </div>

               <div className="flex flex-col gap-3 pt-4">
                  <button 
                     onClick={() => router.push(`/exams/login?id=${examId}`)}
                     disabled={isEnded}
                     className="w-full h-14 bg-[#6366F1] text-white font-medium rounded-lg shadow-lg shadow-[#6366F1]/20 hover:bg-[#4F46E5] transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                     Start Test
                  </button>
                  {isEnded && (
                     <div className="w-full h-14 bg-zinc-200 text-zinc-500 font-medium rounded-lg flex items-center justify-center">
                        This test has ended
                     </div>
                  )}
               </div>
            </div>

            <div className="mt-auto pt-10">
                <div className="flex items-center gap-2 opacity-50 grayscale brightness-0">
                    <img src="https://ik.imagekit.io/dypkhqxip/sflogo" alt="Redlix Logo" className="h-6 w-auto" />
                    <span className="text-[14px] font-medium tracking-tighter text-zinc-900">Redlix Secure</span>
                </div>
            </div>
         </div>

         {/* Right Column: Guidelines */}
         <div className="flex-1 bg-white p-8 lg:p-12 overflow-y-auto">
            <div className="max-w-3xl">
               <div className="mb-8 border-b border-zinc-100 pb-4">
                  <h3 className="text-xl font-medium text-zinc-800">Exam Guidelines</h3>
                  <p className="text-[13px] text-zinc-400 font-medium mt-1">Please read the following instructions carefully before you begin.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {guidelines.map((guide, i) => (
                     <div key={i} className="flex gap-4 p-4 bg-zinc-50 border border-zinc-100 rounded-lg hover:border-zinc-200 transition-all">
                        <div className="h-6 w-6 rounded-full bg-zinc-200 flex items-center justify-center text-[10px] font-medium text-zinc-500 shrink-0">
                           {i + 1}
                        </div>
                        <p className="text-[13px] text-zinc-600 leading-relaxed font-medium">
                           {guide}
                        </p>
                     </div>
                  ))}
               </div>

               <div className="mt-10 p-6 bg-amber-50 border border-amber-100 rounded-xl">
                  <p className="text-[12px] font-medium text-amber-700 leading-relaxed">
                     <span className="font-bold">Notice:</span> By starting the test, you agree to comply with all the guidelines mentioned above. Any form of malpractice will lead to immediate disqualification.
                  </p>
               </div>
            </div>
         </div>

      </main>

    </div>
  );
}

export default function ExamDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-[#6366F1]" size={32} />
      </div>
    }>
      <ExamDetailsContent />
    </Suspense>
  );
}
    </Suspense>
  );
}
