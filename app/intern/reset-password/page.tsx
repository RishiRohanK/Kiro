"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ShieldAlert, ShieldCheck, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import Footer from "../../components/home/Footer";

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
            const res = await fetch("/api/intern/reset-password", {
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
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-6 bg-zinc-50 border border-zinc-100 flex flex-col items-center text-center space-y-4">
                    <div className="h-12 w-12 bg-[#0055FF] text-white flex items-center justify-center">
                        <ShieldCheck size={24} />
                    </div>
                    <div className="space-y-1">
                        <p className="text-[14px] font-bold text-zinc-900 leading-tight">Password Updated</p>
                        <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
                            Your password has been securely updated. You can now log in with your new credentials.
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
        );
    }

    return (
        <form onSubmit={handleReset} className="space-y-5">
            <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 ml-1 uppercase tracking-wider">New Password</label>
                <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-[46px] bg-[#F9F9F9] px-4 text-[13px] font-medium outline-none transition-all focus:bg-white border border-zinc-100 focus:border-zinc-300 placeholder:text-zinc-300"
                    placeholder="At least 8 characters"
                />
            </div>

            <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 ml-1 uppercase tracking-wider">Confirm Password</label>
                <input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-[46px] bg-[#F9F9F9] px-4 text-[13px] font-medium outline-none transition-all focus:bg-white border border-zinc-100 focus:border-zinc-300 placeholder:text-zinc-300"
                    placeholder="Repeat password"
                />
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-500 text-[11px] font-bold flex items-center gap-2 border border-red-100">
                    <ShieldAlert size={14} />
                    <span>{error}</span>
                </div>
            )}

            <button
                disabled={loading || !token}
                type="submit"
                className="w-full h-[48px] bg-zinc-900 text-white text-[13px] font-bold transition-all hover:bg-black active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>
                        Update Password <ArrowRight size={14} className="ml-1" />
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
    );
}

export default function InternResetPasswordPage() {
    return (
        <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans flex items-center justify-center p-6 relative overflow-hidden">
            {}
            <div className="absolute inset-0 pointer-events-none">
                <img src="https://ik.imagekit.io/dypkhqxip/Reset-password-bro.svg" alt="" className="absolute right-[5%] bottom-[5%] w-[420px] hidden lg:block" />
            </div>

            {}
            <div className="w-full max-w-[400px] bg-white border border-zinc-100 p-7 md:p-10 relative z-10 shadow-[0_4px_30px_-5px_rgba(0,0,0,0.03)] selection:bg-zinc-100">
                {}
                <div className="flex flex-col items-center mb-8">
                    <img
                        src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1774885412/Screenshot_2026-03-30_at_21.13.11-removebg-preview_gaqcdz.png"
                        alt="Company Logo"
                        className="h-10 w-auto mb-4"
                    />

                    <div className="text-center space-y-1">
                        <h2 className="text-[14px] font-bold text-zinc-800 tracking-tight">
                            Update Access
                        </h2>
                        <p className="text-[11px] text-zinc-400 font-medium">
                            Secure your intern portal account
                        </p>
                    </div>
                </div>

                <Suspense fallback={<div className="py-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-zinc-200" /></div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
