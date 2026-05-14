"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    User, 
    Mail, 
    Phone, 
    Globe, 
    Github, 
    Linkedin, 
    MapPin, 
    Briefcase, 
    GraduationCap, 
    Code, 
    Trophy, 
    Download, 
    Plus, 
    Trash2,
    ChevronRight,
    ChevronLeft,
    FileText,
    Sparkles,
    CheckCircle2,
    X,
    PlusCircle
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const NO_SMOOTH_SCROLL = `
    html, body, * { 
        scroll-behavior: auto !important; 
        -webkit-overflow-scrolling: auto !important;
    }
`;

interface ResumeData {
    personalInfo: {
        fullName: string;
        title: string; 
        email: string;
        phone: string;
        location: string;
        portfolio: string;
        github: string;
        linkedin: string;
        profilePic?: string;
        collegeLogo?: string;
    };
    summary: string;
    expertise: string[];
    experience: {
        id: string;
        role: string;
        company: string;
        domain: string;
        location: string;
        period: string;
        skills: string[];
        description: string[];
    }[];
    education: {
        id: string;
        institution: string;
        degree: string;
        period: string;
        grade: string;
        type: "degree" | "12th" | "10th";
    }[];
    projects: {
        id: string;
        title: string;
        teamSize: string;
        tech: string[];
        description: string[];
        link: string;
        period: string;
    }[];
    skills: {
        category: string;
        items: string[];
    }[];
    certificates: {
        id: string;
        name: string;
        issuer: string;
        date: string;
    }[];
}

const INITIAL_DATA: ResumeData = {
    personalInfo: {
        fullName: "",
        title: "Intern at Student Forge",
        email: "",
        phone: "",
        location: "Hyderabad, India",
        portfolio: "",
        github: "",
        linkedin: "",
        profilePic: "", 
        collegeLogo: "" 
    },
    summary: "A passionate and driven individual with a strong foundation in modern technology and a commitment to professional growth.",
    expertise: ["Full-Stack Development", "UI/UX Design", "Problem Solving"],
    experience: [
        {
            id: "1",
            role: "Software Intern",
            company: "Student Forge",
            domain: "Technology",
            location: "Remote",
            period: "Jan 2024 - Present",
            skills: ["React", "TypeScript"],
            description: [
                "Developing core features for the intern dashboard.",
                "Collaborating with senior developers on production code."
            ]
        }
    ],
    education: [
        {
            id: "1",
            institution: "Your University Name",
            degree: "Bachelor of Technology",
            period: "2022 - 2026",
            grade: "8.5 CGPA",
            type: "degree"
        }
    ],
    projects: [
        {
            id: "1",
            title: "Portfolio Website",
            teamSize: "1",
            tech: ["Next.js", "Tailwind CSS"],
            description: [
                "Built a high-performance portfolio website with optimized SEO and premium design aesthetics."
            ],
            link: "https://example.com",
            period: "Dec 2023"
        }
    ],
    skills: [
        { category: "Languages", items: ["JavaScript", "TypeScript", "Python"] },
        { category: "Frameworks", items: ["React", "Next.js", "Node.js"] },
        { category: "Tools", items: ["Git", "Postman", "Figma"] }
    ],
    certificates: [
        { id: "1", name: "Full Stack Web Development", issuer: "Student Forge", date: "Jan 2024" }
    ]
};

