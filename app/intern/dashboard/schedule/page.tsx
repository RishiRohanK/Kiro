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
    Lock
} from "lucide-react";

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

        
        if (new Date(selectedSchedule.deadline) < new Date()) {
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
        <div className="p-4 lg:p-6 max-w-7xl w-full mx-auto bg-white min-h-screen pb-24 lg:pb-6">
            <header className="mb-8 pt-2">
                <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-zinc-900 font-sans">
                   Internship Roadmap <span className="text-[#0055FF] font-medium">Session Update.</span>
                </h1>
                <p className="text-zinc-400 text-[10px] lg:text-[12px] font-medium mt-1">
                   Monitor progress objectives and synchronize submission protocols.
                </p>
            </header>

            <div className="space-y-6">
                {schedules.length === 0 ? (
                    <div className="py-12 text-center text-sm text-zinc-400 border border-dashed rounded-lg">
                        No schedule updates available yet.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {schedules.map((item) => {
                            const isPastDeadline = new Date(item.deadline) < new Date();
                            const isClosed = isPastDeadline && !item.isCompleted;

                            return (
                                <div
                                    key={item.id}
                                    className={`p-5 border rounded-lg transition-colors ${
                                        isClosed
                                        ? "bg-red-50 border-red-200"
                                        : selectedSchedule?.id === item.id
                                            ? "bg-white border-blue-500 shadow-sm"
                                            : "bg-white border-zinc-200"
                                    }`}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                <span className={`text-sm font-medium ${isClosed ? "text-zinc-400" : "text-blue-600"}`}>
                                                    {item.week}
                                                </span>
                                                {item.isCompleted && (
                                                    <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded border border-green-100">Submitted</span>
                                                )}
                                                {isClosed && (
                                                    <span className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded border border-red-100 font-bold uppercase tracking-wide flex items-center gap-1">
                                                        <Lock size={10} className="text-black" /> Closed
                                                    </span>
                                                )}
                                                {isPastDeadline && item.isCompleted && (
                                                    <span className="text-[10px] bg-zinc-100 text-zinc-400 px-2 py-0.5 rounded border border-zinc-200 uppercase tracking-wide">
                                                        Deadline passed
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className={`text-lg ${isClosed ? "text-zinc-400 line-through decoration-zinc-300" : "text-zinc-900"}`}>
                                                {item.typeOfWork}
                                            </h3>
                                            <p className="text-sm text-zinc-500 mt-1 line-clamp-1">{item.description}</p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedSchedule(selectedSchedule?.id === item.id ? null : item)}
                                            className={`text-sm px-4 py-2 border rounded transition-colors ${
                                                isClosed
                                                ? "border-zinc-200 text-zinc-400 hover:bg-zinc-100 cursor-pointer"
                                                : "border-zinc-300 hover:bg-zinc-50"
                                            }`}
                                        >
                                            {selectedSchedule?.id === item.id ? "Close" : isClosed ? "View (Read-only)" : "View Details"}
                                        </button>
                                    </div>

                                    {selectedSchedule?.id === item.id && (
                                        <div className="mt-8 pt-8 border-t border-zinc-100 grid md:grid-cols-2 gap-10">
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="text-xs font-medium text-zinc-400 mb-2">Description</h4>
                                                    <p className="text-sm leading-relaxed">{item.description}</p>
                                                </div>

                                                {(item.projectName || item.teamAllocation || item.mentorName) && (
                                                    <div className="p-4 bg-zinc-50 border border-zinc-100 space-y-4">
                                                        <h4 className="text-[10px] font-bold text-[#0055FF] uppercase tracking-widest">Project & Team Allocation</h4>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            {item.projectName && (
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Project</p>
                                                                    <p className="text-xs font-bold text-zinc-900 mt-1">{item.projectName}</p>
                                                                </div>
                                                            )}
                                                            {(item.teamInternNames && item.teamInternNames.length > 0) ? (
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Team Members</p>
                                                                    <p className="text-xs font-bold text-zinc-900 mt-1">{item.teamInternNames.join(", ")}</p>
                                                                </div>
                                                            ) : item.teamAllocation ? (
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Team Allocation</p>
                                                                    <p className="text-xs font-bold text-zinc-900 mt-1">{item.teamAllocation}</p>
                                                                </div>
                                                            ) : null}
                                                            {item.mentorName && (
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Assigned Mentor</p>
                                                                    <p className="text-xs font-bold text-zinc-900 mt-1">{item.mentorName}</p>
                                                                </div>
                                                            )}
                                                            {item.teamLead && (
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase">Team Lead</p>
                                                                    <p className="text-xs font-bold text-zinc-900 mt-1">{item.teamLead}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {item.projectDocLink && (
                                                            <div className="pt-2">
                                                                <a href={item.projectDocLink} target="_blank" className="h-9 w-full bg-zinc-900 text-white text-[11px] font-bold flex items-center justify-center gap-2 hover:bg-black transition-all">
                                                                    <ExternalLink size={14} /> Open Project Docs
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <div>
                                                    <h4 className="text-xs font-medium text-zinc-400 mb-2">Tools to be used</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.toolsUsed.map(tool => (
                                                            <span key={tool} className="text-xs px-2 py-1 bg-zinc-100 text-zinc-600 rounded">{tool}</span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {item.deploymentTools && item.deploymentTools.length > 0 && (
                                                    <div>
                                                        <h4 className="text-xs font-medium text-zinc-400 mb-2">Deployment tools</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {item.deploymentTools.map(tool => (
                                                                <span key={tool} className="text-xs px-2 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded">{tool}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {item.requirements && item.requirements.length > 0 && (
                                                    <div>
                                                        <h4 className="text-xs font-medium text-zinc-400 mb-2">Requirements</h4>
                                                        <ul className="list-disc list-inside text-sm space-y-1 text-zinc-600">
                                                            {item.requirements.map((req, i) => (
                                                                <li key={i}>{req}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                <div>
                                                    <h4 className="text-xs font-medium text-zinc-400 mb-2">Outcomes</h4>
                                                    <ul className="list-disc list-inside text-sm space-y-1 text-zinc-600">
                                                        {item.outcomes.map((outcome, i) => (
                                                            <li key={i}>{outcome}</li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="pt-4">
                                                    <p className="text-xs font-medium text-zinc-400">Deadline</p>
                                                    <p className={`text-sm mt-1 font-semibold ${isPastDeadline ? "text-red-500" : "text-red-600"}`}>
                                                        {new Date(item.deadline).toLocaleDateString('en-GB', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                        {isPastDeadline && <span className="ml-2 text-[10px] text-red-400 font-normal">(Expired)</span>}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className={`p-6 rounded-lg ${isClosed ? "bg-red-50 border border-red-200" : "bg-zinc-50"}`}>
                                                {isClosed ? (
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-2 p-3 bg-red-100 border border-red-300 rounded-lg">
                                                            <Lock size={18} className="text-black" />
                                                            <div>
                                                                <p className="text-xs font-bold text-red-700">Submission Closed</p>
                                                                <p className="text-[10px] text-red-500">Deadline has passed. This form is frozen.</p>
                                                            </div>
                                                        </div>
                                                        {}
                                                        <div className="space-y-4 pointer-events-none select-none opacity-50 grayscale">
                                                            <div>
                                                                <label className="block text-[11px] text-zinc-500 mb-1">GitHub repository link</label>
                                                                <input
                                                                    type="url"
                                                                    disabled
                                                                    value={item.githubLink || ""}
                                                                    readOnly
                                                                    className="w-full p-2 text-sm border border-zinc-300 rounded bg-zinc-100 cursor-not-allowed"
                                                                    placeholder="https://github.com/..."
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-[11px] text-zinc-500 mb-1">Submit link (Deployment/Drive)</label>
                                                                <input
                                                                    type="url"
                                                                    disabled
                                                                    value={item.submissionLink || ""}
                                                                    readOnly
                                                                    className="w-full p-2 text-sm border border-zinc-300 rounded bg-zinc-100 cursor-not-allowed"
                                                                    placeholder="https://..."
                                                                />
                                                            </div>
                                                            <button
                                                                disabled
                                                                className="w-full py-2 bg-red-300 text-white text-sm rounded cursor-not-allowed"
                                                            >
                                                                Submission Closed
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <h4 className="text-sm font-medium mb-4">Submission Form</h4>
                                                        <form onSubmit={handleSubmission} className="space-y-4">
                                                            <div>
                                                                <label className="block text-[11px] text-zinc-500 mb-1">GitHub repository link</label>
                                                                <input
                                                                    type="url"
                                                                    required
                                                                    value={submissionData.githubLink}
                                                                    onChange={e => setSubmissionData({...submissionData, githubLink: e.target.value})}
                                                                    className="w-full p-2 text-sm border border-zinc-300 rounded outline-none focus:border-blue-500"
                                                                    placeholder="https://github.com/..."
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-[11px] text-zinc-500 mb-1">Submit link (Deployment/Drive)</label>
                                                                <input
                                                                    type="url"
                                                                    required
                                                                    value={submissionData.submissionLink}
                                                                    onChange={e => setSubmissionData({...submissionData, submissionLink: e.target.value})}
                                                                    className="w-full p-2 text-sm border border-zinc-300 rounded outline-none focus:border-blue-500"
                                                                    placeholder="https://..."
                                                                />
                                                            </div>
                                                            <button
                                                                disabled={isSubmitting}
                                                                type="submit"
                                                                className="w-full py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                                            >
                                                                {isSubmitting ? "Submitting..." : "Submit All Links"}
                                                            </button>
                                                        </form>
                                                        {item.githubLink && (
                                                            <div className="mt-4 pt-4 border-t border-zinc-200 space-y-2">
                                                                <p className="text-[10px] text-zinc-400">Previous submission:</p>
                                                                <a href={item.githubLink} target="_blank" className="block text-xs text-blue-600 hover:underline">GitHub Link</a>
                                                                <a href={item.submissionLink} target="_blank" className="block text-xs text-blue-600 hover:underline">Submission Link</a>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

