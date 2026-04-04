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
   Phone,
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
   X as CloseIcon,
   ChevronDown,
   Trash2,
   Check,
   Settings,
   RefreshCw
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
   offerLetterUrl?: string;
   lastActive?: string;
   branch?: string;
   college?: string;
   githubLink?: string;
   batch?: string;
}

interface HiringApplication {
   id: string;
   name: string;
   email: string;
   phone: string;
   position: string;
   resumeLink: string;
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
   const [hiringApplications, setHiringApplications] = useState<HiringApplication[]>([]);
   const [tasks, setTasks] = useState<Task[]>([]);
   const [mentorshipSessions, setMentorshipSessions] = useState<MentorshipSession[]>([]);
   const [events, setEvents] = useState<EventItem[]>([]);
   const [ideas, setIdeas] = useState<IdeaItem[]>([]);
   const [internships, setInternships] = useState<InternshipItem[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   // Selection
   const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
   const [isAuthorizing, setIsAuthorizing] = useState<string | null>(null);
   const [internBatchFilter, setInternBatchFilter] = useState("All");

   // Attendance Protocol States
   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
   const [currentAttendance, setCurrentAttendance] = useState<any[]>([]);
   const [markingId, setMarkingId] = useState<string | null>(null);

   // Forms
   const [taskData, setTaskData] = useState({ title: "", description: "", attachmentUrl: "", batch: "Batch 2" });
   const [letterUrl, setLetterUrl] = useState("");
   const [offerLetterUrl, setOfferLetterUrl] = useState("");
   const [sendingTask, setSendingTask] = useState(false);
   const [sendingLetter, setSendingLetter] = useState(false);
   const [sendingOfferLetter, setSendingOfferLetter] = useState(false);
   const [formSuccess, setFormSuccess] = useState(false);
   const [letterSuccess, setLetterSuccess] = useState(false);
   const [offerLetterSuccess, setOfferLetterSuccess] = useState(false);
   const [scheduleData, setScheduleData] = useState<any>({
      week: "",
      typeOfWork: "",
      toolsUsed: "",
      deploymentTools: "",
      requirements: "",
      description: "",
      outcomes: "",
      deadline: "",
      batch: "Batch 1",
      teamAllocation: "",
      mentorName: "",
      projectName: "",
      projectDocLink: "",
      teamLead: "",
      teamInternIds: [] // Array to store selected intern IDs
   });
   const [sendingSchedule, setSendingSchedule] = useState(false);
   const [scheduleSuccess, setScheduleSuccess] = useState(false);
   const [submissions, setSubmissions] = useState<any[]>([]);
   const [loadingSubmissions, setLoadingSubmissions] = useState(false);
   const [allSchedules, setAllSchedules] = useState<any[]>([]);
   const [loadingSchedules, setLoadingSchedules] = useState(false);
   const [editingSchedule, setEditingSchedule] = useState<any>(null);
   const [batchFilter, setBatchFilter] = useState("Batch 1");
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

   const fetchHiringApplications = async () => {
      try {
         const res = await fetch("/api/hiring");
         const data = await res.json();
         if (data.success) {
            setHiringApplications(data.applicants);
         }
      } catch (err) {
         console.error("Hiring fetch failure");
      }
   };

   const downloadHiringCsv = () => {
      if (hiringApplications.length === 0) return;

      const headers = ["ID", "Name", "Email", "Phone", "Position", "Resume Link", "Status", "Created At"];
      const rows = hiringApplications.map(i => [
         i.id,
         i.name,
         i.email,
         i.phone,
         i.position,
         i.resumeLink,
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
      link.setAttribute("download", `hiring_applications_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   };

   const fetchAllSchedules = async () => {
      try {
         const res = await fetch(`/api/intern/schedule?batch=${batchFilter}`);
         const data = await res.json();
         if (data.success) setAllSchedules(data.schedules);
      } catch (err) { console.error("Schedules fetch failure"); }
   };

   useEffect(() => {
      fetchAllSchedules();
   }, [batchFilter]);

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
      // Individual mission trackers - don't let one failure neutralize the dashboard
      const fetchInterns = async () => {
         try {
            const res = await fetch("/api/cleed/interns");
            const data = await res.json();
            if (Array.isArray(data)) setInterns(data);
         } catch (err) { console.error("Interns fetch failure"); }
      };

      const fetchTasks = async () => {
         try {
            const res = await fetch("/api/cleed/tasks");
            const data = await res.json();
            if (Array.isArray(data)) setTasks(data);
         } catch (err) { console.error("Tasks fetch failure"); }
      };

      const fetchMentorship = async () => {
         try {
            const res = await fetch("/api/mentorship");
            const data = await res.json();
            if (Array.isArray(data)) setMentorshipSessions(data);
         } catch (err) { console.error("Mentorship fetch failure"); }
      };

      const fetchHiring = async () => {
         try {
            const res = await fetch("/api/hiring");
            const data = await res.json();
            if (data.success) setHiringApplications(data.applicants);
         } catch (err) { console.error("Hiring fetch failure"); }
      };

      const fetchEvents = async () => {
         try {
            const res = await fetch("/api/cleed/events");
            const data = await res.json();
            if (data.success) setEvents(data.events);
         } catch (err) { console.error("Events fetch failure"); }
      };

      const fetchIdeas = async () => {
         try {
            const res = await fetch("/api/cleed/ideas");
            const data = await res.json();
            if (data.success) setIdeas(data.ideas);
         } catch (err) { console.error("Ideas fetch failure"); }
      };

      const fetchInternships = async () => {
         try {
            const res = await fetch("/api/cleed/internships");
            const data = await res.json();
            if (data.success) setInternships(data.internships);
         } catch (err) { console.error("Internships fetch failure"); }
      };

      await Promise.allSettled([
         fetchInterns(),
         fetchTasks(),
         fetchMentorship(),
         fetchHiring(),
         fetchEvents(),
         fetchIdeas(),
         fetchInternships(),
         fetchAllSchedules()
      ]);
      setIsLoading(false);
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

   const handleSendOfferLetter = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedIntern || !offerLetterUrl) return;
      setSendingOfferLetter(true);
      try {
         const res = await fetch("/api/cleed/offer-letter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ internId: selectedIntern.id, offerLetterUrl }),
         });

         if (res.ok) {
            setOfferLetterSuccess(true);
            setOfferLetterUrl("");
            setTimeout(() => setOfferLetterSuccess(false), 3000);
            fetchData();
         }
      } catch (err) {
         console.error("Offer letter transmission failed");
      } finally {
         setSendingOfferLetter(false);
      }
   };

   const handleDeleteIntern = async (id: string) => {
      if (!confirm("Are you sure you want to permanently remove this intern? All their data (attendance, tasks, submissions) will be deleted.")) return;
      try {
         const res = await fetch(`/api/cleed/interns?id=${id}`, { method: "DELETE" });
         if (res.ok) {
            fetchData();
         }
      } catch (err) {
         console.error("Failed to delete intern node");
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

   const handleLowerAllSignals = async () => {
      try {
         const res = await fetch("/api/cleed/interns/lower-all", { method: "POST" });
         if (res.ok) fetchData();
      } catch (err) {
         console.error("Failed to clear active signals", err);
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

   const handleMarkHandRaisedAttendance = async () => {
      const approvedInterns = interns.filter(i => i.isApproved);
      if (approvedInterns.length === 0) return;

      setMarkingId("all");
      try {
         await Promise.all(
            approvedInterns.map(intern => {
               const record = currentAttendance.find(a => a.userId === intern.id);
               const status = intern.handRaised ? "PRESENT" : "ABSENT";
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
         console.error("Selective protocol failure");
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
               toolsUsed: scheduleData.toolsUsed.split(",").map((s: any) => s.trim()).filter((s: any) => s !== ""),
               deploymentTools: scheduleData.deploymentTools.split(",").map((s: any) => s.trim()).filter((s: any) => s !== ""),
               requirements: scheduleData.requirements.split("\n").map((s: any) => s.trim()).filter((s: any) => s !== ""),
               outcomes: scheduleData.outcomes.split("\n").map((s: any) => s.trim()).filter((s: any) => s !== "")
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
               batch: "Batch 1",
               teamAllocation: "",
               mentorName: "",
               projectName: "",
               projectDocLink: "",
               teamLead: "",
               teamInternIds: []
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
         {/* Mobile Nav Top Bar - Clean Sync */}
         <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white z-[60] flex items-center justify-between px-6 pt-[env(safe-area-inset-top)] box-content border-b border-zinc-100 shadow-sm group">
            <div className="flex items-center gap-3">
               <img src="/sf-next-logo.png" alt="Student Forge" className="h-6 object-contain" />
            </div>
            <button
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               className="text-zinc-400 p-2"
            >
               {isMobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
            </button>
         </div>

         {/* Mobile Menu Overlay - High-Density Sync */}
         <AnimatePresence>
            {isMobileMenuOpen && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="md:hidden fixed inset-0 bg-white z-[55] pt-24 px-6 overflow-y-auto pb-20"
               >
                  <div className="grid grid-cols-2 gap-3">
                     {[
                        { id: "overview", icon: LayoutDashboard, label: "Overview" },
                        { id: "interns", icon: Users, label: "Interns" },
                        { id: "schedule", icon: Calendar, label: "Dispatch Schedule" },
                        { id: "manage_schedules", icon: Settings, label: "Manage Schedules" },
                        { id: "internships", icon: Briefcase, label: "Internships" },
                        { id: "assign", icon: Send, label: "Assign Task" },
                        { id: "certification", icon: FileBadge, label: "Certificates" },
                        { id: "authorizations", icon: ShieldCheck, label: "Approvals" },
                        { id: "mentorship", icon: Users, label: "Mentorship" },
                        { id: "schedule", icon: Calendar, label: "Schedule" },
                        { id: "hiring", icon: Briefcase, label: "Hiring" },
                        { id: "submissions", icon: ExternalLink, label: "Submissions" },
                        { id: "events", icon: LayoutDashboard, label: "Events" },
                        { id: "ideas", icon: Globe, label: "Ideas" },
                        { id: "attendance", icon: CalendarCheck, label: "Attendance" },
                        { id: "history", icon: History, label: "Logbook" }
                     ].map((item) => (
                        <button
                           key={item.id}
                           onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                           className={`h-24 border flex flex-col items-center justify-center gap-3 transition-all ${activeTab === item.id
                                 ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                                 : "bg-zinc-50 border-zinc-100 text-zinc-500"
                              }`}
                        >
                           <item.icon size={20} />
                           <span className="text-[11px] font-bold text-center tracking-tight">{item.label}</span>
                        </button>
                     ))}
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Desktop Sidebar - Grey Sync */}
         <aside className="hidden md:flex fixed left-0 top-0 h-full w-20 lg:w-[260px] bg-zinc-50 border-r border-zinc-200 z-50 flex-col pt-[env(safe-area-inset-top)]">
            <div className="p-8 pb-4 flex items-center justify-center lg:justify-start">
               <img src="/sf-next-logo.png" alt="Student Forge" className="h-8 object-contain hidden lg:block drop-shadow-sm" />
               <img src="/sf-next-logo.png" alt="Student Forge" className="h-6 w-6 object-cover lg:hidden rounded-sm" />
            </div>

            <nav className="flex-1 mt-6 px-3 overflow-y-auto space-y-4 custom-scrollbar pb-8">
               
               <details open className="group">
                  <summary className="hidden lg:flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-3 py-2 cursor-pointer hover:text-zinc-600 transition-colors select-none list-none [&::-webkit-details-marker]:hidden">
                     Operations
                     <ChevronDown size={14} className="group-open:rotate-180 transition-transform text-zinc-400" />
                  </summary>
                  <div className="mt-1 space-y-0.5 ml-2 border-l border-zinc-200 pl-2">
                     {[
                       { id: "overview", icon: LayoutDashboard, label: "Overview" },
                       { id: "events", icon: LayoutDashboard, label: "Events" },
                       { id: "workshop", icon: FileText, label: "Workshops" },
                       { id: "ideas", icon: Globe, label: "Ideas" }
                     ].map((item) => (
                       <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full h-9 flex items-center px-3 gap-3 transition-all rounded-md ${activeTab === item.id
                                ? "bg-white border border-zinc-200 shadow-sm text-blue-600"
                                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/80"
                             }`}
                       >
                          <item.icon size={15} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                          <span className={`hidden lg:block text-[12px] ${activeTab === item.id ? "font-bold" : "font-medium"}`}>{item.label}</span>
                       </button>
                     ))}
                  </div>
               </details>

               <details open className="group">
                  <summary className="hidden lg:flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-3 py-2 cursor-pointer hover:text-zinc-600 transition-colors select-none list-none [&::-webkit-details-marker]:hidden">
                     Interns & Approvals
                     <ChevronDown size={14} className="group-open:rotate-180 transition-transform text-zinc-400" />
                  </summary>
                  <div className="mt-1 space-y-0.5 ml-2 border-l border-zinc-200 pl-2">
                     {[
                       { id: "interns", icon: Users, label: "Interns" },
                       { id: "authorizations", icon: ShieldCheck, label: "Approvals" },
                       { id: "internships", icon: Briefcase, label: "Internships" },
                       { id: "certification", icon: FileBadge, label: "Certificates" },
                       { id: "attendance", icon: CalendarCheck, label: "Attendance" },
                     ].map((item) => (
                       <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full h-9 flex items-center px-3 gap-3 transition-all rounded-md ${activeTab === item.id
                                ? "bg-white border border-zinc-200 shadow-sm text-blue-600"
                                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/80"
                             }`}
                       >
                          <item.icon size={15} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                          <span className={`hidden lg:block text-[12px] ${activeTab === item.id ? "font-bold" : "font-medium"}`}>{item.label}</span>
                       </button>
                     ))}
                  </div>
               </details>

               <details open className="group">
                  <summary className="hidden lg:flex items-center justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-widest px-3 py-2 cursor-pointer hover:text-zinc-600 transition-colors select-none list-none [&::-webkit-details-marker]:hidden">
                     Tasks & Status
                     <ChevronDown size={14} className="group-open:rotate-180 transition-transform text-zinc-400" />
                  </summary>
                  <div className="mt-1 space-y-0.5 ml-2 border-l border-zinc-200 pl-2">
                     {[
                       { id: "schedule", icon: Calendar, label: "Dispatch Schedule" },
                       { id: "manage_schedules", icon: Settings, label: "Manage Schedules" },
                       { id: "assign", icon: Send, label: "Assign Task" },
                       { id: "submissions", icon: ExternalLink, label: "Submissions" },
                       { id: "mentorship", icon: Users, label: "Mentorship" },
                       { id: "history", icon: History, label: "Logbook" }
                     ].map((item) => (
                       <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full h-9 flex items-center px-3 gap-3 transition-all rounded-md ${activeTab === item.id
                                ? "bg-white border border-zinc-200 shadow-sm text-blue-600"
                                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/80"
                             }`}
                       >
                          <item.icon size={15} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                          <span className={`hidden lg:block text-[12px] ${activeTab === item.id ? "font-bold" : "font-medium"}`}>{item.label}</span>
                       </button>
                     ))}
                  </div>
               </details>

