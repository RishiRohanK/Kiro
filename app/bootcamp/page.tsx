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

  return (
    <div className="min-h-screen bg-[#F4F4F4] font-sans text-[#212529] selection:bg-blue-100">
      <Navbar />
      <SubNavbar />

      <main className="w-full bg-[#F0F2F5] min-h-screen py-1">
        {/* Banner Section */}
        <div className="w-full bg-white border-b border-zinc-200">
          <div className="w-full max-w-[1400px] mx-auto p-0.5">
            <img
              src="/banner4.png"
              alt="Official Portal Banner"
              className="w-full h-auto block"
              loading="eager"
            />
          </div>
        </div>

        <div className="w-full max-w-[1400px] mx-auto bg-white shadow-sm my-1 border border-zinc-200">
          {/* Public Notice Header */}
          <div className="border-b-2 border-[#002147] pb-6 mb-6 text-center pt-8 px-6">
            <h1 className="text-xl sm:text-2xl font-semibold text-[#002147] mb-2">Summer Boot Camp 2026 - Training Notification</h1>
            <div className="inline-block px-3 py-0.5 bg-[#002147] text-white text-[11px] font-medium mb-3">Official Release</div>
            <p className="text-[13px] sm:text-[14px] font-medium text-zinc-500">Platform An initiative by Student Forge</p>
          </div>

          <div className="px-6 sm:px-10 lg:px-12 pb-12">
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              {/* Main Information Block */}
              <div className="flex-1 space-y-10 w-full">

                {/* Section 1: Summary */}
                <section>
                  <div className="bg-[#F8F9FA] px-4 py-2 border-l-4 border-[#002147] mb-4 shadow-sm">
                    <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#002147]">1. Program Notification</h2>
                  </div>
                  <div className="space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-zinc-800 font-normal">
                    <p>
                      This notice announces the start of the 30-day "Summer Boot Camp 2026". The program is designed to provide high-quality technical skills to students. We focus on building industry-standard capabilities through practical training.
                    </p>
                    <p>
                      Our curriculum is built to help you master modern technology. You will receive instruction from seasoned professionals, engage in intensive lab sessions, and undergo weekly evaluations to monitor your growth.
                    </p>
                  </div>
                </section>

                {/* Section 2: Eligibility Criteria */}
                <section>
                  <div className="bg-[#F8F9FA] px-4 py-2 border-l-4 border-[#002147] mb-4 shadow-sm">
                    <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#002147]">2. Eligibility Criteria</h2>
                  </div>
                  <div className="space-y-4 text-[14px] sm:text-[15px] leading-relaxed text-zinc-800 font-normal">
                    <p>
                      The program is open to all students across all recognized colleges and technical institutions. Candidates from any undergraduate year are eligible to attend the training:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 font-medium text-zinc-700">
                      <li>First Year Students (All Branches)</li>
                      <li>Second Year Students (All Branches)</li>
                      <li>Third Year Students (All Branches)</li>
                      <li>Final Year / Graduating Students</li>
                    </ul>
                  </div>
                </section>

                {/* Section 3: Important Dates */}
                <section>
                  <div className="bg-[#F8F9FA] px-4 py-2 border-l-4 border-[#002147] mb-4 shadow-sm">
                    <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#002147]">3. Important Dates</h2>
                  </div>
                  <div className="overflow-x-auto border border-zinc-200">
                    <table className="w-full text-left text-[14px] min-w-[450px]">
                      <thead className="bg-[#F8F9FA] border-b border-zinc-200">
                        <tr>
                          <th className="px-5 py-3 font-semibold border-r border-zinc-200 text-[#002147]">Activity Description</th>
                          <th className="px-5 py-3 font-semibold text-[#002147]">Schedule</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200">
                        <tr>
                          <td className="px-5 py-3 bg-[#F8F9FA] border-r border-zinc-200 w-1/2 italic text-zinc-600">Online Registration Portal Starts</td>
                          <td className="px-5 py-3 font-medium">April 20, 2026</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-3 bg-[#F8F9FA] border-r border-zinc-200 italic text-zinc-600">Portal Closure for New Requests</td>
                          <td className="px-5 py-3 font-medium">May 05, 2026</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-3 bg-[#F8F9FA] border-r border-zinc-200 italic text-zinc-600 text-blue-900 font-medium">Training Operations Start</td>
                          <td className="px-5 py-3 text-[#002147] font-semibold">May 10, 2026</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-3 bg-[#F8F9FA] border-r border-zinc-200 italic text-zinc-600">Final Assessment & Closure</td>
                          <td className="px-5 py-3 font-medium">June 10, 2026</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Section 4: Comprehensive Syllabus (Full Stack Track) */}
                <section>
                  <div className="bg-[#F8F9FA] px-4 py-2 border-l-4 border-[#002147] mb-6 shadow-sm">
                    <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#002147]">4. Comprehensive Syllabus (Full Stack Track)</h2>
                  </div>

                  <div className="space-y-10">
                    {/* Week 1: Fundamentals */}
                    <div className="space-y-4">
                      <div className="bg-[#002147] text-white px-4 py-1.5 text-[12px] font-medium">Week 1: Web Fundamentals & UI Design Foundations</div>
                      <div className="overflow-x-auto border border-zinc-200">
                        <table className="w-full text-left text-[13px] min-w-[550px]">
                          <thead className="bg-[#F8F9FA] border-b border-zinc-200 text-[#002147]">
                            <tr>
                              <th className="px-4 py-2 font-semibold border-r border-zinc-200">Ref</th>
                              <th className="px-4 py-2 font-semibold border-r border-zinc-200">Lesson Name</th>
                              <th className="px-4 py-2 font-semibold border-r border-zinc-200">Level</th>
                              <th className="px-4 py-2 font-semibold text-center">T-Time</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-200">
                            <tr><td className="px-4 py-2 border-r">M-01</td><td className="px-4 py-2 border-r">Introduction to Web Development</td><td className="px-4 py-2 border-r">Beginner</td><td className="px-4 py-2 text-center">10m</td></tr>
                            <tr><td className="px-4 py-2 border-r">M-01</td><td className="px-4 py-2 border-r">How the Web Works (Browser, Server, HTTP)</td><td className="px-4 py-2 border-r">Beginner</td><td className="px-4 py-2 text-center">15m</td></tr>
                            <tr><td className="px-4 py-2 border-r">M-01</td><td className="px-4 py-2 border-r">HTML5 Fundamentals</td><td className="px-4 py-2 border-r">Beginner</td><td className="px-4 py-2 text-center">25m</td></tr>
                            <tr><td className="px-4 py-2 border-r">M-01</td><td className="px-4 py-2 border-r">CSS3 Basics (Flexbox and Grid)</td><td className="px-4 py-2 border-r">Beginner</td><td className="px-4 py-2 text-center">30m</td></tr>
                            <tr><td className="px-4 py-2 border-r">M-01</td><td className="px-4 py-2 border-r">Responsive Design Principles</td><td className="px-4 py-2 border-r">Beginner</td><td className="px-4 py-2 text-center">20m</td></tr>
                            <tr><td className="px-4 py-2 border-r">M-01</td><td className="px-4 py-2 border-r">UI vs UX Fundamentals</td><td className="px-4 py-2 border-r">Beginner</td><td className="px-4 py-2 text-center">15m</td></tr>
                            <tr><td className="px-4 py-2 border-r">M-01</td><td className="px-4 py-2 border-r">Introduction to Figma (Wireframing)</td><td className="px-4 py-2 border-r">Beginner</td><td className="px-4 py-2 text-center">20m</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Week 1 & 2 */}
                    <div className="space-y-4">
                      <div className="bg-[#002147] text-white px-4 py-1.5 text-[12px] font-medium">Week 2: Frontend Engineering & UI/UX</div>
                      <div className="overflow-x-auto border border-zinc-200">
                        <table className="w-full text-left text-[13px] min-w-[550px]">
                          <thead className="bg-[#F8F9FA] border-b border-zinc-200 text-[#002147]">
                            <tr>
                              <th className="px-4 py-2 font-semibold border-r border-zinc-200">Ref</th>
                              <th className="px-4 py-2 font-semibold border-r border-zinc-200">Lesson Name</th>
                              <th className="px-4 py-2 font-semibold border-r border-zinc-200">Level</th>
                              <th className="px-4 py-2 font-semibold text-center">T-Time</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-200">
                            <tr><td className="px-4 py-2 border-r">M-02</td><td className="px-4 py-2 border-r">JavaScript ES6 Essentials</td><td className="px-4 py-2 border-r">Beginner</td><td className="px-4 py-2 text-center">30m</td></tr>
                            <tr><td className="px-4 py-2 border-r">M-02</td><td className="px-4 py-2 border-r">React Introduction and Setup</td><td className="px-4 py-2 border-r">Beginner</td><td className="px-4 py-2 text-center">20m</td></tr>
                            <tr><td className="px-4 py-2 border-r">M-02</td><td className="px-4 py-2 border-r">Components, Props and State</td><td className="px-4 py-2 border-r">Intermediate</td><td className="px-4 py-2 text-center">25m</td></tr>
                            <tr><td className="px-4 py-2 border-r">M-02</td><td className="px-4 py-2 border-r">React Hooks (useState, useEffect)</td><td className="px-4 py-2 border-r">Intermediate</td><td className="px-4 py-2 text-center">30m</td></tr>
                            <tr><td className="px-4 py-2 border-r">M-02</td><td className="px-4 py-2 border-r">Routing with React Router</td><td className="px-4 py-2 border-r">Intermediate</td><td className="px-4 py-2 text-center">20m</td></tr>
                            <tr><td className="px-4 py-2 border-r">M-02</td><td className="px-4 py-2 border-r">Next.js Fundamentals</td><td className="px-4 py-2 border-r">Intermediate</td><td className="px-4 py-2 text-center">25m</td></tr>
                            <tr><td className="px-4 py-2 border-r">M-02</td><td className="px-4 py-2 border-r">Styling with Tailwind CSS</td><td className="px-4 py-2 border-r">Beginner</td><td className="px-4 py-2 text-center">20m</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Week 3 */}
                    <div className="space-y-4">
                      <div className="bg-[#002147] text-white px-4 py-1.5 text-[12px] font-medium">Week 3: Backend Systems & API Design</div>
                      <div className="overflow-x-auto border border-zinc-200">
                        <table className="w-full text-left text-[13px] min-w-[550px]">
                          <thead className="bg-[#F8F9FA] border-b border-zinc-200 text-[#002147]">
                            <tr>
                              <th className="px-4 py-2 font-semibold border-r border-zinc-200">Ref</th>
                              <th className="px-4 py-2 font-semibold border-r border-zinc-200">Lesson Name</th>
                              <th className="px-4 py-2 font-semibold border-r border-zinc-200">Level</th>
                              <th className="px-4 py-2 font-semibold text-center">T-Time</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-200">
                            <tr><td className="px-4 py-2 border-r">M-03</td><td className="px-4 py-2 border-r">Introduction to Node.js</td><td className="px-4 py-2 border-r">Intermediate</td><td className="px-4 py-2 text-center">20m</td></tr>
                            <tr><td className="px-4 py-2 border-r">M-03</td><td className="px-4 py-2 border-r">Express.js Framework Basics</td><td className="px-4 py-2 border-r">Intermediate</td><td className="px-4 py-2 text-center">25m</td></tr>
                            <tr><td className="px-4 py-2 border-r">M-03</td><td className="px-4 py-2 border-r">Creating REST APIs</td><td className="px-4 py-2 border-r">Intermediate</td><td className="px-4 py-2 text-center">30m</td></tr>
                            <tr><td className="px-4 py-2 border-r">M-03</td><td className="px-4 py-2 border-r">Middleware in Express</td><td className="px-4 py-2 border-r">Intermediate</td><td className="px-4 py-2 text-center">20m</td></tr>
                            <tr><td className="px-4 py-2 border-r">M-03</td><td className="px-4 py-2 border-r">Authentication with JWT</td><td className="px-4 py-2 border-r">Intermediate</td><td className="px-4 py-2 text-center">30m</td></tr>
                            <tr><td className="px-4 py-2 border-r">M-03</td><td className="px-4 py-2 border-r">API Testing using Postman</td><td className="px-4 py-2 border-r">Beginner</td><td className="px-4 py-2 text-center">15m</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Week 4 */}
                    <div className="space-y-4">
                      <div className="bg-[#002147] text-white px-4 py-1.5 text-[12px] font-medium">Week 4: Database Integration & Assessment</div>
                      <div className="overflow-x-auto border border-zinc-200">
                        <table className="w-full text-left text-[13px] min-w-[550px]">
                          <thead className="bg-[#F8F9FA] border-b border-zinc-200 text-[#002147]">
                            <tr>
                              <th className="px-4 py-2 font-semibold border-r border-zinc-200">Ref</th>
                              <th className="px-4 py-2 font-semibold border-r border-zinc-200">Lesson Name</th>
                              <th className="px-4 py-2 font-semibold border-r border-zinc-200">Level</th>
                              <th className="px-4 py-2 font-semibold text-center">T-Time</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-200">
                            <tr><td className="px-4 py-2 border-r">M-04</td><td className="px-4 py-2 border-r">SQL vs NoSQL Databases</td><td className="px-4 py-2 border-r">Beginner</td><td className="px-4 py-2 text-center">15m</td></tr>
                            <tr><td className="px-4 py-2 border-r">M-04</td><td className="px-4 py-2 border-r">MongoDB Basics and Setup</td><td className="px-4 py-2 border-r">Intermediate</td><td className="px-4 py-2 text-center">25m</td></tr>
                            <tr><td className="px-4 py-2 border-r">M-04</td><td className="px-4 py-2 border-r">CRUD Operations in MongoDB</td><td className="px-4 py-2 border-r">Intermediate</td><td className="px-4 py-2 text-center">30m</td></tr>
                            <tr><td className="px-4 py-2 border-r">M-04</td><td className="px-4 py-2 border-r">Mongoose (Schema and Models)</td><td className="px-4 py-2 border-r">Intermediate</td><td className="px-4 py-2 text-center">25m</td></tr>
                            <tr><td className="px-4 py-2 border-r">M-04</td><td className="px-4 py-2 border-r">Connecting Database with Backend</td><td className="px-4 py-2 border-r">Intermediate</td><td className="px-4 py-2 text-center">20m</td></tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="bg-[#F8F9FA] border border-zinc-200 p-4">
                        <div className="text-[11px] font-semibold text-zinc-400 mb-2 uppercase tracking-wide underline underline-offset-4 decoration-[#002147]">Required Assessments</div>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1 bg-white p-3 border border-zinc-200 text-[12px] shadow-sm"><strong>MCQ Test:</strong> Concepts Week 1-4 (20m)</div>
                          <div className="flex-1 bg-white p-3 border border-zinc-200 text-[12px] shadow-sm"><strong>Coding:</strong> API Integration (45m)</div>
                          <div className="flex-1 bg-white p-3 border border-zinc-200 text-[12px] shadow-sm"><strong>Project:</strong> Full Submission (60m)</div>
                        </div>
                      </div>
                    </div>

                    {/* Week 5 */}
                    <div className="space-y-4">
                      <div className="bg-[#002147] text-white px-4 py-1.5 text-[12px] font-medium">Week 5: Real-Time Project Implementation</div>
                      <div className="p-4 border border-zinc-200 bg-white text-[14px] leading-relaxed italic text-zinc-600 shadow-sm">
                        Week 5 focuses on building a real-time full stack project through structured, text-based guidance. Students will implement authentication, CRUD operations, API integration, and deployment, resulting in a complete, production-ready application for their portfolio.
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 5: Certification Requirements */}
                <section>
                  <div className="bg-[#F8F9FA] px-4 py-2 border-l-4 border-[#002147] mb-4 shadow-sm">
                    <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#002147]">5. Certification Requirements</h2>
                  </div>
                  <div className="flex flex-col md:flex-row gap-0 border border-zinc-200 shadow-sm">
                    <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-zinc-200">
                      <h3 className="text-[12px] font-semibold mb-4 text-[#002147]">Weekly Training Schedule</h3>
                      <ul className="space-y-3 text-[14px]">
                        <li className="flex justify-between border-b border-zinc-50 pb-2"><span>Live Instructional Hours</span><span className="font-medium text-[#002147]">4 Days</span></li>
                        <li className="flex justify-between border-b border-zinc-50 pb-2"><span>Assignment Practicum</span><span className="font-medium text-[#002147]">2 Days</span></li>
                        <li className="flex justify-between"><span>Mandatory Assessment</span><span className="font-medium text-[#002147]">1 Day</span></li>
                      </ul>
                    </div>
                    <div className="flex-1 p-6 bg-[#F8F9FA]">
                      <h3 className="text-[12px] font-semibold mb-4 text-[#002147]">Mandatory Criteria</h3>
                      <ol className="space-y-2 text-[13px] list-decimal pl-5 text-zinc-600 font-medium">
                        <li>Minimum 75% system-recorded attendance.</li>
                        <li>Submission of valid Capstone Project.</li>
                        <li>Qualification score of 60% in final examination.</li>
                      </ol>
                    </div>
                  </div>
                </section>

                {/* Section 6: Industry Immersion (MNC Visit) */}
                <section>
                  <div className="bg-[#F8F9FA] px-4 py-2 border-l-4 border-[#002147] mb-4 shadow-sm">
                    <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#002147]">6. Industry Immersion (MNC Visit)</h2>
                  </div>
                  <div className="p-6 border border-zinc-200 bg-white text-[14px] sm:text-[15px] leading-relaxed shadow-sm">
                    All valid candidates will participate in a one-day office immersion at a designated Multi-National Corporation.
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                      <div className="p-4 bg-white border border-zinc-200 text-[11px] font-medium text-[#002147] flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#002147] rotate-45" /> Corporate Protocol Training</div>
                      <div className="p-4 bg-white border border-zinc-200 text-[11px] font-medium text-[#002147] flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#002147] rotate-45" /> Operational Workflow Audit</div>
                      <div className="p-4 bg-white border border-zinc-200 text-[11px] font-medium text-[#002147] flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#002147] rotate-45" /> Infrastructure Exposure</div>
                      <div className="p-4 bg-white border border-zinc-200 text-[11px] font-medium text-[#002147] flex items-center gap-3"><div className="w-1.5 h-1.5 bg-[#002147] rotate-45" /> Industry Expert Dialogue</div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Registration Form Block */}
              <div className="w-full lg:w-[420px] shrink-0 lg:sticky lg:top-4">
                <div className="border-[4px] border-[#002147] bg-white p-6 mb-4 shadow-lg">
                  <div className="bg-[#002147] text-white p-5 mb-6 text-center -mx-6 -mt-6">
                    <h2 className="text-lg sm:text-xl font-semibold">Enrollment Portal</h2>
                    <p className="text-[10px] text-zinc-400 mt-1 font-medium">Secure Admission System</p>
                  </div>

                  {step === 4 ? (
                    <div className="py-12 text-center space-y-6 animate-in zoom-in duration-500">
                      <div className="w-16 h-16 border-2 border-[#002147] flex items-center justify-center mx-auto bg-emerald-50 border-emerald-500">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#002147]">Application Logged</h3>
                        <p className="text-[13px] text-zinc-500 mt-2 leading-relaxed font-medium">Your request has been saved. Please check your email for the acknowledgement slip.</p>
                      </div>
                      <button onClick={() => setStep(1)} className="px-8 py-2.5 bg-[#002147] text-white text-[12px] font-medium hover:bg-black transition-all">New Application</button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center border-b border-zinc-100 pb-3 mb-6">
                        <span className="text-[11px] font-semibold text-[#002147]">Status: Step {step} / 3</span>
                        <div className="flex gap-1.5">
                          {[1, 2, 3].map(s => (
                            <div key={s} className={`w-4 h-1.5 ${s <= step ? 'bg-[#002147]' : 'bg-zinc-100'}`} />
                          ))}
                        </div>
                      </div>

                      {step === 1 && (
                        <div className="space-y-4">
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <label className="text-[11px] font-medium text-zinc-500">1.1 Applicant Full Name</label>
                              <input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full h-11 border border-zinc-200 bg-zinc-50 px-4 text-[14px] focus:bg-white focus:border-[#002147] outline-none font-medium placeholder:text-zinc-300" placeholder="Type here..." />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[11px] font-medium text-zinc-500">1.2 Institution Name</label>
                                <input required value={formData.college} onChange={(e) => setFormData({ ...formData, college: e.target.value })} className="w-full h-11 border border-zinc-200 bg-zinc-50 px-4 text-[14px] focus:bg-white focus:border-[#002147] outline-none font-medium" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] font-medium text-zinc-500">1.3 Full-Stack | UI/UX</label>
                                <input required value={formData.branch} onChange={(e) => setFormData({ ...formData, branch: e.target.value })} className="w-full h-11 border border-zinc-200 bg-zinc-50 px-4 text-[14px] focus:bg-white focus:border-[#002147] outline-none font-medium" />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[11px] font-medium text-zinc-500">1.4 Primary Email</label>
                                <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full h-11 border border-zinc-200 bg-zinc-50 px-4 text-[14px] focus:bg-white focus:border-[#002147] outline-none font-medium" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] font-medium text-zinc-500">1.5 Primary Mobile</label>
                                <input required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full h-11 border border-zinc-200 bg-zinc-50 px-4 text-[14px] focus:bg-white focus:border-[#002147] outline-none font-medium" placeholder="+91" />
                              </div>
                            </div>
                          </div>
                          <button onClick={nextStep} disabled={!formData.name || !formData.email} className="w-full h-12 bg-[#002147] text-white text-[13px] font-medium transition-all hover:bg-black flex items-center justify-center gap-3">Continue to Payment <ArrowRight className="w-5 h-5" /></button>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="space-y-8 text-center py-4">
                          <div className="p-3 bg-white border border-[#002147] inline-block shadow-md">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent("upi://pay?pa=6302933597@hdfc&pn=StudentForge&am=599&cu=INR")}`}
                              alt="Secure QR"
                              className="w-44 h-44 block grayscale contrast-125"
                            />
                          </div>
                          <div className="space-y-1 bg-[#F8F9FA] border border-zinc-200 py-4">
                            <p className="text-[10px] font-medium text-zinc-400">Enrollment Fee</p>
                            <p className="text-[28px] font-semibold text-[#002147]">₹599.00</p>
                            <p className="text-emerald-700 text-[10px] font-medium">Verified: StudentForge</p>
                          </div>
                          <div className="flex gap-4">
                            <button onClick={prevStep} className="flex-1 h-12 border border-zinc-200 text-zinc-900 text-[11px] font-medium hover:bg-zinc-50">Go Back</button>
                            <button onClick={nextStep} className="flex-1 h-12 bg-[#002147] text-white text-[11px] font-medium hover:bg-black shadow-lg shadow-blue-900/10">I've Done Payment</button>
                          </div>
                        </div>
                      )}

                      {step === 3 && (
                        <div className="space-y-6 text-left">
                          <div className="p-4 bg-amber-50 border border-amber-100 text-amber-900">
                            <p className="text-[12px] font-semibold mb-1">Final Verification:</p>
                            <p className="text-[11px] leading-relaxed">Incorrect info will lead to rejection without refund.</p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[11px] font-medium text-zinc-500">Payment Reference (UTR / ID)</label>
                            <input
                              required
                              value={formData.transactionId}
                              onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                              className="w-full h-12 border border-zinc-200 bg-zinc-50 px-4 text-[14px] focus:bg-white focus:border-[#002147] outline-none font-medium"
                              placeholder="Transaction ID"
                            />
                          </div>
                          <div className="flex gap-4">
                            <button onClick={prevStep} className="flex-1 h-12 border border-zinc-200 text-zinc-900 text-[11px] font-medium hover:bg-zinc-50">Back</button>
                            <button
                              onClick={handleSubmit}
                              disabled={isSubmitting || !formData.transactionId}
                              className="flex-1 h-12 bg-[#002147] text-white text-[11px] font-medium hover:bg-black"
                            >
                              {isSubmitting ? "Sending..." : "Submit Form"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="bg-[#002147] text-white p-4 text-center text-[10px] font-medium shadow-md">
                  Authorized Student Forge Access System
                </div>
              </div>
            </div>
          </div>

          {/* Official Footer Section */}
          <div className="mt-12 px-6 sm:px-10 lg:px-12 py-12 bg-[#F9FAFB] border-t-2 border-zinc-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-[12px] text-zinc-600">
              <div className="col-span-1 lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2 text-[#002147] font-semibold tracking-wide">
                  <div className="w-1.5 h-4 bg-[#002147]" />
                  <span>Important Legal Disclosures</span>
                </div>
                <div className="h-px bg-zinc-200 w-full" />
                <ul className="space-y-3 list-disc pl-4 italic opacity-85 leading-relaxed">
                  <li>This program is an educational initiative and does not guarantee job placement or employment.</li>
                  <li>All enrollment fees are non-refundable. Candidates must verify eligibility prior to registration.</li>
                  <li>Strict adherence to corporate protocols is mandatory during MNC office visits.</li>
                </ul>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#002147] font-semibold tracking-wide">
                  <div className="w-1.5 h-4 bg-[#002147]" />
                  <span>Contact Information</span>
                </div>
                <div className="h-px bg-zinc-200 w-full" />
                <div className="space-y-2">
                  <p className="font-medium">Primary: info@studentforge.com</p>
                  <p className="font-medium">Support: forgedigitaltechnologies@gmail.com</p>
                  <p className="font-medium text-[#002147]">Desk: +91 6304 218 064</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#002147] font-semibold tracking-wide">
                  <div className="w-1.5 h-4 bg-[#002147]" />
                  <span>Issuing Authority</span>
                </div>
                <div className="h-px bg-zinc-200 w-full" />
                <div className="space-y-1">
                  <p className="font-semibold text-zinc-800">Student Forge Technologies Private Limited.</p>
                  <p className="text-[10px] text-zinc-400">Document Ref: SF-TECH-2026-F1</p>
                  <p className="text-[10px] text-zinc-400">Date: April 19, 2026</p>
                </div>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-zinc-200 text-center">
              <p className="text-[#002147] text-[11px] font-medium tracking-[0.3em]">
                © 2026 Student Forge Technologies Private Limited. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>



      </main>

      <Footer />
    </div>
  );
}