export default function ResumeGeneratorPage() {
    const [data, setData] = useState<ResumeData>(INITIAL_DATA);
    const [activeTab, setActiveTab] = useState("info");
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // Force scroll-behavior to auto everywhere
        document.documentElement.style.scrollBehavior = 'auto';
        document.body.style.scrollBehavior = 'auto';

        const initData = async () => {
            const storedUser = localStorage.getItem("intern_user");
            if (!storedUser) return;
            const user = JSON.parse(storedUser);

            const college = user.college?.toLowerCase() || "";
            let logo = "";
            if (college.includes("cmrit") || college.includes("cmr")) {
                logo = "https://ik.imagekit.io/dypkhqxip/cmrit.png";
            } else if (college.includes("kits") || college.includes("kamala institute")) {
                logo = "https://ik.imagekit.io/dypkhqxip/kits.png";
            } else if (college.includes("visvesvaraya")) {
                logo = "https://vcethyd.ac.in/wp-content/uploads/2026/02/Visvesvaraya-College-emblem-fin-white.png";
            }

            setData(prev => ({
                ...prev,
                personalInfo: {
                    ...prev.personalInfo,
                    fullName: user.name || prev.personalInfo.fullName,
                    email: user.email || prev.personalInfo.email,
                    collegeLogo: logo || prev.personalInfo.collegeLogo,
                    profilePic: user.profileImage || prev.personalInfo.profilePic,
                    title: user.department ? `${user.department} Intern` : prev.personalInfo.title
                }
            }));

            try {
                const res = await fetch(`/api/intern/resume?internId=${user.id}`);
                const d = await res.json();
                if (d.success && d.resumeData) {
                    setData({
                        ...d.resumeData,
                        personalInfo: {
                            ...d.resumeData.personalInfo,
                            collegeLogo: logo || d.resumeData.personalInfo.collegeLogo,
                            profilePic: user.profileImage || d.resumeData.personalInfo.profilePic
                        }
                    });
                }
            } catch (e) {
                console.error("Failed to load resume");
            }
        };
        initData();
    }, []);

    const handleSaveResume = async () => {
        const storedUser = localStorage.getItem("intern_user");
        if (!storedUser) return;
        const user = JSON.parse(storedUser);

        setIsSaving(true);
        try {
            const res = await fetch("/api/intern/resume", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, resumeData: data })
            });
            if (res.ok) {
                // Success
            }
        } catch (err) {
            console.error("Failed to save resume");
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'profilePic' | 'collegeLogo') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setData({
                    ...data,
                    personalInfo: {
                        ...data.personalInfo,
                        [field]: reader.result as string
                    }
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const getBase64Image = (url: string): Promise<string | null> => {
        if (!url) return Promise.resolve(null);
        if (url.startsWith('data:')) return Promise.resolve(url);
        
        return new Promise((resolve) => {
            const img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    const dataURL = canvas.toDataURL("image/png");
                    resolve(dataURL);
                } else {
                    resolve(null);
                }
            };
            img.onerror = () => {
                console.error("Image load error for URL:", url);
                resolve(null);
            };
            img.src = url;
        });
    };

    const handleDownloadPDF = async () => {
        setIsGenerating(true);
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const primaryColor = [0, 153, 204]; 
        
        let y = 15;
        const margin = 15;

        // Helper to add image safely
        const addImgSafely = (imgData: string | null, x: number, y: number, w: number, h: number) => {
            if (!imgData) return;
            try {
                const format = imgData.includes('png') ? 'PNG' : 'JPEG';
                doc.addImage(imgData, format, x, y, w, h, undefined, 'FAST');
            } catch (e) {
                console.error("Image failed in PDF", e);
            }
        };

        const collegeLogoBase64 = await getBase64Image(data.personalInfo.collegeLogo || "");
        const profilePicBase64 = await getBase64Image(data.personalInfo.profilePic || "");

        if (collegeLogoBase64) {
            addImgSafely(collegeLogoBase64, margin, y, 16, 16);
        }

        const profileWidth = 20;
        const profileHeight = 25;
        if (profilePicBase64) {
            addImgSafely(profilePicBase64, pageWidth - margin - profileWidth, y, profileWidth, profileHeight);
        }

        const textRight = pageWidth - margin - profileWidth - 8;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(data.personalInfo.fullName.toUpperCase(), textRight, y + 4, { align: "right" });

        doc.setFontSize(10);
        doc.setTextColor(80);
        doc.text(data.personalInfo.title, textRight, y + 10, { align: "right" });

        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(`${data.personalInfo.phone} :Ph`, textRight, y + 15, { align: "right" });
        doc.text(`${data.personalInfo.email} :Email`, textRight, y + 19, { align: "right" });
        doc.text(`${data.personalInfo.location} :Location`, textRight, y + 23, { align: "right" });
        
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(data.personalInfo.linkedin, textRight, y + 27, { align: "right" });

        y += 32;

        const renderSection = (title: string, contentY: number) => {
            if (contentY > 270) {
                doc.addPage();
                contentY = 20;
            }
            doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.rect(margin, contentY, pageWidth - (margin * 2), 7, 'F');
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(255);
            doc.text(title.toUpperCase(), margin + 3, contentY + 5);
            return contentY + 12;
        };

        y = renderSection("Brief Summary", y);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(60);
        const splitSummary = doc.splitTextToSize(data.summary, pageWidth - (margin * 2) - 4);
        doc.text(splitSummary, margin + 2, y);
        y += (splitSummary.length * 4) + 8;

        y = renderSection("Key Expertise", y);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(60);
        doc.text(data.expertise.join("   |   "), margin + 2, y);
        y += 10;

        y = renderSection("Education", y);
        data.education.forEach(edu => {
            doc.setTextColor(40);
            doc.setFont("helvetica", "bold");
            doc.text(edu.institution, margin + 2, y);
            doc.text(edu.period, pageWidth - margin - 2, y, { align: "right" });
            y += 4;
            doc.setFont("helvetica", "normal");
            doc.setTextColor(80);
            doc.text(`${edu.degree}  |  CGPA: ${edu.grade}`, margin + 2, y);
            y += 8;
        });

        y = renderSection("Internships", y);
        data.experience.forEach(exp => {
            doc.setTextColor(40);
            doc.setFont("helvetica", "bold");
            doc.text(`${exp.company} | ${exp.domain}`, margin + 2, y);
            doc.text(exp.period, pageWidth - margin - 2, y, { align: "right" });
            y += 5;
            doc.text(exp.role, margin + 2, y);
            y += 5;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.text(`Key Skills: ${exp.skills.join(", ")}`, margin + 2, y);
            y += 4;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            exp.description.forEach(bullet => {
                const splitBullet = doc.splitTextToSize("• " + bullet, pageWidth - (margin * 2) - 10);
                doc.text(splitBullet, margin + 5, y);
                y += (splitBullet.length * 4);
            });
            y += 4;
        });

        y = renderSection("Projects", y);
        data.projects.forEach(proj => {
            doc.setTextColor(40);
            doc.setFont("helvetica", "bold");
            doc.text(proj.title, margin + 2, y);
            doc.text(proj.period, pageWidth - margin - 2, y, { align: "right" });
            y += 5;
            doc.setFont("helvetica", "normal");
            doc.text(`Team Size: ${proj.teamSize}`, margin + 2, y);
            y += 5;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.text(`Key Skills: ${proj.tech.join(", ")}`, margin + 2, y);
            y += 5;
            doc.setFontSize(9);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text(`Project Link: ${proj.link}`, margin + 2, y);
            y += 5;
            doc.setTextColor(60);
            doc.setFont("helvetica", "normal");
            const splitProj = doc.splitTextToSize(proj.description[0] || "", pageWidth - (margin * 2) - 4);
            doc.text(splitProj, margin + 2, y);
            y += (splitProj.length * 4) + 6;
        });

        y = renderSection("Technical Skills", y);
        data.skills.forEach(skill => {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(40);
            doc.text(`${skill.category}: `, margin + 2, y);
            const labelWidth = doc.getTextWidth(`${skill.category}: `);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(80);
            const itemsText = skill.items.join(", ");
            const splitItems = doc.splitTextToSize(itemsText, pageWidth - margin - margin - 2 - labelWidth);
            doc.text(splitItems, margin + 2 + labelWidth, y);
            y += (splitItems.length * 5) + 1;
        });

        if (data.certificates.length > 0) {
            y = renderSection("Certificates", y);
            data.certificates.forEach(cert => {
                doc.setFont("helvetica", "bold");
                doc.setTextColor(40);
                doc.text(cert.name, margin + 2, y);
                doc.text(cert.date, pageWidth - margin - 2, y, { align: "right" });
                y += 4;
                doc.setFont("helvetica", "normal");
                doc.setTextColor(80);
                doc.text(cert.issuer, margin + 2, y);
                y += 6;
            });
        }

        doc.save(`${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
        setIsGenerating(false);
    };

    const tabs = [
        { id: "info", name: "Personal", icon: User },
        { id: "summary", name: "Summary", icon: Sparkles },
        { id: "expertise", name: "Expertise", icon: Trophy },
        { id: "exp", name: "Internships", icon: Briefcase },
        { id: "edu", name: "Education", icon: GraduationCap },
        { id: "projects", name: "Projects", icon: Code },
        { id: "skills", name: "Skills", icon: CheckCircle2 },
        { id: "certs", name: "Certificates", icon: Trophy },
    ];

    return (
        <div className="h-screen bg-white overflow-hidden flex flex-col">
            <style dangerouslySetInnerHTML={{ __html: NO_SMOOTH_SCROLL }} />
            
            <div className="h-16 flex items-center justify-between px-10 shrink-0 bg-white z-50">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-[#003366] rounded-xl flex items-center justify-center">
                        <FileText className="text-white" size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-zinc-900">Resume Builder</h1>
                        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Industry Standard AI-Ready Resumes</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleSaveResume}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white border border-zinc-200 text-zinc-600 rounded-full text-[13px] font-bold hover:bg-zinc-50 transition-all disabled:opacity-50"
                    >
                        {isSaving ? "Saving..." : <><CheckCircle2 size={16} className="text-emerald-500" /> Save Progress</>}
                    </button>
                    <button 
                        onClick={handleDownloadPDF}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-full text-[13px] font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-black/10 disabled:opacity-50"
                    >
                        {isGenerating ? "Generating..." : <><Download size={16} /> Download PDF</>}
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div className="w-[450px] flex flex-col bg-zinc-50/20">
                    <div className="p-4 grid grid-cols-3 gap-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all ${
                                    activeTab === tab.id 
                                    ? "bg-white text-[#003366] shadow-md shadow-[#003366]/5 border border-zinc-200" 
                                    : "text-zinc-400 hover:text-zinc-600 hover:bg-white/50"
                                }`}
                            >
                                <tab.icon size={18} />
                                <span className="text-[10px] font-bold uppercase tracking-tight">{tab.name}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar overscroll-contain">
                        <AnimatePresence mode="wait">
                            {activeTab === "info" && (
                                <motion.div key="info" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                                    <h2 className="text-lg font-bold text-zinc-900">Personal Information</h2>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">College Logo</label>
                                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'collegeLogo')} className="w-full text-xs" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Profile Photo</label>
                                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'profilePic')} className="w-full text-xs" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Full Name</label>
                                            <input type="text" value={data.personalInfo.fullName} onChange={e => setData({...data, personalInfo: {...data.personalInfo, fullName: e.target.value}})} className="w-full h-12 bg-white border border-zinc-200 rounded-xl px-4 text-sm outline-none focus:border-[#003366]" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Headline</label>
                                            <input type="text" value={data.personalInfo.title} onChange={e => setData({...data, personalInfo: {...data.personalInfo, title: e.target.value}})} className="w-full h-12 bg-white border border-zinc-200 rounded-xl px-4 text-sm outline-none focus:border-[#003366]" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input placeholder="Email" value={data.personalInfo.email} onChange={e => setData({...data, personalInfo: {...data.personalInfo, email: e.target.value}})} className="w-full h-12 bg-white border border-zinc-200 rounded-xl px-4 text-sm" />
                                            <input placeholder="Phone" value={data.personalInfo.phone} onChange={e => setData({...data, personalInfo: {...data.personalInfo, phone: e.target.value}})} className="w-full h-12 bg-white border border-zinc-200 rounded-xl px-4 text-sm" />
                                        </div>
                                        <input placeholder="LinkedIn URL" value={data.personalInfo.linkedin} onChange={e => setData({...data, personalInfo: {...data.personalInfo, linkedin: e.target.value}})} className="w-full h-12 bg-white border border-zinc-200 rounded-xl px-4 text-sm" />
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "summary" && (
                                <motion.div key="summary" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                                    <h2 className="text-lg font-bold text-zinc-900">Brief Summary</h2>
                                    <textarea value={data.summary} onChange={e => setData({...data, summary: e.target.value})} className="w-full h-64 bg-white border border-zinc-200 rounded-xl p-4 text-sm outline-none focus:border-[#003366] resize-none" />
                                </motion.div>
                            )}

                            {activeTab === "expertise" && (
                                <motion.div key="expertise" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                                    <h2 className="text-lg font-bold text-zinc-900">Key Expertise</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {data.expertise.map((exp, i) => (
                                            <div key={i} className="flex items-center gap-2 bg-zinc-100 px-3 py-1.5 rounded-full text-xs font-bold text-[#003366]">
                                                {exp}
                                                <button onClick={() => setData({...data, expertise: data.expertise.filter((_, idx) => idx !== i)})}><X size={12} /></button>
                                            </div>
                                        ))}
                                        <button onClick={() => {
                                            const val = prompt("Enter expertise:");
                                            if (val) setData({...data, expertise: [...data.expertise, val]});
                                        }} className="p-1.5 bg-zinc-900 text-white rounded-full"><Plus size={12} /></button>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "exp" && (
                                <motion.div key="exp" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-bold text-zinc-900">Internships</h2>
                                        <button onClick={() => setData({...data, experience: [...data.experience, { id: Date.now().toString(), role: "", company: "", domain: "", location: "", period: "", skills: [], description: [""] }]})} className="text-[#003366]"><PlusCircle size={20} /></button>
                                    </div>
                                    {data.experience.map((exp, idx) => (
                                        <div key={exp.id} className="p-4 bg-white border border-zinc-200 rounded-xl space-y-4">
                                            <input placeholder="Company" value={exp.company} onChange={e => {
                                                const news = [...data.experience];
                                                news[idx].company = e.target.value;
                                                setData({...data, experience: news});
                                            }} className="w-full text-sm font-bold outline-none" />
                                            <input placeholder="Role" value={exp.role} onChange={e => {
                                                const news = [...data.experience];
                                                news[idx].role = e.target.value;
                                                setData({...data, experience: news});
                                            }} className="w-full text-xs outline-none" />
                                            <div className="space-y-2">
                                                {exp.description.map((bul, bidx) => (
                                                    <div key={bidx} className="flex gap-2">
                                                        <textarea value={bul} onChange={e => {
                                                            const news = [...data.experience];
                                                            news[idx].description[bidx] = e.target.value;
                                                            setData({...data, experience: news});
                                                        }} className="flex-1 text-[11px] border border-zinc-100 p-2 rounded h-12" />
                                                        <button onClick={() => {
                                                            const news = [...data.experience];
                                                            news[idx].description.splice(bidx, 1);
                                                            setData({...data, experience: news});
                                                        }}><Trash2 size={12} /></button>
                                                    </div>
                                                ))}
                                                <button onClick={() => {
                                                    const news = [...data.experience];
                                                    news[idx].description.push("");
                                                    setData({...data, experience: news});
                                                }} className="text-[10px] font-bold text-[#003366]">+ ADD BULLET</button>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {activeTab === "edu" && (
                                <motion.div key="edu" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-bold text-zinc-900">Education</h2>
                                        <button onClick={() => setData({...data, education: [...data.education, { id: Date.now().toString(), institution: "", degree: "", period: "", grade: "", type: "degree" }]})} className="text-[#003366]"><PlusCircle size={20} /></button>
                                    </div>
                                    {data.education.map((edu, idx) => (
                                        <div key={edu.id} className="p-5 bg-white border border-zinc-200 rounded-2xl space-y-5 relative group shadow-sm hover:shadow-md transition-all">
                                            <button 
                                                onClick={() => setData({...data, education: data.education.filter(e => e.id !== edu.id)})}
                                                className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            
                                            <div className="space-y-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Institution / University</label>
                                                    <input 
                                                        placeholder="e.g. CMR Institute of Technology" 
                                                        value={edu.institution} 
                                                        onChange={e => {
                                                            const news = [...data.education];
                                                            news[idx].institution = e.target.value;
                                                            setData({...data, education: news});
                                                        }} 
                                                        className="w-full h-11 bg-zinc-50/50 border border-zinc-100 rounded-xl px-4 text-sm font-bold text-zinc-900 outline-none focus:border-[#003366] transition-all" 
                                                    />
                                                </div>

                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Degree / Course</label>
                                                    <input 
                                                        placeholder="e.g. B.Tech in Computer Science" 
                                                        value={edu.degree} 
                                                        onChange={e => {
                                                            const news = [...data.education];
                                                            news[idx].degree = e.target.value;
                                                            setData({...data, education: news});
                                                        }} 
                                                        className="w-full h-11 bg-zinc-50/50 border border-zinc-100 rounded-xl px-4 text-xs font-medium text-zinc-700 outline-none focus:border-[#003366] transition-all" 
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Period (Years)</label>
                                                        <input 
                                                            placeholder="e.g. 2022 - 2026" 
                                                            value={edu.period} 
                                                            onChange={e => {
                                                                const news = [...data.education];
                                                                news[idx].period = e.target.value;
                                                                setData({...data, education: news});
                                                            }} 
                                                            className="w-full h-11 bg-zinc-50/50 border border-zinc-100 rounded-xl px-4 text-xs font-medium text-zinc-700 outline-none focus:border-[#003366] transition-all" 
                                                        />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">CGPA / Grade</label>
                                                        <input 
                                                            placeholder="e.g. 8.5 / 10" 
                                                            value={edu.grade} 
                                                            onChange={e => {
                                                                const news = [...data.education];
                                                                news[idx].grade = e.target.value;
                                                                setData({...data, education: news});
                                                            }} 
                                                            className="w-full h-11 bg-zinc-50/50 border border-zinc-100 rounded-xl px-4 text-xs font-bold text-zinc-900 outline-none focus:border-[#003366] transition-all" 
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {activeTab === "projects" && (
                                <motion.div key="projects" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-bold text-zinc-900">Projects</h2>
                                        <button onClick={() => setData({...data, projects: [...data.projects, { id: Date.now().toString(), title: "", period: "", teamSize: "1", tech: [], description: [""], link: "" }]})} className="text-[#003366]"><PlusCircle size={20} /></button>
                                    </div>
                                    {data.projects.map((proj, idx) => (
                                        <div key={proj.id} className="p-5 bg-white border border-zinc-200 rounded-2xl space-y-4 relative group shadow-sm hover:shadow-md transition-all">
                                            <button 
                                                onClick={() => setData({...data, projects: data.projects.filter(p => p.id !== proj.id)})}
                                                className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>

                                            <div className="space-y-3">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Project Title</label>
                                                    <input 
                                                        placeholder="e.g. AI-Powered Analytics Dashboard" 
                                                        value={proj.title} 
                                                        onChange={e => {
                                                            const news = [...data.projects];
                                                            news[idx].title = e.target.value;
                                                            setData({...data, projects: news});
                                                        }} 
                                                        className="w-full h-11 bg-zinc-50/50 border border-zinc-100 rounded-xl px-4 text-sm font-bold text-zinc-900 outline-none focus:border-[#003366]" 
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Period</label>
                                                        <input 
                                                            placeholder="e.g. Nov 2023 - Jan 2024" 
                                                            value={proj.period} 
                                                            onChange={e => {
                                                                const news = [...data.projects];
                                                                news[idx].period = e.target.value;
                                                                setData({...data, projects: news});
                                                            }} 
                                                            className="w-full h-10 bg-zinc-50/50 border border-zinc-100 rounded-xl px-4 text-xs" 
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Team Size</label>
                                                        <input 
                                                            placeholder="e.g. 4 Members" 
                                                            value={proj.teamSize} 
                                                            onChange={e => {
                                                                const news = [...data.projects];
                                                                news[idx].teamSize = e.target.value;
                                                                setData({...data, projects: news});
                                                            }} 
                                                            className="w-full h-10 bg-zinc-50/50 border border-zinc-100 rounded-xl px-4 text-xs" 
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Tech Stack / Key Skills</label>
                                                    <input 
                                                        placeholder="e.g. Next.js, TypeScript, Tailwind" 
                                                        value={proj.tech.join(", ")} 
                                                        onChange={e => {
                                                            const news = [...data.projects];
                                                            news[idx].tech = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                                                            setData({...data, projects: news});
                                                        }} 
                                                        className="w-full h-10 bg-zinc-50/50 border border-zinc-100 rounded-xl px-4 text-xs" 
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Project Link</label>
                                                    <input 
                                                        placeholder="https://github.com/..." 
                                                        value={proj.link} 
                                                        onChange={e => {
                                                            const news = [...data.projects];
                                                            news[idx].link = e.target.value;
                                                            setData({...data, projects: news});
                                                        }} 
                                                        className="w-full h-10 bg-zinc-50/50 border border-zinc-100 rounded-xl px-4 text-xs text-[#0099CC] font-medium" 
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Description</label>
                                                    <textarea 
                                                        placeholder="Describe your role and key contributions..." 
                                                        value={proj.description[0]} 
                                                        onChange={e => {
                                                            const news = [...data.projects];
                                                            news[idx].description = [e.target.value];
                                                            setData({...data, projects: news});
                                                        }} 
                                                        className="w-full h-24 bg-zinc-50/50 border border-zinc-100 rounded-xl p-4 text-xs outline-none focus:border-[#003366] resize-none" 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {activeTab === "skills" && (
                                <motion.div key="skills" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                                    <h2 className="text-lg font-bold text-zinc-900">Technical Skills</h2>
                                    {data.skills.map((skill, idx) => (
                                        <div key={skill.category} className="space-y-2">
                                            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">{skill.category}</label>
                                            <input value={skill.items.join(", ")} onChange={e => {
                                                const news = [...data.skills];
                                                news[idx].items = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                                                setData({...data, skills: news});
                                            }} className="w-full h-10 bg-white border border-zinc-200 rounded-lg px-3 text-xs" />
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {activeTab === "certs" && (
                                <motion.div key="certs" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-bold text-zinc-900">Certificates</h2>
                                        <button onClick={() => setData({...data, certificates: [...data.certificates, { id: Date.now().toString(), name: "", issuer: "", date: "" }]})} className="text-[#003366]"><PlusCircle size={20} /></button>
                                    </div>
                                    {data.certificates.map((cert, idx) => (
                                        <div key={cert.id} className="p-4 bg-white border border-zinc-200 rounded-xl space-y-3 relative group">
                                            <button onClick={() => setData({...data, certificates: data.certificates.filter(c => c.id !== cert.id)})} className="absolute top-2 right-2 text-zinc-300 hover:text-red-500"><X size={14} /></button>
                                            <input placeholder="Certificate Name" value={cert.name} onChange={e => {
                                                const news = [...data.certificates];
                                                news[idx].name = e.target.value;
                                                setData({...data, certificates: news});
                                            }} className="w-full text-sm font-bold outline-none" />
                                            <div className="grid grid-cols-2 gap-2">
                                                <input placeholder="Issuer" value={cert.issuer} onChange={e => {
                                                    const news = [...data.certificates];
                                                    news[idx].issuer = e.target.value;
                                                    setData({...data, certificates: news});
                                                }} className="w-full text-xs" />
                                                <input placeholder="Date" value={cert.date} onChange={e => {
                                                    const news = [...data.certificates];
                                                    news[idx].date = e.target.value;
                                                    setData({...data, certificates: news});
                                                }} className="w-full text-xs" />
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex-1 bg-[#F8F9FA] p-12 overflow-y-auto flex flex-col items-center custom-scrollbar overscroll-contain">
                    <div 
                        className="w-[210mm] min-h-[297mm] bg-white shadow-[0_0_50px_-12px_rgba(0,0,0,0.15)] p-[15mm] flex flex-col gap-6 transition-all border border-zinc-200"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                        <div className="flex items-start justify-between gap-6">
                            <div className="w-20 h-20 shrink-0 flex items-center justify-center p-0">
                                {data.personalInfo.collegeLogo ? (
                                    <img src={data.personalInfo.collegeLogo} alt="Logo" className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <div className="text-[10px] text-zinc-300 font-bold text-center">College Logo</div>
                                )}
                            </div>

                            <div className="flex-1 text-right space-y-0.5">
                                <h1 className="text-2xl font-black text-[#0099CC] tracking-tight">
                                    {data.personalInfo.fullName || "NAME"}
                                </h1>
                                <p className="text-[12px] font-bold text-zinc-700">{data.personalInfo.title}</p>
                                <div className="space-y-0.5 pt-1">
                                    <p className="text-[11px] text-zinc-600">
                                        {data.personalInfo.phone} <span className="font-bold text-[#0099CC]">:Ph</span>
                                    </p>
                                    <p className="text-[11px] text-zinc-600">
                                        {data.personalInfo.email} <span className="font-bold text-[#0099CC]">:Email</span>
                                    </p>
                                    <p className="text-[11px] text-zinc-600">
                                        {data.personalInfo.location} <span className="font-bold text-[#0099CC]">:Location</span>
                                    </p>
                                    <p className="text-[11px] font-bold text-[#0099CC] hover:underline cursor-pointer">{data.personalInfo.linkedin}</p>
                                </div>
                            </div>

                            <div className="w-24 h-32 shrink-0 bg-zinc-100 border border-zinc-200 overflow-hidden">
                                {data.personalInfo.profilePic ? (
                                    <img src={data.personalInfo.profilePic} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-300"><User size={40} /></div>
                                )}
                            </div>
                        </div>

                        <section className="space-y-0">
                            <h2 className="bg-[#0099CC] text-white px-3 py-1.5 text-[12px] font-bold tracking-wider uppercase">Brief Summary</h2>
                            <div className="pt-3 px-1 space-y-4">
                                {data.summary.split('\n\n').map((para, i) => (
                                    <p key={i} className="text-[12px] text-zinc-700 leading-relaxed font-medium">{para}</p>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-0">
                            <h2 className="bg-[#0099CC] text-white px-3 py-1.5 text-[12px] font-bold tracking-wider uppercase">Key Expertise</h2>
                            <div className="pt-3 px-1 flex flex-wrap gap-2">
                                {data.expertise.map((exp, i) => (
                                    <span key={i} className="bg-zinc-50 border border-zinc-200 px-3 py-1 rounded-md text-[11px] font-bold text-zinc-600">{exp}</span>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-0">
                            <h2 className="bg-[#0099CC] text-white px-3 py-1.5 text-[12px] font-bold tracking-wider uppercase">Education</h2>
                            <div className="pt-3 px-1 space-y-3">
                                {data.education.map(edu => (
                                    <div key={edu.id} className="border border-zinc-200 p-2 relative">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-[12px] font-bold text-zinc-800">{edu.institution}</h3>
                                            <span className="text-[11px] font-bold text-zinc-600">{edu.period}</span>
                                        </div>
                                        <div className="flex gap-4 mt-1">
                                            <p className="text-[11px] font-medium text-zinc-600">{edu.degree}</p>
                                            <p className="text-[11px] font-bold text-zinc-600">| CGPA: {edu.grade}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-0">
                            <h2 className="bg-[#0099CC] text-white px-3 py-1.5 text-[12px] font-bold tracking-wider uppercase">Internships</h2>
                            <div className="pt-3 px-1 space-y-4">
                                {data.experience.map(exp => (
                                    <div key={exp.id} className="border border-zinc-200 p-3 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-[12px] font-bold text-zinc-800">{exp.company} | <span className="font-medium text-zinc-500">{exp.domain}</span></h3>
                                                <p className="text-[11px] font-bold text-zinc-600 mt-0.5">{exp.role}</p>
                                            </div>
                                            <span className="text-[11px] font-bold text-zinc-600">{exp.period}</span>
                                        </div>
                                        <ul className="space-y-1.5 pt-1">
                                            {exp.description.map((bullet, i) => (
                                                <li key={i} className="text-[11px] text-zinc-700 leading-relaxed pl-1">• {bullet}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-0">
                            <h2 className="bg-[#0099CC] text-white px-3 py-1.5 text-[12px] font-bold tracking-wider uppercase">Projects</h2>
                            <div className="pt-3 px-1 space-y-4">
                                {data.projects.map(proj => (
                                    <div key={proj.id} className="border border-zinc-200 p-3 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-[12px] font-bold text-zinc-800">{proj.title}</h3>
                                            <span className="text-[11px] font-bold text-zinc-600">{proj.period}</span>
                                        </div>
                                        <p className="text-[11px] text-zinc-700 leading-relaxed font-medium">{proj.description[0]}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                        <section className="space-y-0">
                            <h2 className="bg-[#0099CC] text-white px-3 py-1.5 text-[12px] font-bold tracking-wider uppercase">Technical Skills</h2>
                            <div className="pt-3 px-1 space-y-2">
                                {data.skills.map((skill, i) => (
                                    <div key={i} className="flex gap-2 text-[11px]">
                                        <span className="font-bold text-zinc-800 shrink-0">{skill.category}:</span>
                                        <span className="text-zinc-600">{skill.items.join(", ")}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {data.certificates.length > 0 && (
                            <section className="space-y-0">
                                <h2 className="bg-[#0099CC] text-white px-3 py-1.5 text-[12px] font-bold tracking-wider uppercase">Certificates</h2>
                                <div className="pt-3 px-1 space-y-3">
                                    {data.certificates.map(cert => (
                                        <div key={cert.id} className="flex justify-between items-start border-b border-zinc-50 pb-2">
                                            <div>
                                                <h3 className="text-[11px] font-bold text-zinc-800">{cert.name}</h3>
                                                <p className="text-[10px] text-zinc-500">{cert.issuer}</p>
                                            </div>
                                            <span className="text-[10px] font-bold text-zinc-400">{cert.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                        <div className="mt-auto pt-10 border-t border-zinc-100 flex items-center justify-between opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                            <div className="flex items-center gap-2">
                                <img src="https://ik.imagekit.io/dypkhqxip/platform" alt="Forge" className="h-4" />
                                <span className="text-[10px] font-bold text-[#003366] uppercase tracking-widest">Verified Intern Scholar</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Generated via Student Forge Portal</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E4E4E7;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #D4D4D8;
                }
            `}</style>
        </div>
    );
}