            </nav>

            {raisedHandsCount > 0 && (
               <div className="p-4 mx-4 mb-6 bg-amber-100 border border-amber-200 rounded-md animate-pulse lg:block hidden cursor-pointer shadow-sm" onClick={() => setActiveTab("interns")}>
                  <div className="flex items-center gap-2 text-amber-600">
                     <Hand size={16} />
                     <span className="text-[12px] font-bold leading-none">
                        {raisedHandsCount} Raised Hands
                     </span>
                  </div>
               </div>
            )}

            <div className="p-5 border-t border-zinc-200">
               <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-zinc-200 flex items-center justify-center text-zinc-600 rounded-md">
                     <Users size={16} />
                  </div>
                  <div className="hidden lg:block text-left overflow-hidden">
                     <p className="text-[12px] text-zinc-900 font-bold truncate">Dashboard Admin</p>
                     <p className="text-[10px] text-zinc-500 truncate uppercase tracking-widest">Operator</p>
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
                     {activeTab === "internships" ? "Internship Oversight" : activeTab === "interns" ? "Interns" : activeTab === "assign" ? "Allocations" : activeTab === "certification" ? "Certifications" : activeTab === "authorizations" ? "Authorizations" : activeTab === "mentorship" ? "Mentorship" : activeTab === "schedule" ? "Schedule" : activeTab === "hiring" ? "Hiring Registry" : activeTab === "submissions" ? "Submissions" : activeTab === "events" ? "Events Index" : activeTab === "ideas" ? "Ideation Oversight" : activeTab === "attendance" ? "Attendance" : "Logbook"}
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
                                    <input required value={internshipData.title} onChange={(e) => setInternshipData({ ...internshipData, title: e.target.value })} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-[#0055FF]" placeholder="e.g., Full Stack Intern" />
                                 </div>
                                 <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-zinc-400">Company / Dept</label>
                                    <input required value={internshipData.company} onChange={(e) => setInternshipData({ ...internshipData, company: e.target.value })} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-[#0055FF]" placeholder="Cleed Digital" />
                                 </div>
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[10px] font-bold uppercase text-zinc-400">Professional Role</label>
                                 <input value={internshipData.role} onChange={(e) => setInternshipData({ ...internshipData, role: e.target.value })} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-[#0055FF]" placeholder="Technical / Creative / Mgmt" />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[10px] font-bold uppercase text-zinc-400">Brief Mission Description</label>
                                 <textarea required rows={3} value={internshipData.description} onChange={(e) => setInternshipData({ ...internshipData, description: e.target.value })} className="w-full bg-white border border-zinc-100 p-4 text-sm font-bold outline-none focus:border-[#0055FF] resize-none" placeholder="What will they learn?" />
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                 <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-zinc-400">Location</label>
                                    <input value={internshipData.location} onChange={(e) => setInternshipData({ ...internshipData, location: e.target.value })} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-[#0055FF]" placeholder="Remote" />
                                 </div>
                                 <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-zinc-400">Duration</label>
                                    <input value={internshipData.duration} onChange={(e) => setInternshipData({ ...internshipData, duration: e.target.value })} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-[#0055FF]" placeholder="3 Months" />
                                 </div>
                                 <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-zinc-400">Stipend</label>
                                    <input value={internshipData.stipend} onChange={(e) => setInternshipData({ ...internshipData, stipend: e.target.value })} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-[#0055FF]" placeholder="Unpaid/Perf-based" />
                                 </div>
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[10px] font-bold uppercase text-zinc-400">Application Link (Mandatory)</label>
                                 <input required value={internshipData.applyLink} onChange={(e) => setInternshipData({ ...internshipData, applyLink: e.target.value })} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-red-500" placeholder="https://..." />
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
                  <div className="space-y-10">
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Soft Color Cards */}
                        <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-lg shadow-sm group text-left transition-all hover:bg-blue-50">
                           <div className="flex items-center justify-between mb-3">
                              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-none">Interns</p>
                              <Users size={14} className="text-blue-400" />
                           </div>
                           <div className="flex items-baseline gap-2">
                              <h3 className="text-3xl font-bold tracking-tight text-blue-900">{interns.length}</h3>
                           </div>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-lg shadow-sm group text-left transition-all hover:bg-emerald-50">
                           <div className="flex items-center justify-between mb-3">
                              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none">Live presence</p>
                              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                           </div>
                           <div className="flex items-baseline gap-2">
                              <h3 className="text-3xl font-bold tracking-tight text-emerald-900">{onlineInternsCount}</h3>
                           </div>
                        </div>

                        <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-lg shadow-sm group text-left transition-all hover:bg-amber-50">
                           <div className="flex items-center justify-between mb-3">
                              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest leading-none">Pending Auth</p>
                              <ShieldCheck size={14} className="text-amber-400" />
                           </div>
                           <div className="flex items-baseline gap-2">
                              <h3 className="text-3xl font-bold tracking-tight text-amber-900">{interns.filter(i => !i.isApproved).length}</h3>
                           </div>
                        </div>

                        <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-lg shadow-sm group text-left transition-all hover:bg-indigo-50">
                           <div className="flex items-center justify-between mb-3">
                              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none">Submissions</p>
                              <CheckCircle2 size={14} className="text-indigo-400" />
                           </div>
                           <div className="flex items-baseline gap-2">
                              <h3 className="text-3xl font-bold tracking-tight text-indigo-900">{submissions.length}</h3>
                           </div>
                        </div>

                        <div className="bg-purple-50/50 border border-purple-100 p-5 rounded-lg shadow-sm group text-left transition-all hover:bg-purple-50">
                           <div className="space-y-4">
                              <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest leading-none">Hiring Applications</p>
                              <div className="flex items-end justify-between">
                              <h3 className="text-3xl font-bold tracking-tight text-purple-900">{hiringApplications.length}</h3>
                              <Briefcase className="text-purple-200" size={32} strokeWidth={1} />
                              </div>
                           </div>
                        </div>

                        <div className="bg-rose-50/50 border border-rose-100 p-5 rounded-lg shadow-sm group text-left transition-all hover:bg-rose-50">
                           <div className="flex items-center justify-between mb-3">
                              <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest leading-none">Mentorships</p>
                              <Users size={14} className="text-rose-400" />
                           </div>
                           <div className="flex items-baseline gap-2">
                              <h3 className="text-3xl font-bold tracking-tight text-rose-900">{mentorshipSessions.length}</h3>
                           </div>
                        </div>

                        <div className="bg-sky-50/50 border border-sky-100 p-5 rounded-lg shadow-sm group text-left transition-all hover:bg-sky-50">
                           <div className="flex items-center justify-between mb-3">
                              <p className="text-[10px] font-bold text-sky-600 uppercase tracking-widest leading-none">Internships</p>
                              <Briefcase size={14} className="text-sky-400" />
                           </div>
                           <div className="flex items-baseline gap-2">
                              <h3 className="text-3xl font-bold tracking-tight text-sky-900">{internships.length}</h3>
                           </div>
                        </div>

                        <div className="bg-teal-50/50 border border-teal-100 p-5 rounded-lg shadow-sm group text-left transition-all hover:bg-teal-50">
                           <div className="flex items-center justify-between mb-3">
                              <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest leading-none">Ideas Logged</p>
                              <Globe size={14} className="text-teal-400" />
                           </div>
                           <div className="flex items-baseline gap-2">
                              <h3 className="text-3xl font-bold tracking-tight text-teal-900">{ideas.length}</h3>
                           </div>
                        </div>
                     </div>

                     <div className="grid md:grid-cols-2 gap-12 text-left">
                        <div className="space-y-4">
                           <h2 className="text-sm font-bold border-l-2 border-zinc-900 pl-3 uppercase tracking-tighter">Command central</h2>
                           <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {[
                                 { id: "interns", label: "Registry" },
                                 { id: "internships", label: "Oversight" },
                                 { id: "assign", label: "Dispatch" },
                                 { id: "submissions", label: "Audits" },
                                 { id: "schedule", label: "Cycles" },
                                 { id: "attendance", label: "Presence" }
                              ].map((action) => (
                                 <button 
                                   key={action.id}
                                   onClick={() => setActiveTab(action.id)} 
                                   className="h-16 border border-zinc-200 hover:border-[#0055FF] p-3 rounded-md text-left transition-all bg-white group shadow-sm"
                                 >
                                    <p className="text-[9px] font-bold text-zinc-400 uppercase mb-0.5">Terminal</p>
                                    <span className="text-xs font-bold group-hover:text-[#0055FF]">{action.label}</span>
                                 </button>
                              ))}
                           </div>
                        </div>
                        <div className="space-y-4">
                           <h2 className="text-sm font-bold border-l-2 border-zinc-900 pl-3 uppercase tracking-tighter">Telemetry pulse</h2>
                           <div className="p-4 bg-white border border-zinc-200 rounded-md font-mono text-[9px] space-y-1.5 uppercase tracking-widest shadow-sm">
                              <div className="flex items-center justify-between py-1 border-b border-zinc-50"><span className="text-zinc-500">Database node</span> <span className="text-emerald-500 font-bold">Stable</span></div>
                              <div className="flex items-center justify-between py-1 border-b border-zinc-50"><span className="text-zinc-500">Intern sync</span> <span className="text-emerald-500 font-bold">{interns.length} Units</span></div>
                              <div className="flex items-center justify-between py-1 border-b border-zinc-50"><span className="text-zinc-500">Opportunity index</span> <span className="text-[#0055FF] font-bold">{internships.length} Missions</span></div>
                              <div className="flex items-center justify-between py-1 border-b border-zinc-50"><span className="text-zinc-500">Pending audits</span> <span className="text-amber-500 font-bold">{submissions.length} Nodes</span></div>
                              <div className="flex items-center justify-between py-1"><span className="text-zinc-500">Ideation assets</span> <span className="text-zinc-900 font-bold">{ideas.length} Assets</span></div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* Intern Registry Tab - High-Fidelity Audit Terminal */}
               {activeTab === "interns" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                     <div className="bg-white border border-zinc-100 shadow-sm p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                           <div className="space-y-1">
                              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 line-clamp-1">Interns</h2>
                              <p className="text-[13px] text-zinc-500 font-medium">Verify and authorize interns from this page.</p>
                           </div>
                           <div className="flex items-center gap-3">
                              {raisedHandsCount > 0 && (
                                 <button 
                                    onClick={handleLowerAllSignals}
                                    className="bg-zinc-900 hover:bg-black text-white px-3 py-1.5 text-[11px] font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer rounded-sm active:scale-95"
                                 >
                                    <Hand size={12} className="opacity-70" /> Lower All Hands
                                 </button>
                              )}
                              <div className="bg-blue-50 text-blue-600 px-3 py-1.5 text-[11px] font-bold border border-blue-100">
                                 {interns.filter(i => i.isApproved).length} Authorized
                              </div>
                              <div className="bg-amber-50 text-amber-600 px-3 py-1.5 text-[11px] font-bold border border-amber-100">
                                 {interns.filter(i => !i.isApproved).length} Pending
                              </div>
                           </div>
                        </div>

                        <div className="overflow-x-auto -mx-8">
                           <table className="w-full text-left border-collapse">
                              <thead>
                                 <tr className="border-b border-zinc-100 bg-zinc-50/50">
                                    <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-left">Identity</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-left">Academic Context</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-left">Protocol Status</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-50">
                                 {interns.length === 0 ? (
                                    <tr>
                                       <td colSpan={4} className="px-8 py-20 text-center text-zinc-400 text-sm italic">No intern records synchronized from the database hub.</td>
                                    </tr>
                                 ) : (
                                    [...interns].sort((a,b) => (b.handRaised ? 1 : 0) - (a.handRaised ? 1 : 0)).map((intern) => (
                                       <tr key={intern.id} className={`transition-colors ${intern.handRaised ? "bg-amber-500/5 hover:bg-amber-500/10 border-l-2 border-amber-500" : "hover:bg-zinc-50/50 border-l-2 border-transparent"}`}>
                                          <td className="px-8 py-5">
                                             <div className="flex items-center gap-4">
                                                <div className={`h-9 w-9 text-white flex items-center justify-center text-[12px] font-bold ${intern.handRaised ? "bg-amber-500" : "bg-zinc-900"}`}>
                                                   {intern.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                   <div className="flex items-center gap-2">
                                                      <span className="text-[14px] font-bold text-zinc-900">{intern.name}</span>
                                                      {intern.handRaised && (
                                                         <span className="text-amber-500 flex items-center" title="Signal Active">
                                                            <Hand size={14} className="animate-pulse" />
                                                         </span>
                                                      )}
                                                      {intern.letterUrl && (
                                                         <span className="bg-blue-600/10 text-blue-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-tighter">
                                                            <CheckCircle2 size={10} strokeWidth={3} /> Certified
                                                         </span>
                                                      )}
                                                   </div>
                                                   <span className="text-[11px] text-zinc-400">{intern.email}</span>
                                                </div>
                                             </div>
                                          </td>
                                          <td className="px-6 py-5">
                                             <div className="flex flex-col">
                                                <p className="text-[12px] font-bold text-zinc-600">{intern.college || 'Domain not given'}</p>
                                                <p className="text-[11px] text-zinc-400">{intern.branch || 'Branch N/A'}</p>
                                             </div>
                                          </td>
                                          <td className="px-6 py-5">
                                             <div className="flex items-center gap-2">
                                                <div className={`h-1.5 w-1.5 rounded-full ${intern.isApproved ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                                                <span className={`text-[11px] font-bold ${intern.isApproved ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                   {intern.isApproved ? 'Authorized' : 'Pending auth'}
                                                </span>
                                             </div>
                                          </td>
                                          <td className="px-8 py-5 text-right">
                                             <div className="flex items-center justify-end gap-2">
                                                {!intern.isApproved ? (
                                                   <button 
                                                      onClick={() => handleApprove(intern.id)}
                                                      disabled={isAuthorizing === intern.id}
                                                      className="h-8 px-4 bg-blue-600 text-white text-[10px] font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                                                   >
                                                      {isAuthorizing === intern.id ? "..." : "Authorize"}
                                                   </button>
                                                ) : (
                                                   <div className="flex items-center gap-1.5">
                                                      {intern.githubLink && (
                                                         <a href={intern.githubLink} target="_blank" className="p-1.5 border border-zinc-100 text-zinc-400 hover:text-zinc-900 transition-all">
                                                            <Github size={12} />
                                                         </a>
                                                      )}
                                                      <button className="p-1.5 border border-zinc-100 text-zinc-400 hover:text-blue-600 transition-all">
                                                         <Mail size={12} />
                                                      </button>
                                                   </div>
                                                )}
                                                <button 
                                                   onClick={() => handleDeleteIntern(intern.id)}
                                                   className="p-1.5 border border-zinc-100 text-zinc-400 hover:text-red-500 transition-all ml-1"
                                                   title="Delete Intern"
                                                >
                                                   <Trash2 size={12} />
                                                </button>
                                             </div>
                                          </td>
                                       </tr>
                                    ))
                                 )}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </motion.div>
               )}
               {/* Dispatch Task - High-Speed Allocation Terminal */}
               {activeTab === "assign" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                     <div className="max-w-2xl bg-white border border-zinc-100 p-8">
                        <div className="space-y-2 mb-8">
                           <h2 className="text-2xl font-bold tracking-tight text-zinc-900 line-clamp-1">Dispatch task</h2>
                           <p className="text-[14px] text-zinc-500 font-medium">Allocate technical missions to authorized student identities.</p>
                        </div>
                        <form onSubmit={handlePostTask} className="space-y-6">
                           <div className="space-y-1">
                              <label className="text-[11px] font-bold text-zinc-400">Target identity</label>
                              <select 
                                 className="w-full h-11 bg-zinc-50 border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600"
                                 onChange={(e) => {
                                    const intern = interns.find(i => i.id === e.target.value);
                                    if (intern) setSelectedIntern(intern);
                                 }}
                              >
                                 <option value="">Select a student...</option>
                                 {interns.filter(i => i.isApproved).map(i => (
                                    <option key={i.id} value={i.id}>{i.name} ({i.email})</option>
                                 ))}
                              </select>
                           </div>
                           <div className="space-y-1">
                              <label className="text-[11px] font-bold text-zinc-400">Mission title</label>
                              <input required value={taskData.title} onChange={(e) => setTaskData({ ...taskData, title: e.target.value })} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600" placeholder="e.g., Database Schema Synchronization" />
                           </div>
                           <div className="space-y-1">
                              <label className="text-[11px] font-bold text-zinc-400">Mission parameters</label>
                              <textarea required rows={4} value={taskData.description} onChange={(e) => setTaskData({ ...taskData, description: e.target.value })} className="w-full bg-white border border-zinc-100 p-4 text-sm font-bold outline-none focus:border-blue-600 resize-none" placeholder="Detail the technical requirements..." />
                           </div>
                           <button disabled={sendingTask || !selectedIntern} className="w-full h-14 bg-zinc-900 text-white text-[13px] font-bold hover:bg-blue-600 transition-all disabled:opacity-50">
                              {sendingTask ? "Dispatching mission..." : "Initiate dispatch"}
                           </button>
                           {formSuccess && <p className="text-emerald-600 text-[11px] font-bold text-center">Mission synchronized successfully.</p>}
                        </form>
                     </div>
                  </motion.div>
               )}

               {/* Issuance Hub - Professional Certification node */}
               {activeTab === "certification" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                        {/* Offer Letter */}
                        <div className="max-w-2xl mx-auto bg-white border border-zinc-100 p-8">
                           <div className="space-y-2 mb-8">
                              <h2 className="text-xl font-bold tracking-tight text-zinc-900 line-clamp-1">Offer letter issuance</h2>
                              <p className="text-[12px] text-zinc-500 font-medium">Dispatch official offer documents to newly onboarded interns. This will also send an automated notification email.</p>
                           </div>
                           <form onSubmit={handleSendOfferLetter} className="space-y-6">
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400">Target intern</label>
                                 <select 
                                    className="w-full h-11 bg-zinc-50 border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600"
                                    onChange={(e) => {
                                       const intern = interns.find(i => i.id === e.target.value);
                                       if (intern) setSelectedIntern(intern);
                                    }}
                                 >
                                    <option value="">Select a student...</option>
                                    {interns.filter(i => i.isApproved).map(i => (
                                       <option key={i.id} value={i.id}>
                                          {i.name} {i.offerLetterUrl ? "✓ Offer Issued" : ""}
                                       </option>
                                    ))}
                                 </select>
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400">Document link (PDF/Image)</label>
                                 <input required value={offerLetterUrl} onChange={(e) => setOfferLetterUrl(e.target.value)} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600" placeholder="https://res.cloudinary.com/..." />
                              </div>
                              <button disabled={sendingOfferLetter || !selectedIntern} className="w-full h-14 bg-zinc-900 text-white text-[13px] font-bold hover:bg-blue-600 transition-all disabled:opacity-50">
                                 {sendingOfferLetter ? "Dispatching offer..." : "Issue offer letter"}
                              </button>
                           </form>
                        </div>
                  </motion.div>
               )}

               <AnimatePresence>
                  {offerLetterSuccess && (
                     <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white max-w-[320px] w-full p-8 border border-zinc-100 shadow-2xl text-center relative">
                           <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
                              <Check size={24} />
                           </div>
                           <h3 className="text-sm font-bold text-zinc-900 mb-2">Offer Dispatch Successful</h3>
                           <p className="text-[11px] text-zinc-500 font-medium mb-6">Internship offer has been synchronized with the student's dashboard and notification email dispatched.</p>
                           <button onClick={() => setOfferLetterSuccess(false)} className="w-full h-11 bg-zinc-900 text-white text-[11px] font-bold hover:bg-black transition-all">Dismiss Protocol</button>
                        </motion.div>
                     </div>
                  )}
               </AnimatePresence>

               {/* Mentorship Sessions - Professional Guidance registry */}
               {activeTab === "mentorship" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-left">
                     <div className="bg-white border border-zinc-100 p-8">
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 line-clamp-1 mb-8">Mentorship sessions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {mentorshipSessions.length === 0 ? (
                              <p className="col-span-full text-zinc-400 text-sm italic py-10 text-center">No scheduled sessions synchronized.</p>
                           ) : (
                              mentorshipSessions.map((session) => (
                                 <div key={session.id} className="p-6 border border-zinc-100 bg-zinc-50/50 hover:border-blue-600/20 transition-all group">
                                    <div className="flex items-center justify-between mb-4">
                                       <div className="h-2 w-2 rounded-full bg-blue-500" />
                                       <span className="text-[10px] font-bold text-zinc-400">{new Date(session.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-zinc-900 mb-1">{session.topic}</h4>
                                    <p className="text-[12px] text-zinc-500 font-medium mb-4">{session.name}</p>
                                    <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                                       <span className="text-[11px] font-bold text-blue-600">{session.date} at {session.time}</span>
                                       <span className="text-[10px] px-2 py-0.5 bg-white border border-zinc-100 text-zinc-400 font-bold uppercase">{session.status}</span>
                                    </div>
                                 </div>
                              ))
                           )}
                        </div>
                     </div>
                  </motion.div>
               )}

               {/* Authorizations Tab */}
               {activeTab === "authorizations" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                     <div className="bg-white border border-zinc-100 shadow-sm p-8 text-left">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                           <div className="space-y-1">
                              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 line-clamp-1">Validation Queue</h2>
                              <p className="text-[13px] text-zinc-500 font-medium">Authorize or reject incoming intern identities.</p>
                           </div>
                           <div className="bg-amber-50 text-amber-600 px-3 py-1.5 text-[11px] font-bold border border-amber-100 uppercase tracking-widest hidden sm:block">
                              {interns.filter(i => !i.isApproved).length} Pending
                           </div>
                        </div>

                        <div className="overflow-x-auto">
                           <table className="w-full text-left border-collapse">
                              <thead>
                                 <tr className="border-b border-zinc-100 bg-zinc-50/50">
                                    <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-left">Applicant Node</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-left">Connectivity Path</th>
                                    <th className="px-8 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Approval Protocol</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-50">
                                 {interns.filter(i => !i.isApproved).length === 0 ? (
                                    <tr>
                                       <td colSpan={3} className="px-8 py-20 text-center text-zinc-400 text-sm italic">All validation queues clear. Zero pending nodes.</td>
                                    </tr>
                                 ) : (
                                    interns.filter(i => !i.isApproved).map((intern) => (
                                       <tr key={intern.id} className="hover:bg-zinc-50/50 transition-colors group">
                                          <td className="px-8 py-5">
                                             <div className="flex items-center gap-4">
                                                <div className="h-9 w-9 bg-zinc-900 text-white flex items-center justify-center text-[12px] font-bold group-hover:bg-[#0055FF] transition-colors">
                                                   {intern.name?.charAt(0) || "U"}
                                                </div>
                                                <div className="flex flex-col">
                                                   <span className="text-[14px] font-bold text-zinc-900">{intern.name}</span>
                                                   <span className="text-[11px] text-zinc-400">Branch: {intern.branch || "N/A"}</span>
                                                </div>
                                             </div>
                                          </td>
                                          <td className="px-6 py-5">
                                             <div className="flex flex-col">
                                                <p className="text-[12px] font-bold text-zinc-600">{intern.email}</p>
                                                <p className="text-[11px] text-zinc-400">{intern.college || "N/A"}</p>
                                             </div>
                                          </td>
                                          <td className="px-8 py-5 text-right">
                                             <button 
                                                onClick={() => handleApprove(intern.id)}
                                                disabled={isAuthorizing === intern.id}
                                                className="h-8 px-5 bg-black text-white text-[11px] font-bold hover:bg-emerald-600 transition-all disabled:opacity-50 uppercase tracking-widest"
                                             >
                                                {isAuthorizing === intern.id ? "Validating..." : "Validate Access"}
                                             </button>
                                          </td>
                                       </tr>
                                    ))
                                 )}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </motion.div>
               )}

               {/* Schedule Dispatch - Weekly mission protocol */}
               {activeTab === "schedule" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                     <div className="max-w-4xl bg-white border border-zinc-100 p-8 text-left">
                        <div className="space-y-2 mb-10">
                           <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Schedule dispatch</h2>
                           <p className="text-[14px] text-zinc-500">Configure and synchronize the upcoming technical mission cycle.</p>
                        </div>
                        <form onSubmit={handlePostSchedule} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                           <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">Target Allocation</label>
                                    <select required value={scheduleData.batch} onChange={(e) => setScheduleData({ ...scheduleData, batch: e.target.value })} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600 appearance-none">
                                       <option value="Batch 1">Batch 1</option>
                                       <option value="Batch 2">Batch 2</option>
                                    </select>
                                 </div>
                                 <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">Mission Node (Week No)</label>
                                    <input required value={scheduleData.week} onChange={(e) => setScheduleData({ ...scheduleData, week: e.target.value })} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600" placeholder="Week 04" />
                                 </div>
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">Mission Category</label>
                                 <input required value={scheduleData.typeOfWork} onChange={(e) => setScheduleData({ ...scheduleData, typeOfWork: e.target.value })} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600" placeholder="Backend Scaling / UI Architecture" />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">Mission Parameters (Tools)</label>
                                 <input required value={scheduleData.toolsUsed} onChange={(e) => setScheduleData({ ...scheduleData, toolsUsed: e.target.value })} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600" placeholder="React, Node.js, Prisma" />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">Deployment Node (Tools)</label>
                                 <input required value={scheduleData.deploymentTools} onChange={(e) => setScheduleData({ ...scheduleData, deploymentTools: e.target.value })} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600" placeholder="Vercel, AWS, Docker" />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">Final Deadline Node</label>
                                 <input required type="date" value={scheduleData.deadline} onChange={(e) => setScheduleData({ ...scheduleData, deadline: e.target.value })} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600" />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">Team Numbers (csv)</label>
                                 <input required value={scheduleData.teamAllocation} onChange={(e) => setScheduleData({ ...scheduleData, teamAllocation: e.target.value })} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600" placeholder="Team 1, Team 2..." />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">Assigned Mentor</label>
                                 <input required value={scheduleData.mentorName} onChange={(e) => setScheduleData({ ...scheduleData, mentorName: e.target.value })} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600" placeholder="Assigned Mentor Name" />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">Project Name</label>
                                 <input required value={scheduleData.projectName} onChange={(e) => setScheduleData({ ...scheduleData, projectName: e.target.value })} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600" placeholder="Enter project title" />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">Project Doc Link</label>
                                 <input required value={scheduleData.projectDocLink} onChange={(e) => setScheduleData({ ...scheduleData, projectDocLink: e.target.value })} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600" placeholder="https://..." />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">Team Lead (Optional)</label>
                                 <input value={scheduleData.teamLead} onChange={(e) => setScheduleData({ ...scheduleData, teamLead: e.target.value })} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600" placeholder="Designated lead" />
                              </div>
                           </div>
                           <div className="space-y-6">
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">Mission Overview</label>
                                 <textarea required rows={3} value={scheduleData.description} onChange={(e) => setScheduleData({ ...scheduleData, description: e.target.value })} className="w-full bg-white border border-zinc-100 p-4 text-sm font-bold outline-none focus:border-blue-600 resize-none" placeholder="Provide a centralized breakdown of the overarching goal..." />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">Technical Requirements (Per Line)</label>
                                 <textarea required rows={3} value={scheduleData.requirements} onChange={(e) => setScheduleData({ ...scheduleData, requirements: e.target.value })} className="w-full bg-white border border-zinc-100 p-4 text-sm font-bold outline-none focus:border-blue-600 resize-none" placeholder="1. Database optimization&#10;2. API endpoint scaling" />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">Expected Outcomes (Per Line)</label>
                                 <textarea required rows={3} value={scheduleData.outcomes} onChange={(e) => setScheduleData({ ...scheduleData, outcomes: e.target.value })} className="w-full bg-white border border-zinc-100 p-4 text-sm font-bold outline-none focus:border-blue-600 resize-none" placeholder="1. 200ms API latency&#10;2. Flawless UI rendering" />
                              </div>
                              <div className="pt-2">
                                 <button disabled={sendingSchedule} className="w-full h-14 bg-zinc-900 text-white text-[13px] font-bold hover:bg-blue-600 transition-all">
                                    {sendingSchedule ? "Synchronizing cycle..." : "Confirm & dispatch cycle"}
                                 </button>
                                 {scheduleSuccess && <p className="text-emerald-600 text-[11px] font-bold text-center mt-4">Mission cycle synchronized.</p>}
                              </div>
                           </div>

                           <div className="lg:col-span-2 pt-10 border-t border-zinc-100 mt-10">
                              <div className="flex items-center justify-between mb-6">
                                 <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter block">Select team interns (Form Team)</label>
                                 <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Filter by:</span>
                                    <select 
                                       value={internBatchFilter} 
                                       onChange={(e) => setInternBatchFilter(e.target.value)}
                                       className="h-8 bg-zinc-50 border border-zinc-100 px-3 text-[10px] font-bold outline-none focus:border-blue-600 rounded uppercase tracking-widest cursor-pointer"
                                    >
                                       <option value="All">All Batches</option>
                                       <option value="Batch 1">Batch 1 Only</option>
                                       <option value="Batch 2">Batch 2 Only</option>
                                    </select>
                                 </div>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[300px] overflow-y-auto p-4 bg-zinc-50 border border-zinc-100 rounded">
                                 {interns
                                    .filter(i => i.isApproved)
                                    .filter(i => internBatchFilter === "All" || i.batch === internBatchFilter)
                                    .map((intern: any) => (
                                    <label key={intern.id} className={`flex flex-col p-4 border transition-all cursor-pointer rounded relative ${scheduleData.teamInternIds.includes(intern.id) ? 'bg-zinc-900 border-zinc-900 shadow-md' : 'bg-white border-zinc-100 hover:border-blue-200'}`}>
                                       <input 
                                          type="checkbox" 
                                          checked={scheduleData.teamInternIds.includes(intern.id)}
                                          onChange={(e) => {
                                             const ids = e.target.checked 
                                                ? [...scheduleData.teamInternIds, intern.id]
                                                : scheduleData.teamInternIds.filter((id: any) => id !== intern.id);
                                             setScheduleData({ ...scheduleData, teamInternIds: ids });
                                          }}
                                          className="absolute top-2 right-2 h-3 w-3 accent-blue-600 cursor-pointer"
                                       />
                                       <p className={`text-[11px] font-bold truncate pr-3 ${scheduleData.teamInternIds.includes(intern.id) ? 'text-white' : 'text-zinc-900'}`}>{intern.name}</p>
                                    </label>
                                 ))}
                              </div>
                           </div>
                        </form>
                     </div>
                  </motion.div>
               )}

               {/* Hiring Applications Registry Hub */}
               {activeTab === "hiring" && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                     <div className="bg-white border border-zinc-100 p-8 md:p-12 shadow-sm relative overflow-hidden text-left text-zinc-900 selection:bg-black selection:text-white">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 relative z-10">
                           <div className="space-y-2">
                              <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Hiring registry</h2>
                              <p className="text-[14px] text-zinc-500 font-medium">Recruit talent efficiently. Total applicants: {hiringApplications.length}</p>
                           </div>
                           <button onClick={downloadHiringCsv} className="h-10 px-6 bg-zinc-900 text-white text-[11px] font-bold hover:bg-zinc-800 transition-all flex items-center gap-2">
                              <Download size={14} />
                              Export Hiring Index
                           </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                           {hiringApplications.length === 0 ? (
                              <div className="col-span-full py-32 text-center bg-zinc-50 border border-dashed border-zinc-200">
                                 <p className="text-[13px] text-zinc-400 font-bold uppercase tracking-widest">No candidates detected yet.</p>
                              </div>
                           ) : (
                              hiringApplications.map((app) => (
                                 <div key={app.id} className="bg-white border border-zinc-100 p-8 space-y-6 hover:border-blue-600 transition-all group shadow-sm bg-zinc-50/10">
                                    <div className="flex items-start justify-between">
                                       <div className="space-y-1">
                                          <h4 className="text-[16px] font-bold text-zinc-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{app.name}</h4>
                                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.1em]">{app.position}</p>
                                       </div>
                                       <span className={`text-[8px] font-black uppercase px-2 py-0.5 tracking-tighter ${app.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                          {app.status}
                                       </span>
                                    </div>
                                    
                                    <div className="space-y-4 pt-4 border-t border-zinc-50">
                                       <div className="flex items-center gap-3 text-zinc-500">
                                          <Mail size={14} strokeWidth={2.5} />
                                          <span className="text-[12px] font-bold lowercase">{app.email}</span>
                                       </div>
                                       <div className="flex items-center gap-3 text-zinc-500">
                                          <Phone size={14} strokeWidth={2.5} />
                                          <span className="text-[12px] font-bold">{app.phone}</span>
                                       </div>
                                       <div className="flex items-center gap-3">
                                          <Paperclip size={14} className="text-zinc-400" strokeWidth={2.5} />
                                          <a href={app.resumeLink} target="_blank" className="text-[10px] font-black text-zinc-900 hover:text-blue-600 uppercase tracking-widest flex items-center gap-2 border-b-2 border-zinc-100 group-hover:border-blue-600 transition-all">
                                             View Resume link
                                             <ExternalLink size={10} />
                                          </a>
                                       </div>
                                    </div>

                                    <div className="pt-4 flex items-center gap-2">
                                       <button className="h-9 px-4 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all w-full flex items-center justify-center gap-2">
                                          Update status
                                          <ChevronDown size={12} />
                                       </button>
                                       <button className="h-9 w-9 flex items-center justify-center border border-zinc-100 text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all">
                                          <Trash2 size={14} />
                                       </button>
                                    </div>
                                 </div>
                              ))
                           )}
                        </div>
                     </div>
                  </motion.div>
               )}

               {/* Intern Submissions Hub */}
               {activeTab === "submissions" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                     <div className="bg-white border border-zinc-100 p-8 text-left">
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-8">Intern submissions</h2>
                        {loadingSubmissions ? (
                           <div className="py-20 text-center text-zinc-400 animate-pulse">Syncing submission nodes...</div>
                        ) : submissions.length === 0 ? (
                           <p className="py-20 text-center text-zinc-400 text-sm italic">No missions submitted for audit.</p>
                        ) : (
                           <div className="grid grid-cols-1 gap-6">
                              {submissions.map((sub: any) => (
                               <div key={sub.id} className="p-6 bg-white border border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#0055FF]/20 transition-all rounded">
                                  <div className="flex flex-col min-w-[200px]">
                                     <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter mb-1">Student Identity</span>
                                     <h4 className="text-[14px] font-bold text-zinc-900">{sub.intern?.name || "Unknown Intern"}</h4>
                                     <p className="text-[11px] text-zinc-500">{sub.intern?.email}</p>
                                  </div>

                                  <div className="flex flex-col flex-1">
                                     <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter mb-1">Mission Protocol</span>
                                     <h4 className="text-[13px] font-bold text-zinc-900 truncate">{sub.schedule?.typeOfWork || "General Mission"}</h4>
                                     <p className="text-[11px] text-[#0055FF] font-medium italic mt-1">{sub.schedule?.projectName || "Internal Cycle"}</p>
                                  </div>

                                  <div className="flex items-center gap-6">
                                     <div className="flex flex-col h-11">
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight mb-1 font-mono">Repo</span>
                                        <a href={sub.githubLink} target="_blank" className="flex items-center gap-2 text-[12px] font-bold text-zinc-900 hover:text-[#0055FF]">
                                           <Github size={14} /> Repository
                                        </a>
                                     </div>
                                     <div className="flex flex-col h-11 border-l border-zinc-100 pl-6">
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight mb-1 font-mono">Manifest</span>
                                        <a href={sub.submissionLink} target="_blank" className="flex items-center gap-2 text-[12px] font-bold text-[#0055FF] hover:underline">
                                           <ExternalLink size={14} /> Portfolio Link
                                        </a>
                                     </div>
                                  </div>

                                  <div className="flex items-center gap-3 md:border-l md:border-zinc-100 md:pl-6">
                                     <button className="h-10 px-6 bg-zinc-900 text-white text-[11px] font-bold hover:bg-[#0055FF] transition-all flex items-center gap-2 rounded-sm">
                                        <CheckCircle2 size={14} /> Audit Synchronized
                                     </button>
                                  </div>
                               </div>
                              ))}
                           </div>
                        )}
                     </div>
                  </motion.div>
               )}

               {/* Events Manager Terminal */}
               {activeTab === "events" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                     <div className="grid lg:grid-cols-12 gap-12 text-left">
                        <div className="lg:col-span-12 space-y-8 bg-white border border-zinc-100 p-8">
                           <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                 <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Events manager</h2>
                                 <p className="text-zinc-500 text-[14px]">Document and synchronize technical anchors for the public portal.</p>
                              </div>
                           </div>
                           <form onSubmit={handlePostEvent} className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-zinc-50">
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400">Anchor title</label>
                                 <input required value={eventData.title} onChange={(e) => setEventData({ ...eventData, title: e.target.value })} className="w-full h-11 bg-zinc-50 border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600" placeholder="e.g., Code Forge 2026" />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400">Mission node (Category)</label>
                                 <select value={eventData.category} onChange={(e) => setEventData({ ...eventData, category: e.target.value })} className="w-full h-11 bg-zinc-50 border border-zinc-100 px-4 text-sm font-bold outline-none">
                                    <option>Industry Anchors</option>
                                    <option>Technical Workshops</option>
                                    <option>Hackathons</option>
                                    <option>Campus Vanguard</option>
                                 </select>
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400">Event date</label>
                                 <input required value={eventData.date} onChange={(e) => setEventData({ ...eventData, date: e.target.value })} className="w-full h-11 bg-zinc-50 border border-zinc-100 px-4 text-sm font-bold" placeholder="March 24, 2026" />
                              </div>
                              <div className="md:col-span-3 space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400">Brief narrative</label>
                                 <textarea required rows={2} value={eventData.description} onChange={(e) => setEventData({ ...eventData, description: e.target.value })} className="w-full bg-zinc-50 border border-zinc-100 p-4 text-sm font-bold outline-none focus:border-blue-600 resize-none" placeholder="Context and outcomes..." />
                              </div>
                              <div className="md:col-span-2 space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400">Visual identifier (URL)</label>
                                 <input value={eventData.image} onChange={(e) => setEventData({ ...eventData, image: e.target.value })} className="w-full h-11 bg-zinc-50 border border-zinc-100 px-4 text-sm font-bold" placeholder="https://..." />
                              </div>
                              <div className="flex items-end">
                                 <button disabled={sendingEvent} className="w-full h-11 bg-zinc-900 text-white text-[11px] font-bold uppercase hover:bg-blue-600 transition-all">
                                    {sendingEvent ? "Synchronizing..." : "Dispatch event"}
                                 </button>
                              </div>
                              {eventSuccess && <p className="md:col-span-3 text-emerald-600 text-[10px] font-bold uppercase text-center">Event synchronized successfully.</p>}
                           </form>
                           <div className="pt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              {events.map((ev) => (
                                 <div key={ev.id} className="p-4 border border-zinc-100 bg-white group hover:border-[#0055FF]/20 transition-all">
                                    <div className="flex items-center justify-between mb-2">
                                       <span className="text-[9px] font-bold text-blue-600 uppercase">{ev.category}</span>
                                       <button onClick={() => handleDeleteEvent(ev.id)} className="text-zinc-300 hover:text-red-500"><CloseIcon size={12} /></button>
                                    </div>
                                    <h4 className="text-[13px] font-bold text-zinc-900 mb-1 truncate">{ev.title}</h4>
                                    <p className="text-[10px] text-zinc-400 font-bold">{ev.date}</p>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </motion.div>
               )}

               {/* Ideation Control Terminal */}
               {activeTab === "ideas" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                     <div className="bg-white border border-zinc-100 p-8 text-left">
                        <div className="space-y-1 mb-10">
                           <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Ideation control</h2>
                           <p className="text-[13px] text-zinc-500">Neutralize or authorize student-submitted technology assets.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {ideas.map((idea) => (
                              <div key={idea.id} className={`p-6 border flex flex-col group transition-all relative ${idea.isApproved ? 'border-zinc-100 bg-white' : 'border-amber-200 bg-amber-50/10'}`}>
                                 <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                       <div className={`h-2 w-2 rounded-full ${idea.isApproved ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                       <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{idea.isApproved ? 'Authorized' : 'Pending'}</span>
                                    </div>
                                    <button onClick={() => handleDeleteIdea(idea.id)} className="text-zinc-300 hover:text-red-500 transition-all"><CloseIcon size={14} /></button>
                                 </div>
                                 <h4 className="text-sm font-bold text-zinc-900 mb-1">{idea.title}</h4>
                                 <p className="text-[11px] text-[#0055FF] font-bold mb-3">{idea.name || idea.developer || 'Anonymous'}</p>
                                 <p className="text-[12px] text-zinc-500 line-clamp-3 mb-6 h-12 leading-relaxed">{idea.description}</p>
                                 <div className="mt-auto pt-4 border-t border-zinc-50 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-zinc-400">{new Date(idea.createdAt).toLocaleDateString()}</span>
                                    <button 
                                       onClick={() => handleApproveIdea(idea.id, !idea.isApproved)}
                                       className={`h-8 px-4 text-[10px] font-bold transition-all ${idea.isApproved ? 'bg-zinc-100 text-zinc-500' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                    >
                                       {idea.isApproved ? 'De-authorize' : 'Authorize node'}
                                    </button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </motion.div>
               )}

               {/* Attendance Protocol Node */}
               {activeTab === "attendance" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-left">
                     <div className="bg-white border border-zinc-100 p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-zinc-50">
                           <div className="space-y-1">
                              <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Attendance protocol</h2>
                              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 outline-none border-none" />
                           </div>
                           <div className="flex flex-wrap items-center gap-3">
                              <button onClick={() => handleMarkAllAttendance("PRESENT")} className="h-10 px-6 bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition-all">Mark all present</button>
                              <button onClick={() => handleMarkAllAttendance("ABSENT")} className="h-10 px-6 bg-zinc-900 text-white text-[11px] font-bold hover:bg-blue-600 transition-all">Mark all absent</button>
                              <button onClick={() => handleMarkHandRaisedAttendance()} className="h-10 px-6 bg-amber-500 text-white text-[11px] font-bold hover:bg-amber-600 transition-all flex items-center gap-2">
                                 <Hand size={14} />
                                 Mark Hands Present
                              </button>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {interns.filter(i => i.isApproved).map((intern) => {
                              const record = currentAttendance.find(a => a.userId === intern.id);
                              return (
                                 <div key={intern.id} className={`p-6 border group hover:border-[#0055FF]/20 transition-all relative ${intern.handRaised ? "bg-amber-50/20 border-amber-500/30" : "bg-white border-zinc-100"}`}>
                                    <div className="flex items-center justify-between mb-4">
                                       <div className={`h-3 w-3 ${intern.handRaised ? "bg-amber-500" : "bg-zinc-100"}`} />
                                       <div className="flex items-center gap-2">
                                          {intern.handRaised && (
                                             <div className="flex items-center gap-1.5 px-2 py-0.5 bg-amber-500 text-white text-[9px] font-bold tracking-tight">
                                                <Hand size={10} />
                                                HAND RAISED
                                             </div>
                                          )}
                                          {record && (
                                             <span className={`text-[10px] font-bold px-2 py-0.5 border ${
                                                record.status === "PRESENT" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
                                             }`}>
                                                {record.status}
                                             </span>
                                          )}
                                       </div>
                                    </div>
                                    <p className="text-[14px] font-bold text-zinc-900 mb-1">{intern.name}</p>
                                    <p className="text-[10px] text-zinc-400 font-bold mb-6">{intern.branch || 'Technical branch'}</p>
                                    <div className="flex items-center gap-2">
                                       <button 
                                          onClick={() => handleMarkAttendance(intern.id, "PRESENT", record?.workSummary || "")}
                                          disabled={markingId === intern.id}
                                          className={`flex-1 h-9 text-[11px] font-bold transition-all ${record?.status === "PRESENT" ? "bg-emerald-600 text-white" : "bg-zinc-50 text-zinc-400 hover:bg-emerald-50 hover:text-emerald-600"}`}
                                       >
                                          Present
                                       </button>
                                       <button 
                                          onClick={() => handleMarkAttendance(intern.id, "ABSENT", record?.workSummary || "")}
                                          disabled={markingId === intern.id}
                                          className={`flex-1 h-9 text-[11px] font-bold transition-all ${record?.status === "ABSENT" ? "bg-red-600 text-white" : "bg-zinc-50 text-zinc-400 hover:bg-red-50 hover:text-red-600"}`}
                                       >
                                          Absent
                                       </button>
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  </motion.div>
               )}

               {/* Logbook / System History Node */}
               {activeTab === "history" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                     <div className="bg-white border border-zinc-100 p-8 text-left">
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-10">Administrative logbook</h2>
                        <div className="space-y-4">
                           {tasks.slice(0, 10).map((log) => (
                              <div key={log.id} className="p-4 border-l-2 border-blue-600 bg-zinc-50/50 flex items-center justify-between group">
                                 <div className="flex flex-col gap-1">
                                    <p className="text-[13px] font-bold text-zinc-900">Task Dispatched: <span className="font-medium text-zinc-500">{log.title}</span></p>
                                    <p className="text-[11px] text-zinc-400">Target identity: {log.user?.name} ({log.user?.email})</p>
                                 </div>
                                 <span className="text-[10px] font-bold text-zinc-400">{new Date(log.createdAt).toLocaleString()}</span>
                              </div>
                           ))}
                           {tasks.length === 0 && <p className="text-center py-20 text-zinc-400 text-sm italic">Logbook is currently synchronized with no entry nodes.</p>}
                        </div>
                     </div>
                  </motion.div>
               )}

               {/* Manage Schedules - Tactical Mission Control */}
               {activeTab === "manage_schedules" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-left">
                     <div className="bg-white border border-zinc-100 shadow-sm p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                           <div className="space-y-1">
                              <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Mission calibration</h2>
                              <p className="text-[14px] text-zinc-500">Recalibrate existing mission protocols and team allocations.</p>
                           </div>
                           <div className="flex items-center gap-3">
                              <select 
                                 value={batchFilter} 
                                 onChange={(e) => setBatchFilter(e.target.value)}
                                 className="h-10 bg-zinc-50 border border-zinc-100 px-4 text-[11px] font-bold uppercase tracking-widest outline-none focus:border-blue-600"
                              >
                                 <option value="Batch 1">Batch 1</option>
                                 <option value="Batch 2">Batch 2</option>
                              </select>
                              <button 
                                 onClick={() => { fetchData(); }}
                                 className="h-10 px-4 border border-zinc-100 bg-white hover:bg-zinc-50 transition-all"
                              >
                                 <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                              </button>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                           {allSchedules.length === 0 ? (
                              <p className="col-span-full py-20 text-center text-zinc-400 italic">Zero mission logs detected for this batch protocol.</p>
                                                      ) : (
                              allSchedules.map((schedule) => (
                                 <div key={schedule.id} className="border border-zinc-100 bg-white p-8 space-y-6 hover:border-blue-600/30 transition-all shadow-sm group">
                                    <div className="flex items-center justify-between">
                                       <div className="flex items-center gap-3">
                                          <span className="text-[10px] font-bold bg-zinc-900 px-3 py-1 text-white uppercase tracking-widest">{schedule.week}</span>
                                          <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-3 py-1 border border-blue-100 uppercase tracking-widest">{schedule.batch}</span>
                                       </div>
                                       <div className="flex items-center gap-2">
                                          <button 
                                             onClick={() => setEditingSchedule(schedule)}
                                             className="h-10 w-10 flex items-center justify-center bg-zinc-50 text-zinc-400 hover:text-blue-600 hover:bg-white border border-zinc-100 transition-all"
                                          >
                                             <FileText size={16} />
                                          </button>
                                          <button 
                                             onClick={async () => {
                                                if(confirm("Permanently neutralize this mission protocol?")) {
                                                   const res = await fetch(`/api/intern/schedule?id=${schedule.id}`, { method: "DELETE" });
                                                   if(res.ok) fetchData();
                                                }
                                             }}
                                             className="h-10 w-10 flex items-center justify-center bg-zinc-50 text-zinc-400 hover:text-red-600 hover:bg-white border border-zinc-100 transition-all"
                                          >
                                             <Trash2 size={16} />
                                          </button>
                                       </div>
                                    </div>

                                    <div className="space-y-4">
                                       <div className="space-y-1">
                                          <h4 className="text-xl font-bold text-zinc-900 tracking-tight">{schedule.projectName || schedule.typeOfWork}</h4>
                                          <p className="text-[13px] text-zinc-500 font-medium leading-relaxed">{schedule.description}</p>
                                       </div>

                                       <div className="grid grid-cols-2 gap-6 pt-4">
                                          <div className="space-y-1">
                                             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Team Allocation</span>
                                             <p className="text-[14px] font-bold text-zinc-900">{schedule.teamAllocation || "Universal Pool"}</p>
                                          </div>
                                          <div className="space-y-1">
                                             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Technician Lead</span>
                                             <p className="text-[14px] font-bold text-zinc-900">{schedule.teamLead || "Not Assigned"}</p>
                                          </div>
                                          <div className="space-y-1">
                                             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Mentor Node</span>
                                             <p className="text-[14px] font-bold text-zinc-900">{schedule.mentorName || "Administrative"}</p>
                                          </div>
                                          <div className="space-y-1">
                                             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Hand-in Deadline</span>
                                             <p className="text-[14px] font-bold text-blue-600">{new Date(schedule.deadline).toLocaleDateString()}</p>
                                          </div>
                                       </div>

                                       <div className="space-y-3 pt-4">
                                          <div className="space-y-1">
                                             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Team Roster ({schedule.teamInternNames?.length || 0})</span>
                                             <div className="flex flex-wrap gap-2">
                                                {Array.isArray(schedule.teamInternNames) && schedule.teamInternNames.length > 0 ? (
                                                   schedule.teamInternNames.map((name: string, i: number) => (
                                                      <span key={i} className="text-[11px] bg-zinc-50 border border-zinc-100 px-2 py-1 font-bold text-zinc-600 uppercase tracking-tight">{name}</span>
                                                   ))
                                                ) : (
                                                   <p className="text-[11px] text-zinc-400 italic">No specific identities synchronized.</p>
                                                )}
                                             </div>
                                          </div>

                                          <div className="space-y-1">
                                             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Technology Stack</span>
                                             <div className="flex flex-wrap gap-2 text-[11px] font-bold text-zinc-900">
                                                {schedule.toolsUsed?.map((tool: string, i: number) => (
                                                   <span key={i} className="bg-zinc-50 px-2 py-1">#{tool}</span>
                                                ))}
                                             </div>
                                          </div>

                                          {schedule.projectDocLink && (
                                             <div className="space-y-1">
                                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Mission Documentation</span>
                                                <a href={schedule.projectDocLink} target="_blank" className="text-[13px] font-bold text-blue-600 flex items-center gap-2 hover:underline">
                                                   View Protocol Asset <ExternalLink size={12} />
                                                </a>
                                             </div>
                                          )}
                                       </div>
                                    </div>
                                 </div>
                              ))
                           )}
                        </div>
                     </div>

                     {/* Tactical Recalibration Portal (Edit Modal) */}
                     <AnimatePresence>
                        {editingSchedule && (
                           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                              <motion.div 
                                 initial={{ opacity: 0, scale: 0.95 }}
                                 animate={{ opacity: 1, scale: 1 }}
                                 exit={{ opacity: 0, scale: 0.95 }}
                                 className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto p-10 border border-zinc-100 shadow-2xl relative"
                              >
                                 <button 
                                    onClick={() => setEditingSchedule(null)}
                                    className="absolute top-6 right-6 text-zinc-400 hover:text-black transition-colors"
                                 >
                                    <CloseIcon size={24} />
                                 </button>

                                 <div className="mb-10 text-left">
                                    <h3 className="text-2xl font-bold tracking-tight text-zinc-900 mb-2 font-sans">Tactical mission recalibration</h3>
                                    <p className="text-[14px] text-zinc-500 font-medium">Updating parameters for {editingSchedule.week} authorization.</p>
                                 </div>

                                 <form 
                                    onSubmit={async (e) => {
                                       e.preventDefault();
                                       setLoadingSchedules(true);
                                       try {
                                          const res = await fetch("/api/intern/schedule", {
                                             method: "PATCH",
                                             headers: { "Content-Type": "application/json" },
                                             body: JSON.stringify({
                                                id: editingSchedule.id,
                                                week: editingSchedule.week,
                                                typeOfWork: editingSchedule.typeOfWork,
                                                description: editingSchedule.description,
                                                teamAllocation: editingSchedule.teamAllocation,
                                                deadline: editingSchedule.deadline,
                                                projectName: editingSchedule.projectName,
                                                projectDocLink: editingSchedule.projectDocLink,
                                                mentorName: editingSchedule.mentorName,
                                                batch: editingSchedule.batch,
                                                teamLead: editingSchedule.teamLead,
                                                toolsUsed: Array.isArray(editingSchedule.toolsUsed) ? editingSchedule.toolsUsed : editingSchedule.toolsUsed.split(",").map((s: any) => s.trim()),
                                                requirements: Array.isArray(editingSchedule.requirements) ? editingSchedule.requirements : editingSchedule.requirements.split("\n").map((s: any) => s.trim()),
                                                outcomes: Array.isArray(editingSchedule.outcomes) ? editingSchedule.outcomes : editingSchedule.outcomes.split("\n").map((s: any) => s.trim()),
                                                deploymentTools: Array.isArray(editingSchedule.deploymentTools) ? editingSchedule.deploymentTools : editingSchedule.deploymentTools.split(",").map((s: any) => s.trim())
                                             })
                                          });
                                          if (res.ok) {
                                             setEditingSchedule(null);
                                             fetchData();
                                          }
                                       } catch (err) { console.error("Recalibration failure"); }
                                       finally { setLoadingSchedules(false); }
                                    }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
                                 >
                                    <div className="space-y-1">
                                       <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Phase (Week)</label>
                                       <input required value={editingSchedule.week} onChange={(e) => setEditingSchedule({ ...editingSchedule, week: e.target.value })} className="w-full h-12 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600" />
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Mission Code (Project Name)</label>
                                       <input required value={editingSchedule.projectName} onChange={(e) => setEditingSchedule({ ...editingSchedule, projectName: e.target.value })} className="w-full h-12 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600" />
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                       <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Description</label>
                                       <textarea required rows={4} value={editingSchedule.description} onChange={(e) => setEditingSchedule({ ...editingSchedule, description: e.target.value })} className="w-full bg-white border border-zinc-100 p-4 text-sm font-bold outline-none focus:border-blue-600 resize-none" />
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Team Allocation</label>
                                       <input value={editingSchedule.teamAllocation} onChange={(e) => setEditingSchedule({ ...editingSchedule, teamAllocation: e.target.value })} className="w-full h-12 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600" />
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Technician Lead</label>
                                       <input value={editingSchedule.teamLead} onChange={(e) => setEditingSchedule({ ...editingSchedule, teamLead: e.target.value })} className="w-full h-12 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600" />
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Mentor Node</label>
                                       <input value={editingSchedule.mentorName} onChange={(e) => setEditingSchedule({ ...editingSchedule, mentorName: e.target.value })} className="w-full h-12 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600" />
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Protocol Documentation Link</label>
                                       <input value={editingSchedule.projectDocLink} onChange={(e) => setEditingSchedule({ ...editingSchedule, projectDocLink: e.target.value })} className="w-full h-12 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600" />
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Hand-in Deadline</label>
                                       <input type="date" value={new Date(editingSchedule.deadline).toISOString().split('T')[0]} onChange={(e) => setEditingSchedule({ ...editingSchedule, deadline: e.target.value })} className="w-full h-12 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600" />
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Technology Stack (Comma Separated)</label>
                                       <input value={Array.isArray(editingSchedule.toolsUsed) ? editingSchedule.toolsUsed.join(", ") : editingSchedule.toolsUsed} onChange={(e) => setEditingSchedule({ ...editingSchedule, toolsUsed: e.target.value })} className="w-full h-12 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600" />
                                    </div>
                                    <button disabled={loadingSchedules} className="md:col-span-2 w-full h-14 bg-zinc-900 text-white text-[13px] font-bold hover:bg-black transition-all flex items-center justify-center gap-3">
                                       {loadingSchedules ? <RefreshCw className="animate-spin" size={18} /> : "Finalize Recalibration"}
                                    </button>
                                 </form>
                              </motion.div>
                           </div>
                        )}
                     </AnimatePresence>
                  </motion.div>
               )}
            </div>
         </main>
      </div>
   );
}
