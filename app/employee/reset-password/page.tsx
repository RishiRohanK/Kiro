"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) {
            setError("Invalid or missing reset token.");
        }
    }, [token]);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/employee/reset-password", {
                method: "POST",
                body: JSON.stringify({ token, password }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            if (res.ok) {
                setSuccess(true);
            } else {
                setError(data.error || "Failed to reset password.");
            }
        } catch (err) {
            setError("Connection failed. Try again later.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-md text-center space-y-3">
                    <div className="flex justify-center">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <p className="text-sm text-zinc-600 font-medium">
                        Password updated successfully.
                    </p>
                </div>
                <Link 
                    href="/employee/signin"
                    className="w-full h-11 bg-zinc-900 text-white text-sm font-medium hover:bg-black transition-all rounded-md flex items-center justify-center"
                >
                    Back to login
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleReset} className="space-y-5">
            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">New password</label>
                <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 bg-white border border-zinc-200 px-4 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all rounded-md"
                    placeholder="Min. 8 characters"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Confirm password</label>
                <input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-11 bg-white border border-zinc-200 px-4 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all rounded-md"
                    placeholder="Repeat password"
                />
            </div>

            {error && (
                <div className="text-sm text-red-600 font-medium">
                    {error}
                </div>
            )}

            <button
                disabled={loading || !token}
                type="submit"
                className="w-full h-11 bg-red-600 text-white text-sm font-medium hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-50 rounded-md flex items-center justify-center gap-2"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update password"}
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
    );
}

export default function EmployeeResetPasswordPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[400px] bg-white border border-zinc-200 p-8 md:p-10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)]"
            >
                <div className="space-y-2 mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                        Update password
                    </h1>
                    <p className="text-sm text-zinc-500">
                        Please enter your new password
                    </p>
                </div>

                <Suspense fallback={<div className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-zinc-200" /></div>}>
                    <ResetPasswordForm />
                </Suspense>
            </motion.div>
        </div>
    );
}
