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

                {/* Frozen Registration Section */}
                <div className="space-y-8 mt-6">
                    <div className="bg-red-50/50 border border-red-100 p-8 flex flex-col items-center text-center gap-4">
                        <div className="h-12 w-12 bg-white border border-red-100 flex items-center justify-center text-red-500 rounded-full shadow-sm">
                            <ShieldAlert size={24} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-[15px] font-bold text-red-600 tracking-tight">Registration Protocol Frozen</h3>
                            <p className="text-[12px] font-medium text-red-500/80 leading-relaxed max-w-[280px]">
                                New intern intakes are currently offline. The validation window for Batch 2 has elapsed.
                            </p>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Link href="/intern/signin">
                            <button className="w-full h-[48px] bg-zinc-900 text-white text-[13px] font-bold transition-all hover:bg-black active:scale-[0.99] flex items-center justify-center shadow-xl shadow-black/10">
                                Access Existing Identity Node
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
