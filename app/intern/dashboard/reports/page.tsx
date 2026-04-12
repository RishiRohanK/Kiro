"use client";

import { useEffect, useState } from "react";
import { 
  FileBox, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  FileText,
  ShieldCheck,
  TrendingUp,
  Award
} from "lucide-react";
import { motion } from "framer-motion";
import { CORRECT_ANSWERS } from "@/lib/exam-questions";

export default function InternReportsPage() {
  const [session, setSession] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showResponses, setShowResponses] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = localStorage.getItem("intern_user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);

      try {
        // Fetch Exam Session
        const exRes = await fetch("/api/exams/session");
        const exData = await exRes.json();
        const userSession = exData.find((s: any) => s.userId === user.id);
        setSession(userSession);

        // Fetch History
        const histRes = await fetch(`/api/intern/reports?internId=${user.id}`);
        const histData = await histRes.json();
        if (histData.success) {
          setHistory(histData.reports);
        }

        // Fetch Attendance
        const attRes = await fetch(`/api/intern/attendance?internId=${user.id}`);
        const attData = await attRes.json();
        if (attData.success) {
           const historyCount = attData.history.length;
           const presentCount = attData.history.filter((a: any) => a.status === 'PRESENT').length;
           const ratio = historyCount > 0 ? (presentCount / attData.totalTrackingDays) * 100 : 0;
           setAttendance(Math.round(ratio));
        }
      } catch (err) {
        console.error("Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-12 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-5xl mx-auto font-sans">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-zinc-800">My reports</h1>
        <p className="text-sm text-zinc-500 mt-1">Check your performance and exam results here.</p>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50/30 border border-blue-100 p-4 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="bg-blue-100 p-2">
              <Award className="text-blue-600" size={20} />
            </div>
            <span className="text-[10px] font-medium text-blue-600/70">Score</span>
          </div>
          <h3 className="text-2xl font-bold text-zinc-800">
            {session?.score !== null ? `${session?.score} / 150` : '0 / 150'}
          </h3>
          <p className="text-[10px] text-blue-600/60 font-medium mt-1">Final exam score</p>
        </div>

        <div className="bg-rose-50/30 border border-rose-100 p-4 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="bg-rose-100 p-2">
              <AlertCircle className="text-rose-600" size={20} />
            </div>
            <span className="text-[10px] font-medium text-rose-600/70">Warnings</span>
          </div>
          <h3 className="text-2xl font-bold text-zinc-800">{session?.violations || 0}</h3>
          <p className="text-[10px] text-rose-600/60 font-medium mt-1">Rules broken</p>
        </div>

        <div className="bg-emerald-50/30 border border-emerald-100 p-4 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="bg-emerald-100 p-2">
              <CheckCircle2 className="text-emerald-600" size={20} />
            </div>
            <span className="text-[10px] font-medium text-emerald-600/70">Attendance</span>
          </div>
          <h3 className="text-xl font-bold text-zinc-800">
             {attendance}%
          </h3>
          <p className="text-[10px] text-emerald-600/60 font-medium mt-1">Average ratio</p>
        </div>
      </div>

      <div className="space-y-6">
         {}
         <div className="bg-white border border-zinc-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <ShieldCheck className="text-zinc-400" size={16} />
                  <h2 className="text-xs font-bold text-zinc-800">Exam report</h2>
               </div>
               {session?.status === 'SUBMITTED' && (
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100">
                     Completed
                  </span>
               )}
            </div>
            <div className="p-4">
               {session ? (
                  <div className="space-y-6">
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                           <p className="text-[10px] font-medium text-zinc-400 mb-1">Start time</p>
                           <p className="text-xs font-medium text-zinc-700">{new Date(session.startedAt).toLocaleString()}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-medium text-zinc-400 mb-1">Finish time</p>
                           <p className="text-xs font-medium text-zinc-700">
                              {session.status === 'SUBMITTED' ? new Date(session.updatedAt).toLocaleString() : 'Not finished'}
                           </p>
                        </div>
                        <div>
                           <p className="text-[10px] font-medium text-zinc-400 mb-1">Time taken</p>
                           <p className="text-xs font-medium text-zinc-700">
                              {Math.round((new Date(session.updatedAt).getTime() - new Date(session.startedAt).getTime()) / 60000)} mins
                           </p>
                        </div>
                        <div>
                           <p className="text-[10px] font-medium text-zinc-400 mb-1">Percentage</p>
                           <p className="text-xs font-bold text-blue-600">
                              {session.score !== null ? `${((session.score / 150) * 100).toFixed(1)}%` : '0.0%'}
                           </p>
                        </div>
                     </div>

                     <div className="p-4 bg-zinc-50 border border-zinc-100">
                        <div className="flex gap-3 items-center justify-between">
                           <div className="flex gap-3 items-center">
                              <div className="h-8 w-8 bg-white border border-zinc-100 flex items-center justify-center text-zinc-400">
                                 <TrendingUp size={16} />
                              </div>
                              <div>
                                 <p className="text-[10px] font-bold text-zinc-800">Exam feedback</p>
                                 <p className="text-xs text-zinc-500 mt-0.5">
                                    {session.score >= 105 ? "Great job. You have a solid understanding of the concepts." : 
                                    session.score >= 75 ? "Good work. Try to focus more on advanced topics." :
                                    "Keep practicing. We suggest reviewing the core architecture guides."}
                                 </p>
                              </div>
                           </div>
                           <button 
                              onClick={() => setShowResponses(!showResponses)}
                              className="text-[10px] font-bold text-blue-600 hover:underline"
                           >
                              {showResponses ? "Hide details" : "More details"}
                           </button>
                        </div>
                     </div>

                     {showResponses && session.questionMapping && session.answers && (
                        <div className="mt-8 space-y-4 border-t border-zinc-100 pt-6">
                           <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Question Review</h4>
                           <div className="space-y-6">
                              {(session.questionMapping as any[]).map((q, idx) => {
                                 const userAnswerIdx = session.answers[idx];
                                 const correctOptionIdx = CORRECT_ANSWERS[q.id as keyof typeof CORRECT_ANSWERS];
                                 const isCorrect = userAnswerIdx === correctOptionIdx;
                                 
                                 return (
                                    <div key={idx} className="pb-8 border-b border-zinc-50 last:border-0">
                                       <div className="flex justify-between items-start mb-3">
                                          <p className="text-sm font-semibold text-zinc-800 leading-relaxed max-w-2xl">
                                             <span className="text-zinc-400 mr-2 font-mono">#{idx + 1}</span> {q.question}
                                          </p>
                                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isCorrect ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                             {isCorrect ? '+3 marks' : '-1 mark'}
                                          </span>
                                       </div>
                                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                          {q.options.map((opt: string, optIdx: number) => {
                                             const isUserChoice = userAnswerIdx === optIdx;
                                             const isCorrectOpt = correctOptionIdx === optIdx;
                                             
                                             let borderColor = 'border-zinc-100';
                                             let bgColor = 'bg-white';
                                             let textColor = 'text-zinc-500';

                                             if (isCorrectOpt) {
                                                borderColor = 'border-emerald-200';
                                                bgColor = 'bg-emerald-50/50';
                                                textColor = 'text-emerald-700 font-bold';
                                             } else if (isUserChoice && !isCorrect) {
                                                borderColor = 'border-rose-200';
                                                bgColor = 'bg-rose-50/50';
                                                textColor = 'text-rose-700 font-bold';
                                             }

                                             return (
                                                <div 
                                                   key={optIdx} 
                                                   className={`p-3 text-[11px] border transition-all ${borderColor} ${bgColor} ${textColor} flex items-center justify-between`}
                                                >
                                                   <div className="flex items-center gap-3">
                                                      <span className="text-[10px] opacity-40 font-mono w-4">{String.fromCharCode(65 + optIdx)}</span>
                                                      <span>{opt}</span>
                                                   </div>
                                                   <div className="flex gap-2">
                                                      {isCorrectOpt && <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-100 px-1.5 py-0.5">Correct</span>}
                                                      {isUserChoice && <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 ${isCorrect ? 'text-emerald-600 bg-emerald-100' : 'text-rose-600 bg-rose-100'}`}>You</span>}
                                                   </div>
                                                </div>
                                             );
                                          })}
                                       </div>
                                    </div>
                                 );
                              })}
                           </div>
                        </div>
                     )}
                  </div>
               ) : (
                  <div className="py-8 text-center">
                     <FileBox className="mx-auto text-zinc-200 mb-3" size={32} />
                     <p className="text-xs text-zinc-400">No exam record found.</p>
                  </div>
               )}
            </div>
         </div>

         {}
         <div className="bg-white border border-zinc-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-zinc-100 bg-zinc-50 flex items-center gap-2">
               <FileText className="text-zinc-400" size={16} />
               <h2 className="text-xs font-bold text-zinc-800">Weekly reports</h2>
            </div>
            <div className="divide-y divide-zinc-100">
               {history.length > 0 ? (
                  history.map((report) => (
                     <div key={report.id} className="p-4 hover:bg-zinc-50/50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                           <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                 <span className="text-[10px] font-bold px-2 py-0.5 bg-zinc-100 text-zinc-600">
                                    {report.schedule.week}
                                 </span>
                                 <span className="text-zinc-300">|</span>
                                 <span className="text-[10px] text-zinc-400 font-medium">
                                    Checked on {new Date(report.reviewedAt).toLocaleDateString()}
                                 </span>
                              </div>
                              <h4 className="text-sm font-bold text-zinc-800">{report.schedule.typeOfWork}</h4>
                              {report.review && (
                                 <p className="text-xs text-zinc-500 bg-zinc-50 p-2 border-l-2 border-blue-200">
                                    {report.review}
                                 </p>
                              )}
                           </div>
                           <div className="bg-white border border-zinc-200 p-3 min-w-[100px] text-center">
                              <p className="text-[10px] font-bold text-zinc-400 mb-1">Score</p>
                              <p className="text-lg font-bold text-blue-600">{report.marks}%</p>
                           </div>
                        </div>
                     </div>
                  ))
               ) : (
                  <div className="py-12 text-center">
                     <FileBox className="mx-auto text-zinc-200 mb-3" size={32} />
                     <p className="text-xs text-zinc-400">No weekly reports available yet.</p>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
