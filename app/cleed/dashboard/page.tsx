"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Send, 
  History, 
  Plus, 
  LayoutDashboard, 
  ChevronRight, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Mail,
  Briefcase,
  Github,
  Globe,
  Paperclip,
  Hand,
  Bell,
  FileText,
  FileBadge,
  ShieldCheck,
  CalendarCheck,
  Calendar,
  ExternalLink,
  Menu,
  Download,
  X as CloseIcon
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PWAInstallButton } from "@/app/components/PWAInstallButton";

interface Intern {
  id: string;
  name: string;
  email: string;
  isApproved: boolean;
  handRaised: boolean;
  letterUrl?: string;
  lastActive?: string;
  branch?: string;
  college?: string;
  githubLink?: string;
}

interface WorkshopEntry {
  id: string;
  name: string;
  branch: string;
  year: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  attachmentUrl?: string;
  user: { name: string; email: string };
  status: string;
  createdAt: string;
}

interface MentorshipSession {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  topic: string;
  status: string;
  createdAt: string;
}

export default function CleedDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [interns, setInterns] = useState<Intern[]>([]);
  const [workshopEntries, setWorkshopEntries] = useState<WorkshopEntry[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mentorshipSessions, setMentorshipSessions] = useState<MentorshipSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Selection
  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
  const [isAuthorizing, setIsAuthorizing] = useState<string | null>(null);
  
  // Attendance Protocol States
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentAttendance, setCurrentAttendance] = useState<any[]>([]);
  const [markingId, setMarkingId] = useState<string | null>(null);
  
  // Forms
  const [taskData, setTaskData] = useState({ title: "", description: "", attachmentUrl: "", batch: "Batch 2" });
  const [letterUrl, setLetterUrl] = useState("");
  const [sendingTask, setSendingTask] = useState(false);
  const [sendingLetter, setSendingLetter] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [letterSuccess, setLetterSuccess] = useState(false);
  const [scheduleData, setScheduleData] = useState({ 
    week: "", 
    typeOfWork: "", 
    toolsUsed: "", 
    deploymentTools: "", 
    requirements: "", 
    description: "", 
    outcomes: "", 
    deadline: "",
    batch: "Batch 2" 
  });
  const [sendingSchedule, setSendingSchedule] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Mobile Menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === "submissions") {
      fetchSubmissions();
    }
  }, [activeTab]);

  const fetchSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const res = await fetch("/api/cleed/submissions");
      const data = await res.json();
      if (data.success) {
        setSubmissions(data.submissions);
      }
    } catch (err) {
      console.error("Submissions fetch failure");
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const fetchWorkshopEntries = async () => {
    try {
      const res = await fetch("/api/forms/workshop");
      const data = await res.json();
      if (data.success) {
        setWorkshopEntries(data.data);
      }
    } catch (err) {
      console.error("Workshop fetch failure");
    }
  };

  const downloadWorkshopCsv = () => {
    if (workshopEntries.length === 0) return;
    
    const headers = ["ID", "Name", "Branch", "Year", "Email", "Phone", "Status", "Created At"];
    const rows = workshopEntries.map(i => [
      i.id,
      i.name,
      i.branch,
      i.year,
      i.email,
      i.phone,
      i.status,
      new Date(i.createdAt).toLocaleString()
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `workshop_entries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const fetchAttendance = async () => {
    try {
      const res = await fetch(`/api/cleed/attendance?date=${selectedDate}`);
      const data = await res.json();
      setCurrentAttendance(data);
    } catch (err) {
      console.error("Attendance synchronization failure");
    }
  };

  const fetchData = async () => {
    try {
      const [internsRes, tasksRes, mentorshipRes, workshopRes] = await Promise.all([
        fetch("/api/cleed/interns"),
        fetch("/api/cleed/tasks"),
        fetch("/api/mentorship"),
        fetch("/api/forms/workshop")
      ]);
      const internsData = await internsRes.json();
      const tasksData = await tasksRes.json();
      const mentorshipData = await mentorshipRes.json();
      const workshopData = await workshopRes.json();
      
      setInterns(internsData);
      setTasks(tasksData);
      setMentorshipSessions(mentorshipData);
      if (workshopData.success) setWorkshopEntries(workshopData.data);
    } catch (err) {
      console.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const onlineInternsCount = interns.filter(intern => {
    if (!intern.lastActive) return false;
    const lastActive = new Date(intern.lastActive).getTime();
    const now = new Date().getTime();
    return (now - lastActive) < (5 * 60 * 1000); // 5 minutes
  }).length;

  const handlePostTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIntern) return;
    setSendingTask(true);
    
    try {
      const res = await fetch("/api/cleed/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
           internId: selectedIntern.id, 
           batch: taskData.batch,
           title: taskData.title, 
           description: taskData.description,
           attachmentUrl: taskData.attachmentUrl
        }),
      });

      if (res.ok) {
        setFormSuccess(true);
        setTaskData({ title: "", description: "", attachmentUrl: "", batch: "Batch 2" });
        setTimeout(() => setFormSuccess(false), 3000);
        fetchData();
      }
    } catch (err) {
      console.error("Task allocation failed");
    } finally {
      setSendingTask(false);
    }
  };

  const handleSendLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIntern || !letterUrl) return;
    setSendingLetter(true);
    try {
      const res = await fetch("/api/cleed/letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internId: selectedIntern.id, letterUrl }),
      });

      if (res.ok) {
        setLetterSuccess(true);
        setLetterUrl("");
        setTimeout(() => setLetterSuccess(false), 3000);
        fetchData();
      }
    } catch (err) {
      console.error("Letter transmission failed");
    } finally {
      setSendingLetter(false);
    }
  };

  const handleApprove = async (internId: string) => {
    setIsAuthorizing(internId);
    try {
      const res = await fetch("/api/cleed/interns/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internId })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error("Authorization protocol failure");
    } finally {
      setIsAuthorizing(null);
    }
  };

  const handleMarkAttendance = async (internId: string, status: string, workSummary: string) => {
    setMarkingId(internId);
    try {
      const res = await fetch("/api/cleed/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internId, status, workSummary, date: selectedDate })
      });
      if (res.ok) {
        fetchAttendance();
      }
    } catch (err) {
      console.error("Attendance synchronization failed");
    } finally {
      setMarkingId(null);
    }
  };

  const handleMarkAllAttendance = async (status: string) => {
    const approvedInterns = interns.filter(i => i.isApproved);
    if (approvedInterns.length === 0) return;
    
    setMarkingId("all");
    try {
      await Promise.all(
        approvedInterns.map(intern => {
          const record = currentAttendance.find(a => a.userId === intern.id);
          return fetch("/api/cleed/attendance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              internId: intern.id, 
              status, 
              workSummary: record?.workSummary || "", 
              date: selectedDate 
            })
          });
        })
      );
      await fetchAttendance();
    } catch (err) {
      console.error("Batch protocol failure");
    } finally {
      setMarkingId(null);
    }
  };

  const handlePostSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingSchedule(true);
    try {
      const res = await fetch("/api/intern/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...scheduleData,
          toolsUsed: scheduleData.toolsUsed.split(",").map(s => s.trim()).filter(s => s !== ""),
          deploymentTools: scheduleData.deploymentTools.split(",").map(s => s.trim()).filter(s => s !== ""),
          requirements: scheduleData.requirements.split("\n").map(s => s.trim()).filter(s => s !== ""),
          outcomes: scheduleData.outcomes.split("\n").map(s => s.trim()).filter(s => s !== "")
        }),
      });
      if (res.ok) {
        setScheduleSuccess(true);
        setScheduleData({ 
          week: "", 
          typeOfWork: "", 
          toolsUsed: "", 
          deploymentTools: "", 
          requirements: "", 
          description: "", 
          outcomes: "", 
          deadline: "",
          batch: "Batch 2" 
        });
        setTimeout(() => setScheduleSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Schedule dispatch failed");
    } finally {
      setSendingSchedule(false);
    }
  };

  const raisedHandsCount = interns.filter(i => i.handRaised).length;

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans text-zinc-900 pb-20 md:pb-0">
       {/* Mobile Nav Top Bar */}
       <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-black z-[60] flex items-center justify-between px-6 pt-[env(safe-area-inset-top)] box-content shadow-xl group">
          <div className="flex items-center gap-3">
             <div className="h-4 w-4 bg-[#0055FF]" />
             <span className="text-white font-bold text-sm tracking-tight pt-[1px]">Cleed Hub</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-2"
          >
             {isMobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
          </button>
       </div>

       {/* Mobile Menu Overlay */}
       <AnimatePresence>
          {isMobileMenuOpen && (
             <motion.div 
               initial={{ opacity: 0, x: -100 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -100 }}
               className="md:hidden fixed inset-0 bg-black z-[55] pt-24 px-6 overflow-y-auto pb-20"
             >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { id: "overview", icon: LayoutDashboard, label: "Overview" },
                    { id: "interns", icon: Users, label: "Intern Registry" },
                    { id: "assign", icon: Send, label: "Dispatch Task" },
                    { id: "certification", icon: FileBadge, label: "Issuance Hub" },
                    { id: "authorizations", icon: ShieldCheck, label: "Authorizations" },
                    { id: "mentorship", icon: Users, label: "Mentorship Sessions" },
                    { id: "schedule", icon: Calendar, label: "Schedule Dispatch" },
                    { id: "workshop", icon: FileText, label: "Workshop Registry" },
                    { id: "submissions", icon: ExternalLink, label: "Intern Submissions" },
                    { id: "attendance", icon: CalendarCheck, label: "Attendance Protocol" },
                    { id: "history", icon: History, label: "Logbook" }
                  ].map((item) => (
                    <button 
                       key={item.id}
                       onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                       className={`h-24 border border-white/10 flex flex-col items-center justify-center gap-3 transition-all ${
                          activeTab === item.id 
                          ? "bg-[#0055FF] text-white font-bold shadow-lg shadow-[#0055FF]/20" 
                          : "bg-white/5 text-zinc-500"
                       }`}
                    >
                       <item.icon size={20} />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-center">{item.label}</span>
                    </button>
                  ))}
                </div>
             </motion.div>
          )}
       </AnimatePresence>

       {/* Desktop Sidebar (hidden on mobile) */}
       <aside className="hidden md:flex fixed left-0 top-0 h-full w-20 lg:w-64 bg-black border-r border-zinc-900 z-50 flex-col pt-[env(safe-area-inset-top)]">
          <div className="p-8 flex items-center gap-3">
             <div className="h-4 w-4 bg-[#0055FF]" />
             <span className="hidden lg:block text-white font-bold text-[16px] tracking-tight">Cleed Hub</span>
          </div>

          <nav className="flex-1 mt-10 space-y-2 px-4 overflow-y-auto">
             {[
               { id: "overview", icon: LayoutDashboard, label: "Overview" },
               { id: "interns", icon: Users, label: "Intern Registry" },
               { id: "assign", icon: Send, label: "Dispatch Task" },
               { id: "certification", icon: FileBadge, label: "Issuance Hub" },
               { id: "authorizations", icon: ShieldCheck, label: "Authorizations" },
               { id: "mentorship", icon: Users, label: "Mentorship Sessions" },
               { id: "schedule", icon: Calendar, label: "Schedule Dispatch" },
               { id: "workshop", icon: FileText, label: "Workshop Registry" },
               { id: "submissions", icon: ExternalLink, label: "Intern Submissions" },
               { id: "attendance", icon: CalendarCheck, label: "Attendance Protocol" },
               { id: "history", icon: History, label: "Logbook" }
             ].map((item) => (
                <button 
                   key={item.id}
                   onClick={() => setActiveTab(item.id)}
                   className={`w-full h-12 flex items-center px-4 gap-4 transition-all ${
                      activeTab === item.id 
                      ? "bg-[#0055FF] text-white font-bold shadow-lg" 
                      : "text-zinc-500 hover:text-white"
                   }`}
                >
                   <item.icon size={18} />
                   <span className="hidden lg:block text-[14px] font-medium">{item.label}</span>
                </button>
             ))}
          </nav>
          
          {raisedHandsCount > 0 && (
             <div className="p-4 mx-4 mb-4 bg-amber-500/10 border border-amber-500/20 rounded-none animate-pulse lg:block hidden">
                <div className="flex items-center gap-2 text-amber-500">
                   <Hand size={16} />
                    <span className="text-[12px] font-semibold leading-none">
                       {raisedHandsCount} Signals Active
                    </span>
                </div>
             </div>
          )}

          <div className="p-8 border-t border-zinc-900">
             <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-zinc-800" />
                <div className="hidden lg:block text-left overflow-hidden">
                   <p className="text-[13px] text-white font-bold truncate">Admin Cleed</p>
                   <p className="text-[10px] text-zinc-500 truncate">Executive Manager</p>
                </div>
             </div>
          </div>
       </aside>

       {/* Main Content */}
       <main className="md:pl-20 lg:pl-64 min-h-screen pt-[calc(4rem+env(safe-area-inset-top))] md:pt-0">
          <header className="h-20 bg-white border-b border-zinc-100 flex items-center justify-between px-6 md:px-8 sticky top-[calc(4rem+env(safe-area-inset-top))] md:top-0 z-40 backdrop-blur-md bg-white/80">
             <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-zinc-400 text-xs md:text-sm whitespace-nowrap">Dashboard</span>
                <ChevronRight size={14} className="text-zinc-300 flex-shrink-0" />
                <span className="text-zinc-900 font-bold text-xs md:text-sm truncate uppercase tracking-tighter">
                   {activeTab === "interns" ? "Interns" : activeTab === "assign" ? "Allocations" : activeTab === "certification" ? "Certifications" : activeTab === "authorizations" ? "Authorizations" : activeTab === "mentorship" ? "Mentorship" : activeTab === "schedule" ? "Schedule" : activeTab === "workshop" ? "Workshop Registry" : activeTab === "submissions" ? "Submissions" : activeTab === "attendance" ? "Attendance" : "Logbook"}
                </span>
             </div>
             
             <div className="flex items-center gap-6">
                <div className="relative group hidden md:block">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                   <input className="h-9 w-64 bg-zinc-50 border border-zinc-100 pl-9 pr-4 text-[12px] outline-none focus:border-[#0055FF] transition-all" placeholder="Audit registry..." />
                </div>
                <div className="h-5 w-[1px] bg-zinc-200" />
                <button className="h-9 w-9 bg-[#0055FF] text-white flex items-center justify-center hover:shadow-xl hover:shadow-[#0055FF]/20 transition-all shadow-none rounded-none">
                   <Plus size={16} />
                </button>
             </div>
          </header>

          <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-8 pb-[env(safe-area-inset-bottom,20px)]">
             
             {raisedHandsCount > 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-amber-500 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-amber-500/20 rounded-none"
                >
                   <div className="flex items-center gap-4 text-black text-left w-full">
                      <div className="h-12 w-12 bg-black text-amber-500 flex items-center justify-center shrink-0">
                         <Hand size={24} className="animate-bounce" />
                      </div>
                      <div>
                         <h3 className="text-lg font-bold tracking-tight leading-none">Signals Active</h3>
                         <p className="text-[11px] font-bold opacity-70 mt-1">
                            {raisedHandsCount} Registered Interns require protocol intervention
                         </p>
                      </div>
                   </div>
                   <div className="flex -space-x-4">
                      {interns.filter(i => i.handRaised).slice(0, 5).map(i => (
                         <div key={i.id} className="h-10 w-10 bg-black border-2 border-amber-500 flex items-center justify-center text-amber-500 text-[10px] font-bold" title={i.name}>
                            {i.name[0]}
                         </div>
                      ))}
                      {raisedHandsCount > 5 && (
                         <div className="h-10 w-10 bg-black border-2 border-amber-500 flex items-center justify-center text-amber-500 text-[10px] font-bold">
                            +{raisedHandsCount - 5}
                         </div>
                      )}
                   </div>
                   <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                      <button 
                        onClick={() => setActiveTab("interns")}
                        className="h-12 px-8 bg-black text-white text-[11px] font-bold hover:bg-zinc-900 transition-all rounded-none w-full"
                      >
                         Inspect Registry
                      </button>
                      
                      <button 
                         onClick={async () => {
                            if(confirm("Protocol Confirmation: Dismiss all signal states?")) {
                               try {
                                  const res = await fetch("/api/cleed/interns/lower-all", { method: "POST" });
                                  if(res.ok) fetchData();
                               } catch(e) {}
                            }
                         }}
                         className="h-12 px-8 bg-white border border-black/10 text-black text-[11px] font-bold hover:bg-black hover:text-white transition-all rounded-none w-full"
                       >
                          Dismiss Signals
                       </button>
                   </div>
                </motion.div>
             )}

             {/* Overview Tab */}
             {activeTab === "overview" && (
                <div className="space-y-12">
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-white border border-zinc-100 p-8 shadow-sm group hover:border-[#0055FF] transition-all">
                         <div className="flex items-center justify-between mb-4">
                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Total Registered</p>
                            <Users size={16} className="text-zinc-300 group-hover:text-[#0055FF] transition-all" />
                         </div>
                         <div className="flex items-baseline gap-2">
                           <h3 className="text-4xl font-bold tracking-tight">{interns.length}</h3>
                           <span className="text-xs text-zinc-400 font-medium pb-1.5 flex items-center gap-1 text-left">
                              Authorized Identities
                           </span>
                         </div>
                      </div>

                      <div className="bg-white border border-zinc-100 p-8 shadow-sm group hover:border-[#0055FF] transition-all">
                         <div className="flex items-center justify-between mb-4">
                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Live Presence</p>
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                         </div>
                         <div className="flex items-baseline gap-2">
                           <h3 className="text-4xl font-bold tracking-tight text-emerald-600">{onlineInternsCount}</h3>
                           <span className="text-xs text-zinc-400 font-medium pb-1.5 flex items-center gap-1 text-left">
                              Active Protocol
                           </span>
                         </div>
                      </div>

                      <div className="bg-white border border-zinc-100 p-8 shadow-sm group hover:border-[#0055FF] transition-all">
                         <div className="flex items-center justify-between mb-4">
                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Signals Pending</p>
                            <Hand size={16} className="text-amber-500" />
                         </div>
                         <div className="flex items-baseline gap-2">
                           <h3 className="text-4xl font-bold tracking-tight">{raisedHandsCount}</h3>
                           <span className="text-xs text-zinc-400 font-medium pb-1.5 flex items-center gap-1 text-left">
                              Awaiting Contact
                           </span>
                         </div>
                      </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                         <h2 className="text-xl font-bold border-l-4 border-[#0055FF] pl-4 uppercase tracking-tighter text-left">Quick Actions</h2>
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <button onClick={() => setActiveTab("interns")} className="h-24 border border-zinc-100 hover:border-[#0055FF] p-6 text-left transition-all bg-white group shadow-sm">
                               <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Manage</p>
                               <span className="text-sm font-bold group-hover:text-[#0055FF]">Intern Registry</span>
                            </button>
                            <button onClick={() => setActiveTab("schedule")} className="h-24 border border-zinc-100 hover:border-[#0055FF] p-6 text-left transition-all bg-white group shadow-sm">
                               <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Dispatch</p>
                               <span className="text-sm font-bold group-hover:text-[#0055FF]">Schedule Hub</span>
                             </button>
                             <button onClick={() => setActiveTab("workshop")} className="h-24 border border-zinc-100 hover:border-red-500 p-6 text-left transition-all bg-white group shadow-sm">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Audit</p>
                                <span className="text-sm font-bold group-hover:text-red-500">Workshop Registry</span>
                            </button>
                         </div>
                      </div>
                      <div className="space-y-6">
                         <h2 className="text-xl font-bold border-l-4 border-[#0055FF] pl-4 uppercase tracking-tighter text-left">System Pulse</h2>
                         <div className="p-6 bg-black text-emerald-500 font-mono text-[10px] space-y-2 uppercase tracking-widest border border-zinc-900 text-left">
                             <div className="flex items-center gap-2"><div className="h-1 w-1 bg-emerald-500 rounded-full" /> &gt; CLEED_PROTOCOL: ACTIVE</div>
                             <div className="flex items-center gap-2"><div className="h-1 w-1 bg-emerald-500 rounded-full" /> &gt; DATABASE_SYNC: STABLE</div>
                             <div className="flex items-center gap-2"><div className="h-1 w-1 bg-emerald-500 rounded-full" /> &gt; PRESENCE_TRACKING: LIVE</div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

             {/* Interns Tab */}
             {activeTab === "interns" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                   <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                         <h2 className="text-2xl font-bold tracking-tight">Intern Registry</h2>
                         {raisedHandsCount > 0 && (
                            <span className="px-3 py-1 bg-amber-100 text-amber-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border border-amber-200">
                               <Hand size={12} className="animate-bounce" /> {raisedHandsCount}
                            </span>
                         )}
                      </div>
                      <span className="px-4 py-1.5 bg-white border border-zinc-100 text-[11px] font-bold text-[#0055FF] flex items-center gap-2">
                         <div className="h-1.5 w-1.5 bg-[#0055FF] rounded-full animate-pulse" />
                         {interns.length} Entities
                      </span>
                   </div>

                    <div className="bg-white border border-zinc-100 overflow-x-auto shadow-sm shadow-black/5 rounded-none">
                       <div className="min-w-[950px]">
                          <table className="w-full text-left">
                             <thead>
                                <tr className="bg-zinc-50 border-b border-zinc-100">
                                   <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Personnel Node</th>
                                   <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Academic Affiliation</th>
                                   <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Connectivity Logic</th>
                                   <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Protocol Status</th>
                                   <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-zinc-50">
                                {interns.filter(i => i.isApproved).map((intern) => (
                                   <tr key={intern.id} className={`hover:bg-zinc-50/50 transition-colors ${intern.handRaised ? "bg-amber-500/5" : ""}`}>
                                      <td className="px-6 py-4">
                                         <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 flex items-center justify-center text-[11px] font-bold border ${
                                               intern.handRaised ? "bg-amber-100 border-amber-200 text-amber-600" : "bg-black text-white border-black"
                                            }`}>
                                               {intern.name[0]}
                                            </div>
                                            <div>
                                               <div className="flex items-center gap-2 text-left">
                                                  <p className="text-[14px] font-bold leading-none">{intern.name}</p>
                                                  {intern.handRaised && <Hand size={12} className="text-amber-500" />}
                                               </div>
                                               <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1 text-left">{intern.branch || "Trainee"}</p>
                                            </div>
                                         </div>
                                      </td>
                                      <td className="px-6 py-4 text-[13px] text-zinc-600 font-medium">
                                         {intern.college || "Global Forge"}
                                      </td>
                                      <td className="px-6 py-4 text-[13px] text-zinc-500">
                                         {intern.email}
                                      </td>
                                      <td className="px-6 py-4">
                                         <div className="flex items-center gap-2">
                                            {intern.letterUrl ? (
                                               <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase border border-emerald-100">Certified</span>
                                            ) : (
                                               <span className="px-2 py-0.5 bg-zinc-50 text-zinc-400 text-[9px] font-bold uppercase border border-zinc-100">In-Progress</span>
                                            )}
                                         </div>
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                         <div className="flex justify-end gap-2">
                                            <button onClick={() => { setSelectedIntern(intern); setActiveTab("assign"); }} className="h-8 w-8 bg-zinc-50 text-zinc-400 hover:bg-[#0055FF] hover:text-white flex items-center justify-center transition-all border border-zinc-100">
                                               <Send size={14} />
                                            </button>
                                            <button onClick={() => { setSelectedIntern(intern); setActiveTab("certification"); }} className="h-8 w-8 bg-zinc-50 text-zinc-400 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all border border-zinc-100">
                                               <FileBadge size={14} />
                                            </button>
                                            <Link href={intern.githubLink || "#"} target="_blank" className="h-8 w-8 bg-zinc-50 text-zinc-400 hover:bg-black hover:text-white flex items-center justify-center transition-all border border-zinc-100">
                                               <Github size={14} />
                                            </Link>
                                         </div>
                                      </td>
                                   </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </div>
                 </motion.div>
             )}

             {/* Certification Hub Tab */}
             {activeTab === "certification" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-8">
                   <div className="text-center mb-12">
                      <h2 className="text-3xl font-bold tracking-tight mb-3">Issuance Protocol</h2>
                      <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest opacity-60">Grant official internship credentials</p>
                   </div>

                   <form onSubmit={handleSendLetter} className="bg-white border border-zinc-100 p-8 md:p-12 space-y-8 shadow-2xl shadow-black/5 rounded-none">
                      <div className="space-y-4">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 text-left block">Target Identity</label>
                         <div className="relative">
                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <select 
                              required
                              value={selectedIntern?.id || ""}
                              onChange={(e) => {
                                 const found = interns.find(i => i.id === e.target.value);
                                 setSelectedIntern(found || null);
                              }}
                              className="w-full h-14 bg-zinc-50 border border-zinc-100 pl-12 pr-4 text-base md:text-base md:text-sm outline-none focus:border-[#0055FF] transition-all appearance-none rounded-none font-bold"
                            >
                               <option value="">Select an intern entity...</option>
                               {interns.filter(i => i.isApproved).map((i) => (
                                  <option key={i.id} value={i.id}>{i.name} ({i.email}) {i.letterUrl ? "✓" : ""}</option>
                               ))}
                            </select>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 text-left block">Credential URL (PDF SOURCE)</label>
                         <div className="relative">
                            <FileBadge className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <input 
                              required 
                              value={letterUrl}
                              onChange={(e) => setLetterUrl(e.target.value)}
                              placeholder="Paste cryptographic link..."
                              className="w-full h-14 bg-zinc-50 border border-zinc-100 pl-12 pr-6 text-base md:text-sm outline-none focus:border-[#0055FF] transition-all rounded-none" 
                            />
                         </div>
                      </div>

                      {letterSuccess && (
                         <div className="p-4 bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-emerald-600 rounded-none">
                            <CheckCircle2 size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest tracking-widest">Protocol Executed: Letter Issued</span>
                         </div>
                      )}

                      <button disabled={sendingLetter || !selectedIntern} type="submit" className="w-full h-16 bg-black text-white text-[12px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all disabled:opacity-50 rounded-none shadow-xl shadow-black/10">
                         {sendingLetter ? "Encoding..." : <>Finalize Issuance <FileBadge size={16} /></>}
                      </button>
                   </form>
                </motion.div>
             )}

             {/* Assign Task Tab */}
             {activeTab === "assign" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-8">
                   <div className="text-center mb-12">
                      <h2 className="text-3xl font-bold tracking-tight mb-3 uppercase tracking-tighter">Dispatch Mission</h2>
                      <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest opacity-60">Allocate objectives to your registered assets</p>
                   </div>

                   <form onSubmit={handlePostTask} className="bg-white border border-zinc-100 p-8 md:p-12 space-y-8 shadow-2xl shadow-black/5 rounded-none">
                      <div className="space-y-4 text-left">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 block">Target Identity</label>
                         <div className="relative">
                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <select 
                              required
                              value={selectedIntern?.id || ""}
                              onChange={(e) => {
                                 const found = interns.find(i => i.id === e.target.value);
                                 setSelectedIntern(found || null);
                              }}
                              className="w-full h-14 bg-zinc-50 border border-zinc-100 pl-12 pr-4 text-base md:text-base md:text-sm outline-none focus:border-[#0055FF] transition-all appearance-none rounded-none font-bold"
                            >
                               <option value="">Select an intern entity...</option>
                               {interns.filter(i => i.isApproved).map((i) => (
                                  <option key={i.id} value={i.id}>{i.name} ({i.email}) {i.handRaised ? "🆘" : ""}</option>
                               ))}
                            </select>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-4 text-left">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 block">Target Batch</label>
                            <select 
                              required
                              value={taskData.batch}
                              onChange={(e) => setTaskData({...taskData, batch: e.target.value})}
                              className="w-full h-14 bg-zinc-50 border border-zinc-100 px-6 text-base md:text-sm outline-none focus:border-[#0055FF] transition-all font-bold rounded-none appearance-none"
                            >
                               <option value="Batch 1">Batch 1</option>
                               <option value="Batch 2">Batch 2</option>
                               <option value="Batch 3">Batch 3</option>
                            </select>
                         </div>
                         <div className="space-y-4 text-left">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 block">Task Objective Header</label>
                            <input required value={taskData.title} onChange={(e) => setTaskData({...taskData, title: e.target.value})} placeholder="Project title..." className="w-full h-14 bg-zinc-50 border border-zinc-100 px-6 text-base md:text-sm outline-none focus:border-[#0055FF] transition-all font-bold rounded-none" />
                         </div>
                      </div>

                      <div className="space-y-4 text-left">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 block">Mission Narrative</label>
                         <textarea required rows={5} value={taskData.description} onChange={(e) => setTaskData({...taskData, description: e.target.value})} placeholder="Describe the mission parameters..." className="w-full bg-zinc-50 border border-zinc-100 p-6 text-base md:text-sm outline-none focus:border-[#0055FF] transition-all resize-none leading-relaxed rounded-none" />
                      </div>

                      {formSuccess && (
                         <div className="p-4 bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-emerald-600 rounded-none">
                            <CheckCircle2 size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Transmission Successful</span>
                         </div>
                      )}

                      <button disabled={sendingTask || !selectedIntern} type="submit" className="w-full h-16 bg-black text-white text-[12px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#0055FF] transition-all disabled:opacity-50 rounded-none shadow-xl shadow-black/10">
                         {sendingTask ? "Processing..." : <>Initiate Dispatch <ChevronRight size={16} /></>}
                      </button>
                   </form>
                </motion.div>
             )}

            {/* Authorizations Tab */}
            {activeTab === "authorizations" && (
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                     <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold tracking-tight">Validation Queue</h2>
                        <span className="px-3 py-1 bg-[#0055FF]/10 text-[#0055FF] text-[10px] font-bold uppercase tracking-widest border border-[#0055FF]/20">
                           {interns.filter(i => !i.isApproved).length} Awaiting
                        </span>
                     </div>
                  </div>

                  <div className="bg-white border border-zinc-100 overflow-x-auto shadow-2xl shadow-black/5 rounded-none">
                     <div className="min-w-[800px]">
                        <table className="w-full text-left">
                           <thead>
                              <tr className="bg-zinc-50 border-b border-zinc-100">
                                 <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Applicant Node</th>
                                 <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Connectivity Path</th>
                                 <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Approval Protocol</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-zinc-50">
                              {interns.filter(i => !i.isApproved).map((intern) => (
                                 <tr key={intern.id} className="hover:bg-zinc-50/50 transition-colors">
                                    <td className="px-8 py-4">
                                       <div className="flex items-center gap-3">
                                          <div className="h-9 w-9 bg-black text-white flex items-center justify-center font-bold text-[11px] border border-black">
                                             {intern.name[0]}
                                          </div>
                                          <div>
                                             <p className="text-[14px] font-bold">{intern.name}</p>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="px-8 py-4">
                                       <p className="text-[13px] text-zinc-600 font-medium">{intern.email}</p>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                       <button disabled={isAuthorizing === intern.id} onClick={() => handleApprove(intern.id)} className="h-10 px-6 bg-[#0055FF] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50 rounded-none shadow-lg shadow-[#0055FF]/10 border border-[#0055FF]">
                                          {isAuthorizing === intern.id ? "Authorizing..." : "Grant Access"}
                                       </button>
                                    </td>
                                 </tr>
                              ))}
                              {interns.filter(i => !i.isApproved).length === 0 && (
                                 <tr>
                                    <td colSpan={3} className="px-8 py-20 text-center">
                                       <ShieldCheck size={48} className="mx-auto text-zinc-100 mb-4" />
                                       <p className="text-zinc-400 font-bold uppercase tracking-widest text-[11px]">System Clear: No Pending Signals</p>
                                    </td>
                                 </tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </motion.div>
            )}

            {/* Mentorship Registry Tab */}
            {activeTab === "mentorship" && (
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                     <div>
                        <h2 className="text-2xl font-bold tracking-tight">Mentorship Hub</h2>
                        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Live session tracking and schedule management</p>
                     </div>
                  </div>

                  <div className="bg-white border border-zinc-100 overflow-x-auto shadow-2xl shadow-black/5 rounded-none">
                     <div className="min-w-[900px]">
                        <table className="w-full text-left">
                           <thead>
                              <tr className="bg-zinc-50 border-b border-zinc-100">
                                 <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Mentee Personnel</th>
                                 <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Mission Challenge</th>
                                 <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Schedule Node</th>
                                 <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Current State</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-zinc-100">
                              {mentorshipSessions.map((session) => (
                                 <tr key={session.id} className="hover:bg-zinc-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                       <div className="text-left font-sans">
                                          <p className="text-[14px] font-bold">{session.name}</p>
                                          <p className="text-[10px] text-zinc-400 font-medium">{session.email}</p>
                                       </div>
                                    </td>
                                    <td className="px-8 py-5 max-w-xs text-left">
                                       <p className="text-[13px] text-zinc-600 font-medium line-clamp-2 leading-relaxed" title={session.topic}>
                                          {session.topic}
                                       </p>
                                    </td>
                                    <td className="px-8 py-5">
                                       <div className="flex items-center gap-2 text-zinc-900 justify-start">
                                          <Calendar size={12} className="text-[#0055FF]" />
                                          <span className="text-[12px] font-bold uppercase">{session.date}</span>
                                          <span className="text-zinc-200">|</span>
                                          <Clock size={12} className="text-zinc-400" />
                                          <span className="text-[12px] font-medium">{session.time}</span>
                                       </div>
                                    </td>
                                    <td className="px-8 py-5 text-right font-sans">
                                       <span className={`px-2 py-0.5 text-[9px] font-bold uppercase border ${
                                          session.status === "completed" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                          session.status === "pending" ? "bg-amber-50 text-amber-600 border-amber-100" :
                                          "bg-zinc-50 text-zinc-400 border-zinc-100"
                                       }`}>
                                          {session.status}
                                       </span>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </motion.div>
            )}

            {/* Attendance Protocol Tab */}
            {activeTab === "attendance" && (
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                     <div className="text-left">
                        <h2 className="text-2xl font-bold tracking-tight">Attendance Protocol</h2>
                        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Operational presence and work tracking</p>
                     </div>
                     <div className="flex flex-wrap items-center gap-4">
                         <div className="flex border border-zinc-100 bg-white p-1">
                            <button onClick={() => handleMarkAllAttendance("PRESENT")} disabled={markingId === "all"} className="h-10 px-4 text-[10px] font-bold text-emerald-600 hover:bg-emerald-50 transition-all rounded-none disabled:opacity-50">
                               {markingId === "all" ? "Syncing..." : "Mark All Present"}
                            </button>
                            <div className="w-[1px] bg-zinc-100" />
                            <button onClick={() => handleMarkAllAttendance("ABSENT")} disabled={markingId === "all"} className="h-10 px-4 text-[10px] font-bold text-rose-600 hover:bg-rose-50 transition-all rounded-none disabled:opacity-50">
                               Mark All Absent
                            </button>
                         </div>
                         <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="h-12 px-6 bg-white border border-zinc-100 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-[#0055FF] transition-all rounded-none" />
                         <button onClick={fetchAttendance} className="h-12 w-12 bg-white border border-zinc-100 flex items-center justify-center hover:bg-zinc-50 transition-all rounded-none">
                            <History size={16} />
                         </button>
                      </div>
                  </div>

                  <div className="bg-white border border-zinc-100 overflow-x-auto shadow-2xl shadow-black/5 rounded-none">
                     <div className="min-w-[800px]">
                        <table className="w-full text-left font-sans">
                           <thead>
                              <tr className="bg-zinc-50 border-b border-zinc-100">
                                 <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Personnel Node</th>
                                 <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Presence State</th>
                                 <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">State Sync</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-zinc-50">
                              {interns.filter(i => i.isApproved).map((intern) => {
                                 const record = currentAttendance.find(a => a.userId === intern.id);
                                 return (
                                    <tr key={intern.id} className="hover:bg-zinc-50/50 transition-colors">
                                       <td className="px-8 py-5">
                                          <div className="flex items-center gap-3">
                                             <div className="h-8 w-8 bg-black text-white flex items-center justify-center font-bold text-[10px]">
                                                {intern.name[0]}
                                             </div>
                                             <p className="text-[14px] font-bold">{intern.name}</p>
                                          </div>
                                       </td>
                                       <td className="px-8 py-5">
                                          <select defaultValue={record?.status || "PRESENT"} onChange={(e) => handleMarkAttendance(intern.id, e.target.value, record?.workSummary || "")} className={`h-9 px-4 text-[10px] font-bold border outline-none transition-all rounded-none ${
                                             record?.status === "ABSENT" ? "text-rose-600" :
                                             record?.status === "LATE" ? "text-amber-600" :
                                             "text-emerald-600"
                                          }`}>
                                             <option value="PRESENT">Present</option>
                                             <option value="ABSENT">Absent</option>
                                             <option value="LATE">Late</option>
                                             <option value="VACATION">Vacation</option>
                                          </select>
                                       </td>
                                       <td className="px-8 py-5 text-right">
                                          <div className="flex justify-end pr-4">
                                             {markingId === intern.id ? (
                                                <div className="h-5 w-5 border-2 border-[#0055FF] border-t-transparent animate-spin" />
                                             ) : record ? (
                                                <CheckCircle2 size={16} className="text-emerald-500" />
                                             ) : (
                                                <Clock size={16} className="text-zinc-200" />
                                             )}
                                          </div>
                                       </td>
                                    </tr>
                                 );
                              })}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </motion.div>
            )}

            {/* Submissions Registry Tab */}
            {activeTab === "submissions" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                   <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                       <div className="text-left">
                           <h2 className="text-2xl font-bold tracking-tight">Intern Submissions</h2>
                           <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mt-1">Central audit trail for all code artifacts</p>
                       </div>
                       <button onClick={fetchSubmissions} className="text-[10px] font-bold uppercase tracking-widest px-6 h-10 border border-zinc-100 bg-white hover:bg-zinc-50 text-zinc-600 transition-all rounded-none">
                           Hard Refresh
                       </button>
                   </div>

                   <div className="bg-white border border-zinc-100 overflow-x-auto shadow-sm shadow-black/5 rounded-none">
                      <div className="min-w-[950px]">
                        <table className="w-full text-left font-sans">
                           <thead>
                              <tr className="bg-zinc-50 border-b border-zinc-100 text-left">
                                 <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Intern Entity</th>
                                 <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Module Vector</th>
                                 <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Artifact Links</th>
                                 <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Sync Date</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-zinc-50 text-left">
                              {submissions.map((sub) => (
                                 <tr key={sub.id} className="hover:bg-zinc-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                       <p className="text-sm font-bold text-zinc-900">{sub.intern.name}</p>
                                       <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">{sub.intern.email}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                       <p className="text-sm font-bold text-zinc-700">{sub.schedule.typeOfWork}</p>
                                       <span className="text-[9px] font-bold text-[#0055FF] bg-blue-50 px-2 py-0.5 border border-blue-100 mt-1 inline-block uppercase tracking-widest">{sub.schedule.week}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                       <div className="flex items-center gap-4">
                                          <a href={sub.githubLink} target="_blank" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-600 hover:text-black transition-colors">
                                             <Github size={14} /> GitHub
                                          </a>
                                          <a href={sub.submissionLink} target="_blank" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#0055FF] hover:underline transition-colors">
                                             <ExternalLink size={14} /> Deployment
                                          </a>
                                       </div>
                                    </td>
                                    <td className="px-8 py-5">
                                       <span className="text-[12px] font-bold text-zinc-400 uppercase tracking-tighter">
                                          {new Date(sub.createdAt).toLocaleDateString('en-GB')}
                                       </span>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                      </div>
                   </div>
                </motion.div>
             )}

            {/* Curriculum Dispatcher Tab */}
            {activeTab === "schedule" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-8">
                   <div className="text-center mb-8 md:mb-12">
                      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 md:mb-3 uppercase tracking-tighter">Schedule Dispatcher</h2>
                      <p className="text-zinc-500 text-[11px] md:text-sm font-bold uppercase tracking-widest opacity-60">Create weekly updates and tasks for interns</p>
                   </div>

                   <form onSubmit={handlePostSchedule} className="bg-white border border-zinc-100 p-6 md:p-12 space-y-6 md:space-y-8 shadow-2xl shadow-black/5 rounded-none">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4 text-left">
                           <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 block">Course Week</label>
                           <input 
                             required 
                             value={scheduleData.week}
                             onChange={(e) => setScheduleData({...scheduleData, week: e.target.value})}
                             placeholder="e.g. Week 1"
                             className="w-full h-14 bg-zinc-50 border border-zinc-100 px-6 text-base md:text-sm outline-none focus:border-[#0055FF] transition-all font-bold rounded-none" 
                           />
                        </div>
                        <div className="space-y-4 text-left">
                           <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 block">Protocol Deadline</label>
                           <input 
                             required 
                             type="date"
                             value={scheduleData.deadline}
                             onChange={(e) => setScheduleData({...scheduleData, deadline: e.target.value})}
                             className="w-full h-14 bg-zinc-50 border border-zinc-100 px-6 text-base md:text-sm outline-none focus:border-[#0055FF] transition-all rounded-none font-bold" 
                           />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-4 text-left">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 block">Mission Batch</label>
                            <select 
                              required
                              value={scheduleData.batch}
                              onChange={(e) => setScheduleData({...scheduleData, batch: e.target.value})}
                              className="w-full h-14 bg-zinc-50 border border-zinc-100 px-6 text-base md:text-sm outline-none focus:border-[#0055FF] transition-all font-bold rounded-none appearance-none"
                            >
                               <option value="Batch 1">Batch 1</option>
                               <option value="Batch 2">Batch 2</option>
                               <option value="Batch 3">Batch 3</option>
                            </select>
                         </div>
                         <div className="space-y-4 text-left">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 block">Type of Operation</label>
                            <input 
                              required 
                              value={scheduleData.typeOfWork}
                              onChange={(e) => setScheduleData({...scheduleData, typeOfWork: e.target.value})}
                              placeholder="e.g. Full Stack Integration"
                              className="w-full h-14 bg-zinc-50 border border-zinc-100 px-6 text-base md:text-sm outline-none focus:border-[#0055FF] transition-all font-bold rounded-none" 
                            />
                         </div>
                      </div>

                      <div className="space-y-4 text-left">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 block">Tech Stack (Comma Separated)</label>
                         <input 
                           required 
                           value={scheduleData.toolsUsed}
                           onChange={(e) => setScheduleData({...scheduleData, toolsUsed: e.target.value})}
                           placeholder="e.g. Next.js, Prisma, Tailwind"
                           className="w-full h-14 bg-zinc-50 border border-zinc-100 px-6 text-base md:text-sm outline-none focus:border-[#0055FF] transition-all rounded-none" 
                         />
                      </div>

                      <div className="space-y-4 text-left">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 block">Deployment Logic</label>
                         <input 
                           required 
                           value={scheduleData.deploymentTools}
                           onChange={(e) => setScheduleData({...scheduleData, deploymentTools: e.target.value})}
                           placeholder="e.g. Vercel, Railway, Supabase"
                           className="w-full h-14 bg-zinc-50 border border-zinc-100 px-6 text-base md:text-sm outline-none focus:border-[#0055FF] transition-all rounded-none" 
                         />
                      </div>

                      <div className="space-y-4 text-left">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 block">Operational Requirements (One per line)</label>
                         <textarea 
                           required 
                           rows={3}
                           value={scheduleData.requirements}
                           onChange={(e) => setScheduleData({...scheduleData, requirements: e.target.value})}
                           placeholder="List specific requirements..."
                           className="w-full bg-zinc-50 border border-zinc-100 p-6 text-base md:text-sm outline-none focus:border-[#0055FF] transition-all resize-none leading-relaxed rounded-none" 
                         />
                      </div>

                      <div className="space-y-4 text-left">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 block">Mission Description</label>
                         <textarea 
                           required 
                           rows={4}
                           value={scheduleData.description}
                           onChange={(e) => setScheduleData({...scheduleData, description: e.target.value})}
                           placeholder="Describe the primary objectives..."
                           className="w-full bg-zinc-50 border border-zinc-100 p-6 text-base md:text-sm outline-none focus:border-[#0055FF] transition-all resize-none leading-relaxed rounded-none" 
                         />
                      </div>

                      <div className="space-y-4 text-left">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 block">Expected Outcomes (One per line)</label>
                         <textarea 
                           required 
                           rows={4}
                           value={scheduleData.outcomes}
                           onChange={(e) => setScheduleData({...scheduleData, outcomes: e.target.value})}
                           placeholder="Describe success metrics..."
                           className="w-full bg-zinc-50 border border-zinc-100 p-6 text-base md:text-sm outline-none focus:border-[#0055FF] transition-all resize-none leading-relaxed rounded-none" 
                         />
                      </div>

                      {scheduleSuccess && (
                         <div className="p-4 bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-emerald-600 rounded-none">
                            <CheckCircle2 size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Protocol Released Successfully</span>
                         </div>
                      )}

                      <button 
                        disabled={sendingSchedule}
                        type="submit"
                        className="w-full h-16 bg-black text-white text-[12px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#0055FF] transition-all disabled:opacity-50 rounded-none shadow-xl shadow-black/10"
                      >
                         {sendingSchedule ? "Syncing..." : <>Post Protocol <Calendar size={16} /></>}
                      </button>
                   </form>
                </motion.div>
             )}

            {/* Workshop Registry Tab */}
            {activeTab === "workshop" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                       <div className="flex items-center gap-4">
                          <h2 className="text-2xl font-bold tracking-tight">Workshop Registry</h2>
                           <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest border border-red-100">
                              {workshopEntries.length} Applicants
                           </span>
                       </div>
                       <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button onClick={fetchWorkshopEntries} className="flex-1 sm:flex-none px-4 h-10 bg-white border border-zinc-100 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-50 transition-all flex items-center justify-center gap-2">
                             <History size={14} /> Refresh
                          </button>
                          <button onClick={downloadWorkshopCsv} className="flex-1 sm:flex-none px-4 h-10 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2">
                             <Download size={14} /> CSV
                          </button>
                       </div>
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white border border-zinc-100 shadow-2xl shadow-black/5 rounded-none overflow-hidden">
                       <div className="overflow-x-auto">
                           <table className="w-full text-left font-sans">
                              <thead>
                                 <tr className="bg-zinc-50 border-b border-zinc-100 text-left">
                                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Applicant Node</th>
                                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Branch</th>
                                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Year</th>
                                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Email</th>
                                    <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Phone</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-50 text-left">
                                 {workshopEntries.map((intern) => (
                                    <tr key={intern.id} className="hover:bg-zinc-50/50 transition-colors">
                                       <td className="px-6 py-4">
                                          <div className="flex items-center gap-3">
                                             <div className="h-9 w-9 bg-red-100 text-red-600 flex items-center justify-center font-bold text-[11px] border border-red-200">
                                                {intern.name[0]}
                                             </div>
                                             <div>
                                                <p className="text-[14px] font-bold tracking-tight leading-none">{intern.name}</p>
                                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Workshop Entity</p>
                                             </div>
                                          </div>
                                       </td>
                                       <td className="px-6 py-4">
                                          <p className="text-[14px] font-bold text-zinc-800">{intern.branch}</p>
                                       </td>
                                       <td className="px-6 py-4">
                                          <p className="text-[13px] font-bold text-zinc-500 uppercase tracking-widest">{intern.year}</p>
                                       </td>
                                       <td className="px-6 py-4">
                                          <p className="text-[13px] font-medium text-zinc-600">{intern.email}</p>
                                       </td>
                                       <td className="px-6 py-4 text-right">
                                          <p className="text-[13px] font-bold text-zinc-900">{intern.phone}</p>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                       </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                       {workshopEntries.map((intern) => (
                          <div key={intern.id} className="bg-white border border-zinc-100 p-6 space-y-6 shadow-sm">
                             <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                   <p className="text-sm font-bold leading-tight">{intern.name}</p>
                                   <div className="flex">
                                      <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold border border-red-100">
                                         {intern.branch}
                                      </span>
                                   </div>
                                </div>
                             </div>

                             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-50">
                                <div className="text-left">
                                   <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Year</p>
                                   <p className="text-xs font-medium text-zinc-700">{intern.year}</p>
                                </div>
                             </div>

                             <div className="space-y-2 pt-4 border-t border-zinc-50 text-left">
                                <div className="flex items-center gap-2 text-zinc-500">
                                   <Mail size={12} />
                                   <span className="text-xs font-medium">{intern.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-500">
                                   <ShieldCheck size={12} />
                                   <span className="text-xs font-medium">{intern.phone}</span>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>

                    {workshopEntries.length === 0 && (
                       <div className="bg-white border border-zinc-100 py-24 text-center">
                          <p className="text-zinc-300 font-bold uppercase tracking-widest text-[11px]">No Workshop Signals Synchronized</p>
                       </div>
                    )}
                </motion.div>
            )}

            {/* Logbook Tab */}
            {activeTab === "history" && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                       <h2 className="text-2xl font-bold tracking-tight">System Logbook</h2>
                       <button className="h-10 px-6 bg-white border border-zinc-100 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 rounded-none">
                          <Filter size={14} /> Filter Logic
                       </button>
                    </div>

                    <div className="bg-white border border-zinc-100 overflow-x-auto shadow-2xl shadow-black/5 rounded-none">
                       <div className="min-w-[1000px]">
                        <table className="w-full text-left font-sans">
                           <thead>
                              <tr className="bg-zinc-50 border-b border-zinc-100">
                                 <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Recipient Node</th>
                                 <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Mission Vector</th>
                                 <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Current Status</th>
                                 <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Dispatch Time</th>
                                 <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-zinc-50">
                               {tasks.map((task) => (
                                  <tr key={task.id} className="hover:bg-zinc-50/50 transition-colors">
                                     <td className="px-8 py-4">
                                        <div className="flex items-center gap-3 text-left">
                                           <div className="h-9 w-9 bg-black text-white border border-black flex items-center justify-center text-[10px] font-bold">
                                              {task.user?.name[0]}
                                           </div>
                                           <div>
                                             <p className="text-[14px] font-bold leading-none">{task.user?.name}</p>
                                             <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">{task.user?.email}</p>
                                           </div>
                                        </div>
                                     </td>
                                     <td className="px-8 py-4 text-left">
                                        <div className="flex items-center gap-2">
                                           <p className="text-[13px] font-bold uppercase tracking-tight">{task.title}</p>
                                           {task.attachmentUrl && (
                                              <a href={task.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-[#0055FF] hover:scale-110 transition-transform">
                                                 <Paperclip size={14} />
                                              </a>
                                           )}
                                        </div>
                                        <p className="text-[11px] text-zinc-400 truncate max-w-[200px] mt-1">{task.description}</p>
                                     </td>
                                     <td className="px-8 py-4">
                                        <div className="flex items-center gap-2">
                                           {task.status === "pending" ? (
                                              <Clock size={12} className="text-amber-500" />
                                           ) : (
                                              <CheckCircle2 size={12} className="text-emerald-500" />
                                           )}
                                           <span className={`text-[10px] font-bold uppercase tracking-widest ${
                                              task.status === "pending" ? "text-amber-600" : "text-emerald-600"
                                           }`}>
                                              {task.status}
                                           </span>
                                        </div>
                                     </td>
                                     <td className="px-8 py-4 text-[12px] text-zinc-500 font-bold uppercase tracking-tighter">
                                        {new Date(task.createdAt).toLocaleDateString('en-GB')}
                                     </td>
                                     <td className="px-8 py-4 text-right">
                                        <button className="h-8 w-8 text-zinc-300 hover:text-black transition-colors rounded-none">
                                           <MoreVertical size={16} />
                                        </button>
                                     </td>
                                  </tr>
                               ))}
                           </tbody>
                        </table>
                       </div>
                    </div>
                 </motion.div>
              )}
           </div>
        </main>
        <PWAInstallButton />
     </div>
  );
}
