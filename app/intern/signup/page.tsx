"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2, Eye, EyeOff, User, Mail, School, Lock } from "lucide-react";

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

                {/* Registration Frozen Overlay */}
                <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="flex flex-col items-center gap-6 py-10 bg-zinc-50 border border-dashed border-zinc-200">
                        <div className="w-16 h-16 bg-white border border-zinc-100 flex items-center justify-center shadow-sm">
                            <Lock className="text-zinc-400" size={24} />
                        </div>
                        <div className="text-center px-6">
                            <h3 className="text-xl font-bold tracking-tight text-zinc-900 mb-2 uppercase tracking-widest text-[14px]">
                                Registration Frozen
                            </h3>
                            <p className="text-[13px] text-zinc-500 leading-relaxed font-medium">
                                Batch 2 registrations are currently closed. Please contact administrators for the next intake window.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                         <div className="bg-amber-50 border-l-2 border-amber-400 p-4 flex items-start gap-3">
                             <ShieldAlert className="text-amber-500 mt-0.5" size={14} />
                             <p className="text-[11px] text-amber-800 font-bold leading-relaxed uppercase tracking-tight">
                                Administrator Control Active: System state is locked.
                             </p>
                         </div>
                         <Link 
                            href="/intern/signin" 
                            className="w-full h-12 bg-black text-white text-[11px] font-bold uppercase tracking-widest flex items-center justify-center hover:opacity-90 transition-opacity"
                         >
                            Intern Sign In Login
                         </Link>
                         <Link 
                            href="/" 
                            className="w-full h-12 border border-zinc-100 bg-white text-zinc-500 text-[11px] font-bold uppercase tracking-widest flex items-center justify-center hover:bg-zinc-50 transition-colors"
                         >
                            Return to Website Home
                         </Link>
                    </div>

                    <p className="text-center text-[10px] text-zinc-400 mt-6 pt-6 border-t border-zinc-100 font-bold uppercase tracking-widest">
                        Student Forge Initiative • Administrative Protocol
                    </p>
                </div>
            </div>
        </div>
    );
}
