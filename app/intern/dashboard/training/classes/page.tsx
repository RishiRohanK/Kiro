"use client";

import { useState } from "react";
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
    const [statusFilter, setStatusFilter] = useState("In Progress");

    const tabs = ["Class Groups", "Classes", "Activities"];
    const statuses = [
        { name: "In Progress", count: 0 },
        { name: "Upcoming", count: 0 },
        { name: "Past", count: 0 }
    ];

    return (
        <div className="min-h-screen bg-[#FBFBFB] font-sans">
            {/* Header - Changed to Blue */}
            <div className="px-5 lg:px-10 py-8 flex items-center gap-4">
                <ClipboardList size={32} className="text-[#003366]" />
                <h1 className="text-3xl font-medium text-zinc-800 tracking-tight">Training</h1>
            </div>

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
                        placeholder="Search" 
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-md text-[13px] focus:outline-none focus:ring-1 focus:ring-[#003366] focus:border-[#003366] transition-all"
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className="px-5 lg:px-10 py-4">
                <div className="w-full min-h-[400px] bg-white border border-zinc-100 rounded-md flex flex-col items-center justify-center text-center p-12 shadow-sm">
                    <div className="mb-8">
                        <div className="relative w-72 h-72 mx-auto">
                            <img 
                                src="https://ik.imagekit.io/dypkhqxip/Exams-bro.svg" 
                                alt="No classes available" 
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                    <h3 className="text-[16px] font-bold text-zinc-800 mb-2 tracking-tight">No classes available</h3>
                    <p className="text-[13px] text-zinc-400 max-w-sm mx-auto font-medium leading-relaxed">
                        No classes available at the moment.
                    </p>
                </div>
            </div>
        </div>
    );
}
