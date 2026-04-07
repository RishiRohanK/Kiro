"use client";

import { useState, useMemo, useEffect } from "react";
import Navbar from "../components/home/Navbar";
import SubNavbar from "../components/home/SubNavbar";
import Footer from "../components/home/Footer";
import CTA from "../components/home/CTA";
import { 
    Calendar, Trophy, MapPin, ArrowUpRight, 
    Link2, Terminal, Shield, Cpu, Cloud,
    Code2, Database, Laptop, Info, GraduationCap
} from "lucide-react";

const techEventsIndia = [
    {
        title: "Microsoft Build: India",
        organizer: "Microsoft",
        date: "June 04-05, 2026",
        location: "Hyderabad, TS",
        type: "Developer Event",
        attendees: "8K+ Devs",
        category: "Software",
        link: "https://build.microsoft.com/india",
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
        color: "text-sky-600"
    },
    {
        title: "Google I/O Connect Bengaluru",
        organizer: "Google",
        date: "July 15-16, 2026",
        location: "Bengaluru, KA",
        type: "Developer Keynote",
        attendees: "10K+ Local",
        category: "AI & Web",
        link: "https://io.google/connect/india/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        color: "text-blue-500"
    },
    {
        title: "PyCon India 2026",
        organizer: "Python India",
        date: "Sept 25-27, 2026",
        location: "Chennai, TN",
        type: "Open Source",
        attendees: "3K+ Community",
        category: "Python & ML",
        link: "https://in.pycon.org/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
        color: "text-blue-600"
    },
    {
        title: "AWS Summit Delhi",
        organizer: "Amazon Web Services",
        date: "Sept 10-11, 2026",
        location: "New Delhi, DL",
        type: "Cloud Summit",
        attendees: "15K+ Professionals",
        category: "Cloud",
        link: "https://aws.amazon.com/events/summits/delhi/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
        color: "text-orange-500"
    },
    {
        title: "IIT Bombay Techfest",
        organizer: "IIT Bombay",
        date: "Dec 26-28, 2026",
        location: "Mumbai, MH",
        type: "College Fest",
        attendees: "175K+ Footfall",
        category: "College Events",
        link: "https://techfest.org/",
        logo: "https://upload.wikimedia.org/wikipedia/en/1/1d/Indian_Institute_of_Technology_Bombay_Logo.svg",
        color: "text-blue-600"
    }
];

const eventCategories = ["All", "Industry Anchors", "College Events", "Cloud", "Software", "AI & Web", "Enterprise"];

export default function EventsPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [dbEvents, setDbEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/cleed/events")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const formatted = data.events.map((e: any) => ({
                        ...e,
                        attendees: e.price || "Contact for Details", 
                        color: e.category === "College Events" ? "text-blue-600" : "text-emerald-500",
                        logo: e.image || ""
                    }));
                    setDbEvents(formatted);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const allEvents = useMemo(() => {
        const merged = [...techEventsIndia, ...dbEvents];
        // Remove duplicates by title if any
        return Array.from(new Map(merged.map(item => [item.title, item])).values());
    }, [dbEvents]);

    const filteredEvents = useMemo(() => {
        return allEvents.filter(e => {
            if (selectedCategory === "All") return true;
            if (selectedCategory === "Industry Anchors") return e.category !== "College Events";
            return e.category === selectedCategory;
        });
    }, [selectedCategory, allEvents]);

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-blue-100 uppercase-none">
            <Navbar />
            <SubNavbar />

            <main>
                {}
                <section className="bg-zinc-950 py-10 border-b border-white/5">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-2">
                                <div className="inline-flex h-5 items-center px-2 bg-blue-600 text-white text-[9px] font-bold tracking-widest leading-none">
                                    India Event Index
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white italic">
                                    Tech <span className="text-blue-500">Summit</span> India
                                </h1>
                                <p className="text-zinc-400 text-xs md:text-sm max-w-xl font-medium">
                                    The definitive technology roadmap across India. Segregated by high-impact industry anchors and elite college tech platforms.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {eventCategories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-3 py-1 text-[10px] font-bold border transition-all ${
                                            selectedCategory === cat 
                                            ? "bg-white text-zinc-950 border-white" 
                                            : "text-zinc-400 border-white/10 hover:border-white/30"
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {}
                <section className="py-8 bg-zinc-50 min-h-[600px]">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredEvents.map((event, index) => (
                                <div 
                                    key={index} 
                                    className="bg-white border border-zinc-200 p-5 rounded-none flex flex-col justify-between hover:border-blue-600 transition-all group"
                                >
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="h-10 w-auto">
                                                <img 
                                                    src={event.logo} 
                                                    alt={event.organizer} 
                                                    className="h-full w-auto object-contain transition-all"
                                                />
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                {event.category === "College Events" && (
                                                    <span className="text-[9px] font-bold text-blue-600 flex items-center gap-1">
                                                        <GraduationCap className="w-3 h-3" /> Campus
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-extrabold text-zinc-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                                                {event.title}
                                            </h3>
                                            <p className="text-[11px] font-medium text-zinc-400 italic">
                                                Hosted by {event.organizer}
                                            </p>
                                        </div>

                                        <div className="space-y-2.5 pt-1">
                                            <div className="flex items-center gap-2.5 text-zinc-600">
                                                <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                                <span className="text-[11px] font-bold tracking-tight">{event.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 text-zinc-600">
                                                <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                                <span className="text-[11px] font-bold tracking-tight">{event.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2.5 text-zinc-600">
                                                <Laptop className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                                                <span className="text-[11px] font-bold tracking-tight">{event.attendees}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full bg-current ${event.color}`} />
                                            <span className="text-[10px] font-bold text-zinc-500">
                                                {event.category}
                                            </span>
                                        </div>
                                        <a 
                                            href={event.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center w-8 h-8 border border-zinc-200 hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all text-zinc-400"
                                        >
                                            <ArrowUpRight className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            ))}

                            {}
                            <div className="border border-dashed border-zinc-300 p-5 flex flex-col items-center justify-center text-center bg-zinc-50/50">
                                <Info className="w-8 h-8 text-zinc-300 mb-4" />
                                <h3 className="text-[11px] font-bold text-zinc-400 tracking-widest mb-2 px-4 leading-relaxed italic">More Campus Anchors Syncing</h3>
                                <p className="text-[10px] text-zinc-400 font-medium italic leading-relaxed">
                                    Onboarding Top-Tier IIT/NIT tech fests into the global index.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <CTA />
            </main>

            <Footer />
        </div>
    );
}
