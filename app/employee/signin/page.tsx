"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ShieldCheck, ArrowRight, Loader2, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function EmployeeSignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/employee/signin", {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            if (res.ok) {
                // Store user data for the dashboard
                localStorage.setItem("user", JSON.stringify(data.user));
                window.location.href = "/employee/dashboard"; 
            } else {
                setError(data.error || "Login failed.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6 font-sans">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[400px] bg-white border border-zinc-200 p-8 sm:p-10 shadow-sm"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-zinc-900">
                        Sign in
                    </h1>
                    <p className="text-sm text-zinc-500 mt-2">
                        Access your employee dashboard
                    </p>
                </div>

                {/* Google Login */}
                <button 
                    type="button"
                    className="w-full h-11 border border-zinc-200 flex items-center justify-center gap-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-all mb-6 bg-white"
                >
                    <svg width="18" height="18" viewBox="0 0 18 18">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                        <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.443 2.048.957 4.961l3.007 2.332C4.672 5.164 6.656 3.58 9 3.58z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                </button>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-100"></div></div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-zinc-400"><span className="bg-white px-2">Or with email</span></div>
                </div>

                <form onSubmit={handleSignIn} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-700">
                            Email
                        </label>
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-11 bg-white border border-zinc-200 px-4 text-sm outline-none focus:border-black transition-all"
                            placeholder="Email address"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-zinc-700">
                                Password
                            </label>
                            <Link href="/employee/forgot-password" title="Forgot Password" className="text-[11px] text-zinc-400 hover:text-red-600 transition-colors">
                                Forgot?
                            </Link>
                        </div>
                        <input
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-11 bg-white border border-zinc-200 px-4 text-sm outline-none focus:border-black transition-all"
                            placeholder="Password"
                        />
                    </div>

                    {error && (
                        <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider bg-red-50 p-2 text-center">
                            {error}
                        </p>
                    )}

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full h-11 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all disabled:opacity-50 mt-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}
                    </button>
                </form>

                <div className="mt-10 pt-6 border-t border-zinc-50 text-center">
                    <p className="text-[10px] text-zinc-300 uppercase tracking-widest">
                        Student Forge LMS · 2026
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
