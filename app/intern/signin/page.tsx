"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2, Eye, EyeOff, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import ReCAPTCHA from "react-google-recaptcha";

import { StickyBanner } from "@/components/ui/sticky-banner";

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
        const isLocal = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';

        if (!captchaToken && !isLocal) {
            setError("Please complete security verification.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/intern/signin", {
                method: "POST",
                body: JSON.stringify({ email, password, captcha_token: captchaToken }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("intern_user", JSON.stringify(data.user));
                router.push("/intern/dashboard");
            } else {
                setError(data.error || "Login failed.");
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
        <div className="min-h-screen w-full bg-[#F9FAFB] text-[#1F2937] font-sans flex flex-col selection:bg-blue-100">
            <StickyBanner className="bg-gradient-to-b from-[#003366] to-[#002244]">
                <p className="mx-0 max-w-[90%] text-white drop-shadow-md text-[12px] md:text-[13px] font-medium leading-tight text-center md:text-left">
                    Welcome to the Student Forge Intern Portal. Access your training modules, track daily progress, and manage tasks in your personalized dashboard.{" "}
                    <Link href="/intern/dashboard" className="transition duration-200 hover:underline font-bold whitespace-nowrap">
                        Go to dashboard
                    </Link>
                </p>
            </StickyBanner>
            {/* Top Navigation / Breadcrumbs */}
            <div className="w-full max-w-[950px] mx-auto pt-6 px-8 flex-none">
                <nav className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                    <Link href="/" className="hover:text-slate-900 transition-colors">Portal</Link>
                    <ChevronRight size={10} />
                    <span className="text-slate-900">Intern Access</span>
                </nav>
            </div>

            {/* Main Center Container */}
            <div className="flex-1 flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-[950px] min-h-[500px] md:h-[620px] bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row overflow-hidden rounded-xl">

                    {/* Left Panel: Brand Experience */}
                    <div className="hidden md:flex md:w-[40%] bg-slate-50 border-r border-slate-100 p-12 flex-col justify-between relative">
                        <div className="relative z-10">
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/platform?updatedAt=1776791557303"
                                alt="Student Forge"
                                className="h-6 w-auto mb-10 opacity-90"
                            />
                            <div className="space-y-3">
                                <h1 className="text-[#003366] text-xl font-semibold tracking-tight">Intern Workspace</h1>
                                <p className="text-slate-500 text-[13px] leading-relaxed">
                                    A unified platform to manage your tasks, learn from experts, and track your career growth.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-center relative z-10">
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/Happy%20student-bro.svg"
                                alt="Illustration"
                                className="w-full h-auto max-w-[200px] opacity-80"
                            />
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    </div>

                    {/* Right Panel: Sign In Form */}
                    <div className="w-full md:w-[60%] flex flex-col justify-center px-6 lg:px-20 py-10 md:py-8 overflow-y-auto">
                        <div className="max-w-[340px] mx-auto w-full">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Sign In</h2>
                                <p className="text-[13px] text-slate-400 mt-1">Please enter your credentials to continue</p>
                            </div>

                            <form onSubmit={handleSignin} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold text-slate-500">
                                        Email Address
                                    </label>
                                    <input
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-10 bg-slate-50/50 border border-slate-200 px-3.5 text-[13px] rounded-lg outline-none transition-all focus:border-[#003366] focus:bg-white focus:ring-4 focus:ring-blue-50/50"
                                        placeholder="intern@studentforge.in"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-semibold text-slate-500">
                                            Password
                                        </label>
                                        <Link href="/intern/forgot-password" className="text-[11px] text-[#003366] font-medium hover:underline underline-offset-4">
                                            Forgot?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <input
                                            required
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full h-10 bg-slate-50/50 border border-slate-200 px-3.5 pr-10 text-[13px] rounded-lg outline-none transition-all focus:border-[#003366] focus:bg-white focus:ring-4 focus:ring-blue-50/50"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="py-1">
                                    <div className="transform scale-[0.8] origin-left">
                                        <ReCAPTCHA
                                            ref={recaptchaRef}
                                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LfA4LssAAAAAJjVmCALHZYPY4bwg_XzQ7ZNCMGI"}
                                            onChange={(token) => setCaptchaToken(token)}
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-2.5 bg-red-50 text-red-600 text-[11px] font-medium flex items-center gap-2 border border-red-100 rounded-lg animate-in fade-in zoom-in-95">
                                        <ShieldAlert size={14} className="shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <div className="space-y-3 pt-1">
                                    <button
                                        disabled={loading}
                                        type="submit"
                                        className="w-full h-10 bg-[#003366] text-white text-[13px] font-medium rounded-lg transition-all hover:bg-[#002244] active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                                    </button>

                                    <div className="relative flex items-center py-2">
                                        <div className="flex-grow border-t border-slate-100"></div>
                                        <span className="flex-shrink mx-3 text-[10px] font-medium text-slate-300">or</span>
                                        <div className="flex-grow border-t border-slate-100"></div>
                                    </div>

                                    <button
                                        onClick={signInWithGoogle}
                                        type="button"
                                        className="w-full h-10 flex items-center justify-center gap-2.5 bg-white border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all rounded-lg"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        Continue with Google
                                    </button>
                                </div>
                            </form>

                            <div className="mt-8 text-center pt-6 border-t border-slate-50">
                                <p className="text-[13px] text-slate-500">
                                    Need an account? <Link href="/intern/signup" className="text-[#003366] font-semibold hover:underline underline-offset-4 decoration-1">Register now</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <footer className="w-full py-6 px-8 flex-none bg-slate-100 border-t border-slate-200">
                <div className="max-w-[950px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <Link href="https://kiro.redlix.co.in/lms">
                            <img 
                                src="https://ik.imagekit.io/dypkhqxip/Screenshot_2026-05-14_at_17.46.09-removebg-preview.png?updatedAt=1778760997901" 
                                alt="Logo" 
                                className="h-14 w-auto opacity-80 hover:opacity-100 transition-all cursor-pointer"
                            />
                        </Link>
                        <div className="h-6 w-px bg-slate-300 hidden md:block" />
                        <div className="flex flex-col gap-1">
                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                                © {new Date().getFullYear()} Student Forge Technologies Pvt Ltd.
                            </p>
                            <p className="text-[9px] text-slate-400 font-medium">
                                Powered by Cheetah Servers • Redlix Systems, Hyderabad
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 text-[10px] text-slate-400 font-semibold">
                        <span className="hover:text-slate-900 cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="hover:text-slate-600 cursor-pointer transition-colors">Terms of Service</span>
                        <span className="hover:text-slate-600 cursor-pointer transition-colors">Security</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}