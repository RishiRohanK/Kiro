"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    Calendar,
    MapPin,
    Zap,
    Shield,
    Users,
    Ticket,
    ArrowLeft,
    CheckCircle,
    Loader2,
    Globe
} from "lucide-react";
import Breadcrumbs from "../../../components/Breadcrumbs";

export default function EventDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [event, setEvent] = useState<any>(null);
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        const mocks = [
            {
                id: "mock-1",
                title: "Nexus Sprint 2026",
                category: "Hackathon",
                description: "Forge the future of decentralized computing in this 48-hour high-intensity sprint. We bring together researchers, engineers, and designers to build agentic layers for the next decade.",
                fullDescription: "Join us for 48 hours of pure engineering. This isn't just a hackathon; it's a mission to redefine how AI agents interact with the web. You'll have access to exclusive GPUs, private APIs, and a network of mentors from top-tier forge labs. Winner takes home the Grand Forge Trophy and a seat at the 2026 Global Summit.",
                price: "$49",
                image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
                date: "March 20, 2026",
                location: "Global Virtual Portal",
                stats: { attendees: "1,240+", labs: "42", prize: "$10k" }
            },
            {
                id: "mock-2",
                title: "UI Artisan Workshop",
                category: "Workshop",
                description: "Master the art of high-fidelity interfaces. From glassmorphism to fluid animations.",
                fullDescription: "A deep dive into the aesthetics of modern software. We'll cover spatial design, micro-interactions, and the math behind physics-based animations. By the end of this workshop, you'll have built a production-ready component library that follows the Forge Design System.",
                price: "Free",
                image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
                date: "March 25, 2026",
                location: "San Francisco Forge Lab",
                stats: { attendees: "300", labs: "1", prize: "Cert." }
            }
        ];

        const saved = JSON.parse(localStorage.getItem('forge_events') || '[]');
        const all = [...mocks, ...saved];
        const found = all.find(e => e.id === id);
        setEvent(found);
    }, [id]);

    const handleBookNow = () => {
        setIsBooking(true);
        setTimeout(() => {
            
            localStorage.setItem('forge_last_ticket', JSON.stringify({
                eventTitle: event.title,
                eventDate: event.date,
                eventLocation: event.location,
                ticketId: `FRG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                userName: "Forge Builder" 
            }));
            router.push('/events/ticket');
        }, 2000);
    };

    if (!event) return (
        <div className="h-screen w-full bg-[#050505] flex items-center justify-center text-white font-bold uppercase tracking-[0.2em]">
            Locating Mission...
        </div>
    );

    return (
        <div className="min-h-screen w-full flex flex-col bg-[#050505] text-white font-sans overflow-x-hidden">
            {}
            <nav className="w-full bg-[#92E3A9] px-12 py-3 sm:px-24 flex items-center justify-between z-50 shadow-lg sticky top-0">
                <div className="flex items-center gap-4">
                    <Link href="/events" className="flex items-center gap-4">
                        <span className="text-sm font-bold tracking-tighter text-zinc-900 uppercase">Student Forge</span>
                        <div className="h-4 w-[1px] bg-zinc-900/20" />
                        <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-900/70 uppercase">MISSION CONTROL</span>
                    </Link>
                </div>
                <Link href="/events/explore" className="flex items-center gap-2 text-xs font-bold text-zinc-900/80 hover:text-zinc-900 transition-all uppercase tracking-widest">
                    <ArrowLeft className="w-3 h-3" /> Back to Explore
                </Link>
            </nav>

            <div className="px-12 sm:px-24 pt-8">
                <Breadcrumbs items={[{ label: "Events", href: "/events" }, { label: "Explore", href: "/events/explore" }, { label: "Details" }]} />
            </div>

            {}
            <div className="h-[60vh] w-full relative">
                <img src={event.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-black/20" />

                <div className="absolute bottom-0 w-full max-w-[1400px] mx-auto left-0 right-0 p-8 md:p-12 text-left">
                    <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded text-[10px] font-black uppercase tracking-widest text-[#92E3A9] mb-6">
                        {event.category}
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase mb-6 leading-none">{event.title}</h1>
                    <div className="flex flex-wrap gap-8 text-left">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-[#92E3A9]" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-left">Date</span>
                                <span className="text-sm font-bold text-left">{event.date}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-[#92E3A9]" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-left">Location</span>
                                <span className="text-sm font-bold text-left">{event.location}</span>
                            </div>
                        </div>
                        {event.stats && (
                            <div className="flex items-center gap-3 border-l border-white/10 pl-8">
                                <Users className="w-5 h-5 text-[#92E3A9]" />
                                <div className="flex flex-col text-left">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-left">Intelligence</span>
                                    <span className="text-sm font-bold text-left text-nowrap">{event.stats.attendees} Enrolled</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {}
            <main className="max-w-[1400px] mx-auto w-full p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-16 text-left">
                {}
                <div className="lg:col-span-2 space-y-12">
                    <section>
                        <h3 className="text-[10px] font-black text-[#92E3A9] uppercase tracking-[0.3em] mb-6">Mission Briefing</h3>
                        <p className="text-xl text-zinc-300 font-medium leading-[1.6]">
                            {event.fullDescription || event.description}
                        </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-medium">
                        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
                            <div className="h-10 w-10 bg-[#92E3A9]/10 rounded-xl flex items-center justify-center">
                                <Shield className="w-5 h-5 text-[#92E3A9]" />
                            </div>
                            <h4 className="font-bold text-white uppercase tracking-widest text-xs">Verified Access</h4>
                            <p className="text-zinc-500 italic">This mission includes industry-standard certification upon completion from Student Forge.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
                            <div className="h-10 w-10 bg-[#92E3A9]/10 rounded-xl flex items-center justify-center">
                                <Globe className="w-5 h-5 text-[#92E3A9]" />
                            </div>
                            <h4 className="font-bold text-white uppercase tracking-widest text-xs">Global Network</h4>
                            <p className="text-zinc-500 italic">Connect with top engineers and designers from over 40+ global talent labs.</p>
                        </div>
                    </div>
                </div>

                {}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 p-8 rounded-3xl bg-white text-black shadow-[0_0_80px_rgba(255,255,255,0.1)]">
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-left">Purchase Ticket</span>
                                <span className="text-4xl font-black italic">{event.price}</span>
                            </div>
                            <div className="h-12 w-12 bg-[#92E3A9] rounded-2xl flex items-center justify-center shadow-lg transform -rotate-12">
                                <Zap className="w-6 h-6 text-black fill-current" />
                            </div>
                        </div>

                        <ul className="space-y-4 mb-10">
                            {[
                                "Instant Digital Ticket",
                                "Access to Mission Docs",
                                "Private Discord Portal",
                                "Completion Certificate"
                            ].map((item, i) => (
                                <li key={i} className="flex gap-3 items-center text-xs font-bold text-zinc-800">
                                    <CheckCircle className="w-4 h-4 text-green-500" /> {item}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={handleBookNow}
                            disabled={isBooking}
                            className="w-full h-16 bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-[#92E3A9] hover:text-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isBooking ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Complete Booking <Ticket className="w-5 h-5" /></>}
                        </button>

                        <p className="mt-6 text-[9px] text-zinc-400 text-center font-bold uppercase tracking-widest px-4">Secure transaction encrypted by Student Forge Security Protocols.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
