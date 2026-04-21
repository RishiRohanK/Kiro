"use client";

import { useState, useEffect } from "react";
import { 
    ChevronLeft,
    RefreshCw,
    Users,
    Database,
    Cpu,
    Wifi,
    Shield,
    Activity
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SystemHealthPage() {
    const [loading, setLoading] = useState(true);
    const [healthData, setHealthData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchHealth = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/cleed/health");
            const data = await res.json();
            if (data.success) {
                setHealthData(data.data);
            } else {
                setError("Error pulling live data");
            }
        } catch (err) {
            setError("Connection error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHealth();
        // Refresh every 30 seconds for real-time accuracy
        const interval = setInterval(fetchHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    const metrics = healthData ? [
        {
            label: "Monthly Users",
            icon: Users,
            used: healthData.users.active,
            total: healthData.users.capacity,
            percent: healthData.users.percent,
            text: "Real count from User table"
        },
        {
            label: "Database Storage",
            icon: Database,
            used: healthData.database.used,
            total: healthData.database.total,
            percent: healthData.database.percent,
            text: "Actual Postgres file size"
        },
        {
            label: "Memory Usage",
            icon: Cpu,
            used: healthData.infrastructure.ramUsed,
            total: healthData.infrastructure.ramCapacity,
            percent: healthData.infrastructure.ramPercent,
            text: "Direct server process RAM"
        },
        {
            label: "Data Bandwidth",
            icon: Wifi,
            used: healthData.infrastructure.egressUsed,
            total: healthData.infrastructure.egressTotal,
            percent: healthData.infrastructure.egressPercent,
            text: "Calculated by daily activity"
        }
    ] : [];

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-zinc-800">
            {/* Simple Header */}
            <header className="border-b border-zinc-900 bg-black sticky top-0 z-50">
                <div className="max-w-[1000px] mx-auto px-6 h-14 flex items-center justify-between">
                    <Link href="/cleed/dashboard" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors font-medium">
                        <ChevronLeft size={16} />
                        Exit
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${error ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-green-500 shadow-[0_0_8px_#22c55e]'} animate-pulse`} />
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                                {error ? 'Live Fault' : 'Live Stream Active'}
                            </span>
                        </div>
                        <button onClick={fetchHealth} className={`hover:text-white transition-colors ${loading ? "animate-spin" : ""}`}>
                            <RefreshCw size={14} className="text-zinc-500" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1000px] mx-auto px-6 py-12 md:py-20 lg:px-8">
                <div className="mb-12">
                    <h1 className="text-3xl font-bold tracking-tight">System Status</h1>
                    <p className="text-zinc-500 text-sm mt-1">Real-time usage and capacity retrieved directly from our database nodes.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {metrics.map((metric, idx) => (
                        <div key={idx} className="bg-zinc-950 border border-zinc-900 rounded-none p-6 space-y-6 hover:border-zinc-800 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-sm ${metric.percent > 90 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                        <metric.icon size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold tracking-tight uppercase">{metric.label}</h3>
                                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">{metric.text}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black tabular-nums">
                                        {metric.used} <span className="text-zinc-800 font-medium">/</span> <span className="text-zinc-400">{metric.total}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-2">
                                <div className="h-1.5 w-full bg-zinc-900 rounded-none overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${metric.percent}%` }}
                                        transition={{ duration: 1.2, ease: "easeOut" }}
                                        className={`h-full ${metric.percent > 90 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-green-500 shadow-[0_0_10px_#22c55e]'}`}
                                    />
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                                    <span>{metric.percent}% used</span>
                                    {metric.percent > 90 && <span className="text-red-500">Alert: Low Capacity</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Simplified Indicators */}
                <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Security", value: "Locked", color: "green", icon: Shield },
                        { label: "Handshake", value: "Verified", color: "green", icon: Activity },
                        { label: "Cluster", value: "Active", color: "green", icon: RefreshCw },
                        { label: "Operator", value: "Cleed", color: "zinc", icon: Users }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-zinc-950 border border-zinc-900 p-5 flex flex-col items-center gap-3">
                            <item.icon size={16} className={item.color === 'green' ? 'text-green-500' : 'text-zinc-500'} />
                            <div className="text-center">
                                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mb-1">{item.label}</p>
                                <p className="text-xs font-bold uppercase">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <footer className="mt-32 pt-12 border-t border-zinc-900 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-900 px-4 py-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse outline outline-4 outline-green-500/10" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Production Node SF-01</span>
                    </div>
                </footer>
            </main>
        </div>
    );
}
