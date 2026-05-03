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
    Edit3
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
    const [isTrainingOpen, setIsTrainingOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
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
        { name: "Roadmap", icon: Calendar, slug: "/intern/dashboard/schedule", mobile: true },
        { name: "Assignments", icon: Briefcase, slug: "/intern/dashboard?view=tasks", mobile: false },
        { name: "Attendance", icon: FileBadge, slug: "/intern/dashboard?view=attendance", mobile: false },
        { name: "Group Chat", icon: MessageSquare, slug: "/intern/dashboard?view=chat", mobile: false },
        { name: "Profile", icon: User, slug: "/intern/dashboard/profile", mobile: false },
        { name: "News & Updates", icon: Bell, slug: "/intern/dashboard/news", mobile: false, hideFromSidebar: true },
    ];

    const trainingSubItems = [
        { name: "Exams", icon: ClipboardCheck, slug: "/intern/dashboard/exams" },
        { name: "Resources", icon: BookOpen, slug: "/intern/dashboard/resources" },
        { name: "Reports", icon: FileText, slug: "/intern/dashboard/reports" },
    ];

    const isTrainingActive = trainingSubItems.some(sub => {
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
        return null;
    };

    const collegeLogo = getCollegeLogo();

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans">
            {/* ── Full-width Header ── */}
            <header className="h-14 flex items-center justify-between px-6 lg:px-10 bg-white border-b border-zinc-100 sticky top-0 z-[60] text-zinc-900 shadow-sm w-full">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="lg:hidden p-2 -ml-2 text-zinc-600 hover:bg-zinc-100 transition-colors rounded-lg"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="flex items-center gap-4">
                        {collegeLogo ? (
                            <img src={collegeLogo} alt="College Logo" className="h-9 w-auto object-contain" />
                        ) : (
                            <div className="h-9 w-9 bg-zinc-50 flex items-center justify-center border border-zinc-100">
                                <School size={20} className="text-[#003366]/60" />
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
                        className="hidden lg:block h-5 w-auto object-contain opacity-80"
                    />
                </div>

                <div className="flex items-center gap-5 lg:gap-8">
                    <div className="hidden md:flex items-center gap-1">
                        <button className="p-2 text-zinc-400 hover:text-[#003366] hover:bg-[#E8EDFF] transition-all rounded-lg">
                            <Users size={20} strokeWidth={1.5} />
                        </button>
                        <button className="p-2 text-zinc-400 hover:text-[#003366] hover:bg-[#E8EDFF] transition-all rounded-lg">
                            <Calendar size={20} strokeWidth={1.5} />
                        </button>
                        <button className="p-2 text-zinc-400 hover:text-[#003366] hover:bg-[#E8EDFF] transition-all rounded-lg">
                            <MessageSquare size={20} strokeWidth={1.5} />
                        </button>
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
            <div className="flex min-h-[calc(100vh-56px)]">

                {/* Sidebar Desktop */}
                <aside className="hidden lg:flex fixed left-0 top-14 bottom-0 w-[280px] flex-col z-40 p-4 pt-6 bg-[#E0E7FF]">
                    <div className="flex-1 flex flex-col">
                        {/* Sidebar Profile Section */}
                        <div className="px-4 pb-5 flex flex-col items-start relative">
                            <Link
                                href="/intern/dashboard/profile"
                                className="absolute top-0 right-2 p-1.5 text-[#003366]/30 hover:text-[#003366]/60 transition-colors"
                            >
                                <Edit3 size={15} />
                            </Link>

                            <div className="h-[72px] w-[72px] rounded-lg bg-white flex items-center justify-center text-xl font-bold text-[#003366] mb-3 overflow-hidden shadow-sm">
                                {user.profileImage ? (
                                    <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                                ) : (
                                    user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
                                )}
                            </div>

                            <h2 className="text-[14px] font-bold text-[#003366] leading-tight text-left">
                                {user.name}
                            </h2>
                            <p className="text-[11px] text-[#003366]/60 font-medium mt-0.5 text-left">
                                {user.batch || "Intern Scholar"}
                            </p>
                        </div>

                        <div className="flex flex-col py-1 px-2">
                            <nav className="space-y-0.5">
                                {/* Regular items before Training */}
                                {navItems.filter(i => !i.hideFromSidebar).slice(0, 1).map((item) => {
                                    const itemUrl = new URL(item.slug, "http://localhost");
                                    const itemPath = itemUrl.pathname;
                                    const itemView = itemUrl.searchParams.get("view");
                                    const isActive = pathname === itemPath && (itemView === currentView || (!itemView && !currentView));
                                    return (
                                        <Link key={item.name} href={item.slug}
                                            className={`flex items-center h-10 px-3 gap-3 transition-all rounded-lg group ${isActive ? "bg-white text-[#003366] font-bold shadow-sm" : "text-[#003366]/60 hover:text-[#003366] hover:bg-white/50"}`}
                                        >
                                            <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-[#003366]" : "text-[#003366]/40 group-hover:text-[#003366]"} />
                                            <span className="flex-1 text-[12px]">{item.name}</span>
                                        </Link>
                                    );
                                })}

                                {/* Training Dropdown Group */}
                                <div>
                                    <button
                                        onClick={() => setIsTrainingOpen(prev => !prev)}
                                        className={`w-full flex items-center h-10 px-3 gap-3 transition-all rounded-lg group ${
                                            isTrainingActive ? "bg-white text-[#003366] font-bold shadow-sm" : "text-[#003366]/60 hover:text-[#003366] hover:bg-white/50"
                                        }`}
                                    >
                                        <BookOpen size={18} strokeWidth={isTrainingActive ? 2.5 : 2} className={isTrainingActive ? "text-[#003366]" : "text-[#003366]/40 group-hover:text-[#003366]"} />
                                        <span className="flex-1 text-[12px] text-left">Training</span>
                                        <ChevronDown
                                            size={14}
                                            className={`transition-transform duration-200 text-[#003366]/30 ${isTrainingOpen || isTrainingActive ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {(isTrainingOpen || isTrainingActive) && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="ml-4 pl-3 border-l-2 border-[#003366]/10 mt-0.5 space-y-0.5 py-1">
                                                    {trainingSubItems.map(sub => {
                                                        const isSubActive = pathname === new URL(sub.slug, "http://localhost").pathname;
                                                        return (
                                                            <Link key={sub.name} href={sub.slug}
                                                                className={`flex items-center h-9 px-3 gap-3 transition-all rounded-lg group ${isSubActive ? "bg-white/50 text-[#003366] font-bold shadow-sm" : "text-[#003366]/50 hover:text-[#003366] hover:bg-white/30"}`}
                                                            >
                                                                <sub.icon size={16} strokeWidth={isSubActive ? 2.5 : 2} className={isSubActive ? "text-[#003366]" : "text-[#003366]/30 group-hover:text-[#003366]"} />
                                                                <span className="flex-1 text-[11px]">{sub.name}</span>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Remaining nav items */}
                                {navItems.filter(i => !i.hideFromSidebar).slice(1).map((item) => {
                                    const itemUrl = new URL(item.slug, "http://localhost");
                                    const itemPath = itemUrl.pathname;
                                    const itemView = itemUrl.searchParams.get("view");
                                    const isActive = pathname === itemPath && (itemView === currentView || (!itemView && !currentView));
                                    return (
                                        <Link key={item.name} href={item.slug}
                                            className={`flex items-center h-10 px-3 gap-3 transition-all rounded-lg group ${isActive ? "bg-white text-[#003366] font-bold shadow-sm" : "text-[#003366]/60 hover:text-[#003366] hover:bg-white/50"}`}
                                        >
                                            <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-[#003366]" : "text-[#003366]/40 group-hover:text-[#003366]"} />
                                            <span className="flex-1 text-[13px]">{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        <div className="mt-auto px-2 pt-4 space-y-2">
                            <button
                                onClick={toggleHand}
                                disabled={isTogglingHand}
                                className={`w-full h-10 flex items-center justify-center gap-2 transition-all text-[12px] font-bold rounded-lg ${handRaised
                                        ? "bg-amber-500 text-white hover:bg-amber-600"
                                        : "bg-yellow-400 text-[#003366] hover:bg-yellow-500 shadow-sm"
                                    }`}
                            >
                                {isTogglingHand ? (
                                    <div className="h-4 w-4 border-2 border-[#003366]/20 border-t-[#003366] animate-spin rounded-full" />
                                ) : (
                                    <Hand size={15} className={handRaised ? "animate-bounce" : ""} />
                                )}
                                <span>{handRaised ? "Help Active" : "Raise Hand"}</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full h-10 flex items-center justify-center gap-2 bg-[#E11D48] text-white hover:bg-[#BE123C] transition-all text-[12px] font-bold rounded-lg shadow-sm"
                            >
                                <LogOut size={15} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>

                    {/* Branding Footer */}
                    <div className="py-3 flex items-center justify-center gap-1.5 border-t border-[#003366]/5">
                        <span className="text-[10px] font-semibold text-[#003366]/40 tracking-wide uppercase">Powered by</span>
                        <img
                            src="https://ik.imagekit.io/dypkhqxip/redlixlogo?updatedAt=1777318254456"
                            alt="Redlix"
                            className="h-3.5 w-auto object-contain"
                        />
                    </div>
                </aside>

                {/* ── Main Content ── */}
                <div className="flex-1 flex flex-col min-w-0 lg:pl-[280px]">
                    <main className="flex-1 p-4 lg:p-0 pb-20 lg:pb-10">
                        {children}
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
                                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
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
                                                    <span className="text-[14px] font-semibold">{item.name}</span>
                                                    {item.count !== undefined && (
                                                        <span className="ml-auto h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-full bg-blue-50 text-blue-500 text-[10px] font-bold">
                                                            {item.count}
                                                        </span>
                                                    )}
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
