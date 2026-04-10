"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";
import Link from "next/link";

export default function ContentCreatorPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        college: "",
        yearOfStudy: "",
        portfolioLink: "",
        resumeLink: "",
        position: "Content Creator"
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
            } else {
                const data = await res.json();
                setError(data.error || "Submission failed. Please try again.");
            }
        } catch (err) {
            setError("Connection issue. Check your network.");
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-black selection:text-white">
            <Navbar />
            
            <main className="max-w-4xl mx-auto px-6 py-12">
                {!success ? (
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
                                Content Creator Opportunity
                            </h1>
                            <p className="text-zinc-500 max-w-2xl leading-relaxed">
                                Join our team and help us build the most engaging educational platform. 
                                Please fill in the details below to apply for the Content Creator position.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8 border-t border-zinc-100 pt-10">
                            {error && (
                                <p className="text-red-600 text-[13px] font-medium bg-red-50 p-4 border border-red-100">
                                    {error}
                                </p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField 
                                    id="name"
                                    label="Full Name" 
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={(v: string) => updateField("name", v)}
                                    required
                                />
                                <InputField 
                                    id="email"
                                    label="Email Address" 
                                    type="email"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={(v: string) => updateField("email", v)}
                                    required
                                />
                                <InputField 
                                    id="phone"
                                    label="Contact Number" 
                                    placeholder="Enter phone number"
                                    value={formData.phone}
                                    onChange={(v: string) => updateField("phone", v)}
                                    required
                                />
                                <InputField 
                                    id="college"
                                    label="College / Institution" 
                                    placeholder="College name"
                                    value={formData.college}
                                    onChange={(v: string) => updateField("college", v)}
                                    required
                                />
                                <div className="space-y-2">
                                    <label className="text-[13px] font-medium text-zinc-700 block">Year of Study</label>
                                    <select 
                                        id="yearOfStudy"
                                        className="w-full h-11 bg-zinc-50 border border-zinc-200 px-4 text-[13px] outline-none focus:bg-white focus:border-zinc-900 transition-all font-medium rounded-md appearance-none"
                                        value={formData.yearOfStudy}
                                        onChange={(e) => updateField("yearOfStudy", e.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Select year</option>
                                        <option value="1st Year">1st Year</option>
                                        <option value="2nd Year">2nd Year</option>
                                        <option value="3rd Year">3rd Year</option>
                                        <option value="4th Year">4th Year</option>
                                        <option value="Graduate">Graduate</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <InputField 
                                    id="portfolioLink"
                                    label="Portfolio Link (Optional)" 
                                    placeholder="Link to your work"
                                    value={formData.portfolioLink}
                                    onChange={(v: string) => updateField("portfolioLink", v)}
                                />
                            </div>

                            <InputField 
                                id="resumeLink"
                                label="Resume Drive Link" 
                                placeholder="Link to your resume (Drive/Dropbox)"
                                value={formData.resumeLink}
                                onChange={(v: string) => updateField("resumeLink", v)}
                                required
                            />

                            <button 
                                id="submitApplication"
                                type="submit" 
                                disabled={loading}
                                className="h-11 bg-black text-white px-8 text-sm font-medium hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : "Submit Application"}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="py-20 text-center space-y-4">
                        <h2 className="text-3xl font-bold text-zinc-900">Application Submitted</h2>
                        <p className="text-zinc-500 max-w-sm mx-auto">
                            Thank you for applying. Our team will review your application and get back to you soon.
                        </p>
                        <div className="pt-6">
                            <Link 
                                href="/"
                                className="text-sm font-medium border-b border-black pb-0.5 hover:text-zinc-500 hover:border-zinc-500 transition-all"
                            >
                                Return back to home
                            </Link>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

function InputField({ label, id, value, onChange, type = "text", placeholder = "", required = false }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[13px] font-medium text-zinc-700 block">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input 
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-11 bg-zinc-50 border border-zinc-200 px-4 text-[13px] outline-none focus:bg-white focus:border-zinc-900 transition-all font-medium rounded-md placeholder:text-zinc-400"
                required={required}
            />
        </div>
    );
}
