"use client";

import { useEffect, useState } from "react";
import {
    ClipboardList,
    Calendar,
    Clock,
    ChevronRight,
    CheckSquare,
    MinusSquare,
    AlertCircle,
    Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Exam = {
    id: string;
    title: string;
    description?: string;
    date: string;       
    duration: string;   
    batch: string;
    link?: string;
    endDate?: string;
    createdAt: string;
};

const tabs = ["Yet to Attempt", "Attempted", "Not Attempted"] as const;
type Tab = typeof tabs[number];

function formatDateRange(start: string, end?: string) {
    const fmt = (d: string) => {
        const dt = new Date(d);
        return dt.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };
    return end ? `${fmt(start)} – ${fmt(end)}` : fmt(start);
}

function timeAgo(dateStr: string) {
    const now = new Date();
    const then = new Date(dateStr);
    const diff = Math.floor((now.getTime() - then.getTime()) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
    return `${Math.floor(diff / 2592000)} months ago`;
}

function getExamStatus(exam: Exam): Tab {
    const examDate = new Date(exam.date);
    const now = new Date();
    if (examDate > now) return "Yet to Attempt";
    return "Not Attempted";
}

function isEnded(exam: Exam) {
    return new Date(exam.date) < new Date();
}

function ExamCard({ exam, tab }: { exam: Exam; tab: Tab }) {
    const ended = isEnded(exam);
    const refDate = exam.endDate || exam.date;

    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-zinc-200 rounded-md p-6 flex flex-col gap-4 relative hover:shadow-sm transition-all"
        >
            <div className="flex justify-between items-start">
                <span className="bg-red-50 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded">
                    {ended ? "Ended" : "Active"}
                </span>
                <span className="text-[11px] text-zinc-400 font-medium">{timeAgo(exam.createdAt || refDate)}</span>
            </div>

            <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#003366]">
                    {exam.title}
                </h3>
                {exam.description ? (
                    <p className="text-[13px] text-zinc-500 leading-relaxed max-w-2xl">
                        {exam.description}
                    </p>
                ) : (
                    <p className="text-[13px] text-zinc-400 leading-relaxed italic">
                        No additional instructions provided for this assessment.
                    </p>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-1">
                <div className="flex items-center gap-2 text-zinc-500">
                    <Calendar size={16} />
                    <span className="text-[12px] font-medium">{formatDateRange(exam.date, exam.endDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-500">
                    <Clock size={16} />
                    <span className="text-[12px] font-medium">Duration: {exam.duration} mins</span>
                </div>
            </div>

            <div className="flex justify-end mt-2">
                <a
                    href={exam.link || "https://platform.studentforge.in/exams"}
                    target="_blank"
                    className="flex items-center gap-1.5 text-[12px] font-bold text-[#003366] hover:underline"
                >
                    View Details <ChevronRight size={14} />
                </a>
            </div>
        </motion.div>
    );
}

export default function InternExamsPage() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>("Yet to Attempt");
    const [userBatch, setUserBatch] = useState<string>("All");

    useEffect(() => {
        try {
            const stored = localStorage.getItem("intern_user");
            if (stored) {
                const u = JSON.parse(stored);
                setUserBatch(u.batch || "All");
            }
        } catch {}

        const fetchExams = async () => {
            try {
                const res = await fetch("/api/intern/exams");
                const data = await res.json();
                if (data.success) setExams(data.exams);
            } catch {} finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    const filteredExams = exams.filter(
        e => e.batch === "All" || e.batch === userBatch || userBatch === "All"
    );

    const yetToAttempt = filteredExams.filter(e => getExamStatus(e) === "Yet to Attempt");
    const attempted = filteredExams.filter(e => getExamStatus(e) === "Attempted");
    const notAttempted = filteredExams.filter(e => getExamStatus(e) === "Not Attempted");

    const visibleExams = activeTab === "Yet to Attempt" ? yetToAttempt : activeTab === "Attempted" ? attempted : notAttempted;

    return (
        <div className="p-4 lg:p-10 w-full mx-auto font-sans pb-24 text-zinc-900 bg-[#FBFBFB] min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-4 mb-10">
                <ClipboardList size={32} className="text-[#003366]" />
                <div>
                    <h1 className="text-3xl font-bold text-[#003366]">Assessments</h1>
                    <p className="text-[13px] text-zinc-400 font-medium">Attempt and review your technical evaluations.</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                    { label: "Attempted", count: attempted.length, icon: CheckSquare, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Yet to Attempt", count: yetToAttempt.length, icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Not Attempted", count: notAttempted.length, icon: MinusSquare, color: "text-red-600", bg: "bg-red-50" }
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-zinc-200 p-5 rounded-md flex items-center justify-between group hover:border-[#003366]/20 transition-all">
                        <div className="space-y-1">
                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
                        </div>
                        <div className={`h-10 w-10 ${stat.bg} ${stat.color} flex items-center justify-center rounded-lg`}>
                            <stat.icon size={20} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex items-center border-b border-zinc-200 mb-8 gap-1 overflow-x-auto scrollbar-hide">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative px-6 py-4 text-[13px] font-bold transition-all whitespace-nowrap ${
                            activeTab === tab
                                ? "text-[#003366]"
                                : "text-zinc-400 hover:text-zinc-600"
                        }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div layoutId="exam-tab-line" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#003366] rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="py-20 flex justify-center">
                    <div className="animate-spin h-7 w-7 border-2 border-[#003366] border-t-transparent rounded-full" />
                </div>
            ) : (
                <div className="w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="space-y-4"
                        >
                            {visibleExams.length > 0 ? (
                                visibleExams.map((exam, i) => (
                                    <ExamCard key={exam.id || i} exam={exam} tab={activeTab} />
                                ))
                            ) : (
                                <div className="py-20 text-center bg-white border border-zinc-100 rounded-md">
                                    <p className="text-[14px] font-medium text-zinc-400">No assessments found in this category.</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
