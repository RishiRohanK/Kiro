"use client";

import { motion } from "framer-motion";
import { Award, Gift, GraduationCap, Briefcase, Zap, CheckCircle, ArrowRight, User, Mail, GraduationCap as Cap, Building2, Linkedin, Star, Shield, Target } from "lucide-react";
import Navbar from "../components/home/Navbar";
import SubNavbar from "../components/home/SubNavbar";
import Footer from "../components/home/Footer";
import { useState } from "react";

const benefits = [
    {
        title: "Definitive Swag Kit",
        description: "Receive high-performance Student Forge apparel, technical accessories, and campus-ready assets.",
        icon: <Gift className="w-5 h-5" />
    },
    {
        title: "Tier-1 Internships",
        description: "Vanguard ambassadors receive direct priority for high-speed technical internships and roles.",
        icon: <Briefcase className="w-5 h-5" />
    },
    {
        title: "Architect Mentorship",
        description: "Engage in zero-friction 1-on-1 sessions with senior technical leaders and platform architects.",
        icon: <Award className="w-5 h-5" />
    },
    {
        title: "Command Experience",
        description: "Establish and lead your own technical hub, gaining real-world leadership and community metrics.",
        icon: <Zap className="w-5 h-5" />
    }
];

const responsibilities = [
    "Establish and command a technical Student Forge hub on your primary campus.",
    "Execute high-speed technical workshops, hackathons, and community sprints.",
    "Formally synchronize communications between Student Forge and college technical faculty.",
    "Accelerate brand awareness through strategic social integration and on-ground missions.",
    "Consolidate student feedback to optimize our technical accelerator and tools suite."
];

