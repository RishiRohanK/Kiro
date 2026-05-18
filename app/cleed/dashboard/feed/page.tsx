"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Plus,
    Rss,
    FileText,
    File,
    Video,
    Presentation,
    BookOpen,
    Trash2,
    ExternalLink,
    ChevronRight,
    ArrowLeft,
    Clock,
    AlertCircle,
    User,
    CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface FeedPost {
    id: string;
    title: string;
    content: string | null;
    type: 'NOTES' | 'DOCUMENT' | 'PPT' | 'VIDEO' | 'OTHER';
    fileUrl: string | null;
    fileName: string | null;
    category: string;
    authorName: string;
    batch: string;
    createdAt: string;
}

export default function CleedFeedManager() {
    const router = useRouter();
    const [posts, setPosts] = useState<FeedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [sendingForm, setSendingForm] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Form inputs state
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        type: "NOTES" as any,
        fileUrl: "",
        fileName: "",
        category: "General",
        authorName: "Trainer",
        batch: "All"
    });

    // Session lock validation
    useEffect(() => {
        const isAuthenticated = localStorage.getItem("cleed_auth_v2");
        if (isAuthenticated !== "active") {
            router.push("/cleed/login");
        } else {
            fetchPosts();
        }
    }, [router]);

    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/cleed/feed");
            const data = await res.json();
            if (data.success) {
                setPosts(data.posts);
            }
        } catch (err) {
            console.error("Failed to fetch feed posts");
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        setSendingForm(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const res = await fetch("/api/cleed/feed", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    fileName: formData.fileUrl ? (formData.fileName || "Shared Material") : ""
                })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setSuccessMsg("Feed item published successfully!");
                setFormData({
                    title: "",
                    content: "",
                    type: "NOTES",
                    fileUrl: "",
                    fileName: "",
                    category: "General",
                    authorName: "Trainer",
                    batch: "All"
                });
                fetchPosts();
                setTimeout(() => setSuccessMsg(""), 4000);
            } else {
                setErrorMsg(data.error || "Failed to publish post");
            }
        } catch (err) {
            setErrorMsg("Connection failure. Failed to publish.");
        } finally {
            setSendingForm(false);
        }
    };

    const handleDeletePost = async (id: string) => {
        if (!confirm("Permanently neutralize this feed item?")) return;
        try {
            const res = await fetch(`/api/cleed/feed?id=${id}`, { method: "DELETE" });
            const data = await res.json();
            if (res.ok && data.success) {
                setPosts(posts.filter(p => p.id !== id));
            } else {
                alert("Failed to delete post: " + (data.error || "Unknown error"));
            }
        } catch (err) {
            console.error("Delete call failed");
        }
    };

    // Style helper for types
    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'NOTES': return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-100', label: 'Tech Notes' };
            case 'DOCUMENT': return { bg: 'bg-blue-50 text-blue-700 border-blue-100', label: 'PDF Document' };
            case 'PPT': return { bg: 'bg-orange-50 text-orange-700 border-orange-100', label: 'Presentation' };
            case 'VIDEO': return { bg: 'bg-rose-50 text-rose-700 border-rose-100', label: 'Video Module' };
            default: return { bg: 'bg-zinc-50 text-zinc-700 border-zinc-100', label: 'Other File' };
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F7FA] pb-24">
            {/* Top Red Accent Accent bar */}
            <div className="h-1 bg-[#F5332C] w-full" />

            {/* Custom Top Navigation header */}
            <header className="bg-white border-b border-zinc-200 h-16 px-6 md:px-10 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <Link href="/cleed/dashboard" className="h-9 w-9 bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 transition-colors flex items-center justify-center rounded-none">
                        <ArrowLeft size={16} className="text-zinc-600" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-500 text-[11px] font-bold tracking-tight uppercase">Cleed Portal</span>
                        <ChevronRight size={10} className="text-zinc-400" />
                        <span className="text-zinc-900 font-extrabold text-[12px] tracking-tight uppercase flex items-center gap-2">
                            <Rss size={14} className="text-[#F5332C]" /> Feed Manager
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/cleed/dashboard/feed-dashboard" className="px-5 h-9 bg-[#F5332C] hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center transition-colors">
                        Feed Dashboard Analytics
                    </Link>
                    <Link href="/cleed/dashboard" className="px-5 h-9 border border-zinc-300 hover:bg-zinc-50 text-zinc-700 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center">
                        Back to main
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-10">
                {/* Intro Page title */}
                <div className="space-y-2 text-left">
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900 uppercase">Publish Study Materials</h1>
                    <p className="text-zinc-500 text-[13px] font-semibold">
                        Broadcasting terminal for distributing notes, lecture videos, code assets, and slide decks to intern portals.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Publishing form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-zinc-200 p-8 shadow-sm text-left space-y-6">
                            <div className="flex items-center gap-2 border-b border-zinc-100 pb-4">
                                <Plus size={18} className="text-[#F5332C]" />
                                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800">Add Feed Item</h3>
                            </div>

                            {successMsg && (
                                <div className="bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-[11px] font-bold flex items-center gap-2">
                                    <CheckCircle2 size={16} /> {successMsg}
                                </div>
                            )}

                            {errorMsg && (
                                <div className="bg-red-50 border border-red-200 p-4 text-red-800 text-[11px] font-bold flex items-center gap-2">
                                    <AlertCircle size={16} /> {errorMsg}
                                </div>
                            )}

                            <form onSubmit={handleCreatePost} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Item Title</label>
                                    <input 
                                        required 
                                        type="text"
                                        placeholder="e.g. Next.js App Router Architecture Guide"
                                        value={formData.title} 
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                                        className="w-full h-11 bg-zinc-50 border border-zinc-200 px-4 text-[13px] font-bold outline-none focus:border-[#F5332C] focus:bg-white transition-all rounded-none" 
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Short description or content</label>
                                    <textarea 
                                        rows={4}
                                        placeholder="Add descriptive summary, key learning points, or instructions here..."
                                        value={formData.content} 
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
                                        className="w-full bg-zinc-50 border border-zinc-200 p-4 text-[13px] font-bold outline-none focus:border-[#F5332C] focus:bg-white transition-all resize-none rounded-none" 
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Resource Type</label>
                                        <select 
                                            value={formData.type} 
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
                                            className="w-full h-11 bg-zinc-50 border border-zinc-200 px-4 text-[13px] font-bold outline-none focus:border-[#F5332C] focus:bg-white transition-all rounded-none"
                                        >
                                            <option value="NOTES">Study Notes</option>
                                            <option value="PPT">PPT / Slides</option>
                                            <option value="VIDEO">Video Link</option>
                                            <option value="DOCUMENT">Document / PDF</option>
                                            <option value="OTHER">Other Material</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Category</label>
                                        <input 
                                            required 
                                            type="text"
                                            placeholder="e.g. Next.js, UI/UX"
                                            value={formData.category} 
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                                            className="w-full h-11 bg-zinc-50 border border-zinc-200 px-4 text-[13px] font-bold outline-none focus:border-[#F5332C] focus:bg-white transition-all rounded-none" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">File / URL link</label>
                                    <input 
                                        type="url"
                                        placeholder="https://drive.google.com/..."
                                        value={formData.fileUrl} 
                                        onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })} 
                                        className="w-full h-11 bg-zinc-50 border border-zinc-200 px-4 text-[13px] font-bold outline-none focus:border-[#F5332C] focus:bg-white transition-all rounded-none" 
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Batch Target</label>
                                        <select 
                                            value={formData.batch} 
                                            onChange={(e) => setFormData({ ...formData, batch: e.target.value })} 
                                            className="w-full h-11 bg-zinc-50 border border-zinc-200 px-4 text-[13px] font-bold outline-none focus:border-[#F5332C] focus:bg-white transition-all rounded-none"
                                        >
                                            <option value="All">All Batches</option>
                                            <option value="Batch 1">Batch 1</option>
                                            <option value="Batch 2">Batch 2</option>
                                            <option value="Batch 3">Batch 3</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Author Name</label>
                                        <input 
                                            required 
                                            type="text"
                                            placeholder="Trainer Name"
                                            value={formData.authorName} 
                                            onChange={(e) => setFormData({ ...formData, authorName: e.target.value })} 
                                            className="w-full h-11 bg-zinc-50 border border-zinc-200 px-4 text-[13px] font-bold outline-none focus:border-[#F5332C] focus:bg-white transition-all rounded-none" 
                                        />
                                    </div>
                                </div>

                                <button 
                                    disabled={sendingForm}
                                    type="submit" 
                                    className="w-full h-14 bg-zinc-900 text-white hover:bg-black font-bold uppercase tracking-widest text-[11px] flex items-center justify-center transition-all disabled:opacity-50 mt-6"
                                >
                                    {sendingForm ? "Broadcasting..." : "Publish to Feed"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Feed published stream */}
                    <div className="lg:col-span-3 space-y-6 text-left">
                        <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                            <h3 className="text-lg font-black tracking-tight text-zinc-900 uppercase">Broadcast Stream ({posts.length})</h3>
                        </div>

                        <div className="space-y-4 max-h-[750px] overflow-y-auto pr-2 custom-scrollbar">
                            {posts.map((post) => {
                                const style = getTypeStyles(post.type);
                                return (
                                    <div key={post.id} className="bg-white border border-zinc-200 p-6 flex flex-col md:flex-row md:items-start justify-between gap-6 hover:border-zinc-400 transition-all">
                                        <div className="space-y-3 flex-1 overflow-hidden">
                                            <div className="flex flex-wrap items-center gap-2.5">
                                                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 border ${style.bg}`}>
                                                    {style.label}
                                                </span>
                                                <span className="bg-zinc-100 text-zinc-500 border border-zinc-200 text-[9px] font-bold px-2 py-0.5">
                                                    Cohort: {post.batch}
                                                </span>
                                                <span className="bg-red-50 text-red-600 border border-red-100 text-[9px] font-bold px-2 py-0.5">
                                                    {post.category}
                                                </span>
                                            </div>

                                            <div className="space-y-1">
                                                <h4 className="text-base font-extrabold text-zinc-900 leading-snug">{post.title}</h4>
                                                {post.content && (
                                                    <p className="text-zinc-500 text-[11.5px] font-semibold leading-relaxed line-clamp-3">
                                                        {post.content}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                                                <span className="flex items-center gap-1.5"><User size={12} /> {post.authorName}</span>
                                                <span className="flex items-center gap-1.5"><Clock size={12} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="flex md:flex-col items-center justify-end gap-2.5 shrink-0 border-t md:border-t-0 border-zinc-100 pt-4 md:pt-0">
                                            {post.fileUrl && (
                                                <a 
                                                    href={post.fileUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="h-10 px-4 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200 flex items-center justify-center font-bold text-[11px] transition-colors gap-2"
                                                >
                                                    <ExternalLink size={12} /> Preview
                                                </a>
                                            )}
                                            <button 
                                                onClick={() => handleDeletePost(post.id)}
                                                className="h-10 px-4 border border-red-200 text-[#F5332C] hover:bg-red-50 flex items-center justify-center font-bold text-[11px] transition-all"
                                            >
                                                <Trash2 size={12} className="mr-2" /> Neutralize
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            {posts.length === 0 && !loading && (
                                <div className="py-20 text-center bg-white border border-zinc-200">
                                    <Rss size={36} className="text-zinc-300 mx-auto mb-3 animate-pulse" />
                                    <h4 className="text-sm font-bold text-zinc-700 uppercase tracking-widest">Broadcast Empty</h4>
                                    <p className="text-zinc-400 text-xs font-semibold px-10 mt-1">
                                        No materials have been published to the study feed yet. Use the form to distribute notes.
                                    </p>
                                </div>
                            )}

                            {loading && (
                                <div className="py-20 text-center">
                                    <div className="animate-spin h-6 w-6 border-2 border-zinc-900 border-t-transparent mx-auto rounded-full" />
                                    <p className="text-zinc-400 text-xs font-semibold mt-2">Loading study feed records...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
