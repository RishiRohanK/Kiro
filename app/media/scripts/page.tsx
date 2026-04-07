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
    Zap,
    SendHorizonal
} from "lucide-react";

export default function MediaScriptsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [msg, setMsg] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const storedUser = localStorage.getItem("media_user");
        if (!storedUser) {
            router.push("/media/signin");
            return;
        }
        setUser(JSON.parse(storedUser));
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, [router]);

    const handleOnSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMsg("");
        try {
            const res = await fetch("/api/scripts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content, submittedBy: user.name }),
            });
            if (res.ok) {
                setTitle("");
                setContent("");
                setMsg("Script submitted successfully. Under review by leadership.");
                setTimeout(() => setMsg(""), 5000);
            }
        } catch (error) {
            setMsg("Submission failed. Check network.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        active
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
                        <h2 className="text-xs font-bold opacity-70 mb-0.5">Media Console / <span className="text-black">Script Submission</span></h2>
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

                <div className="p-6 sm:p-10 w-full max-w-4xl mx-auto">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-semibold mb-2">Script Submission Portal</h1>
                        <p className="text-zinc-500 text-sm">Submit your production scripts for review and deployment.</p>
                    </div>

                    <div className="bg-[#0A0A0A] border border-zinc-900 p-10 rounded-[2.5rem] shadow-2xl">
                         {msg && (
                             <div className="mb-8 p-4 bg-[#92E3A9]/10 border border-[#92E3A9]/20 rounded-2xl text-[#92E3A9] text-xs font-bold text-center">
                                {msg}
                             </div>
                         )}

                         <form onSubmit={handleOnSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Document Title</label>
                                <input 
                                    required
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Production Script v1.0"
                                    className="w-full bg-[#050505] border border-zinc-800 rounded-2xl px-6 py-4 text-sm outline-none focus:border-[#92E3A9] transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Script Content</label>
                                <textarea 
                                    required
                                    rows={12}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Paste your production script or copy here..."
                                    className="w-full bg-[#050505] border border-zinc-800 rounded-2xl px-6 py-4 text-sm outline-none focus:border-[#92E3A9] transition-all font-mono leading-relaxed resize-none"
                                />
                            </div>

                            <button 
                                disabled={isSubmitting}
                                className="w-full bg-[#92E3A9] text-black h-16 rounded-3xl font-bold flex items-center justify-center gap-3 hover:bg-white transition-all transition-colors shadow-xl shadow-[#92E3A9]/5"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        Submit Document
                                        <SendHorizonal size={18} />
                                    </>
                                )}
                            </button>
                         </form>
                    </div>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-2xl border border-dashed border-zinc-900 text-zinc-600">
                            <h4 className="text-xs font-bold text-zinc-400 mb-2">Instructions</h4>
                            <p className="text-[10px] leading-relaxed">Ensure all scripts follow the Forge Brand Guidelines. Submissions are reviewed by the CEO and CTO within 24 operational hours.</p>
                        </div>
                        <div className="p-6 rounded-2xl border border-dashed border-zinc-900 text-zinc-600">
                            <h4 className="text-xs font-bold text-zinc-400 mb-2">Metadata</h4>
                            <p className="text-[10px] leading-relaxed">Submission ID is automatically generated. Timestamp and User Identity are appended to each document for audit logging.</p>
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
