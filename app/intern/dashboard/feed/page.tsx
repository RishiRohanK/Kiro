"use client";

import { useEffect, useState } from "react";
import { 
    Search, 
    PlayCircle, 
    FileText, 
    Presentation, 
    File, 
    BookOpen,
    ArrowDownToLine
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function InternFeedPage() {
    const [posts, setPosts] = useState<FeedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("intern_user");
        let batch = "All";
        if (storedUser) {
            try {
                const userObj = JSON.parse(storedUser);
                if (userObj.batch) {
                    batch = userObj.batch;
                }
            } catch (e) {
                console.error("Error reading user details", e);
            }
        }

        const fetchFeed = async () => {
            try {
                const res = await fetch(`/api/intern/feed?batch=${encodeURIComponent(batch)}`);
                const data = await res.json();
                if (data.success) {
                    setPosts(data.posts);
                }
            } catch (err) {
                console.error("Failed to fetch feed");
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, []);

    // Simple search filtering
    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(search.toLowerCase()) || 
        (post.content && post.content.toLowerCase().includes(search.toLowerCase())) ||
        post.category.toLowerCase().includes(search.toLowerCase())
    );

    // Style helper for resource type labels
    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'NOTES': return 'Notes';
            case 'DOCUMENT': return 'PDF Document';
            case 'PPT': return 'Slideshow';
            case 'VIDEO': return 'Lecture';
            default: return 'Asset';
        }
    };

    // YouTube embed utility
    const getYouTubeEmbedUrl = (url: string) => {
        if (!url) return "";
        let videoId = "";
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        if (match && match[2].length === 11) {
            videoId = match[2];
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
    };

    // Date formatting helper like Twitter (e.g. May 18)
    const formatTwitterDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    return (
        <div className="w-full px-4 lg:px-10 py-10 font-sans pb-28 text-zinc-900 bg-white min-h-screen">
            
            {/* Minimal Search Bar Header */}
            <div className="mb-12 flex justify-center">
                <div className="relative w-full max-w-xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={17} />
                    <input 
                        type="text"
                        placeholder="Search academic notes, slides, videos..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-full text-sm font-semibold outline-none focus:border-[#003366] focus:bg-white transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Video Modal stream overlay */}
            <AnimatePresence>
                {activeVideoUrl && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.96 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.96 }}
                            className="bg-zinc-950 border border-zinc-800 rounded-none w-full max-w-4xl overflow-hidden shadow-2xl relative"
                        >
                            <div className="h-12 bg-zinc-900 px-6 flex items-center justify-between text-white border-b border-zinc-850">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Class Video Stream</span>
                                <button 
                                    onClick={() => setActiveVideoUrl(null)} 
                                    className="text-[11px] font-bold text-red-500 hover:text-red-400 hover:underline"
                                >
                                    Close Player
                                </button>
                            </div>
                            <div className="aspect-video w-full">
                                <iframe 
                                    src={getYouTubeEmbedUrl(activeVideoUrl)}
                                    className="w-full h-full border-none"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                    allowFullScreen
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Twitter/Tweet Card Stream Grid */}
            <div className="min-h-[400px]">
                {loading ? (
                    <div className="py-24 flex flex-col items-center justify-center gap-3">
                        <div className="animate-spin h-7 w-7 border-2 border-[#003366] border-t-transparent rounded-full" />
                        <span className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase">Syncing classroom feed...</span>
                    </div>
                ) : filteredPosts.length > 0 ? (
                    <div className="max-w-xl mx-auto space-y-4">
                        {filteredPosts.map((post, i) => {
                            const isVideo = post.type === 'VIDEO';
                            const handleName = post.authorName.toLowerCase().replace(/\s+/g, '');

                            return (
                                <motion.div 
                                    key={post.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25, delay: i * 0.04 }}
                                    className="bg-white border border-zinc-200 p-5 rounded-2xl flex flex-col gap-4 text-left shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:bg-zinc-50/30 transition-all group"
                                >
                                    {/* Profile & Avatar Header row */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            {/* Branded Official Profile Avatar */}
                                            <img 
                                                src="https://ik.imagekit.io/dypkhqxip/logoch?updatedAt=1778760593994" 
                                                alt="Profile" 
                                                className="h-10 w-10 rounded-full object-cover border border-zinc-200 select-none shrink-0"
                                            />

                                            {/* Profile credentials */}
                                            <div className="flex flex-col leading-none">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[14px] font-bold text-zinc-900 tracking-tight hover:underline cursor-pointer">
                                                        {post.authorName}
                                                    </span>
                                                    {/* Verified blue check badge */}
                                                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#1d9bf0] shrink-0 fill-current" aria-label="Verified account">
                                                        <g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.99-3.818-3.99-.48 0-.94.1-1.348.27C14.825 2.515 13.512 1.5 12 1.5s-2.825 1.015-3.422 2.28c-.406-.17-.866-.27-1.348-.27-2.108 0-3.818 1.78-3.818 3.99 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.58.875 2.95 2.148 3.6-.154.43-.238.9-.238 1.4 0 2.21 1.71 3.99 3.818 3.99.48 0 .94-.1 1.348-.27.597 1.265 1.91 2.27 3.422 2.27s2.825-1.005 3.422-2.27c.406.17.866.27 1.348.27 2.108 0 3.818-1.78 3.818-3.99 0-.5-.084-.97-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.5 4L6 12.5l1.5-1.5 2.5 2.5 6.5-6.5 1.5 1.5-8 8z"></path></g>
                                                    </svg>
                                                </div>
                                                <span className="text-[12px] text-zinc-500 font-semibold mt-1">
                                                    @{handleName} • {formatTwitterDate(post.createdAt)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Right hand category label pill */}
                                        <span className="text-[10px] font-bold text-zinc-400 border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                            {post.category}
                                        </span>
                                    </div>

                                    {/* Tweet Body content */}
                                    <div className="space-y-3 pl-0 md:pl-[52px]">
                                        <div className="space-y-1.5">
                                            {/* Large Tweet Main Title */}
                                            <h3 className="text-[15px] font-bold text-zinc-900 leading-snug tracking-tight">
                                                {post.title}
                                            </h3>
                                            
                                            {/* Tweet message content */}
                                            {post.content && (
                                                <p className="text-[14px] text-zinc-600 leading-normal font-medium whitespace-pre-wrap">
                                                    {post.content}
                                                </p>
                                            )}
                                        </div>

                                        {/* Attachment preview box ( mimics Twitter card links ) */}
                                        {post.fileUrl && (
                                            <div className="border border-zinc-200 rounded-2xl overflow-hidden hover:bg-zinc-100/50 transition-colors cursor-pointer select-none">
                                                {isVideo ? (
                                                    /* Video attachment click preview player */
                                                    <div 
                                                        onClick={() => setActiveVideoUrl(post.fileUrl)}
                                                        className="bg-zinc-950 aspect-video flex flex-col items-center justify-center relative group/video border-b border-zinc-200"
                                                    >
                                                        <div className="absolute inset-0 bg-black/50 z-10 group-hover/video:bg-black/40 transition-colors" />
                                                        <PlayCircle size={40} className="text-white z-20 transition-transform group-hover/video:scale-110 drop-shadow-md" />
                                                        <span className="absolute bottom-3 left-3 z-20 text-[9px] text-white/80 font-bold uppercase tracking-widest">
                                                            Click to play lecture video
                                                        </span>
                                                    </div>
                                                ) : (
                                                    /* General document preview box link */
                                                    <a 
                                                        href={post.fileUrl} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="p-3.5 bg-zinc-50/50 border-b border-zinc-200 flex items-center justify-between gap-4 group/preview"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-[#003366]/5 text-[#003366] rounded-xl border border-[#003366]/10">
                                                                {post.type === 'PPT' ? <Presentation size={18} /> : 
                                                                 post.type === 'NOTES' ? <FileText size={18} /> : <File size={18} />}
                                                            </div>
                                                            <div className="flex flex-col text-left">
                                                                <span className="text-[12.5px] font-bold text-zinc-800 leading-tight">
                                                                    {post.fileName || "Academic Reference Attachment"}
                                                                </span>
                                                                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">
                                                                    {getTypeLabel(post.type)} • Download File
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <ArrowDownToLine size={15} className="text-zinc-400 group-hover/preview:translate-y-0.5 transition-transform" />
                                                    </a>
                                                )}
                                                
                                                {/* Bottom bar of the preview card */}
                                                <div className="px-4 py-2 bg-zinc-50 text-[11px] font-semibold text-zinc-500 border-t border-zinc-200 flex items-center justify-between">
                                                    <span>Distributor: {post.authorName}</span>
                                                    <span className="uppercase text-[9px] font-bold tracking-widest text-[#003366]">Student Forge</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-20 text-center bg-white border border-zinc-200 rounded-2xl max-w-md mx-auto shadow-sm">
                        <Search size={32} className="text-zinc-300 mx-auto mb-3 animate-pulse" />
                        <h3 className="text-base font-bold text-zinc-800 uppercase tracking-widest">Feed is quiet</h3>
                        <p className="text-[12px] text-zinc-400 font-semibold px-8 mt-1">
                            No study materials match your search parameters.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
