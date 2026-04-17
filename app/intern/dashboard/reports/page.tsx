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
  Award
} from "lucide-react";
import { CORRECT_ANSWERS } from "@/lib/exam-questions";

export default function InternReportsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showResponses, setShowResponses] = useState<string | null>(null);

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
    <div className="p-4 lg:p-6 max-w-[1200px] mx-auto font-sans pb-24">
      {/* Page Header */}
      <div className="mb-10 space-y-1">
        <div className="flex items-center gap-2 text-[#003366]">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">Records</span>
        </div>
        <h1 className="text-3xl font-bold text-[#003366]">My Reports</h1>
        <p className="text-sm text-zinc-500 font-medium">Check your exam scores and weekly reviews here.</p>
      </div>

      {/* Simple Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        <div className="bg-[#E0E7FF] border border-[#003366]/5 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-[#003366] uppercase tracking-widest">Attendance</span>
            <Award className="text-[#003366]/40" size={16} />
          </div>
          <h3 className="text-2xl font-black text-[#003366]">{attendance}%</h3>
          <p className="text-[10px] text-[#003366]/60 font-medium mt-1 uppercase">Total presence</p>
        </div>

        <div className="bg-white border border-zinc-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Reports</span>
            <CheckCircle2 className="text-emerald-500" size={16} />
          </div>
          <h3 className="text-2xl font-black text-zinc-900">{sessions.length + history.length}</h3>
          <p className="text-[10px] text-zinc-400 font-medium mt-1 uppercase">Total reports found</p>
        </div>

        <div className="bg-white border border-rose-100/30 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Warnings</span>
            <AlertCircle className="text-rose-500" size={16} />
          </div>
          <h3 className="text-2xl font-black text-rose-600">
            {sessions.reduce((acc: number, s: any) => acc + (s.violations || 0), 0)}
          </h3>
          <p className="text-[10px] text-rose-500/60 font-medium mt-1 uppercase">Exam alerts</p>
        </div>
      </div>

      {/* Exam Grid */}
      <div className="space-y-6 mb-16">
        <div className="flex items-center gap-4">
            <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">My Exams</h2>
            <div className="h-px bg-zinc-100 flex-1"></div>
        </div>

        {sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sessions.map((session) => (
              <div key={session.id} className="bg-white border border-[#003366]/5 p-0 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`px-2 py-0.5 text-[9px] font-bold uppercase ${
                      session.examType === 'UI_UX' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-50 text-slate-600 border border-slate-100'
                    }`}>
                      {session.examType === 'UI_UX' ? 'UI/UX Exam' : 'Full Stack Exam'}
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-zinc-900 font-bold">{new Date(session.startedAt).toLocaleDateString()}</p>
                        <p className="text-[9px] text-zinc-400 font-medium">{new Date(session.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Score</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-[#003366]">
                        {session.score !== null ? session.score : '0'}
                        </span>
                        <span className="text-zinc-300 font-bold text-xs">
                        / {session.examType === 'UI_UX' ? '40' : '150'}
                        </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-zinc-50 mb-6">
                    <div>
                        <p className="text-[9px] font-bold text-zinc-300 uppercase">State</p>
                        <p className={`text-[10px] font-bold uppercase ${session.status === 'SUBMITTED' ? 'text-emerald-600' : 'text-blue-600'}`}>{session.status}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-zinc-300 uppercase">Alerts</p>
                        <p className={`text-[10px] font-bold uppercase ${session.violations > 0 ? 'text-rose-500' : 'text-zinc-500'}`}>{session.violations}</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowResponses(showResponses === session.id ? null : session.id)}
                  className="w-full py-3 bg-[#003366] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2"
                >
                  {showResponses === session.id ? "Hide Details" : "View Details"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-zinc-50 border border-zinc-100 p-12 text-center">
            <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest italic opacity-50">No exam records found.</p>
          </div>
        )}
      </div>

      {/* Response Map Overlay (if any) */}
      {showResponses && (
        <div className="mb-16 animate-in fade-in slide-in-from-top-4 duration-500">
          {(() => {
            const s = sessions.find(sess => sess.id === showResponses);
            if (!s) return null;
            return (
              <div className="bg-white border border-[#003366]/10 overflow-hidden shadow-xl">
                <div className="p-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
                  <h2 className="text-[10px] font-bold text-[#003366] uppercase tracking-widest">Report: {s.examType === 'UI_UX' ? 'UI/UX' : 'Full Stack'}</h2>
                  <button onClick={() => setShowResponses(null)}><XCircle size={16} className="text-zinc-300 hover:text-rose-500" /></button>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                     {[
                         { l: "Total Score", v: `${s.score || 0} / ${s.examType === 'UI_UX' ? '40' : '150'}` },
                         { l: "Result %", v: `${s.score !== null ? ((s.score / (s.examType === 'UI_UX' ? 40 : 150)) * 100).toFixed(1) : '0'}%`, color: "text-blue-600" },
                         { l: "Attempts", v: "1" },
                         { l: "Safety", v: `${100 - (s.violations * 10)}%`, color: s.violations > 0 ? "text-rose-500" : "text-emerald-600" }
                     ].map((m, i) => (
                        <div key={i} className="space-y-1">
                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.1em]">{m.l}</p>
                            <p className={`text-xl font-black ${m.color || "text-zinc-800"}`}>{m.v}</p>
                        </div>
                     ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Question Map</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {Array.isArray(s.questionMapping) && s.questionMapping.map((q: any, index: number) => {
                        const userAnswers = s.answers || {};
                        const choice = userAnswers[index];
                        const correct = (CORRECT_ANSWERS as any)[q.id];
                        const isCorrect = choice === correct;

                        return (
                          <div key={index} className="p-3 border border-zinc-100 bg-[#F8F9FA] flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <span className="text-[10px] font-bold text-zinc-300">Q{index + 1}</span>
                              <span className="text-[11px] font-medium text-zinc-600 truncate">{q.question}</span>
                            </div>
                            {isCorrect ? <CheckCircle2 className="text-emerald-500" size={14} /> : <XCircle className="text-rose-400" size={14} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Weekly Review Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
            <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Weekly Reviews</h2>
            <div className="h-px bg-zinc-100 flex-1"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.length > 0 ? (
            history.map((report) => (
              <div key={report.id} className="bg-white border border-zinc-100 p-6 shadow-sm hover:border-[#003366]/20 transition-all flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div className="px-2 py-0.5 bg-zinc-900 text-white text-[9px] font-bold uppercase tracking-widest">
                        {report.schedule.week}
                    </div>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase">{new Date(report.reviewedAt).toLocaleDateString()}</p>
                </div>
                
                <h4 className="text-sm font-bold text-[#003366] mt-2">{report.schedule.typeOfWork}</h4>
                
                {report.review && (
                  <div className="flex-1">
                      <p className="text-[11px] text-zinc-500 border-l-2 border-[#E0E7FF] pl-3 py-1 bg-zinc-50 leading-relaxed font-medium">
                        {report.review}
                      </p>
                  </div>
                )}

                <div className="pt-4 border-t border-zinc-50 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">Feedback</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-[#003366]">{report.marks}%</span>
                        <span className="text-[9px] font-bold text-zinc-300 uppercase">Score</span>
                    </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-zinc-50 border border-dashed border-zinc-200">
              <FileBox className="mx-auto mb-3 text-zinc-200" size={32} />
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">No reviews found yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
