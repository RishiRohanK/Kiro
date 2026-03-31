"use client";

import Link from "next/link";
import {
    ChevronRight,
    ArrowRight,
    Home,
    Search,
    HelpCircle,
    ArrowLeft,
    Shield,
    FileText,
    Zap,
    Scale
} from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/home/Footer";
import Navbar from "../components/home/Navbar";
import SubNavbar from "../components/home/SubNavbar";
import { motion } from "framer-motion";

export default function DocsPage() {
    const docSections = [
        {
            id: "privacy",
            title: "Privacy policy",
            icon: <Shield size={18} />,
            content: [
                {
                    heading: "Data collection & synchronization",
                    body: "Our platform collects mission-critical data including academic identity, technical project submissions, and professional engagement metrics to synchronize your learning path with industry standards."
                },
                {
                    heading: "Technical security node",
                    body: "All user data is hosted on secure technical infrastructure with multi-layer encryption. We never share your private identifiers with third-party entities without explicit mission clearance."
                }
            ]
        },
        {
            id: "terms",
            title: "Terms of service",
            icon: <Scale size={18} />,
            content: [
                {
                    heading: "User conduct protocol",
                    body: "Users must maintain professional integrity. Any attempts to bypass security nodes or engage in unauthorized data extraction will result in immediate termination of platform access."
                },
                {
                    heading: "Intellectual property",
                    body: "The Skill Grid architecture, brand assets, and course modules are protected property of Student Forge Technologies Private Limited. Unauthorized redistribution is strictly prohibited."
                }
            ]
        },
        {
            id: "updates",
            title: "Platform updates",
            icon: <Zap size={18} />,
            content: [
                {
                    heading: "PRO-2.1.0 Architecture",
                    body: "The latest platform update introduces high-density typography, multi-color vision nodes, and synchronized redirection anchors for zero-friction navigation."
                },
                {
                    heading: "Durable workflow integration",
                    body: "We have formally integrated the Workflow DevKit to enable resilient background operations and real-time mission status tracking for all student interns."
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-100 flex flex-col">
            <Navbar />
            <SubNavbar />

            <main className="w-full flex-1">
                {/* High-Fidelity Header */}
                <div className="bg-zinc-900 py-12 md:py-16 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-[50%] h-full bg-blue-600/5 blur-[100px] pointer-events-none" />
                    <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
                        <Breadcrumbs items={[{ label: "Support", href: "/support" }, { label: "Documentation" }]} />
                        <div className="max-w-3xl mt-6 space-y-3">
                            <div className="inline-flex h-4 items-center px-1.5 border border-white/10 bg-white/5 text-blue-400 text-[9px] font-bold leading-none">
                                Documentation hub
                            </div>
                            <h1 className="text-4xl md:text-5xl font-normal tracking-tighter text-white leading-tight">
                                Platform <span className="text-blue-500">protocols</span>.
                            </h1>
                            <p className="text-zinc-400 text-[15px] md:text-[16px] max-w-xl font-normal leading-relaxed">
                                Access the definitive guides for privacy, security, and technical updates. Synchronize with our legal and architectural standards.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-10 py-12 md:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
                        
                        {/* High-Density Sidebar */}
                        <aside className="lg:col-span-3 lg:sticky lg:top-32 h-fit space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-[11px] font-bold text-zinc-400">Navigation nodes</h3>
                                <div className="space-y-1">
                                    {docSections.map((section) => (
                                        <button 
                                            key={section.id}
                                            onClick={() => document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' })}
                                            className="w-full text-left px-3 py-2 text-[14px] font-medium text-zinc-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center gap-2 group"
                                        >
                                            <ChevronRight size={12} className="opacity-30 group-hover:opacity-100" />
                                            {section.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* Typography-Focused Content */}
                        <div className="lg:col-span-9 space-y-16">
                            {docSections.map((section) => (
                                <section key={section.id} id={section.id} className="space-y-8 scroll-mt-32">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 bg-zinc-900 flex items-center justify-center text-white">
                                            {section.icon}
                                        </div>
                                        <h2 className="text-3xl font-normal tracking-tighter text-zinc-900 line-clamp-1">
                                            {section.title}
                                        </h2>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {section.content.map((item, i) => (
                                            <div key={i} className="space-y-3 p-6 border border-zinc-100 bg-zinc-50/50 hover:border-blue-600/20 transition-all">
                                                <h4 className="text-[15px] font-bold text-zinc-900 tracking-tight">
                                                    {item.heading}
                                                </h4>
                                                <p className="text-zinc-500 text-[14px] leading-relaxed">
                                                    {item.body}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ))}

                            {/* Additional Info / Footer Link */}
                            <div className="pt-16 border-t border-zinc-100">
                                <div className="space-y-6 max-w-2xl">
                                    <h4 className="text-[18px] font-bold text-zinc-900 tracking-tight">Technical synchronization incomplete?</h4>
                                    <p className="text-zinc-500 text-[14px] leading-relaxed">
                                        If you require more detailed info regarding bank transfer protocols or mission-specific scaling, please initiate a support mission.
                                    </p>
                                    <Link href="/support" className="inline-flex h-11 items-center justify-center gap-3 bg-zinc-900 px-8 text-[13px] font-bold text-white hover:bg-blue-600 transition-all">
                                        Initiate support <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
