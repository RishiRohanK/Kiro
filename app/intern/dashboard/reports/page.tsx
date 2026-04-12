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

export default function InternReportsPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const storedUser = localStorage.getItem("intern_user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);

      try {
        const res = await fetch("/api/exams/session");
        const data = await res.json();
        // Find the session for the current user
        const userSession = data.find((s: any) => s.userId === user.id);
        setSession(userSession);
      } catch (err) {
        console.error("Failed to fetch session");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
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
        <p className="text-sm text-zinc-500 mt-1">Check your exam results and details here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-zinc-200 p-4 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="bg-blue-50 p-2">
              <Award className="text-blue-600" size={20} />
            </div>
            <span className="text-[10px] font-medium text-zinc-400">Score</span>
          </div>
          <h3 className="text-2xl font-bold text-zinc-800">
            {session?.score !== null ? `${session?.score} / 150` : '0 / 150'}
          </h3>
          <p className="text-[10px] text-zinc-500 font-medium mt-1">Your final score</p>
        </div>

        <div className="bg-white border border-zinc-200 p-4 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="bg-red-50 p-2">
              <AlertCircle className="text-red-600" size={20} />
            </div>
            <span className="text-[10px] font-medium text-zinc-400">Warnings</span>
          </div>
          <h3 className="text-2xl font-bold text-zinc-800">{session?.violations || 0}</h3>
          <p className="text-[10px] text-zinc-500 font-medium mt-1">Rules broken</p>
        </div>

        <div className="bg-white border border-zinc-200 p-4 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="bg-green-50 p-2">
              <CheckCircle2 className="text-green-600" size={20} />
            </div>
            <span className="text-[10px] font-medium text-zinc-400">Status</span>
          </div>
          <h3 className={`text-xl font-bold ${session?.status === 'SUBMITTED' ? 'text-green-600' : 'text-zinc-500'}`}>
            {session?.status === 'SUBMITTED' ? 'Completed' : (session?.status ? session.status.charAt(0) + session.status.slice(1).toLowerCase() : 'No session')}
          </h3>
          <p className="text-[10px] text-zinc-500 font-medium mt-1">Update on your exam</p>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-100 bg-zinc-50 flex items-center gap-2">
          <ShieldCheck className="text-zinc-400" size={16} />
          <h2 className="text-xs font-bold text-zinc-800">Report details</h2>
        </div>
        <div className="p-4">
          {session ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] font-medium text-zinc-400 mb-1">Start time</p>
                  <p className="text-sm font-medium text-zinc-700">{new Date(session.startedAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-zinc-400 mb-1">Finish time</p>
                  <p className="text-sm font-medium text-zinc-700">
                    {session.status === 'SUBMITTED' ? new Date(session.updatedAt).toLocaleString() : 'Not finished'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-zinc-400 mb-1">Time taken</p>
                  <p className="text-sm font-medium text-zinc-700">
                    {Math.round((new Date(session.updatedAt).getTime() - new Date(session.startedAt).getTime()) / 60000)} mins
                  </p>
                </div>
                <div>
                   <p className="text-[10px] font-medium text-zinc-400 mb-1">Percentage</p>
                   <p className="text-sm font-bold text-blue-600">
                      {session.score !== null ? `${((session.score / 150) * 100).toFixed(1)}%` : '0.0%'}
                   </p>
                </div>
              </div>

              <div className="p-4 bg-blue-50/50 border border-blue-100">
                 <div className="flex gap-3 items-center">
                    <div className="h-8 w-8 bg-blue-100 flex items-center justify-center text-blue-600">
                       <TrendingUp size={16} />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-blue-800">Feedback</p>
                       <p className="text-xs text-blue-600 mt-0.5">
                          {session.score >= 105 ? "Great job. You have a solid understanding of the concepts." : 
                           session.score >= 75 ? "Good work. Try to focus more on advanced topics." :
                           "Keep practicing. We suggest reviewing the core architecture guides."}
                       </p>
                    </div>
                 </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <FileBox className="mx-auto text-zinc-200 mb-3" size={40} />
              <p className="text-sm text-zinc-400">No records found for your account.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
