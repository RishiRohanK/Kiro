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
    <div className="p-8 max-w-6xl mx-auto font-sans">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-zinc-800 uppercase tracking-widest">Assessment Reports</h1>
        <p className="text-xs text-zinc-400 font-bold uppercase mt-1">Check your examination performance and details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border-2 border-zinc-100 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-50 p-3 rounded-none">
              <Award className="text-blue-600" size={24} />
            </div>
            <span className="text-[10px] font-black text-zinc-300 uppercase">Score Node</span>
          </div>
          <h3 className="text-3xl font-black text-zinc-800">
            {session?.score !== null ? `${session?.score} / 150` : 'N/A'}
          </h3>
          <p className="text-[10px] text-zinc-400 font-bold uppercase mt-2">Final Correct Nodes</p>
        </div>

        <div className="bg-white border-2 border-zinc-100 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-red-50 p-3 rounded-none">
              <AlertCircle className="text-red-600" size={24} />
            </div>
            <span className="text-[10px] font-black text-zinc-300 uppercase">Violation Node</span>
          </div>
          <h3 className="text-3xl font-black text-zinc-800">{session?.violations || 0}</h3>
          <p className="text-[10px] text-zinc-400 font-bold uppercase mt-2">Integrity Warnings</p>
        </div>

        <div className="bg-white border-2 border-zinc-100 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-green-50 p-3 rounded-none">
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
            <span className="text-[10px] font-black text-zinc-300 uppercase">Status Node</span>
          </div>
          <h3 className={`text-xl font-black ${session?.status === 'SUBMITTED' ? 'text-green-600' : 'text-zinc-400'}`}>
            {session?.status || 'NOT STARTED'}
          </h3>
          <p className="text-[10px] text-zinc-400 font-bold uppercase mt-2">Latest Session Status</p>
        </div>
      </div>

      <div className="bg-white border-2 border-zinc-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-50 bg-zinc-50 flex items-center gap-3">
          <ShieldCheck className="text-zinc-400" size={18} />
          <h2 className="text-xs font-black text-zinc-800 uppercase tracking-widest">Detail Report Node</h2>
        </div>
        <div className="p-8">
          {session ? (
            <div className="space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Started At</p>
                  <p className="text-sm font-bold text-zinc-700">{new Date(session.startedAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Submitted At</p>
                  <p className="text-sm font-bold text-zinc-700">
                    {session.status === 'SUBMITTED' ? new Date(session.updatedAt).toLocaleString() : 'PENDING'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Duration Used</p>
                  <p className="text-sm font-bold text-zinc-700">
                    {Math.round((new Date(session.updatedAt).getTime() - new Date(session.startedAt).getTime()) / 60000)} mins
                  </p>
                </div>
                <div>
                   <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">Result Percentage</p>
                   <p className="text-sm font-black text-blue-600">
                      {session.score !== null ? `${((session.score / 150) * 100).toFixed(1)}%` : '0.0%'}
                   </p>
                </div>
              </div>

              <div className="p-6 bg-blue-50/50 border border-blue-100">
                 <div className="flex gap-4 items-center">
                    <div className="h-10 w-10 bg-blue-100 flex items-center justify-center text-blue-600">
                       <TrendingUp size={20} />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-blue-800 uppercase">Intern Performance Comment</p>
                       <p className="text-[11px] text-blue-600 font-bold mt-1">
                          {session.score >= 105 ? "Excellent performance in Full Stack Concepts." : 
                           session.score >= 75 ? "Good attempt. Focus on advanced Cloud & DevOps nodes." :
                           "Requires improvement. Review the core MERN architecture guides."}
                       </p>
                    </div>
                 </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center">
              <FileBox className="mx-auto text-zinc-200 mb-4" size={48} />
              <p className="text-xs font-bold text-zinc-400 uppercase">No assessment record found for your ID.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
