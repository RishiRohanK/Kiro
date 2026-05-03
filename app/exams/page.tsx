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

  if (fetchingExam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#6366F1]" size={32} />
      </div>
    );
  }

  const isEnded = exam ? new Date(exam.date) < new Date() : true;

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans flex flex-col select-none">
      
      {/* Header */}
      <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
             <div className="h-10 w-10 bg-white p-1">
                <img src="https://www.cmrit.ac.in/wp-content/uploads/2021/04/cmrit-logo.png" alt="College Logo" className="h-full w-full object-contain" />
             </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="h-10 px-4 bg-zinc-50 border border-zinc-200 rounded-full flex items-center gap-3">
                <div className="h-7 w-7 bg-zinc-200 rounded-full flex items-center justify-center text-[10px] font-bold text-zinc-600">
                   {user?.name?.split(" ").map((n: any) => n[0]).join("") || "KR"}
                </div>
                <span className="text-[12px] font-semibold text-zinc-700">{user?.name || "Candidate"}</span>
             </div>
          </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
         
         {/* Left Column: Info & Actions */}
         <div className="w-full md:w-[400px] lg:w-[450px] bg-[#EBEBEB] p-8 lg:p-12 flex flex-col gap-10 overflow-y-auto">
            <button 
               onClick={() => router.back()}
               className="flex items-center gap-1 text-[13px] font-bold text-[#4F46E5] hover:underline w-fit"
            >
               <ChevronLeft size={16} /> Go Back
            </button>

            <div className="space-y-6">
               <h1 className="text-3xl lg:text-4xl font-bold text-zinc-800 leading-[1.1] tracking-tight">
                  {exam?.title || "Assessment Overview"}
               </h1>

               <div className="inline-flex items-center gap-2 bg-zinc-200/50 px-3 py-1.5 rounded-md text-zinc-600">
                  <Clock size={14} />
                  <span className="text-[13px] font-semibold">{exam?.date || "No date set"}</span>
               </div>

               <div className="grid grid-cols-2 bg-white/50 border border-zinc-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="p-4 border-r border-zinc-200 space-y-1">
                     <p className="text-xl font-bold text-zinc-800 leading-none">{exam?.duration || "60"} mins</p>
                     <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Duration</p>
                  </div>
                  <div className="p-4 space-y-1">
                     <p className="text-xl font-bold text-zinc-800 leading-none">
                        {exam?.questions?.length || 75}
                     </p>
                     <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Questions</p>
                  </div>
               </div>

               <div className="flex flex-col gap-3 pt-4">
                  <button 
                     onClick={() => router.push(`/exams/login?id=${examId}`)}
                     disabled={isEnded}
                     className="w-full h-14 bg-[#6366F1] text-white font-bold rounded-lg shadow-lg shadow-[#6366F1]/20 hover:bg-[#4F46E5] transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                     Start Test
                  </button>
                  {isEnded && (
                     <div className="w-full h-14 bg-zinc-200 text-zinc-500 font-bold rounded-lg flex items-center justify-center">
                        This test has ended
                     </div>
                  )}
               </div>
            </div>

            <div className="mt-auto pt-10">
                <div className="flex items-center gap-2 opacity-50 grayscale brightness-0">
                    <img src="https://ik.imagekit.io/dypkhqxip/sflogo" alt="Redlix Logo" className="h-6 w-auto" />
                    <span className="text-[14px] font-bold tracking-tighter text-zinc-900">Redlix Secure</span>
                </div>
            </div>
         </div>

         {/* Right Column: History/Attempts */}
         <div className="flex-1 bg-white p-8 lg:p-12 overflow-y-auto">
            {!exam && !fetchingExam ? (
                <div className="max-w-3xl py-20 text-center">
                    <p className="text-sm font-medium text-zinc-400">Please select an assessment from your dashboard to view details.</p>
                </div>
            ) : (
                <div className="max-w-3xl">
                   <div className="bg-white border border-zinc-100 rounded-xl p-6 shadow-sm flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                         <h3 className="text-lg font-bold text-zinc-800">Attempt 1</h3>
                         <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5 uppercase tracking-widest">
                            <CheckCircle2 size={12} /> Submitted
                         </span>
                      </div>

                      <div className="flex flex-wrap gap-4">
                         <div className="bg-zinc-50 px-4 py-3 rounded-lg border border-zinc-100 space-y-1">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Start Time</p>
                            <div className="flex items-center gap-2 text-zinc-600">
                               <Calendar size={14} />
                               <span className="text-[13px] font-bold">23 Aug 2025, 11:59 AM</span>
                            </div>
                         </div>
                         <div className="bg-zinc-50 px-4 py-3 rounded-lg border border-zinc-100 space-y-1">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Submitted</p>
                            <div className="flex items-center gap-2 text-zinc-600">
                               <Calendar size={14} />
                               <span className="text-[13px] font-bold">23 Aug 2025, 12:12 PM</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   <p className="mt-6 text-[12px] font-medium text-zinc-400 italic leading-relaxed">
                      * Please note that negative score is treated as 0%. This is possible in tests which have negative markings. Ensure your connection is stable before starting.
                   </p>
                </div>
            )}
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
