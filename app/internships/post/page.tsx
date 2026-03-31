"use client";

import Navbar from "../../components/home/Navbar";
import SubNavbar from "../../components/home/SubNavbar";
import Footer from "../../components/home/Footer";
import { useState } from "react";
import { motion } from "framer-motion";

export default function PostInternshipPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    role: "Technical",
    company: "",
    location: "Remote",
    duration: "3 Months",
    stipend: "Competitive",
    applyLink: "",
    // Submitter Details
    submitterName: "",
    submitterCompany: "",
    submitterMobile: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/cleed/internships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData })
      });
      if (res.ok) {
        setSuccess(true);
        setFormData({ 
            title: "", description: "", role: "Technical", company: "", location: "Remote", duration: "3 Months", stipend: "Competitive", applyLink: "",
            submitterName: "", submitterCompany: "", submitterMobile: ""
        });
      }
    } catch (err) {
      console.error("Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100">
      <Navbar />
      <SubNavbar />
      
      <main className="py-20 bg-white">
        <div className="mx-auto max-w-xl px-6">
          <div className="mb-10 text-left">
            <h1 className="text-3xl font-semibold tracking-tight text-black">Post Internships</h1>
            <p className="text-zinc-500 text-[14px] font-medium mt-2">Register your professional opportunity</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 text-left">
            {/* Mission Details */}
            <div className="space-y-4">
               <h3 className="text-[12px] font-bold text-black uppercase tracking-widest border-b border-zinc-100 pb-2">1. Internship Details</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-zinc-500">Internship title</label>
                    <input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full h-12 bg-zinc-50 border border-zinc-100 px-4 text-[14px] font-medium outline-none focus:border-black" placeholder="e.g. Frontend Intern" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-zinc-500">Hiring company</label>
                    <input required value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full h-12 bg-zinc-50 border border-zinc-100 px-4 text-[14px] font-medium outline-none focus:border-black" placeholder="Organization name" />
                  </div>
               </div>

               <div className="space-y-1">
                  <label className="text-[12px] font-medium text-zinc-500">Professional role</label>
                  <input required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full h-12 bg-zinc-50 border border-zinc-100 px-4 text-[14px] font-medium outline-none focus:border-black" placeholder="Technical/Creative/Mgmt" />
               </div>

               <div className="space-y-1">
                  <label className="text-[12px] font-medium text-zinc-500">Mission description</label>
                  <textarea required rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 p-4 text-[14px] font-medium outline-none focus:border-black resize-none" placeholder="What will they achieve?" />
               </div>

               <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-zinc-500">Location</label>
                    <input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full h-12 bg-zinc-50 border border-zinc-100 px-4 text-[14px] font-medium outline-none focus:border-black" placeholder="Remote" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-zinc-500">Duration</label>
                    <input value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} className="w-full h-12 bg-zinc-50 border border-zinc-100 px-4 text-[14px] font-medium outline-none focus:border-black" placeholder="3 Months" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-zinc-500">Stipend</label>
                    <input value={formData.stipend} onChange={(e) => setFormData({...formData, stipend: e.target.value})} className="w-full h-12 bg-zinc-50 border border-zinc-100 px-4 text-[14px] font-medium outline-none focus:border-black" placeholder="Paid/Unpaid" />
                  </div>
               </div>

               <div className="space-y-1">
                  <label className="text-[12px] font-medium text-zinc-500">Application link (direct URL)</label>
                  <input required value={formData.applyLink} onChange={(e) => setFormData({...formData, applyLink: e.target.value})} className="w-full h-12 bg-zinc-50 border border-zinc-100 px-4 text-[14px] font-medium outline-none focus:border-black" placeholder="https://..." />
               </div>
            </div>

            {/* Submitter Details */}
            <div className="space-y-4 pt-4">
               <h3 className="text-[12px] font-bold text-black uppercase tracking-widest border-b border-zinc-100 pb-2">2. Submitter information</h3>
               <div className="space-y-1">
                  <label className="text-[12px] font-medium text-zinc-500">Your full name</label>
                  <input required value={formData.submitterName} onChange={(e) => setFormData({...formData, submitterName: e.target.value})} className="w-full h-12 bg-zinc-50 border border-zinc-100 px-4 text-[14px] font-medium outline-none focus:border-black" placeholder="Mission Pitcher Name" />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-zinc-500">Your current company</label>
                    <input required value={formData.submitterCompany} onChange={(e) => setFormData({...formData, submitterCompany: e.target.value})} className="w-full h-12 bg-zinc-50 border border-zinc-100 px-4 text-[14px] font-medium outline-none focus:border-black" placeholder="Where do you work?" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-zinc-500">Mobile number</label>
                    <input required value={formData.submitterMobile} onChange={(e) => setFormData({...formData, submitterMobile: e.target.value})} className="w-full h-12 bg-zinc-50 border border-zinc-100 px-4 text-[14px] font-medium outline-none focus:border-black" placeholder="+91 ..." />
                  </div>
               </div>
            </div>

            <button disabled={isSubmitting} className="w-full h-14 bg-black text-white text-[14px] font-semibold hover:bg-zinc-800 transition-all disabled:opacity-50">
              {isSubmitting ? "Submitting Mission..." : "Transmit for Cleed authorization"}
            </button>

            {success && (
              <p className="text-emerald-600 text-[12px] font-medium text-center animate-pulse">Mission transmitted successfully. Awaiting administrative review.</p>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
