"use client";

import Navbar from "../components/home/Navbar";
import SubNavbar from "../components/home/SubNavbar";
import Footer from "../components/home/Footer";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, Clock, Trophy, BookOpen, Rocket, ArrowRight, Sparkles, Code, Cpu, Target } from "lucide-react";

export default function BootcampPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    branch: "",
    year: "3rd Year",
    phone: "",
    email: "",
    whyJoin: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bootcamp/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSuccess(true);
        setFormData({
          name: "",
          college: "",
          branch: "",
          year: "3rd Year",
          phone: "",
          email: "",
          whyJoin: ""
        });
      } else {
        const error = await res.json();
        alert(error.error || "Form submission failed.");
      }
    } catch (err) {
      console.error("Submission failed.", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const details = [
    {
      icon: <Calendar className="w-5 h-5 text-zinc-600" />,
      title: "Duration",
      desc: "8 weeks intensive program (June - July 2026)"
    },
    {
      icon: <Clock className="w-5 h-5 text-zinc-600" />,
      title: "Format",
      desc: "Live sessions and hybrid projects"
    },
    {
      icon: <BookOpen className="w-5 h-5 text-zinc-600" />,
      title: "Curriculum",
      desc: "Full-stack, AI integration, and DevOps"
    },
    {
      icon: <Trophy className="w-5 h-5 text-zinc-600" />,
      title: "Outcome",
      desc: "Certification and internship interviews"
    }
  ];

  const curriculum = [
    { 
      week: "01-02", 
      topic: "Frontend Development", 
      details: "Building modern interfaces with Next.js and Design Systems.",
      icon: <Code className="w-4 h-4 text-zinc-400" />
    },
    { 
      week: "03-04", 
      topic: "Backend Systems", 
      details: "Node.js, Prisma ORM, and database patterns.",
      icon: <Cpu className="w-4 h-4 text-zinc-400" />
    },
    { 
      week: "05-06", 
      topic: "AI Integration", 
      details: "Implementing LLMs and vector search in applications.",
      icon: <Sparkles className="w-4 h-4 text-zinc-400" />
    },
    { 
      week: "07-08", 
      topic: "Deployment", 
      details: "Docker containerization and CI/CD pipelines.",
      icon: <Target className="w-4 h-4 text-zinc-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-zinc-100">
      <Navbar />
      <SubNavbar />

      <main className="pb-24">
        {/* Header Section */}
        <section className="bg-zinc-50 border-b border-zinc-100 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 text-zinc-500 text-[13px] font-medium mb-4">
                <Rocket className="w-4 h-4" />
                Applications are now open for 2026
              </div>
              <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-black mb-6">
                Summer Internship Bootcamp
              </h1>
              <p className="text-lg text-zinc-500 font-normal leading-relaxed">
                A professional engineering program designed to bridge the gap between academic learning and industry standards. Master the art of building scalable, AI-driven digital systems.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Bootcamp Details */}
            <div className="lg:col-span-7 space-y-16">
              <section>
                <h3 className="text-[13px] font-medium text-zinc-400 border-b border-zinc-100 pb-3 mb-8">Program Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {details.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-zinc-50 rounded-lg flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-[15px] font-medium text-black">{item.title}</h4>
                        <p className="text-[14px] text-zinc-500 font-normal mt-1 leading-snug">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-[13px] font-medium text-zinc-400 border-b border-zinc-100 pb-3 mb-8">Technical Roadmap</h3>
                <div className="space-y-3">
                  {curriculum.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 p-6 bg-white border border-zinc-100 hover:border-zinc-200 transition-colors">
                      <div className="text-[12px] font-medium text-zinc-400 w-16">
                        Week {item.week}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[16px] font-medium text-black">{item.topic}</h4>
                        <p className="text-[14px] text-zinc-500 font-normal mt-1">{item.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="p-8 bg-zinc-900 rounded-2xl text-white">
                  <h3 className="text-xl font-medium mb-6">Program Benefits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Mentorship from project leads", 
                      "Real-time code reviews", 
                      "Industry toolkit access", 
                      "Paid internship track",
                      "Developer community access",
                      "Verified certifications"
                    ].map((perk, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-[14px] font-normal text-zinc-300">{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Registration Form */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-24">
                <div className="p-8 border border-zinc-200 rounded-2xl bg-white shadow-sm">
                  <div className="mb-10">
                    <h2 className="text-2xl font-medium text-black tracking-tight">Registration</h2>
                    <p className="text-zinc-500 text-[14px] font-normal mt-2">
                      Please provide your details below to start the application process.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[13px] font-medium text-zinc-500">Full name</label>
                      <input 
                        required 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        className="w-full h-12 bg-zinc-50 border border-zinc-100 rounded-xl px-4 text-[14px] font-normal outline-none focus:border-zinc-300 focus:bg-white transition-all shadow-sm" 
                        placeholder="Your name" 
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[13px] font-medium text-zinc-500">College name</label>
                        <input 
                          required 
                          value={formData.college} 
                          onChange={(e) => setFormData({...formData, college: e.target.value})} 
                          className="w-full h-12 bg-zinc-50 border border-zinc-100 rounded-xl px-4 text-[14px] font-normal outline-none focus:border-zinc-300 focus:bg-white transition-all shadow-sm" 
                          placeholder="Your college" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[13px] font-medium text-zinc-500">Branch</label>
                        <input 
                          required 
                          value={formData.branch} 
                          onChange={(e) => setFormData({...formData, branch: e.target.value})} 
                          className="w-full h-12 bg-zinc-50 border border-zinc-100 rounded-xl px-4 text-[14px] font-normal outline-none focus:border-zinc-300 focus:bg-white transition-all shadow-sm" 
                          placeholder="e.g. CSE" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[13px] font-medium text-zinc-500">Year of study</label>
                      <select 
                        value={formData.year} 
                        onChange={(e) => setFormData({...formData, year: e.target.value})} 
                        className="w-full h-12 bg-zinc-50 border border-zinc-100 rounded-xl px-4 text-[14px] font-normal outline-none focus:border-zinc-300 focus:bg-white transition-all shadow-sm appearance-none"
                      >
                        <option>1st Year</option>
                        <option>2nd Year</option>
                        <option>3rd Year</option>
                        <option>4th Year</option>
                        <option>Graduate</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[13px] font-medium text-zinc-500">Phone number</label>
                        <input 
                          required 
                          type="tel"
                          value={formData.phone} 
                          onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                          className="w-full h-12 bg-zinc-50 border border-zinc-100 rounded-xl px-4 text-[14px] font-normal outline-none focus:border-zinc-300 focus:bg-white transition-all shadow-sm" 
                          placeholder="+91" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[13px] font-medium text-zinc-500">Email address</label>
                        <input 
                          required 
                          type="email"
                          value={formData.email} 
                          onChange={(e) => setFormData({...formData, email: e.target.value})} 
                          className="w-full h-12 bg-zinc-50 border border-zinc-100 rounded-xl px-4 text-[14px] font-normal outline-none focus:border-zinc-300 focus:bg-white transition-all shadow-sm" 
                          placeholder="name@example.com" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[13px] font-medium text-zinc-500">Why join this bootcamp? (Optional)</label>
                      <textarea 
                        rows={3} 
                        value={formData.whyJoin} 
                        onChange={(e) => setFormData({...formData, whyJoin: e.target.value})} 
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-4 text-[14px] font-normal outline-none focus:border-zinc-300 focus:bg-white resize-none transition-all shadow-sm" 
                        placeholder="Tell us about your goals" 
                      />
                    </div>

                    <button 
                      disabled={isSubmitting || success} 
                      className="w-full h-12 bg-black text-white text-[14px] font-medium rounded-xl hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Submitting..." : success ? "Registration received" : "Register for bootcamp"}
                    </button>

                    {success && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-zinc-50 border border-zinc-100 rounded-xl text-center"
                      >
                        <p className="text-black text-[14px] font-medium">Successfully registered.</p>
                        <p className="text-zinc-500 text-[12px] mt-1 font-normal">We will contact you via email shortly.</p>
                      </motion.div>
                    )}
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
