"use client";

import { useState, useEffect } from "react";
import { 
    Search, 
    ChevronDown, 
    ClipboardList, 
    Filter, 
    MoreVertical,
    Calendar,
    Clock,
    User
} from "lucide-react";
import { motion } from "framer-motion";

export default function TrainingClassesPage() {
    const [activeTab, setActiveTab] = useState("Classes");
    const [viewMode, setViewMode] = useState("Regular");
    const [statusFilter, setStatusFilter] = useState("Upcoming");
    const [userBatch, setUserBatch] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const tabs = ["Class Groups", "Classes", "Activities"];

    useEffect(() => {
        const checkBatch = async () => {
            try {
                const storedUser = localStorage.getItem("intern_user");
                if (storedUser) {
                    const parsed = JSON.parse(storedUser);
                    // Try to get batch from stored user first
                    if (parsed.batch) {
                        setUserBatch(parsed.batch);
                    }
                    
                    // Fetch fresh profile data to be sure
                    const res = await fetch(`/api/intern/profile?userId=${parsed.id}`);
                    const data = await res.json();
                    if (data.success && data.intern) {
                        setUserBatch(data.intern.batch);
                        localStorage.setItem("intern_user", JSON.stringify({ ...parsed, batch: data.intern.batch }));
                    }
                }
            } catch (error) {
                console.error("Batch check failed:", error);
            } finally {
                setLoading(false);
            }
        };
        checkBatch();
    }, []);
    
    // Generate 32 classes including today's session with dynamic status
    const classes = (() => {
        // ... (previous classes generation logic)
        const list = [];
        const meetingLink = "https://meet.google.com/mji-bixk-xmh";
        const today = new Date();
        const now = new Date();
        
        const createSession = (id: string, title: string, dateStr: string, timeStr: string, topic: string) => {
            const classDate = new Date(dateStr.split('/').reverse().join('-'));
            const isToday = today.toDateString() === classDate.toDateString();
            const isFuture = classDate > today;
            const isSixPM = now.getHours() >= 18;
            
            let status = "Upcoming";
            if (isToday && isSixPM) status = "In Progress";
            else if (!isToday && !isFuture) status = "Past";

            return {
                id,
                title,
                instructor: "Redlix Technical Team",
                date: dateStr,
                time: timeStr,
                link: meetingLink,
                status,
                topic
            };
        };

        // Today's Session (15-05-2026)
        list.push(createSession(
            "class-today",
            "Live Technical Orientation & Setup",
            "15/05/2026",
            "6:00 PM - 7:30 PM",
            "Development Environment & Workflow"
        ));

        const startDate = new Date("2026-05-16");
        for (let i = 0; i < 31; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const dateStr = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const isLastDay = dateStr === "15/06/2026";
            
            list.push(createSession(
                `class-${i}`,
                isLastDay ? "Final Review & Graduation" : `Fullstack Development - Session ${i + 1}`,
                dateStr,
                isLastDay ? "6:00 PM - 7:30 PM" : "5:00 PM - 6:00 PM",
                isLastDay ? "Final Assessment & Roadmap" : "Industry Standards & Best Practices"
            ));
        }
        return list;
    })();

    const filteredClasses = classes.filter(c => c.status === statusFilter);

    const statuses = [
        { name: "In Progress", count: classes.filter(c => c.status === "In Progress").length },
        { name: "Upcoming", count: classes.filter(c => c.status === "Upcoming").length },
        { name: "Past", count: 0 }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FBFBFB] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="h-8 w-8 border-2 border-zinc-200 border-t-[#003366] rounded-full" 
                    />
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Verifying Batch Status</p>
                </div>
            </div>
        );
    }

    // Restriction Logic: Only Batch 3 can see upcoming and in progress classes
    const isBatch3 = userBatch === "Batch 3";

    return (
        <div className="min-h-screen bg-[#FBFBFB] font-sans pb-20">
            {/* Header - Changed to Blue */}
            <div className="px-5 lg:px-10 py-8 flex items-center gap-4">
                <ClipboardList size={32} className="text-[#003366]" />
                <h1 className="text-3xl font-medium text-zinc-800 tracking-tight">Training</h1>
            </div>

            {!isBatch3 ? (
                <div className="px-5 lg:px-10 py-12">
                    <div className="w-full min-h-[450px] bg-white border border-zinc-100 rounded-2xl flex flex-col items-center justify-center text-center p-12 shadow-sm">
                        <div className="mb-8">
                            <div className="relative w-72 h-72 mx-auto">
                                <img 
                                    src="https://ik.imagekit.io/dypkhqxip/Access-denied-bro.svg" 
                                    alt="Access Restricted" 
                                    className="w-full h-full object-contain grayscale opacity-40"
                                />
                            </div>
                        </div>
                        <h2 className="text-xl font-medium text-zinc-800 mb-3 tracking-tight">Session Access Restricted</h2>
                        <p className="text-[14px] text-zinc-500 max-w-md mx-auto leading-relaxed">
                            These training sessions are exclusively available for <span className="font-bold text-[#003366]">Batch 3</span> interns.
                        </p>
                        <div className="mt-8 flex flex-col gap-2">
                            <div className="px-6 py-2 bg-zinc-50 border border-zinc-100 rounded text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                                Your Current Status: {userBatch || "Unassigned"}
                            </div>
                            <p className="text-[10px] text-zinc-300 italic mt-2">
                                Please contact your reporting manager if you believe this is an error.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Navigation & Controls */}
                    <div className="px-5 lg:px-10 py-1 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-200">
                        {/* Tabs - Changed to Blue */}
                        <div className="flex items-center gap-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 text-[13px] font-medium transition-all relative ${
                                        activeTab === tab 
                                        ? "text-[#003366]" 
                                        : "text-zinc-500 hover:text-zinc-700"
                                    }`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <motion.div 
                                            layoutId="activeTabUnderline"
                                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#003366]"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Regular/Playground Toggle - Changed to Blue */}
                        <div className="flex bg-white rounded-md border border-zinc-200 p-0 overflow-hidden shadow-sm mb-4 md:mb-0">
                            <button
                                onClick={() => setViewMode("Regular")}
                                className={`px-8 py-2 text-[11px] font-bold tracking-widest transition-all ${
                                    viewMode === "Regular"
                                    ? "bg-[#003366] text-white"
                                    : "bg-white text-[#003366] hover:bg-zinc-50"
                                }`}
                            >
                                REGULAR
                            </button>
                            <button
                                onClick={() => setViewMode("Playground")}
                                className={`px-8 py-2 text-[11px] font-bold tracking-widest transition-all border-l border-zinc-100 ${
                                    viewMode === "Playground"
                                    ? "bg-[#003366] text-white"
                                    : "bg-white text-[#003366] hover:bg-zinc-50"
                                }`}
                            >
                                PLAYGROUND
                            </button>
                        </div>
                    </div>

                    {/* Filters Row */}
                    <div className="px-5 lg:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Status Pills - Changed to Blue */}
                        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                            {statuses.map((s) => (
                                <button
                                    key={s.name}
                                    onClick={() => setStatusFilter(s.name)}
                                    className={`px-4 py-2 rounded-md border text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                                        statusFilter === s.name
                                        ? "bg-[#003366] border-[#003366] text-white shadow-sm"
                                        : "bg-white border-[#003366]/30 text-[#003366] hover:bg-[#F0F4FF]"
                                    }`}
                                >
                                    {s.name} ({s.count})
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                            <input 
                                type="text" 
                                placeholder="Search sessions..." 
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-md text-[13px] focus:outline-none focus:ring-1 focus:ring-[#003366] focus:border-[#003366] transition-all"
                            />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="px-5 lg:px-10 py-6">
                        {filteredClasses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredClasses.map((cls, idx) => (
                                    <motion.div 
                                        key={cls.id}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: Math.min(idx * 0.03, 0.5) }}
                                        className="bg-white border border-zinc-100 rounded-xl overflow-hidden hover:shadow-lg hover:border-[#003366]/20 transition-all group flex flex-col sm:flex-row h-full"
                                    >
                                        {/* Left Side: Image */}
                                        <div className="sm:w-1/3 h-40 sm:h-auto relative overflow-hidden bg-zinc-100 border-r border-zinc-50">
                                            <img 
                                                src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000&auto=format&fit=crop" 
                                                alt={cls.title} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            {cls.status === "In Progress" && (
                                                <div className="absolute top-2 left-2 px-2 py-1 bg-red-500/90 backdrop-blur-sm rounded text-[8px] font-black text-white tracking-widest animate-pulse">
                                                    LIVE
                                                </div>
                                            )}
                                        </div>

                                        {/* Right Side: Content */}
                                        <div className="flex-1 p-5 flex flex-col justify-between">
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={13} className="text-zinc-300" />
                                                        <span className="text-[11px] font-medium text-zinc-400">{cls.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {cls.status === "In Progress" ? (
                                                            <span className="flex items-center gap-1 text-[9px] font-medium text-red-500 animate-pulse">
                                                                <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                                                LIVE NOW
                                                            </span>
                                                        ) : (
                                                            <span className={`text-[9px] font-medium px-2 py-0.5 rounded tracking-wide ${
                                                                new Date(cls.date.split('/').reverse().join('-')).toDateString() === new Date().toDateString() 
                                                                ? "text-emerald-600 bg-emerald-50" 
                                                                : "text-blue-600 bg-blue-50"
                                                            }`}>
                                                                {new Date(cls.date.split('/').reverse().join('-')).toDateString() === new Date().toDateString() ? "TODAY" : cls.status.toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-[15px] font-medium text-zinc-800 group-hover:text-[#003366] transition-colors leading-tight line-clamp-2">
                                                        {cls.title}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-3 mt-3 text-zinc-400">
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock size={12} className="text-zinc-300" />
                                                            <span className="text-[11px]">{cls.time}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <User size={12} className="text-zinc-300" />
                                                            <span className="text-[11px] truncate max-w-[100px]">{cls.instructor}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-5 flex items-center gap-2">
                                                {new Date(cls.date.split('/').reverse().join('-')).toDateString() === new Date().toDateString() ? (
                                                    <a 
                                                        href={cls.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex-1 py-2 text-[10px] font-medium uppercase tracking-widest rounded-lg transition-all text-center border bg-[#003366] text-white border-[#003366] hover:bg-[#002244] shadow-md shadow-blue-900/10"
                                                    >
                                                        Join Session
                                                    </a>
                                                ) : (
                                                    <button 
                                                        disabled
                                                        className="flex-1 py-2 text-[10px] font-medium uppercase tracking-widest rounded-lg text-zinc-300 border border-zinc-100 bg-zinc-50 cursor-not-allowed"
                                                    >
                                                        Locked
                                                    </button>
                                                )}
                                                <button className="p-2 text-zinc-300 hover:text-zinc-500 transition-colors">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="w-full min-h-[400px] bg-white border border-zinc-100 rounded-lg flex flex-col items-center justify-center text-center p-12 shadow-sm">
                                <div className="mb-8">
                                    <div className="relative w-64 h-64 mx-auto">
                                        <img 
                                            src="https://ik.imagekit.io/dypkhqxip/Exams-bro.svg" 
                                            alt="No classes available" 
                                            className="w-full h-full object-contain grayscale opacity-50"
                                        />
                                    </div>
                                </div>
                                <p className="text-[12px] text-zinc-400 max-w-sm mx-auto">
                                    Check back later for updated training schedules.
                                </p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
