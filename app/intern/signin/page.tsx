"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function InternSigninPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/api/auth/callback`,
            },
        });
        if (error) setError(error.message);
    };

    const handleSignin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/intern/signin", {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("intern_user", JSON.stringify(data.user));
                router.push("/intern/dashboard");
            } else {
                setError(data.error || "Login failed.");
            }
        } catch (err) {
            setError("Connection error. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans flex items-center justify-center p-6 relative overflow-hidden">

            {/* Background Decorative Images */}
            <div className="absolute inset-0 pointer-events-none">
                <img src="https://ik.imagekit.io/dypkhqxip/Rocket-rafiki%20(1).svg" alt="" className="absolute left-[2%] top-[10%] w-[480px] hidden lg:block !shadow-none !drop-shadow-none filter-none" />
                <img src="https://ik.imagekit.io/dypkhqxip/Happy%20student-bro.svg" alt="" className="absolute right-[5%] bottom-[5%] w-[420px] hidden lg:block !shadow-none !drop-shadow-none filter-none" />
            </div>

            {/* Login Card - Sharp Edges */}
            <div className="w-full max-w-[400px] bg-white border border-zinc-100 p-7 md:p-9 relative z-10 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]">

                {/* Logo Section */}
                <div className="flex flex-col items-center mb-6">
                    <img
                        src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1774885412/Screenshot_2026-03-30_at_21.13.11-removebg-preview_gaqcdz.png"
                        alt="Company Logo"
                        className="h-10 w-auto mb-4"
                    />

                    <div className="text-center space-y-1">
                        <h2 className="text-[13px] font-bold text-zinc-800 tracking-tight">
                            Intern Portal Access
                        </h2>
                        <p className="text-[12px] text-zinc-400 font-medium">
                            Student Forge Initiative for Students
                        </p>
                    </div>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSignin} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[12px] font-bold text-zinc-700 ml-1">
                            Email Address
                        </label>
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-[44px] bg-[#F4F4F5] px-4 text-[13px] font-medium outline-none transition-all focus:bg-white border-none placeholder:text-zinc-400"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[12px] font-bold text-zinc-700">
                                Password
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                required
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-[44px] bg-[#F4F4F5] px-4 pr-10 text-[13px] font-medium outline-none transition-all focus:bg-white border-none placeholder:text-zinc-400"
                                placeholder="Enter password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Link
                            href="/intern/forgot-password"
                            className="text-[11px] font-bold text-zinc-500 hover:text-black transition-colors"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {error && (
                        <div className="p-2.5 bg-red-50 text-red-500 text-[11px] font-bold flex items-center gap-2 border border-red-100">
                            <ShieldAlert size={14} />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full h-[44px] bg-zinc-900 text-white text-[14px] font-bold transition-all hover:bg-black active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative flex items-center my-6">
                    <div className="flex-grow border-t border-zinc-100"></div>
                    <span className="flex-shrink mx-3 text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Continue with</span>
                    <div className="flex-grow border-t border-zinc-100"></div>
                </div>

                {/* Social Login */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={signInWithGoogle}
                        type="button"
                        className="h-[44px] flex items-center justify-center gap-3 bg-white border border-zinc-200 text-[13px] font-bold text-zinc-700 hover:bg-zinc-50 transition-all active:scale-[0.99]"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        <span>Sign in with Google</span>
                    </button>
                </div>

                <div className="mt-8 text-center border-t border-zinc-100 pt-6">
                    <p className="text-[12px] text-zinc-500 font-medium tracking-tight">
                        New here? <Link href="/intern/signup" className="text-zinc-900 font-bold hover:underline ml-1">Create account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}