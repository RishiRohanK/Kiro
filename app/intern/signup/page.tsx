"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2, Eye, EyeOff, User, Mail, School } from "lucide-react";

const COLLEGES = [
    "CMR Institute of Technology (CMRIT Hyderabad)",
    "Kamala Institute of Technology and Science (KITS Karimnagar)",
    "Vignan's Institute of Management and Technology for Women (Vignan Women’s)"
];

export default function InternSignupPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [college, setCollege] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!college) {
            setError("Please select your college.");
            return;
        }
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/intern/signup", {
                method: "POST",
                body: JSON.stringify({ name, email, password, college }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("intern_user", JSON.stringify(data.user));
                router.push("/intern/dashboard");
            } else {
                setError(data.error || "Registration failed.");
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
                <img src="https://ik.imagekit.io/dypkhqxip/Rocket-rafiki%20(1).svg" alt="" className="absolute left-[2%] top-[10%] w-[480px] hidden lg:block" />
                <img src="https://ik.imagekit.io/dypkhqxip/Happy%20student-bro.svg" alt="" className="absolute right-[5%] bottom-[5%] w-[420px] hidden lg:block" />
            </div>

            {/* Signup Card - Sharp Edges */}
            <div className="w-full max-w-[420px] bg-white border border-zinc-100 p-7 md:p-10 relative z-10 shadow-[0_4px_30px_-5px_rgba(0,0,0,0.03)]">

                {/* Logo Section */}
                <div className="flex flex-col items-center mb-8">
                    <img
                        src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1774885412/Screenshot_2026-03-30_at_21.13.11-removebg-preview_gaqcdz.png"
                        alt="Company Logo"
                        className="h-10 w-auto mb-4"
                    />

                    <div className="text-center space-y-1">
                        <h2 className="text-[14px] font-bold text-zinc-800 tracking-tight">
                            Create Intern Account
                        </h2>
                        <p className="text-[11px] text-zinc-400 font-medium">
                            Join Batch 2 of the Student Forge Initiative
                        </p>
                    </div>
                </div>

                {/* Active Registration Form */}
                <form onSubmit={handleSignup} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 text-[12px] font-bold text-center border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 text-zinc-400" size={16} />
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-[44px] pl-10 pr-4 bg-[#FAFAFA] border border-zinc-200 text-[13px] text-zinc-900 focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-500 shadow-inner shadow-zinc-50"
                                required
                            />
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 text-zinc-400" size={16} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-[44px] pl-10 pr-4 bg-[#FAFAFA] border border-zinc-200 text-[13px] text-zinc-900 focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-500 shadow-inner shadow-zinc-50"
                                required
                            />
                        </div>

                        <div className="relative">
                            <School className="absolute left-3 top-3.5 text-zinc-400" size={16} />
                            <select
                                value={college}
                                onChange={(e) => setCollege(e.target.value)}
                                className="w-full h-[44px] pl-10 pr-4 bg-[#FAFAFA] border border-zinc-200 text-[13px] text-zinc-900 focus:outline-none focus:border-zinc-400 transition-colors appearance-none shadow-inner shadow-zinc-50"
                                required
                            >
                                <option value="" disabled className="text-zinc-500">Select your college</option>
                                {COLLEGES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>

                        <div className="relative">
                            {showPassword ? (
                                <EyeOff className="absolute left-3 top-3.5 text-zinc-400" size={16} />
                            ) : (
                                <Eye className="absolute left-3 top-3.5 text-zinc-400" size={16} />
                            )}
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-[44px] pl-10 pr-10 bg-[#FAFAFA] border border-zinc-200 text-[13px] text-zinc-900 focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-500 shadow-inner shadow-zinc-50"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3.5 text-zinc-400 hover:text-zinc-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-[44px] bg-zinc-900 text-white text-[13px] font-bold mt-2 transition-all hover:bg-black active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-xl shadow-black/10"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : "Create Account"}
                    </button>

                    <p className="text-center text-[12px] text-zinc-500 mt-6 pt-6 border-t border-zinc-100">
                        Already have an account?{" "}
                        <Link href="/intern/signin" className="text-black font-bold hover:underline underline-offset-2">
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
