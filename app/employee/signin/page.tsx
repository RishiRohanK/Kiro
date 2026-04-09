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
        <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[400px] bg-white border border-zinc-200 p-8 md:p-10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)]"
            >
                {/* Brand/Header */}
                <div className="space-y-2 mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                        Employee login
                    </h1>
                    <p className="text-sm text-zinc-500">
                        Enter your credentials to access your account
                    </p>
                </div>

                <form onSubmit={handleSignIn} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-700">
                            Email address
                        </label>
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-11 bg-white border border-zinc-200 px-4 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all rounded-md"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-zinc-700">
                                Password
                            </label>
                            <Link href="/employee/forgot-password" className="text-xs text-red-600 hover:text-red-700 font-medium">
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-11 bg-white border border-zinc-200 px-4 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all rounded-md"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-600 font-medium animate-in fade-in slide-in-from-top-1">
                            {error}
                        </div>
                    )}

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full h-11 bg-red-600 text-white text-sm font-medium hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-50 rounded-md flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
                    </button>
                </form>

                <div className="pt-4 text-center">
                    <p className="text-xs text-zinc-400">
                        © 2026 Cleed. All rights reserved.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
