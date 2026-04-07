"use client";

import Link from "next/link";
import Breadcrumbs from "../components/Breadcrumbs";

export default function TemplatesPage() {
    const templates = [
        { name: "Hackathon Invite", desc: "48-hour sprint registration" },
        { name: "Event Reminder", desc: "Automated session alerts" },
        { name: "Certificate Release", desc: "Participation credentials" }
    ];

    return (
        <div className="min-h-screen w-full flex flex-col bg-[#050505] font-sans overflow-hidden">
            {}
            <nav className="w-full bg-[#92E3A9] px-12 py-3 sm:px-24 flex items-center justify-between z-50 shadow-lg">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-4">
                        <span className="text-sm font-bold tracking-tighter text-zinc-900 uppercase">Student Forge</span>
                        <div className="h-4 w-[1px] bg-zinc-900/20" />
                        <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-900/70 uppercase">TEMPLATES</span>
                    </Link>
                </div>
                <div className="flex gap-8">
                    <Link href="/docs" className="text-xs font-semibold text-zinc-900/80 hover:text-zinc-900 transition-colors">Documentation</Link>
                    <Link href="/support" className="text-xs font-semibold text-zinc-900/80 hover:text-zinc-900 transition-colors">Support</Link>
                </div>
            </nav>

            <div className="px-12 sm:px-24 pt-8">
                <Breadcrumbs items={[{ label: "Templates" }]} />
            </div>

            <main className="flex-1 flex flex-col items-start justify-center px-12 sm:px-24 text-white">
                <div className="w-full max-w-5xl">
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-7xl text-white">
                        Email Templates
                    </h1>
                    <p className="mt-8 text-xl text-zinc-400 leading-relaxed max-w-xl">
                        Choose a pre-built template or Forge a new one.
                    </p>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
                        {templates.map((t) => (
                            <div key={t.name} className="p-8 border border-zinc-900 bg-[#0a0a0a] rounded-md hover:border-[#92E3A9]/50 transition-colors group cursor-pointer">
                                <h3 className="text-sm font-semibold text-white uppercase tracking-widest mb-2 group-hover:text-[#92E3A9] transition-colors">{t.name}</h3>
                                <p className="text-xs text-zinc-500 mb-6">{t.desc}</p>
                                <button className="text-[10px] font-black text-white/40 uppercase tracking-tighter group-hover:text-white transition-colors">Select</button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
