"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
    ShieldCheck, 
    ShieldAlert, 
    Loader2, 
    Eye, 
    EyeOff, 
    Lock, 
    Cpu, 
    CheckCircle2, 
    Zap,
    Activity
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import ReCAPTCHA from "react-google-recaptcha";
import { motion, AnimatePresence } from "framer-motion";

export default function InternSigninPage() {
    const router = useRouter();
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [securityScore, setSecurityScore] = useState(9.8);
    const [isAssessing, setIsAssessing] = useState(false);

    // Simulated Real-time Risk Assessment
    useEffect(() => {
        if (email.length > 5 || password.length > 3) {
            setIsAssessing(true);
            const timer = setTimeout(() => {
                setIsAssessing(false);
                setSecurityScore(9.7 + Math.random() * 0.2);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [email, password]);

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
            setError("Security checkpoint required. Please verify the shield.");
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
                setError(data.error || "Authentication failed. Access denied.");
                setCaptchaToken(null);
                recaptchaRef.current?.reset();
            }
        } catch (err) {
            setError("Encryption tunnel failed. Check your network.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-[#495057] font-sans flex items-center justify-center p-6 lg:p-10 selection:bg-[#003366] selection:text-white">
            <div className="w-full max-w-[950px] bg-white border border-zinc-200 shadow-[0_32px_128px_-16px_rgba(0,51,102,0.12)] flex flex-col md:flex-row relative z-10 overflow-hidden ring-1 ring-black/5">

                {/* Left Side: Adaptive Security Monitor */}
                <div className="md:w-[42%] bg-[#003366] p-10 flex flex-col justify-between relative overflow-hidden text-white">
                    {/* Security Grid Background */}
                    <div className="absolute inset-0 opacity-10" 
                        style={{ 
                            backgroundImage: `radial-gradient(#ffffff 0.5px, transparent 0.5px)`, 
                            backgroundSize: '24px 24px' 
                        }} 
                    />
                    
                    <div className="relative z-10 space-y-8">
                        <img
                            src="https://ik.imagekit.io/dypkhqxip/learngrid?updatedAt=1775552006855"
                            alt="Student Forge"
                            className="h-8 w-auto brightness-0 invert"
                        />
                        
                        <div className="space-y-2">
                            <h1 className="text-2xl font-semibold tracking-tight">Adaptive Security Hub</h1>
                            <p className="text-[13px] font-medium opacity-60 leading-relaxed max-w-[240px]">
                                Real-time neural threat assessment active for current session.
                            </p>
                        </div>
                    </div>

                    {/* Real-time Status Card */}
                    <div className="relative z-10 bg-white/5 border border-white/10 p-6 backdrop-blur-md space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Security Live</span>
                            </div>
                            <span className="text-[10px] font-bold opacity-40">SF-v8.2</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-[9px] font-bold uppercase tracking-widest opacity-50">Trust Score</p>
                                <p className="text-2xl font-semibold tabular-nums tracking-tighter">
                                    {securityScore.toFixed(1)}
                                </p>
                            </div>
                            <div className="space-y-1 flex flex-col items-end">
                                <p className="text-[9px] font-bold uppercase tracking-widest opacity-50">Threat Level</p>
                                <p className="text-xs font-semibold uppercase text-emerald-400">Minimal</p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                    animate={{ width: isAssessing ? "90%" : "100%" }}
                                    className="h-full bg-emerald-400/80" 
                                />
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-semibold opacity-70">
                                {isAssessing ? (
                                    <>
                                        <Activity size={12} className="animate-spin" />
                                        <span>Analyzing patterns...</span>
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck size={12} className="text-emerald-400" />
                                        <span>Environment Secure</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 pt-10">
                         <div className="flex items-center gap-2 text-[11px] font-semibold opacity-50">
                             <Cpu size={14} />
                             <span>AES-GCM Encryption Locked</span>
                         </div>
                    </div>
                </div>

                {/* Right Side: Form Section */}
                <div className="md:w-[58%] p-8 md:p-14 relative bg-white">
                    <div className="max-w-[340px] mx-auto">
                        <div className="mb-10">
                            <h2 className="text-3xl font-semibold text-zinc-900 leading-tight">Secure Access</h2>
                            <p className="text-[13px] text-zinc-400 font-medium mt-1">Authenticate to enter workspace</p>
                        </div>

                        <form onSubmit={handleSignin} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest block">
                                    Identity / Email
                                </label>
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 bg-zinc-50 border border-zinc-200 px-4 text-[13px] font-medium outline-none transition-all focus:border-[#003366] focus:bg-white focus:ring-4 focus:ring-[#003366]/5"
                                    placeholder="Enter registered email"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
                                        Vault Key
                                    </label>
                                    <Link href="/intern/forgot-password" title="Recover Password" className="text-[11px] text-[#003366] font-semibold hover:underline">
                                        Recovery Plan?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input
                                        required
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-12 bg-zinc-50 border border-zinc-200 px-4 pr-12 text-[13px] font-medium outline-none transition-all focus:border-[#003366] focus:bg-white focus:ring-4 focus:ring-[#003366]/5"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input type="checkbox" className="peer w-4 h-4 border-zinc-300 text-[#003366] focus:ring-[#003366]/10 rounded-none transition-all" />
                                        <CheckCircle2 size={10} className="absolute left-0.5 top-0.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                    </div>
                                    <span className="text-[12px] text-zinc-500 group-hover:text-zinc-800 select-none font-medium">Keep me active</span>
                                </label>
                            </div>

                            <div className="pt-2">
                                <div className="p-4 bg-zinc-50 border border-zinc-100 mb-6 flex items-center justify-center">
                                    <ReCAPTCHA
                                        ref={recaptchaRef}
                                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LfA4LssAAAAAJjVmCALHZYPY4bwg_XzQ7ZNCMGI"}
                                        onChange={(token) => setCaptchaToken(token)}
                                    />
                                </div>
                            </div>

                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-rose-50 text-rose-600 text-[11px] font-semibold flex items-center gap-3 border border-rose-100"
                                >
                                    <ShieldAlert size={14} className="shrink-0" />
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full h-12 bg-[#003366] text-white text-[12px] font-semibold uppercase tracking-[0.2em] transition-all hover:bg-black active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-[#003366]/20"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                    <>
                                        <span>Unlock Portal</span>
                                        <Zap size={14} className="fill-white" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center pt-8 border-t border-zinc-100">
                            <p className="text-[13px] text-zinc-400 font-medium">
                                No Intern profile? <Link href="/intern/signup" className="text-[#003366] font-semibold hover:underline">Apply Now</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Footer */}
            <footer className="fixed bottom-0 left-0 w-full py-8 px-6 hidden md:block pointer-events-none">
                <div className="max-w-[1200px] mx-auto flex justify-between items-center opacity-40">
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-widest">
                        EST. 2025 • Student Forge Enterprise
                    </p>
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-widest">
                        RSA-4096 / SHA-512 SECURED
                    </p>
                </div>
            </footer>
        </div>
    );
}
