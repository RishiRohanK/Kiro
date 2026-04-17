"use client";

import { useEffect, useState } from "react";
import { 
    ClipboardCheck, 
    Calendar, 
    Clock, 
    AlertCircle, 
    ChevronRight,
    ArrowUpRight,
    Lock
} from "lucide-react";
import { motion } from "framer-motion";

export default function InternExamsPage() {
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const res = await fetch("/api/intern/exams");
                const data = await res.json();
                if (data.success) {
                    setExams(data.exams);
                }
            } catch (err) {
                console.error("Failed to fetch exams");
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, []);

    return (
        <div className="p-4 lg:p-6 max-w-[1200px] mx-auto font-sans pb-24 text-zinc-900">
            {/* Page Header */}
            <div className="mb-10 space-y-1">
                <div className="flex items-center gap-2 text-[#003366]">
                    <span className="text-[11px] font-semibold opacity-50 uppercase tracking-widest">Evaluation Hub</span>
                </div>
                <h1 className="text-3xl font-semibold text-[#003366]">Exams</h1>
                <p className="text-sm text-zinc-500 font-medium">Your evaluation schedule and track performance.</p>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-[#003366] border-t-transparent rounded-full" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Active/Upcoming Exams */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                            <h2 className="text-sm font-semibold text-[#003366] uppercase tracking-wider">Scheduled Track</h2>
                            <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#E0E7FF] text-[#003366] rounded-none">
                                {exams.length} Pending
                            </span>
                        </div>

                        {exams.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {exams.map((exam, i) => {
                                    const today = new Date().toISOString().split('T')[0];
                                    const examDate = exam.date.split('T')[0];
                                    const isToday = examDate === today;
                                    
                                    return (
                                        <motion.div 
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="bg-zinc-50 border border-zinc-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-white hover:border-[#003366]/20 transition-all duration-300"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="h-12 w-12 bg-white border border-zinc-100 text-[#003366] flex items-center justify-center flex-shrink-0 group-hover:bg-[#003366] group-hover:text-white transition-all">
                                                    <ClipboardCheck size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-[#003366]">{exam.title}</h3>
                                                    <div className="flex flex-wrap items-center gap-4 mt-2">
                                                        <div className="flex items-center gap-1.5 text-zinc-400">
                                                            <Calendar size={13} />
                                                            <span className="text-[11px] font-semibold">{exam.date}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-zinc-400">
                                                            <Clock size={13} />
                                                            <span className="text-[11px] font-semibold">{exam.duration} mins</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {isToday ? (
                                                <a 
                                                    href="https://platform.studentforge.in/exams"
                                                    target="_blank"
                                                    className="h-11 px-8 bg-[#003366] text-white text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-2"
                                                >
                                                    Start test <ArrowUpRight size={14} />
                                                </a>
                                            ) : (
                                                <a 
                                                    href="https://platform.studentforge.in/exams"
                                                    target="_blank"
                                                    className="h-11 px-8 bg-white border border-zinc-200 text-zinc-900 text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-zinc-50 transition-all flex items-center justify-center gap-2"
                                                >
                                                    Syllabus <ChevronRight size={14} />
                                                </a>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-20 bg-zinc-50 border border-zinc-100 text-center flex flex-col items-center justify-center">
                                <Lock size={32} className="text-zinc-200 mb-4" />
                                <h3 className="text-sm font-semibold text-[#003366] uppercase tracking-widest">No Active Tests</h3>
                                <p className="text-[11px] text-zinc-400 font-medium mt-1">Evaluations will appear here when scheduled.</p>
                            </div>
                        )}
                    </div>

                    {/* Guidelines & Results Summary */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="p-8 bg-[#003366] text-white relative overflow-hidden">
                            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                            <h3 className="text-xs font-semibold uppercase tracking-widest opacity-60 mb-6 border-b border-white/10 pb-2">Exam Protocols</h3>
                            <ul className="space-y-5 relative z-10 text-left">
                                {[
                                    "Face verification required to start.",
                                    "Do not open other browser tabs.",
                                    "Screen activity is recorded by AI.",
                                    "Ensure your internet is stable."
                                ].map((step, i) => (
                                    <li key={i} className="flex gap-4 text-[12px] font-semibold leading-relaxed opacity-90">
                                        <span className="h-5 w-5 bg-white/10 flex items-center justify-center text-[10px] flex-shrink-0">0{i+1}</span>
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-8 bg-zinc-100 border border-zinc-200 text-left">
                            <h3 className="text-xs font-semibold text-[#003366] uppercase tracking-widest mb-4">Past Activity</h3>
                            <p className="text-[11px] text-zinc-500 font-medium leading-relaxed mb-6">
                                View your scores and performance history in the reports section.
                            </p>
                            <a 
                                href="/intern/dashboard/reports" 
                                className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#003366] hover:underline"
                            >
                                Final Reports <ChevronRight size={14} />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
