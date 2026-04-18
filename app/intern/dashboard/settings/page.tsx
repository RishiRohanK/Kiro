"use client";

import { User, Mail, School, GraduationCap, Calendar, Briefcase, Save, RefreshCw, CheckCircle2, Camera, Upload, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function InternProfile() {
    const [user, setUser] = useState<any>(null);
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
        }
    }, []);

    const handleUpload = async (file: File) => {
        if (!file || !user) return;
        setUploading(true);
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
            
            // Just update local state for the image, let the main form save handle the persistence
            setFormData(prev => ({ ...prev, profileImage: publicUrl }));
        } catch (error) {
            console.error("Upload failed");
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
        setSubmitting(true);
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
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (error) {
            console.error("Failed to update profile");
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) return null;

    return (
        <div className="p-4 lg:p-12 max-w-4xl mx-auto space-y-10 pb-24 lg:pb-12">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900 leading-none">Your Profile</h1>
                <p className="text-zinc-500 text-[11px] lg:text-sm mt-2 font-medium">Update your academic and personal information to stay eligible for bounties.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Profile Photo Upload */}
                <section className="space-y-6">
                   <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
                        <Camera size={16} className="text-[#0055FF]" />
                        <h2 className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">Profile Image</h2>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group">
                            <div className="h-32 w-32 bg-zinc-100 border-2 border-dashed border-zinc-200 overflow-hidden flex items-center justify-center">
                                {formData.profileImage ? (
                                    <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={40} className="text-zinc-300" />
                                )}
                                
                                {uploading && (
                                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                        <Loader2 className="animate-spin text-[#0055FF]" size={24} />
                                    </div>
                                )}
                            </div>
                            {formData.profileImage && (
                                <button 
                                    type="button"
                                    onClick={() => setFormData({...formData, profileImage: ""})}
                                    className="absolute -top-2 -right-2 bg-black text-white p-1 rounded-full shadow-lg"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>

                        <div 
                            onDragEnter={handleDrag}
                            onDragOver={handleDrag}
                            onDragLeave={handleDrag}
                            onDrop={handleDrop}
                            className={`flex-1 w-full p-8 border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 cursor-pointer ${
                                dragActive ? "border-[#0055FF] bg-blue-50/30" : "border-zinc-200 hover:border-zinc-300"
                            }`}
                            onClick={() => document.getElementById('photo-upload')?.click()}
                        >
                            <input 
                                id="photo-upload"
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
                            />
                            <div className="w-10 h-10 bg-zinc-50 flex items-center justify-center text-zinc-400">
                                <Upload size={18} />
                            </div>
                            <div className="text-center">
                                <p className="text-[13px] font-bold text-zinc-900">Drag and drop your photo</p>
                                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mt-1">or click to browse from device</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Academic Background */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
                        <School size={16} className="text-[#0055FF]" />
                        <h2 className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">Academic Credentials</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Full Name</label>
                           <input 
                              required
                              type="text"
                              value={formData.name}
                              onChange={e => setFormData({...formData, name: e.target.value})}
                              className="w-full bg-zinc-50 border border-zinc-200 p-4 text-[13px] font-bold text-zinc-900 focus:outline-none focus:border-[#0055FF] transition-all"
                           />
                        </div>
                        <div className="space-y-2 opacity-50">
                           <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Email Address (Locked)</label>
                           <input 
                              disabled
                              type="email"
                              value={user.email}
                              className="w-full bg-zinc-100 border border-zinc-200 p-4 text-[13px] font-bold text-zinc-400 cursor-not-allowed"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">College / University</label>
                           <input 
                              required
                              type="text"
                              placeholder="e.g. IIT Hyderabad"
                              value={formData.college}
                              onChange={e => setFormData({...formData, college: e.target.value})}
                              className="w-full bg-zinc-50 border border-zinc-200 p-4 text-[13px] font-bold text-zinc-900 focus:outline-none focus:border-[#0055FF] transition-all"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Study Year</label>
                           <select 
                              required
                              value={formData.year}
                              onChange={e => setFormData({...formData, year: e.target.value})}
                              className="w-full bg-zinc-50 border border-zinc-200 p-4 text-[13px] font-bold text-zinc-900 focus:outline-none focus:border-[#0055FF] transition-all"
                           >
                              <option value="">Select Year</option>
                              <option value="1st Year">1st Year</option>
                              <option value="2nd Year">2nd Year</option>
                              <option value="3rd Year">3rd Year</option>
                              <option value="4th Year">4th Year</option>
                              <option value="Graduated">Graduated</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Department / Branch</label>
                           <input 
                              required
                              type="text"
                              placeholder="e.g. Computer Science"
                              value={formData.department}
                              onChange={e => setFormData({...formData, department: e.target.value})}
                              className="w-full bg-zinc-50 border border-zinc-200 p-4 text-[13px] font-bold text-zinc-900 focus:outline-none focus:border-[#0055FF] transition-all"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Graduation Year</label>
                           <input 
                              required
                              type="number"
                              placeholder="e.g. 2026"
                              value={formData.graduationYear}
                              onChange={e => setFormData({...formData, graduationYear: e.target.value})}
                              className="w-full bg-zinc-50 border border-zinc-200 p-4 text-[13px] font-bold text-zinc-900 focus:outline-none focus:border-[#0055FF] transition-all"
                           />
                        </div>
                    </div>
                </section>

                {/* Personal & Professional */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
                        <Briefcase size={16} className="text-[#0055FF]" />
                        <h2 className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">Professional Interests</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Date of Birth</label>
                           <input 
                              required
                              type="date"
                              value={formData.dob}
                              onChange={e => setFormData({...formData, dob: e.target.value})}
                              className="w-full bg-zinc-50 border border-zinc-200 p-4 text-[13px] font-bold text-zinc-900 focus:outline-none focus:border-[#0055FF] transition-all"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Interested Area (Bounties)</label>
                           <select 
                              required
                              value={formData.interestedArea}
                              onChange={e => setFormData({...formData, interestedArea: e.target.value})}
                              className="w-full bg-zinc-50 border border-zinc-200 p-4 text-[13px] font-bold text-zinc-900 focus:outline-none focus:border-[#0055FF] transition-all"
                           >
                              <option value="">Select Domain</option>
                              <option value="Frontend (React/Next.js)">Frontend (React/Next.js)</option>
                              <option value="Backend (Node.js/Go)">Backend (Node.js/Go)</option>
                              <option value="Full Stack Development">Full Stack Development</option>
                              <option value="UI/UX Design">UI/UX Design</option>
                              <option value="AI / ML Models">AI / ML Models</option>
                              <option value="DevOps & Infrastructure">DevOps & Infrastructure</option>
                              <option value="Content & Technical Writing">Content & Technical Writing</option>
                           </select>
                        </div>
                    </div>
                </section>

                <div className="pt-6 flex items-center gap-4">
                  <button 
                     disabled={submitting}
                     type="submit"
                     className="bg-black text-white px-8 py-4 text-[13px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-3 disabled:opacity-50"
                  >
                     {submitting ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                     Update Profile
                  </button>

                  <AnimatePresence>
                     {success && (
                        <motion.div 
                           initial={{ opacity: 0, x: -10 }} 
                           animate={{ opacity: 1, x: 0 }} 
                           className="flex items-center gap-2 text-emerald-600 font-bold text-[12px]"
                        >
                           <CheckCircle2 size={18} />
                           Profile synchronized successfully!
                        </motion.div>
                     )}
                  </AnimatePresence>
                </div>
            </form>
        </div>
    );
}
