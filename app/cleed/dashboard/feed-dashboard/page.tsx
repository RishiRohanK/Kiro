"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Rss,
    FileText,
    File,
    Video,
    Presentation,
    TrendingUp,
    Users,
    Activity,
    Layers,
    ArrowRight,
    ArrowLeft,
    ChevronRight,
    BookOpen,
    Search,
    Download,
    Eye
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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

export default function CleedFeedDashboard() {
    const router = useRouter();
    const [posts, setPosts] = useState<FeedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

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
            console.error("Failed to fetch posts for dashboard");
        } finally {
            setLoading(false);
        }
    };

    // Calculate analytics metrics
    const totalCount = posts.length;
    const noteCount = posts.filter(p => p.type === 'NOTES').length;
    const videoCount = posts.filter(p => p.type === 'VIDEO').length;
    const pptCount = posts.filter(p => p.type === 'PPT').length;
    const docCount = posts.filter(p => p.type === 'DOCUMENT').length;
    const otherCount = posts.filter(p => p.type === 'OTHER').length;

    // Cohorts batch counts
    const batch1Count = posts.filter(p => p.batch === 'Batch 1').length;
    const batch2Count = posts.filter(p => p.batch === 'Batch 2').length;
    const batch3Count = posts.filter(p => p.batch === 'Batch 3').length;
    const allBatchesCount = posts.filter(p => p.batch === 'All').length;

    // Unique Categories counting
    const categoryMap: { [key: string]: number } = {};
    posts.forEach(p => {
        const cat = p.category || "General";
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
    const sortedCategories = Object.entries(categoryMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); // Take top 5

    // Search query filtering
    const filteredSearch = posts.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F5F7FA] pb-24 text-zinc-900">
            {/* Top red header highlight line */}
            <div className="h-1 bg-[#F5332C] w-full" />

            {/* Custom Header Nav Bar */}
            <header className="bg-white border-b border-zinc-200 h-16 px-6 md:px-10 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <Link href="/cleed/dashboard" className="h-9 w-9 bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 transition-colors flex items-center justify-center rounded-none">
                        <ArrowLeft size={16} className="text-zinc-600" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-500 text-[11px] font-bold tracking-tight uppercase">Cleed Portal</span>
                        <ChevronRight size={10} className="text-zinc-400" />
                        <span className="text-zinc-900 font-extrabold text-[12px] tracking-tight uppercase flex items-center gap-2">
                            <LayoutDashboard size={14} className="text-[#F5332C]" /> Feed Dashboard
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Link href="/cleed/dashboard/feed" className="px-5 h-9 bg-[#F5332C] hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center transition-colors">
                        Add & Manage Materials
                    </Link>
                    <Link href="/cleed/dashboard" className="px-5 h-9 border border-zinc-300 hover:bg-zinc-50 text-zinc-700 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center">
                        Main Panel
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-10">
                {/* Dashboard Page Intro title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 uppercase">Academic Feed Analytics</h1>
                        <p className="text-zinc-500 text-[13px] font-semibold">
                            Central intelligence node for monitoring technical assets, class distributions, and cohort coverages.
                        </p>
                    </div>

                    <div className="bg-zinc-900 text-white p-4 border border-zinc-800 flex items-center gap-4">
                        <TrendingUp size={22} className="text-emerald-500" />
                        <div>
                            <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Asset Growth Pulse</span>
                            <p className="text-xs font-bold text-zinc-300 mt-0.5">Healthy & Operational</p>
                        </div>
                    </div>
                </div>

                {/* Dashboard metric grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {[
                        { title: "Total Broadcasts", val: totalCount, icon: Rss, desc: "Publications shared", border: "border-l-4 border-l-[#F5332C]" },
                        { title: "Study Notes", val: noteCount, icon: FileText, desc: "Syllabus guides", border: "border-l-4 border-l-emerald-500" },
                        { title: "Lecture Modules", val: videoCount, icon: Video, desc: "Stream classrooms", border: "border-l-4 border-l-rose-500" },
                        { title: "Slide Decks / PPT", val: pptCount, icon: Presentation, desc: "Interactive slides", border: "border-l-4 border-l-orange-500" },
                        { title: "Files / Documents", val: docCount, icon: File, desc: "PDFs & Handouts", border: "border-l-4 border-l-blue-500" }
                    ].map((m, i) => (
                        <div key={i} className={`bg-white border border-zinc-200 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden text-left ${m.border}`}>
                            <div className="flex items-start justify-between">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">{m.title}</span>
                                <m.icon size={18} className="text-zinc-400" />
                            </div>
                            <div className="mt-6 space-y-1">
                                <h3 className="text-3xl font-black text-zinc-800 leading-none">{m.val}</h3>
                                <p className="text-[11px] text-zinc-400 font-semibold">{m.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Visual Chart Stacks */}
                <div className="grid lg:grid-cols-2 gap-8 text-left">
                    {/* Category breakdowns */}
                    <div className="bg-white border border-zinc-200 p-8 shadow-sm space-y-6">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-2">
                                <Layers size={16} className="text-[#F5332C]" /> Top Category Coverage
                            </h3>
                            <span className="text-[10px] text-zinc-400 font-bold uppercase">Volume share</span>
                        </div>

                        <div className="space-y-4">
                            {sortedCategories.map(([cat, count], i) => {
                                const percent = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
                                return (
                                    <div key={i} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs font-bold">
                                            <span className="text-zinc-700">{cat}</span>
                                            <span className="text-zinc-500">{count} posts ({percent}%)</span>
                                        </div>
                                        <div className="w-full h-2 bg-zinc-100 rounded-none overflow-hidden">
                                            <div 
                                                className="h-full bg-zinc-900 transition-all duration-500" 
                                                style={{ width: `${percent}%`, backgroundColor: i === 0 ? '#F5332C' : '#18181B' }} 
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                            {sortedCategories.length === 0 && (
                                <p className="text-xs font-semibold text-zinc-400 text-center py-10">No categories mapped yet</p>
                            )}
                        </div>
                    </div>

                    {/* Batch target allocations */}
                    <div className="bg-white border border-zinc-200 p-8 shadow-sm space-y-6">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-2">
                                <Users size={16} className="text-[#F5332C]" /> Cohorts Target Matrix
                            </h3>
                            <span className="text-[10px] text-zinc-400 font-bold uppercase">Distributions</span>
                        </div>

                        <div className="space-y-5">
                            {[
                                { name: "All Batches Combined", count: allBatchesCount, bg: "bg-zinc-900" },
                                { name: "Cohort Batch 1", count: batch1Count, bg: "bg-red-500" },
                                { name: "Cohort Batch 2", count: batch2Count, bg: "bg-blue-500" },
                                { name: "Cohort Batch 3", count: batch3Count, bg: "bg-emerald-500" }
                            ].map((cohort, idx) => {
                                const percent = totalCount > 0 ? Math.round((cohort.count / totalCount) * 100) : 0;
                                return (
                                    <div key={idx} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-xs font-bold">
                                            <span className="text-zinc-700">{cohort.name}</span>
                                            <span className="text-zinc-500">{cohort.count} items ({percent}%)</span>
                                        </div>
                                        <div className="w-full h-2 bg-zinc-100 rounded-none overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-500 ${cohort.bg}`} 
                                                style={{ width: `${percent}%` }} 
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Audit log book & search */}
                <div className="bg-white border border-zinc-200 p-8 shadow-sm space-y-6 text-left">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 flex items-center gap-2">
                            <Activity size={16} className="text-[#F5332C]" /> Academic Feed Logbook
                        </h3>

                        <div className="relative w-full md:w-[280px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                            <input 
                                type="text"
                                placeholder="Filter records by keywords..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 text-xs font-semibold outline-none focus:border-[#F5332C] focus:bg-white transition-all rounded-none" 
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-200 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                    <th className="py-3 px-4">Title</th>
                                    <th className="py-3 px-4">Type</th>
                                    <th className="py-3 px-4">Category</th>
                                    <th className="py-3 px-4">Cohort</th>
                                    <th className="py-3 px-4">Instructor</th>
                                    <th className="py-3 px-4">Published Date</th>
                                    <th className="py-3 px-4 text-right">Preview</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSearch.map((post) => (
                                    <tr key={post.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors text-[12px] font-bold">
                                        <td className="py-3.5 px-4 text-zinc-800 max-w-[200px] truncate">{post.title}</td>
                                        <td className="py-3.5 px-4">
                                            <span className="bg-zinc-100 text-zinc-500 text-[9px] uppercase px-2 py-0.5 border border-zinc-200">
                                                {post.type}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-[#F5332C]">{post.category}</td>
                                        <td className="py-3.5 px-4 text-zinc-500">{post.batch}</td>
                                        <td className="py-3.5 px-4 text-zinc-500">{post.authorName}</td>
                                        <td className="py-3.5 px-4 text-zinc-400 font-semibold">{new Date(post.createdAt).toLocaleDateString()}</td>
                                        <td className="py-3.5 px-4 text-right">
                                            {post.fileUrl ? (
                                                <a href={post.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center h-7 w-7 bg-zinc-900 hover:bg-black text-white rounded-none transition-colors">
                                                    <Eye size={12} />
                                                </a>
                                            ) : (
                                                <span className="text-zinc-300">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                                {filteredSearch.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-zinc-400 font-semibold text-xs uppercase">
                                            No asset matching filter query.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
