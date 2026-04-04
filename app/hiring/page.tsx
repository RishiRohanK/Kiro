"use client";

import { useState } from "react";
import Link from "next/link";
import { 
    Briefcase, 
    User, 
    Mail, 
    Phone, 
    Link as LinkIcon, 
    CheckCircle2, 
    Loader2, 
    ArrowRight,
    Search,
    Globe,
    Zap,
    Users
} from "lucide-react";
import Navbar from "../components/home/Navbar";
import SubNavbar from "../components/home/SubNavbar";
import Footer from "../components/home/Footer";

const POSITIONS = [
    "Marketing Lead",
    "UI/UX Designer",
    "Frontend Developer",
    "Backend Developer",
    "Content Strategist",
    "Social Media Manager"
];

export default function HiringPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [position, setPosition] = useState("");
    const [resumeLink, setResumeLink] = useState("");
    
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/hiring", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone, position, resumeLink }),
            });

            if (res.ok) {
                setSuccess(true);
                setName("");
                setEmail("");
                setPhone("");
                setPosition("");
                setResumeLink("");
            } else {
                const data = await res.json();
                setError(data.error || "Submission failed. Please try again.");
            }
        } catch (err) {
            setError("Connection failed. Check your internet.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-black selection:text-white">
            <Navbar />
            <SubNavbar />

            <main className="w-full">
                {/* Visual Header - High Fidelity */}
                <div className="bg-zinc-900 py-16 md:py-24 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-[60%] h-full bg-blue-600/10 blur-[130px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[40%] h-full bg-violet-600/5 blur-[100px] pointer-events-none" />
                    
                    <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
                        <div className="max-w-3xl space-y-6">
                            <div className="inline-flex h-7 items-center px-4 border border-white/10 bg-white/5 text-blue-400 text-[11px] font-bold uppercase tracking-[0.2em] leading-none">
                                Careers at Student Forge
                            </div>
                            <h1 className="text-4xl md:text-6xl font-normal tracking-tight text-white leading-[1.1]">
                                Help us build <br />
                                the <span className="text-blue-500 font-bold italic">future</span> of learning.
                            </h1>
                            <p className="text-[16px] md:text-[18px] text-zinc-400 leading-relaxed font-normal max-w-xl">
                                We're looking for visionary thinkers to join our mission in revolutionizing the engineering education landscape.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form & Content Grid */}
                <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20 md:py-28">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                        
                        {/* Info Column */}
                        <div className="lg:col-span-5 space-y-12">
                            <div className="space-y-4">
                                <h2 className="text-[13px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-4">
                                    Why join the Forge?
                                </h2>
                                <div className="space-y-8 pt-4">
                                    <FeatureItem 
                                        icon={<Zap className="w-5 h-5 text-blue-500" />} 
                                        title="Hyper-growth Environment" 
                                        desc="Work on products that are actively scaling to thousands of interns across India." 
                                    />
                                    <FeatureItem 
                                        icon={<Globe className="w-5 h-5 text-violet-500" />} 
                                        title="Remote-First Philosophy" 
                                        desc="We value output over hours. Work from anywhere in the world on your schedule." 
                                    />
                                    <FeatureItem 
                                        icon={<Users className="w-5 h-5 text-emerald-500" />} 
                                        title="Peer-to-Peer Culture" 
                                        desc="Collaborate directly with founders and senior engineers without unnecessary hierarchy." 
                                    />
                                </div>
                            </div>
                            
                            <div className="bg-zinc-50 border border-zinc-100 p-8 space-y-4">
                                <p className="text-[14px] text-zinc-600 leading-relaxed italic">
                                    "We don't just hire for skills; we hire for obsession. If you think about UI/UX or Marketing in your sleep, you belong here."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-zinc-900 text-white flex items-center justify-center text-[10px] font-bold">RK</div>
                                    <p className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">Head of Talent</p>
                                </div>
                            </div>
                        </div>

                        {/* Application Form Column */}
                        <div className="lg:col-span-7">
                            {!success ? (
                                <div className="bg-white border border-zinc-100 shadow-2xl p-8 md:p-12 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Briefcase size={80} strokeWidth={1} />
                                    </div>
                                    
                                    <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-bold tracking-tight text-zinc-900">Application Intake</h3>
                                            <p className="text-[14px] text-zinc-500">Fill in your professional parameters to synchronize with our team.</p>
                                        </div>

                                        {error && (
                                            <div className="bg-red-50 text-red-600 p-4 text-[13px] font-bold border border-red-100 flex items-center gap-3 animate-shake">
                                                <Zap className="w-4 h-4 shrink-0" />
                                                {error}
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormInput 
                                                label="Full name" 
                                                icon={<User size={16} />} 
                                                placeholder="Enter identifier"
                                                value={name}
                                                onChange={setName}
                                                required
                                            />
                                            <FormInput 
                                                label="Professional email" 
                                                icon={<Mail size={16} />} 
                                                placeholder="sync@example.com"
                                                type="email"
                                                value={email}
                                                onChange={setEmail}
                                                required
                                            />
                                            <FormInput 
                                                label="Secure contact no." 
                                                icon={<Phone size={16} />} 
                                                placeholder="+91 XXX XXX XXXX"
                                                value={phone}
                                                onChange={setPhone}
                                                required
                                            />
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">Position interest</label>
                                                <div className="relative group">
                                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-blue-500 transition-colors" size={16} />
                                                    <select 
                                                        className="w-full h-12 bg-zinc-50 border border-zinc-100 pl-12 pr-4 text-[13px] outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none font-medium"
                                                        value={position}
                                                        onChange={(e) => setPosition(e.target.value)}
                                                        required
                                                    >
                                                        <option value="" disabled>Select position</option>
                                                        {POSITIONS.map(p => (
                                                            <option key={p} value={p}>{p}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <FormInput 
                                            label="Resume asset link (Google Drive / Dropbox)" 
                                            icon={<LinkIcon size={16} />} 
                                            placeholder="https://drive.google.com/asset-id"
                                            value={resumeLink}
                                            onChange={setResumeLink}
                                            required
                                        />

                                        <button 
                                            type="submit" 
                                            disabled={loading}
                                            className="w-full h-14 bg-black text-white text-[12px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-black/10"
                                        >
                                            {loading ? <Loader2 className="animate-spin" size={16} /> : (
                                                <>
                                                    Transmit application
                                                    <ArrowRight size={16} />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="bg-white border border-zinc-100 shadow-2xl p-12 md:p-20 text-center space-y-10 animate-in zoom-in-95 duration-500">
                                    <div className="w-24 h-24 bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center mx-auto rounded-full">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-3xl font-bold tracking-tight text-zinc-900">Application synchronized!</h3>
                                        <p className="text-[16px] text-zinc-500 leading-relaxed max-w-sm mx-auto">
                                            Our talent synchronization node has received your data. We will reach out within 48-72 operational hours if your skills align.
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => setSuccess(false)}
                                        className="h-12 border border-zinc-200 px-8 text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-50 transition-colors"
                                    >
                                        Apply for another Role
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function FormInput({ label, icon, placeholder, value, onChange, type = "text", required = false }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">{label}</label>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-blue-500 transition-colors">
                    {icon}
                </div>
                <input 
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full h-12 bg-zinc-50 border border-zinc-100 pl-12 pr-4 text-[13px] outline-none focus:bg-white focus:border-blue-600 transition-all font-medium"
                    required={required}
                />
            </div>
        </div>
    );
}

function FeatureItem({ icon, title, desc }: any) {
    return (
        <div className="flex gap-6 items-start group">
            <div className="h-12 w-12 bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:border-zinc-200 transition-all">
                {icon}
            </div>
            <div className="space-y-1">
                <h4 className="text-[16px] font-bold text-zinc-900">{title}</h4>
                <p className="text-[13px] text-zinc-500 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}
