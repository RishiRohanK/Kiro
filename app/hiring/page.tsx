"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import Navbar from "../components/home/Navbar";
import SubNavbar from "../components/home/SubNavbar";
import Footer from "../components/home/Footer";

const POSITIONS = [
    "Marketing lead",
    "UI/UX designer",
    "Frontend developer",
    "Backend developer",
    "Content strategist",
    "Social media manager"
];

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
                setError(data.error || "submission failed, please try again.");
            }
        } catch (err) {
            setError("connection failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans">
            <Navbar />
            <SubNavbar />

            <main className="max-w-2xl mx-auto px-6 py-20 md:py-32">
                {!success ? (
                    <div className="space-y-12">
                        <div className="space-y-3 border-l-2 border-zinc-900 pl-6">
                            <h1 className="text-3xl font-normal tracking-tight text-zinc-900">
                                Apply for a role
                            </h1>
                            <p className="text-[14px] text-zinc-500 font-medium">
                                We are looking for talented individuals to join our team. 
                                fill out the form below to apply.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {error && (
                                <p className="text-red-600 text-[12px] font-bold bg-red-50 p-3 border border-red-100 uppercase tracking-widest">
                                    {error}
                                </p>
                            )}

                            <div className="grid grid-cols-1 gap-6">
                                <FormInput 
                                    label="full name" 
                                    value={formData.name}
                                    onChange={(val) => setFormData({...formData, name: val})}
                                    required
                                />
                                <FormInput 
                                    label="email address" 
                                    type="email"
                                    value={formData.email}
                                    onChange={(val) => setFormData({...formData, email: val})}
                                    required
                                />
                                <FormInput 
                                    label="phone number" 
                                    value={formData.phone}
                                    onChange={(val) => setFormData({...formData, phone: val})}
                                    required
                                />
                                
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">Position</label>
                                    <select 
                                        className="w-full h-11 bg-zinc-50 border border-zinc-100 px-4 text-[13px] outline-none focus:bg-white focus:border-zinc-900 transition-all appearance-none font-medium rounded-none"
                                        value={formData.position}
                                        onChange={(e) => setFormData({...formData, position: e.target.value})}
                                        required
                                    >
                                        <option value="" disabled>select position</option>
                                        {POSITIONS.map(p => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                </div>

                                <FormInput 
                                    label="resume link (google drive)" 
                                    placeholder="https://drive.google.com/..."
                                    value={formData.resumeLink}
                                    onChange={(val) => setFormData({...formData, resumeLink: val})}
                                    required
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="h-12 bg-black text-white px-10 text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all disabled:opacity-30"
                            >
                                {loading ? <Loader2 className="animate-spin" size={14} /> : "Submit application"}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="py-20 text-center space-y-6 animate-in fade-in duration-700">
                        <CheckCircle2 size={48} className="mx-auto text-zinc-900" strokeWidth={1} />
                        <div className="space-y-2">
                            <h3 className="text-2xl font-normal text-zinc-900">Application sent.</h3>
                            <p className="text-[14px] text-zinc-500 max-w-xs mx-auto">
                                thank you for applying. our team will review your details and reach out soon.
                            </p>
                        </div>
                        <button 
                            onClick={() => setSuccess(false)}
                            className="text-[11px] font-bold uppercase tracking-widest border-b border-zinc-900 pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-all"
                        >
                            Return to form
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

function FormInput({ label, value, onChange, type = "text", placeholder = "", required = false }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">{label}</label>
            <input 
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-11 bg-zinc-50 border border-zinc-100 px-4 text-[13px] outline-none focus:bg-white focus:border-zinc-900 transition-all font-medium rounded-none"
                required={required}
            />
        </div>
    );
}