export default function AmbassadorPage() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        college: "",
        year: "1st Year",
        linkedin: "",
        motivation: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        // Simulate high-speed API synchronization
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSubmitting(false);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-orange-100">
            <Navbar />
            <SubNavbar />

            <main>
                {/* Hero Section - High-Speed Architecture */}
                <section className="bg-zinc-900 py-12 md:py-16 border-b border-white/5 overflow-hidden relative text-left">
                    <div className="absolute top-0 right-0 w-[50%] h-full bg-orange-600/5 blur-[100px] pointer-events-none" />
                    <div className="mx-auto max-w-7xl px-6 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="max-w-2xl space-y-4"
                            >
                                <div className="inline-flex h-4 items-center px-1.5 border border-white/10 bg-white/5 text-orange-400 text-[9px] font-bold leading-none">
                                    Strategic lead program
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tighter text-white leading-tight">
                                    Campus <span className="text-orange-500">Ambassadors</span>.
                                </h1>
                                <p className="text-zinc-400 text-[15px] md:text-[16px] font-normal max-w-xl leading-relaxed">
                                    Command the technical evolution of your campus. 50+ students are already leading the movement to synchronize education with industry standards.
                                </p>
                                <div className="pt-6">
                                    <button
                                        onClick={() => document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="h-12 px-8 bg-orange-600 text-white text-[12px] font-bold transition-all rounded-none"
                                    >
                                        Initiate application
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="hidden lg:block relative"
                            >
                                <img
                                    src="https://www.keg.com/hubfs/iStock-1461631542.jpg"
                                    alt="Student Ambassador"
                                    className="w-full h-[400px] object-cover grayscale brightness-50 border border-white/10"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Benefits Grid - High-Density */}
                <section className="py-10 md:py-12 bg-zinc-50 border-b border-zinc-100">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div className="space-y-3">
                                <div className="inline-flex h-6 items-center border border-zinc-200 bg-zinc-50 px-3 text-[10px] font-bold text-zinc-500 tracking-[0.1em]">
                                    Vanguard perks
                                </div>
                                <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-zinc-900 leading-tight">
                                    Mission <span className="text-orange-600">Accelerators.</span>
                                </h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={benefit.title}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group flex flex-col bg-white border border-zinc-200 hover:border-orange-600 transition-all duration-200 p-8 rounded-none"
                                >
                                    <div className="h-10 w-10 mb-8 flex items-center justify-center bg-zinc-50 text-zinc-400 transition-all group-hover:bg-orange-600 group-hover:text-white">
                                        {benefit.icon}
                                    </div>
                                    <h3 className="text-[15px] font-bold text-zinc-900 mb-3 leading-snug group-hover:text-orange-600 transition-colors">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-zinc-400 text-[13px] font-normal leading-relaxed">
                                        {benefit.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Responsibilities Architecture */}
                <section className="py-12 md:py-16 bg-white">
                    <div className="mx-auto max-w-7xl px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <div className="inline-flex h-6 items-center border border-zinc-200 bg-zinc-50 px-3 text-[10px] font-bold text-zinc-500 tracking-[0.1em]">
                                    Program protocol
                                </div>
                                <h2 className="text-3xl md:text-5xl font-normal tracking-tight text-zinc-900">Program <span className="text-orange-600">Protocol</span>.</h2>
                                <p className="text-zinc-500 text-[15px] md:text-[16px] leading-relaxed max-w-lg">
                                    As a Strategic Lead, you take absolute ownership of your campus technical growth and community synchronization.
                                </p>
                            </div>

                            <div className="space-y-4 pt-4">
                                {responsibilities.map((item, i) => (
                                    <div key={i} className="flex gap-4 items-start group">
                                        <div className="mt-1 flex h-5 w-5 items-center justify-center border border-zinc-200 text-zinc-400 group-hover:border-orange-600 group-hover:text-orange-600 transition-all">
                                            <CheckCircle className="w-3 h-3" />
                                        </div>
                                        <span className="text-[14px] text-zinc-600 font-medium leading-relaxed">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative group">
                            <img
                                src="https://www.fastweb.com/uploads/article_photo/photo/2036641/10-ways-to-be-a-better-student.jpeg"
                                alt="Student community"
                                className="w-full h-[400px] object-cover border border-zinc-200 grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute -bottom-4 -right-4 h-full w-full border border-orange-600/20 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500" />
                        </div>
                    </div>
                </section>

                {/* Application Architecture */}
                <section id="apply-form" className="py-16 lg:py-20 bg-zinc-900 text-white border-t border-white/5 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-full h-full bg-orange-600/5 blur-[120px] pointer-events-none" />
                    <div className="mx-auto max-w-3xl px-6 relative z-10">
                        <div className="text-center mb-16 space-y-3">
                            <div className="inline-flex h-4 items-center px-1.5 border border-white/10 bg-white/5 text-orange-400 text-[9px] font-bold leading-none">
                                Application terminal
                            </div>
                            <h2 className="text-3xl md:text-5xl font-normal tracking-tighter text-white">Initiate <span className="text-orange-500">Command</span>.</h2>
                            <p className="text-zinc-400 text-[14px] font-normal">Complete the technical alignment form below to begin your mission.</p>
                        </div>

                        {submitted ? (
                            <motion.div
                                initial={{ scale: 0.98, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="p-16 border border-orange-600/30 bg-orange-600/5 text-center space-y-6"
                            >
                                <div className="flex justify-center">
                                    <div className="h-12 w-12 bg-orange-600 flex items-center justify-center">
                                        <Shield className="text-white w-6 h-6" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold tracking-tight text-white mb-2">Protocol Synchronized.</h3>
                                    <p className="text-zinc-400 text-[14px]">Our HQ will review your profile. Expect technical clearance within 72 hours.</p>
                                </div>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="text-[10px] font-bold text-orange-500 border-b border-orange-500/30 hover:border-orange-500 transition-all pb-1"
                                >
                                    Re-initiate protocol
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Full Name */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-zinc-500">Full name</label>
                                        <div className="relative">
                                            <input
                                                type="text" required
                                                className="h-12 w-full border border-white/10 bg-white/5 px-4 text-[13px] text-white outline-none focus:border-orange-600 transition-all placeholder:text-zinc-700"
                                                placeholder="Identity..."
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-zinc-500">Communication node</label>
                                        <div className="relative">
                                            <input
                                                type="email" required
                                                className="h-12 w-full border border-white/10 bg-white/5 px-4 text-[13px] text-white outline-none focus:border-orange-600 transition-all placeholder:text-zinc-700"
                                                placeholder="Email..."
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* College */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-zinc-500">Academic institution</label>
                                        <div className="relative">
                                            <input
                                                type="text" required
                                                className="h-12 w-full border border-white/10 bg-white/5 px-4 text-[13px] text-white outline-none focus:border-orange-600 transition-all placeholder:text-zinc-700"
                                                placeholder="University..."
                                                value={formData.college}
                                                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Year of Study */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-zinc-500">Strategic tier</label>
                                        <div className="relative">
                                            <select
                                                className="h-12 w-full border border-white/10 bg-white/5 px-4 text-[13px] text-white outline-none focus:border-orange-600 transition-all appearance-none cursor-pointer"
                                                value={formData.year}
                                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                            >
                                                <option className="bg-zinc-900">1st Year</option>
                                                <option className="bg-zinc-900">2nd Year</option>
                                                <option className="bg-zinc-900">3rd Year</option>
                                                <option className="bg-zinc-900">4th Year</option>
                                                <option className="bg-zinc-900">Graduate</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* LinkedIn */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-zinc-500">Professional identity link</label>
                                    <input
                                        type="url"
                                        className="h-12 w-full border border-white/10 bg-white/5 px-4 text-[13px] text-white outline-none focus:border-orange-600 transition-all placeholder:text-zinc-700"
                                        placeholder="LinkedIn URL..."
                                        value={formData.linkedin}
                                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                    />
                                </div>

                                {/* Motivation */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-zinc-500">Mission statement</label>
                                    <textarea
                                        required
                                        className="w-full min-h-[100px] border border-white/10 bg-white/5 p-4 text-[13px] text-white outline-none focus:border-orange-600 transition-all resize-none placeholder:text-zinc-700"
                                        placeholder="Why lead the engineering evolution? (Brief)..."
                                        value={formData.motivation}
                                        onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                                    ></textarea>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full h-14 bg-orange-600 text-white text-[12px] font-bold transition-all flex items-center justify-center gap-3 disabled:bg-zinc-800"
                                >
                                    {submitting ? "Synchronizing..." : (
                                        <>
                                            Initiate mission
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
