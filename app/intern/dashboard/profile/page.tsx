"use client";

import { useEffect, useState } from "react";
import { 
    Loader2, 
    RefreshCw, 
    Save, 
    Link as LinkIcon, 
    MapPin, 
    GraduationCap, 
    Calendar, 
    Edit2, 
    Lock, 
    ChevronLeft,
    ExternalLink,
    Code,
    Sparkles,
    Target,
    Flame,
    User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function InternProfile() {
    const [user, setUser] = useState<any>(null);
    const [detailedData, setDetailedData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"profile" | "edit">("profile");
    const [activeTab, setActiveTab] = useState<"Summary" | "My Journey" | "Activity">("Summary");

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        college: "",
        year: "",
        department: "",
        dob: "",
        graduationYear: "",
        interestedArea: "",
        profileImage: ""
    });

    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("intern_user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setFormData({
                name: parsed.name || "",
                college: parsed.college || "",
                year: parsed.year || "",
                department: parsed.department || "",
                dob: parsed.dob || "",
                graduationYear: parsed.graduationYear || "",
                interestedArea: parsed.interestedArea || "",
                profileImage: parsed.profileImage || ""
            });

            const requiredFields = ['name', 'college', 'year', 'department', 'dob', 'graduationYear', 'interestedArea', 'profileImage'];
            const isComplete = requiredFields.every(field => {
                const val = parsed[field];
                return val !== null && val !== undefined && val.toString().trim() !== "";
            });
            setViewMode(isComplete ? "profile" : "edit");
            
            fetchDetailedData(parsed.id);
        }
    }, []);

    const fetchDetailedData = async (userId: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/intern/profile?userId=${userId}`);
            const data = await res.json();
            if (data.success) {
                setDetailedData(data);
                if (data.intern) {
                    const updatedUser = { ...user, ...data.intern };
                    localStorage.setItem("intern_user", JSON.stringify(updatedUser));
                }
            }
        } catch (error) {
            console.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (file: File) => {
        if (!file || !user) return;
        
        const MAX_SIZE = 3 * 1024 * 1024; 
        if (file.size > MAX_SIZE) {
            setUploadError("Image must be less than 3MB");
            setTimeout(() => setUploadError(null), 3000);
            return;
        }

        setUploading(true);
        setUploadError(null);
        
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `profiles/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('intern-assets')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('intern-assets')
                .getPublicUrl(filePath);

            const publicUrl = data.publicUrl;
            setFormData(prev => ({ ...prev, profileImage: publicUrl }));
        } catch (error: any) {
            setUploadError("Upload failed.");
            setTimeout(() => setUploadError(null), 3000);
        } finally {
            setUploading(false);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleUpload(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.profileImage) {
            setUploadError("Profile image is required");
            setTimeout(() => setUploadError(null), 3000);
            return;
        }

        setSubmitting(true);
        setSubmitError(null);
        try {
            const res = await fetch("/api/intern/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, ...formData })
            });
            const data = await res.json();
            if (data.success) {
                const updatedUser = { ...user, ...formData };
                localStorage.setItem("intern_user", JSON.stringify(updatedUser));
                setUser(updatedUser);
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    setViewMode("profile");
                    fetchDetailedData(user.id);
                    window.location.reload();
                }, 1500);
            } else {
                setSubmitError(data.error || "Failed to update.");
            }
        } catch (error) {
            setSubmitError("Error updating.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && viewMode === "profile") {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="h-8 w-8 border-2 border-zinc-200 border-t-zinc-900 rounded-full" 
                    />
                    <p className="text-[11px] font-semibold text-zinc-400 tracking-widest uppercase">Profile loading</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    if (viewMode === "edit") {
        return (
            <div className="min-h-screen bg-white">
                <div className="max-w-[1300px] mx-auto px-8 py-12">
                    <button 
                        onClick={() => setViewMode("profile")}
                        className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors mb-12"
                    >
                        <ChevronLeft size={16} />
                        <span className="text-[11px] font-bold uppercase tracking-wider">Back to Profile</span>
                    </button>

                    <div className="mb-16">
                        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Edit Profile</h1>
                        <p className="text-zinc-500 text-[13px] mt-2">Update your details here.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-16">
                        {/* Profile Photo Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div>
                                <h2 className="text-[11px] font-bold text-zinc-900 uppercase tracking-widest mb-2">Profile Photo</h2>
                                <p className="text-zinc-400 text-[11px]">Upload a photo. Max 3MB.</p>
                            </div>
                            <div className="md:col-span-2 flex items-center gap-10">
                                <div className="h-32 w-32 bg-zinc-50 border border-zinc-100 overflow-hidden relative group">
                                    {formData.profileImage ? (
                                        <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-zinc-50">
                                            <Sparkles className="text-zinc-200" size={24} />
                                        </div>
                                    )}
                                    {uploading && (
                                        <div className="absolute inset-0 bg-white/90 flex items-center justify-center">
                                            <Loader2 className="animate-spin text-zinc-900" size={20} />
                                        </div>
                                    )}
                                </div>

                                <div 
                                    onDragEnter={handleDrag}
                                    onDragOver={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDrop={handleDrop}
                                    className={`flex-1 h-32 border border-dashed flex flex-col items-center justify-center transition-all cursor-pointer ${
                                        dragActive ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:border-zinc-300"
                                    }`}
                                    onClick={() => document.getElementById('photo-upload')?.click()}
                                >
                                    <input id="photo-upload" type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
                                    <p className="text-[11px] font-bold text-zinc-900 uppercase tracking-wider">Change Image</p>
                                    <p className="text-[9px] text-zinc-400 mt-1 uppercase tracking-tight">or drag and drop</p>
                                </div>
                            </div>
                        </div>

                        {/* Information Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div>
                                <h2 className="text-[11px] font-bold text-zinc-900 uppercase tracking-widest mb-2">Core Information</h2>
                                <p className="text-zinc-400 text-[11px]">These details define your profile header.</p>
                            </div>
                            <div className="md:col-span-2 space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Full Name</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-zinc-200 p-4 text-[13px] font-medium text-zinc-900 focus:outline-none focus:border-zinc-900 transition-all placeholder:text-zinc-300" placeholder="e.g. Rishi Rohan Kalapala" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">College / University</label>
                                    <input required type="text" value={formData.college} onChange={e => setFormData({...formData, college: e.target.value})} className="w-full bg-white border border-zinc-200 p-4 text-[13px] font-medium text-zinc-900 focus:outline-none focus:border-zinc-900 transition-all placeholder:text-zinc-300" placeholder="e.g. CMR Institute of Technology" />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Department / Degree</label>
                                        <input required type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full bg-white border border-zinc-200 p-4 text-[13px] font-medium text-zinc-900 focus:outline-none focus:border-zinc-900 transition-all placeholder:text-zinc-300" placeholder="e.g. B.Tech - AIML" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Current Year</label>
                                        <select required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full bg-white border border-zinc-200 p-4 text-[13px] font-medium text-zinc-900 focus:outline-none focus:border-zinc-900 transition-all">
                                            <option value="">Select</option>
                                            <option value="1st Year">1st Year</option>
                                            <option value="2nd Year">2nd Year</option>
                                            <option value="3rd Year">3rd Year</option>
                                            <option value="4th Year">4th Year</option>
                                            <option value="Graduated">Graduated</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Graduation Year</label>
                                        <input required type="number" value={formData.graduationYear} onChange={e => setFormData({...formData, graduationYear: e.target.value})} className="w-full bg-white border border-zinc-200 p-4 text-[13px] font-medium text-zinc-900 focus:outline-none focus:border-zinc-900 transition-all placeholder:text-zinc-300" placeholder="2026" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date of Birth</label>
                                        <input required type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} className="w-full bg-white border border-zinc-200 p-4 text-[13px] font-medium text-zinc-900 focus:outline-none focus:border-zinc-900 transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Areas of Interest (Expertise)</label>
                                    <textarea required rows={3} value={formData.interestedArea} onChange={e => setFormData({...formData, interestedArea: e.target.value})} className="w-full bg-white border border-zinc-200 p-4 text-[13px] font-medium text-zinc-900 focus:outline-none focus:border-zinc-900 transition-all placeholder:text-zinc-300 resize-none" placeholder="e.g. Fullstack Development, UI/UX Design, AI/ML (comma separated)" />
                                    <p className="text-[9px] text-zinc-400 italic">Separate tags with commas to display them as skills on your profile.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-12 border-t border-zinc-100 flex items-center justify-end gap-6">
                            <button 
                                type="button" 
                                onClick={() => setViewMode("profile")}
                                className="text-[11px] font-bold text-zinc-400 hover:text-zinc-900 uppercase tracking-widest transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                disabled={submitting} 
                                type="submit" 
                                className="bg-[#003366] text-white px-8 h-10 text-[11px] font-bold uppercase tracking-wider hover:bg-[#002244] transition-all disabled:opacity-50 flex items-center gap-2 rounded-lg"
                            >
                                {submitting ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                                {submitting ? "Saving Changes" : "Save Profile"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    const { intern } = detailedData || {};
    if (!intern) return null;

    const streak = (() => {
        if (!intern.attendances || intern.attendances.length === 0) return 0;
        const sorted = [...intern.attendances].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        let s = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const firstDate = new Date(sorted[0].date);
        firstDate.setHours(0, 0, 0, 0);
        const diff = (today.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diff > 1) return 0;
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
        return s;
    })();

    const initials = intern.name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    const skills = intern.interestedArea?.split(',').map((s: string) => s.trim()).filter((s: string) => s !== "") || [];
    
    // Mocked data for UI richness based on the request
    const expertise = skills.slice(0, 8);
    const interests = skills;
    const values = ["Creativity", "Continuous Learning", "Problem-Solving", "Collaboration", "Integrity", "Adaptability", "Efficiency", "Leadership"];
    const summary = `Full-Stack Engineer (AIML) | Specializing in Product Architecture, UI/UX Precision, and System Reliability | Building - Student Forge ecosystem | Technical Innovator and Product Designer with a focus on scalable systems.`;

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-32">
            {/* Top Navigation */}
            <div className="max-w-[1300px] mx-auto px-8 pt-8">
                <Link 
                    href="/intern/dashboard"
                    className="inline-flex items-center gap-2 text-[#003366] hover:underline transition-all text-[14px] font-semibold"
                >
                    <ChevronLeft size={16} />
                    <span>Back to Dashboard</span>
                </Link>
            </div>

            <div className="max-w-[1300px] mx-auto mt-6 px-8 space-y-6">
                
                {/* Main Profile Section */}
                <div className="space-y-6">
                    
                    {/* Header Card */}
                    <div className="bg-white border border-zinc-200 shadow-sm overflow-hidden relative rounded-xl">
                        {/* Banner */}
                        <div className="h-[160px] relative">
                            <img 
                                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" 
                                alt="Banner" 
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Profile Info Row */}
                        <div className="px-10 pb-8 relative flex items-start">
                            {/* Profile Image Overlap */}
                            <div className="flex-shrink-0 relative -mt-16 mr-8">
                                <div className="h-36 w-36 bg-blue-50 border-[4px] border-white rounded-full flex items-center justify-center overflow-hidden shadow-md">
                                    {intern.profileImage ? (
                                        <img src={intern.profileImage} alt={intern.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-medium text-[#003366]">{initials}</span>
                                    )}
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="mt-6 flex-1 flex flex-col md:flex-row justify-between items-start gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                                            {intern.name}
                                        </h1>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="bg-[#F3F3F3] text-zinc-500 px-3 py-1 rounded-full text-[12px] font-medium">Student</span>
                                            <span className="bg-[#F3F3F3] text-zinc-500 px-3 py-1 rounded-full text-[12px] font-medium">{intern.year.split(' ')[0]} - {intern.graduationYear} Batch</span>
                                        </div>
                                        <p className="text-[14px] text-zinc-600 mt-4 leading-relaxed font-medium">
                                            {intern.department}
                                        </p>
                                        <div className="mt-8 flex items-center gap-6">
                                            <div className="flex items-center gap-3">
                                                {intern.college?.toLowerCase().includes('cmr') ? (
                                                    <img src="https://ik.imagekit.io/dypkhqxip/cmrit?updatedAt=1777830973272" alt="CMRIT" className="h-8 w-auto object-contain" />
                                                ) : intern.college?.toLowerCase().includes('kits') ? (
                                                    <img src="https://ik.imagekit.io/dypkhqxip/kits?updatedAt=1777830973939" alt="KITS" className="h-8 w-auto object-contain" />
                                                ) : intern.college?.toLowerCase().includes('mohan babu') ? (
                                                    <img src="https://upload.wikimedia.org/wikipedia/en/4/4b/Mohan_Babu_University_Logo%2C_Tirupati%2C_Andhra_Pradesh%2C_India.png" alt="MBU" className="h-8 w-auto object-contain" />
                                                ) : intern.college?.toLowerCase().includes('visvesvaraya') ? (
                                                    <img src="https://vcethyd.ac.in/wp-content/uploads/2026/02/Visvesvaraya-College-emblem-fin-white.png" alt="VCET" className="h-8 w-auto object-contain" />
                                                ) : intern.college?.toLowerCase().includes('malla reddy university') ? (
                                                    <img src="https://media.collegedekho.com/media/img/institute/logo/Malla_reddy_University_logo.png" alt="MRUN" className="h-8 w-auto object-contain" />
                                                ) : intern.college?.toLowerCase().includes('siddhartha') ? (
                                                    <img src="https://media.licdn.com/dms/image/v2/C560BAQGV5F0LXyUOTQ/company-logo_200_200/company-logo_200_200/0/1631333448241?e=2147483647&v=beta&t=k2u15Yhys2ZYnLgwW7o6z0zJlZ2bdM80l0vEr0HpfHk" alt="SIET" className="h-8 w-auto object-contain" />
                                                ) : intern.college?.toLowerCase().includes('sridevi') ? (
                                                    <img src="https://media.licdn.com/dms/image/v2/C510BAQGyKdTUQ04Oyg/company-logo_200_200/company-logo_200_200/0/1631423254444?e=2147483647&v=beta&t=Mb1KuCUuwUy47R_K2nqY3GSWuGs6-LMwBRZIUU-ufBQ" alt="SWEC" className="h-8 w-auto object-contain" />
                                                ) : intern.college?.toLowerCase().includes('samskruti') ? (
                                                    <img src="https://www.samskruti.ac.in/assets/images/logo/engg-website-logo-2.png" alt="SCET" className="h-8 w-auto object-contain" />
                                                ) : intern.college?.toLowerCase().includes('aurora') ? (
                                                    <img src="https://ik.imagekit.io/syustaging/SYU_PREPROD/LOGO_iIx7UI8hr.webp?tr=w-3840" alt="ADU" className="h-8 w-auto object-contain" />
                                                ) : intern.college?.toLowerCase().includes('vaageswari') ? (
                                                    <img src="https://assets.allegiance-educare.com/colleges/thumb/250_250_14819612261420606562logo%20veg.jpg" alt="VGEC" className="h-8 w-auto object-contain" />
                                                ) : intern.college?.toLowerCase().includes('sumathi reddy') ? (
                                                    <img src="https://media.licdn.com/dms/image/v2/D4D0BAQEWhPxE6vvFiQ/company-logo_200_200/B4DZhZ8yLKHAAM-/0/1753855764165/sumathi_reddy_institute_of_technology_for_women_logo?e=2147483647&v=beta&t=cEdqkedLD2E8iQHSGYXIj-IVeL7DdlRQlmpG6hRXqqw" alt="SRIW" className="h-8 w-auto object-contain" />
                                                ) : (
                                                    <div className="bg-blue-50 p-1.5 rounded-full">
                                                        <User size={14} className="text-[#003366]" />
                                                    </div>
                                                )}
                                                <p className="text-[14px] font-semibold text-zinc-700 leading-tight">
                                                    {intern.college}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mt-4 md:mt-0">
                                    <button 
                                        onClick={() => setViewMode("edit")}
                                        className="flex items-center gap-2 border-[1.5px] border-[#003366] text-[#003366] px-6 py-2.5 rounded-lg text-[13px] font-bold hover:bg-blue-50/50 transition-all"
                                    >
                                        <Edit2 size={14} />
                                        Edit Profile
                                    </button>
                                    <button 
                                        className="flex items-center gap-2 border-[1.5px] border-zinc-200 text-zinc-600 px-6 py-2.5 rounded-lg text-[13px] font-bold hover:bg-zinc-50 transition-all"
                                    >
                                        <Lock size={14} />
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="bg-white border border-zinc-200 shadow-sm rounded-sm overflow-hidden">
                        <div className="border-b border-zinc-100 flex items-center gap-10 px-10">
                            {["Summary", "My Journey", "Activity"].map((tab: any) => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 text-[13px] font-bold transition-all relative ${
                                        activeTab === tab ? "text-[#003366] border-b-2 border-[#003366]" : "text-zinc-400 hover:text-zinc-600"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="p-12">
                            <AnimatePresence mode="wait">
                                {activeTab === "Summary" && (
                                    <motion.div 
                                        key="summary"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-12"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                            {/* Overall Attendance Percentage */}
                                            <div className="bg-zinc-50 border border-zinc-100 p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
                                                <div className="relative h-24 w-24 flex items-center justify-center">
                                                    <svg className="h-full w-full transform -rotate-90">
                                                        <circle
                                                            cx="48" cy="48" r="42"
                                                            fill="transparent"
                                                            stroke="currentColor"
                                                            strokeWidth="8"
                                                            className="text-zinc-200"
                                                        />
                                                        <motion.circle
                                                            cx="48" cy="48" r="42"
                                                            fill="transparent"
                                                            stroke="currentColor"
                                                            strokeWidth="8"
                                                            strokeDasharray={2 * Math.PI * 42}
                                                            initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                                                            animate={{ 
                                                                strokeDashoffset: 2 * Math.PI * 42 * (1 - (intern.attendances?.filter((a: any) => a.status === 'PRESENT').length / Math.max(intern.attendances?.length || 1, 1))) 
                                                            }}
                                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                                            className="text-[#003366]"
                                                        />
                                                    </svg>
                                                    <span className="absolute text-xl font-bold text-zinc-900">
                                                        {Math.round((intern.attendances?.filter((a: any) => a.status === 'PRESENT').length / Math.max(intern.attendances?.length || 1, 1)) * 100)}%
                                                    </span>
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest">Attendance</h3>
                                                    <p className="text-[14px] font-bold text-zinc-900">My progress</p>
                                                </div>
                                            </div>

                                            <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="bg-white border border-zinc-100 p-6 rounded-2xl space-y-2 relative overflow-hidden">
                                                    <div className="absolute top-2 right-2 text-[#003366]">
                                                        <Flame size={16} />
                                                    </div>
                                                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Current Streak</p>
                                                    <p className="text-2xl font-bold text-zinc-900">{streak} <span className="text-sm font-normal text-zinc-400">days</span></p>
                                                    <p className="text-[10px] text-zinc-400 font-medium italic">Consecutive login</p>
                                                </div>
                                                <div className="bg-white border border-zinc-100 p-6 rounded-2xl space-y-2">
                                                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Working days</p>
                                                    <p className="text-2xl font-bold text-zinc-900">{intern.attendances?.length || 0}</p>
                                                    <p className="text-[10px] text-zinc-400 font-medium italic">Tracked days</p>
                                                </div>
                                                <div className="bg-white border border-zinc-100 p-6 rounded-2xl space-y-2">
                                                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Days present</p>
                                                    <p className="text-2xl font-bold text-[#003366]">{intern.attendances?.filter((a: any) => a.status === 'PRESENT').length || 0}</p>
                                                    <p className="text-[10px] text-zinc-400 font-medium italic">Present days</p>
                                                </div>
                                                <div className="bg-white border border-zinc-100 p-6 rounded-2xl space-y-2">
                                                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Leaves</p>
                                                    <p className="text-2xl font-bold text-zinc-900">{intern.attendances?.filter((a: any) => a.status === 'VACATION').length || 0}</p>
                                                    <p className="text-[10px] text-zinc-400 font-medium italic">Official leaves</p>
                                                </div>
                                                <div className="bg-white border border-zinc-100 p-6 rounded-2xl space-y-2">
                                                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Late arrivals</p>
                                                    <p className="text-2xl font-bold text-zinc-900">{intern.attendances?.filter((a: any) => a.status === 'LATE').length || 0}</p>
                                                    <p className="text-[10px] text-zinc-400 font-medium italic">Late days</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <h2 className="text-[16px] font-bold text-zinc-900 tracking-tight">My history</h2>
                                                    <p className="text-[12px] text-zinc-400 font-medium uppercase tracking-wider">Monthly tracking</p>
                                                </div>
                                                <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                                                    <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 bg-[#003366] rounded-sm" /> Present</div>
                                                    <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 bg-zinc-200 rounded-sm" /> Absent</div>
                                                </div>
                                            </div>

                                            {/* Monthly Attendance Chart */}
                                            <div className="bg-white border border-zinc-100 p-8 rounded-2xl">
                                                <div className="h-48 flex items-end gap-6">
                                                    {(() => {
                                                        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                                                        const currentYear = intern.attendances?.length > 0 ? new Date(intern.attendances[0].date).getFullYear() : new Date().getFullYear();
                                                        
                                                        // Group attendance by month
                                                        const monthlyData = months.map((month, index) => {
                                                            const count = intern.attendances?.filter((a: any) => {
                                                                const d = new Date(a.date);
                                                                return d.getMonth() === index && d.getFullYear() === currentYear;
                                                            }).length || 0;
                                                            return { month, count };
                                                        });

                                                        const maxCount = Math.max(...monthlyData.map(m => m.count), 5);

                                                        return monthlyData.map((data, idx) => (
                                                            <div key={idx} className="flex-1 flex flex-col items-center gap-3 group">
                                                                 <div className="w-full relative flex flex-col justify-end h-full">
                                                                    <motion.div 
                                                                        initial={{ height: 0 }}
                                                                        animate={{ height: data.count > 0 ? `${Math.max((data.count / maxCount) * 100, 5)}%` : "0%" }}
                                                                        transition={{ delay: idx * 0.05, duration: 0.8, ease: "easeOut" }}
                                                                        className="w-full bg-[#003366] rounded-t-sm transition-all relative"
                                                                    >
                                                                        {data.count > 0 && (
                                                                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#003366] opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                {data.count}d
                                                                            </span>
                                                                        )}
                                                                    </motion.div>
                                                                </div>
                                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{data.month}</span>
                                                            </div>
                                                        ));
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === "My Journey" && (
                                    <motion.div 
                                        key="career"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="py-20 flex flex-col items-center justify-center text-center space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <h3 className="text-[18px] font-bold text-zinc-900">Journey started</h3>
                                            <p className="text-zinc-400 text-[14px] max-w-md mx-auto font-medium">You joined on {new Date(intern.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. Your progress is being tracked.</p>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === "Activity" && (
                                    <motion.div 
                                        key="activity"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-10"
                                    >
                                        <h3 className="text-[15px] font-bold text-zinc-900 uppercase tracking-widest mb-8">Recent work</h3>
                                        {intern.scheduleSubmissions?.length > 0 ? (
                                            intern.scheduleSubmissions.slice(0, 5).map((sub: any) => (
                                                <div key={sub.id} className="flex gap-8 items-start group relative pb-10 last:pb-0">
                                                    <div className="absolute left-[7px] top-6 bottom-0 w-px bg-zinc-100 group-last:hidden" />
                                                    <div className="h-4 w-4 rounded-full border-4 border-white bg-zinc-200 group-hover:bg-[#003366] transition-colors z-10 shadow-sm" />
                                                    <div className="space-y-2 flex-1">
                                                        <p className="text-[15px] font-bold text-zinc-900">{sub.schedule.typeOfWork}</p>
                                                        <p className="text-[12px] text-zinc-400 font-bold uppercase tracking-wider">
                                                            {new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                        <div className="pt-2">
                                                            <Link href={sub.githubLink} className="inline-flex items-center gap-2 text-[11px] text-white bg-[#003366] px-4 py-2 rounded-lg font-bold hover:bg-[#002244] transition-all">
                                                                <ExternalLink size={12} />
                                                                View repo
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="py-20 text-center">
                                                <p className="text-zinc-400 text-[14px] italic font-medium">No recent activity recorded on the platform.</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
