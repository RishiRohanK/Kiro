"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import Navbar from "../components/home/Navbar";
import Footer from "../components/home/Footer";

export default function TaskSubmissionPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    taskAllocated: "",
    githubLink: "",
    liveLink: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/task-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
      } else {
        setError(data.error || "Failed to submit. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please check your internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white p-8 border border-zinc-200 text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-xl font-bold">Task Submitted!</h1>
            <p className="text-zinc-500 text-sm">Your submission has been received successfully.</p>
            <button 
              onClick={() => setIsSuccess(false)}
              className="w-full bg-black text-white py-2 rounded-none font-medium hover:bg-zinc-800 transition-colors uppercase text-xs tracking-widest"
            >
              Submit another task
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-zinc-50 py-20 px-6">
        <div className="max-w-xl mx-auto">
          <div className="bg-white p-8 md:p-12 border border-zinc-200 shadow-sm">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-zinc-900">Task Submission Form</h1>
              <p className="text-zinc-500 text-sm mt-1">Please fill in all the details below to submit your task.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Full Name *</label>
                <input 
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full border border-zinc-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Email Address *</label>
                <input 
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full border border-zinc-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Task Name / Allocated *</label>
                <input 
                  required
                  type="text"
                  name="taskAllocated"
                  value={formData.taskAllocated}
                  onChange={handleChange}
                  placeholder="What task were you assigned?"
                  className="w-full border border-zinc-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">GitHub Link *</label>
                <input 
                  required
                  type="url"
                  name="githubLink"
                  value={formData.githubLink}
                  onChange={handleChange}
                  placeholder="https://github.com/username/repo"
                  className="w-full border border-zinc-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Live Demo Link *</label>
                <input 
                  required
                  type="url"
                  name="liveLink"
                  value={formData.liveLink}
                  onChange={handleChange}
                  placeholder="https://your-app.vercel.app"
                  className="w-full border border-zinc-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 text-xs rounded border border-red-100 font-medium">
                  {error}
                </div>
              )}

              <button 
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-black text-white py-3.5 rounded-none font-bold text-[13px] uppercase tracking-wide hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" />
                    Submitting...
                  </>
                ) : (
                  "Submit Task Entry"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
