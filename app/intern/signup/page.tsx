"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2, Eye, EyeOff, User, Mail, Phone, Lock, Facebook, Linkedin, Instagram, School } from "lucide-react";

const COLLEGES = [
    "CMR Institute of Technology (CMRIT Hyderabad)",
    "Kamala Institute of Technology and Science (KITS Karimnagar)",
    "Vignan's Institute of Management and Technology for Women (Vignan Women’s)"
];

export default function InternSignupPage() {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [college, setCollege] = useState("");
    const [password, setPassword] = useState("");
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
                body: JSON.stringify({
                    name: `${firstName} ${lastName}`,
                    email,
                    phone,
                    college,
                    password
                }),
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
        <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans overflow-x-hidden">

            {/* Left Side: Minimalist Panel with Animation */}
            <div className="md:w-[60%] bg-[#E0E7FF] relative hidden md:flex flex-col items-center justify-between overflow-hidden pt-12 pb-10 px-12">
                {/* Top Left Info */}
                <div className="w-full flex flex-col items-start gap-6 relative z-20">
                    <div className="flex items-center gap-4">
                        <img 
                            src="https://ik.imagekit.io/dypkhqxip/learngrid?updatedAt=1775552006855" 
                            alt="LearnGrid" 
                            className="h-8 w-auto"
                        />
                        <div className="h-6 w-px bg-[#003366]/20"></div>
                        <img 
                            src="https://ik.imagekit.io/dypkhqxip/sflogo?updatedAt=1774952380858" 
                            alt="Student Forge" 
                            className="h-7 w-auto"
                        />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-[#003366] text-xl font-bold">LearnGrid Workspace</h2>
                        <p className="text-[#003366]/60 text-[14px] font-medium">An official Student Forge Initiative</p>
                    </div>
                </div>

                {/* Bottom Animation */}
                <div className="relative z-10 w-full max-w-[750px] translate-y-32">
                    <iframe 
                        src="https://lottie.host/embed/521c9b48-ae0c-49ba-a951-9c0d31728f01/2oOdwYfKHI.lottie" 
                        className="w-full aspect-square border-none scale-125"
                    ></iframe>
                </div>

                {/* Decorative BG elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#003366]/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            </div>

            {/* Right Side: Registration Form */}
            <div className="w-full md:w-[40%] p-8 md:p-16 flex flex-col justify-center relative bg-white">
                <div className="max-w-[480px] w-full mx-auto space-y-8">

                    <div className="flex flex-col gap-2">
                        <h1 className="text-[#003366] text-2xl font-bold">Register account</h1>
                        <p className="text-zinc-600 text-[13px] font-bold italic">Batch 3 registrations are now officially started!</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#003366]">
                                    <User size={16} />
                                </span>
                                <input
                                    required
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full h-12 bg-white border border-zinc-200 pl-11 pr-4 text-[14px] outline-none focus:border-[#003366] transition-all"
                                    placeholder="First Name"
                                />
                            </div>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#003366]">
                                    <User size={16} />
                                </span>
                                <input
                                    required
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full h-12 bg-white border border-zinc-200 pl-11 pr-4 text-[14px] outline-none focus:border-[#003366] transition-all"
                                    placeholder="Last Name"
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#003366]">
                                <Phone size={16} />
                            </span>
                            <input
                                required
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full h-12 bg-white border border-zinc-200 pl-11 pr-4 text-[14px] outline-none focus:border-[#003366] transition-all"
                                placeholder="Enter Phone Number"
                            />
                        </div>

                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#003366]">
                                <School size={16} />
                            </span>
                            <select
                                required
                                value={college}
                                onChange={(e) => setCollege(e.target.value)}
                                className="w-full h-12 bg-white border border-zinc-200 pl-11 pr-4 text-[14px] outline-none focus:border-[#003366] transition-all appearance-none"
                            >
                                <option value="" disabled>Select College</option>
                                {COLLEGES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#003366]">
                                    <Mail size={16} />
                                </span>
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 bg-white border border-zinc-200 pl-11 pr-4 text-[14px] outline-none focus:border-[#003366] transition-all"
                                    placeholder="Enter Email Address"
                                />
                            </div>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#003366]">
                                    <Lock size={16} />
                                </span>
                                <input
                                    required
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-12 bg-white border border-zinc-200 pl-11 pr-12 text-[14px] outline-none focus:border-[#003366] transition-all"
                                    placeholder="Set password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 pt-2">
                            <input type="checkbox" required className="mt-1 w-3.5 h-3.5 border-zinc-300 rounded-none text-[#003366] focus:ring-0" />
                            <p className="text-[12px] text-zinc-500 font-medium">
                                By registering you agree to the Student Forge <Link href="#" className="text-[#003366] font-bold hover:underline">Terms of Use</Link>
                            </p>
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
                            className="w-full h-12 bg-[#003366] text-white text-[14px] font-bold transition-all hover:bg-[#002244] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Register"}
                        </button>
                    </form>

                    <div className="space-y-6 pt-2">
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-[12px] text-zinc-400 font-bold">Follow us on</p>
                            <div className="flex gap-3">
                                <button type="button" className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-all shadow-sm">
                                    <Facebook size={18} />
                                </button>
                                <button type="button" className="w-9 h-9 rounded-full bg-[#0077B5] text-white flex items-center justify-center hover:scale-110 transition-all shadow-sm">
                                    <Linkedin size={18} />
                                </button>
                                <button type="button" className="w-9 h-9 rounded-full bg-[#E1306C] text-white flex items-center justify-center hover:scale-110 transition-all shadow-sm">
                                    <Instagram size={18} />
                                </button>
                            </div>
                        </div>

                        <p className="text-center text-[13px] text-zinc-500 font-medium">
                            Already have an account ? <Link href="/intern/signin" className="text-[#003366] font-bold hover:underline">Login</Link>
                        </p>
                    </div>

                    <div className="pt-8 border-t border-zinc-100">
                        <p className="text-center text-[11px] text-zinc-400 font-medium">
                            Copyright Student Forge Technologies Pvt. Ltd © 2025-2026. <br />
                            All Rights Reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
