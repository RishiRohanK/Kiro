"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PWAInstallButton } from "@/app/components/PWAInstallButton";

export default function CleedLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Persistent Login Check
    const isAuthenticated = localStorage.getItem("cleed_auth_v2");
    if (isAuthenticated === "active") {
      router.push("/cleed/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/cleed/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        
        localStorage.setItem("cleed_auth_v2", "active");
        router.push("/cleed/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Access denied. Check credentials.");
      }
    } catch (err) {
      setError("Communication failure. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#F5332C]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="bg-white border border-zinc-200 p-10 rounded-none shadow-sm space-y-10 relative">
          <div className="flex flex-col items-center gap-6">
             <img src="/clledlogo.png" alt="Cleed Logo" className="h-16 w-16 object-contain" />
             <div className="text-center space-y-1">
               <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Login</h2>
               <p className="text-zinc-500 text-[13px] font-medium leading-none">Administrative portal</p>
             </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-400">Email address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-[#F5332C] transition-colors" />
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cleed.com"
                  className="w-full h-12 bg-zinc-50 border border-zinc-200 pl-12 pr-4 text-sm font-bold text-zinc-900 outline-none focus:border-[#F5332C] focus:bg-white transition-all rounded-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-400">Security key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-[#F5332C] transition-colors" />
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-12 bg-zinc-50 border border-zinc-200 pl-12 pr-4 text-sm font-bold text-zinc-900 outline-none focus:border-[#F5332C] focus:bg-white transition-all rounded-none"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-100 p-3"
              >
                <p className="text-red-600 text-[11px] font-bold text-center">{error}</p>
              </motion.div>
            )}

            <button 
              disabled={isLoading}
              type="submit"
              className="w-full h-12 bg-zinc-900 text-white text-[11px] font-bold tracking-widest hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-2 rounded-none"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>Sign in <ArrowRight size={14} /></>
              )}
            </button>
          </form>

          <div className="pt-6 border-t border-zinc-100 flex flex-col items-center gap-6">
            <p className="text-center text-zinc-400 text-[10px] font-medium leading-relaxed">
              Administrative access only. Technical activity is synchronized and monitored.
            </p>
            <PWAInstallButton />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
