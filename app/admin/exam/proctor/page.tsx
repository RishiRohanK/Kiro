"use client";

import { useState, useEffect } from "react";
import { 
    Shield, 
    Video, 
    Monitor, 
    Activity, 
    AlertCircle, 
    Loader2,
    Users,
    Zap,
    Cpu
} from "lucide-react";
import { useRouter } from "next/navigation";

// Simulated student data for proctoring demonstration
const LIVE_STUDENTS = [
    { id: 1, name: "Arjun Mehta", status: "Active", bitrate: "2.4 Mbps", packetLoss: "0.01%", sdp: "stable", ice: "connected" },
    { id: 2, name: "Priya Sharma", status: "Active", bitrate: "2.1 Mbps", packetLoss: "0.03%", sdp: "stable", ice: "connected" },
    { id: 3, name: "Rahul Verma", status: "Warning", bitrate: "1.2 Mbps", packetLoss: "2.5%", sdp: "renegotiating", ice: "checking" },
    { id: 4, name: "Ananya Iyer", status: "Active", bitrate: "2.8 Mbps", packetLoss: "0.00%", sdp: "stable", ice: "connected" },
    { id: 5, name: "Siddharth Raj", status: "Active", bitrate: "2.2 Mbps", packetLoss: "0.02%", sdp: "stable", ice: "connected" },
    { id: 6, name: "Ishita Kaur", status: "Offline", bitrate: "0 Kbps", packetLoss: "100%", sdp: "closed", ice: "failed" },
];

