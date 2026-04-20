"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function InternProfile() {
    const [user, setUser] = useState<any>(null);
    const [detailedData, setDetailedData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"profile" | "edit">("profile");

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

            const isComplete = parsed.name && parsed.college && parsed.profileImage;
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
            <div className="h-[80vh] flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-6 w-6 border-2 border-zinc-200 border-t-zinc-900 animate-spin" />
                    <p className="text-[10px] font-medium text-zinc-400">Loading profile details...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    if (viewMode === "edit") {
        return (
            <div className="p-6 lg:p-12 space-y-12 pb-24 lg:pb-12 text-left bg-white min-h-screen font-normal">
                <div className="max-w-xl">
                    <h1 className="text-xl font-semibold text-zinc-900">Edit profile</h1>
                    <p className="text-zinc-500 text-[11px] mt-2 font-medium">Update your details for the community.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12 max-w-2xl">
                    <section className="space-y-6">
                        <div className="pb-2 border-b border-zinc-100">
                             <h2 className="text-[10px] font-semibold text-zinc-400">Profile photo</h2>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-10">
                            <div className="h-28 w-28 bg-white border border-zinc-200 rounded-none overflow-hidden flex items-center justify-center relative">
                                {formData.profileImage ? (
                                    <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-zinc-200 text-[10px] font-medium">No image</div>
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                        <div className="h-5 w-5 border-2 border-zinc-200 border-t-zinc-900 animate-spin" />
                                    </div>
                                )}
                            </div>

                            <div 
                                onDragEnter={handleDrag}
                                onDragOver={handleDrag}
                                onDragLeave={handleDrag}
                                onDrop={handleDrop}
                                className={`flex-1 w-full h-28 border border-dashed rounded-none transition-all flex flex-col items-center justify-center bg-zinc-50/50 cursor-pointer ${
                                    dragActive ? "border-zinc-900 bg-zinc-100" : "border-zinc-200 hover:border-zinc-300"
                                }`}
                                onClick={() => document.getElementById('photo-upload')?.click()}
                            >
                                <input id="photo-upload" type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
                                <div className="text-center">
                                    <p className="text-[11px] font-semibold text-zinc-900">Click to change</p>
                                    <p className="text-[9px] font-medium text-zinc-400 mt-1">Sharp edges preserved</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-8 text-left">
                        <div className="pb-2 border-b border-zinc-100">
                            <h2 className="text-[10px] font-semibold text-zinc-400">Information</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-1.5">
                               <label className="text-[9px] font-semibold text-zinc-400">Name</label>
                               <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-zinc-200 p-3 rounded-none text-[12px] font-medium text-zinc-900 focus:outline-none focus:border-zinc-900 transition-all" />
                            </div>
                            
                            <div className="space-y-1.5">
                               <label className="text-[9px] font-semibold text-zinc-400">College</label>
                               <input required type="text" value={formData.college} onChange={e => setFormData({...formData, college: e.target.value})} className="w-full bg-white border border-zinc-200 p-3 rounded-none text-[12px] font-medium text-zinc-900 focus:outline-none focus:border-zinc-900 transition-all" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                   <label className="text-[9px] font-semibold text-zinc-400">Department</label>
                                   <input required type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full bg-white border border-zinc-200 p-3 rounded-none text-[12px] font-medium text-zinc-900 focus:outline-none focus:border-zinc-900 transition-all" />
                                </div>
                                <div className="space-y-1.5">
                                   <label className="text-[9px] font-semibold text-zinc-400">Year</label>
                                   <select required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full bg-white border border-zinc-200 p-3 rounded-none text-[12px] font-medium text-zinc-900 focus:outline-none focus:border-zinc-900 transition-all">
                                      <option value="">Select year</option>
                                      <option value="1st Year">1st Year</option>
                                      <option value="2nd Year">2nd Year</option>
                                      <option value="3rd Year">3rd Year</option>
                                      <option value="4th Year">4th Year</option>
                                      <option value="Graduated">Graduated</option>
                                   </select>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="pt-8 flex items-center gap-6">
                        <button disabled={submitting} type="submit" className="bg-zinc-900 text-white px-10 py-4 rounded-none text-[10px] font-semibold hover:bg-black transition-all disabled:opacity-50">
                           {submitting ? "Saving..." : "Save profile"}
                        </button>
                        {detailedData && (
                            <button type="button" onClick={() => setViewMode("profile")} className="text-[10px] font-semibold text-zinc-400 hover:text-zinc-900">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        );
    }

    const { intern } = detailedData || {};
    if (!intern) return null;

    const presentCount = intern.attendances?.filter((a: any) => a.status === 'PRESENT').length || 0;
    const totalDays = intern.attendances?.length || 0;
    const attendancePercentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;
    const violationCount = intern.examSessions?.reduce((acc: number, s: any) => acc + (s.violations || 0), 0) || 0;

    return (
        <div className="min-h-screen bg-[#F3F2EF] pb-24 text-left font-normal">
            <div className="max-w-5xl mx-auto pt-8">
                {/* Main Profile Header Card */}
                <div className="bg-white border border-zinc-200 rounded-none overflow-hidden relative">
                    {/* Banner */}
                    <div className="h-44 bg-zinc-200 relative overflow-hidden">
                        <img 
                            src="https://media.sproutsocial.com/uploads/1c-LinkedIn-Banner-Personal-design-1.png" 
                            alt="Banner" 
                            className="w-full h-full object-cover"
                        />
                        <button onClick={() => setViewMode("edit")} className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 border border-zinc-200 transition-all text-zinc-600 hover:text-zinc-900">
                            <span className="text-[9px] font-semibold px-2">Edit</span>
                        </button>
                    </div>

                    {/* Profile Header Info */}
                    <div className="px-6 lg:px-12 pb-8">
                        <div className="relative -mt-20 mb-4 inline-block">
                            <div className="h-32 w-32 bg-white border border-white overflow-hidden flex items-center justify-center">
                                {intern.profileImage ? (
                                    <img src={intern.profileImage} alt={intern.name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full bg-zinc-100 flex items-center justify-center text-[10px] font-medium text-zinc-300">Photo</div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h1 className="text-2xl font-semibold text-zinc-900 leading-none">
                                        {intern.name}
                                    </h1>
                                    <p className="text-[13px] font-medium text-zinc-600 mt-2">
                                        Intern at Student Forge
                                    </p>
                                    <p className="text-[11px] font-medium text-zinc-400 mt-2">
                                        {intern.department || "General"} · {intern.year} · {intern.college}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className={`text-[10px] font-medium px-3 py-1 border rounded-none ${intern.isApproved ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                        {intern.isApproved ? 'Verified member' : 'Pending verification'}
                                    </p>
                                </div>
                            </div>

                            <div className="lg:text-right space-y-4 pt-2">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-medium text-zinc-400">Graduation {intern.graduationYear}</p>
                                    <div className="pt-2">
                                        <p className="text-[9px] font-medium text-zinc-300">Intern ID</p>
                                        <p className="text-[11px] font-semibold text-zinc-900 mt-0.5">#{intern.id.slice(-8).toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    {/* Content Area */}
                    <div className="lg:col-span-2 space-y-6 text-left">
                        {/* Analytics Card */}
                        <div className="bg-white border border-zinc-200 rounded-none p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-semibold text-zinc-900">Profile performance</h3>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
                                <div className="space-y-1">
                                    <p className="text-2xl font-semibold text-zinc-900">{attendancePercentage}%</p>
                                    <p className="text-[9px] font-medium text-zinc-400">Attendance</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-2xl font-semibold text-zinc-900">{presentCount}</p>
                                    <p className="text-[9px] font-medium text-zinc-400">Days present</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-2xl font-semibold text-zinc-900">{intern.scheduleSubmissions?.length || 0}</p>
                                    <p className="text-[9px] font-medium text-zinc-400">Submissions</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-2xl font-semibold text-rose-600">{violationCount}</p>
                                    <p className="text-[9px] font-medium text-rose-300">Warnings</p>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-zinc-100">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-semibold text-zinc-900">Daily contribution graph</p>
                                        <p className="text-[9px] font-medium text-zinc-400">Last 42 monitoring cycles</p>
                                    </div>
                                    <div className="flex items-center gap-4 text-[8px] font-medium text-zinc-400 uppercase tracking-widest">
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-2 w-2 bg-emerald-600" />
                                            <span>Attended</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-2 w-2 bg-zinc-100" />
                                            <span>Missed</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1.5 sm:grid sm:grid-cols-14">
                                    {intern.attendances?.slice(0, 42).reverse().map((att:any, i:number) => (
                                        <div 
                                            key={i} 
                                            className={`h-6 w-full sm:aspect-square flex items-center justify-center text-[9px] font-bold transition-all relative group
                                                ${att.status === 'PRESENT' 
                                                    ? 'bg-emerald-600 text-white' 
                                                    : 'bg-zinc-100 text-zinc-400 border border-zinc-200 hover:border-zinc-300'
                                                }`}
                                        >
                                            {new Date(att.date).getDate()}
                                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 text-white text-[8px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none rounded-none">
                                                {new Date(att.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}: {att.status}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Details Card */}
                        <div className="bg-white border border-zinc-200 rounded-none p-8">
                            <h3 className="text-sm font-semibold text-zinc-900 mb-8">Registry information</h3>
                            <div className="space-y-10">
                                <div className="flex gap-6">
                                    <div className="h-10 w-10 border border-zinc-900 flex items-center justify-center text-[10px] font-semibold text-zinc-900 shrink-0">Ed</div>
                                    <div>
                                        <p className="text-[13px] font-semibold text-zinc-900">{intern.college}</p>
                                        <p className="text-[11px] font-medium text-zinc-500 mt-1">{intern.department} · {intern.year}</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 pt-4">
                                    <div className="h-10 w-10 border border-zinc-300 flex items-center justify-center text-[10px] font-semibold text-zinc-400 shrink-0">Id</div>
                                    <div className="overflow-hidden">
                                        <p className="text-[13px] font-semibold text-zinc-900">Profile uid</p>
                                        <p className="text-[10px] font-mono text-zinc-400 mt-1 truncate">{intern.id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="hidden lg:block space-y-6">
                        <div className="bg-white border border-zinc-200 rounded-none p-8">
                            <h3 className="text-[11px] font-semibold text-zinc-900 mb-6">Status</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[9px] font-medium text-zinc-400 mb-1">Clearance</p>
                                    <p className="text-[12px] font-semibold text-emerald-600 tracking-tight">Active member</p>
                                </div>
                                <div className="h-px bg-zinc-50" />
                                <div className="pt-2">
                                    <p className="text-[9px] font-medium text-zinc-400 mb-1">Batch</p>
                                    <p className="text-[12px] font-semibold text-zinc-900 tracking-tight">{intern.batch || "Batch 1"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
