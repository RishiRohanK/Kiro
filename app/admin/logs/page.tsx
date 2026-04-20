"use client";

import { useState, useEffect } from "react";
import { GitCommit, Clock, CheckCircle2, XCircle, AlertCircle, ExternalLink, ArrowLeft, GitBranch } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Commit {
    sha: string;
    commit: {
        author: { name: string; date: string; };
        message: string;
    };
    html_url: string;
}

export default function LogsPage() {
    const [commits, setCommits] = useState<Commit[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCommits = async () => {
            console.log("Fetching deployment logs...");
            try {
                const res = await fetch("/api/admin/commits", { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    console.log("Log sync successful:", data.length, "items found.");
                    setCommits(data);
                } else {
                    console.error("Log sync failed with status:", res.status);
                }
            } catch (e) {
                console.error("Log fetch technical error:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchCommits();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-zinc-800 flex flex-col items-center">
            <MaintenanceBanner />
            <div className="w-full flex-1 flex flex-col">
            {/* Vercel-style Navbar */}
            <nav className="border-b border-zinc-800 bg-black sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/intern/signin" className="hover:opacity-70 transition-opacity">
                            <svg width="24" height="24" viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="white"/>
                            </svg>
                        </Link>
                        <div className="h-6 w-px bg-zinc-800 mx-2" />
                        <span className="text-sm font-medium tracking-tight">Deployments</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 text-[11px] font-bold tracking-widest rounded-full uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            All systems normal
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
                {/* Deployment Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-800">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight">System Reliability Logs</h1>
                        <p className="text-zinc-400 text-sm">Real-time health monitoring and deployment history. All systems verified.</p>
                    </div>
                    <Link href="/intern/signin" className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-white transition-colors">
                        <ArrowLeft size={14} />
                        Exit to Login
                    </Link>
                </div>

                {/* Deployments List */}
                <div className="space-y-4">
                    {loading ? (
                        [1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="w-full h-24 bg-zinc-900/50 border border-zinc-800 animate-pulse rounded-md" />
                        ))
                    ) : (
                        commits.map((commit, index) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={commit.sha} 
                                className="group bg-[#0A0A0A] border border-zinc-800 hover:border-zinc-700 transition-all overflow-hidden rounded-md"
                            >
                                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="mt-1">
                                            <div className="w-10 h-10 rounded-full border border-green-900/50 bg-green-950/30 flex items-center justify-center text-green-500">
                                                 <CheckCircle2 size={20} />
                                             </div>
                                        </div>
                                        <div className="space-y-1 fex-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-[15px] font-semibold text-zinc-100 line-clamp-1">
                                                    {commit.commit.message}
                                                </h3>
                                                <span className="text-[10px] font-bold bg-green-950/30 px-2 py-0.5 rounded text-green-500 border border-green-900/30 tracking-wider whitespace-nowrap">
                                                    Ready
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
                                                <div className="flex items-center gap-1.5 font-medium">
                                                    <GitBranch size={12} />
                                                    <span className="text-zinc-300">main</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-zinc-300 font-mono">{commit.sha.substring(0, 7)}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={12} />
                                                    <span>{getTimeAgo(commit.commit.author.date)}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-4 h-4 rounded-full bg-zinc-800 text-[8px] flex items-center justify-center font-bold">
                                                        {commit.commit.author.name[0]}
                                                    </div>
                                                    <span>{commit.commit.author.name}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 pl-14 md:pl-0">
                                        <a 
                                            href={commit.html_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="h-8 px-3 flex items-center gap-2 border border-zinc-800 text-[12px] font-medium hover:bg-white hover:text-black transition-all rounded"
                                        >
                                            Inspect <ExternalLink size={12} />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Bottom success notice */}
                <div className="mt-12 p-8 bg-green-600/5 border border-green-600/20 rounded-md">
                    <div className="flex items-start gap-4">
                        <CheckCircle2 className="text-green-500 shrink-0" size={20} />
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-green-500 tracking-widest">System Integrity Verified</h4>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Our production environment health checks have passed successfully. 
                                Full system recovery is complete, and all services are operating at peak performance. 
                                Security protocols have been updated and remain active.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-12 border-t border-zinc-900 mt-12 bg-[#050505]">
                <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs font-bold text-zinc-600 tracking-widest">
                        <span>Student Forge</span>
                        <span>•</span>
                        <span>System Logs</span>
                    </div>
                    <span className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.2em]">Platform Version 2.0.41-stable</span>
                </div>
            </footer>
            </div>

            <style jsx global>{`
                body { background-color: black; }
                ::selection { background: #333; color: white; }
            `}</style>
        </div>
    );
}

function getTimeAgo(dateString: string) {
    const now = new Date();
    const past = new Date(dateString);
    const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}
