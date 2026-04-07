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
    Calendar,
    Clock,
    FileText,
    ClipboardCheck
} from "lucide-react";

export default function MediaSettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mounted, setMounted] = useState(false);

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
                        active 
                        open={sidebarOpen} 
                        onClick={() => router.push('/media/settings')}
                    />
                </nav>

                <div className="p-4 mt-auto border-t border-zinc-900">
                    <button 
                        onClick={handleLogout}
                        className="w-full h-12 flex items-center gap-3 p-3 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl transition-all"
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span className="text-sm font-semibold">Disconnect</span>}
                    </button>
                </div>
            </aside>

            {}
            <main className="flex-1 overflow-y-auto relative">
                {}
                <header className="h-20 border-b border-black/5 flex items-center justify-between px-6 bg-[#92E3A9] sticky top-0 z-40">
                    <div className="flex flex-col">
                        <h2 className="text-xs font-bold text-zinc-900/70 mb-0.5">Team Console / <span className="text-zinc-900">Settings</span></h2>
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
                    <div className="max-w-4xl">
                        <h1 className="text-3xl font-semibold mb-8 text-white tracking-tight">Account Settings</h1>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {}
                            <div className="bg-[#0A0A0A] border border-zinc-900 rounded-3xl p-8">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-16 h-16 bg-[#92E3A9] rounded-2xl flex items-center justify-center text-zinc-900">
                                        <User size={32} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{user.name}</h3>
                                        <p className="text-xs font-bold text-[#92E3A9] uppercase tracking-wider">{user.role.replace('_', ' ')}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <DetailItem 
                                        icon={<User className="w-4 h-4 text-zinc-500" />} 
                                        label="Full Name" 
                                        value={user.name} 
                                    />
                                    <DetailItem 
                                        icon={<Mail className="w-4 h-4 text-zinc-500" />} 
                                        label="Email Address" 
                                        value={user.email} 
                                    />
                                    <DetailItem 
                                        icon={<ShieldCheck className="w-4 h-4 text-zinc-500" />} 
                                        label="Authorization Status" 
                                        value={user.isApproved ? "Verified Agent" : "Pending Approval"} 
                                        valueColor={user.isApproved ? "text-green-500" : "text-yellow-500"}
                                    />
                                </div>
                            </div>

                            {}
                            <div className="bg-[#0A0A0A] border border-zinc-900 rounded-3xl p-8 flex flex-col">
                                <h3 className="text-lg font-bold text-white mb-6">Security & Access</h3>
                                
                                <div className="space-y-6 flex-1">
                                    <DetailItem 
                                        icon={<Calendar className="w-4 h-4 text-zinc-500" />} 
                                        label="Creation Date" 
                                        value={mounted ? new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : "..."} 
                                    />
                                    <DetailItem 
                                        icon={<Clock className="w-4 h-4 text-zinc-500" />} 
                                        label="Session Status" 
                                        value="Active System Login" 
                                    />
                                </div>

                                <div className="mt-8 pt-6 border-t border-zinc-900/50">
                                    <button 
                                        onClick={handleLogout}
                                        className="text-xs font-bold text-[#FF0000] hover:underline uppercase tracking-widest"
                                    >
                                        Revoke All Tokens
                                    </button>
                                </div>
                            </div>
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

function DetailItem({ icon, label, value, valueColor = "text-white" }: { icon: any, label: string, value: string, valueColor?: string }) {
    return (
        <div className="flex items-start gap-4">
            <div className="mt-1">{icon}</div>
            <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{label}</p>
                <p className={`text-sm font-bold ${valueColor}`}>{value}</p>
            </div>
        </div>
    );
}
