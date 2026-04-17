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
                    <span className="text-[11px] font-medium opacity-50">Evaluation</span>
                </div>
                <h1 className="text-2xl font-bold text-[#003366]">Exams</h1>
                <p className="text-sm text-zinc-500 font-medium">Check and take your scheduled exams here.</p>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-[#003366] border-t-transparent rounded-full" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Active/Upcoming Exams */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-[#003366]">Scheduled exams</h2>
                            <span className="text-[11px] font-bold px-2 py-0.5 bg-[#E0E7FF] text-[#003366] rounded-full">
                                {exams.length} pending
                            </span>
                        </div>

                        {exams.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {exams.map((exam, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-white border border-zinc-100 p-6 shadow-sm hover:border-[#003366] transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="h-12 w-12 bg-[#E0E7FF] text-[#003366] flex items-center justify-center flex-shrink-0">
                                                <ClipboardCheck size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-[#003366] group-hover:text-blue-600 transition-colors">{exam.title}</h3>
                                                <div className="flex flex-wrap items-center gap-4 mt-2">
                                                    <div className="flex items-center gap-1.5 text-zinc-400">
                                                        <Calendar size={14} />
                                                        <span className="text-[11px] font-medium">{exam.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-zinc-400">
                                                        <Clock size={14} />
                                                        <span className="text-[11px] font-medium">{exam.duration} mins</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="h-11 px-8 bg-[#003366] text-white text-[12px] font-bold hover:bg-black transition-all flex items-center justify-center gap-2">
                                            Start test <ArrowUpRight size={14} />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-16 bg-zinc-50 border border-dashed border-zinc-200 text-center flex flex-col items-center justify-center">
                                <Lock size={32} className="text-zinc-200 mb-4" />
                                <h3 className="text-sm font-bold text-[#003366]">No exams scheduled</h3>
                                <p className="text-[11px] text-zinc-400 font-medium mt-1">Check back later for new tests.</p>
                            </div>
                        )}
                    </div>

                    {/* Guidelines & Results Summary */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="p-8 bg-[#003366] text-white shadow-xl shadow-blue-900/10 relative overflow-hidden">
                            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                            <h3 className="text-sm font-bold opacity-60 mb-4">Exam rules</h3>
                            <ul className="space-y-4 relative z-10 text-left">
                                {[
                                    "Face verification required to start.",
                                    "Do not open other browser tabs.",
                                    "Screen activity is recorded by AI.",
                                    "Ensure your internet is stable."
                                ].map((step, i) => (
                                    <li key={i} className="flex gap-3 text-[12px] font-medium leading-relaxed opacity-95">
                                        <span className="h-4 w-4 bg-white/20 flex items-center justify-center text-[10px] flex-shrink-0">•</span>
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-8 bg-zinc-50 border border-zinc-100 text-left">
                            <h3 className="text-sm font-bold text-[#003366] mb-4">Past results</h3>
                            <p className="text-[11px] text-zinc-500 font-medium leading-relaxed mb-6">
                                View your scores and performance history in the reports section.
                            </p>
                            <a 
                                href="/intern/dashboard/reports" 
                                className="inline-flex items-center gap-2 text-[11px] font-bold text-[#003366] hover:underline"
                            >
                                Open reports <ChevronRight size={14} />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
