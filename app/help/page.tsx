"use client";

import Link from "next/link";
import { HelpCircle, Mail, MessageSquare, ArrowRight, Home, ArrowLeft } from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/home/Footer";

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-100 flex flex-col">
            {}
            <nav className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/95 backdrop-blur-sm">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-10">
                    <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-70">
                        <Home size={16} />
                        <span className="text-[14px] tracking-tight">Home</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="h-1.5 w-1.5 bg-[#92E3A9]" />
                        <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">Help Center</span>
                    </div>
                </div>
            </nav>

            <main className="w-full">
                {}
                <div className="bg-black py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        <Breadcrumbs items={[{ label: "Support", href: "/support" }, { label: "Quick Help" }]} />
                        <div className="mt-8">
                            <h1 className="text-4xl md:text-5xl tracking-tight text-white mb-6">
                                Quick Help
                            </h1>
                            <p className="text-zinc-400 text-[18px] leading-relaxed max-w-xl">
                                Find answers to your questions and get help from our team. We are here to support your learning.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {}
                        <div className="border border-zinc-100 p-10 space-y-6 hover:border-black transition-colors group">
                            <div className="w-12 h-12 border border-zinc-900 flex items-center justify-center">
                                <MessageSquare size={20} />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold tracking-tight">Read our docs</h2>
                                <p className="text-zinc-500 text-[14px] leading-relaxed">
                                    Check our guides to learn how to use the platform, submit projects, and more.
                                </p>
                            </div>
                            <Link href="/docs" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                                Go to Docs <ArrowRight size={14} />
                            </Link>
                        </div>

                        {}
                        <div className="border border-zinc-100 p-10 space-y-6 hover:border-black transition-colors group text-white bg-black">
                            <div className="w-12 h-12 border border-zinc-800 flex items-center justify-center text-[#92E3A9]">
                                <Mail size={20} />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold tracking-tight">Talk to us</h2>
                                <p className="text-zinc-400 text-[14px] leading-relaxed">
                                    If you have a problem, send us a message and we will help you within 24 hours.
                                </p>
                            </div>
                            <Link href="/contact" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform text-[#92E3A9]">
                                Send Message <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>

                    <div className="mt-24 text-center">
                        <Link href="/" className="group inline-flex items-center gap-3 text-[11px] font-bold text-zinc-300 hover:text-black transition-colors uppercase tracking-widest">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Back to home
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
