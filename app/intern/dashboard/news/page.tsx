"use client";

import React from "react";
import { motion } from "framer-motion";
import { Newspaper, MapPin, Briefcase, GraduationCap, Phone, Globe, ExternalLink, CheckCircle2 } from "lucide-react";

const UPDATES = [
    {
        id: "rx-resume-builder",
        title: "RX Resume Builder – Intelligent, ATS-Friendly Resumes",
        image: "https://ik.imagekit.io/dypkhqxip/resumebuilder",
        date: "May 04, 2026",
        status: "Active",
        description: [
            "RX Resume Builder is an intelligent, ATS-friendly resume creation platform designed specifically for students and early professionals. It goes beyond traditional static templates by offering a dynamic and structured approach to resume building, ensuring your profile stands out in modern recruitment systems.",
            "Built on an ATS-driven template methodology, the platform helps users craft resumes that are optimized for applicant tracking systems while maintaining a clean and professional design. From structuring content effectively to highlighting key skills and achievements, RX Resume Builder ensures every resume is both impactful and recruiter-ready.",
            "With a focus on efficiency and adaptability, users can quickly generate personalized resumes tailored to different roles and industries. The platform simplifies the resume creation process, making it faster, smarter, and more aligned with current hiring standards.",
            "Currently in its Beta Model, RX Resume Builder is continuously evolving to deliver a seamless and powerful experience for students aiming to take their first step into the professional world."
        ],
        details: {
            "Version": "Beta Model",
            "Target": "Students & Early Professionals",
            "Technology": "ATS-Driven"
        },
        highlightsTitle: "Platform Advantages:",
        highlights: [
            "ATS-optimized template methodology",
            "Dynamic and structured building",
            "High-impact professional designs",
            "Fast personalized generation"
        ],
        footer: {
            contact: "+91 6304218064",
            website: "www.studentforge.in",
            applyLink: "/intern/dashboard/resume"
        }
    },
    {
        id: "hiring-2026",
        title: "Join Student Forge – We’re Hiring Interns",
        image: "https://ik.imagekit.io/dypkhqxip/hiring",
        date: "May 04, 2026",
        status: "Active",
        description: [
            "Student Forge is excited to welcome passionate and driven students to be part of our growing team. We are currently hiring Marketing Interns and Web Development Interns who are eager to learn, contribute, and build real-world experience.",
            "Whether you're looking to kickstart your career or enhance your practical skills, this opportunity is designed to help you grow in a collaborative and innovative environment.",
            "Take the first step towards shaping your future. Apply now and become a part of our journey."
        ],
        details: {
            "Location": "Khammam",
            "Role": "Marketing & Web Development Interns",
            "Eligibility": "Open to all students"
        },
        highlightsTitle: "At Student Forge, you will:",
        highlights: [
            "Work on real-time projects",
            "Gain hands-on industry experience",
            "Collaborate with a dynamic team",
            "Develop both technical and professional skills"
        ],
        footer: {
            contact: "+91 6304218064",
            website: "www.studentforge.in",
            applyLink: "https://forms.gle/r7VVbNAZcDvDJJ8n6"
        }
    },
    {
        id: "bootcamp-2026",
        title: "Summer boot camp 2026 announcement",
        image: "https://ik.imagekit.io/dypkhqxip/Summer%20Bootcamp%20(2).png?updatedAt=1776542583323",
        date: "April 20, 2026",
        status: "Active",
        description: [
            "This notice announces the start of the 30-day \"Summer Boot Camp 2026\". The program is designed to provide high-quality technical skills to students. We focus on building industry-standard capabilities through practical training.",
            "Our curriculum is built to help you master modern technology. You will receive instruction from seasoned professionals, engage in intensive lab sessions, and undergo weekly evaluations to monitor your growth."
        ],
        details: {
            "Eligibility": "Open to all students across all recognized colleges and technical institutions.",
            "Schedule": "Candidates from any undergraduate year are eligible to attend the training."
        },
        highlightsTitle: "Important Dates:",
        table: {
            headers: ["Activity description", "Schedule"],
            rows: [
                ["Online Registration Portal Starts", "April 20, 2026"],
                ["Portal Closure for New Requests", "May 05, 2026"],
                ["Training Operations Start", "10-05-2026 | 15-05-2026"],
                ["Final Assessment & Closure", "June 10, 2026 | 15-06-2026"],
            ]
        }
    }
];

