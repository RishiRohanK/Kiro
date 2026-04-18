"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Loader2 } from "lucide-react";

export default function AdminExamLogin() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (password === "SF_EXAM_2026") {
            setTimeout(() => {
                localStorage.setItem("sf_exam_admin", "true");
                router.push("/admin/exam/create");
            }, 500);
        } else {
            setLoading(false);
            setError("Invalid access token.");
        }
    };

    return (
        <div className="min-h-screen bg-white text-zinc-900 font-sans flex items-center justify-center p-6 selection:bg-zinc-100">
            <div className="w-full max-w-[360px] space-y-8">
                <div className="space-y-4">
                    <h1 className="text-xl font-bold uppercase tracking-tight">Exam Admin Portal</h1>
                    <p className="text-[12px] text-zinc-500 font-medium">Please enter your authorization token to continue.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Access Token</label>
                        <input
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-12 bg-zinc-50 border border-zinc-200 px-4 text-sm font-medium outline-none focus:border-black rounded-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <p className="text-[11px] text-red-600 font-bold uppercase py-2">
                            {error}
                        </p>
                    )}

                    <button
                        disabled={loading}
                        className="w-full h-12 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all rounded-none flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Access System"}
                    </button>
                </form>

                <div className="pt-8 border-t border-zinc-100 text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">
                    Student Forge // System Terminal
                </div>
            </div>
        </div>
    );
}
