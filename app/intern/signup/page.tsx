"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2, Eye, EyeOff, User, Mail, Phone, Lock, Linkedin, Instagram, School } from "lucide-react";

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
                            src="https://ik.imagekit.io/dypkhqxip/platform?updatedAt=1776791557303" 
                            alt="Student Forge Platform" 
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
                        <h2 className="text-[#003366] text-xl font-bold">Platform Workspace</h2>
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

                    <div className="flex flex-col gap-6">
                        <h1 className="text-[#003366] text-2xl font-bold uppercase tracking-tight">Register account</h1>
                        <div className="p-3 border-l-4 border-amber-500 bg-amber-50">
                            <p className="text-amber-700 text-[13px] font-bold italic">Registration is currently frozen. Please check back later.</p>
                        </div>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()} className="space-y-5 opacity-60 pointer-events-none">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#003366]">
                                    <User size={16} />
                                </span>
                                <input
                                    disabled
                                    required
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full h-12 bg-white border border-zinc-200 pl-11 pr-4 text-[14px] outline-none focus:border-[#003366] transition-all rounded-none"
                                    placeholder="First Name"
                                />
                            </div>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#003366]">
                                    <User size={16} />
                                </span>
                                <input
                                    disabled
                                    required
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full h-12 bg-white border border-zinc-200 pl-11 pr-4 text-[14px] outline-none focus:border-[#003366] transition-all rounded-none"
                                    placeholder="Last Name"
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#003366]">
                                <Phone size={16} />
                            </span>
                            <input
                                disabled
                                required
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full h-12 bg-white border border-zinc-200 pl-11 pr-4 text-[14px] outline-none focus:border-[#003366] transition-all rounded-none"
                                placeholder="Enter Phone Number"
                            />
                        </div>

                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#003366]">
                                <School size={16} />
                            </span>
                            <select
                                disabled
                                required
                                value={college}
                                onChange={(e) => setCollege(e.target.value)}
                                className="w-full h-12 bg-white border border-zinc-200 pl-11 pr-4 text-[14px] outline-none focus:border-[#003366] transition-all appearance-none rounded-none"
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
                                    disabled
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 bg-white border border-zinc-200 pl-11 pr-4 text-[14px] outline-none focus:border-[#003366] transition-all rounded-none"
                                    placeholder="Enter Email Address"
                                />
                            </div>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#003366]">
                                    <Lock size={16} />
                                </span>
                                <input
                                    disabled
                                    required
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-12 bg-white border border-zinc-200 pl-11 pr-12 text-[14px] outline-none focus:border-[#003366] transition-all rounded-none"
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
                            <input disabled type="checkbox" required className="mt-1 w-3.5 h-3.5 border-zinc-300 rounded-none text-[#003366] focus:ring-0" />
                            <p className="text-[12px] text-zinc-500 font-medium">
                                By registering you agree to the Student Forge <Link href="/terms" className="text-[#003366] font-bold hover:underline">Terms of Use</Link>
                            </p>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-500 text-[11px] font-bold flex items-center gap-2 border border-red-100">
                                <ShieldAlert size={14} className="shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            disabled
                            type="button"
                            className="w-full h-12 bg-zinc-400 text-white text-[14px] font-bold cursor-not-allowed flex items-center justify-center gap-2 rounded-none"
                        >
                            Registration Frozen
                        </button>
                    </form>

                    <div className="space-y-6 pt-2">
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-[12px] text-zinc-400 font-bold uppercase tracking-widest">Connect with us</p>
                            <div className="flex gap-3">
                                <Link href="https://discord.gg/9ZAnhkXD" target="_blank" className="w-10 h-10 bg-[#5865F2] text-white flex items-center justify-center hover:opacity-80 transition-all shadow-sm rounded-none">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152c-.03-.005-.059.012-.072.0371-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495-.013-.025-.042-.042-.072-.037a19.7363 19.7363 0 00-4.8852 1.515c-.012.002-.023.011-.032.0277C.5334 9.0458-.319 13.5799.0992 18.0578c.002.019.013.04.0312.0561 2.0528 1.5076 4.0413 2.4228 5.9929 3.0294.032.01.0660-.003.0842-.0276.4616-.6304.8731-1.2952 1.226-1.9942.018-.033.004-.074-.0416-.1057-.6528-.2476-1.2743-.5495-1.8722-.8923-.048-.028-.051-.097-.0076-.1277.1258-.0943.2517-.1923.3718-.2914.025-.019.059-.026.0776-.0105 3.9278 1.7933 8.18 1.7933 12.0614 0 .018-.008.052-.001.0775.0095.1201.099.246.1981.3728.2924.044.03.041.099-.0066.1276a12.2986 12.2986 0 01-1.873.8914c-.045.016-.06.073-.0407.1067.3604.698.7719 1.3628 1.225 1.9932.018.024.049.038.0842.0286 1.961-.6067 3.9495-1.5219 6.0023-3.0294.018-.013.03-.034.0313-.0552.5004-5.177-.8382-9.6739-3.5485-13.6604a.0683.0683 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" /></svg>
                                </Link>
                                <Link href="https://www.linkedin.com/company/student-forge/" target="_blank" className="w-10 h-10 bg-[#0077B5] text-white flex items-center justify-center hover:opacity-80 transition-all shadow-sm rounded-none">
                                    <Linkedin size={18} />
                                </Link>
                                <Link href="https://www.instagram.com/studentforge/" target="_blank" className="w-10 h-10 bg-[#E1306C] text-white flex items-center justify-center hover:opacity-80 transition-all shadow-sm rounded-none">
                                    <Instagram size={18} />
                                </Link>
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
