"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ExamLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mathAnswer, setMathAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mathAnswer !== "12") {
        setError("Security pin is wrong.");
        setLoading(false);
        return;
    }

    try {
      const res = await fetch("/api/exams/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("intern_user", JSON.stringify(data.user));
        router.push("/exams/guidelines");
      } else {
        setError(data.error || "Login fail. Please check details.");
      }
    } catch (err) {
      setError("Server connection fail.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEmail("");
    setPassword("");
    setMathAnswer("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      
      {/* Exam Details Header */}
      <header className="bg-blue-700 text-white p-6 shadow-md">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-tight">Full Stack Development Exam</h1>
            <p className="text-xs opacity-70 mt-1">Student Forge Technologies Private Limited</p>
          </div>
          <div className="bg-blue-800 p-3 border border-blue-500 rounded text-xs">
            <p className="font-bold">Date: 12-04-2026</p>
            <p className="mt-1 font-bold">Time: 10:00 AM to 11:00 AM</p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white border border-gray-300 shadow-sm">
           
           <div className="bg-gray-100 p-3 border-b border-gray-300">
              <h2 className="text-blue-800 font-bold text-center text-sm uppercase">Candidate Sign In</h2>
           </div>

           <form onSubmit={handleLogin} className="p-8">
              
              {/* Government Style Form Content */}
              <div className="border border-gray-200 divide-y divide-gray-200">
                 
                 <div className="grid grid-cols-1 md:grid-cols-12">
                    <label className="md:col-span-4 bg-gray-50 p-4 text-xs font-bold text-gray-600 flex items-center border-r border-gray-200">
                      Email address
                    </label>
                    <div className="md:col-span-8 p-3 flex items-center">
                        <input 
                            type="email" 
                            required
                            placeholder="Enter your email"
                            className="w-full h-10 px-3 border border-gray-300 focus:border-blue-600 outline-none text-sm transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-12">
                    <label className="md:col-span-4 bg-gray-50 p-4 text-xs font-bold text-gray-600 flex items-center border-r border-gray-200">
                      Password
                    </label>
                    <div className="md:col-span-8 p-3 flex items-center">
                        <input 
                            type="password" 
                            required
                            placeholder="Enter password"
                            className="w-full h-10 px-3 border border-gray-300 focus:border-blue-600 outline-none text-sm transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-12">
                    <label className="md:col-span-4 bg-gray-50 p-4 text-xs font-bold text-gray-600 flex items-center border-r border-gray-200">
                      Security Check (5+7)
                    </label>
                    <div className="md:col-span-8 p-3 flex items-center">
                        <input 
                            type="number" 
                            required
                            placeholder="Type result"
                            className="w-full h-10 px-3 border border-gray-300 focus:border-blue-600 outline-none text-sm transition-all"
                            value={mathAnswer}
                            onChange={(e) => setMathAnswer(e.target.value)}
                        />
                    </div>
                 </div>

              </div>

              {error && (
                 <div className="mt-4 p-2 bg-red-50 border border-red-200 text-center">
                    <p className="text-[10px] text-red-600 font-bold uppercase">{error}</p>
                 </div>
              )}

              <div className="flex justify-center gap-6 mt-10">
                 <button 
                    type="button"
                    onClick={handleReset}
                    className="h-10 px-12 border border-gray-300 bg-gray-50 text-gray-600 text-[11px] font-bold hover:bg-gray-100 uppercase"
                 >
                    Reset
                 </button>
                 <button 
                    type="submit"
                    disabled={loading}
                    className="h-10 px-12 bg-blue-700 text-white text-[11px] font-bold hover:bg-blue-800 uppercase shadow-md"
                 >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : "Login"}
                 </button>
              </div>

           </form>

        </div>
      </main>

      {/* Simple Gray Footer */}
      <footer className="p-8 text-center text-xs text-gray-500 bg-gray-200 border-t border-gray-300">
        Student Forge Technologies Private Limited © 2026
      </footer>

    </div>
  );
}
