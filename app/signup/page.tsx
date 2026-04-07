"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ShieldAlert, ArrowRight, Loader2, Home, ArrowLeft } from "lucide-react";
import Footer from "../components/home/Footer";

export default function SignUpPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate signup
        setTimeout(() => {
            localStorage.setItem("forge_user_signed_in", "true");
            router.push("/events");
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-100 flex flex-col">
            {}
            <nav className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/95 backdrop-blur-sm">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-10">
                    <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-70 group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[14px] tracking-tight">Go back</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <img src="/sf-next-logo.png" alt="SF Logo" className="h-9 w-9 object-contain" />
                        <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest">User Portal</span>
                    </div>
                </div>
            </nav>

            <main className="flex-1 flex flex-col lg:flex-row">
                {}
                <div className="hidden lg:flex lg:w-1/2 bg-zinc-50 flex-col items-center justify-center p-24 border-r border-zinc-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-zinc-100/50 rounded-full blur-[100px] -ml-32 -mt-32" />
                    <div className="max-w-md w-full space-y-12 relative z-10">
                        <div className="w-16 h-16 border border-zinc-900 flex items-center justify-center text-zinc-900">
                             <Home size={24} strokeWidth={1.5} />
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-4xl font-bold tracking-tight">Join Our Network</h2>
                            <p className="text-zinc-500 text-[16px] leading-relaxed">
                                Join our community of student builders. Create projects, attend workshops, and grow your engineering skills with us.
                            </p>
                        </div>
                    </div>
                </div>

                {}
                <div className="flex-1 lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-24 bg-white relative overflow-hidden">
                    <div className="w-full max-w-[400px] space-y-10 relative z-10">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
                            <p className="text-zinc-400 text-[14px]">Join our community of student builders.</p>
                        </div>

                        <form onSubmit={handleSignUp} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300" strokeWidth={1.5} />
                                    <input
                                        required
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full border border-zinc-100 bg-zinc-50 h-12 pl-12 pr-4 text-sm outline-none transition-all focus:border-black"
                                        placeholder="Your Name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300" strokeWidth={1.5} />
                                    <input
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full border border-zinc-100 bg-zinc-50 h-12 pl-12 pr-4 text-sm outline-none transition-all focus:border-black"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300" strokeWidth={1.5} />
                                    <input
                                        required
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full border border-zinc-100 bg-zinc-50 h-12 pl-12 pr-4 text-sm outline-none transition-all focus:border-black"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full bg-black text-white h-14 flex items-center justify-center gap-3 text-[12px] font-bold uppercase tracking-widest transition-opacity hover:opacity-90 disabled:opacity-50 mt-4"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        Sign Up <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 text-center pt-8 border-t border-zinc-100">
                            <p className="text-[12px] text-zinc-400 font-medium tracking-tight">
                                Already have an account? <Link href="/signin" className="text-black font-bold uppercase tracking-widest border-b border-black ml-2">Login</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
