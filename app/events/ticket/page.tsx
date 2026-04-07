"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Download,
    Home,
    Share2,
    Zap,
    Calendar,
    MapPin,
    CheckCircle,
    ArrowLeft
} from "lucide-react";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function TicketPage() {
    const [ticket, setTicket] = useState<any>(null);

    useEffect(() => {
        const saved = localStorage.getItem('forge_last_ticket');
        if (saved) {
            setTicket(JSON.parse(saved));
        }
    }, []);

    if (!ticket) return (
        <div className="h-screen w-full bg-[#050505] flex items-center justify-center text-white font-bold uppercase tracking-[0.2em]">
            Processing Ticket...
        </div>
    );

    return (
        <div className="min-h-screen w-full flex flex-col bg-[#050505] text-white font-sans overflow-hidden">
            {}
            <nav className="w-full bg-[#92E3A9] px-12 py-3 sm:px-24 flex items-center justify-between z-50 shadow-lg sticky top-0">
                <div className="flex items-center gap-4">
                    <Link href="/events" className="flex items-center gap-4">
                        <span className="text-sm font-bold tracking-tighter text-zinc-900 uppercase">Student Forge</span>
                        <div className="h-4 w-[1px] bg-zinc-900/20" />
                        <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-900/70 uppercase">TICKET PORTAL</span>
                    </Link>
                </div>
                <Link href="/events" className="flex items-center gap-2 text-xs font-bold text-zinc-900/80 hover:text-zinc-900 transition-all uppercase tracking-widest">
                    <ArrowLeft className="w-3 h-3" /> System Portal
                </Link>
            </nav>

            <div className="px-12 sm:px-24 pt-8">
                <Breadcrumbs items={[{ label: "Events", href: "/events" }, { label: "Success" }, { label: "Your Ticket" }]} />
            </div>

            <main className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                {}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#92E3A9]/5 blur-[150px] rounded-full" />

                <div className="max-w-xl w-full relative z-10 animate-in fade-in zoom-in duration-700">
                    <div className="text-center mb-12">
                        <div className="h-20 w-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">Booking Success</h1>
                        <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest text-center">A copy has been sent to your registered email.</p>
                    </div>

                    {}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl text-left">
                        {}
                        <div className="bg-[#92E3A9] p-8 flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-black/60 uppercase tracking-widest">Mission Access</span>
                                <span className="text-2xl font-black italic uppercase tracking-tight text-black">Official Ticket</span>
                            </div>
                            <div className="h-12 w-12 bg-black/20 rounded-2xl flex items-center justify-center">
                                <Zap className="w-6 h-6 text-black fill-current" />
                            </div>
                        </div>

                        {}
                        <div className="p-10 space-y-8">
                            <div>
                                <span className="text-[10px] font-black text-zinc-601 uppercase tracking-widest mb-2 block text-zinc-500">Event Identity</span>
                                <h2 className="text-3xl font-black italic uppercase leading-tight tracking-tighter">{ticket.eventTitle}</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/5">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-zinc-601 uppercase tracking-widest block text-zinc-500 underline-offset-4">Scheduled Date</span>
                                    <div className="flex items-center gap-2 text-sm font-bold">
                                        <Calendar className="w-4 h-4 text-[#92E3A9]" /> {ticket.eventDate}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-zinc-601 uppercase tracking-widest block text-zinc-500">Deployment</span>
                                    <div className="flex items-center gap-2 text-sm font-bold">
                                        <MapPin className="w-4 h-4 text-[#92E3A9]" /> {ticket.eventLocation}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-zinc-601 uppercase tracking-widest block text-zinc-500">Attendee Hash</span>
                                    <span className="text-lg font-mono font-black text-[#92E3A9]">{ticket.ticketId}</span>
                                </div>
                                {}
                                <div className="w-20 h-20 bg-white p-2 rounded-xl grid grid-cols-4 gap-1">
                                    {[...Array(16)].map((_, i) => (
                                        <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-black' : 'bg-zinc-200'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {}
                        <div className="flex items-center px-4 relative">
                            <div className="absolute left-0 -translate-x-1/2 w-8 h-8 bg-[#050505] rounded-full border border-zinc-900" />
                            <div className="w-full border-t-2 border-dashed border-white/10" />
                            <div className="absolute right-0 translate-x-1/2 w-8 h-8 bg-[#050505] rounded-full border border-zinc-900" />
                        </div>

                        <div className="p-10 pt-4 pb-12 flex flex-col items-center">
                            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.3em] mb-4 text-center">Scan at the Forge Portal Entrance</p>
                        </div>
                    </div>

                    {}
                    <div className="mt-12 flex gap-4 text-center">
                        <button className="flex-1 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all">
                            <Download className="w-4 h-4" /> Download PDF
                        </button>
                        <button className="h-14 w-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center hover:bg-zinc-800 transition-all">
                            <Share2 className="w-4 h-4" />
                        </button>
                        <Link href="/events" className="flex-1 h-14 bg-white text-black rounded-2xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest hover:bg-[#92E3A9] hover:text-black transition-all">
                            <Home className="w-4 h-4" /> System Portal
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
