"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Users,
    MessageSquare,
    Star,
    Plus,
    Trash2,
    ArrowRight,
    Trophy,
    CheckCircle2
} from "lucide-react";

export default function EventReviewPage() {
    const [teamMembers, setTeamMembers] = useState([""]);
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form States
    const [formData, setFormData] = useState({
        userName: "",
        teamName: "",
        eventReview: "",
        juryFeedback: "",
        hackathonJourney: ""
    });

    const addMember = () => setTeamMembers([...teamMembers, ""]);
    const updateMember = (index: number, value: string) => {
        const newMembers = [...teamMembers];
        newMembers[index] = value;
        setTeamMembers(newMembers);
    };
    const removeMember = (index: number) => {
        setTeamMembers(teamMembers.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/events/review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    teamMembers: teamMembers.filter(m => m.trim() !== "")
                }),
            });

            if (response.ok) {
                setSubmitted(true);
            } else {
                alert("Failed to submit review. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("An error occurred. Please check your connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const navbar = (
        <nav className="w-full bg-[#92E3A9] px-12 py-3 sm:px-24 flex items-center justify-between z-50 shadow-lg">
            <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-4">
                    <span className="text-sm font-bold tracking-tighter text-zinc-900 uppercase">Student Forge</span>
                    <div className="h-4 w-[1px] bg-zinc-900/20" />
                    <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-900/70 uppercase">REVIEW ENGINE</span>
                </Link>
            </div>
            <div className="flex gap-8">
                <Link href="/docs" className="text-xs font-semibold text-zinc-900/80 hover:text-zinc-900 transition-colors">Documentation</Link>
                <Link href="/support" className="text-xs font-semibold text-zinc-900/80 hover:text-zinc-900 transition-colors">Support</Link>
            </div>
        </nav>
    );

    const footer = (
        <footer className="px-12 sm:px-24 py-5 bg-[#f8f8f8] text-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-200 mt-auto">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                    <span className="text-xs font-semibold text-zinc-600">Review Services Operational</span>
                </div>
                <div className="h-4 w-[1px] bg-zinc-300 hidden sm:block" />
                <span className="text-xs font-medium text-zinc-500">Controlled by Technical Team</span>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-xs font-medium text-zinc-400">© 2026 Student Forge</span>
                <span className="px-2 py-0.5 bg-zinc-200 text-zinc-600 rounded text-[10px] font-bold leading-none">v2.1.0 stable</span>
            </div>
        </footer>
    );

    if (submitted) {
        return (
            <div className="h-screen w-full flex flex-col bg-[#050505] text-white font-sans overflow-hidden">
                {navbar}
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <div className="max-w-md w-full bg-zinc-900/30 border border-[#92E3A9]/20 p-12 rounded-[3rem] text-center shadow-2xl">
                        <div className="h-20 w-20 bg-[#92E3A9]/10 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle2 className="w-10 h-10 text-[#92E3A9]" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4 tracking-tight">Review Shared</h2>
                        <p className="text-zinc-500 text-sm mb-10 leading-relaxed font-medium">Your story about the hackathon has been added to our records. Thank you for building with us.</p>
                        <Link href="/events" className="inline-flex h-12 w-full items-center justify-center bg-[#92E3A9] text-zinc-900 rounded-lg font-bold text-sm hover:bg-white transition-all">
                            Return to Portal
                        </Link>
                    </div>
                </div>
                {footer}
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-[#050505] text-white font-sans overflow-x-hidden">
            {navbar}

            <main className="flex-1 flex flex-col justify-center px-12 sm:px-24 py-16 max-w-[1400px] mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    {}
                    <div className="lg:col-span-4 lg:sticky lg:top-8">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-none text-left">
                            Shared Stories
                        </h1>
                        <p className="text-sm text-zinc-500 leading-relaxed max-w-lg font-medium mb-12 text-left">
                            Tell us about your team, your build, and the experience with our jury. Your feedback helps us refine the metrics for future awards.
                        </p>

                        <div className="group p-5 rounded-xl bg-zinc-900/30 border border-zinc-800/50 flex flex-col gap-1 transition-all">
                            <span className="text-[10px] font-bold text-[#92E3A9] uppercase tracking-widest flex items-center gap-2">
                                <Trophy className="w-3 h-3" /> Build Quality
                            </span>
                            <h3 className="text-xs font-semibold text-zinc-400 mt-2">Feedback used for lab optimization.</h3>
                        </div>
                    </div>

                    {}
                    <div className="lg:col-span-8 bg-zinc-900/20 border border-zinc-800/50 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.userName}
                                        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-[#92E3A9] transition-all text-sm"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Team Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.teamName}
                                        onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-[#92E3A9] transition-all text-sm"
                                        placeholder="Name of your squad"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-zinc-800/50">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Team Members</label>
                                    <button
                                        type="button"
                                        onClick={addMember}
                                        className="text-[9px] font-bold text-[#92E3A9] border border-[#92E3A9]/30 px-3 py-1 rounded-md uppercase tracking-widest hover:bg-[#92E3A9]/10 transition-all flex items-center gap-1"
                                    >
                                        <Plus className="w-2.5 h-2.5" /> Add
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {teamMembers.map((member, idx) => (
                                        <div key={idx} className="relative group flex items-center">
                                            <input
                                                type="text"
                                                value={member}
                                                onChange={(e) => updateMember(idx, e.target.value)}
                                                className="w-full bg-zinc-800/30 border border-zinc-800/50 rounded-lg px-4 py-2.5 text-xs font-medium outline-none focus:border-[#92E3A9] transition-all"
                                                placeholder={`Member ${idx + 1}`}
                                            />
                                            {teamMembers.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeMember(idx)}
                                                    className="absolute right-2 text-zinc-700 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6 pt-4 border-t border-zinc-800/50">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Event Review</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={formData.eventReview}
                                        onChange={(e) => setFormData({ ...formData, eventReview: e.target.value })}
                                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-[#92E3A9] transition-all text-sm resize-none"
                                        placeholder="What did you build?"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">About the Jury</label>
                                    <textarea
                                        required
                                        rows={2}
                                        value={formData.juryFeedback}
                                        onChange={(e) => setFormData({ ...formData, juryFeedback: e.target.value })}
                                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-[#92E3A9] transition-all text-sm resize-none"
                                        placeholder="Experience with the judges"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">The Journey</label>
                                    <textarea
                                        required
                                        rows={2}
                                        value={formData.hackathonJourney}
                                        onChange={(e) => setFormData({ ...formData, hackathonJourney: e.target.value })}
                                        className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-[#92E3A9] transition-all text-sm resize-none"
                                        placeholder="Overall event journey"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-11 bg-[#92E3A9] text-zinc-900 rounded-lg flex items-center justify-center gap-2 font-bold uppercase tracking-widest hover:bg-[#7DCF95] transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <div className="h-4 w-4 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Submit Story</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            {footer}
        </div>
    );
}
