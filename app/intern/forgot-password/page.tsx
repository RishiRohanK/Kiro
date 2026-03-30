"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ShieldCheck, ArrowRight, Loader2, Key, ArrowLeft, Send } from "lucide-react";

export default function InternForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch("/api/intern/forgot-password", {
                method: "POST",
                body: JSON.stringify({ email }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            if (res.ok) {
                setMessage("Reset link sent! Please check your inbox.");
            } else {
                setError(data.error || "Failed to send reset link.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans flex items-center justify-center p-6 relative overflow-hidden">

            {/* Background Decorative Images */}
            <div className="absolute inset-0 pointer-events-none">
                <img src="https://ik.imagekit.io/dypkhqxip/Rocket-rafiki%20(1).svg" alt="" className="absolute left-[2%] top-[10%] w-[480px] hidden lg:block" />
                <img src="https://ik.imagekit.io/dypkhqxip/Forgot%20password-bro.svg" alt="" className="absolute right-[5%] bottom-[5%] w-[420px] hidden lg:block" />
            </div>

            {/* Forgot Password Card - Sharp Edges */}
            <div className="w-full max-w-[400px] bg-white border border-zinc-100 p-7 md:p-10 relative z-10 shadow-[0_4px_30px_-5px_rgba(0,0,0,0.03)]">

                {/* Logo Section */}
                <div className="flex flex-col items-center mb-8">
                    <img
                        src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1774885412/Screenshot_2026-03-30_at_21.13.11-removebg-preview_gaqcdz.png"
                        alt="Company Logo"
                        className="h-10 w-auto mb-4"
                    />

                    <div className="text-center space-y-1">
                        <h2 className="text-[14px] font-bold text-zinc-800 tracking-tight">
                            Recover Password
                        </h2>
                        <p className="text-[11px] text-zinc-400 font-medium">
                            Intern Portal Security Access
                        </p>
                    </div>
                </div>

                {message ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-6 bg-zinc-50 border border-zinc-100 flex flex-col items-center text-center space-y-4">
                            <div className="h-12 w-12 bg-[#0055FF] text-white flex items-center justify-center">
                                <ShieldCheck size={24} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[14px] font-bold text-zinc-900 leading-tight">Verification Sent</p>
                                <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                                    We've sent a recovery link to Your email address. 
                                    Please check your inbox.
                                </p>
                            </div>
                        </div>
                        <Link 
                            href="/intern/signin"
                            className="w-full flex h-11 items-center justify-center bg-zinc-900 text-white text-[12px] font-bold hover:bg-black transition-all"
                        >
                            Return to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleRequestReset} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-zinc-400 ml-1 uppercase tracking-wider">
                                Registered Email
                            </label>
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-[46px] bg-[#F9F9F9] px-4 text-[13px] font-medium outline-none transition-all focus:bg-white border border-zinc-100 focus:border-zinc-300 placeholder:text-zinc-300"
                                placeholder="name@example.com"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-500 text-[11px] font-bold flex items-center gap-2 border border-red-100">
                                <ShieldCheck size={14} />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full h-[48px] bg-zinc-900 text-white text-[13px] font-bold transition-all hover:bg-black active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                <>
                                    Send Recovery Link <Send size={14} className="ml-1" />
                                </>
                            )}
                        </button>
                        
                        <div className="text-center pt-4 border-t border-zinc-100">
                            <Link 
                                href="/intern/signin" 
                                className="text-[12px] text-zinc-400 font-medium hover:text-black transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowLeft size={14} /> Back to Sign In
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
