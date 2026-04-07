"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
    LayoutDashboard, 
    Settings, 
    LogOut, 
    Menu, 
    X,
    User,
    Mail,
    ShieldCheck,
    FileText,
    ClipboardCheck,
    Loader2,
    CheckCircle,
    Clock,
    Zap
} from "lucide-react";

export default function MediaTasksPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    const fetchTasks = async () => {
        try {
            const res = await fetch("/api/tasks");
            const data = await res.json();
            if (data.success) {
                setTasks(data.tasks);
            }
        } catch (error) {
            console.error("Failed to fetch tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setMounted(true);
        const storedUser = localStorage.getItem("media_user");
        if (!storedUser) {
            router.push("/media/signin");
            return;
        }
        setUser(JSON.parse(storedUser));
        fetchTasks();

        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("media_user");
        router.push("/media/signin");
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#050505] text-white flex overflow-hidden font-sans">
            {}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} border-r border-zinc-900 bg-[#0A0A0A] flex flex-col transition-all duration-300 z-50`}>
                <div className="p-6 flex items-center justify-between">
                    {sidebarOpen && (
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#92E3A9] animate-pulse" />
                            <span className="text-xs font-black text-[#92E3A9]">Forge Media</span>
                        </div>
                    )}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                        {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
                    </button>
                </div>

                <nav className="flex-1 mt-6 px-4 space-y-2">
                    <NavItem 
                        icon={<LayoutDashboard size={20} />} 
                        label="Overview" 
                        open={sidebarOpen} 
                        onClick={() => router.push('/media/dashboard')}
                    />
                    <NavItem 
                        icon={<ClipboardCheck size={20} />} 
                        label="Admin Tasks" 
                        active
                        open={sidebarOpen} 
                        onClick={() => router.push('/media/tasks')}
                    />
                    <NavItem 
                        icon={<FileText size={20} />} 
                        label="Script Submit" 
                        open={sidebarOpen} 
                        onClick={() => router.push('/media/scripts')}
                    />
                    <NavItem 
                        icon={<Settings size={20} />} 
                        label="Settings" 
                        open={sidebarOpen} 
                        onClick={() => router.push('/media/settings')}
                    />
                </nav>

                <div className="p-4 mt-auto border-t border-zinc-900">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-all"
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span className="text-sm font-bold">Disconnect</span>}
                    </button>
                </div>
            </aside>

            {}
            <main className="flex-1 overflow-y-auto relative">
                {}
                <header className="h-20 border-b border-black/5 flex items-center justify-between px-6 bg-[#92E3A9] sticky top-0 z-40 text-zinc-900">
                    <div className="flex flex-col">
                        <h2 className="text-xs font-bold opacity-70 mb-0.5">Media Console / <span className="text-black">Tasks</span></h2>
                        <p className="text-[10px] font-semibold opacity-50">
                            {mounted ? currentTime.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' }) : "..."}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold">{user.name}</p>
                            <p className="text-[10px] font-bold opacity-60 lowercase italic">Media Agent</p>
                        </div>
                        <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-[#92E3A9] font-bold">
                            <User size={20} />
                        </div>
                    </div>
                </header>

                <div className="p-6 sm:p-10 w-full max-w-6xl">
                    <div className="mb-10">
                        <h1 className="text-3xl font-semibold mb-2">Admin Tasks</h1>
                        <p className="text-zinc-500 text-sm">Direct instructions from the CEO and Management.</p>
                    </div>

                    {loading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4 text-zinc-600">
                            <Loader2 className="w-8 h-8 animate-spin text-[#92E3A9]" />
                            <p className="text-xs font-bold uppercase tracking-widest">Querying Task Engine...</p>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="h-64 border border-zinc-900 rounded-[2.5rem] bg-zinc-900/10 flex flex-col items-center justify-center gap-4 text-zinc-600">
                            <CheckCircle className="w-12 h-12 opacity-10" />
                            <p className="text-sm font-medium">All systems clear. No pending tasks.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tasks.map((task) => (
                                <div key={task.id} className="bg-zinc-900/30 border border-zinc-900 p-8 rounded-[2rem] hover:border-[#92E3A9]/30 transition-all flex flex-col">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-10 h-10 bg-[#92E3A9]/10 rounded-xl flex items-center justify-center text-[#92E3A9]">
                                            <Zap size={20} />
                                        </div>
                                        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-1.5">
                                            <Clock size={10} className="text-zinc-500" />
                                            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                                                {new Date(task.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-lg font-bold text-white mb-3">{task.title}</h3>
                                    <p className="text-xs text-zinc-500 leading-relaxed font-medium mb-8 flex-1 italic">
                                        "{task.description}"
                                    </p>

                                    <div className="pt-6 border-t border-zinc-800 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                                            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Incoming</span>
                                        </div>
                                        <button className="text-[10px] font-bold text-[#92E3A9] hover:underline uppercase tracking-widest underline-offset-4">
                                            Acknowledge
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function NavItem({ icon, label, active = false, open, onClick }: { icon: any, label: string, active?: boolean, open: boolean, onClick?: () => void }) {
    return (
        <button 
            onClick={onClick}
            className={`
            w-full flex items-center gap-4 p-3 rounded-xl transition-all
            ${active ? 'bg-[#92E3A9] text-black shadow-[0_10px_20px_rgba(146,227,169,0.15)]' : 'text-zinc-500 hover:text-white hover:bg-zinc-800'}
        `}>
            {icon}
            {open && <span className="text-sm font-bold">{label}</span>}
        </button>
    );
}
