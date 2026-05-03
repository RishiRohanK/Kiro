"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
            className="bg-white border border-zinc-100 rounded-md p-6 flex flex-col gap-5 relative hover:border-[#003366]/10 hover:shadow-md hover:shadow-[#003366]/5 transition-all group"
        >
            <div className="flex justify-between items-start">
                <span className="bg-red-50 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded">
                    {ended ? "Ended" : "Active"}
                </span>
                <span className="text-[11px] text-zinc-400 font-medium">{timeAgo(exam.createdAt || refDate)}</span>
            </div>

            <div className="space-y-3">
                <h3 className="text-xl font-medium text-[#FF8C42] tracking-tight">
                    {exam.title}
                </h3>
                {exam.description && (
                    <div className="flex gap-2.5 items-start bg-zinc-50/50 border border-zinc-100 p-3 rounded-md">
                        <Info size={16} className="text-zinc-400 mt-0.5 flex-shrink-0" />
                        <p className="text-[12px] text-zinc-500 leading-relaxed">
                            {exam.description}
                        </p>
                    </div>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-1">
                <div className="flex items-center gap-2 text-zinc-400">
                    <Calendar size={14} />
                    <span className="text-[11px]">{formatDateRange(exam.date, exam.endDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400 border border-zinc-100 px-2 py-1 rounded bg-zinc-50">
                    <span className="text-[11px] text-zinc-500">Duration: {exam.duration} mins</span>
                </div>
            </div>

            <div className="flex justify-end mt-2">
                <Link
                    href={exam.link || `/exams?id=${exam.id}`}
                    className="flex items-center gap-1 text-[12px] font-medium text-blue-500 hover:underline"
                >
                    View Details <ChevronRight size={14} />
                </Link>
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
            <div className="flex items-center gap-3 mb-8">
                <ClipboardList size={32} className="text-[#FF8C42]" />
                <h1 className="text-3xl font-medium text-zinc-800">Assessments</h1>
            </div>

            {/* Tabs */}
            <div className="flex items-center border-b border-zinc-200 mb-8 gap-6 overflow-x-auto scrollbar-hide">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative pb-4 text-[13px] font-medium transition-all whitespace-nowrap ${
                            activeTab === tab
                                ? "text-[#FF8C42]"
                                : "text-zinc-500 hover:text-zinc-700"
                        }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div layoutId="exam-tab-line" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF8C42]" />
                        )}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="py-20 flex justify-center">
                    <div className="animate-spin h-7 w-7 border-2 border-[#FF8C42] border-t-transparent rounded-full" />
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Left: Cards List */}
                    <div className="flex-1 w-full space-y-4">
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

                    {/* Right: Sidebar Stats */}
                    <div className="w-full lg:w-[320px] flex-shrink-0 bg-white border border-zinc-200 rounded-md overflow-hidden">
                        {[
                            { label: "ATTEMPTED", count: attempted.length, icon: CheckSquare, subtext: "Attempted Assessments" },
                            { label: "YET TO ATTEMPT", count: yetToAttempt.length, icon: Clock, subtext: "Yet to be attempted assessments" },
                            { label: "NOT ATTEMPTED", count: notAttempted.length, icon: MinusSquare, subtext: "Not Attempted Assessments" }
                        ].map((stat, i) => (
                            <div key={i} className={`p-6 flex flex-col gap-3 ${i < 2 ? "border-b border-zinc-100" : ""}`}>
                                <div className="flex items-center gap-2">
                                    <stat.icon size={16} className="text-[#FF8C42]" />
                                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</span>
                                </div>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-bold text-emerald-500">{stat.count}</span>
                                    <span className="text-[12px] font-medium text-zinc-400">{stat.subtext}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
