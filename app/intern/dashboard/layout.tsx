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
    Kanban,
    X
} from "lucide-react"; 

import { motion, AnimatePresence } from "framer-motion";

import { Menu } from "lucide-react";

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
                // Ignore silent errors
            }
        };
        sendPulse(); // Initial
        const interval = setInterval(sendPulse, 30000); // Every 30s
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
                // Update local storage too
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
        { name: "Kanban", icon: Kanban, slug: "/intern/dashboard?view=kanban", isNew: true, mobile: true },
        { name: "Group Chat", icon: MessageSquare, slug: "/intern/dashboard?view=chat", isNew: false, mobile: true },
        { name: "Roadmap", icon: Calendar, slug: "/intern/dashboard/schedule", isNew: false, mobile: true },
        { name: "Assignments", icon: Briefcase, slug: "/intern/dashboard?view=tasks", isNew: false, mobile: false },
        { name: "Attendance", icon: FileBadge, slug: "/intern/dashboard?view=attendance", isNew: false, mobile: false },
        { name: "Settings", icon: Settings, slug: "/intern/dashboard/settings", isNew: false, mobile: false },
    ];

    return (
        <div className="min-h-screen bg-white text-zinc-900 flex flex-col lg:flex-row font-sans overflow-x-hidden">
            {/* Desktop Side Navigation */}
            <aside className="hidden lg:flex w-64 flex-col bg-[#F4F4F5] h-screen sticky top-0 z-50 border-r border-zinc-200">
                <div className="p-8 pb-10 flex flex-col items-start gap-4">
                    <img 
                        src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1774885412/Screenshot_2026-03-30_at_21.13.11-removebg-preview_gaqcdz.png" 
                        alt="Company Logo" 
                        className="h-9 w-auto object-contain"
                    />
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map((item) => {
                        const itemUrl = new URL(item.slug, "http://localhost");
                        const itemPath = itemUrl.pathname;
                        const itemView = itemUrl.searchParams.get("view");
                        const isActive = pathname === itemPath && (itemView === currentView || (!itemView && !currentView));
                        
                        return (
                            <Link 
                                key={item.name}
                                href={item.slug} 
                                className={`flex items-center h-11 px-4 gap-4 transition-all duration-200 group rounded-sm ${
                                    isActive 
                                    ? "bg-white text-black shadow-sm border border-zinc-200 font-bold" 
                                    : "text-zinc-500 hover:text-black hover:bg-white/50"
                                }`}
                            >
                                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-[#0055FF]" : ""} />
                                <span className="flex flex-1 items-center justify-between text-[14px]">
                                    {item.name}
                                    {item.isNew && (
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 uppercase tracking-wider leading-none">
                                            New
                                        </span>
                                    )}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 mt-auto border-t border-zinc-200 space-y-2">
                    <button 
                        onClick={toggleHand}
                        disabled={isTogglingHand}
                        className={`w-full h-11 flex items-center px-4 gap-4 font-bold transition-all ${
                            handRaised 
                            ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" 
                            : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                        }`}
                    >
                        {isTogglingHand ? (
                            <div className="h-4 w-4 border-2 border-zinc-400 border-t-zinc-900 animate-spin" />
                        ) : (
                            <Hand size={18} className={handRaised ? "animate-bounce" : ""} />
                        )}
                        <span className="text-[12px] font-bold">
                            {handRaised ? "Help Active" : "Raise Hand"}
                        </span>
                    </button>

                    <button 
                        onClick={handleLogout}
                        className="w-full h-11 flex items-center px-4 gap-4 bg-red-600 text-white hover:bg-red-700 transition-all font-bold shadow-lg shadow-red-500/20"
                    >
                        <LogOut size={18} className="text-white" />
                        <span className="text-[12px] font-bold">Log out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header Navigation */}
                <header className="h-14 lg:h-12 flex items-center justify-between px-4 lg:px-8 bg-[#0055FF] sticky top-0 z-[60] text-white shadow-lg shadow-blue-500/10">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-white hover:bg-white/10 transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="hidden sm:inline text-[11px] font-medium text-blue-100/80">Portal Node</span>
                            <ChevronRight size={12} className="hidden sm:inline text-blue-100/40" />
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
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden xs:block">
                               <p className="text-[12px] font-bold text-white leading-none truncate max-w-[100px]">{user.name}</p>
                               <p className="text-[9px] text-blue-100/60 font-medium mt-0.5 leading-none">Session: Active</p>
                            </div>
                            <div className="h-8 w-8 bg-white text-[#0055FF] flex items-center justify-center text-[12px] font-bold font-mono">
                                {user.name[0]}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 pb-20 lg:pb-0">
                    {children}
                </main>

                {/* Mobile Bottom Navigation (Edge-to-Edge Dark) */}
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

                {/* Mobile Side Drawer */}
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
                                        src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1774885412/Screenshot_2026-03-30_at_21.13.11-removebg-preview_gaqcdz.png" 
                                        alt="Logo" 
                                        className="h-7 w-auto"
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
