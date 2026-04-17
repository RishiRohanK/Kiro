"use client";

import { useEffect, useState } from "react";
import { 
    BookOpen, 
    Download, 
    Search, 
    Filter,
    FileText,
    Globe,
    Lock,
    ArrowUpRight,
    LucideIcon
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

    const getTypeIcon = (type: string): LucideIcon => {
        switch (type) {
            case 'WEB': return Globe;
            case 'DOC': return FileText;
            default: return BookOpen;
        }
    };

    return (
        <div className="p-4 lg:p-6 max-w-[1400px] mx-auto font-sans pb-24 text-zinc-900">
             {/* Page Header */}
             <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                 <div className="space-y-1 text-left">
                     <div className="flex items-center gap-2 text-[#003366]">
                         <span className="text-[11px] font-semibold opacity-50 uppercase tracking-widest">Scholar Hub</span>
                     </div>
                     <h1 className="text-3xl font-semibold text-[#003366]">Resource Library</h1>
                     <p className="text-sm text-zinc-500 font-medium">Download guides and technical materials for your track.</p>
                 </div>
 
                 <div className="flex flex-col sm:flex-row items-center gap-3">
                     <div className="relative w-full sm:w-64">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={13} />
                         <input 
                             type="text"
                             placeholder="Search library..."
                             value={search}
                             onChange={(e) => setSearch(e.target.value)}
                             className="w-full h-11 bg-zinc-50 border border-zinc-100 pl-10 pr-4 text-[12px] font-medium focus:outline-none focus:border-[#003366] transition-all"
                         />
                     </div>
                     <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-100 h-11 px-4">
                         <Filter size={13} className="text-zinc-400" />
                         <select 
                             value={activeCategory}
                             onChange={(e) => setActiveCategory(e.target.value)}
                             className="bg-transparent text-[11px] font-semibold focus:outline-none"
                         >
                             {categories.map(c => <option key={c} value={c}>{c}</option>)}
                         </select>
                     </div>
                 </div>
             </div>
 
             {loading ? (
                 <div className="py-20 flex justify-center">
                     <div className="animate-spin h-8 w-8 border-4 border-[#003366] border-t-transparent rounded-full" />
                 </div>
             ) : filtered.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                     {filtered.map((resource, i) => {
                         const Icon = getTypeIcon(resource.type);
                         return (
                             <motion.div 
                                 key={resource.id}
                                 initial={{ opacity: 0, scale: 0.98 }}
                                 animate={{ opacity: 1, scale: 1 }}
                                 transition={{ delay: i * 0.05 }}
                                 className="bg-zinc-50 border border-zinc-100 p-6 flex flex-col justify-between hover:bg-white hover:border-[#003366]/20 transition-all group overflow-hidden relative text-left"
                             >
                                 <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                     <Icon size={80} strokeWidth={1} />
                                 </div>
                                 
                                 <div>
                                     <div className="flex items-center justify-between mb-4">
                                         <div className="text-[10px] font-semibold px-2 py-0.5 bg-[#E0E7FF] text-[#003366] uppercase tracking-wider">
                                             {resource.type}
                                         </div>
                                         <span className="text-[10px] font-semibold text-zinc-400">{resource.date}</span>
                                     </div>
                                     <h3 className="text-sm font-semibold text-[#003366] mb-2 line-clamp-2">
                                         {resource.title}
                                     </h3>
                                     <p className="text-[11px] text-zinc-500 font-medium leading-relaxed mb-6 line-clamp-3">
                                         {resource.description}
                                     </p>
                                 </div>
 
                                 <div className="pt-4 border-t border-zinc-200/50 mt-auto flex items-center justify-between">
                                     <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">{resource.category}</span>
                                     <a 
                                         href={resource.url} 
                                         target="_blank" 
                                         rel="noopener noreferrer"
                                         className="h-9 w-9 bg-zinc-900 text-white flex items-center justify-center hover:bg-[#003366] transition-all"
                                     >
                                         {resource.type === 'WEB' ? <ArrowUpRight size={14} /> : <Download size={14} />}
                                     </a>
                                 </div>
                             </motion.div>
                         );
                     })}
                 </div>
             ) : (
                 <div className="p-24 bg-zinc-50 border border-zinc-100 text-center flex flex-col items-center justify-center">
                     <Lock size={40} className="text-zinc-200 mb-4" />
                     <h3 className="text-sm font-semibold text-[#003366] uppercase tracking-[0.2em]">No Materials</h3>
                     <p className="text-[11px] text-zinc-400 font-medium mt-2 max-w-xs leading-relaxed">
                         Materials will be added by your leads through the Cleed portal.
                     </p>
                 </div>
             )}
 
             {/* Support Note */}
             <div className="mt-16 p-8 bg-zinc-50 border border-zinc-100 text-center max-w-2xl mx-auto">
                 <h4 className="text-[11px] font-semibold text-[#003366] uppercase tracking-widest mb-2">Need Support?</h4>
                 <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                     If you can't access these materials, please raise your hand in the sidebar or contact support.
                 </p>
             </div>
        </div>
    );
}
