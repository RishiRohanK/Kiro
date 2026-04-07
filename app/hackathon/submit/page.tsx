"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
    Plus, 
    Trash2, 
    Github, 
    Users, 
    User, 
    Loader2, 
    ArrowLeft,
    CheckCircle,
    Send,
    Home
} from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";
import Footer from "../../components/home/Footer";

export default function HackathonSubmissionPage() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    
    const [formData, setFormData] = useState({
        teamName: "",
        teamLeader: "",
        githubRepo: "",
    });

    const [members, setMembers] = useState<string[]>([""]);

    const addMember = () => {
        setMembers([...members, ""]);
    };

    const removeMember = (index: number) => {
        if (members.length > 1) {
            const newMembers = [...members];
            newMembers.splice(index, 1);
            setMembers(newMembers);
        }
    };

    const handleMemberChange = (index: number, value: string) => {
        const newMembers = [...members];
        newMembers[index] = value;
        setMembers(newMembers);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    teamMembers: members.filter(m => m.trim() !== "")
                }),
            });

            const data = await res.json();
            if (data.success) {
                setSubmitted(true);
            } else {
                setError(data.error || "Submission failed. Please try again.");
            }
        } catch (err) {
            setError("Something went wrong. Please check your connection.");
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center p-6 text-center selection:bg-zinc-100">
                <div className="w-20 h-20 border border-zinc-100 flex items-center justify-center mb-8">
                    <CheckCircle className="w-10 h-10 text-[#92E3A9]" strokeWidth={1.5} />
                </div>
                <h1 className="text-4xl tracking-tight mb-4 font-bold">Project Submitted</h1>
                <p className="text-zinc-500 max-w-sm mx-auto leading-relaxed mb-10 text-[15px]">
                    Team {formData.teamName} has been added to our list. Best of luck with your project!
                </p>
                <div className="flex gap-4">
                    <Link href="/projects" className="bg-black text-white px-10 h-12 flex items-center justify-center text-[12px] font-bold uppercase tracking-widest transition-opacity hover:opacity-90">
                        View Projects
                    </Link>
                    <Link href="/" className="border border-zinc-100 text-zinc-600 px-10 h-12 flex items-center justify-center text-[12px] font-bold uppercase tracking-widest transition-colors hover:bg-zinc-50">
                        Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-100">
            {}
            <nav className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/95 backdrop-blur-sm">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-10">
                    <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-70 group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[14px] tracking-tight">Go back</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="h-1.5 w-1.5 bg-[#92E3A9]" />
                        <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">Entry portal</span>
                    </div>
                </div>
            </nav>

            <main className="w-full">
                {}
                <div className="bg-black py-12 lg:py-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        <Breadcrumbs items={[{ label: "Academy", href: "/" }, { label: "Projects", href: "/projects" }, { label: "Submit" }]} />
                        <h1 className="text-4xl md:text-5xl tracking-tight text-white mt-8 mb-4">
                            Submit Project
                        </h1>
                        <p className="text-zinc-400 text-[15px] leading-relaxed max-w-md">
                            Submit your project link here. It will be checked by our team.
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {}
                        <div className="lg:col-span-4 space-y-12">
                            <div className="space-y-4">
                                <h2 className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">How it works</h2>
                                <p className="text-[14px] leading-relaxed text-zinc-500">
                                    We check every project to make sure the link and team details are correct. Make sure to fill in all the details.
                                </p>
                            </div>
                            <div className="h-[1px] w-12 bg-zinc-100" />
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-[13px] text-zinc-500">
                                    <div className="h-1 w-1 bg-zinc-300" />
                                    <span>Public project link</span>
                                </div>
                                <div className="flex items-center gap-4 text-[13px] text-zinc-500">
                                    <div className="h-1 w-1 bg-zinc-300" />
                                    <span>Correct team list</span>
                                </div>
                            </div>
                        </div>

                        {}
                        <div className="lg:col-span-8">
                            <form onSubmit={handleSubmit} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Team Name</label>
                                        <div className="relative">
                                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300" strokeWidth={1.5} />
                                            <input 
                                                required
                                                className="w-full bg-white border border-zinc-100 h-12 px-12 text-[14px] outline-none transition-colors focus:border-black"
                                                placeholder="e.g. CyberForge X"
                                                value={formData.teamName}
                                                onChange={e => setFormData({...formData, teamName: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Team Leader</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300" strokeWidth={1.5} />
                                            <input 
                                                required
                                                className="w-full bg-white border border-zinc-100 h-12 px-12 text-[14px] outline-none transition-colors focus:border-black"
                                                placeholder="Full name"
                                                value={formData.teamLeader}
                                                onChange={e => setFormData({...formData, teamLeader: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Team Members</label>
                                        <button 
                                            type="button" 
                                            onClick={addMember}
                                            className="text-[11px] font-bold text-zinc-900 hover:opacity-70 flex items-center gap-2 uppercase tracking-widest"
                                        >
                                            <Plus size={14} /> Add name
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {members.map((member, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input 
                                                    className="flex-1 bg-white border border-zinc-100 h-12 px-4 text-[13px] outline-none transition-colors focus:border-black"
                                                    placeholder={`Member name`}
                                                    value={member}
                                                    onChange={e => handleMemberChange(index, e.target.value)}
                                                />
                                                {members.length > 1 && (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => removeMember(index)}
                                                        className="flex h-12 w-12 items-center justify-center border border-zinc-100 text-zinc-200 hover:text-black transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6">
                                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Link to Project (e.g. GitHub)</label>
                                    <div className="relative">
                                        <Github className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300" strokeWidth={1.5} />
                                        <input 
                                            required
                                            className="w-full bg-white border border-zinc-200 h-12 px-12 text-[14px] outline-none transition-colors focus:border-black"
                                            placeholder="https://github.com/team/project"
                                            value={formData.githubRepo}
                                            onChange={e => setFormData({...formData, githubRepo: e.target.value})}
                                        />
                                    </div>
                                </div>

                                {error && <p className="text-red-500 text-[12px] uppercase font-bold tracking-widest">{error}</p>}

                                <button 
                                    disabled={submitting}
                                    className="flex h-14 w-full items-center justify-center gap-3 bg-black text-white text-[12px] font-bold uppercase tracking-widest transition-opacity hover:opacity-90 disabled:opacity-50"
                                >
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                        <>
                                            <span>Submit Project</span>
                                            <Send size={14} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="mt-12 mb-24 text-center">
                    <Link href="/" className="group inline-flex items-center gap-3 text-[11px] font-bold text-zinc-300 hover:text-black transition-colors uppercase tracking-widest">
                        <Home size={14} className="group-hover:scale-110 transition-transform" />
                        Back to home
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
