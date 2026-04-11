"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  ArrowRight, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

export default function ExamLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [mathAnswer, setMathAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (mathAnswer !== "12") {
        setError("Math answer is wrong.");
        setLoading(false);
        return;
    }

    try {
      const res = await fetch("/api/exams/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("intern_user", JSON.stringify(data.user));
        router.push("/exams/guidelines");
      } else {
        setError(data.error || "Login data not found.");
      }
    } catch (err) {
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex items-center justify-center p-6">
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full border border-gray-100 p-10 bg-white"
      >
        <div className="space-y-4 mb-10 text-center">
            <h1 className="text-3xl font-black uppercase tracking-tight text-blue-900 leading-none">Exam Login</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Student Forge Tech</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Office Email</label>
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-600">
                        <User size={16} />
                    </div>
                    <input 
                        type="email" 
                        required
                        placeholder="intern@studentforge.com"
                        className="w-full h-14 pl-12 pr-4 bg-gray-50 border border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all text-sm font-bold"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Solve: 5 + 7</label>
                <input 
                    type="number" 
                    required
                    placeholder="Type your answer"
                    className="w-full h-14 px-4 bg-gray-50 border border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all text-sm font-bold"
                    value={mathAnswer}
                    onChange={(e) => setMathAnswer(e.target.value)}
                />
            </div>

            {error && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-red-50 border border-red-100 flex items-center gap-3 text-red-600"
                >
                    <AlertCircle size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{error}</span>
                </motion.div>
            )}

            <button 
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 group uppercase text-xs tracking-[0.2em]"
            >
                {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                ) : (
                    <>
                        Log In Now
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </form>

        <p className="mt-12 text-[10px] text-center text-gray-300 font-bold uppercase tracking-widest leading-loose">
            Forgot details? Ask your mentor.
        </p>

      </motion.div>

    </div>
  );
}
