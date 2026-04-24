"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Simulate login
        setTimeout(() => {
            localStorage.setItem("forge_user_signed_in", "true");
            router.push("/events");
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-white text-[#495057] font-sans flex flex-col items-center selection:bg-emerald-50">
            {/* Breadcrumbs */}
            <div className="w-full max-w-[850px] pt-8 px-6 flex justify-start">
                <nav className="flex items-center gap-2 text-[13px] font-medium text-zinc-400">
                    <Link href="/" className="hover:text-black transition-colors">Portal</Link>
                    <span className="text-zinc-200 text-[10px]">/</span>
                    <span className="text-zinc-900">Student Login</span>
                </nav>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 w-full">
                <div className="w-full max-w-[850px] bg-white border border-zinc-100 flex flex-col md:flex-row relative z-10 shadow-sm">

                    {/* Left Side: Branding */}
                    <div className="md:w-5/12 bg-emerald-50 p-8 md:p-10 flex flex-col justify-center relative overflow-hidden">
                        <div className="space-y-4 relative z-10">
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/sflogo"
                                alt="Student Forge"
                                className="h-10 w-auto mb-6"
                            />
                            <div className="space-y-1">
                                <h1 className="text-emerald-900 text-xl font-bold">Student Portal</h1>
                                <p className="text-emerald-700/70 text-[13px] font-medium leading-relaxed">
                                    Access your learning resources, community, and upcoming events.
                                </p>
                            </div>
                        </div>

                        <div className="mt-12 relative z-10">
                            <img
                                src="https://ik.imagekit.io/dypkhqxip/Teacher%20student-pana.svg"
                                alt="Illustration"
                                className="w-full h-auto max-w-[220px] mx-auto opacity-80 mix-blend-multiply"
                            />
                        </div>
                    </div>

                    {/* Right Side: Form Section */}
                    <div className="md:w-7/12 p-8 md:p-12 relative bg-white">
                        <div className="max-w-[320px] mx-auto">
                            <div className="mb-8">
                                <h2 className="text-lg font-bold text-zinc-900">Sign In</h2>
                                <p className="text-[13px] text-zinc-400 font-medium">Enter your credentials to continue</p>
                            </div>

                            <form onSubmit={handleSignIn} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                                        School
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full h-11 bg-zinc-50 border border-zinc-100 px-4 text-[13px] outline-none transition-all focus:border-emerald-500 focus:bg-white"
                                        placeholder="Enter your school name"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                                        Email Address
                                    </label>
                                    <input
                                        required
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-11 bg-zinc-50 border border-zinc-100 px-4 text-[13px] outline-none transition-all focus:border-emerald-500 focus:bg-white"
                                        placeholder="name@example.com"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                                            Password
                                        </label>
                                        <Link href="/forgot-password" className="text-[11px] text-emerald-600 font-bold hover:underline">
                                            Forgot?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <input
                                            required
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full h-11 bg-zinc-50 border border-zinc-100 px-4 pr-12 text-[13px] outline-none transition-all focus:border-emerald-500 focus:bg-white"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-500 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 text-red-500 text-[11px] font-bold flex items-center gap-2 border border-red-100">
                                        <ShieldAlert size={14} className="shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full h-11 bg-emerald-600 text-white text-[13px] font-bold transition-all hover:bg-emerald-700 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                                </button>
                            </form>

                            <div className="mt-8 text-center pt-6 border-t border-zinc-50">
                                <p className="text-[12px] text-zinc-400 font-medium">
                                    No account? <Link href="/signup" className="text-emerald-600 font-bold hover:underline">Register now</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <footer className="w-full bg-zinc-50 border-t border-zinc-100 py-10 px-6 mt-auto">
                <div className="max-w-[850px] mx-auto flex flex-col items-center gap-4 text-center">
                    <div className="space-y-3">
                        <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                            © 2025-2026 Student Forge Technologies Private Limited. All Rights Reserved.
                            Unauthorized access or use of this platform is strictly prohibited.
                        </p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                            platform.studentforge.in is a registered trademark. Secured with enterprise-grade encryption.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
