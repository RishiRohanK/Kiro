"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Plus,
    Image as ImageIcon,
    Type,
    Hash,
    Link as LinkIcon,
    CheckCircle,
    ArrowLeft,
    Loader2
} from "lucide-react";
import Breadcrumbs from "../../components/Breadcrumbs";

export default function HostEventPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const signedIn = localStorage.getItem("forge_user_signed_in");
        if (signedIn !== "true") {
            router.push("/signin");
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [eventData, setEventData] = useState({
        title: "",
        category: "Hackathon",
        description: "",
        eventType: "In-Person",
        date: "",
        location: "",
        price: "Free",
        image: "https://images.unsplash.com/photo-1504384308090-c894fd901191?q=80&w=800&auto=format&fit=crop",
        link: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate persistence (using localStorage for this demo)
        setTimeout(() => {
            const existing = JSON.parse(localStorage.getItem('forge_events') || '[]');
            const newEvent = { ...eventData, id: Date.now().toString() };
            localStorage.setItem('forge_events', JSON.stringify([...existing, newEvent]));

            setIsSubmitting(false);
            router.push('/events/explore');
        }, 1500);
    };

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen w-full flex flex-col bg-[#050505] text-white font-sans overflow-x-hidden">
            {}
            <nav className="w-full bg-[#92E3A9] px-12 py-3 sm:px-24 flex items-center justify-between z-50 shadow-lg sticky top-0">
                <div className="flex items-center gap-4">
                    <Link href="/events" className="flex items-center gap-4">
                        <span className="text-sm font-bold tracking-tighter text-zinc-900 uppercase">Student Forge</span>
                        <div className="h-4 w-[1px] bg-zinc-900/20" />
                        <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-900/70 uppercase">HOST ENGINE</span>
                    </Link>
                </div>
                <Link href="/events" className="flex items-center gap-2 text-xs font-bold text-zinc-900/80 hover:text-zinc-900 transition-all uppercase tracking-widest">
                    <ArrowLeft className="w-3 h-3" /> Back
                </Link>
            </nav>

            <div className="px-12 sm:px-24 pt-8">
                <Breadcrumbs items={[{ label: "Events", href: "/events" }, { label: "Host Mission" }]} />
            </div>

            <main className="flex-1 max-w-5xl mx-auto w-full p-8 md:p-16 grid grid-cols-1 lg:grid-cols-5 gap-16 text-left">
                {}
                <div className="lg:col-span-3">
                    <div className="mb-12">
                        <h1 className="text-4xl font-black mb-2 uppercase italic tracking-tighter">Host New Mission</h1>
                        <p className="text-zinc-500 font-medium italic text-left">Define the parameters for your next student outreach.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Mission Title</label>
                                <div className="relative">
                                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Forge Sprint 2026"
                                        value={eventData.title}
                                        onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-[#92E3A9] outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 text-left">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Category</label>
                                    <select
                                        value={eventData.category}
                                        onChange={(e) => setEventData({ ...eventData, category: e.target.value })}
                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-[#92E3A9] outline-none appearance-none"
                                    >
                                        <option>Hackathon</option>
                                        <option>Workshop</option>
                                        <option>Conference</option>
                                        <option>Community Meet</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Ticket Price</label>
                                    <input
                                        type="text"
                                        placeholder="Free or $ amount"
                                        value={eventData.price}
                                        onChange={(e) => setEventData({ ...eventData, price: e.target.value })}
                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-[#92E3A9] outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Description</label>
                                <textarea
                                    required
                                    placeholder="Tell the community what happens in this mission..."
                                    value={eventData.description}
                                    onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                                    className="w-full h-32 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-[#92E3A9] outline-none resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Image URL (Unsplash)</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                    <input
                                        type="text"
                                        value={eventData.image}
                                        onChange={(e) => setEventData({ ...eventData, image: e.target.value })}
                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 text-sm font-medium focus:ring-2 focus:ring-[#92E3A9] outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-white text-black h-14 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#92E3A9] hover:text-black transition-all flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.05)]"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Launch Mission <CheckCircle className="w-4 h-4" /></>}
                        </button>
                    </form>
                </div>

                {}
                <div className="lg:col-span-2 hidden lg:block">
                    <div className="sticky top-12">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 block text-center">Live Card Preview</label>
                        <div className="group relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 aspect-[3/4] shadow-2xl">
                            {eventData.image && (
                                <img
                                    src={eventData.image}
                                    className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                            <div className="absolute bottom-0 left-0 p-8 w-full text-left">
                                <div className="inline-block px-2 py-1 bg-[#92E3A9] text-black text-[10px] font-bold rounded mb-4 uppercase tracking-widest">{eventData.category}</div>
                                <h2 className="text-3xl font-black mb-2 uppercase leading-none">{eventData.title || "Mission Title"}</h2>
                                <p className="text-zinc-400 text-xs font-semibold mb-6 line-clamp-2">{eventData.description || "Describe your mission..."}</p>

                                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-zinc-500 font-bold uppercase">Price</span>
                                        <span className="text-sm font-bold">{eventData.price}</span>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-[10px] text-zinc-500 font-bold uppercase">Status</span>
                                        <span className="text-sm font-bold text-[#92E3A9] uppercase tracking-tighter italic">Preview</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
