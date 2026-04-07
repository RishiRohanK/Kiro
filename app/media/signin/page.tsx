"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ShieldAlert, ArrowRight, Loader2, Home, ArrowLeft } from "lucide-react";
import Footer from "../../components/home/Footer";
import Navbar from "../../components/home/Navbar";

export default function MediaSigninPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/media/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("media_user", JSON.stringify(data));
                if (data.role === "CTO") {
                    localStorage.setItem("forge_super_admin", "true");
                    router.push("/dashboard");
                } else {
                    router.push("/media/dashboard");
                }
            } else {
                setError(data.error || "Authentication failed.");
            }
        } catch (err) {
            setError("Connection failed. Check your network.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-100 flex flex-col">
            {}
            <nav className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/95 backdrop-blur-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-10">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="inline-flex h-10 w-10 items-center justify-center bg-black text-white hover:opacity-90 transition-opacity">
                            <ArrowLeft size={18} strokeWidth={2.5} />
                        </Link>
                        <Link href="/" className="flex items-center gap-3">
                            <span className="text-[15px] tracking-tight text-zinc-900">Student Forge</span>
                            <div className="h-3 w-[1px] bg-zinc-200" />
                            <span className="text-[13px] text-zinc-400">Media</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="hidden items-center gap-6 md:flex text-[13px] text-zinc-400 font-medium tracking-tight">
                            Media Hub Access
                        </div>
                        <Link
                            href="/support"
                            className="inline-flex h-9 items-center justify-center border border-zinc-200 px-5 text-[13px] text-zinc-900 transition-colors hover:bg-zinc-50"
                        >
                            Support
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="flex-1 flex flex-col lg:flex-row shadow-sm">
                {}
                <div className="hidden lg:flex lg:w-1/2 bg-zinc-50 flex-col items-center justify-center p-24 border-r border-zinc-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-zinc-100/50 rounded-full blur-[100px] -ml-32 -mt-32" />
                    <div className="max-w-md w-full space-y-8 relative z-10 text-center">
                        <img 
                            src="https://ik.imagekit.io/dypkhqxip/Email%20campaign-bro.svg" 
                            alt="Media Login Illustration" 
                            className="w-full h-auto mb-12 mix-blend-multiply drop-shadow-2xl"
                        />
                        <div className="space-y-4 text-left">
                            <h2 className="text-3xl font-bold tracking-tight">Media Hub Access</h2>
                            <p className="text-zinc-500 text-[16px] leading-relaxed">
                                Login to manage your media projects and team files easily. 
                                Everything you need to coordinate production is right here.
                            </p>
                        </div>
                    </div>
                </div>

                {}
                <div className="flex-1 lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-24 bg-white relative overflow-hidden">
                    <div className="w-full max-w-[400px] space-y-10 relative z-10">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">Media Login</h1>
                            <p className="text-zinc-400 text-[14px]">Please enter your email and password.</p>
                        </div>

                        <form onSubmit={handleSignin} className="space-y-6">
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
                                        placeholder="name@company.com"
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

                            {error && (
                                <div className="p-4 border border-red-50 bg-red-50/50 text-red-500 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                                    <ShieldAlert size={14} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full bg-black text-white h-14 flex items-center justify-center gap-3 text-[12px] font-bold uppercase tracking-widest transition-opacity hover:opacity-90 disabled:opacity-50 mt-4"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        Get Started
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="text-center pt-8 border-t border-zinc-100 mt-10">
                             <p className="text-[12px] text-zinc-400 font-medium">
                                Don't have an account? <Link href="/media/signup" className="text-black font-bold uppercase tracking-widest ml-2 border-b border-black">Register</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
