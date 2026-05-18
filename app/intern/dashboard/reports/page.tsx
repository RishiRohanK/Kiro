"use client";

import { useEffect, useState } from "react";
import { 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";

export default function InternReportsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showResponses, setShowResponses] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = localStorage.getItem("intern_user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);

      try {
        const statusRes = await fetch(`/api/intern/status?id=${user.id}`);
        const statusData = await statusRes.json();
        setUserStatus(statusData);
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
        <div className="animate-spin h-7 w-7 border-2 border-[#003366] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="w-full pb-24 text-zinc-900 bg-[#FBFBFB] min-h-screen">
      
      {/* Page Header - Standardized */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-zinc-100 pb-5">
          <div className="flex items-center gap-3">
              <BarChart3 size={22} strokeWidth={2.25} className="text-[#003366]" />
              <div>
                  <h1 className="text-xl font-bold tracking-tight text-zinc-900 leading-none">My Reports & Analytics</h1>
                  <p className="text-zinc-500 text-xs mt-1 leading-relaxed">Detailed breakdown of your academic, submission, and attendance records.</p>
              </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-2.5 border border-zinc-150 rounded-xl shadow-sm">
              {[
                  { label: "Attendance", value: `${attendance}%`, color: "text-green-600" },
                  { label: "Exams", value: sessions.length, color: "text-[#003366]" },
                  { label: "Violations", value: sessions.reduce((acc, s) => acc + (s.violations || 0), 0), color: "text-rose-600" }
              ].map((stat, i) => (
                  <div key={i} className={`flex flex-col items-center px-5 ${i < 2 ? "border-r border-zinc-100" : ""}`}>
                      <span className={`text-xl font-extrabold ${stat.color}`}>{stat.value}</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 mt-0.5">{stat.label}</span>
                  </div>
              ))}
          </div>
      </div>

      <div className="space-y-12">
        {/* Exam Performance Section */}
        <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
                <FileText size={16} className="text-zinc-400" />
                <h2 className="text-[13px] font-bold text-zinc-500 uppercase tracking-widest">Exam Performance</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.length > 0 ? sessions.map((session) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={session.id} 
                        className="bg-white border border-zinc-100 rounded-md p-6 flex flex-col gap-4 hover:shadow-md transition-all group"
                    >
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] font-bold uppercase text-[#003366] bg-blue-50 px-2 py-0.5 rounded">
                                {session.examType || 'General'}
                            </span>
                            <span className="text-[11px] font-medium text-zinc-400">{new Date(session.startedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-zinc-800">{session.score || 0}</span>
                            <span className="text-sm text-zinc-300 font-bold tracking-widest">/ {session.examType === 'UI_UX' ? '40' : '150'}</span>
                        </div>
                        <div className="pt-4 border-t border-zinc-50 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <AlertCircle size={14} className={session.violations > 0 ? "text-red-400" : "text-zinc-200"} />
                                <span className="text-[10px] font-bold text-zinc-400 uppercase">Violations: {session.violations}</span>
                            </div>
                            <button 
                                onClick={() => setShowResponses(showResponses === session.id ? null : session.id)}
                                className="text-[11px] font-bold text-[#003366] uppercase hover:underline"
                            >
                                {showResponses === session.id ? "Close" : "Inspect"}
                            </button>
                        </div>
                    </motion.div>
                )) : (
                    <div className="col-span-full py-16 bg-white border border-dashed border-zinc-200 rounded-md text-center">
                        <p className="text-[13px] font-medium text-zinc-400">No exam sessions recorded yet.</p>
                    </div>
                )}
            </div>
        </section>

        {/* Mentorship Feedback Section */}
        <section className="space-y-6">
            <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
                <CheckCircle2 size={16} className="text-zinc-400" />
                <h2 className="text-[13px] font-bold text-zinc-500 uppercase tracking-widest">Mentorship Feedback</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {history.length > 0 ? history.map((report) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={report.id} 
                        className="bg-white border border-zinc-100 p-6 rounded-md space-y-4 hover:shadow-md transition-all"
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-white bg-[#003366] px-2 py-0.5 rounded uppercase tracking-wider">{report.schedule.week}</span>
                                <span className="text-[11px] font-medium text-zinc-400">{new Date(report.reviewedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-emerald-500">{report.marks}</span>
                                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Grade</span>
                            </div>
                        </div>
                        <h4 className="text-[15px] font-bold text-zinc-800 tracking-tight">{report.schedule.typeOfWork}</h4>
                        <div className="bg-zinc-50/50 border border-zinc-100 p-4 rounded-md">
                            <p className="text-[13px] text-zinc-500 font-medium leading-relaxed italic">
                                "{report.review || "No specific feedback recorded."}"
                            </p>
                        </div>
                    </motion.div>
                )) : (
                    <div className="col-span-full py-16 bg-white border border-dashed border-zinc-200 rounded-md text-center">
                        <p className="text-[13px] font-medium text-zinc-400">No weekly reviews available yet.</p>
                    </div>
                )}
            </div>
        </section>

        {/* My Documents & Certifications */}
        {(userStatus?.offerLetterUrl || userStatus?.letterUrl) && (
          <section className="space-y-6">
              <div className="flex items-center gap-2 border-b border-zinc-200 pb-3">
                  <CheckCircle2 size={16} className="text-zinc-400" />
                  <h2 className="text-[13px] font-bold text-zinc-500 uppercase tracking-widest">My Documents & Certifications</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userStatus?.offerLetterUrl && (
                     <motion.div 
                         initial={{ opacity: 0, y: 5 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="bg-white border border-zinc-100 p-6 rounded-md flex flex-col md:flex-row items-center justify-between gap-4 hover:shadow-md transition-all"
                     >
                         <div className="flex items-center gap-4">
                             <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                                 <CheckCircle2 size={20} />
                             </div>
                             <div>
                                 <h4 className="text-sm font-bold text-zinc-800">Internship Offer Letter</h4>
                                 <p className="text-[11px] text-zinc-400 font-medium">Issued official onboarding and terms document.</p>
                             </div>
                         </div>
                         <a 
                             href={userStatus.offerLetterUrl} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="w-full md:w-auto px-5 h-10 bg-[#003366] hover:bg-[#002244] text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all rounded-lg"
                         >
                             Download Offer Letter
                         </a>
                     </motion.div>
                  )}

                  {userStatus?.letterUrl && (
                     <motion.div 
                         initial={{ opacity: 0, y: 5 }}
                         animate={{ opacity: 1, y: 0 }}
                         className="bg-white border border-zinc-100 p-6 rounded-md flex flex-col md:flex-row items-center justify-between gap-4 hover:shadow-md transition-all"
                     >
                         <div className="flex items-center gap-4">
                             <div className="h-10 w-10 bg-blue-50 text-[#003366] rounded-full flex items-center justify-center shrink-0">
                                 <BarChart3 size={20} />
                             </div>
                             <div>
                                 <h4 className="text-sm font-bold text-zinc-800">Project Completion Certificate</h4>
                                 <p className="text-[11px] text-zinc-400 font-medium">Issued official technical project completion certificate.</p>
                             </div>
                         </div>
                         <a 
                             href={userStatus.letterUrl} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="w-full md:w-auto px-5 h-10 bg-[#003366] hover:bg-[#002244] text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all rounded-lg"
                         >
                             Download Certificate
                         </a>
                     </motion.div>
                  )}
              </div>
          </section>
        )}
      </div>
    </div>
  );
}
