"use client";

import { motion } from "framer-motion";
import { 
    Layers, 
    Download, 
    ExternalLink, 
    Globe, 
    Smartphone, 
    Database,
    ArrowUpRight
} from "lucide-react";

export default function StackFlowPage() {
    const roadmaps = [
        {
            title: "Web Development",
            description: "Build beautiful websites and web apps that everyone can use.",
            details: "Master the frontend and modern web technologies to create world-class browser experiences.",
            logo: "https://www.vectorlogo.zone/logos/w3_html5/w3_html5-icon.svg",
            color: "text-blue-600",
            bg: "bg-blue-50/50",
            pdf: "https://ik.imagekit.io/dypkhqxip/frontend.pdf"
        },
        {
            title: "App Development",
            description: "Create high-quality mobile applications for both iOS and Android.",
            details: "Learn to build cross-platform mobile apps using industry-standard frameworks and tools.",
            logo: "https://www.vectorlogo.zone/logos/flutterio/flutterio-icon.svg",
            color: "text-violet-600",
            bg: "bg-violet-50/50",
            pdf: "https://ik.imagekit.io/dypkhqxip/android.pdf"
        },
        {
            title: "Backend Core",
            description: "Design powerful servers and databases that keep modern apps running.",
            details: "Understand the core of system design, server logic, and database management.",
            logo: "https://cdn.worldvectorlogo.com/logos/nodejs-icon.svg",
            color: "text-emerald-600",
            bg: "bg-emerald-50/50",
            pdf: "https://ik.imagekit.io/dypkhqxip/backend.pdf"
        }
    ];

    return (
        <div className="p-4 lg:p-6 max-w-[1200px] mx-auto font-sans pb-24">
            {/* Page Header */}
            <div className="mb-10 space-y-1">
                <div className="flex items-center gap-2 text-[#003366]">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">Discovery</span>
                </div>
                <h1 className="text-3xl font-bold text-[#003366]">Stack Flow</h1>
                <p className="text-sm text-zinc-500 font-medium">Simple steps to learn new skills. Choose a path and start building.</p>
            </div>

            {/* Roadmap Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roadmaps.map((roadmap, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white border border-[#003366]/5 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col"
                    >
                        <div className="p-6 flex-1">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`h-12 w-12 flex items-center justify-center ${roadmap.bg} p-2.5`}>
                                    <img 
                                        src={roadmap.logo} 
                                        alt={roadmap.title} 
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                                    <ArrowUpRight size={18} className="text-[#003366]" />
                                </div>
                            </div>
                            
                            <h3 className="text-lg font-bold text-[#003366] mb-2">{roadmap.title}</h3>
                            <p className="text-sm text-zinc-600 font-medium leading-relaxed mb-4">
                                {roadmap.description}
                            </p>
                            <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                                {roadmap.details}
                            </p>
                        </div>

                        <div className="p-6 pt-0 mt-auto">
                            <div className="h-px bg-zinc-50 mb-6" />
                            <a 
                                href={roadmap.pdf} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full h-11 bg-[#003366] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2"
                            >
                                <Download size={14} /> Download the path
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer Note */}
            <div className="mt-16 p-8 bg-zinc-50 border border-zinc-100 text-center max-w-2xl mx-auto">
                <h4 className="text-sm font-bold text-[#003366] mb-2 uppercase tracking-tight">Ready to master your future?</h4>
                <p className="text-[12px] text-zinc-500 font-medium leading-relaxed">
                    Follow these paths to bridge the gap between theory and industry standard development.
                </p>
            </div>
        </div>
    );
}
