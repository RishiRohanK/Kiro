"use client";

import { useEffect, useState } from "react";
import { 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
        const exRes = await fetch("/api/exams/session");
        const exData = await exRes.json();
        const userSessions = Array.isArray(exData) ? exData.filter((s: any) => s.userId === user.id) : [];
        setSessions(userSessions);

        const histRes = await fetch(`/api/intern/reports?internId=${user.id}`);
        const histData = await histRes.json();
        if (histData.success) {
          setHistory(histData.reports);
        }

        const attRes = await fetch(`/api/intern/attendance?internId=${user.id}`);
        const attData = await attRes.json();
        if (attData.success) {
           const ratio = attData.history.length > 0 ? (attData.history.filter((a: any) => a.status === 'PRESENT').length / attData.totalTrackingDays) * 100 : 0;
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
      <div className="py-20 flex justify-center">
        <div className="animate-spin h-6 w-6 border-2 border-[#003366] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-[1200px] mx-auto font-sans pb-24">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-1">
              <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-[#E0E7FF] rounded-lg flex items-center justify-center text-[#003366]">
                      <BarChart3 size={18} />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Analytics Node</span>
              </div>
              <h1 className="text-2xl font-bold text-[#003366]">My Reports</h1>
              <p className="text-[12px] text-zinc-500 font-medium">Detailed breakdown of your academic and attendance records.</p>
          </div>

          <div className="flex items-center gap-3">
              {[
                  { label: "Attendance", value: `${attendance}%`, icon: TrendingUp, color: "text-emerald-500" },
                  { label: "Exam Scores", value: sessions.length, icon: FileText, color: "text-[#003366]" },
                  { label: "Alerts", value: sessions.reduce((acc, s) => acc + (s.violations || 0), 0), icon: AlertCircle, color: "text-red-500" }
              ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-lg min-w-[80px]">
                      <span className={`text-sm font-bold ${stat.color}`}>{stat.value}</span>
                      <span className="text-[9px] font-bold uppercase tracking-tighter text-zinc-400">{stat.label}</span>
                  </div>
              ))}
          </div>
      </div>

      <div className="space-y-10">
        {/* Simplified Exam Section */}
        <section className="space-y-4">
            <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] border-b border-zinc-100 pb-2">Exam Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions.map((session) => (
                    <div key={session.id} className="bg-white border border-zinc-200 rounded-lg p-5 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <span className="text-[9px] font-bold uppercase text-[#003366] bg-blue-50 px-1.5 py-0.5 rounded">
                                {session.examType || 'General'}
                            </span>
                            <span className="text-[10px] font-bold text-zinc-400">{new Date(session.startedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-[#003366]">{session.score || 0}</span>
                            <span className="text-xs text-zinc-300 font-bold">/ {session.examType === 'UI_UX' ? '40' : '150'}</span>
                        </div>
                        <div className="pt-3 border-t border-zinc-50 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">Violations: {session.violations}</span>
                            <button 
                                onClick={() => setShowResponses(showResponses === session.id ? null : session.id)}
                                className="text-[10px] font-bold text-[#003366] uppercase hover:underline"
                            >
                                {showResponses === session.id ? "Hide" : "Inspect"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Simplified Weekly Reviews */}
        <section className="space-y-4">
            <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em] border-b border-zinc-100 pb-2">Mentorship Feedback</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {history.map((report) => (
                    <div key={report.id} className="bg-white border border-zinc-200 p-5 rounded-lg space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-white bg-black px-2 py-0.5 rounded">{report.schedule.week}</span>
                            <span className="text-[10px] font-bold text-zinc-400">{new Date(report.reviewedAt).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-sm font-bold text-[#003366]">{report.schedule.typeOfWork}</h4>
                        <p className="text-[12px] text-zinc-500 leading-relaxed italic border-l-2 border-[#E0E7FF] pl-3 py-1 bg-zinc-50 rounded-r-md">
                            {report.review || "No specific feedback recorded."}
                        </p>
                        <div className="pt-2 flex justify-end">
                            <span className="text-lg font-bold text-[#003366]">{report.marks}% Grade</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
      </div>
    </div>
  );
}
