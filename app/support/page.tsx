"use client";

import { useState } from "react";
import Link from "next/link";
import { 
    ArrowRight, 
    CheckCircle2, 
    Clock, 
    ShieldAlert, 
    Home, 
    ArrowLeft,
    Send,
    User,
    Mail,
    HelpCircle
} from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/home/Footer";

export default function SupportPage() {
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setSubmitted(true);
            setIsSubmitting(false);
        }, 1500);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 border border-zinc-900 flex items-center justify-center mb-8">
                    <CheckCircle2 className="w-10 h-10 text-zinc-900" strokeWidth={1.5} />
                </div>
                <h1 className="text-4xl tracking-tight mb-4 font-bold">Message Sent</h1>
                <p className="text-zinc-500 max-w-sm mx-auto leading-relaxed mb-10 text-[15px]">
                    We have received your support request. Our team will get back to you within 4 hours.
                </p>
                <div className="flex gap-4">
                    <Link href="/" className="bg-black text-white px-10 h-12 flex items-center justify-center text-[12px] font-bold uppercase tracking-widest transition-opacity hover:opacity-90">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-100">
            {}
            <nav className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/95 backdrop-blur-sm">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-10">
                    <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-70">
                        <Home size={16} />
                        <span className="text-[14px] tracking-tight">Return home</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="h-1.5 w-1.5 bg-[#92E3A9]" />
                        <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">Help Center</span>
                    </div>
                </div>
            </nav>

            <main className="w-full">
                {}
                <div className="bg-black py-12 lg:py-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        <Breadcrumbs items={[{ label: "Academy", href: "/" }, { label: "Support" }]} />
                        <h1 className="text-4xl md:text-5xl tracking-tight text-white mt-8 mb-4">
                            Get Support
                        </h1>
                        <p className="text-zinc-400 text-[15px] leading-relaxed max-w-md">
                            Ask for help with your course, payments, or any technical issues you are facing.
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                        {}
                        <div className="lg:col-span-4 space-y-12">
                            <div className="p-8 border border-zinc-100 space-y-10 shadow-sm">
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <Clock className="w-5 h-5 text-zinc-400 shrink-0" />
                                        <div>
                                            <h4 className="text-[12px] font-bold uppercase tracking-widest text-zinc-900">Response Time</h4>
                                            <p className="text-[13px] text-zinc-500 leading-relaxed">We usually reply within 2 to 4 hours on working days.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <ShieldAlert className="w-5 h-5 text-zinc-400 shrink-0" />
                                        <div>
                                            <h4 className="text-[12px] font-bold uppercase tracking-widest text-zinc-900">Fast Support</h4>
                                            <p className="text-[13px] text-zinc-500 leading-relaxed">Get quick answers for payment and login problems.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-10 border-t border-zinc-100">
                                    <div className="flex items-center gap-3 text-[11px] font-bold text-zinc-300 uppercase tracking-widest">
                                        <div className="h-1 w-1 bg-zinc-300" />
                                        <span>Support is Live</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[11px] font-bold text-zinc-300 uppercase tracking-widest">
                                        <div className="h-1 w-1 bg-zinc-300" />
                                        <span>Verified Help Desk</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {}
                        <div className="lg:col-span-8">
                            <form onSubmit={handleSubmit} className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[12px] font-medium text-zinc-400 uppercase tracking-widest">Your Name</label>
                                        <div className="relative">
                                            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" strokeWidth={1.5} />
                                            <input 
                                                required
                                                type="text"
                                                className="w-full border border-zinc-200 h-12 px-12 text-[14px] outline-none transition-colors focus:border-black"
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[12px] font-medium text-zinc-400 uppercase tracking-widest">Email Address</label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" strokeWidth={1.5} />
                                            <input 
                                                required
                                                type="email"
                                                className="w-full border border-zinc-200 h-12 px-12 text-[14px] outline-none transition-colors focus:border-black"
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[12px] font-medium text-zinc-400 uppercase tracking-widest">Category</label>
                                    <div className="relative">
                                        <HelpCircle size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" strokeWidth={1.5} />
                                        <select className="w-full border border-zinc-200 h-12 px-12 text-[14px] outline-none transition-colors focus:border-black bg-white appearance-none">
                                            <option>Login Issues</option>
                                            <option>Course Registration</option>
                                            <option>Payment Doubts</option>
                                            <option>Technical Problems</option>
                                            <option>Other Questions</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[12px] font-medium text-zinc-400 uppercase tracking-widest">Message</label>
                                    <textarea 
                                        required
                                        rows={6}
                                        className="w-full border border-zinc-200 p-6 text-[14px] outline-none transition-colors focus:border-black resize-none"
                                        placeholder="Describe your problem here..."
                                    />
                                </div>

                                <button 
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full bg-black text-white h-14 flex items-center justify-center gap-3 text-[12px] font-bold uppercase tracking-widest transition-opacity hover:opacity-90 disabled:opacity-50 group"
                                >
                                    {isSubmitting ? (
                                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span>Send Message</span>
                                            <Send size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-10 pb-24 text-center">
                    <Link href="/" className="group inline-flex items-center gap-3 text-[11px] font-bold text-zinc-300 hover:text-black transition-colors uppercase tracking-widest">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Go back to home
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