export default function NewsUpdatesPage() {
    return (
        <div className="w-full pb-24">
            <header className="mb-8 border-b border-zinc-100 pb-5 flex items-center gap-3">
                <Newspaper size={22} strokeWidth={2.25} className="text-[#003366]" />
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-zinc-900 leading-none">News & Announcements</h1>
                    <p className="text-zinc-500 text-xs mt-1 leading-relaxed">Stay updated with official training timelines, career alerts, and portal announcements.</p>
                </div>
            </header>

            <div className="space-y-16">
                {UPDATES.map((update, index) => (
                    <motion.div 
                        key={update.id}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border border-zinc-200/80 overflow-hidden rounded-2xl shadow-sm hover:border-zinc-300 transition-all hover:shadow-md"
                    >
                        <div className="flex flex-col lg:flex-row min-h-[500px]">
                            {/* Left Side: Poster */}
                            <div className="lg:w-2/5 border-b lg:border-b-0 lg:border-r border-zinc-100 bg-zinc-50 flex items-start justify-center p-6 lg:p-8">
                                <img 
                                    src={update.image} 
                                    alt={update.title}
                                    className="w-full h-auto sticky top-8 grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
                                />
                            </div>

                            {/* Right Side: Content */}
                            <div className="lg:w-3/5 p-6 md:p-12 space-y-10">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                            update.status === "Active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-zinc-100 text-zinc-500"
                                        }`}>
                                            {update.status}
                                        </span>
                                        <span className="text-zinc-400 text-[11px] font-medium">{update.date}</span>
                                    </div>
                                    
                                    <h2 className="text-2xl font-bold text-zinc-900 tracking-tight leading-tight">
                                        {update.title}
                                    </h2>

                                    <div className="space-y-4 text-zinc-600 text-[15px] leading-relaxed">
                                        {update.description.map((p, i) => (
                                            <p key={i}>{p}</p>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Info */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-zinc-50 border border-zinc-100">
                                    {Object.entries(update.details).map(([key, value]) => (
                                        <div key={key} className="space-y-1">
                                            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{key}</h4>
                                            <p className="text-[13px] font-semibold text-zinc-800">{value}</p>
                                        </div>
                                    ))}
                                </div>

                                {update.highlights && (
                                    <div className="space-y-6">
                                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-tight border-b border-zinc-100 pb-2">
                                            {update.highlightsTitle}
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {update.highlights.map((item, i) => (
                                                <div key={i} className="flex items-start gap-3">
                                                    <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                                    <span className="text-zinc-600 text-[13px] font-medium leading-snug">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {update.table && (
                                    <div className="space-y-6">
                                        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-tight border-b border-zinc-100 pb-2">
                                            {update.highlightsTitle}
                                        </h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-[13px]">
                                                <thead>
                                                    <tr className="text-zinc-400 font-medium border-b border-zinc-100 italic">
                                                        {update.table.headers.map(h => (
                                                            <th key={h} className="py-3 pr-4 font-medium">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-zinc-50 text-zinc-600 font-medium">
                                                    {update.table.rows.map((row, i) => (
                                                        <tr key={i}>
                                                            <td className="py-4 pr-4">{row[0]}</td>
                                                            <td className="py-4 text-right text-zinc-900 font-semibold">
                                                                {row[1].includes(" | ") ? (
                                                                    <div className="flex items-center justify-end gap-2">
                                                                        <span className="line-through text-zinc-400">{row[1].split(" | ")[0]}</span>
                                                                        <span>{row[1].split(" | ")[1]}</span>
                                                                    </div>
                                                                ) : row[1]}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {update.footer && (
                                    <div className="pt-8 border-t border-zinc-100 space-y-6">
                                        <div className="flex flex-wrap gap-8">
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} className="text-zinc-400" />
                                                <span className="text-[13px] font-semibold text-zinc-700">{update.footer.contact}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Globe size={14} className="text-zinc-400" />
                                                <span className="text-[13px] font-semibold text-zinc-700">{update.footer.website}</span>
                                            </div>
                                        </div>
                                        
                                        {update.footer.applyLink && (
                                            <a 
                                                href={update.footer.applyLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-6 h-10 bg-[#003366] hover:bg-[#002244] text-white text-[11px] font-bold uppercase tracking-wider transition-all rounded-lg shadow-sm hover:shadow-md"
                                            >
                                                Apply Now <ExternalLink size={13} />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <footer className="mt-24 pt-8 border-t border-zinc-100">
                <p className="text-zinc-400 text-[11px] font-medium">
                    &copy; 2026 Redlix Servers. Internal notifications and announcements system.
                </p>
            </footer>
        </div>
    );
}
