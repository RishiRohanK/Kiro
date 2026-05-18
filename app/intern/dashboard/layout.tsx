"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
    LayoutDashboard,
    LogOut,
    User,

    ChevronRight,
    Briefcase,
    Calendar,
    ShieldCheck,
    Hand,
    MessageSquare,
    FileBadge,
    FileText,

    ClipboardCheck,
    BookOpen,
    X,
    Menu,
    Bell,
    ChevronDown,
    School,
    Users,
    Edit3,
    Target,
    Sparkles,
    Flame,
    Pin,
    ChevronLeft as CollapseIcon
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
    const [isProfileComplete, setIsProfileComplete] = useState(true);
    const [checkingProfile, setCheckingProfile] = useState(true);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isSidebarPinned, setIsSidebarPinned] = useState(false);
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);
    const isSidebarCollapsed = !(isSidebarPinned || isSidebarHovered);
    const [streakCount, setStreakCount] = useState(0);

    useEffect(() => {
        setMounted(true);
        const savedCollapse = localStorage.getItem('sidebar_manual_collapse');
        if (savedCollapse === 'false') {
            setIsSidebarPinned(true);
        } else if (savedCollapse === 'true') {
            setIsSidebarPinned(false);
        } else {
            // Default to pinned if not set for best first time UX
            setIsSidebarPinned(true);
        }
        const initSession = async () => {
            let userData = null;
            const storedUser = localStorage.getItem("intern_user");

            if (storedUser) {
                userData = JSON.parse(storedUser);
            } else {
                // If local storage is empty, try to sync with server (OAuth case)
                try {
                    const res = await fetch("/api/intern/me");
                    const data = await res.json();
                    if (data.success) {
                        userData = data.user;
                        localStorage.setItem("intern_user", JSON.stringify(userData));
                    } else {
                        router.push("/intern/signin");
                        return;
                    }
                } catch (err) {
                    router.push("/intern/signin");
                    return;
                }
            }

            if (!userData) {
                router.push("/intern/signin");
                return;
            }

            setUser(userData);
            setHandRaised(userData.handRaised || false);

            // Check for profile completion
            const requiredFields = ['name', 'college', 'year', 'department', 'dob', 'graduationYear', 'interestedArea', 'profileImage'];
            const completed = requiredFields.every(field => {
                const val = userData[field];
                return val !== null && val !== undefined && val.toString().trim() !== "";
            });
            setIsProfileComplete(completed);
            setCheckingProfile(false);
        };

        initSession();
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
        const interval = setInterval(sendPulse, 120000);
        return () => clearInterval(interval);
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem("intern_user");
        router.push("/intern/signin");
    };

    useEffect(() => {
        if (!user) return;
        const fetchStreak = async () => {
            try {
                const res = await fetch(`/api/intern/attendance?internId=${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.history && data.history.length > 0) {
                        const sorted = [...data.history].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
                        let s = 0;
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const firstDate = new Date(sorted[0].date);
                        firstDate.setHours(0, 0, 0, 0);
                        const diff = (today.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
                        if (diff <= 1) {
                            for (let i = 0; i < sorted.length; i++) {
                                if (sorted[i].status === 'PRESENT' || sorted[i].status === 'LATE') {
                                    s++;
                                    if (i < sorted.length - 1) {
                                        const current = new Date(sorted[i].date);
                                        current.setHours(0, 0, 0, 0);
                                        const next = new Date(sorted[i + 1].date);
                                        next.setHours(0, 0, 0, 0);
                                        const gap = (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24);
                                        if (gap > 1) break;
                                    }
                                } else {
                                    break;
                                }
                            }
                        }
                        setStreakCount(s);
                    }
                }
            } catch (err) {
                console.error("Streak fetch failed");
            }
        };
        fetchStreak();

        // Listen for real-time updates from child components
        const handleUpdate = () => fetchStreak();
        window.addEventListener('attendance-updated', handleUpdate);
        
        // Expose global refresh for other components
        (window as any).refreshInternStreak = fetchStreak;

        const interval = setInterval(fetchStreak, 15000); // Poll every 15 seconds for real-time feel
        return () => {
            clearInterval(interval);
            window.removeEventListener('attendance-updated', handleUpdate);
            delete (window as any).refreshInternStreak;
        };
    }, [user]);

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

    if (!mounted || !user || checkingProfile) return null;

    const onProfilePage = pathname === "/intern/dashboard/profile";

    const navItems = [
        { name: "Overview", icon: LayoutDashboard, slug: "/intern/dashboard?view=overview", mobile: true },
        { name: "Internships", icon: Briefcase, slug: "/intern/dashboard?view=internships", mobile: true },
        { name: "Roadmap", icon: Calendar, slug: "/intern/dashboard/schedule", mobile: true },
        { name: "Tasks", icon: Target, slug: "/intern/dashboard?view=tasks", mobile: false },
        { name: "Resume Builder", icon: FileText, slug: "/intern/dashboard/resume", mobile: true },
        { name: "Attendance", icon: FileBadge, slug: "/intern/dashboard?view=attendance", mobile: false },
        { name: "Group Chat", icon: MessageSquare, slug: "/intern/dashboard?view=chat", mobile: false },
        { name: "Profile", icon: User, slug: "/intern/dashboard/profile", mobile: false },
        { name: "News & Updates", icon: Bell, slug: "/intern/dashboard/news", mobile: false, hideFromSidebar: true },
    ];

    const trainingSubItems = [
        { name: "Classes", icon: School, slug: "/intern/dashboard/training/classes" },
        { name: "Exams", icon: ClipboardCheck, slug: "/intern/dashboard/exams" },
        { name: "Resources", icon: BookOpen, slug: "/intern/dashboard/resources" },
        { name: "Reports", icon: FileText, slug: "/intern/dashboard/reports" },
    ];

    const isTrainingActive = pathname === "/intern/dashboard" || trainingSubItems.some(sub => {
        const url = new URL(sub.slug, "http://localhost");
        return pathname === url.pathname;
    });

    const getCollegeLogo = () => {
        const college = user.college?.toLowerCase() || "";
        if (college.includes("cmrit") || college.includes("cmr")) {
            return "https://ik.imagekit.io/dypkhqxip/cmrit";
        }
        if (college.includes("kits") || college.includes("kamala institute")) {
            return "https://ik.imagekit.io/dypkhqxip/kits";
        }
        if (college.includes("mohan babu") || college.includes("mbu")) {
            return "https://upload.wikimedia.org/wikipedia/en/4/4b/Mohan_Babu_University_Logo%2C_Tirupati%2C_Andhra_Pradesh%2C_India.png";
        }
        if (college.includes("visvesvaraya")) {
            return "https://vcethyd.ac.in/wp-content/uploads/2026/02/Visvesvaraya-College-emblem-fin-white.png";
        }
        if (college.includes("malla reddy university")) {
            return "https://media.collegedekho.com/media/img/institute/logo/Malla_reddy_University_logo.png";
        }
        if (college.includes("siddhartha")) {
            return "https://media.licdn.com/dms/image/v2/C560BAQGV5F0LXyUOTQ/company-logo_200_200/company-logo_200_200/0/1631333448241?e=2147483647&v=beta&t=k2u15Yhys2ZYnLgwW7o6z0zJlZ2bdM80l0vEr0HpfHk";
        }
        return null;
    };

    const collegeLogo = getCollegeLogo();

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans">
            {/* ── Full-width Header ── */}
            <header className="h-[72px] flex items-center justify-between px-6 lg:px-10 bg-white border-b border-zinc-100 sticky top-0 z-[60] text-zinc-900 shadow-sm w-full">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="lg:hidden p-2 -ml-2 text-zinc-600 hover:bg-zinc-100 transition-colors rounded-lg"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="flex items-center gap-4">
                        {collegeLogo ? (
                            <img src={collegeLogo} alt="College Logo" className="h-[44px] w-auto object-contain" />
                        ) : (
                            <div className="h-11 w-11 bg-zinc-50 flex items-center justify-center border border-zinc-100 rounded-xl">
                                <School size={22} className="text-[#003366]/60" />
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="text-[13px] font-bold text-zinc-800 leading-tight">
                                {user.college?.split(',')[0] || "Institute Name"}
                            </span>
                            <span className="text-[11px] text-zinc-400">
                                {user.college?.split(',')[1]?.trim() || user.department || "Hyderabad"}
                            </span>
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="hidden lg:block h-8 w-px bg-zinc-200" />

                    {/* Platform Logo */}
                    <img
                        src="https://ik.imagekit.io/dypkhqxip/platform?updatedAt=1776791557303"
                        alt="Student Forge"
                        className="hidden lg:block h-[30px] w-auto object-contain"
                    />
                </div>

                <div className="flex items-center gap-5 lg:gap-8">
                    <div className="hidden md:flex items-center gap-1">
                        <Link href="/intern/dashboard?view=chat" className="p-2 text-zinc-400 hover:text-[#003366] hover:bg-[#E8EDFF] transition-all rounded-lg">
                            <Users size={20} strokeWidth={1.5} />
                        </Link>
                        <Link href="/intern/dashboard/schedule" className="p-2 text-zinc-400 hover:text-[#003366] hover:bg-[#E8EDFF] transition-all rounded-lg">
                            <Calendar size={20} strokeWidth={1.5} />
                        </Link>
                        <Link href="/intern/dashboard?view=chat" className="p-2 text-zinc-400 hover:text-[#003366] hover:bg-[#E8EDFF] transition-all rounded-lg">
                            <MessageSquare size={20} strokeWidth={1.5} />
                        </Link>
                        <Link href="/intern/dashboard/news" className="p-2 text-zinc-400 hover:text-[#003366] hover:bg-[#E8EDFF] transition-all rounded-lg relative">
                            <Bell size={20} strokeWidth={1.5} />
                            <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
                        </Link>
                    </div>

                    {/* Profile Pill & Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full border border-zinc-200 bg-white hover:border-[#003366]/30 hover:bg-zinc-50 transition-all shadow-sm group"
                        >
                            <div className="h-7 w-7 rounded-full bg-[#E8EDFF] flex items-center justify-center text-[10px] font-bold text-[#003366] overflow-hidden border border-[#003366]/10">
                                {user.profileImage ? (
                                    <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                                ) : (
                                    user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
                                )}
                            </div>
                            <div className="hidden sm:flex items-center gap-1.5">
                                <span className="text-[13px] font-semibold text-zinc-700 truncate max-w-[110px]">
                                    {user.name}
                                </span>
                                <ChevronDown
                                    size={14}
                                    className={`text-zinc-400 group-hover:text-[#003366] transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                                />
                            </div>
                        </button>

                        <AnimatePresence>
                            {isProfileDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsProfileDropdownOpen(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-48 bg-white border border-zinc-100 shadow-xl rounded-2xl overflow-hidden z-20 py-1"
                                    >
                                        <Link
                                            href="/intern/dashboard/profile"
                                            onClick={() => setIsProfileDropdownOpen(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-zinc-600 hover:bg-zinc-50 hover:text-[#003366] transition-colors"
                                        >
                                            <User size={16} />
                                            Edit Profile
                                        </Link>
                                        <div className="border-t border-zinc-50 my-1" />
                                        <button
                                            onClick={() => {
                                                setIsProfileDropdownOpen(false);
                                                handleLogout();
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut size={16} />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>

            {/* ── Body: Sidebar + Main ── */}
            <div className="flex h-[calc(100vh-72px)] overflow-hidden transition-all duration-500">

                {/* Sidebar Desktop */}
                <aside 
                    onMouseEnter={() => setIsSidebarHovered(true)}
                    onMouseLeave={() => setIsSidebarHovered(false)}
                    className={`hidden lg:flex flex-col z-40 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] border-r border-zinc-200/40 ${
                        isSidebarCollapsed ? "w-[68px]" : "w-[240px]"
                    } bg-white shadow-[2px_0_12px_rgba(0,0,0,0.01)] h-full relative`}
                >
                    {/* Floating Pin Button */}
                    {!isSidebarCollapsed && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsSidebarPinned(!isSidebarPinned);
                            }}
                            className={`absolute top-4 right-4 z-50 p-1.5 rounded-lg border transition-all ${
                                isSidebarPinned 
                                    ? "bg-[#E8EDFF] border-blue-200 text-[#003366] hover:bg-[#D3E0FF]" 
                                    : "bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-400 hover:text-zinc-600 shadow-sm"
                            }`}
                            title={isSidebarPinned ? "Unpin Sidebar" : "Pin Sidebar"}
                        >
                            <Pin size={13} strokeWidth={2.5} className={`transition-transform duration-300 ${isSidebarPinned ? "rotate-45" : ""}`} />
                        </button>
                    )}
                    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                        {/* Scrollable Area */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-5 px-3 space-y-1.5">

                            <nav className="space-y-1.5">
                                {navItems.filter(i => !i.hideFromSidebar).map((item) => {
                                    const itemUrl = new URL(item.slug, "http://localhost");
                                    const itemPath = itemUrl.pathname;
                                    const itemView = itemUrl.searchParams.get("view");
                                    const isActive = pathname === itemPath && (itemView === currentView || (!itemView && !currentView));
                                    
                                    return (
                                        <Link 
                                            key={item.name} 
                                            href={item.slug}
                                            className={`flex items-center h-11 transition-all rounded-xl relative group ${
                                                isActive 
                                                    ? "bg-[#003366] text-white shadow-[0_4px_12px_rgba(0,51,102,0.15)] font-semibold" 
                                                    : "text-zinc-600 hover:bg-[#E8EDFF]/40 hover:text-[#003366]"
                                            } ${isSidebarCollapsed ? "justify-center px-0 mx-auto w-11" : "px-3.5 gap-3"}`}
                                        >
                                            <item.icon 
                                                size={18} 
                                                strokeWidth={isActive ? 2.75 : 2.25} 
                                                className={`shrink-0 transition-colors ${
                                                    isActive 
                                                        ? "text-white" 
                                                        : "text-zinc-400 group-hover:text-[#003366]"
                                                }`} 
                                            />
                                            {!isSidebarCollapsed && (
                                                <span className="flex-1 text-[13.5px] font-medium tracking-tight truncate">{item.name}</span>
                                            )}
                                            {isActive && !isSidebarCollapsed && (
                                                <motion.div 
                                                    layoutId="activeDot"
                                                    className="absolute right-3.5 h-1.5 w-1.5 rounded-full bg-white/60"
                                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                                />
                                            )}
                                            
                                            {isSidebarCollapsed && (
                                                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-zinc-900/95 backdrop-blur-sm text-white text-[11px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0 whitespace-nowrap z-[100] pointer-events-none shadow-lg border border-zinc-800/50">
                                                    {item.name}
                                                </div>
                                            )}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Sidebar Footer - Controls */}
                        <div className="mt-auto p-3.5 space-y-2 border-t border-zinc-100 bg-white">
                            <button
                                onClick={toggleHand}
                                disabled={isTogglingHand}
                                className={`w-full flex items-center transition-all font-semibold rounded-xl ${
                                    handRaised 
                                        ? "bg-amber-500 text-white shadow-sm hover:bg-amber-600" 
                                        : "bg-amber-50/50 text-amber-700 border border-amber-200/60 hover:bg-amber-100/70 hover:text-amber-800"
                                } ${isSidebarCollapsed ? "h-11 w-11 justify-center px-0 mx-auto" : "h-11 px-3.5 gap-3 text-[13px]"}`}
                            >
                                <Hand size={18} strokeWidth={2.25} className={handRaised ? "animate-bounce" : "shrink-0"} />
                                {!isSidebarCollapsed && <span className="truncate">{handRaised ? "Active" : "Help"}</span>}
                            </button>
                            <button
                                onClick={handleLogout}
                                className={`w-full flex items-center h-11 transition-all font-semibold rounded-xl bg-rose-50/50 hover:bg-rose-100/70 text-rose-600 hover:text-rose-700 border border-rose-100/60 relative group ${
                                    isSidebarCollapsed ? "justify-center px-0 mx-auto w-11" : "px-3.5 gap-3 text-[13px]"
                                }`}
                            >
                                <LogOut size={18} strokeWidth={2.25} className="shrink-0" />
                                {!isSidebarCollapsed && <span className="truncate">Sign Out</span>}
                                {isSidebarCollapsed && (
                                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-zinc-900/95 backdrop-blur-sm text-white text-[11px] font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0 whitespace-nowrap z-[100] pointer-events-none shadow-lg border border-zinc-800/50">
                                        Sign Out
                                    </div>
                                )}
                            </button>

                            {!isSidebarCollapsed && (
                                <div className="pt-1 flex items-center justify-center">
                                    <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest leading-none">Platform v2.1</span>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* ── Main Content Area ── */}
                <div className="flex-1 min-w-0 flex flex-col h-full bg-[#FBFBFB] relative">
                    <main className="flex-1 overflow-y-auto overflow-x-hidden">
                        <div className="w-full max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 xl:p-10 pb-32 lg:pb-16">
                            {children}
                        </div>
                    </main>

                    { }
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
                                    className={`flex flex-col items-center justify-center gap-1 transition-all ${isActive ? "text-white" : "text-zinc-500"
                                        }`}
                                >
                                    <item.icon size={20} strokeWidth={isActive ? 2.75 : 2.25} />
                                    <span className={`text-[9px] font-bold uppercase tracking-tight ${isActive ? "text-white" : "text-zinc-500"}`}>
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    { }
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
                                    className="fixed inset-y-0 left-0 w-[300px] bg-white z-[80] lg:hidden flex flex-col"
                                >
                                    <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-[#E8EDFF] flex items-center justify-center text-sm font-bold text-[#003366]">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-zinc-800">{user.name}</span>
                                                <span className="text-[10px] text-zinc-400 font-medium">Intern Scholar</span>
                                            </div>
                                        </div>
                                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-zinc-400">
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-4 space-y-1">
                                        {navItems.filter(i => !i.hideFromSidebar).map((item) => {
                                            const itemUrl = new URL(item.slug, "http://localhost");
                                            const itemPath = itemUrl.pathname;
                                            const itemView = itemUrl.searchParams.get("view");
                                            const isActive = pathname === itemPath && (itemView === currentView || (!itemView && !currentView));

                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={item.slug}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className={`flex items-center h-12 px-4 gap-4 rounded-xl transition-all ${isActive
                                                            ? "bg-[#E8EDFF] text-[#003366] font-bold"
                                                            : "text-zinc-500"
                                                        }`}
                                                >
                                                    <item.icon size={20} />
                                                    <span className="text-[13px] font-semibold">{item.name}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    <div className="p-4 border-t border-zinc-200 space-y-2 bg-white">

                                        <button
                                            onClick={() => { toggleHand(); setIsMobileMenuOpen(false); }}
                                            disabled={isTogglingHand}
                                            className={`w-full h-12 flex items-center px-4 gap-4 font-bold rounded-xl ${handRaised
                                                    ? "bg-amber-500 text-white"
                                                    : "bg-zinc-100 text-zinc-600"
                                                }`}
                                        >
                                            <Hand size={20} className={handRaised ? "animate-bounce" : ""} />
                                            <span className="text-sm">{handRaised ? "Help Active" : "Raise Help Hand"}</span>
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full h-12 flex items-center px-4 gap-4 bg-[#E11D48] text-white font-bold rounded-xl"
                                        >
                                            <LogOut size={20} />
                                            <span className="text-sm">Sign Out Session</span>
                                        </button>
                                    </div>
                                </motion.aside>
                            </>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {!isProfileComplete && !onProfilePage && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/95 backdrop-blur-md"
                            >
                                <motion.div
                                    initial={{ scale: 0.9, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    className="bg-white max-w-md w-full p-8 text-center space-y-6 shadow-2xl border border-zinc-200"
                                >
                                    <div className="h-20 w-20 bg-blue-50 rounded-none flex items-center justify-center mx-auto">
                                        <User size={40} className="text-[#0055FF]" />
                                    </div>

                                    <div className="space-y-2">
                                        <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">Complete Your Profile</h2>
                                        <p className="text-zinc-500 text-sm font-medium">To unlock the full dashboard and stay eligible for help and bounties, please finish setting up your profile.</p>
                                    </div>

                                    <div className="pt-4">
                                        <Link
                                            href="/intern/dashboard/profile"
                                            className="w-full inline-flex items-center justify-center h-14 bg-black text-white font-bold uppercase tracking-widest text-[12px] hover:bg-zinc-800 transition-all gap-3"
                                        >
                                            Go to Profile
                                            <ChevronRight size={16} />
                                        </Link>
                                    </div>

                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Mandatory Requirement</p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div> {/* end body flex */}
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
