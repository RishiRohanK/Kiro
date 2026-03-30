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
    Kanban
} from "lucide-react";

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
        { name: "Overview", icon: LayoutDashboard, slug: "/intern/dashboard", isNew: false },
        { name: "Kanban", icon: Kanban, slug: "/intern/dashboard?view=kanban", isNew: true },
        { name: "Community", icon: MessageSquare, slug: "/intern/dashboard?view=community", isNew: false },
        { name: "Assignments", icon: Briefcase, slug: "/intern/dashboard?view=tasks", isNew: false },
        { name: "Roadmap", icon: Calendar, slug: "/intern/dashboard/schedule", isNew: false },
        { name: "Attendance", icon: FileBadge, slug: "/intern/dashboard?view=attendance", isNew: false },
        { name: "Settings", icon: Settings, slug: "/intern/dashboard/settings", isNew: false },
    ];

    return (
        <div className="min-h-screen bg-white text-zinc-900 flex font-sans">
            {/* Modern Gray Sidebar */}
            <aside className="w-20 lg:w-64 flex flex-col bg-[#F4F4F5] h-screen sticky top-0 z-50 border-r border-zinc-200 rounded-none">
                <div className="p-8 pb-10 flex flex-col items-center lg:items-start gap-4">
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
                                className={`flex items-center justify-center lg:justify-start h-11 px-4 gap-4 transition-all duration-200 group ${
                                    isActive 
                                    ? "bg-white text-black shadow-sm border border-zinc-200 font-bold" 
                                    : "text-zinc-500 hover:text-black hover:bg-white/50"
                                }`}
                            >
                                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-[#0055FF]" : ""} />
                                <span className="hidden lg:flex lg:flex-1 items-center justify-between text-[14px]">
                                    {item.name}
                                    {item.isNew && (
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600 uppercase tracking-wider leading-none">
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
                        className={`w-full h-11 flex items-center justify-center lg:justify-start px-4 gap-4 font-bold transition-all ${
                            handRaised 
                            ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" 
                            : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                        }`}
                    >
                        {isTogglingHand ? (
                            <div className="h-4 w-4 border-2 border-zinc-400 border-t-zinc-900 animate-spin mx-auto lg:mx-0" />
                        ) : (
                            <Hand size={18} className={handRaised ? "animate-bounce" : ""} />
                        )}
                        <span className="hidden lg:block text-[12px] font-bold">
                            {handRaised ? "Help Active" : "Raise Hand"}
                        </span>
                    </button>

                    <button 
                        onClick={handleLogout}
                        className="w-full h-11 flex items-center justify-center lg:justify-start px-4 gap-4 bg-red-600 text-white hover:bg-red-700 transition-all font-bold shadow-lg shadow-red-500/20"
                    >
                        <LogOut size={18} className="text-white" />
                        <span className="hidden lg:block text-[12px] font-bold">Log out</span>
                    </button>
                </div>
            </aside>

            {/* Compact Minimal Top Navbar */}
            <div className="flex-1 flex flex-col">
                <header className="h-12 flex items-center justify-between px-8 bg-[#0055FF] sticky top-0 z-40 text-white shadow-lg shadow-blue-500/10">
                    <div className="flex items-center gap-3">
                        <span className="text-[11px] font-medium text-blue-100/80">Portal Node</span>
                        <ChevronRight size={12} className="text-blue-100/40" />
                        <span className="text-[12px] font-bold">
                           {navItems.find(item => {
                               const itemUrl = new URL(item.slug, "http://localhost");
                               const itemPath = itemUrl.pathname;
                               const itemView = itemUrl.searchParams.get("view");
                               return pathname === itemPath && (itemView === currentView || (!itemView && !currentView));
                           })?.name || "Portal"}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-3 pr-3 border-r border-white/10">
                            <div className="text-right">
                               <p className="text-[12px] font-bold text-white leading-none">{user.name}</p>
                               <p className="text-[9px] text-blue-100/60 font-medium mt-0.5 leading-none">Authentication: Global</p>
                            </div>
                            <div className="h-8 w-8 bg-white text-[#0055FF] rounded-none flex items-center justify-center text-[12px] font-bold">
                                {user.name[0]}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1">
                    {children}
                </main>
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
