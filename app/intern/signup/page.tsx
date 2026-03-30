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

                {/* Form Section */}
                <form onSubmit={handleSignup} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-zinc-400 ml-1 uppercase tracking-wider">
                            Full Name
                        </label>
                        <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-[46px] bg-[#F9F9F9] px-4 text-[13px] font-medium outline-none transition-all focus:bg-white border border-zinc-100 focus:border-zinc-300 placeholder:text-zinc-300"
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-zinc-400 ml-1 uppercase tracking-wider">
                            Email Address
                        </label>
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-[46px] bg-[#F9F9F9] px-4 text-[13px] font-medium outline-none transition-all focus:bg-white border border-zinc-100 focus:border-zinc-300 placeholder:text-zinc-300"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-zinc-400 ml-1 uppercase tracking-wider">
                            Select College
                        </label>
                        <select
                            required
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
                            className="w-full h-[46px] bg-[#F9F9F9] px-4 text-[13px] font-medium outline-none transition-all focus:bg-white border border-zinc-100 focus:border-zinc-300 appearance-none cursor-pointer"
                        >
                            <option value="" disabled className="text-zinc-300">Choose your institution</option>
                            {COLLEGES.map((c, idx) => (
                                <option key={idx} value={c} className="text-zinc-800 py-2">
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-zinc-400 ml-1 uppercase tracking-wider">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                required
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-[46px] bg-[#F9F9F9] px-4 pr-10 text-[13px] font-medium outline-none transition-all focus:bg-white border border-zinc-100 focus:border-zinc-300 placeholder:text-zinc-300"
                                placeholder="Min. 8 characters"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-500 text-[11px] font-bold flex items-center gap-2 border border-red-100">
                            <ShieldAlert size={14} />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full h-[48px] bg-zinc-900 text-white text-[13px] font-bold transition-all hover:bg-black active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Intern Account"}
                    </button>
                </form>


                <div className="mt-10 text-center border-t border-zinc-100 pt-6">
                    <p className="text-[12px] text-zinc-400 font-medium tracking-tight">
                        Already registered? <Link href="/intern/signin" className="text-zinc-900 font-bold hover:underline ml-1">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
