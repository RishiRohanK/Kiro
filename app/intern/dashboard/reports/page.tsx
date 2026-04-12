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
  ChevronDown,
  ChevronUp,
  Award
} from "lucide-react";
import { motion } from "framer-motion";
import { CORRECT_ANSWERS } from "@/lib/exam-questions";

export default function InternReportsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
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
        const userSessions = Array.isArray(exData) ? exData.filter((s: any) => s.userId === user.id) : [];
        setSessions(userSessions);

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

      {/* Exam Results Section */}
      <div className="space-y-4 mb-10">
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Exam Performance</h2>
        {sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((session) => (
              <div key={session.id} className="bg-white border border-zinc-200 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-2 py-1 text-[9px] font-bold uppercase ${
                      session.examType === 'UI_UX' ? 'bg-blue-100 text-blue-700' : 'bg-zinc-100 text-zinc-700'
                    }`}>
                      {session.examType === 'UI_UX' ? 'UI/UX Development' : 'Full Stack Assessment'}
                    </div>
                    <span className="text-[10px] text-zinc-400 font-medium">
                      {new Date(session.startedAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-2xl font-black text-zinc-900">
                      {session.score !== null ? session.score : '0'}
                    </span>
                    <span className="text-zinc-400 font-bold text-xs">
                      / {session.examType === 'UI_UX' ? '40' : '150'}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter mb-4">Final Score Accumulated</p>

                  <div className="space-y-2 border-t border-zinc-50 pt-4">
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-zinc-500 uppercase">Status</span>
                      <span className={session.status === 'SUBMITTED' ? 'text-green-600' : 'text-blue-600'}>
                        {session.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-zinc-500 uppercase">Violations</span>
                      <span className={session.violations > 0 ? 'text-red-500' : 'text-zinc-400'}>
                        {session.violations}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowResponses(showResponses === session.id ? false : session.id)}
                  className="mt-6 w-full py-2 bg-zinc-900 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                >
                  <FileText size={12} />
                  {showResponses === session.id ? "Hide Detailed Report" : "View Response Map"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-50 border border-zinc-100 p-8 text-center">
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest italic">No exam records detected on this channel.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div className="bg-blue-50/30 border border-blue-100 p-4 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="bg-blue-100 p-2">
              <Award className="text-blue-600" size={20} />
            </div>
            <span className="text-[10px] font-medium text-blue-600/70">Attendance Rating</span>
          </div>
          <h3 className="text-2xl font-bold text-zinc-800">
            {attendance}%
          </h3>
          <p className="text-[10px] text-blue-600/60 font-medium mt-1">Overall session engagement</p>
        </div>
        <div className="bg-rose-50/30 border border-rose-100 p-4 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="bg-rose-100 p-2">
              <AlertCircle className="text-rose-600" size={20} />
            </div>
            <span className="text-[10px] font-medium text-rose-600/70">Security Log</span>
          </div>
          <h3 className="text-2xl font-bold text-zinc-800">
            {sessions.reduce((acc: number, s: any) => acc + (s.violations || 0), 0)}
          </h3>
          <p className="text-[10px] text-rose-600/60 font-medium mt-1">Cumulative exam violations</p>
        </div>
      </div>

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