export default function ProctoringDashboard() {
    const router = useRouter();
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-violet-500/30 flex flex-col">
            
            {/* Proctor Header */}
            <header className="h-20 bg-black/40 backdrop-blur-md border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <div className="h-10 w-10 bg-violet-600 rounded flex items-center justify-center shadow-lg shadow-violet-600/20">
                        <Shield size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
                           Live Proctoring Matrix <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        </h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-0.5">
                           WebRTC Signaling Server: <span className="text-emerald-500">Active</span> // SDP Exchange: Stable
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex flex-col items-end">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Server Time</p>
                        <p className="text-sm font-mono text-violet-400">{currentTime}</p>
                    </div>
                    <div className="h-10 w-px bg-white/10"></div>
                    <button 
                       onClick={() => router.push("/cleed/dashboard")}
                       className="px-6 h-11 bg-white/[0.03] border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all rounded shadow-sm"
                    >
                       Exit Dashboard
                    </button>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                
                {/* Sidebar: Global Stats */}
                <aside className="w-80 bg-black/20 border-r border-white/5 flex flex-col shrink-0 overflow-y-auto">
                    <div className="p-8 space-y-8">
                        
                        <section className="space-y-4">
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] border-b border-white/5 pb-2">Cluster Metrics</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <MetricCard icon={<Users size={14}/>} label="Active Sessions" value="24" color="text-emerald-400" />
                                <MetricCard icon={<Monitor size={14}/>} label="RTCPeerConnections" value="24" color="text-violet-400" />
                                <MetricCard icon={<Zap size={14}/>} label="Throughput" value="54.2 Mbps" color="text-amber-400" />
                                <MetricCard icon={<Cpu size={14}/>} label="Server Load" value="12%" color="text-slate-400" />
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] border-b border-white/5 pb-2">Network Health</h3>
                            <div className="space-y-3">
                                <HealthBar label="STUN/TURN Latency" percentage={95} value="24ms" color="bg-emerald-500" />
                                <HealthBar label="STP Packet Buffering" percentage={82} value="Low" color="bg-violet-500" />
                                <HealthBar label="Media Relay Jitter" percentage={98} value="Stable" color="bg-emerald-500" />
                            </div>
                        </section>

                        <section className="bg-red-500/5 border border-red-500/20 p-6 rounded relative overflow-hidden group">
                           <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                           <h4 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                              <AlertCircle size={14}/> Critical Alerts
                           </h4>
                           <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">
                              2 students flagged for 'Object detection: Phone' via WebRTC Metadata analysis.
                           </p>
                        </section>

                    </div>
                </aside>

                {/* Main Viewport: Video Grid */}
                <div className="flex-1 overflow-y-auto bg-black/40 custom-scrollbar p-8">
                    
                    <div className="flex justify-between items-center mb-10">
                       <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
                          <Activity size={20} className="text-violet-500"/> Real-time Stream Matrix
                       </h2>
                       <div className="flex gap-2">
                          <div className="px-4 py-2 bg-black border border-white/10 text-[9px] font-bold uppercase tracking-widest rounded">Grid View</div>
                          <div className="px-4 py-2 bg-violet-600 text-white text-[9px] font-bold uppercase tracking-widest rounded shadow-lg shadow-violet-600/20 cursor-pointer">Live Audit</div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {LIVE_STUDENTS.map(student => (
                            <StudentVideoCard key={student.id} student={student} />
                        ))}
                    </div>

                    <div className="mt-12 p-8 border border-white/5 bg-black/20 text-center">
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">
                          End of Live Buffer // JavaScript WebRTC Prototcol v2.4.0
                       </p>
                    </div>

                </div>

            </main>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
            `}</style>
        </div>
    );
}

function MetricCard({ icon, label, value, color }: any) {
    return (
        <div className="p-4 bg-white/[0.02] border border-white/5 flex flex-col gap-1 group hover:border-violet-500/30 transition-all">
            <div className="flex items-center gap-2 text-slate-500 group-hover:text-violet-400 transition-colors">
                {icon}
                <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
            </div>
            <p className={`text-lg font-bold ${color}`}>{value}</p>
        </div>
    );
}

function HealthBar({ label, percentage, value, color }: any) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{label}</span>
                <span className="text-[9px] font-mono text-slate-400">{value}</span>
            </div>
            <div className="h-1 bg-white/5 overflow-hidden">
                <div className={`h-full ${color} opacity-60`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
}

function StudentVideoCard({ student }: any) {
    const isWarning = student.status === "Warning";
    const isOffline = student.status === "Offline";

    return (
        <div className={`bg-black border transition-all overflow-hidden shadow-2xl group ${
            isWarning ? 'border-red-500/40 shadow-red-500/5' : 
            isOffline ? 'border-white/5 opacity-50' : 'border-white/5 hover:border-violet-500/30'
        }`}>
            {/* Simulated Video Placeholder */}
            <div className="aspect-video bg-slate-800 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                    {isOffline ? (
                       <Loader2 size={24} className="text-slate-700 animate-spin" />
                    ) : (
                       <div className="w-full h-full bg-gradient-to-br from-indigo-900/40 to-black relative">
                          {/* Simulated Canvas Grain */}
                          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                          <User size={48} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
                              isWarning ? 'text-red-500/30' : 'text-slate-700/50'
                          }`} />
                       </div>
                    )}
                </div>

                {/* Stream Metadata Overlay */}
                <div className="absolute top-3 left-3 flex gap-2">
                    <div className={`px-2 py-1 rounded-[1px] text-[8px] font-bold uppercase tracking-tighter ${
                        isWarning ? 'bg-red-600 text-white' : 
                        isOffline ? 'bg-slate-700 text-slate-300' : 'bg-emerald-600 text-white'
                    }`}>
                        LIVE // {student.status}
                    </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end backdrop-blur-sm bg-black/20 p-2 border border-white/5">
                    <div>
                        <p className="text-xs font-bold text-white tracking-tight">{student.name}</p>
                        <p className="text-[8px] font-mono text-slate-400 uppercase">{student.bitrate} @ 30fps</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] font-bold text-violet-400 uppercase tracking-widest">Jank: 2ms</p>
                    </div>
                </div>
            </div>

            {/* Technical Metadata Footer */}
            <div className="p-4 bg-white/[0.02] border-t border-white/5 grid grid-cols-2 gap-y-3">
                <MetadataItem label="ICE Candidates" value={student.ice} />
                <MetadataItem label="SDP Exchange" value={student.sdp} />
                <MetadataItem label="Packet Loss" value={student.packetLoss} />
                <MetadataItem label="Latency" value="12ms" />
            </div>
        </div>
    );
}

function MetadataItem({ label, value }: any) {
    return (
        <div>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter mb-0.5">{label}</p>
            <p className="text-[10px] font-mono text-slate-300 capitalize">{value}</p>
        </div>
    );
}
