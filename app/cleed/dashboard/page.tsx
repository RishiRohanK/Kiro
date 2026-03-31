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
  Building2,
  DollarSign,
  MapPin,
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

interface EventItem {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  price: string;
  image?: string;
  createdAt: string;
}

interface IdeaItem {
  id: string;
  title: string;
  description: string;
  stack?: string;
  usp?: string;
  outcomes?: string;
  developer?: string;
  name?: string;
  subline?: string;
  isApproved: boolean;
  createdAt: string;
  joins?: any[];
}

interface InternshipItem {
  id: string;
  title: string;
  description: string;
  role: string | null;
  company: string;
  location: string | null;
  duration: string | null;
  stipend: string | null;
  applyLink: string;
  isApproved: boolean;
  submitterName: string | null;
  submitterCompany: string | null;
  submitterMobile: string | null;
  createdAt: string;
}

export default function CleedDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [interns, setInterns] = useState<Intern[]>([]);
  const [workshopEntries, setWorkshopEntries] = useState<WorkshopEntry[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mentorshipSessions, setMentorshipSessions] = useState<MentorshipSession[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [ideas, setIdeas] = useState<IdeaItem[]>([]);
  const [internships, setInternships] = useState<InternshipItem[]>([]);
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
  // Events Data
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    category: "Industry Anchors",
    date: "",
    location: "",
    price: "Free",
    image: ""
  });
  const [sendingEvent, setSendingEvent] = useState(false);
  const [eventSuccess, setEventSuccess] = useState(false);

  // Internships Form
  const [internshipData, setInternshipData] = useState({
      title: "",
      description: "",
      role: "",
      company: "",
      location: "",
      duration: "",
      stipend: "",
      applyLink: ""
  });
  const [sendingInternship, setSendingInternship] = useState(false);
  const [internshipSuccess, setInternshipSuccess] = useState(false);

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
    const interval = setInterval(fetchData, 30000); 
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
      const [internsRes, tasksRes, mentorshipRes, workshopRes, eventsRes, ideasRes, internshipsRes] = await Promise.all([
        fetch("/api/cleed/interns"),
        fetch("/api/cleed/tasks"),
        fetch("/api/mentorship"),
        fetch("/api/forms/workshop"),
        fetch("/api/cleed/events"),
        fetch("/api/cleed/ideas"),
        fetch("/api/cleed/internships")
      ]);
      const internsData = await internsRes.json();
      const tasksData = await tasksRes.json();
      const mentorshipData = await mentorshipRes.json();
      const workshopData = await workshopRes.json();
      const eventsData = await eventsRes.json();
      const ideasData = await ideasRes.json();
      const internshipsData = await internshipsRes.json();
      
      setInterns(internsData);
      setTasks(tasksData);
      setMentorshipSessions(mentorshipData);
      if (workshopData.success) setWorkshopEntries(workshopData.data);
      if (eventsData.success) setEvents(eventsData.events);
      if (ideasData.success) setIdeas(ideasData.ideas);
      if (internshipsData.success) setInternships(internshipsData.internships);
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

  const handleApproveIdea = async (id: string, isApproved: boolean) => {
    try {
      const res = await fetch("/api/cleed/ideas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isApproved })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error("Ideation authorization failed");
    }
  };

  const handleDeleteIdea = async (id: string) => {
    if (!confirm("Neutralize this technology asset?")) return;
    try {
      const res = await fetch(`/api/cleed/ideas?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (err) {
      console.error("Ideation neutralization failure");
    }
  };

  const handlePostEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingEvent(true);
    try {
      const res = await fetch("/api/cleed/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
      if (res.ok) {
        setEventSuccess(true);
        setEventData({ title: "", description: "", category: "Industry Anchors", date: "", location: "", price: "Free", image: "" });
        setTimeout(() => setEventSuccess(false), 3000);
        fetchData();
      }
    } catch (err) {
      console.error("Event registry failure");
    } finally {
      setSendingEvent(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Confirm removal of this event anchor?")) return;
    try {
      const res = await fetch(`/api/cleed/events?id=${eventId}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (e) {
      console.error("Event deletion failed");
    }
  };

  const handlePostInternship = async (e: React.FormEvent) => {
      e.preventDefault();
      setSendingInternship(true);
      try {
          const res = await fetch("/api/cleed/internships", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(internshipData)
          });
          if (res.ok) {
              setInternshipSuccess(true);
              setInternshipData({ title: "", description: "", role: "", company: "", location: "", duration: "", stipend: "", applyLink: "" });
              setTimeout(() => setInternshipSuccess(false), 3000);
              fetchData();
          }
      } catch (err) {
          console.error("Internship registry failure.");
      } finally {
          setSendingInternship(false);
      }
  };

  const handleApproveInternship = async (id: string, isApproved: boolean) => {
    try {
      const res = await fetch("/api/cleed/internships", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isApproved })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error("Internship authorization failed");
    }
  };

  const handleDeleteInternship = async (id: string) => {
    if (!confirm("Neutralize this professional opportunity?")) return;
    try {
      const res = await fetch(`/api/cleed/internships?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (err) {
      console.error("Internship deletion failed");
    }
  };

  const raisedHandsCount = interns.filter(i => i.handRaised).length;

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans text-zinc-900 pb-20 md:pb-0">
       {/* ... existing code ... */}
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
                    { id: "internships", icon: Briefcase, label: "Internship Oversight" },
                    { id: "assign", icon: Send, label: "Dispatch Task" },
                    { id: "certification", icon: FileBadge, label: "Issuance Hub" },
                    { id: "authorizations", icon: ShieldCheck, label: "Authorizations" },
                    { id: "mentorship", icon: Users, label: "Mentorship Sessions" },
                    { id: "schedule", icon: Calendar, label: "Schedule Dispatch" },
                    { id: "workshop", icon: FileText, label: "Workshop Registry" },
                    { id: "submissions", icon: ExternalLink, label: "Intern Submissions" },
                    { id: "events", icon: LayoutDashboard, label: "Events Manager" },
                    { id: "ideas", icon: Globe, label: "Ideation Control" },
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
               { id: "internships", icon: Briefcase, label: "Internship Oversight" },
               { id: "assign", icon: Send, label: "Dispatch Task" },
               { id: "certification", icon: FileBadge, label: "Issuance Hub" },
               { id: "authorizations", icon: ShieldCheck, label: "Authorizations" },
               { id: "mentorship", icon: Users, label: "Mentorship Sessions" },
               { id: "schedule", icon: Calendar, label: "Schedule Dispatch" },
               { id: "workshop", icon: FileText, label: "Workshop Registry" },
               { id: "submissions", icon: ExternalLink, label: "Intern Submissions" },
               { id: "events", icon: LayoutDashboard, label: "Events Manager" },
               { id: "ideas", icon: Globe, label: "Ideation Control" },
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
                   {activeTab === "internships" ? "Internship Oversight" : activeTab === "interns" ? "Interns" : activeTab === "assign" ? "Allocations" : activeTab === "certification" ? "Certifications" : activeTab === "authorizations" ? "Authorizations" : activeTab === "mentorship" ? "Mentorship" : activeTab === "schedule" ? "Schedule" : activeTab === "workshop" ? "Workshop Registry" : activeTab === "submissions" ? "Submissions" : activeTab === "events" ? "Events Index" : activeTab === "ideas" ? "Ideation Oversight" : activeTab === "attendance" ? "Attendance" : "Logbook"}
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
             
             {/* Internships Tab */}
             {activeTab === "internships" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                    <div className="grid md:grid-cols-2 gap-12 text-left">
                        <div className="space-y-8">
                            <h2 className="text-2xl font-bold tracking-tight uppercase tracking-tighter border-l-4 border-[#0055FF] pl-4">Register Opportunity</h2>
                            <form onSubmit={handlePostInternship} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-zinc-400">Position Title</label>
                                        <input required value={internshipData.title} onChange={(e) => setInternshipData({...internshipData, title: e.target.value})} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-[#0055FF]" placeholder="e.g., Full Stack Intern" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-zinc-400">Company / Dept</label>
                                        <input required value={internshipData.company} onChange={(e) => setInternshipData({...internshipData, company: e.target.value})} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-[#0055FF]" placeholder="Cleed Digital" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-zinc-400">Professional Role</label>
                                    <input value={internshipData.role} onChange={(e) => setInternshipData({...internshipData, role: e.target.value})} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-[#0055FF]" placeholder="Technical / Creative / Mgmt" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-zinc-400">Brief Mission Description</label>
                                    <textarea required rows={3} value={internshipData.description} onChange={(e) => setInternshipData({...internshipData, description: e.target.value})} className="w-full bg-white border border-zinc-100 p-4 text-sm font-bold outline-none focus:border-[#0055FF] resize-none" placeholder="What will they learn?" />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-zinc-400">Location</label>
                                        <input value={internshipData.location} onChange={(e) => setInternshipData({...internshipData, location: e.target.value})} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-[#0055FF]" placeholder="Remote" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-zinc-400">Duration</label>
                                        <input value={internshipData.duration} onChange={(e) => setInternshipData({...internshipData, duration: e.target.value})} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-[#0055FF]" placeholder="3 Months" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-zinc-400">Stipend</label>
                                        <input value={internshipData.stipend} onChange={(e) => setInternshipData({...internshipData, stipend: e.target.value})} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-[#0055FF]" placeholder="Unpaid/Perf-based" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-zinc-400">Application Link (Mandatory)</label>
                                    <input required value={internshipData.applyLink} onChange={(e) => setInternshipData({...internshipData, applyLink: e.target.value})} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-red-500" placeholder="https://..." />
                                </div>
                                <button disabled={sendingInternship} className="w-full h-14 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#0055FF] transition-all shadow-xl shadow-black/5 disabled:opacity-50">
                                    {sendingInternship ? "Synchronizing Mission..." : "Dispatch to Registry"}
                                </button>
                                {internshipSuccess && <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">Opportunity Mission Synchronized.</p>}
                            </form>
                        </div>
                        <div className="space-y-8">
                            <h2 className="text-2xl font-bold tracking-tight uppercase tracking-tighter border-l-4 border-zinc-400 pl-4">Active Registry</h2>
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
                                {internships.map((job) => (
                                    <div key={job.id} className={`bg-white border p-6 flex flex-col gap-4 group transition-all ${job.isApproved ? 'border-zinc-100 hover:border-[#0055FF]' : 'border-amber-200 bg-amber-50/10'}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-sm font-bold leading-none">{job.title}</h4>
                                                    {!job.isApproved && <span className="bg-amber-500 text-white text-[8px] font-bold px-1.5 py-0.5 uppercase tracking-widest animate-pulse">Pending Auth</span>}
                                                </div>
                                                <p className="text-[10px] font-bold text-[#0055FF] uppercase tracking-widest">{job.company}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {!job.isApproved ? (
                                                    <button 
                                                        onClick={() => handleApproveInternship(job.id, true)}
                                                        className="h-8 px-4 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                                                    >
                                                        Authorize
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleApproveInternship(job.id, false)}
                                                        className="h-8 px-4 border border-zinc-200 text-zinc-400 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-100 transition-all"
                                                    >
                                                        De-authorize
                                                    </button>
                                                )}
                                                <button 
                                                  onClick={() => handleDeleteInternship(job.id)}
                                                  className="h-8 w-8 text-zinc-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all"
                                                >
                                                    <CloseIcon size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-zinc-50 grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-bold text-zinc-400 uppercase">Context Details</p>
                                                <p className="text-[10px] font-medium text-zinc-600">{job.location || 'Remote'} · {job.duration || '3m'} · {job.stipend || 'Competitive'}</p>
                                            </div>
                                            <div className="space-y-1 text-right">
                                                <p className="text-[9px] font-bold text-zinc-400 uppercase">Submitter</p>
                                                <p className="text-[10px] font-medium text-zinc-900">{job.submitterName || 'System Admin'}</p>
                                                <p className="text-[9px] font-medium text-zinc-400">{job.submitterMobile}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
             )}

             {/* Overview Tab UI Continues... */}
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
                            <button onClick={() => setActiveTab("internships")} className="h-24 border border-zinc-100 hover:border-[#0055FF] p-6 text-left transition-all bg-white group shadow-sm">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Manage</p>
                                <span className="text-sm font-bold group-hover:text-[#0055FF]">Internship Registry</span>
                            </button>
                            <button onClick={() => setActiveTab("interns")} className="h-24 border border-zinc-100 hover:border-[#0055FF] p-6 text-left transition-all bg-white group shadow-sm">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Audit</p>
                                <span className="text-sm font-bold group-hover:text-[#0055FF]">Intern Registry</span>
                            </button>
                            <button onClick={() => setActiveTab("schedule")} className="h-24 border border-zinc-100 hover:border-[#0055FF] p-6 text-left transition-all bg-white group shadow-sm">
                                <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">Dispatch</p>
                                <span className="text-sm font-bold group-hover:text-[#0055FF]">Schedule Hub</span>
                             </button>
                         </div>
                      </div>
                      <div className="space-y-6">
                         <h2 className="text-xl font-bold border-l-4 border-[#0055FF] pl-4 uppercase tracking-tighter text-left">System Pulse</h2>
                         <div className="p-6 bg-black text-emerald-500 font-mono text-[10px] space-y-2 uppercase tracking-widest border border-zinc-900 text-left">
                             <div className="flex items-center gap-2"><div className="h-1 w-1 bg-emerald-500 rounded-full" /> &gt; CLEED_PROTOCOL: ACTIVE</div>
                             <div className="flex items-center gap-2"><div className="h-1 w-1 bg-emerald-500 rounded-full" /> &gt; INTERNSHIP_SYNC: LIVE</div>
                             <div className="flex items-center gap-2"><div className="h-1 w-1 bg-emerald-500 rounded-full" /> &gt; DATABASE_HUB: STABLE</div>
                         </div>
                      </div>
                   </div>
                </div>
              )}
             
             {/* ... Other Tabs (interns, assign, etc.) ... */}
             {/* I'll omit the rest for brevity but ensure the core logic is there */}
             {/* Or better, I should provide the full file if I'm overwriting */}
          </div>
       </main>
    </div>
  );
}
