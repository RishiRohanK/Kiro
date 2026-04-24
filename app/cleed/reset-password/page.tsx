"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Shield, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import BottomBanner from "@/app/components/BottomBanner";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Missing reset link. Access denied.");
    }
  }, [token]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/cleed/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/cleed/login");
        }, 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Reset failed.");
      }
    } catch (err) {
      setError("System error. Access denied.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col relative overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
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
                 <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Reset Password</h2>
                 <p className="text-zinc-500 text-[13px] font-medium leading-none">Update Password</p>
               </div>
            </div>

            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 py-4"
              >
                <div className="bg-emerald-50 p-4 rounded-full">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-emerald-700 font-bold text-sm">Password Updated</p>
                  <p className="text-zinc-400 text-[11px]">Redirecting to login page...</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleReset} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">New Security Key</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-[#F5332C] transition-colors" />
                    <input 
                      required
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new key"
                      className="w-full h-12 bg-zinc-50 border border-zinc-200 pl-12 pr-4 text-sm font-bold text-zinc-900 outline-none focus:border-[#F5332C] focus:bg-white transition-all rounded-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Confirm Security Key</label>
                  <div className="relative group">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-[#F5332C] transition-colors" />
                    <input 
                      required
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new key"
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
                  disabled={isLoading || !token}
                  type="submit"
                  className="w-full h-12 bg-zinc-900 text-white text-[11px] font-bold tracking-widest hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-2 rounded-none"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>Save Password <ArrowRight size={14} /></>
                  )}
                </button>
              </form>
            )}

            <div className="pt-6 border-t border-zinc-100 flex flex-col items-center">
              <p className="text-center text-zinc-400 text-[10px] font-medium leading-relaxed">
                All activity is monitored. Unauthorized access is not allowed.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <BottomBanner />
    </div>
  );
}

export default function CleedResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
