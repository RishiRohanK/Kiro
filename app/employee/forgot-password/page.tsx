"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function EmployeeForgotPasswordPage() {
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
            const res = await fetch("/api/employee/forgot-password", {
                method: "POST",
                body: JSON.stringify({ email }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            if (res.ok) {
                setMessage("Reset link sent! Please check your email.");
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
        <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[400px] bg-white border border-zinc-200 p-8 md:p-10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)]"
            >
                <div className="space-y-2 mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                        Reset password
                    </h1>
                    <p className="text-sm text-zinc-500">
                        Enter your email to receive a recovery link
                    </p>
                </div>

                {message ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-md text-center">
                            <p className="text-sm text-zinc-600 font-medium">
                                {message}
                            </p>
                        </div>
                        <Link 
                            href="/employee/signin"
                            className="w-full flex h-11 items-center justify-center bg-zinc-900 text-white text-sm font-medium hover:bg-black transition-all rounded-md"
                        >
                            Back to login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleRequestReset} className="space-y-6">
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

                        {error && (
                            <div className="text-sm text-red-600 font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full h-11 bg-red-600 text-white text-sm font-medium hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-50 rounded-md flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send link"}
                        </button>
                        
                        <div className="text-center pt-2">
                            <Link 
                                href="/employee/signin" 
                                className="text-xs text-zinc-500 font-medium hover:text-zinc-900 transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowLeft size={14} /> Back to login
                            </Link>
                        </div>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
