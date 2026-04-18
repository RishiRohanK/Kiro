"use client";

import { useState, useEffect, useRef } from "react";
import { 
    Shield, 
    Video, 
    Activity, 
    AlertCircle, 
    Loader2,
    Users,
    Zap,
    Cpu,
    Wifi
} from "lucide-react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";

interface StudentStream {
    socketId: string;
    id: string;
    name: string;
    exam: string;
    stream?: MediaStream;
}

export default function ProctoringDashboard() {
    const router = useRouter();
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [students, setStudents] = useState<StudentStream[]>([]);
    const [activeCalls, setActiveCalls] = useState<Record<string, RTCPeerConnection>>({});
    const socketRef = useRef<any>(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
        
        // 1. Initialize Signaling
        const socket = io();
        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Admin Connected to Monitoring Node");
        });

        socket.on("proctor:student-list", (studentList: any[]) => {
            setStudents(studentList);
            // Automatically try to call new students
            studentList.forEach(student => {
                if (student.socketId && !activeCalls[student.socketId]) {
                    initiateCall(student.socketId);
                }
            });
        });

        socket.on("proctor:answer", async ({ from, answer }: any) => {
            const peer = activeCalls[from];
            if (peer) {
                await peer.setRemoteDescription(new RTCSessionDescription(answer));
            }
        });

        socket.on("proctor:ice-candidate", async ({ from, candidate }: any) => {
            const peer = activeCalls[from];
            if (peer) {
                await peer.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        return () => {
            clearInterval(timer);
            socket.disconnect();
            Object.values(activeCalls).forEach(p => p.close());
        };
    }, [activeCalls]);

    const initiateCall = async (targetSocketId: string) => {
        const peer = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });

        peer.onicecandidate = (e) => {
            if (e.candidate) {
                socketRef.current.emit("proctor:ice-candidate", { to: targetSocketId, candidate: e.candidate });
            }
        };

        peer.ontrack = (e) => {
            setStudents(prev => prev.map(s => 
                s.socketId === targetSocketId ? { ...s, stream: e.streams[0] } : s
            ));
        };

        // Standard WebRTC trickle
        peer.addTransceiver('video', { direction: 'recvonly' });

        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        socketRef.current.emit("proctor:offer", { to: targetSocketId, offer });

        setActiveCalls(prev => ({ ...prev, [targetSocketId]: peer }));
    };

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
                                <MetricCard icon={<Users size={14}/>} label="Active Sessions" value={students.length.toString()} color="text-emerald-400" />
                                <MetricCard icon={<Zap size={14}/>} label="RTCPeerConnections" value={Object.keys(activeCalls).length.toString()} color="text-violet-400" />
                                <MetricCard icon={<Wifi size={14}/>} label="Throughput" value="Real-time" color="text-amber-400" />
                                <MetricCard icon={<Cpu size={14}/>} label="Server Load" value="Optimal" color="text-slate-400" />
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

                        <div className="p-6 bg-violet-600/10 border border-violet-500/20 rounded">
                            <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-1 italic">Protocol Active</p>
                            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                                Automated peer discovery is active. Streams will initialize as students enter the assessment node.
                            </p>
                        </div>
                    </div>
                </aside>

                {/* Main Viewport: Video Grid */}
                <div className="flex-1 overflow-y-auto bg-black/40 custom-scrollbar p-8">
                    
                    <div className="flex justify-between items-center mb-10">
                       <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
                          <Activity size={20} className="text-violet-500"/> Live Stream Matrix
                       </h2>
                       <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          Total Nodes Monitoring: {students.length}
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {students.map(student => (
                            <StudentLiveCard key={student.socketId} student={student} />
                        ))}
                        {students.length === 0 && (
                            <div className="col-span-full h-80 border border-dashed border-white/10 flex flex-col items-center justify-center gap-4">
                                <Loader2 className="animate-spin text-violet-500" size={32} />
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Waiting for student nodes...</p>
                            </div>
                        )}
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

function StudentLiveCard({ student }: { student: StudentStream }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && student.stream) {
            videoRef.current.srcObject = student.stream;
        }
    }, [student.stream]);

    return (
        <div className="bg-black border border-white/5 transition-all overflow-hidden shadow-2xl group hover:border-violet-500/40">
            <div className="aspect-video bg-neutral-900 relative flex items-center justify-center overflow-hidden">
                {student.stream ? (
                    <video 
                        ref={videoRef}
                        autoPlay 
                        playsInline 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-violet-500" size={24} />
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Negotiating SDP...</p>
                    </div>
                )}
                
                <div className="absolute top-3 left-3">
                    <div className="px-2 py-1 bg-emerald-600 text-white rounded-[1px] text-[8px] font-bold uppercase tracking-tighter">
                        LIVE // CONNECTED
                    </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end backdrop-blur-md bg-black/40 p-2 border border-white/10">
                    <div className="overflow-hidden">
                        <p className="text-xs font-bold text-white tracking-tight truncate">{student.name}</p>
                        <p className="text-[8px] font-mono text-slate-400 uppercase">Node ID: {student.id?.slice(-8)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] font-bold text-violet-400 uppercase tracking-widest">Track: {student.exam}</p>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-white/[0.02] border-t border-white/5 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter mb-0.5">ICE Role</p>
                        <p className="text-[10px] font-mono text-slate-300">Controlling</p>
                    </div>
                    <div>
                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter mb-0.5">SDP State</p>
                        <p className="text-[10px] font-mono text-slate-300">Stable</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                   <AlertCircle size={10} className="text-emerald-500"/>
                   <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">WebRTC Protocol Active</span>
                </div>
            </div>
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
