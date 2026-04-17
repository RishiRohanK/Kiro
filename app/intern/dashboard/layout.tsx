"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { 
    LayoutDashboard, 
    LogOut, 
    User, 
    Settings,
    ChevronRight,
    Briefcase,
    Calendar,
    ShieldCheck,
    Hand,
    MessageSquare,
    FileBadge,
    FileText,
    Kanban,
    ClipboardCheck,
    BookOpen,
    Flame,
    Layers,
    X,
    Menu,
    ChevronLeft
} from "lucide-react"; 

import { motion, AnimatePresence } from "framer-motion";

function InternDashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentView = searchParams.get("view");
    const [user, setUser] = useState<any>(null);
    const [mounted, setMounted] = useState(false);
    const [handRaised, setHandRaised] = useState(false);
    const [isTogglingHand, setIsTogglingHand] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        const storedUser = localStorage.getItem("intern_user");
        if (!storedUser) {
            router.push("/intern/signin");
            return;
        }
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setHandRaised(userData.handRaised || false);
    }, [router]);

    useEffect(() => {
        if (!user) return;
        const sendPulse = async () => {
            try {
                await fetch("/api/intern/pulse", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.id })
                });
            } catch (err) {
                
            }
        };
        sendPulse(); 
        const interval = setInterval(sendPulse, 30000); 
        return () => clearInterval(interval);
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem("intern_user");
        router.push("/intern/signin");
    };

    const toggleHand = async () => {
        if (!user) return;
        setIsTogglingHand(true);
        try {
            const res = await fetch("/api/intern/hand", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ internId: user.id, raised: !handRaised }),
            });
            const data = await res.json();
            if (data.success) {
                setHandRaised(data.handRaised);
                
                const updatedUser = { ...user, handRaised: data.handRaised };
                localStorage.setItem("intern_user", JSON.stringify(updatedUser));
                setUser(updatedUser);
            }
        } catch (error) {
            console.error("Failed to toggle hand");
        } finally {
            setIsTogglingHand(false);
        }
    };

    if (!mounted || !user) return null;

    const navItems = [
        { name: "Overview", icon: LayoutDashboard, slug: "/intern/dashboard", isNew: false, mobile: true },
        { name: "Stack Flow", icon: Layers, slug: "/intern/dashboard/stack-flow", isNew: false, mobile: true },
        { name: "Exams", icon: ClipboardCheck, slug: "/intern/dashboard/exams", isNew: false, mobile: true },
        { name: "Resources", icon: BookOpen, slug: "/intern/dashboard/resources", isNew: false, mobile: true },
        { name: "Reports", icon: FileText, slug: "/intern/dashboard/reports", isNew: false, mobile: true },
        { name: "Kanban", icon: Kanban, slug: "/intern/dashboard?view=kanban", isNew: false, mobile: false },
        { name: "Group Chat", icon: MessageSquare, slug: "/intern/dashboard?view=chat", isNew: false, mobile: false },
        { name: "Roadmap", icon: Calendar, slug: "/intern/dashboard/schedule", isNew: false, mobile: true },
        { name: "Assignments", icon: Briefcase, slug: "/intern/dashboard?view=tasks", isNew: false, mobile: false },
        { name: "Attendance", icon: FileBadge, slug: "/intern/dashboard?view=attendance", isNew: false, mobile: false },
        { name: "Settings", icon: Settings, slug: "/intern/dashboard/settings", isNew: false, mobile: false },
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 flex flex-col font-sans">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-[#E0E7FF] border-r border-[#003366]/5 z-50">
                <div className="p-8 pb-10 flex flex-col items-start">
                    <img 
                        src="https://ik.imagekit.io/dypkhqxip/learngrid?updatedAt=1775552006855" 
                        alt="Learn Grid" 
                        className="h-8 w-auto"
                    />
                </div>

                <nav className="flex-1 px-4 space-y-0.5">
                    {navItems.map((item) => {
                        const itemUrl = new URL(item.slug, "http://localhost");
                        const itemPath = itemUrl.pathname;
                        const itemView = itemUrl.searchParams.get("view");
                        const isActive = pathname === itemPath && (itemView === currentView || (!itemView && !currentView));
                        
                        return (
                            <Link 
                                key={item.name}
                                href={item.slug} 
                                className={`flex items-center h-10 px-4 gap-3 transition-all duration-200 group rounded-none ${
                                    isActive 
                                    ? "bg-white text-[#003366] shadow-sm font-bold" 
                                    : "text-[#003366]/40 hover:text-[#003366] hover:bg-white/30"
                                }`}
                            >
                                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-[#003366]" : "text-[#003366]/30 group-hover:text-[#003366]"} />
                                <span className="flex flex-1 items-center justify-between text-[13px]">
                                    <span className="flex items-center gap-2">
                                        {item.name}
                                        {(item.name === "Exams" || item.name === "Resources" || item.name === "Stack Flow") && (
                                            <Flame size={12} className="text-orange-500 fill-orange-500/20" />
                                        )}
                                    </span>
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto p-4 space-y-4 border-t border-[#003366]/5">

                    <div className="space-y-2">
                        <button 
                            onClick={toggleHand}
                            disabled={isTogglingHand}
                            className={`w-full h-11 flex items-center justify-center gap-3 transition-all text-[12px] font-bold shadow-sm ${
                                handRaised 
                                ? "bg-amber-500 text-white" 
                                : "bg-yellow-400 text-black hover:bg-yellow-500"
                            }`}
                        >
                            {isTogglingHand ? (
                                <div className="h-4 w-4 border-2 border-black/20 border-t-black animate-spin" />
                            ) : (
                                <Hand size={18} className={handRaised ? "animate-bounce" : ""} />
                            )}
                            <span>{handRaised ? "Help Active" : "Raise Hand"}</span>
                        </button>

                        <button 
                            onClick={handleLogout}
                            className="w-full h-11 flex items-center justify-center gap-3 bg-red-600 text-white hover:bg-red-700 transition-all text-[12px] font-bold shadow-sm"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {}
            <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
                {/* Header */}
                <header className="h-14 lg:h-12 flex items-center justify-between px-4 lg:px-8 bg-zinc-100 border-b border-zinc-200 sticky top-0 z-[60] text-zinc-900 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-zinc-600 hover:bg-zinc-200 transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="hidden sm:inline text-[11px] font-medium text-zinc-500">Portal Node</span>
                            <ChevronRight size={12} className="hidden sm:inline text-zinc-300" />
                            <span className="text-[12px] font-bold">
                               {navItems.find(item => {
                                   const itemUrl = new URL(item.slug, "http://localhost");
                                   const itemPath = itemUrl.pathname;
                                   const itemView = itemUrl.searchParams.get("view");
                                   return pathname === itemPath && (itemView === currentView || (!itemView && !currentView));
                               })?.name || "Portal"}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest border border-emerald-100 hidden sm:block">
                           Secure Session
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 lg:p-0 pb-20 lg:pb-10">
                    {children}
                </main>

                {}
                <nav className="fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-white/10 lg:hidden flex items-center justify-around px-2 z-50 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.2)]">
                    {navItems.filter(i => i.mobile).map((item) => {
                        const itemUrl = new URL(item.slug, "http://localhost");
                        const itemPath = itemUrl.pathname;
                        const itemView = itemUrl.searchParams.get("view");
                        const isActive = pathname === itemPath && (itemView === currentView || (!itemView && !currentView));
                        
                        return (
                            <Link 
                                key={item.name}
                                href={item.slug} 
                                className={`flex flex-col items-center justify-center gap-1 transition-all ${
                                    isActive ? "text-white" : "text-zinc-500"
                                }`}
                            >
                                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                <span className={`text-[9px] font-bold uppercase tracking-tight ${isActive ? "text-white" : "text-zinc-500"}`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] lg:hidden"
                            />
                            <motion.aside 
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed inset-y-0 left-0 w-[280px] bg-[#F4F4F5] z-[80] lg:hidden flex flex-col border-r border-zinc-200"
                            >
                                <div className="p-6 border-b border-zinc-200 flex items-center justify-between bg-white">
                                    <img 
                                        src="https://ik.imagekit.io/dypkhqxip/learngrid" 
                                        alt="Learn Grid Logo" 
                                        className="h-6 w-auto"
                                    />
                                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-zinc-400">
                                        <X size={20} />
                                    </button>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                                    {navItems.map((item) => {
                                        const itemUrl = new URL(item.slug, "http://localhost");
                                        const itemPath = itemUrl.pathname;
                                        const itemView = itemUrl.searchParams.get("view");
                                        const isActive = pathname === itemPath && (itemView === currentView || (!itemView && !currentView));
                                        
                                        return (
                                            <Link 
                                                key={item.name}
                                                href={item.slug} 
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center h-12 px-4 gap-4 rounded-lg transition-all ${
                                                    isActive 
                                                    ? "bg-white text-[#0055FF] shadow-sm font-bold border border-zinc-200" 
                                                    : "text-zinc-500 hover:bg-white/50"
                                                }`}
                                            >
                                                <item.icon size={20} />
                                                <span className="text-sm font-semibold">{item.name}</span>
                                            </Link>
                                        );
                                    })}
                                </div>

                                <div className="p-4 border-t border-zinc-200 space-y-2 bg-white">
                                    <button 
                                        onClick={() => { toggleHand(); setIsMobileMenuOpen(false); }}
                                        disabled={isTogglingHand}
                                        className={`w-full h-12 flex items-center px-4 gap-4 font-bold rounded-lg ${
                                            handRaised 
                                            ? "bg-amber-500 text-white" 
                                            : "bg-zinc-100 text-zinc-600"
                                        }`}
                                    >
                                        <Hand size={20} className={handRaised ? "animate-bounce" : ""} />
                                        <span className="text-sm">Raise Help Hand</span>
                                    </button>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full h-12 flex items-center px-4 gap-4 bg-red-600 text-white font-bold rounded-lg"
                                    >
                                        <LogOut size={20} />
                                        <span className="text-sm">Logout Session</span>
                                    </button>
                                </div>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default function InternDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <InternDashboardLayoutContent>
        {children}
      </InternDashboardLayoutContent>
    </Suspense>
  );
}
