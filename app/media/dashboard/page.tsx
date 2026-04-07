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
    ClipboardCheck
} from "lucide-react";

export default function MediaDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mounted, setMounted] = useState(false);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    useEffect(() => {
        setMounted(true);
        const storedUser = localStorage.getItem("media_user");
        if (!storedUser) {
            router.push("/media/signin");
            return;
        }
        const parsed = JSON.parse(storedUser);
        
        
        if (parsed.role !== "MEDIA_TEAM" || !parsed.isApproved) {
            localStorage.removeItem("media_user"); 
            router.push("/media/signin?error=pending");
            return;
        }
        
        setUser(parsed);

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

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
                        active 
                        open={sidebarOpen} 
                        onClick={() => router.push('/media/dashboard')}
                    />
                    <NavItem 
                        icon={<ClipboardCheck size={20} />} 
                        label="Admin Tasks" 
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
                <header className="h-20 border-b border-black/5 flex items-center justify-between px-6 bg-[#92E3A9] sticky top-0 z-40">
                    <div className="flex flex-col">
                        <h2 className="text-xs font-bold text-zinc-900/70 mb-0.5">Team Console / <span className="text-zinc-900">Overview</span></h2>
                        <p className="text-[10px] font-semibold text-zinc-900/50">
                            {mounted ? currentTime.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' }) : "..."}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-bold text-zinc-900">{user.name}</p>
                            <p className="text-[10px] font-bold text-zinc-900/60 lowercase italic">Media Team Active</p>
                        </div>
                        <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-[#92E3A9] font-bold">
                            <User size={20} />
                        </div>
                    </div>
                </header>

                <div className="p-6 sm:p-10 w-full">
                    <div className="relative rounded-[2rem] bg-gradient-to-br from-[#111111] to-[#0A0A0A] border border-zinc-800 p-10 overflow-hidden shadow-2xl">
                        {}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#92E3A9]/5 rounded-full blur-[100px] -mr-32 -mt-32" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-zinc-500/5 rounded-full blur-[100px] -ml-32 -mb-32" />

                        <div className="relative z-10">
                            <h1 className="text-5xl font-semibold mb-4 tracking-tight leading-none">
                                {mounted ? getGreeting() : "Hello"}, <span className="text-[#92E3A9]">{user.name.split(' ')[0]}</span>
                            </h1>
                            
                            <p className="text-lg text-zinc-400 font-medium max-w-xl leading-relaxed mt-4">
                                Your identity has been verified by the CTO. You now have full access to the Media Team dashboard and production assets.
                            </p>
                        </div>
                    </div>
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

function StatCard({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.08] transition-colors cursor-default">
            <p className="text-[10px] font-bold text-zinc-500 mb-2">{label}</p>
            <p className="text-3xl font-black text-white">{value}</p>
        </div>
    );
}
