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
    Flame,
    Layers,
    X,
    Menu,
    ChevronLeft,
    Bell,
    Globe,
    ChevronDown,
    School,
    Users
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
        { name: "Overview", icon: LayoutDashboard, slug: "/intern/dashboard?view=overview", isNew: false, mobile: true },
        { name: "Courses", icon: Globe, slug: "/courses", isNew: false, mobile: true },
        { name: "Stack Flow", icon: Layers, slug: "/intern/dashboard/stack-flow", isNew: false, mobile: true },
        { name: "Exams", icon: ClipboardCheck, slug: "/intern/dashboard/exams", isNew: false, mobile: true },
        { name: "Resources", icon: BookOpen, slug: "/intern/dashboard/resources", isNew: false, mobile: true },
        { name: "Reports", icon: FileText, slug: "/intern/dashboard/reports", isNew: false, mobile: true },
        { name: "Group Chat", icon: MessageSquare, slug: "/intern/dashboard?view=chat", isNew: false, mobile: false },
        { name: "Roadmap", icon: Calendar, slug: "/intern/dashboard/schedule", isNew: false, mobile: true },
        { name: "Assignments", icon: Briefcase, slug: "/intern/dashboard?view=tasks", isNew: false, mobile: false },
        { name: "Attendance", icon: FileBadge, slug: "/intern/dashboard?view=attendance", isNew: false, mobile: false },
        { name: "Profile", icon: User, slug: "/intern/dashboard/profile", isNew: false, mobile: false },
        { name: "News & Updates", icon: Bell, slug: "/intern/dashboard/news", isNew: false, mobile: false, hideFromSidebar: true },
    ];

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
        <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 flex flex-col font-sans">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-[#E0E7FF] border-r border-[#003366]/5 z-50">
                <div className="p-8 pb-10 flex flex-col items-start bg-[#E0E7FF] z-10">
                    <img 
                        src="https://ik.imagekit.io/dypkhqxip/platform?updatedAt=1776791557303" 
                        alt="Platform" 
                        className="h-8 w-auto"
                    />
                </div>
                
                <div className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar">
                    <nav className="px-4 space-y-0.5">
                    {navItems.filter(i => !i.hideFromSidebar).map((item) => {
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

                </div>

                <div className="p-4 space-y-2 border-t border-[#003366]/10 bg-[#E0E7FF] z-10 shadow-sm">
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
                        <span>Logout Session</span>
                    </button>
                </div>
            </aside>

            {}
            <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
                {/* Header */}
                <header className="h-16 lg:h-16 flex items-center justify-between px-4 lg:px-8 bg-white border-b border-zinc-100 sticky top-0 z-[60] text-zinc-900 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-zinc-600 hover:bg-zinc-100 transition-colors rounded-lg"
                        >
                            <Menu size={20} />
                        </button>
                        
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-zinc-50 flex items-center justify-center border border-zinc-100 shadow-inner overflow-hidden">
                                {collegeLogo ? (
                                    <img src={collegeLogo} alt="College Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <School size={20} className="text-[#003366]/60" />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[13px] font-bold text-[#003366] leading-tight truncate max-w-[200px] lg:max-w-none">
                                    {user.college || "Institute Name"}
                                </span>
                                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                                    {user.department || "Academic Node"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 lg:gap-8">
                        <div className="hidden md:flex items-center gap-1 pr-4 border-r border-zinc-100">
                            <button className="p-2 text-zinc-400 hover:text-[#003366] hover:bg-zinc-50 transition-all rounded-lg">
                                <Users size={19} strokeWidth={1.5} />
                            </button>
                            <button className="p-2 text-zinc-400 hover:text-[#003366] hover:bg-zinc-50 transition-all rounded-lg">
                                <Calendar size={19} strokeWidth={1.5} />
                            </button>
                            <button className="p-2 text-zinc-400 hover:text-[#003366] hover:bg-zinc-50 transition-all rounded-lg">
                                <MessageSquare size={19} strokeWidth={1.5} />
                            </button>
                            <Link href="/intern/dashboard/news" className="p-2 text-zinc-400 hover:text-[#003366] hover:bg-zinc-50 transition-all rounded-lg relative">
                                <Bell size={19} strokeWidth={1.5} />
                                <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
                            </Link>
                        </div>

                        {/* Profile Pill & Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className="flex items-center gap-3 px-3 py-1.5 rounded-full border border-zinc-200 bg-white hover:border-[#003366]/30 hover:bg-zinc-50/50 transition-all shadow-sm group"
                            >
                                <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-[#003366] overflow-hidden border border-zinc-200">
                                    {user.profileImage ? (
                                        <img src={user.profileImage} alt={user.name} className="h-full w-full object-cover" />
                                    ) : (
                                        user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
                                    )}
                                </div>
                                <div className="hidden sm:flex flex-col items-start pr-1 text-left">
                                    <span className="text-[12px] font-bold text-[#003366] truncate max-w-[120px]">
                                        {user.name}
                                    </span>
                                    <span className="text-[9px] font-medium text-zinc-400 -mt-0.5">
                                        Active Scholar
                                    </span>
                                </div>
                                <ChevronDown 
                                    size={14} 
                                    className={`text-zinc-400 group-hover:text-[#003366] transition-transform duration-200 mr-1 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} 
                                />
                            </button>

                            <AnimatePresence>
                                {isProfileDropdownOpen && (
                                    <>
                                        {/* Backdrop to close on click outside */}
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
                                        src="https://ik.imagekit.io/dypkhqxip/platform?updatedAt=1776791557303" 
                                        alt="Platform Logo" 
                                        className="h-6 w-auto"
                                    />
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
