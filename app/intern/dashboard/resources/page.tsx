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
    ExternalLink
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
        <div className="p-4 lg:p-10 w-full mx-auto font-sans pb-24 text-zinc-900 bg-[#FBFBFB] min-h-screen">
             {/* Page Header - Compact & Direct Icon */}
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                 <div className="flex items-center gap-3">
                    <Folder size={32} className="text-[#003366]" fill="currentColor" fillOpacity={0.1} />
                    <div>
                        <h1 className="text-3xl font-medium text-zinc-800 tracking-tight">Resource Library</h1>
                        <p className="text-[13px] text-zinc-400 font-medium">Access your technical materials and learning guides.</p>
                    </div>
                 </div>

                 <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={15} />
                    <input 
                        type="text"
                        placeholder="Search for files, guides..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#003366]/5 focus:border-[#003366] transition-all shadow-sm"
                    />
                </div>
             </div>

             {/* Categories (Folder View) - More Compact */}
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
                 {categories.map(tab => (
                     <button
                         key={tab}
                         onClick={() => setActiveCategory(tab)}
                         className={`group p-4 rounded-2xl border transition-all text-left flex flex-col gap-3 ${
                             activeCategory === tab
                                 ? "bg-[#003366] border-[#003366] shadow-lg shadow-[#003366]/10"
                                 : "bg-white border-zinc-100 hover:border-[#003366]/20 hover:shadow-md"
                         }`}
                     >
                         <Folder 
                            size={24} 
                            className={activeCategory === tab ? "text-white/80" : "text-[#003366]/40 group-hover:text-[#003366] transition-colors"} 
                            fill="currentColor" 
                            fillOpacity={activeCategory === tab ? 0.2 : 0.1}
                         />
                         <span className={`text-[13px] font-bold tracking-tight truncate ${activeCategory === tab ? "text-white" : "text-zinc-600"}`}>
                            {tab}
                         </span>
                     </button>
                 ))}
             </div>

             {/* Library List View */}
             <div className="bg-white border border-zinc-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="px-8 py-5 border-b border-zinc-50 bg-zinc-50/30 flex items-center justify-between">
                    <h2 className="text-[14px] font-bold text-zinc-800 uppercase tracking-widest">Library Files</h2>
                    <span className="text-[12px] font-medium text-zinc-400">{filtered.length} items</span>
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center">
                        <div className="animate-spin h-7 w-7 border-2 border-[#003366] border-t-transparent rounded-full" />
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="divide-y divide-zinc-50">
                        {filtered.map((resource, i) => (
                            <motion.div 
                                key={resource.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="group px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-50/50 transition-all cursor-default"
                            >
                                <div className="flex items-center gap-5 flex-1">
                                    <div className={`p-3 rounded-xl transition-transform group-hover:scale-105 ${getTypeColor(resource.type)}`}>
                                        <FileText size={20} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h3 className="text-[15px] font-bold text-zinc-800 group-hover:text-[#003366] transition-colors">
                                            {resource.title}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[11px] font-medium text-zinc-400">{resource.date}</span>
                                            <span className="w-1 h-1 rounded-full bg-zinc-200"></span>
                                            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">{resource.category}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <a 
                                        href={resource.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="px-5 py-2.5 bg-zinc-100 text-zinc-600 rounded-xl text-[12px] font-bold hover:bg-[#003366] hover:text-white transition-all flex items-center gap-2"
                                    >
                                        {resource.type === 'WEB' ? 'Open Link' : 'Download File'}
                                        {resource.type === 'WEB' ? <ExternalLink size={14} /> : <Download size={14} />}
                                    </a>
                                    <button className="p-2.5 text-zinc-300 hover:text-zinc-500 transition-colors">
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-32 text-center flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                            <Lock size={32} className="text-zinc-200" />
                        </div>
                        <h3 className="text-[16px] font-bold text-zinc-800 mb-2">No files found</h3>
                        <p className="text-[13px] text-zinc-400 max-w-sm mx-auto font-medium">
                            No materials match your current filter or search criteria.
                        </p>
                    </div>
                )}
             </div>
  
             {/* Support Note */}
             <div className="mt-16 flex items-center justify-center gap-4 text-zinc-400">
                 <div className="h-px bg-zinc-100 flex-1"></div>
                 <p className="text-[12px] font-medium italic">Contact support for missing library access</p>
                 <div className="h-px bg-zinc-100 flex-1"></div>
             </div>
        </div>
    );
}
