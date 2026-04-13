"use client";

import Navbar from "../components/home/Navbar";
import SubNavbar from "../components/home/SubNavbar";
import Footer from "../components/home/Footer";
import { useState } from "react";
import {
  Calendar,
  Clock,
  CreditCard,
  Building,
  Target,
  Zap,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  QrCode
} from "lucide-react";

export default function BootcampPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    branch: "",
    year: "1st Year",
    phone: "",
    email: "",
    whyJoin: "",
    transactionId: ""
  });

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

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
        setStep(4);
      } else {
        const error = await res.json();
        alert(error.error || "Submission failed.");
      }
    } catch (err) {
      console.error("Submission failed.", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const courseFlow = [
    { week: "01", title: "Coding Basics", details: "Loops, logic, and problem solving." },
    { week: "02", title: "Core Skills", details: "Functions and data structures." },
    { week: "03", title: "Design & Web", details: "UI/UX and web development." },
    { week: "04", title: "Final Step", details: "Major project and interview prep." }
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-zinc-100/50">
      <Navbar />
      <SubNavbar />

      <main className="pb-20">
        {/* Natural Banner */}
        <div className="w-full border-b border-zinc-100 bg-white">
          <img
            src="/banner4.png"
            alt="Banner"
            className="w-full h-auto block rounded-none"
            loading="eager"
          />
        </div>

        {/* Header Section */}
        <section className="bg-white border-b border-zinc-50 py-10 sm:py-14">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col lg:flex-row gap-16 items-start">
              {/* Info Column */}
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600/80 text-[10px] font-bold uppercase tracking-tight">Practice-Led</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600/80 text-[10px] font-bold uppercase tracking-tight">Industry-Ready</span>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-600/80 text-[10px] font-bold uppercase tracking-tight">Limited Slots</span>
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-600/80 text-[10px] font-bold uppercase tracking-tight">MNC Exposure</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-medium tracking-tighter text-zinc-900 mb-4 leading-tight">Summer Boot Camp 2026</h1>
                <p className="text-[16px] text-zinc-500 font-normal leading-relaxed mb-6 max-w-lg">
                  30-day intensive skill program. Real-world architecting. Strategic MNC interaction. Direct career alignment. No complex theory.
                </p>

                <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-10 text-[13px]">
                  <div className="space-y-1">
                    <p className="text-zinc-400 font-medium">Mode</p>
                    <p className="text-black">Hybrid (Online + 1 Day Visit)</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-zinc-400 font-medium">Batch Size</p>
                    <p className="text-emerald-600/70">50 Seats Only</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 pt-6 border-t border-zinc-50">
                  <div className="flex items-center gap-2 text-[12px] text-zinc-800">
                    <Calendar className="w-3.5 h-3.5 text-blue-500/50" /> Start: May 10
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-zinc-800">
                    <Clock className="w-3.5 h-3.5 text-blue-500/50" /> Duration: 30 Days
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-zinc-800">
                    <CreditCard className="w-3.5 h-3.5 text-blue-500/50" /> Fee: ₹599
                  </div>
                </div>
              </div>

              {/* Multi-Step Form Card */}
              <div className="flex-shrink-0 w-full lg:w-[400px]">
                <div className="p-8 border border-zinc-100 rounded-none bg-white shadow-xl shadow-zinc-100/50 min-h-[460px] flex flex-col">
                  {step === 4 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      </div>
                      <h2 className="text-xl font-medium text-zinc-900">Success</h2>
                      <p className="text-zinc-400 text-[13px] mt-2">Registration confirmed. Check email for details.</p>
                      <button onClick={() => setStep(1)} className="mt-8 text-[12px] font-medium text-blue-600/70 hover:underline">New Registration</button>
                    </div>
                  ) : (
                    <>
                      <div className="mb-8">
                        <div className="flex items-center gap-2 text-zinc-400 text-[11px] font-medium mb-1">
                          Step {step} of 3
                        </div>
                        <h2 className="text-xl font-medium text-black tracking-tight">
                          {step === 1 && "Basic Information"}
                          {step === 2 && "Payment via QR"}
                          {step === 3 && "Confirm Payment"}
                        </h2>
                      </div>

                      <div className="flex-1">
                        {step === 1 && (
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-medium text-zinc-400 px-1">Your Name</label>
                              <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full h-10 bg-zinc-50 border border-zinc-100 px-4 text-[13px] outline-none focus:border-zinc-300 transition-all" placeholder="Enter name" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-medium text-zinc-400 px-1">College</label>
                                <input required value={formData.college} onChange={(e) => setFormData({ ...formData, college: e.target.value })} className="w-full h-10 bg-zinc-50 border border-zinc-100 px-4 text-[13px] outline-none focus:border-zinc-300 transition-all" placeholder="Institution" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-medium text-zinc-400 px-1">Branch</label>
                                <input required value={formData.branch} onChange={(e) => setFormData({ ...formData, branch: e.target.value })} className="w-full h-10 bg-zinc-50 border border-zinc-100 px-4 text-[13px] outline-none focus:border-zinc-300 transition-all" placeholder="Major" />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[10px] font-medium text-zinc-400 px-1">Phone</label>
                                <input required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full h-10 bg-zinc-50 border border-zinc-100 px-4 text-[13px] outline-none focus:border-zinc-300 transition-all" placeholder="Phone number" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-medium text-zinc-400 px-1">Year</label>
                                <select value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="w-full h-10 bg-zinc-50 border border-zinc-100 px-3 text-[13px] outline-none appearance-none">
                                  <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option>
                                </select>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-medium text-zinc-400 px-1">Email</label>
                              <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full h-10 bg-zinc-50 border border-zinc-100 px-4 text-[13px] outline-none focus:border-zinc-300 transition-all" placeholder="Enter email" />
                            </div>
                            <button onClick={nextStep} disabled={!formData.name || !formData.email} className="w-full h-11 bg-black text-white text-[13px] font-medium mt-4 hover:bg-zinc-800 disabled:opacity-50">Next: Pay Fee</button>
                          </div>
                        )}

                        {step === 2 && (
                          <div className="space-y-6 text-center">
                            <div className="p-4 border border-zinc-100 bg-white inline-block">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent("upi://pay?pa=6302933597@hdfc&pn=StudentForge&am=599&cu=INR")}`}
                                alt="Payment QR"
                                className="w-48 h-48 block"
                              />
                            </div>
                            <div className="space-y-1">
                              <p className="text-[16px] font-medium text-black tracking-tight">Amount: ₹599</p>
                              <p className="text-zinc-500 text-[12px]">Scan this QR to pay directly</p>
                            </div>
                            <div className="flex gap-3 mt-8">
                              <button onClick={prevStep} className="flex-1 h-11 border border-zinc-100 text-[13px] font-medium hover:bg-zinc-50">Back</button>
                              <button onClick={nextStep} className="flex-1 h-11 bg-black text-white text-[13px] font-medium hover:bg-zinc-800">I have paid</button>
                            </div>
                          </div>
                        )}

                        {step === 3 && (
                          <div className="space-y-6">
                            <div className="p-4 bg-zinc-50 border border-zinc-100">
                              <p className="text-[12px] text-zinc-500 leading-relaxed font-normal">
                                Enter the Transaction ID / UTR number from your payment app to confirm your enrollment.
                              </p>
                            </div>
                            <div className="space-y-1.5 px-1">
                              <label className="text-[10px] font-medium text-zinc-400">Transaction ID</label>
                              <input
                                required
                                value={formData.transactionId}
                                onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                                className="w-full h-11 bg-zinc-50 border border-zinc-100 px-4 text-[13px] outline-none focus:border-zinc-300 transition-all font-sans"
                                placeholder="UTR / Txn ID"
                              />
                            </div>
                            <div className="flex gap-3 mt-8">
                              <button onClick={prevStep} className="flex-1 h-11 border border-zinc-100 text-[13px] font-medium hover:bg-zinc-50">Back</button>
                              <button onClick={handleSubmit} disabled={isSubmitting || !formData.transactionId} className="flex-1 h-11 bg-black text-white text-[13px] font-medium hover:bg-zinc-800 disabled:opacity-50">
                                {isSubmitting ? "Sanding..." : "Confirm & Join"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Full Program Manifesto */}
        <div className="mx-auto max-w-6xl px-6 pt-20 space-y-24">
          
          {/* Section: Courses & Objectives */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <section className="space-y-12">
              <div>
                <h3 className="text-[11px] font-bold text-zinc-900 uppercase tracking-[0.2em] mb-6 italic border-b border-zinc-100 pb-2 inline-block">Courses Offered</h3>
                <div className="grid grid-cols-1 gap-2">
                  {["Full Stack Development", "UI/UX Design", "Programming and Problem Solving"].map((c, i) => (
                    <div key={i} className="px-5 py-4 bg-zinc-50 border border-zinc-100 text-[14px] font-bold text-zinc-800 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-500" /> {c}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-bold text-zinc-900 uppercase tracking-[0.2em] mb-6 italic border-b border-zinc-100 pb-2 inline-block">Objectives</h3>
                <div className="space-y-4">
                  {[
                    { t: "Education", d: "Affordable and accessible technical education." },
                    { t: "Skills", d: "Build job-ready skills through practical training." },
                    { t: "Projects", d: "Real-time project development experience." },
                    { t: "Exposure", d: "Industry exposure through an MNC visit." }
                  ].map((obj, i) => (
                    <div key={i} className="flex gap-4">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                      <div>
                        <p className="text-[14px] font-bold text-black leading-none">{obj.t}</p>
                        <p className="text-[12px] text-zinc-500 mt-1.5 font-medium">{obj.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-12">
               <div>
                <h3 className="text-[11px] font-bold text-zinc-900 uppercase tracking-[0.2em] mb-6 italic border-b border-zinc-100 pb-2 inline-block">Program Structure</h3>
                <div className="bg-zinc-900 p-8 text-white space-y-8">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="text-[12px] font-bold uppercase tracking-widest text-zinc-500">Total Duration</span>
                    <span className="text-xl font-bold">30 Days</span>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Weekly Cycle (4-2-1)</p>
                    <div className="grid gap-2">
                      <div className="flex justify-between items-center text-[13px]"><span className="text-zinc-400">Trainer-led sessions</span><span className="font-bold">4 Days</span></div>
                      <div className="flex justify-between items-center text-[13px]"><span className="text-zinc-400">Practice and assignments</span><span className="font-bold">2 Days</span></div>
                      <div className="flex justify-between items-center text-[13px]"><span className="text-zinc-400">Test and evaluation</span><span className="font-bold">1 Day</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-bold text-zinc-900 uppercase tracking-[0.2em] mb-6 italic border-b border-zinc-100 pb-2 inline-block">MNC Visit Details</h3>
                <div className="p-6 bg-blue-50/30 border border-blue-100 space-y-4">
                  <div className="flex items-center gap-2 text-[12px] font-bold text-blue-800">
                    <Building className="w-4 h-4" /> 1-Day Physical Interaction
                  </div>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-zinc-600 font-medium italic">
                    <li>• Company introduction</li>
                    <li>• Workplace exposure</li>
                    <li>• Expert interaction</li>
                    <li>• Professional Q&A</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Section: Course Flow Timeline */}
          <section>
            <h3 className="text-[11px] font-bold text-zinc-900 uppercase tracking-[0.2em] mb-8 italic border-b border-zinc-100 pb-2 inline-block">Course Flow</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { wk: "01", t: "Basics", d: "Fundamentals, logic building, loops, conditions and basic exercises.", c: "bg-amber-50" },
                { wk: "02", t: "Core Skills", d: "Functions, arrays, problem-solving techniques and mini tasks.", c: "bg-sky-50" },
                { wk: "03", t: "Practical", d: "Web development, UI/UX principles and mini project dev.", c: "bg-indigo-50" },
                { wk: "04", t: "Final Phase", d: "Project completion, resume building and final examination.", c: "bg-rose-50" }
              ].map((step, i) => (
                <div key={i} className={`p-6 border border-zinc-100 ${step.c} space-y-4 flex flex-col justify-between`}>
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 italic">Week {step.wk}</span>
                    <p className="text-[15px] font-bold text-black border-l-2 border-black/10 pl-3 leading-none uppercase tracking-tight">{step.t}</p>
                    <p className="text-[11px] text-zinc-600 font-medium leading-relaxed">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Process Flow & Criteria */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <h3 className="text-[11px] font-bold text-zinc-900 uppercase tracking-[0.2em] mb-8 italic border-b border-zinc-100 pb-2 inline-block">Program Process Flow</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Student Registration", "Enrollment & Fee (₹599)", "Training Kick-off", "Weekly Tests & Tasks", "MNC Exposure Visit", "Project Submission", "Final Examination", "Evaluation & Certification"
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white border border-zinc-100 p-4">
                    <span className="text-[11px] font-mono font-bold text-zinc-300">0{i+1}</span>
                    <span className="text-[12px] font-bold text-zinc-800">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[11px] font-bold text-zinc-900 uppercase tracking-[0.2em] mb-8 italic border-b border-zinc-100 pb-2 inline-block">Certification Criteria</h3>
              <div className="space-y-4 p-8 border border-zinc-100 bg-zinc-50/50">
                {[
                  { l: "Attendance", v: "Min 75% required" },
                  { l: "Project", v: "Successful submission" },
                  { l: "Final Exam", v: "Minimum pass marks" }
                ].map((c, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{c.l}</p>
                    <p className="text-[13px] text-zinc-900 font-bold">{c.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Benefits & Registration Footer */}
          <section className="bg-zinc-50 border border-zinc-100 p-10 flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 space-y-6">
              <h3 className="text-2xl font-bold tracking-tighter text-black leading-none">Registration Information</h3>
              <div className="grid grid-cols-2 gap-6 text-[13px]">
                <div className="space-y-1"><p className="text-zinc-400 font-medium">Registration Starts</p><p className="font-bold">April 20</p></div>
                <div className="space-y-1"><p className="text-zinc-400 font-medium">Registration Ends</p><p className="font-bold">May 05</p></div>
              </div>
              <div className="p-4 bg-emerald-50 text-emerald-700 text-[12px] font-bold border border-emerald-100 inline-block">
                Limited seats available. Secure your slot now.
              </div>
            </div>

            <div className="w-full lg:w-1/2 space-y-8">
              <h3 className="text-[11px] font-bold text-zinc-900 uppercase tracking-widest italic border-b border-zinc-100 pb-2 inline-block">Benefits</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-10">
                {["Real-time project experience", "MNC Industry Exposure", "Career guidance loop", "Professional Certification"].map((b, i) => (
                  <div key={i} className="flex items-center gap-3 text-[13px] font-bold text-zinc-700">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> {b}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
