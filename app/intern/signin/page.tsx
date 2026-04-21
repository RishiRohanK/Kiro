"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2, Eye, EyeOff, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import ReCAPTCHA from "react-google-recaptcha";

export default function InternSigninPage() {
    const router = useRouter();
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

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

        const isLocal = process.env.NODE_ENV === 'development';
        
        if (!captchaToken && !isLocal) {
            setError("Please complete the security verification.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/intern/signin", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password,
                    captcha_token: captchaToken
                }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("intern_user", JSON.stringify(data.user));
                router.push("/intern/dashboard");
            } else {
                setError(data.error || "Login failed.");
                // Reset captcha on failure
                setCaptchaToken(null);
                recaptchaRef.current?.reset();
            }
        } catch (err) {
            setError("Connection error. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-[#495057] font-sans flex flex-col items-center">
            <div className="flex-1 flex items-center justify-center p-6 lg:p-10 w-full">
            <div className="w-full max-w-[850px] bg-white border border-zinc-200 flex flex-col md:flex-row relative z-10">

                {/* Left Side: Branding & Illustration */}
                <div className="md:w-5/12 bg-[#D1E0FF] p-8 md:p-10 flex flex-col justify-center relative overflow-hidden">
                    <div className="space-y-4 relative z-10">
                        <img
                            src="https://ik.imagekit.io/dypkhqxip/learngrid?updatedAt=1775552006855"
                            alt="Student Forge"
                            className="h-8 w-auto mb-6"
                        />
                        <div className="space-y-1">
                            <h1 className="text-[#003366] text-xl font-bold font-sans">Student Forge Portal</h1>
                            <p className="text-[#003366] text-[13px] font-medium opacity-80 leading-relaxed">
                                Access your workspace and manage your internship seamlessly.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 relative z-10">
                        <img
                            src="https://ik.imagekit.io/dypkhqxip/Happy%20student-bro.svg"
                            alt="Illustration"
                            className="w-full h-auto max-w-[240px] mx-auto opacity-90"
                        />
                    </div>
                </div>

                {/* Right Side: Form Section */}
                <div className="md:w-7/12 p-8 md:p-10 relative">
                    <div className="max-w-[340px] mx-auto">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-zinc-800">Sign In</h2>
                            <p className="text-[12px] text-zinc-400 font-medium">Continue to your dashboard</p>
                        </div>

                        <form onSubmit={handleSignin} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-zinc-400 block">
                                    Email
                                </label>
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-10 bg-zinc-50 border border-zinc-200 px-4 text-[13px] outline-none transition-all focus:border-[#003366] focus:bg-white"
                                    placeholder="name@example.com"
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <label className="text-[11px] font-bold text-zinc-400">
                                        Password
                                    </label>
                                    <Link href="/intern/forgot-password" title="Recover Password" className="text-[11px] text-[#003366] font-bold hover:underline">
                                        Forgot?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input
                                        required
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-10 bg-zinc-50 border border-zinc-200 px-4 pr-12 text-[13px] outline-none transition-all focus:border-[#003366] focus:bg-white"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-600"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="w-3 h-3 border-zinc-300 text-[#003366] focus:ring-[#003366] rounded-none" />
                                    <span className="text-[11px] text-zinc-400 group-hover:text-zinc-700 select-none font-medium">Keep me signed in</span>
                                </label>
                            </div>

                            <div className="pt-1 overflow-hidden">
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LfA4LssAAAAAJjVmCALHZYPY4bwg_XzQ7ZNCMGI"}
                                    onChange={(token) => setCaptchaToken(token)}
                                />
                            </div>

                            {error && (
                                <div className="p-2.5 bg-red-50 text-red-500 text-[10px] font-bold flex items-center gap-2 border border-red-100 animate-in fade-in slide-in-from-top-1">
                                    <ShieldAlert size={12} className="shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full h-11 bg-[#003366] text-white text-[12px] font-bold transition-all hover:bg-[#002244] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                            </button>

                            <div className="relative flex items-center py-1">
                                <div className="flex-grow border-t border-zinc-100"></div>
                                <span className="flex-shrink mx-3 text-[9px] font-bold text-zinc-200">or</span>
                                <div className="flex-grow border-t border-zinc-100"></div>
                            </div>

                            <button
                                onClick={signInWithGoogle}
                                type="button"
                                className="w-full h-10 flex items-center justify-center gap-3 bg-white border border-zinc-200 text-[12px] font-semibold text-zinc-600 hover:bg-zinc-50 transition-all"
                            >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span>Google Account</span>
                            </button>
                        </form>

                        <div className="mt-6 text-center pt-4 border-t border-zinc-50">
                            <p className="text-[12px] text-zinc-400 font-medium">
                                No Intern account? <Link href="/intern/signup" className="text-[#003366] font-bold hover:underline">Register</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            </div>

            {/* Footer Section */}
            <footer className="absolute bottom-0 left-0 w-full bg-zinc-100 border-t border-zinc-200 py-6 px-6">
                <div className="max-w-[850px] mx-auto flex flex-col items-center gap-2">
                    <p className="text-[11px] text-[#6c757d] font-medium text-center">
                        © 2025-2026 Student Forge Technologies Private Limited. All Rights Reserved. 
                        Unauthorized access or use of this platform is strictly prohibited.
                    </p>
                    <p className="text-[10px] text-zinc-400 font-bold text-center">
                        platform.studentforge.in is a registered trademark. Secured with enterprise-grade encryption.
                    </p>
                </div>
            </footer>
        </div>
    );
}
