"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Star, Users, BookOpen, ChevronRight, Loader2, Globe } from "lucide-react";
import Navbar from "../components/home/Navbar";
import SubNavbar from "../components/home/SubNavbar";
import Footer from "../components/home/Footer";

interface CoursesListContentProps {
    initialCourses: any[];
}

export default function CoursesListContent({ initialCourses }: CoursesListContentProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCourses = initialCourses.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.instructorName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-blue-100">
            {/* Structured Data for Course List (ItemList) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ItemList",
                        "itemListElement": filteredCourses.map((course, index) => ({
                            "@type": "ListItem",
                            "position": index + 1,
                            "item": {
                                "@type": "Course",
                                "name": course.title,
                                "description": course.description,
                                "url": `https://studentforge.in/courses/${course.id}`,
                                "provider": {
                                    "@type": "Organization",
                                    "name": "Student Forge"
                                }
                            }
                        }))
                    })
                }}
            />

            <Navbar />
            <SubNavbar />

            <main className="w-full">
                <div className="bg-zinc-900 py-12 md:py-16 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-[50%] h-full bg-blue-600/10 blur-[100px] pointer-events-none" />
                    
                    <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                            <div className="max-w-2xl space-y-3">
                                <div className="inline-flex h-6 items-center px-3 border border-white/10 bg-white/5 text-blue-400 text-[10px] font-bold uppercase tracking-widest leading-none">
                                    Learning Portal
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6x font-normal tracking-tight text-white leading-[1.1]">
                                    Master <span className="text-violet-500">modern</span> <span className="text-emerald-500">skills</span> <br />
                                    with <span className="text-blue-500">Skill Grid</span> <span className="text-orange-400">experts</span>.
                                </h1>
                                <p className="text-[15px] md:text-[16px] text-zinc-400 leading-relaxed font-normal max-w-lg">
                                    Access industry-standard curriculum and build professional-grade projects in our specialized learning infrastructure.
                                </p>
                            </div>

                            <div className="relative w-full lg:w-96 group">
                                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" strokeWidth={1.5} />
                                <input 
                                    type="text" 
                                    placeholder="Search curriculum..." 
                                    className="h-10 w-full border border-white/10 bg-white/10 px-11 text-[13px] text-white outline-none transition-all focus:bg-white/15 focus:border-blue-500/50 placeholder:text-white/30 rounded-none shadow-2xl"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 md:py-24">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                        {filteredCourses.map((course) => (
                            <Link 
                                href={`/courses/${course.id}`} 
                                key={course.id}
                                className="group flex flex-col bg-white border border-zinc-200 transition-all duration-300 hover:border-zinc-900 active:scale-[0.99] rounded-none hover:shadow-2xl hover:shadow-zinc-500/5"
                            >
                                <div className="aspect-[16/9] relative bg-zinc-50 flex items-center justify-center overflow-hidden border-b border-zinc-100">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.98]" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-4 text-zinc-200">
                                            <BookOpen className="w-12 h-12" strokeWidth={1} />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Module Preview</span>
                                        </div>
                                    )}
                                    <div className="absolute top-0 right-0 p-4">
                                        <div className="bg-black/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
                                            {course.level || "Standard"}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-bold">
                                            <Star className="w-3.5 h-3.5 text-blue-500 fill-current" />
                                            <span className="text-zinc-900">{course.rating || "5.0"}</span>
                                        </div>
                                        <div className="h-3 w-[1px] bg-zinc-200" />
                                        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-bold">
                                            <Users className="w-3.5 h-3.5" />
                                            <span className="uppercase tracking-tight">Active Enrollment</span>
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-[20px] font-bold tracking-tighter text-zinc-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                                        {course.title}
                                    </h3>
                                    <p className="text-[14px] text-zinc-500 line-clamp-2 leading-relaxed mb-10 font-medium">
                                        {course.subtitle || course.description}
                                    </p>
                                    
                                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-zinc-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-zinc-900 text-white flex items-center justify-center text-[11px] font-bold rounded-none">
                                                {course.instructorName?.[0] || "I"}
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[12px] font-bold text-zinc-900 leading-none">{course.instructorName}</p>
                                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Expert Mentor</p>
                                            </div>
                                        </div>
                                        <div className="text-[18px] font-bold tracking-tight text-zinc-900">
                                            {course.price === "0" || !course.price ? "Free Access" : `₹${course.price}`}
                                        </div>
                                    </div>
                                </div>

                                <div className="h-12 w-full bg-zinc-50 border-t border-zinc-100 flex items-center justify-between px-8 text-[11px] font-bold uppercase tracking-widest text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-300">
                                    <span className="flex items-center gap-2">View Curriculum</span>
                                    <ChevronRight size={16} strokeWidth={2} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredCourses.length === 0 && (
                        <div className="h-96 border-2 border-dashed border-zinc-100 flex flex-col items-center justify-center gap-4 text-center p-10">
                            <Globe className="w-12 h-12 text-zinc-200" strokeWidth={1} />
                            <div className="max-w-xs space-y-2">
                                <p className="text-[18px] text-zinc-900 font-bold tracking-tight">No courses found</p>
                                <p className="text-[14px] text-zinc-400 font-medium">We couldn't find any courses matching your search criteria. Try a different keyword.</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
