"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Search,
    Filter,
    Calendar as CalendarIcon,
    MapPin,
    Clock,
    ChevronRight,
    ArrowLeft
} from "lucide-react";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function ExploreEventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // Load events from localStorage + initial mocks
        const initialMocks = [
            {
                id: "mock-1",
                title: "Nexus Sprint 2026",
                category: "Hackathon",
                description: "48 hours of pure engineering. Build the future of agentic AI with top builders worldwide.",
                price: "$49",
                image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
                date: "March 20, 2026",
                location: "Global Virtual"
            },
            {
                id: "mock-2",
                title: "UI Artisan Workshop",
                category: "Workshop",
                description: "Master the art of high-fidelity interfaces. From glassmorphism to fluid animations.",
                price: "Free",
                image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
                date: "March 25, 2026",
                location: "San Francisco, CA"
            }
        ];

        const saved = JSON.parse(localStorage.getItem('forge_events') || '[]');
        setEvents([...initialMocks, ...saved]);
    }, []);

    const filteredEvents = events.filter(e =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen w-full flex flex-col bg-[#050505] text-white font-sans overflow-hidden">
            {}
            <nav className="w-full bg-[#92E3A9] px-12 py-3 sm:px-24 flex items-center justify-between z-50 shadow-lg sticky top-0">
                <div className="flex items-center gap-4">
                    <Link href="/events" className="flex items-center gap-4">
                        <span className="text-sm font-bold tracking-tighter text-zinc-900 uppercase">Student Forge</span>
                        <div className="h-4 w-[1px] bg-zinc-900/20" />
                        <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-900/70 uppercase">EXPLORE CATALOG</span>
                    </Link>
                </div>
                <div className="flex gap-6 items-center">
                    <Link href="/events/host" className="text-[10px] font-black uppercase text-zinc-900/70 hover:text-zinc-900 border border-zinc-900/20 px-3 py-1.5 rounded-lg transition-all tracking-widest">Host Event</Link>
                    <Link href="/events" className="text-xs font-bold text-zinc-900/80 hover:text-zinc-900 uppercase transition-all tracking-widest flex items-center gap-2">
                        <ArrowLeft className="w-3 h-3" /> Back
                    </Link>
                </div>
            </nav>

            <div className="px-12 sm:px-24 pt-8">
                <Breadcrumbs items={[{ label: "Events", href: "/events" }, { label: "Explore Missions" }]} />
            </div>

            <main className="flex-1 max-w-[1400px] mx-auto w-full p-8 md:p-12">
                <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 text-left">
                    <div>
                        <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-4">Missions <span className="text-[#92E3A9]">Feed</span></h1>
                        <p className="text-zinc-500 font-semibold tracking-tight">Discover the next stage of your builder journey.</p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                            <input
                                type="text"
                                placeholder="Search missions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-[#92E3A9] outline-none"
                            />
                        </div>
                        <button className="h-14 w-14 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center hover:bg-zinc-800 transition-all">
                            <Filter className="w-4 h-4 text-zinc-400" />
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 text-left">
                    {filteredEvents.map((event) => (
                        <Link
                            key={event.id}
                            href={`/events/explore/${event.id}`}
                            className="group flex flex-col bg-zinc-900/40 border border-zinc-800 rounded-[2rem] overflow-hidden hover:border-[#92E3A9]/50 transition-all duration-500"
                        >
                            <div className="h-64 relative overflow-hidden">
                                <img
                                    src={event.image}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-6 right-6">
                                    <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-[#92E3A9] border border-white/5">
                                        {event.category}
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                            </div>

                            <div className="p-8 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold mb-3 uppercase tracking-tight leading-tight line-clamp-2">{event.title}</h3>
                                <p className="text-zinc-500 text-sm font-medium line-clamp-2 mb-6 flex-1 italic">{event.description}</p>

                                <div className="space-y-4 pt-6 border-t border-zinc-800">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.1em]">
                                            <CalendarIcon className="w-3 h-3 text-[#92E3A9]" /> {event.date || "TBD"}
                                        </div>
                                        <span className="text-sm font-black text-white">{event.price}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.1em]">
                                        <MapPin className="w-3 h-3 text-[#92E3A9]" /> {event.location || "Online"}
                                    </div>
                                </div>

                                <button className="mt-8 w-full h-12 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] group-hover:bg-[#92E3A9] group-hover:text-black transition-all flex items-center justify-center gap-2">
                                    View Mission Details <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredEvents.length === 0 && (
                    <div className="py-24 text-center">
                        <p className="text-zinc-500 font-bold uppercase tracking-widest">No missions found matching your query.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
