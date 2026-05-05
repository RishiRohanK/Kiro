"use client";

import { useEffect, useState } from "react";
import { 
    BookOpen, 
    Download, 
    Search, 
    FileText,
    Globe,
    Lock,
    ArrowUpRight,
    LucideIcon,
    Folder,
    File,
    ChevronRight,
    ExternalLink,
    Video
} from "lucide-react";
import { motion } from "framer-motion";

interface Resource {
    id: string;
    title: string;
    description: string;
    type: 'PDF' | 'VIDEO' | 'WEB' | 'ZIP' | 'DOC';
    url: string;
    category: string;
    date: string;
}

export default function InternResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const res = await fetch("/api/intern/resources");
                const data = await res.json();
                if (data.success) {
                    setResources(data.resources);
                }
            } catch (err) {
                console.error("Failed to fetch resources");
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    const categories = ["All", ...Array.from(new Set(resources.map(r => r.category)))];

    const filtered = resources.filter(r => {
        const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                             r.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === "All" || r.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'WEB': return 'text-blue-500 bg-blue-50';
            case 'PDF': return 'text-red-500 bg-red-50';
            case 'VIDEO': return 'text-purple-500 bg-purple-50';
            case 'ZIP': return 'text-orange-500 bg-orange-50';
            default: return 'text-zinc-500 bg-zinc-50';
        }
    };

    return (
        <div className="w-full px-4 lg:px-10 py-8 font-sans pb-24 text-zinc-900 bg-white min-h-screen">
             {/* Page Header - Synced with Assessments */}
             <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 border-b border-zinc-100 pb-8">
                 <div className="flex items-center gap-3">
                    <Folder size={32} className="text-[#003366]" />
                    <h1 className="text-3xl font-medium text-zinc-800 tracking-tight">Resource Library</h1>
                 </div>

                 <div className="relative w-full lg:w-[320px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300" size={15} />
                    <input 
                        type="text"
                        placeholder="Search for materials..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-none text-[13px] focus:outline-none focus:border-[#003366] transition-all"
                    />
                </div>
             </div>

             {/* Categories - Medium Tabs style */}
             <div className="flex flex-wrap gap-6 mb-8 border-b border-zinc-100">
                 {categories.map(tab => (
                     <button
                         key={tab}
                         onClick={() => setActiveCategory(tab)}
                         className={`relative pb-4 text-[13px] font-medium transition-all whitespace-nowrap ${
                             activeCategory === tab
                                 ? "text-[#003366] border-b-2 border-[#003366]"
                                 : "text-zinc-500 hover:text-zinc-700"
                         }`}
                     >
                        {tab}
                     </button>
                 ))}
             </div>

             {/* Library Grid - XL Titles like Assessments */}
             <div className="min-h-[400px]">
                {loading ? (
                    <div className="py-20 flex justify-center">
                        <div className="animate-spin h-7 w-7 border-2 border-zinc-900 border-t-transparent rounded-full" />
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map((resource, i) => (
                            <motion.div 
                                key={resource.id}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white border border-zinc-100 rounded-none p-6 flex flex-col gap-5 hover:border-[#003366]/10 hover:shadow-md transition-all group"
                            >
                                <div className="flex justify-between items-start">
                                    <div className={`p-3 rounded-none ${getTypeColor(resource.type)}`}>
                                        {resource.type === 'VIDEO' ? <Video size={20} /> : 
                                         resource.type === 'WEB' ? <Globe size={20} /> : 
                                         resource.type === 'ZIP' ? <Folder size={20} /> : 
                                         <FileText size={20} />}
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">{resource.type}</span>
                                        <span className="text-[11px] text-zinc-400 font-medium mt-1">{resource.date}</span>
                                    </div>
                                </div>

                                <div className="space-y-3 flex-1">
                                    <h3 className="text-xl font-medium text-[#003366] tracking-tight group-hover:text-blue-500 transition-colors line-clamp-2">
                                        {resource.title}
                                    </h3>
                                    <div className="bg-zinc-50 border border-zinc-100 p-3 rounded-none">
                                        <p className="text-[12px] text-zinc-500 leading-relaxed line-clamp-3">
                                            {resource.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-2 flex items-center justify-between border-t border-zinc-50">
                                    <span className="text-[11px] font-medium text-zinc-400 bg-zinc-50 px-2 py-1">
                                        {resource.category}
                                    </span>
                                    <a 
                                        href={resource.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-[12px] font-medium text-blue-500 hover:underline"
                                    >
                                        {resource.type === 'WEB' ? 'Open link' : 'Download'}
                                        <ChevronRight size={14} />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center bg-white border border-zinc-100 rounded-none">
                        <Lock size={32} className="text-zinc-200 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-[#003366] mb-1">No matching materials</h3>
                        <p className="text-[14px] text-zinc-400 font-medium">
                            Try adjusting your filters to find specific resources.
                        </p>
                    </div>
                )}
             </div>
   
             {/* Bottom Note - Sharp */}
             <div className="mt-24 pt-12 border-t border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-4">
                 <div className="flex items-center gap-3">
                     <div className="h-10 w-10 bg-zinc-900 flex items-center justify-center text-white text-[12px] font-bold">SF</div>
                     <div>
                         <p className="text-[13px] font-medium text-zinc-800">Technical Support</p>
                         <p className="text-[12px] text-zinc-400">Contact mentor for module access.</p>
                     </div>
                 </div>
                 <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">TECHNICAL LIBRARY V2.4</div>
             </div>
        </div>
    );
}
