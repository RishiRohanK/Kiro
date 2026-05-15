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

  // Registration Deadline: May 15, 2026, 6:00 PM
  const deadline = new Date("2026-05-15T18:00:00");
  const isRegistrationClosed = new Date() >= deadline;

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    if (isRegistrationClosed) return;
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
          <div className="border-b-2 border-[#002147] pb-6 mb-6 text-center pt-8 px-6">
            <h1 className="text-xl sm:text-2xl font-semibold text-[#002147] mb-2">Summer Boot Camp 2026 - Training Notification</h1>
            <div className="inline-block px-3 py-0.5 bg-[#002147] text-white text-[11px] font-medium mb-3">Official Release</div>
            <p className="text-[13px] sm:text-[14px] font-medium text-zinc-500">Platform An initiative by Student Forge</p>
          </div>

          <div className={`mx-6 sm:mx-10 lg:mx-12 mb-8 p-3 flex items-center justify-center text-center border-2 ${isRegistrationClosed ? "bg-red-50 border-red-200 text-red-600" : "bg-red-600 border-red-700 text-white"}`}>
            <p className="text-[14px] font-bold uppercase tracking-tight">
              {isRegistrationClosed 
                ? "Registrations are now CLOSED for the 2026 Cohort." 
                : "Registrations will be closed automatically at 6:00 PM today (15-05-2026)"}
            </p>
          </div>

          <div className="px-6 sm:px-10 lg:px-12 pb-12">
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              <div className="flex-1 space-y-10 w-full">

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
                          <td className="px-5 py-3 font-medium text-red-600">May 15, 2026 (6:00 PM)</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-3 bg-[#F8F9FA] border-r border-zinc-200 italic text-zinc-600 text-blue-900 font-medium">Training Operations Start</td>
                          <td className="px-5 py-3 text-[#002147] font-semibold">
                            <span className="line-through text-zinc-400 mr-2">10-05-2026</span>
                            <span>15-05-2026</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-3 bg-[#F8F9FA] border-r border-zinc-200 italic text-zinc-600">Final Assessment & Closure</td>
                          <td className="px-5 py-3 font-medium">
                            <span className="line-through text-zinc-400 mr-2">June 10, 2026</span>
                            <span>15-06-2026</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                <section>
                  <div className="bg-[#F8F9FA] px-4 py-2 border-l-4 border-[#002147] mb-6 shadow-sm">
                    <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#002147]">4. Comprehensive Syllabus (MERN Stack Basics)</h2>
                  </div>

                  {/* Program Overview */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 bg-white border border-zinc-200 shadow-sm">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Duration</p>
                      <p className="text-lg font-bold text-[#002147]">30 Days</p>
                    </div>
                    <div className="p-4 bg-white border border-zinc-200 shadow-sm">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Daily Commitment</p>
                      <p className="text-lg font-bold text-[#002147]">1 Hour Class</p>
                    </div>
                    <div className="p-4 bg-white border border-zinc-200 shadow-sm">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Schedule</p>
                      <p className="text-lg font-bold text-[#002147]">6 Days / Week</p>
                    </div>
                  </div>

                  <div className="space-y-10">
                    {/* Projects Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-[#F8F9FA] border border-zinc-200">
                        <h3 className="text-sm font-bold text-[#002147] uppercase tracking-tight border-b border-zinc-200 pb-2 mb-4">Mini Project: Movie Search App</h3>
                        <ul className="space-y-2 text-[13px] text-zinc-600 font-medium">
                          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#002147]" /> Search movies & API fetching</li>
                          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#002147]" /> Display cards & Responsive UI</li>
                          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#002147]" /> Favorites using localStorage</li>
                        </ul>
                      </div>
                      <div className="p-6 bg-[#F8F9FA] border border-zinc-200">
                        <h3 className="text-sm font-bold text-[#002147] uppercase tracking-tight border-b border-zinc-200 pb-2 mb-4">Major Project: MERN Task Manager</h3>
                        <ul className="space-y-2 text-[13px] text-zinc-600 font-medium">
                          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#002147]" /> Login/Register & JWT Auth</li>
                          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#002147]" /> MongoDB storage & CRUD APIs</li>
                          <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#002147]" /> Responsive Dashboard & Routes</li>
                        </ul>
                      </div>
                    </div>

                    {/* Week 1 */}
                    <div className="space-y-4">
                      <div className="bg-[#002147] text-white px-4 py-1.5 text-[12px] font-medium uppercase tracking-wider">Week 1: HTML, CSS & JavaScript Basics</div>
                      <div className="overflow-x-auto border border-zinc-200">
                        <table className="w-full text-left text-[13px] min-w-[550px]">
                          <thead className="bg-[#F8F9FA] border-b border-zinc-200 text-[#002147]">
                            <tr>
                              <th className="px-4 py-2 font-semibold border-r border-zinc-200 w-16">Day</th>
                              <th className="px-4 py-2 font-semibold border-r border-zinc-200">Topics & Concepts</th>
                              <th className="px-4 py-2 font-semibold">Practical Task</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-200">
                            <tr><td className="px-4 py-3 border-r font-bold">01</td><td className="px-4 py-3 border-r">Introduction to Web & HTML Structure</td><td className="px-4 py-3 italic">Personal portfolio page</td></tr>
                            <tr><td className="px-4 py-3 border-r font-bold">02</td><td className="px-4 py-3 border-r">Forms, Tables & Semantic HTML</td><td className="px-4 py-3 italic">Student registration form</td></tr>
                            <tr><td className="px-4 py-3 border-r font-bold">03</td><td className="px-4 py-3 border-r">CSS Selectors, Box Model & Flexbox</td><td className="px-4 py-3 italic">Style the form professionally</td></tr>
                            <tr><td className="px-4 py-3 border-r font-bold">04</td><td className="px-4 py-3 border-r">Responsive Design & Media Queries</td><td className="px-4 py-3 italic">Responsive navbar & card layout</td></tr>
                            <tr><td className="px-4 py-3 border-r font-bold">05</td><td className="px-4 py-3 border-r">JS Variables, Functions & Arrays</td><td className="px-4 py-3 italic">Student marks calculator</td></tr>
                            <tr><td className="px-4 py-3 border-r font-bold">06</td><td className="px-4 py-3 border-r">DOM Manipulation & LocalStorage</td><td className="px-4 py-3 italic">To-do list using DOM</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Week 2 */}
                    <div className="space-y-4">
                      <div className="bg-[#002147] text-white px-4 py-1.5 text-[12px] font-medium uppercase tracking-wider">Week 2: Advanced JavaScript + React Basics</div>
                      <div className="overflow-x-auto border border-zinc-200">
                        <table className="w-full text-left text-[13px] min-w-[550px]">
                          <thead className="bg-[#F8F9FA] border-b border-zinc-200 text-[#002147]">
                            <tr>
                              <th className="px-4 py-2 font-semibold border-r border-zinc-200 w-16">Day</th>
                              <th className="px-4 py-2 font-semibold border-r border-zinc-200">Topics & Concepts</th>
                              <th className="px-4 py-2 font-semibold">Practical Task</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-200">
                            <tr><td className="px-4 py-3 border-r font-bold">07</td><td className="px-4 py-3 border-r">ES6: Arrow functions, Destructuring</td><td className="px-4 py-3 italic">Convert old JS code into ES6</td></tr>
                            <tr><td className="px-4 py-3 border-r font-bold">08</td><td className="px-4 py-3 border-r">Async JS: Promises, Async/Await</td><td className="px-4 py-3 italic">Fetch users from External API</td></tr>
                            <tr><td className="px-4 py-3 border-r font-bold">09</td><td className="px-4 py-3 border-r">React Intro: JSX, Props & Components</td><td className="px-4 py-3 italic">Greeting card application</td></tr>
                            <tr><td className="px-4 py-3 border-r font-bold">10</td><td className="px-4 py-3 border-r">React State (useState) & Events</td><td className="px-4 py-3 italic">Counter app & Dark mode toggle</td></tr>
                            <tr><td className="px-4 py-3 border-r font-bold">11</td><td className="px-4 py-3 border-r">React Lists (map) & Controlled Forms</td><td className="px-4 py-3 italic">Student form with display data</td></tr>
                            <tr><td className="px-4 py-3 border-r font-bold">12</td><td className="px-4 py-3 border-r">React Router: Multi-page Navigation</td><td className="px-4 py-3 italic">Multi-page React website</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Week 3 */}
                    <div className="space-y-4">
                      <div className="bg-[#002147] text-white px-4 py-1.5 text-[12px] font-medium uppercase tracking-wider">Week 3: React Advanced + Node.js & Express</div>
                      <div className="overflow-x-auto border border-zinc-200">
                        <table className="w-full text-left text-[13px] min-w-[550px]">
                          <thead className="bg-[#F8F9FA] border-b border-zinc-200 text-[#002147]">
                            <tr>
                              <th className="px-4 py-2 font-semibold border-r border-zinc-200 w-16">Day</th>
                              <th className="px-4 py-2 font-semibold border-r border-zinc-200">Topics & Concepts</th>
                              <th className="px-4 py-2 font-semibold">Practical Task</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-200">
                            <tr><td className="px-4 py-3 border-r font-bold">13</td><td className="px-4 py-3 border-r">React Hooks: useEffect & API Fetching</td><td className="px-4 py-3 italic">Fetch products API & display</td></tr>
                            <tr><td className="px-4 py-3 border-r font-bold">14</td><td className="px-4 py-3 border-r">Professional Project Structure</td><td className="px-4 py-3 italic">Refactor previous applications</td></tr>
                            <tr><td className="px-4 py-3 border-r font-bold">15</td><td className="px-4 py-3 border-r">Redux Basics: Store, Reducers, Actions</td><td className="px-4 py-3 italic">Cart counter using Redux</td></tr>
                            <tr><td className="px-4 py-3 border-r font-bold">16</td><td className="px-4 py-3 border-r">Node.js Introduction & NPM Ecosystem</td><td className="px-4 py-3 italic">Simple Node server setup</td></tr>
                            <tr><td className="px-4 py-3 border-r font-bold">17</td><td className="px-4 py-3 border-r">Express.js: Routes, Middleware, REST</td><td className="px-4 py-3 italic">Student API (GET & POST)</td></tr>
                            <tr><td className="px-4 py-3 border-r font-bold">18</td><td className="px-4 py-3 border-r">MongoDB Basics & CRUD Operations</td><td className="px-4 py-3 italic">Store & fetch student records</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Week 4 */}
                    <div className="space-y-4">
                      <div className="bg-[#002147] text-white px-4 py-1.5 text-[12px] font-medium uppercase tracking-wider">Week 4: MERN Stack Integration</div>
                      <div className="overflow-x-auto border border-zinc-200">
                        <table className="w-full text-left text-[13px] min-w-[550px]">
                          <thead className="bg-[#F8F9FA] border-b border-zinc-200 text-[#002147]">
                            <tr>
                              <th className="px-4 py-2 font-semibold border-r border-zinc-200 w-16">Day</th>
                              <th className="px-4 py-2 font-semibold border-r border-zinc-200">Topics & Concepts</th>
                              <th className="px-4 py-2 font-semibold">Practical Task</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-200">
                            <tr><td className="px-4 py-3 border-r font-bold">19</td><td className="px-4 py-3 border-r">MongoDB Atlas & Mongoose Schemas</td><td className="px-4 py-3 italic">Connect Atlas to Backend</td></tr>
                            <tr><td className="px-4 py-3 border-r font-bold">20</td><td className="px-4 py-3 border-r">Full CRUD API Implementation</td><td className="px-4 py-3 italic">Notes management backend</td></tr>
                            <tr><td className="px-4 py-3 border-r font-bold">21</td><td className="px-4 py-3 border-r">React + Backend API Integration</td><td className="px-4 py-3 italic">Connect React app with API</td></tr>
                            <tr><td className="px-4 py-3 border-r font-bold">22</td><td className="px-4 py-3 border-r">Auth Basics: JWT & Bcrypt</td><td className="px-4 py-3 italic">Secure Register/Login system</td></tr>
                            <tr><td className="px-4 py-3 border-r font-bold">23</td><td className="px-4 py-3 border-r">Protected Routes & Token Verification</td><td className="px-4 py-3 italic">Protect Dashboard access</td></tr>
                            <tr><td className="px-4 py-3 border-r font-bold">24</td><td className="px-4 py-3 border-r">Deployment: GitHub, Vercel & Render</td><td className="px-4 py-3 italic">Full-stack application deployment</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Week 5 */}
                    <div className="space-y-4">
                      <div className="bg-[#002147] text-white px-4 py-1.5 text-[12px] font-medium uppercase tracking-wider">Week 5: Project Finalization & Review</div>
                      <div className="overflow-x-auto border border-zinc-200">
                        <table className="w-full text-left text-[13px] min-w-[550px]">
                          <thead className="bg-[#F8F9FA] border-b border-zinc-200 text-[#002147]">
                            <tr>
                              <th className="px-4 py-2 font-semibold border-r border-zinc-200 w-16">Day</th>
                              <th className="px-4 py-2 font-semibold border-r border-zinc-200">Milestone Phase</th>
                              <th className="px-4 py-2 font-semibold">Project Deliverable</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-200">
                            <tr><td className="px-4 py-3 border-r font-bold">25</td><td className="px-4 py-3 border-r">Mini Project UI Phase</td><td className="px-4 py-3 italic">Movie Search App Interface</td></tr>
                            <tr><td className="px-4 py-3 border-r font-bold">26</td><td className="px-4 py-3 border-r">Mini Project Logic Phase</td><td className="px-4 py-3 italic">Complete API & Responsive Design</td></tr>
                            <tr><td className="px-4 py-3 border-r font-bold">27</td><td className="px-4 py-3 border-r">Major Project: Environment Setup</td><td className="px-4 py-3 italic">Frontend, Backend & DB Setup</td></tr>
                            <tr><td className="px-4 py-3 border-r font-bold">28</td><td className="px-4 py-3 border-r">Major Project: Backend Systems</td><td className="px-4 py-3 italic">Auth & CRUD API completion</td></tr>
                            <tr><td className="px-4 py-3 border-r font-bold">29</td><td className="px-4 py-3 border-r">Major Project: Frontend Integration</td><td className="px-4 py-3 italic">Dashboard & API Connection</td></tr>
                            <tr><td className="px-4 py-3 border-r font-bold">30</td><td className="px-4 py-3 border-r">Final Deployment & Interview Prep</td><td className="px-4 py-3 italic">Portfolio update & Revision</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </section>

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

              <div className="w-full lg:w-[420px] shrink-0 lg:sticky lg:top-4">
                <div className={`border-[4px] bg-white p-6 mb-4 shadow-lg transition-all ${isRegistrationClosed ? "border-red-500 opacity-80" : "border-[#002147]"}`}>
                  <div className={`${isRegistrationClosed ? "bg-red-500" : "bg-[#002147]"} text-white p-5 mb-6 text-center -mx-6 -mt-6`}>
                    <h2 className="text-lg sm:text-xl font-semibold">
                      {isRegistrationClosed ? "Portal Closed" : "Enrollment Portal"}
                    </h2>
                    <p className="text-[10px] text-white/70 mt-1 font-medium">
                      {isRegistrationClosed ? "Registrations are no longer accepted" : "Secure Admission System"}
                    </p>
                  </div>

                  {isRegistrationClosed ? (
                    <div className="py-12 text-center space-y-6">
                      <div className="w-16 h-16 border-2 border-red-500 flex items-center justify-center mx-auto bg-red-50">
                         <zap className="w-8 h-8 text-red-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-red-600 tracking-tight">Access Restricted</h3>
                        <p className="text-[13px] text-zinc-500 mt-2 leading-relaxed font-medium">The registration window for the Summer 2026 Cohort closed on May 15, 2026 at 6:00 PM.</p>
                      </div>
                      <div className="p-4 bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-400 font-medium leading-relaxed italic">
                        Please follow our official channels for notifications regarding the next cohort opening.
                      </div>
                    </div>
                  ) : step === 4 ? (
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
                              <input required disabled={isRegistrationClosed} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full h-11 border border-zinc-200 bg-zinc-50 px-4 text-[14px] focus:bg-white focus:border-[#002147] outline-none font-medium placeholder:text-zinc-300" placeholder="Type here..." />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[11px] font-medium text-zinc-500">1.2 Institution Name</label>
                                <input required disabled={isRegistrationClosed} value={formData.college} onChange={(e) => setFormData({ ...formData, college: e.target.value })} className="w-full h-11 border border-zinc-200 bg-zinc-50 px-4 text-[14px] focus:bg-white focus:border-[#002147] outline-none font-medium" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] font-medium text-zinc-500">1.3 Full-Stack | UI/UX</label>
                                <input required disabled={isRegistrationClosed} value={formData.branch} onChange={(e) => setFormData({ ...formData, branch: e.target.value })} className="w-full h-11 border border-zinc-200 bg-zinc-50 px-4 text-[14px] focus:bg-white focus:border-[#002147] outline-none font-medium" />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[11px] font-medium text-zinc-500">1.4 Primary Email</label>
                                <input required disabled={isRegistrationClosed} type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full h-11 border border-zinc-200 bg-zinc-50 px-4 text-[14px] focus:bg-white focus:border-[#002147] outline-none font-medium" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[11px] font-medium text-zinc-500">1.5 Primary Mobile</label>
                                <input required disabled={isRegistrationClosed} type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full h-11 border border-zinc-200 bg-zinc-50 px-4 text-[14px] focus:bg-white focus:border-[#002147] outline-none font-medium" placeholder="+91" />
                              </div>
                            </div>
                          </div>
                          <button onClick={nextStep} disabled={isRegistrationClosed || !formData.name || !formData.email} className="w-full h-12 bg-[#002147] text-white text-[13px] font-medium transition-all hover:bg-black flex items-center justify-center gap-3 disabled:opacity-50">Continue to Payment <ArrowRight className="w-5 h-5" /></button>
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
                            <button onClick={nextStep} disabled={isRegistrationClosed} className="flex-1 h-12 bg-[#002147] text-white text-[11px] font-medium hover:bg-black shadow-lg shadow-blue-900/10 disabled:opacity-50">I've Done Payment</button>
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
                              disabled={isRegistrationClosed}
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
                              disabled={isRegistrationClosed || isSubmitting || !formData.transactionId}
                              className="flex-1 h-12 bg-[#002147] text-white text-[11px] font-medium hover:bg-black disabled:opacity-50"
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



