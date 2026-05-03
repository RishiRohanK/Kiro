"use client";

import { useEffect, useState } from "react";
import { 
    Calendar, 
    ChevronRight, 
    ExternalLink, 
    Github, 
    Clock, 
    Terminal,
    Target,
    RefreshCw,
    Lock,
    CheckCircle2,
    Edit3,
    Hand
} from "lucide-react";
import { motion } from "framer-motion";

interface ScheduleItem {
    id: string;
    week: string;
    typeOfWork: string;
    toolsUsed: string[];
    deploymentTools: string[];
    requirements: string[];
    description: string;
    outcomes: string[];
    deadline: string;
    submissionLink?: string;
    githubLink?: string;
    isCompleted: boolean;
    teamAllocation?: string;
    mentorName?: string;
    projectName?: string;
    projectDocLink?: string;
    teamLead?: string;
    teamInternIds?: string[];
    teamInternNames?: string[];
    isManualOpen: boolean;
}

export default function SchedulePage() {
    const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);
    const [submissionData, setSubmissionData] = useState({ githubLink: "", submissionLink: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("intern_user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        }
    }, []);

    useEffect(() => {
        if (user) fetchSchedules();
    }, [user]);

    const fetchSchedules = async () => {
        try {
            const query = user?.batch ? `?internId=${user.id}&batch=${encodeURIComponent(user.batch)}` : `?internId=${user.id}`;
            const res = await fetch(`/api/intern/schedule${query}`);
            const data = await res.json();
            if (data.success) {
                setSchedules(data.schedules);
            }
        } catch (error) {
            console.error("Failed to fetch schedules");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmission = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSchedule || !user) return;

        
        if (new Date(selectedSchedule.deadline) < new Date() && !selectedSchedule.isManualOpen) {
            alert("Submission window is closed. The deadline for this module has passed.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/intern/schedule/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    scheduleId: selectedSchedule.id,
                    internId: user.id,
                    githubLink: submissionData.githubLink,
                    submissionLink: submissionData.submissionLink
                })
            });
            const data = await res.json();
            if (data.success) {
                alert("Submitted successfully");
                setSelectedSchedule(null);
                setSubmissionData({ githubLink: "", submissionLink: "" });
                fetchSchedules();
            }
        } catch (error) {
            console.error("Submission failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="p-10 text-center text-sm text-zinc-500">
            Loading schedule...
        </div>
    );

    return (
        <div className="p-6 lg:p-10 w-full bg-zinc-50 min-h-screen pb-24">
            <header className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-1 w-6 bg-[#0055FF]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Internship Roadmap</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                    Your <span className="text-[#0055FF]">Progress</span>
                </h1>
                <p className="text-zinc-500 text-sm mt-1">
                    Follow these weekly steps to complete your internship.
                </p>
            </header>

            <div className="relative">
                {/* Vertical Timeline Line */}
                <div className="absolute left-4 lg:left-8 top-0 bottom-0 w-px bg-zinc-200 hidden md:block" />

                <div className="space-y-8 relative">
                    {schedules.length === 0 ? (
                        <div className="py-20 text-center text-sm text-zinc-400 border border-dashed border-zinc-200 bg-white rounded-xl">
                            No roadmap items assigned yet.
                        </div>
                    ) : (
                        schedules.map((item, index) => {
                            const isPastDeadline = new Date(item.deadline) < new Date();
                            const isClosed = isPastDeadline && !item.isCompleted && !item.isManualOpen;

                            return (
                                <div key={item.id} className="relative md:pl-20">
                                    {/* Timeline Node Point - Aligned with Title */}
                                    <div className={`absolute left-4 lg:left-8 top-7 -ml-1 h-2 w-2 rounded-full hidden md:block transition-all ${
                                        item.isCompleted ? "bg-green-500" : 
                                        isClosed ? "bg-zinc-300" : 
                                        "bg-[#0055FF]"
                                    }`} />

                                    <div 
                                        className={`group relative bg-white border transition-all rounded-xl overflow-hidden ${
                                            selectedSchedule?.id === item.id 
                                            ? "border-[#0055FF] shadow-lg shadow-blue-500/5" 
                                            : "border-zinc-200 hover:border-zinc-300"
                                        } ${isClosed ? "opacity-80" : ""}`}
                                    >
                                        <div className="p-6">
                                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                                            item.isCompleted ? "bg-green-50 text-green-600 border-green-100" :
                                                            isClosed ? "bg-zinc-50 text-zinc-400 border-zinc-100" :
                                                            "bg-blue-50 text-blue-600 border-blue-100"
                                                        }`}>
                                                            {item.week}
                                                        </span>
                                                        {item.isCompleted && (
                                                            <div className="flex items-center gap-1 text-[10px] font-bold text-green-600">
                                                                <CheckCircle2 size={12} /> Submitted
                                                            </div>
                                                        )}
                                                        {isClosed && (
                                                            <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400">
                                                                <Lock size={12} /> Closed
                                                            </div>
                                                        )}
                                                    </div>
                                                    <h3 className="text-lg lg:text-xl font-bold text-zinc-900">
                                                        {item.typeOfWork}
                                                    </h3>
                                                    <p className="text-zinc-500 text-sm line-clamp-1 max-w-xl">
                                                        {item.description}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col items-start lg:items-end gap-3">
                                                    <div className="text-left lg:text-right">
                                                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Deadline</p>
                                                        <p className={`text-sm font-bold ${isPastDeadline ? "text-red-500" : "text-zinc-700"}`}>
                                                            {new Date(item.deadline).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => setSelectedSchedule(selectedSchedule?.id === item.id ? null : item)}
                                                        className={`h-9 px-4 rounded-lg text-[11px] font-bold transition-all ${
                                                            selectedSchedule?.id === item.id
                                                            ? "bg-zinc-900 text-white"
                                                            : "bg-zinc-50 text-zinc-600 border border-zinc-200 hover:bg-zinc-100"
                                                        }`}
                                                    >
                                                        {selectedSchedule?.id === item.id ? "Close" : "View Details"}
                                                    </button>
                                                </div>
                                            </div>

                                            {selectedSchedule?.id === item.id && (
                                                <motion.div 
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    className="mt-8 pt-8 border-t border-zinc-100 grid lg:grid-cols-2 gap-10"
                                                >
                                                    <div className="space-y-8">
                                                        <div>
                                                            <h4 className="text-[11px] font-bold text-zinc-400 uppercase mb-2">Description</h4>
                                                            <p className="text-sm text-zinc-600 leading-relaxed">{item.description}</p>
                                                        </div>

                                                        {/* Details Grid */}
                                                        <div className="grid grid-cols-2 gap-6 p-5 bg-zinc-50 rounded-xl border border-zinc-100">
                                                            <div className="space-y-1">
                                                                <p className="text-[10px] font-bold text-zinc-400 uppercase">Project</p>
                                                                <p className="text-xs font-bold text-zinc-900">{item.projectName || "General Work"}</p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-[10px] font-bold text-zinc-400 uppercase">Mentor</p>
                                                                <p className="text-xs font-bold text-zinc-900">{item.mentorName || "Core Team"}</p>
                                                            </div>
                                                            <div className="col-span-2 space-y-2">
                                                                <p className="text-[10px] font-bold text-zinc-400 uppercase">Team Members</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {item.teamInternNames?.map((name, i) => (
                                                                        <span key={i} className="px-2 py-0.5 bg-white border border-zinc-200 rounded text-[10px] text-zinc-600">
                                                                            {name}
                                                                        </span>
                                                                    )) || <span className="text-[10px] text-zinc-500">Individual Task</span>}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Requirements & Outcomes */}
                                                        <div className="space-y-6">
                                                            <div className="space-y-3">
                                                                <h4 className="text-[11px] font-bold text-zinc-400 uppercase">Tools & Technologies</h4>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {item.toolsUsed.map(tool => (
                                                                        <span key={tool} className="text-[10px] px-2 py-1 bg-white border border-zinc-200 text-zinc-600 font-bold rounded">{tool}</span>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-8">
                                                                <div className="space-y-3">
                                                                    <h4 className="text-[11px] font-bold text-zinc-400 uppercase">Requirements</h4>
                                                                    <ul className="space-y-1.5">
                                                                        {item.requirements.map((req, i) => (
                                                                            <li key={i} className="text-[12px] text-zinc-500 flex gap-2">
                                                                                <span className="text-blue-500">•</span> {req}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    <h4 className="text-[11px] font-bold text-zinc-400 uppercase">Learning Outcomes</h4>
                                                                    <ul className="space-y-1.5">
                                                                        {item.outcomes.map((outcome, i) => (
                                                                            <li key={i} className="text-[12px] text-zinc-500 flex gap-2">
                                                                                <span className="text-green-500">•</span> {outcome}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className={`p-6 rounded-xl border ${
                                                        item.isCompleted ? "bg-green-50/30 border-green-100" : 
                                                        isClosed ? "bg-zinc-50 border-zinc-200" : 
                                                        "bg-blue-50/20 border-blue-100"
                                                    }`}>
                                                        {item.isCompleted ? (
                                                            <div className="space-y-6">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-10 w-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                                                                        <CheckCircle2 size={24} />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-bold text-zinc-900">Task Completed</p>
                                                                        <p className="text-[10px] text-green-600 font-bold uppercase">Your work has been submitted</p>
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="space-y-4">
                                                                    <div className="p-4 bg-white border border-zinc-100 rounded-lg space-y-3">
                                                                        <div className="flex flex-col">
                                                                            <span className="text-[9px] font-bold text-zinc-400 uppercase mb-1">GitHub Link</span>
                                                                            <a href={item.githubLink} target="_blank" className="text-xs font-bold text-blue-600 truncate hover:underline flex items-center gap-1">
                                                                                {item.githubLink} <ExternalLink size={10} />
                                                                            </a>
                                                                        </div>
                                                                        <div className="h-px bg-zinc-50" />
                                                                        <div className="flex flex-col">
                                                                            <span className="text-[9px] font-bold text-zinc-400 uppercase mb-1">Live Link</span>
                                                                            <a href={item.submissionLink} target="_blank" className="text-xs font-bold text-blue-600 truncate hover:underline flex items-center gap-1">
                                                                                {item.submissionLink} <ExternalLink size={10} />
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                    <button disabled className="w-full h-10 bg-green-100 text-green-700 text-[11px] font-bold rounded-lg cursor-not-allowed">
                                                                        Already Submitted
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : isClosed ? (
                                                            <div className="space-y-6 text-center py-6">
                                                                <div className="inline-flex h-12 w-12 bg-zinc-100 text-zinc-400 rounded-full items-center justify-center mb-2">
                                                                    <Lock size={24} />
                                                                </div>
                                                                <h4 className="text-sm font-bold text-zinc-900">Submission Closed</h4>
                                                                <p className="text-xs text-zinc-500 leading-relaxed px-4">
                                                                    The deadline for this task has passed. Please contact your mentor if you need more time.
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <form onSubmit={handleSubmission} className="space-y-5">
                                                                <div className="flex items-center gap-3 mb-4">
                                                                    <div className="h-10 w-10 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                                                                        <Edit3 size={20} />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-bold text-zinc-900">Submit Your Work</p>
                                                                        <p className="text-[10px] text-blue-600 font-bold uppercase">Fill in your links below</p>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-4">
                                                                    <div className="space-y-1.5">
                                                                        <label className="text-[10px] font-bold text-zinc-400 uppercase">GitHub Link</label>
                                                                        <input 
                                                                            required 
                                                                            type="url"
                                                                            value={submissionData.githubLink}
                                                                            onChange={e => setSubmissionData({...submissionData, githubLink: e.target.value})}
                                                                            className="w-full h-10 bg-white border border-zinc-200 rounded-lg px-3 text-xs outline-none focus:border-blue-600 transition-all" 
                                                                            placeholder="https://github.com/your-repo" 
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-1.5">
                                                                        <label className="text-[10px] font-bold text-zinc-400 uppercase">Live Demo Link</label>
                                                                        <input 
                                                                            required 
                                                                            type="url"
                                                                            value={submissionData.submissionLink}
                                                                            onChange={e => setSubmissionData({...submissionData, submissionLink: e.target.value})}
                                                                            className="w-full h-10 bg-white border border-zinc-200 rounded-lg px-3 text-xs outline-none focus:border-blue-600 transition-all" 
                                                                            placeholder="https://your-site.vercel.app" 
                                                                        />
                                                                    </div>
                                                                    <button 
                                                                        disabled={isSubmitting}
                                                                        className="w-full h-11 bg-[#0055FF] text-white text-[12px] font-bold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 mt-2"
                                                                    >
                                                                        {isSubmitting ? "Submitting..." : "Submit Assignment"}
                                                                    </button>
                                                                </div>
                                                            </form>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

