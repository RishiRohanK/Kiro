"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import Navbar from "../components/home/Navbar";
import SubNavbar from "../components/home/SubNavbar";
import Footer from "../components/home/Footer";

const POSITIONS = [
    "marketing lead",
    "ui/ux designer",
    "frontend developer",
    "backend developer",
    "content strategist",
    "social media manager"
];

interface FormInputProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
}

export default function HiringPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        position: "",
        resumeLink: ""
    });
    
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
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSuccess(true);
                setFormData({ name: "", email: "", phone: "", position: "", resumeLink: "" });
            } else {
                const data = await res.json();
                setError(data.error || "could not send application. please try again.");
            }
        } catch (err) {
            setError("connection issue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-black selection:text-white">
            <Navbar />
            <SubNavbar />

            <main className="max-w-6xl mx-auto px-6 py-20 md:py-32">
                <div className="border border-zinc-200 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Form Section */}
                        <div className="p-8 md:p-16 border-b lg:border-b-0 lg:border-r border-zinc-200 bg-white">
                            {!success ? (
                                <div className="space-y-12">
                                    <div className="space-y-3">
                                        <h1 className="text-3xl font-normal tracking-tight text-zinc-900 lowercase">
                                            apply here
                                        </h1>
                                        <p className="text-[14px] text-zinc-500 font-medium lowercase">
                                            we are looking for people to join our team. 
                                            please fill the details below to apply.
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {error && (
                                            <p className="text-red-600 text-[12px] font-bold bg-red-50 p-3 border border-red-100 lowercase">
                                                {error}
                                            </p>
                                        )}

                                        <div className="grid grid-cols-1 gap-6">
                                            <FormInput 
                                                label="your name" 
                                                value={formData.name}
                                                onChange={(val: string) => setFormData({...formData, name: val})}
                                                required
                                            />
                                            <FormInput 
                                                label="email" 
                                                type="email"
                                                value={formData.email}
                                                onChange={(val: string) => setFormData({...formData, email: val})}
                                                required
                                            />
                                            <FormInput 
                                                label="phone" 
                                                value={formData.phone}
                                                onChange={(val: string) => setFormData({...formData, phone: val})}
                                                required
                                            />
                                            
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-bold text-zinc-400 lowercase block">position</label>
                                                <select 
                                                    className="w-full h-11 bg-zinc-50 border border-zinc-200 px-4 text-[13px] outline-none focus:bg-white focus:border-zinc-900 transition-all appearance-none font-medium rounded-none lowercase"
                                                    value={formData.position}
                                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({...formData, position: e.target.value})}
                                                    required
                                                >
                                                    <option value="" disabled className="lowercase">select position</option>
                                                    {POSITIONS.map(p => (
                                                        <option key={p} value={p} className="lowercase">{p}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <FormInput 
                                                label="resume drive link" 
                                                placeholder="https://drive.google.com/..."
                                                value={formData.resumeLink}
                                                onChange={(val: string) => setFormData({...formData, resumeLink: val})}
                                                required
                                            />
                                        </div>

                                        <button 
                                            type="submit" 
                                            disabled={loading}
                                            className="h-12 bg-black text-white px-10 text-[11px] font-bold lowercase tracking-widest hover:bg-zinc-800 transition-all disabled:opacity-30 rounded-none w-full md:w-auto"
                                        >
                                            {loading ? <Loader2 className="animate-spin" size={14} /> : "send application"}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="py-20 text-center space-y-6 animate-in fade-in duration-700">
                                    <CheckCircle2 size={48} className="mx-auto text-zinc-900" strokeWidth={1} />
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-normal text-zinc-900 lowercase">application sent.</h3>
                                        <p className="text-[14px] text-zinc-500 max-w-xs mx-auto lowercase">
                                            thank you for applying. we will check your details and talk to you soon.
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => setSuccess(false)}
                                        className="text-[11px] font-bold lowercase border-b border-zinc-900 pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-all"
                                    >
                                        go back to form
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Banner Section */}
                        <div className="bg-zinc-50 flex items-center justify-center p-0">
                            <img 
                                src="https://ik.imagekit.io/dypkhqxip/sfhiring" 
                                alt="hiring banner" 
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function FormInput({ label, value, onChange, type = "text", placeholder = "", required = false }: FormInputProps) {
    return (
        <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 lowercase block">{label}</label>
            <input 
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-11 bg-zinc-50 border border-zinc-200 px-4 text-[13px] outline-none focus:bg-white focus:border-zinc-900 transition-all font-medium rounded-none lowercase placeholder:lowercase"
                required={required}
            />
        </div>
    );
}
