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
        <div className="p-6 lg:p-10 w-full min-h-screen pb-24 bg-[#FBFBFB]">
            <header className="mb-8 border-b border-zinc-100 pb-5">
                <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                    Internship Roadmap & Modules
                </h1>
                <p className="text-zinc-500 text-xs mt-1 leading-relaxed">
                    Track your weekly progress, review assignments, and submit your project deliverables.
                </p>
            </header>

            <div className="max-w-4xl">
                <div className="space-y-4">
                    {schedules.length === 0 ? (
                        <div className="py-16 text-center text-sm text-zinc-400 border border-dashed border-zinc-200 bg-white rounded-xl">
                            No roadmap items assigned yet.
                        </div>
                    ) : (
                        schedules.map((item) => {
                            const isPastDeadline = new Date(item.deadline) < new Date();
                            const isClosed = isPastDeadline && !item.isCompleted && !item.isManualOpen;

                            return (
                                <div key={item.id} className="relative">
                                    <div 
                                        className={`group relative bg-white border transition-all rounded-xl ${
                                            selectedSchedule?.id === item.id 
                                            ? "border-[#003366] shadow-sm" 
                                            : "border-zinc-200/80 hover:border-zinc-300"
                                        } ${isClosed ? "opacity-75" : ""}`}
                                    >
                                        <div className="p-5">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                                            item.isCompleted ? "bg-green-50 text-green-700 border border-green-100" :
                                                            isClosed ? "bg-zinc-100 text-zinc-500" :
                                                            "bg-blue-50 text-blue-700 border border-blue-100"
                                                        }`}>
                                                            {item.week}
                                                        </span>
                                                        {item.isCompleted && (
                                                            <div className="flex items-center gap-1 text-[10px] font-bold text-green-700">
                                                                <CheckCircle2 size={12} className="text-green-600" /> Submitted
                                                            </div>
                                                        )}
                                                        {isClosed && (
                                                            <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400">
                                                                <Lock size={12} /> Closed
                                                            </div>
                                                        )}
                                                    </div>
                                                    <h3 className="text-base font-bold text-zinc-900">
                                                        {item.typeOfWork}
                                                    </h3>
                                                    <p className="text-zinc-500 text-xs max-w-xl">
                                                        {item.description}
                                                    </p>
                                                </div>

                                                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-100">
                                                    <div className="text-left md:text-right">
                                                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Deadline</p>
                                                        <p className={`text-xs font-bold ${isPastDeadline ? "text-red-500" : "text-zinc-700"}`}>
                                                            {new Date(item.deadline).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => setSelectedSchedule(selectedSchedule?.id === item.id ? null : item)}
                                                        className={`h-8 px-3.5 rounded-lg text-[11px] font-bold transition-all ${
                                                            selectedSchedule?.id === item.id
                                                            ? "bg-zinc-950 text-white hover:bg-black"
                                                            : "bg-zinc-50 text-zinc-700 border border-zinc-200/80 hover:bg-zinc-100 hover:text-zinc-900"
                                                        }`}
                                                    >
                                                        {selectedSchedule?.id === item.id ? "Close Details" : "View Modules"}
                                                    </button>
                                                </div>
                                            </div>

                                            {selectedSchedule?.id === item.id && (
                                                <motion.div 
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    className="mt-6 pt-6 border-t border-zinc-100 grid lg:grid-cols-2 gap-8"
                                                >
                                                    <div className="space-y-6">
                                                        <div>
                                                            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Description</h4>
                                                            <p className="text-xs text-zinc-600 leading-relaxed">{item.description}</p>
                                                        </div>

                                                        {/* Details Grid */}
                                                        <div className="grid grid-cols-2 gap-4 p-4 bg-zinc-50/50 rounded-xl border border-zinc-100">
                                                            <div className="space-y-1">
                                                                <p className="text-[9px] font-bold text-zinc-400 uppercase">Project</p>
                                                                <p className="text-xs font-bold text-zinc-800">{item.projectName || "General Work"}</p>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-[9px] font-bold text-zinc-400 uppercase">Mentor</p>
                                                                <p className="text-xs font-bold text-zinc-800">{item.mentorName || "Core Team"}</p>
                                                            </div>
                                                            <div className="col-span-2 space-y-1.5">
                                                                <p className="text-[9px] font-bold text-zinc-400 uppercase">Team Members</p>
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {item.teamInternNames?.map((name, i) => (
                                                                        <span key={i} className="px-2 py-0.5 bg-white border border-zinc-200/80 rounded text-[10px] text-zinc-600 font-medium">
                                                                            {name}
                                                                        </span>
                                                                    )) || <span className="text-[10px] text-zinc-500">Individual Task</span>}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Requirements & Outcomes */}
                                                        <div className="space-y-5">
                                                            <div className="space-y-2">
                                                                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tools & Technologies</h4>
                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {item.toolsUsed.map(tool => (
                                                                        <span key={tool} className="text-[10px] px-2 py-0.5 bg-white border border-zinc-200/80 text-zinc-700 font-bold rounded">{tool}</span>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Requirements</h4>
                                                                    <ul className="space-y-1">
                                                                        {item.requirements.map((req, i) => (
                                                                            <li key={i} className="text-[11px] text-zinc-500 flex gap-1.5 leading-normal">
                                                                                <span className="text-[#003366]">•</span> {req}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Outcomes</h4>
                                                                    <ul className="space-y-1">
                                                                        {item.outcomes.map((outcome, i) => (
                                                                            <li key={i} className="text-[11px] text-zinc-500 flex gap-1.5 leading-normal">
                                                                                <span className="text-green-600">•</span> {outcome}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className={`p-5 rounded-xl border ${
                                                        item.isCompleted ? "bg-green-50/20 border-green-100" : 
                                                        isClosed ? "bg-zinc-50 border-zinc-200" : 
                                                        "bg-zinc-50/65 border-zinc-200/80"
                                                    }`}>
                                                        {item.isCompleted ? (
                                                            <div className="space-y-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-9 w-9 bg-green-100 text-green-700 rounded-lg flex items-center justify-center">
                                                                        <CheckCircle2 size={20} />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-bold text-zinc-900">Task Completed</p>
                                                                        <p className="text-[10px] text-green-600 font-bold uppercase">Your work has been submitted</p>
                                                                    </div>
                                                                 </div>
                                                                
                                                                <div className="space-y-3">
                                                                    <div className="p-3 bg-white border border-zinc-150 rounded-lg space-y-2 text-xs">
                                                                        <div className="flex flex-col">
                                                                            <span className="text-[9px] font-bold text-zinc-400 uppercase">GitHub Link</span>
                                                                            <a href={item.githubLink} target="_blank" className="font-bold text-[#003366] hover:underline flex items-center gap-1 mt-0.5 truncate">
                                                                                {item.githubLink} <ExternalLink size={10} />
                                                                            </a>
                                                                        </div>
                                                                        <div className="h-px bg-zinc-100" />
                                                                        <div className="flex flex-col">
                                                                            <span className="text-[9px] font-bold text-zinc-400 uppercase">Live Link</span>
                                                                            <a href={item.submissionLink} target="_blank" className="font-bold text-[#003366] hover:underline flex items-center gap-1 mt-0.5 truncate">
                                                                                {item.submissionLink} <ExternalLink size={10} />
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : isClosed ? (
                                                            <div className="space-y-4 text-center py-4">
                                                                <div className="inline-flex h-10 w-10 bg-zinc-100 text-zinc-400 rounded-full items-center justify-center">
                                                                    <Lock size={20} />
                                                                </div>
                                                                <h4 className="text-xs font-bold text-zinc-900">Submission Closed</h4>
                                                                <p className="text-[11px] text-zinc-500 leading-relaxed px-4">
                                                                    The deadline has passed. Please coordinate with your mentor to open the submission panel.
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <form onSubmit={handleSubmission} className="space-y-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-9 w-9 bg-[#003366] text-white rounded-lg flex items-center justify-center">
                                                                        <Edit3 size={18} />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-bold text-zinc-900">Submit Your Work</p>
                                                                        <p className="text-[9px] text-[#003366] font-bold uppercase">Provide your repository details</p>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-3">
                                                                    <div className="space-y-1">
                                                                        <label className="text-[9px] font-bold text-zinc-400 uppercase">GitHub Repository URL</label>
                                                                        <input 
                                                                            required 
                                                                            type="url"
                                                                            value={submissionData.githubLink}
                                                                            onChange={e => setSubmissionData({...submissionData, githubLink: e.target.value})}
                                                                            className="w-full h-9 bg-white border border-zinc-200 rounded-lg px-3 text-xs outline-none focus:border-[#003366] transition-all" 
                                                                            placeholder="https://github.com/intern/project" 
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <label className="text-[9px] font-bold text-zinc-400 uppercase">Live Hosted Application Link</label>
                                                                        <input 
                                                                            required 
                                                                            type="url"
                                                                            value={submissionData.submissionLink}
                                                                            onChange={e => setSubmissionData({...submissionData, submissionLink: e.target.value})}
                                                                            className="w-full h-9 bg-white border border-zinc-200 rounded-lg px-3 text-xs outline-none focus:border-[#003366] transition-all" 
                                                                            placeholder="https://project.vercel.app" 
                                                                        />
                                                                    </div>
                                                                    <button 
                                                                        disabled={isSubmitting}
                                                                        className="w-full h-10 bg-[#003366] text-white text-[12px] font-bold rounded-lg hover:bg-black transition-all disabled:opacity-50 mt-1"
                                                                    >
                                                                        {isSubmitting ? "Submitting..." : "Submit Deliverables"}
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

