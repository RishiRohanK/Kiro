"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Users, ChevronRight, BookOpen, Loader2 } from "lucide-react";

export default function Resources() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [mounted, setMounted] = useState(false);
 
  useEffect(() => {
    setMounted(true);
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (data.success) {
          setCourses(data.courses.slice(0, 4));
        } else {
          console.warn("API returned failure:", data.error);
        }
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Internal assets if no courses are in database
  const fallbackCards = [
    {
      id: "c1",
      title: "Core Engineering",
      subtitle: "Industry-standard engineering tracks designed for students.",
      href: "/courses",
      image: "https://ik.imagekit.io/dypkhqxip/Course%20app-rafiki.svg",
      tag: "Academy",
      rating: "5.0",
      enrolledCount: 1200,
      instructorName: "Staff"
    },
    {
      id: "c2",
      title: "Career Guidance",
      subtitle: "Global pathways for higher education and career development.",
      href: "/contact",
      image: "https://ik.imagekit.io/dypkhqxip/Study%20abroad-rafiki.svg",
      tag: "Support",
      rating: 4.9,
      enrolledCount: 840,
      instructorName: "Mentor"
    },
    {
      id: "c3",
      title: "Internship Track",
      subtitle: "Practical experience within our corporate ecosystem.",
      href: "/intern-form",
      image: "https://ik.imagekit.io/dypkhqxip/Job%20hunt-rafiki.svg",
      tag: "Professional",
      rating: 5.0,
      enrolledCount: 450,
      instructorName: "Staff"
    },
    {
      id: "c4",
      title: "Startup Lifecycle",
      subtitle: "Strategic network of mentors, startups, and innovation.",
      href: "/ecosystem",
      image: "https://ik.imagekit.io/dypkhqxip/Startup%20life-rafiki.svg",
      tag: "Ecosystem",
      rating: 4.8,
      enrolledCount: 120,
      instructorName: "Founder"
    }
  ];

  const displayCards = courses.length > 0 ? courses : fallbackCards;

  return (
    <section className="relative overflow-hidden py-24 bg-zinc-50" id="resources">
      {/* Subtle Grid Pattern for Technical Feel */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[1px] w-6 bg-blue-600" />
              <span className="text-[13px] font-semibold text-blue-600 uppercase tracking-widest">
                Academic Modules
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-zinc-900 leading-[1.1]">
              Explore Learning <span className="text-blue-600">Assets</span>.
            </h2>
          </div>
          <div className="flex flex-col items-start gap-4">
            <p className="max-w-xs text-[14px] leading-relaxed text-zinc-500 font-normal">
              Structured modules designed for modern engineering students. 
              Self-paced, industry-aligned, and certified.
            </p>
            <Link 
              href="/courses" 
              className="group inline-flex items-center gap-3 h-10 bg-black px-6 text-[12px] font-bold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] rounded-none shadow-sm"
            >
              Browse all modules <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex h-96 items-center justify-center">
             <Loader2 size={30} className="text-blue-200 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {displayCards.map((card, index) => (
              <motion.div
                key={card.id || index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <Link 
                    href={card.href || `/courses/${card.id}`} 
                    className="group flex flex-col sm:flex-row bg-white border border-zinc-200 h-full transition-all duration-300 hover:border-blue-600 hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] active:scale-[0.99] relative overflow-hidden"
                >
                    {/* Image Area - Module Preview */}
                    <div className="w-full sm:w-48 lg:w-52 shrink-0 relative bg-zinc-50 flex items-center justify-center overflow-hidden border-b sm:border-b-0 sm:border-r border-zinc-100">
                        {card.thumbnail || card.image ? (
                           <img 
                              src={card.thumbnail || card.image} 
                              alt={card.title} 
                              className="w-[70%] h-auto object-contain p-2 group-hover:scale-[1.1] transition-transform duration-700 ease-out grayscale group-hover:grayscale-0" 
                           />
                        ) : (
                           <BookOpen className="w-8 h-8 text-zinc-200" />
                        )}
                        
                        {/* Module Indicator */}
                        <div className="absolute top-0 left-0 bg-blue-600 px-3 py-1 text-[9px] font-black text-white uppercase tracking-tighter">
                            Mod. {index + 1 < 10 ? `0${index + 1}` : index + 1}
                        </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-1.5 px-1.5 py-0.5 bg-blue-50/50 rounded-sm">
                                <Star className="w-2.5 h-2.5 text-blue-600 fill-current" />
                                <span className="text-blue-700 text-[10px] font-bold">{card.rating || "5.0"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-zinc-400 text-[9px] font-medium tracking-tight">
                                <Users className="w-3 h-3" />
                                <span>{card.enrolledCount || 0}+ Members</span>
                            </div>
                        </div>
                        
                        <h3 className="text-[15px] font-bold tracking-tight text-zinc-900 group-hover:text-blue-600 transition-colors mb-1 leading-tight">
                            {card.title}
                        </h3>
                        <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed mb-5 flex-1">
                            {card.subtitle || card.description}
                        </p>
                        
                        {/* Instructor & Price */}
                        <div className="mt-auto flex items-center justify-between pt-3 border-t border-zinc-100">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-zinc-50 border border-zinc-100 flex items-center justify-center text-[9px] font-bold text-zinc-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    {card.instructorName?.[0] || "SF"}
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-[9px] font-bold text-zinc-900 leading-none">{card.instructorName || "Staff"}</p>
                                    <p className="text-[7px] text-zinc-400 font-bold uppercase mt-0.5">Mentor</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="text-[11px] font-extrabold text-blue-600 tracking-tight">
                                    {card.price === "0" || !card.price ? (
                                        <span className="text-blue-600 px-1 py-0.5">Free</span>
                                    ) : (
                                        `₹${card.price}`
                                    )}
                                </div>
                                <span className="text-[7px] text-zinc-300 font-bold uppercase tracking-widest">Enroll now</span>
                            </div>
                        </div>
                    </div>

                    {/* Left Accent Bar */}
                    <div className="absolute inset-y-0 left-0 w-[3px] bg-blue-600 scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-500" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}