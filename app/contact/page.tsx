"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle2, AlertCircle, User } from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/home/Footer";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success) {
                setStatus({ type: 'success', message: "Message sent. We will reply soon." });
                setFormData({ name: "", email: "", subject: "", message: "" });
            } else {
                setStatus({ type: 'error', message: data.error || "Failed to send message." });
            }
        } catch (error) {
            setStatus({ type: 'error', message: "Error. Please try again later." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-100">
            {}
            <nav className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/95 backdrop-blur-sm">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-10">
                    <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-70">
                        <span className="text-[15px] tracking-tight">Student Forge</span>
                        <div className="h-3 w-[1px] bg-zinc-200" />
                        <span className="text-[13px] text-zinc-400">Academy</span>
                    </Link>
                    <div className="flex gap-8">
                        <Link href="/courses" className="text-[12px] text-zinc-500 hover:text-black transition-colors">Courses</Link>
                        <Link href="/docs" className="text-[12px] text-zinc-500 hover:text-black transition-colors">Docs</Link>
                        <Link href="/support" className="text-[12px] text-zinc-500 hover:text-black transition-colors">Help</Link>
                        <Link href="/contact" className="text-[12px] text-black font-medium border-b border-black">Contact</Link>
                    </div>
                </div>
            </nav>

            <main className="w-full">
                {}
                <div className="bg-black py-12 lg:py-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        <Breadcrumbs items={[{ label: "Academy", href: "/" }, { label: "Contact Us" }]} />
                        <h1 className="text-4xl md:text-5xl tracking-tight text-white mt-8 mb-4">
                            Contact Us
                        </h1>
                        <p className="text-zinc-400 text-[15px] leading-relaxed max-w-md">
                            Send us a message and we will get back to you as soon as possible.
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {}
                        <div className="lg:col-span-4 space-y-12">
                            <div className="space-y-6">
                                <h3 className="text-[14px] font-medium uppercase tracking-widest text-zinc-400">Where to find us</h3>
                                <div className="space-y-4">
                                    <div className="p-6 border border-zinc-100 space-y-2">
                                        <span className="text-[10px] text-zinc-400 uppercase tracking-widest">Email</span>
                                        <p className="text-[14px] font-medium text-zinc-900">contact@studentforge.com</p>
                                    </div>
                                    <div className="p-6 border border-zinc-100 space-y-2">
                                        <span className="text-[10px] text-zinc-400 uppercase tracking-widest">Available</span>
                                        <p className="text-[14px] font-medium text-zinc-900">24/7 Online Support</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="h-[1px] w-12 bg-zinc-100" />
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-[13px] text-zinc-500">
                                    <div className="h-1 w-1 bg-zinc-300" />
                                    <span>Real-time help status</span>
                                </div>
                                <div className="flex items-center gap-3 text-[13px] text-zinc-500">
                                    <div className="h-1 w-1 bg-zinc-300" />
                                    <span>Quick response team</span>
                                </div>
                            </div>
                        </div>

                        {}
                        <div className="lg:col-span-8">
                            {status && (
                                <div className={`mb-10 p-4 border flex items-center gap-3 ${
                                    status.type === 'success' ? 'bg-zinc-50 border-zinc-100 text-zinc-900' : 'bg-red-50 border-red-100 text-red-600'
                                }`}>
                                    {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                    <span className="text-[12px] font-medium uppercase tracking-wider">{status.message}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[12px] font-medium text-zinc-400 uppercase tracking-wider">Full Name</label>
                                        <div className="relative">
                                            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" strokeWidth={1.5} />
                                            <input 
                                                required
                                                type="text"
                                                className="w-full bg-white border border-zinc-200 h-12 px-12 text-[14px] outline-none transition-colors focus:border-black"
                                                placeholder="Your name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[12px] font-medium text-zinc-400 uppercase tracking-wider">Email Address</label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" strokeWidth={1.5} />
                                            <input 
                                                required
                                                type="email"
                                                className="w-full bg-white border border-zinc-200 h-12 px-12 text-[14px] outline-none transition-colors focus:border-black"
                                                placeholder="Your email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[12px] font-medium text-zinc-400 uppercase tracking-wider">Subject</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" strokeWidth={1.5} />
                                        <input 
                                            required
                                            type="text"
                                            className="w-full bg-white border border-zinc-200 h-12 px-12 text-[14px] outline-none transition-colors focus:border-black"
                                            placeholder="What is this about?"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[12px] font-medium text-zinc-400 uppercase tracking-wider">Message</label>
                                    <textarea 
                                        required
                                        rows={5}
                                        className="w-full bg-white border border-zinc-200 p-4 text-[14px] outline-none transition-colors focus:border-black resize-none"
                                        placeholder="Type your message here..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>

                                <button 
                                    disabled={loading}
                                    type="submit"
                                    className="w-full bg-black text-white h-12 flex items-center justify-center gap-3 text-[13px] transition-opacity hover:opacity-90 disabled:opacity-50"
                                >
                                    {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                                        <>
                                            <span>Send Message</span>
                                            <Send size={14} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
