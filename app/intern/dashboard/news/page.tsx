"use client";

import React from "react";
import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";

export default function NewsUpdatesPage() {
    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <header className="mb-6">
                <div className="flex items-center gap-2 text-zinc-400 font-medium text-[11px]">
                    <Newspaper size={12} />
                    <span>Portal updates</span>
                </div>
            </header>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border border-zinc-200 overflow-hidden"
            >
                <div className="flex flex-col lg:flex-row min-h-[600px]">
                    {/* Left Side: Poster */}
                    <div className="lg:w-2/5 border-b lg:border-b-0 lg:border-r border-zinc-100 bg-zinc-50 flex items-start justify-center p-6 lg:p-8">
                        <img 
                            src="https://ik.imagekit.io/dypkhqxip/Summer%20Bootcamp%20(2).png?updatedAt=1776542583323" 
                            alt="Summer Bootcamp 2026"
                            className="w-full h-auto sticky top-8 grayscale-[0.2] hover:grayscale-0 transition-all duration-500 shadow-sm"
                        />
                    </div>

                    {/* Right Side: Content */}
                    <div className="lg:w-3/5 p-6 md:p-12 space-y-12 overflow-y-auto">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
                                    Summer boot camp 2026 announcement
                                </h1>
                                <div className="space-y-4 text-zinc-500 text-[14.5px] font-medium leading-relaxed">
                                    <p>
                                        This notice announces the start of the 30-day "Summer Boot Camp 2026". 
                                        The program is designed to provide high-quality technical skills to students. 
                                        We focus on building industry-standard capabilities through practical training.
                                    </p>
                                    <p>
                                        Our curriculum is built to help you master modern technology. You will receive instruction 
                                        from seasoned professionals, engage in intensive lab sessions, and undergo weekly 
                                        evaluations to monitor your growth.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-[17px] font-semibold text-zinc-900 border-b border-zinc-100 pb-2">
                                2. Eligibility criteria
                            </h2>
                            <p className="text-zinc-500 text-[14px] font-medium leading-relaxed">
                                The program is open to all students across all recognized colleges and technical institutions. 
                                Candidates from any undergraduate year are eligible to attend the training:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    "First Year Students (All Branches)", 
                                    "Second Year Students (All Branches)", 
                                    "Third Year Students (All Branches)", 
                                    "Final Year / Graduating Students"
                                ].map((year) => (
                                    <div key={year} className="flex items-center gap-3 text-zinc-600 text-[13px] font-medium">
                                        <div className="h-1 w-1 bg-zinc-300 rounded-full" />
                                        {year}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-[17px] font-semibold text-zinc-900 border-b border-zinc-100 pb-2">
                                3. Important dates
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-[13px]">
                                    <thead>
                                        <tr className="text-zinc-400 font-medium border-b border-zinc-100 italic">
                                            <th className="py-3 pr-4 font-medium">Activity description</th>
                                            <th className="py-3 text-right font-medium">Schedule</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-50 text-zinc-600 font-medium">
                                        {[
                                            ["Online Registration Portal Starts", "April 20, 2026"],
                                            ["Portal Closure for New Requests", "May 05, 2026"],
                                            ["Training Operations Start", "May 10, 2026"],
                                            ["Final Assessment & Closure", "June 10, 2026"]
                                        ].map(([desc, date]) => (
                                            <tr key={desc}>
                                                <td className="py-4 pr-4">{desc}</td>
                                                <td className="py-4 text-right text-zinc-900 font-semibold">{date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-zinc-100 flex items-center justify-between">
                            <span className="text-[11px] text-zinc-400 italic font-medium">Effective: April 20, 2026</span>
                            <span className="text-[11px] text-zinc-300 font-medium">Status: Active</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <footer className="mt-12">
                <p className="text-zinc-300 text-[11px] font-medium">
                    &copy; 2026 Redlix Servers. Internal notification.
                </p>
            </footer>
        </div>
    );
}
