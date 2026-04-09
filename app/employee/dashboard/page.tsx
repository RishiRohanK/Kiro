"use client";

import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    User,
    LogOut,
    Bell,
    Settings,
    ChevronRight,
    Users,
    Briefcase,
    Calendar,
    Menu,
    X,
    RefreshCw,
    ClipboardCheck,
    Mail,
    Github,
    Activity,
    Hand
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function EmployeeDashboard() {
    const [userData, setUserData] = useState<any>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<any>({});
    const [updating, setUpdating] = useState(false);
    const [batchInterns, setBatchInterns] = useState<any[]>([]);
    const [loadingInterns, setLoadingInterns] = useState(false);
    const [batchSubmissions, setBatchSubmissions] = useState<any[]>([]);
    const [loadingSubmissions, setLoadingSubmissions] = useState(false);
    const [gradingSubmissionId, setGradingSubmissionId] = useState<string | null>(null);
    const [gradingData, setGradingData] = useState({ marks: "", review: "" });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUserData(parsed);
            setEditData(parsed);
            if (parsed.batch) {
                fetchBatchInterns(parsed.batch);
                fetchBatchSubmissions(parsed.batch);
            }

            fetch(`/api/employee/profile?id=${parsed.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.user) {
                        setUserData(data.user);
                        setEditData(data.user);
                        localStorage.setItem("user", JSON.stringify(data.user));
                        if (data.user.batch) {
                            fetchBatchInterns(data.user.batch);
                            fetchBatchSubmissions(data.user.batch);
                        }
                    }
                })
                .catch(err => console.error("Sync error:", err));
        } else {
            window.location.href = "/employee/signin";
        }
    }, []);

    const fetchBatchSubmissions = async (batch: string) => {
        setLoadingSubmissions(true);
        try {
            const res = await fetch(`/api/employee/submissions?batch=${batch}`);
            const data = await res.json();
            if (data.success) {
                setBatchSubmissions(data.submissions);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingSubmissions(false);
        }
    };

    const handleGradeSubmission = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!gradingSubmissionId) return;
        try {
            const res = await fetch("/api/employee/submissions", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: gradingSubmissionId,
                    marks: gradingData.marks,
                    review: gradingData.review,
                    reviewedBy: userData.id
                })
            });
            if (res.ok) {
                setGradingSubmissionId(null);
                setGradingData({ marks: "", review: "" });
                fetchBatchSubmissions(userData.batch);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchBatchInterns = async (batch: string) => {
        setLoadingInterns(true);
        try {
            const res = await fetch(`/api/cleed/interns?batch=${batch}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setBatchInterns(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingInterns(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const res = await fetch("/api/employee/profile", {
                method: "PUT",
                body: JSON.stringify(editData),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (res.ok) {
                setUserData(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
                setIsEditing(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Mock image upload: convert to base64 for demo
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditData({ ...editData, profileImage: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/employee/signin";
    };

    const navItems = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "interns", label: "Allocated Interns", icon: Users },
        { id: "submissions", label: "Batch Submissions", icon: ClipboardCheck },
        { id: "profile", label: "Profile", icon: User },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex text-zinc-900 font-sans">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#F4F4F5] border-r border-zinc-200 transition-transform duration-300 h-screen ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0`}
            >
                <div className="h-full flex flex-col pt-8 px-6 relative">
                    <div className="flex flex-col mb-6 px-2 text-zinc-900 pb-6 border-b border-zinc-200">
                        <span className="font-bold tracking-tight text-xl leading-tight">Cleed EMS</span>
                        <span className="text-[11px] font-bold text-zinc-400 tracking-wider mt-1">Employee dashboard</span>
                    </div>

                    <nav className="flex-1 space-y-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id
                                    ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                                    : "text-zinc-500 hover:bg-white/50 hover:text-zinc-900"
                                    }`}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="pb-8 pt-6 border-t border-zinc-200">
                        <button
                            onClick={handleLogout}
                            className="w-full h-11 flex items-center justify-center gap-3 px-3 rounded-lg text-sm font-bold bg-[#F5332C] text-white hover:bg-red-700 transition-all shadow-md active:scale-[0.98]"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 lg:pl-64">
                {/* Header */}
                <header className="h-16 bg-[#F5332C] border-b border-red-700 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40 shadow-sm">
                    <div className="flex items-center gap-4 text-white">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 hover:bg-white/10 rounded-md transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <h2 className="font-bold tracking-tight uppercase text-xs">
                            {navItems.find(i => i.id === activeTab)?.label}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-white/70 hover:text-white transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-white rounded-full border-2 border-[#F5332C]"></span>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="hidden xs:flex flex-col items-end">
                                <span className="text-[10px] font-bold text-white leading-none truncate max-w-[120px]">{userData?.name}</span>
                                <span className="text-[8px] text-white/60 font-medium mt-1 uppercase tracking-tighter">Auth Node</span>
                            </div>
                            <div className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center border border-white/20 overflow-hidden">
                                {userData?.profileImage ? (
                                    <img src={userData.profileImage} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <User size={18} className="text-white" />
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-6 lg:p-8 max-w-7xl w-full">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === "overview" && (
                            <div className="space-y-10">
                                <div className="space-y-1">
                                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 leading-none">
                                        Good morning, {userData?.name?.split(' ')[0]}
                                    </h1>
                                    <div className="flex items-center gap-3 mt-2 text-zinc-500">
                                        <p className="text-sm font-medium">
                                            Role: <span className="text-zinc-900">{userData?.role?.replace('_', ' ')}</span>
                                        </p>
                                        <div className="w-1 h-1 rounded-full bg-zinc-300" />
                                        <p className="text-sm font-medium">
                                            Managed Batch: <span className="text-[#F5332C] font-semibold">{userData?.batch || "Not Allocated"}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-white border border-zinc-200 p-6 shadow-sm hover:border-zinc-300 transition-all">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Allocated Interns</span>
                                            <Users size={16} className="text-zinc-300" />
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <h3 className="text-3xl font-semibold text-zinc-900">{batchInterns.length}</h3>
                                            <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-widest">Students</span>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-zinc-200 p-6 shadow-sm hover:border-zinc-300 transition-all">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Pending Reviews</span>
                                            <ClipboardCheck size={16} className="text-[#F5332C]" />
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <h3 className="text-3xl font-semibold text-[#F5332C]">{batchSubmissions.filter(s => s.status !== 'REVIEWED').length}</h3>
                                            <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-widest">Tasks</span>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-zinc-200 p-6 shadow-sm hover:border-zinc-300 transition-all">
                                        <div className="flex items-center justify-between mb-2 text-emerald-600">
                                            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Avg Attendance</span>
                                            <Activity size={16} />
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <h3 className="text-3xl font-semibold text-zinc-900">
                                                {batchInterns.length > 0 
                                                    ? Math.round(batchInterns.reduce((acc, i) => acc + (i.attendancePercentage || 0), 0) / batchInterns.length)
                                                    : 0}%
                                            </h3>
                                            <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-widest">Score</span>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-zinc-200 p-6 shadow-sm hover:border-zinc-300 transition-all">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Help Required</span>
                                            <Hand size={16} className={batchInterns.some(i => i.handRaised) ? "text-red-600 animate-bounce" : "text-zinc-300"} />
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <h3 className={`text-3xl font-semibold ${batchInterns.some(i => i.handRaised) ? "text-red-600" : "text-zinc-900"}`}>
                                                {batchInterns.filter(i => i.handRaised).length}
                                            </h3>
                                            <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-widest">Flags</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-8 bg-white border border-zinc-200 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-semibold text-sm uppercase tracking-widest text-zinc-900 border-l-4 border-[#F5332C] pl-4 text-left">Recent Batch Activity</h3>
                                        <button onClick={() => setActiveTab("interns")} className="text-[10px] font-semibold text-red-600 hover:text-black uppercase tracking-widest">View Detailed List</button>
                                    </div>
                                    <div className="space-y-1">
                                        {batchInterns.slice(0, 4).map((intern) => (
                                            <div key={intern.id} className="p-4 bg-zinc-50/50 border border-zinc-100 flex items-center justify-between hover:border-zinc-200 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-8 w-8 bg-white border border-zinc-200 flex items-center justify-center text-[10px] font-semibold text-zinc-400">
                                                        {intern.name?.[0]}
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-sm font-semibold text-zinc-900 leading-none">{intern.name}</p>
                                                        <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-tight">{intern.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="hidden xs:flex flex-col items-end">
                                                        <span className="text-[8px] font-semibold text-zinc-400 uppercase mb-0.5">Attendance</span>
                                                        <span className={`text-[11px] font-semibold ${intern.attendancePercentage >= 75 ? "text-emerald-600" : "text-red-600"}`}>{intern.attendancePercentage}%</span>
                                                    </div>
                                                    <div className={`h-2 w-2 ${intern.isApproved ? "bg-emerald-500" : "bg-zinc-200"}`} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "profile" && (
                            <div className="max-w-4xl bg-white border border-zinc-200 p-8 shadow-sm">
                                <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-6">
                                    <div className="flex items-center gap-6">
                                        <div className="relative group">
                                            <div className="h-20 w-20 bg-zinc-100 flex items-center justify-center border border-zinc-200 overflow-hidden">
                                                {editData.profileImage ? (
                                                    <img src={editData.profileImage} alt="Profile" className="h-full w-full object-cover" />
                                                ) : (
                                                    <User size={40} className="text-zinc-400" />
                                                )}
                                            </div>
                                            {isEditing && (
                                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                                    <span className="text-[10px] text-white font-bold uppercase tracking-wider">Change</span>
                                                </label>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-xl">{userData?.name}</p>
                                            <p className="text-zinc-500 text-sm">{userData?.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="px-4 h-10 border border-zinc-200 text-xs font-bold uppercase tracking-widest hover:bg-zinc-50 transition-all flex items-center gap-2"
                                    >
                                        {isEditing ? "Cancel" : "Edit Profile"}
                                    </button>
                                </div>

                                <form onSubmit={handleUpdateProfile} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Full Name</label>
                                                {isEditing ? (
                                                    <input value={editData.name || ""} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="w-full h-10 bg-zinc-50 border border-zinc-200 px-4 text-sm font-medium outline-none focus:border-red-500" />
                                                ) : (
                                                    <p className="text-sm font-semibold">{userData?.name}</p>
                                                )}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Employee ID</label>
                                                {/* Employee ID is now fixed and cannot be changed */}
                                                <p className="text-sm font-semibold text-zinc-600 bg-zinc-50 border border-zinc-100 px-3 py-2">
                                                    {userData?.employeeId || "SF26EMP001"}
                                                </p>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Phone Number</label>
                                                {isEditing ? (
                                                    <input value={editData.phoneNumber || ""} onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })} className="w-full h-10 bg-zinc-50 border border-zinc-200 px-4 text-sm font-medium outline-none focus:border-red-500" />
                                                ) : (
                                                    <p className="text-sm font-semibold">{userData?.phoneNumber || "Not provided"}</p>
                                                )}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Department</label>
                                                {isEditing ? (
                                                    <input value={editData.department || ""} onChange={(e) => setEditData({ ...editData, department: e.target.value })} className="w-full h-10 bg-zinc-50 border border-zinc-200 px-4 text-sm font-medium outline-none focus:border-red-500" />
                                                ) : (
                                                    <p className="text-sm font-semibold">{userData?.department || "Not provided"}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Reporting Manager</label>
                                                {isEditing ? (
                                                    <input value={editData.reportingManager || ""} onChange={(e) => setEditData({ ...editData, reportingManager: e.target.value })} className="w-full h-10 bg-zinc-50 border border-zinc-200 px-4 text-sm font-medium outline-none focus:border-red-500" />
                                                ) : (
                                                    <p className="text-sm font-semibold">{userData?.reportingManager || "Not provided"}</p>
                                                )}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Location</label>
                                                {isEditing ? (
                                                    <select value={editData.location || "Remote"} onChange={(e) => setEditData({ ...editData, location: e.target.value })} className="w-full h-10 bg-zinc-50 border border-zinc-200 px-4 text-sm font-medium outline-none focus:border-red-500">
                                                        <option value="Remote">Remote</option>
                                                        <option value="Office">Office</option>
                                                    </select>
                                                ) : (
                                                    <p className="text-sm font-semibold">{userData?.location || "Remote"}</p>
                                                )}
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Employment Type</label>
                                                {isEditing ? (
                                                    <select value={editData.employmentType || "Full-time"} onChange={(e) => setEditData({ ...editData, employmentType: e.target.value })} className="w-full h-10 bg-zinc-50 border border-zinc-200 px-4 text-sm font-medium outline-none focus:border-red-500">
                                                        <option value="Full-time">Full-time</option>
                                                        <option value="Intern">Intern</option>
                                                    </select>
                                                ) : (
                                                    <p className="text-sm font-semibold">{userData?.employmentType || "Full-time"}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="pt-6 border-t border-zinc-100 flex justify-end">
                                            <button
                                                disabled={updating}
                                                type="submit"
                                                className="bg-[#F5332C] text-white px-8 h-11 text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
                                            >
                                                {updating ? "Saving..." : "Save Changes"}
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        )}

                        {activeTab === "interns" && (
                            <div className="bg-white border border-zinc-200 shadow-sm overflow-hidden">
                                <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                                    <div>
                                        <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-900">Allocated Interns</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-zinc-400 font-bold uppercase">Batch: {userData?.batch || "Not Allocated"}</span>
                                            <div className="w-1 h-1 rounded-full bg-zinc-300" />
                                            <button 
                                                onClick={() => userData?.batch && fetchBatchInterns(userData.batch)}
                                                className="text-[10px] text-red-600 font-bold uppercase hover:underline flex items-center gap-1"
                                            >
                                                <RefreshCw size={10} className={loadingInterns ? "animate-spin" : ""} />
                                                Refresh List
                                            </button>
                                        </div>
                                    </div>
                                    <span className="bg-zinc-900 text-white text-[10px] font-bold px-2 py-0.5">{batchInterns.length} Total</span>
                                </div>
                                <div className="p-6 space-y-4">
                                    {loadingInterns ? (
                                        <div className="p-16 flex flex-col items-center justify-center gap-3 bg-white border border-zinc-200">
                                            <RefreshCw className="animate-spin text-zinc-400" size={24} />
                                            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Synchronizing Registry...</p>
                                        </div>
                                    ) : batchInterns.length > 0 ? (
                                        batchInterns.map((intern) => (
                                            <div key={intern.id} className={`p-5 bg-white border flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-zinc-400 transition-all rounded-none ${intern.handRaised ? "border-l-4 border-[#F5332C] bg-red-50/5" : "border-zinc-200"}`}>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 flex-1 gap-6 md:gap-1 2">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-[9px] font-bold text-zinc-400">Intern</span>
                                                            {intern.handRaised && <div className="h-1.5 w-1.5 bg-[#F5332C] animate-ping" />}
                                                        </div>
                                                        <h4 className="text-[14px] font-bold text-zinc-900 leading-none truncate">{intern.name}</h4>
                                                        <p className="text-[10px] text-zinc-500 font-medium mt-1">{intern.email}</p>
                                                    </div>

                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-bold text-zinc-400 mb-1">Institution</span>
                                                        <h4 className="text-[13px] font-bold text-zinc-900 leading-none truncate">{intern.college || 'Undeclared'}</h4>
                                                        <p className="text-[10px] text-[#F5332C] font-bold mt-1 uppercase tracking-tighter">{intern.branch || 'General branch'}</p>
                                                    </div>

                                                    <div className="flex items-center gap-8 lg:justify-start">
                                                        <div className="flex flex-col">
                                                            <span className="text-[9px] font-bold text-zinc-400 mb-1">Standing</span>
                                                            <div className={`px-1.5 py-0.5 text-[9px] font-bold border w-fit uppercase ${intern.isApproved ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                                                                {intern.isApproved ? 'Approved' : 'Review'}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col border-l border-zinc-100 pl-8">
                                                            <span className="text-[9px] font-bold text-zinc-400 mb-1">Performance</span>
                                                            <p className="text-[11px] font-bold text-zinc-900 tabular-nums">
                                                                {intern.attendancePercentage ?? 0}%·{intern.presentCount ?? 0}D
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 md:border-l md:border-zinc-100 md:pl-6">
                                                    <button className="h-9 w-9 flex items-center justify-center bg-zinc-50 border border-zinc-200 text-zinc-400 hover:text-zinc-950 transition-colors">
                                                        <Mail size={14} />
                                                    </button>
                                                    {intern.githubLink && (
                                                        <a href={intern.githubLink} target="_blank" className="h-9 w-9 flex items-center justify-center bg-zinc-50 border border-zinc-200 text-zinc-400 hover:text-zinc-950 transition-colors">
                                                            <Github size={14} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-20 flex flex-col items-center justify-center text-center">
                                            <div className="w-12 h-12 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-center mb-4">
                                                <Users size={20} className="text-zinc-300" />
                                            </div>
                                            <h4 className="text-sm font-bold text-zinc-900 mb-1 leading-none uppercase tracking-tight">Empty Batch Allocation</h4>
                                            <p className="text-xs text-zinc-400 font-medium max-w-[200px]">No interns are currently allocated to <strong>{userData?.batch || "your account"}</strong>.</p>
                                            {userData?.batch && (
                                                <button 
                                                    onClick={() => fetchBatchInterns(userData.batch)}
                                                    className="mt-6 text-[10px] font-black text-white bg-black px-6 py-2.5 uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95"
                                                >
                                                    Retry Synchronization
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "submissions" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-900 border-l-4 border-[#F5332C] pl-4">Review Submissions</h3>
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Managing: {userData?.batch || "All"}</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {loadingSubmissions ? (
                                        <div className="col-span-full p-20 flex flex-col items-center justify-center gap-4 bg-white border border-zinc-200">
                                            <RefreshCw className="animate-spin text-zinc-300" size={32} />
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Consolidating Submissions...</p>
                                        </div>
                                    ) : batchSubmissions.length > 0 ? (
                                        batchSubmissions.map((sub) => (
                                            <div key={sub.id} className="bg-white border border-zinc-200 p-6 shadow-sm hover:border-zinc-300 transition-all flex flex-col min-h-[280px]">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="min-w-0 flex-1">
                                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block truncate">{sub.schedule.week} • {sub.schedule.typeOfWork}</span>
                                                        <h4 className="text-sm font-bold mt-1 truncate">{sub.intern.name}</h4>
                                                        <p className="text-[11px] text-zinc-500 truncate">{sub.intern.email}</p>
                                                    </div>
                                                    <span className={`text-[9px] font-black px-2 py-1 uppercase shrink-0 ml-4 ${sub.status === 'REVIEWED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                                        {sub.status}
                                                    </span>
                                                </div>

                                                <div className="flex gap-2 text-[10px] font-bold mb-6">
                                                    <a href={sub.githubLink} target="_blank" className="flex-1 h-8 flex items-center justify-center border border-zinc-200 bg-zinc-50/30 hover:bg-zinc-100 transition-all uppercase tracking-tighter">Code Repository</a>
                                                    <a href={sub.submissionLink} target="_blank" className="flex-1 h-8 flex items-center justify-center border border-zinc-200 bg-zinc-50/30 hover:bg-zinc-100 transition-all uppercase tracking-tighter">Live Preview</a>
                                                </div>

                                                <div className="mt-auto pt-4 border-t border-zinc-100">
                                                    {gradingSubmissionId === sub.id ? (
                                                        <form onSubmit={handleGradeSubmission} className="space-y-3">
                                                            <div className="flex flex-col sm:flex-row items-stretch gap-2">
                                                                <input 
                                                                    required 
                                                                    type="text" 
                                                                    placeholder="Marks" 
                                                                    value={gradingData.marks}
                                                                    onChange={(e) => setGradingData({...gradingData, marks: e.target.value})}
                                                                    className="w-full sm:w-20 h-10 bg-zinc-50 border border-zinc-200 px-3 text-[11px] font-bold outline-none focus:border-red-600 transition-colors"
                                                                />
                                                                <input 
                                                                    required 
                                                                    type="text" 
                                                                    placeholder="Review Remarks..." 
                                                                    value={gradingData.review}
                                                                    onChange={(e) => setGradingData({...gradingData, review: e.target.value})}
                                                                    className="flex-1 h-10 bg-zinc-50 border border-zinc-200 px-3 text-[11px] font-bold outline-none focus:border-red-600 transition-colors"
                                                                />
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button type="submit" className="flex-1 h-10 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors">Confirm Grades</button>
                                                                <button type="button" onClick={() => setGradingSubmissionId(null)} className="h-10 px-4 border border-zinc-200 text-zinc-400 text-[10px] font-bold uppercase hover:bg-zinc-50 transition-colors">Cancel</button>
                                                            </div>
                                                        </form>
                                                    ) : (
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                            <div className="flex flex-col min-w-0">
                                                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Grading Summary</span>
                                                                <div className="mt-1 flex items-baseline gap-2">
                                                                    <span className="text-sm font-black text-zinc-900">{sub.marks ? `${sub.marks}/100` : "PENDING"}</span>
                                                                    <span className="text-[11px] text-zinc-500 font-medium italic truncate max-w-[150px]">{sub.review || "No feedback yet"}</span>
                                                                </div>
                                                            </div>
                                                            <button 
                                                                onClick={() => {
                                                                    setGradingSubmissionId(sub.id);
                                                                    setGradingData({ marks: sub.marks || "", review: sub.review || "" });
                                                                }}
                                                                className="h-10 px-6 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-sm active:scale-95"
                                                            >
                                                                {sub.status === 'REVIEWED' ? 'Edit Grades' : 'Grade Task'}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full p-20 flex flex-col items-center justify-center text-center bg-white border border-zinc-200 border-dashed">
                                            <ClipboardCheck size={40} className="text-zinc-200 mb-4" />
                                            <h4 className="text-sm font-bold uppercase tracking-tight">System is Clean</h4>
                                            <p className="text-xs text-zinc-400 font-medium">No pending submissions found for <strong>{userData?.batch || "your account"}</strong>.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === "settings" && (
                            <div className="max-w-2xl bg-white border border-zinc-200 p-8 shadow-sm">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-8 pb-4 border-b border-zinc-50">Account Settings</h3>
                                <div className="space-y-4">
                                    <div className="p-5 border border-zinc-100 bg-zinc-50 hover:border-zinc-200 transition-colors cursor-pointer">
                                        <p className="text-sm font-bold text-zinc-900">Notifications</p>
                                        <p className="text-xs text-zinc-500 mt-0.5">Configure your alert preferences and platform updates.</p>
                                    </div>
                                    <div className="p-5 border border-zinc-100 bg-zinc-50 hover:border-zinc-200 transition-colors cursor-pointer">
                                        <p className="text-sm font-bold text-zinc-900">Security</p>
                                        <p className="text-xs text-zinc-500 mt-0.5">Manage your password, authentication, and sessions.</p>
                                    </div>
                                    <div className="p-5 border border-zinc-100 bg-zinc-50 hover:border-zinc-200 transition-colors cursor-pointer">
                                        <p className="text-sm font-bold text-zinc-900">Privacy</p>
                                        <p className="text-xs text-zinc-500 mt-0.5">Control who can see your profile and departmental status.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
