"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
   LayoutDashboard,
   Briefcase,
   Paperclip,
   Download,
   CheckCircle2,
   Clock,
   ChevronRight,
   ChevronLeft,
   Search,
   RefreshCw,
   FileBadge,
   X,

   Calendar,
   XCircle,
   AlertCircle,
   User,
   Check,
   Target,
   Terminal,
   Trophy,
   Activity,
   LogOut,
   ShieldCheck,
   Mail,
   Fingerprint,
   MessageSquare,
   ArrowUpRight,
   Send,
   Users,
   Globe,
   Hash,
   Circle,
   Map,
   Hand,
   School,
   Layers,
   Plus,
   Trash2,
   Kanban as KanbanIcon,
   MoreVertical,
   FileText as FileTextIcon,
   Shield,
   BookOpen,
   MessageCircle,
   ArrowRight,
   Newspaper,
   MapPin,
   Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { supabase } from "@/lib/supabase";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

interface Task {
   id: string;
   title: string;
   description: string;
   attachmentUrl?: string;
   status: string;
   createdAt: string;
}

interface PersonalTask {
   id: string;
   title: string;
   description: string | null;
   status: string;
   createdAt: string;
}

interface ScheduleItem {
   id: string;
   week: string;
   typeOfWork: string;
   toolsUsed: string[];
   deploymentTools: string[];
   description: string;
   deadline: string;
   isCompleted: boolean;
   batch: string;
   teamInternIds: string[];
   teamAllocation?: string;
}


interface ChatMessage {
   id?: string;
   teamId: string;
   senderId: string;
   senderName?: string;
   content: string;
   createdAt: string;
   targetId?: string | null;
}

function InternDashboardContent() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const activeTab = searchParams.get("view") || "overview";

   const [user, setUser] = useState<any>(null);
   const [tasks, setTasks] = useState<Task[]>([]);
   const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
   const [attendanceData, setAttendanceData] = useState<{ history: any[], totalTrackingDays: number, presentCount?: number }>({ history: [], totalTrackingDays: 0 });
   const [isLoading, setIsLoading] = useState(true);
   const [isUpdating, setIsUpdating] = useState<string | null>(null);
   const [userStatus, setUserStatus] = useState<any>(null);
   const [showLetterModal, setShowLetterModal] = useState(false);
   const [showOfferLetterModal, setShowOfferLetterModal] = useState(false);
   const [showSupportModal, setShowSupportModal] = useState(false);


   const [personalTasks, setPersonalTasks] = useState<PersonalTask[]>([]);
   const [isAddingPersonalTask, setIsAddingPersonalTask] = useState(false);
   const [newPersonalTask, setNewPersonalTask] = useState({ title: "", description: "" });
   const [isSavingPersonalTask, setIsSavingPersonalTask] = useState(false);


   // Relay Terminal (Group Chat)
   const [messages, setMessages] = useState<ChatMessage[]>([]);
   const [inputText, setInputText] = useState("");
   const [socket, setSocket] = useState<any>(null);
   const [socketStatus, setSocketStatus] = useState<"connected" | "disconnected" | "connecting">("connecting");
   const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
   const [selectedUser, setSelectedUser] = useState<any>(null);
   const [allInterns, setAllInterns] = useState<any[]>([]);
   const [reports, setReports] = useState<any[]>([]);
   const [examSessions, setExamSessions] = useState<any[]>([]);
   const [loadingReports, setLoadingReports] = useState(false);
   const chatEndRef = useRef<HTMLDivElement>(null);

   // Internship State
   const [internships, setInternships] = useState<any[]>([]);
   const [myApplications, setMyApplications] = useState<any[]>([]);
   const [isApplying, setIsApplying] = useState<string | null>(null);

   const fetchInternships = async () => {
      try {
         const res = await fetch("/api/cleed/internships");
         const data = await res.json();
         if (data.success) {
            setInternships(data.internships.filter((i: any) => i.isApproved));
         }
      } catch (err) {
         console.error("Failed to fetch internships");
      }
   };

   const fetchMyApplications = async (internId: string) => {
      try {
         const res = await fetch(`/api/intern/apply?internId=${internId}`);
         const data = await res.json();
         if (data.success) {
            setMyApplications(data.applications);
         }
      } catch (err) {
         console.error("Failed to fetch applications");
      }
   };

   useEffect(() => {
      const syncSession = async () => {
         let storedUser = localStorage.getItem("intern_user");
         let userData = storedUser ? JSON.parse(storedUser) : null;


         if (!userData) {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
               try {

                  const res = await fetch(`/api/intern/status?id=${session.user.id}`);
                  if (res.ok) {
                     const profile = await res.json();
                     userData = profile;
                     localStorage.setItem("intern_user", JSON.stringify(profile));
                  } else {

                     userData = { id: session.user.id, name: session.user.user_metadata.full_name || session.user.email, email: session.user.email };
                     localStorage.setItem("intern_user", JSON.stringify(userData));
                  }
               } catch (e) {

                  userData = { id: session.user.id, name: session.user.user_metadata.full_name || session.user.email, email: session.user.email };
                  localStorage.setItem("intern_user", JSON.stringify(userData));
               }
            }
         }

         if (!userData) {
            router.push("/intern/signin");
            return;
         }

         setUser(userData);
         fetchTasks(userData.id, userData.batch);
         fetchStatus(userData.id);
         fetchAttendance(userData.id);
         fetchReports(userData.id);
         fetchExams(userData.id);
         fetchSchedules(userData.id, userData.batch);
         fetchAllInterns();
         fetchInternships();
         fetchMyApplications(userData.id);
         const syncInterval = setInterval(() => {
            fetchTasks(userData.id, userData.batch);
            fetchStatus(userData.id);
            fetchSchedules(userData.id, userData.batch);
            fetchExams(userData.id);
            fetchAllInterns();
            fetchInternships();
            fetchMyApplications(userData.id);
         }, 30000);

         const cleanup = () => {
            clearInterval(syncInterval);
         };

         return cleanup;
      };

      const cleanupPromise = syncSession();

      return () => {
         cleanupPromise.then(cb => cb && cb());
      };
   }, [router]);

   const [showAttendanceAlert, setShowAttendanceAlert] = useState(true);
   const [showChatSidebar, setShowChatSidebar] = useState(true);
   const [showUIUXModal, setShowUIUXModal] = useState(false);
   const [uiuxSubmitting, setUiuxSubmitting] = useState(false);
   const [uiuxSuccess, setUiuxSuccess] = useState(false);
   const [uiuxForm, setUiuxForm] = useState({ taskName: "", taskLink: "", githubLink: "" });

   const [showTaskSubmissionModal, setShowTaskSubmissionModal] = useState(false);
   const [taskSubmissionForm, setTaskSubmissionForm] = useState({ name: "", githubLink: "", liveLink: "" });
   const [isSubmittingTask, setIsSubmittingTask] = useState(false);
   const [taskSubmissionSuccess, setTaskSubmissionSuccess] = useState(false);
   const [selectedTaskForSubmit, setSelectedTaskForSubmit] = useState<Task | null>(null);

   const handleTaskSubmission = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedTaskForSubmit) return;
      setIsSubmittingTask(true);
      try {
         const res = await fetch("/api/task-submission", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               email: user.email,
               taskAllocated: selectedTaskForSubmit.title,
               ...taskSubmissionForm
            })
         });
         if (res.ok) {
            setTaskSubmissionSuccess(true);
            setTimeout(() => {
               setShowTaskSubmissionModal(false);
               setTaskSubmissionSuccess(false);
               setTaskSubmissionForm({ name: user.name, githubLink: "", liveLink: "" });
            }, 2000);
         }
      } catch (err) {
         console.error("Task submission failed:", err);
      } finally {
         setIsSubmittingTask(false);
      }
   };

   const handleUIUXSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setUiuxSubmitting(true);
      try {
         const res = await fetch("/api/intern/uiux-submission", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               userId: user.id,
               userName: user.name,
               ...uiuxForm
            })
         });
         if (res.ok) {
            setUiuxSuccess(true);
            setTimeout(() => { setShowUIUXModal(false); setUiuxSuccess(false); setUiuxForm({ taskName: "", taskLink: "", githubLink: "" }); }, 2000);
         }
      } catch (err) {
         console.error("UI/UX submission failed:", err);
      } finally {
         setUiuxSubmitting(false);
      }
   };
   const [showFeedbackModal, setShowFeedbackModal] = useState(false);
   const [submittingFeedback, setSubmittingFeedback] = useState(false);
   const [feedbackForm, setFeedbackForm] = useState({
      name: "",
      college: "",
      examExperience: "",
      upgradeSuggestions: "",
      learningGoals: ""
   });

   useEffect(() => {
      if (user) {
         const alreadySubmitted = localStorage.getItem(`feedback_submitted_${user.id}`);
         if (!alreadySubmitted && !user.hasSubmittedFeedback) { setShowFeedbackModal(true); }
      }

   }, [user]);
   const handleFeedbackSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmittingFeedback(true);
      try {
         const res = await fetch("/api/intern/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               userId: user.id,
               ...feedbackForm
            })
         });
         if (res.ok) {
            const updatedUser = { ...user, hasSubmittedFeedback: true };
            setUser(updatedUser);
            localStorage.setItem("intern_user", JSON.stringify(updatedUser));
            localStorage.setItem(`feedback_submitted_${user.id}`, "true");
            setShowFeedbackModal(false);
         } else {
            alert("Failed to submit. Please try again.");
         }
      } catch (err) {
         console.error("Feedback error:", err);
      } finally {
         setSubmittingFeedback(false);
      }
   };


   useEffect(() => {
      if (user && !socket) {
         setSocketStatus("connecting");
         // Wake up the chat server (Render free tier)
         fetch("https://redlix-chat-relay.onrender.com/ping").catch(() => {});

         const CHAT_SERVER_URL = window.location.hostname === "localhost" 
            ? "http://localhost:5005" 
            : "https://redlix-chat-relay.onrender.com";

         const newSocket = io(CHAT_SERVER_URL, {
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            randomizationFactor: 0.5,
            timeout: 20000,
            autoConnect: true,
            withCredentials: true,
            transports: ["websocket"]
         });
         setSocket(newSocket);

         newSocket.on("connect", () => {
            console.log("CHAT_SERVER: Connection established");
            setSocketStatus("connected");
         });

         newSocket.on("disconnect", () => {
            console.log("CHAT_SERVER: Disconnected");
            setSocketStatus("disconnected");
         });

         newSocket.on("connect_error", (err) => {
            console.error("CHAT_SERVER: Connection failed:", err.message);
            setSocketStatus("disconnected");
         });

         newSocket.on("receive_message", (msg: ChatMessage) => {
            setMessages(prev => {
               // Prevent duplicates (especially for local echo)
               const exists = prev.some(m => m.id === msg.id || (m.senderId === msg.senderId && m.content === msg.content && Math.abs(new Date(m.createdAt).getTime() - new Date(msg.createdAt).getTime()) < 5000));
               if (exists) return prev;
               return [...prev, msg];
            });
         });

         return () => {
            newSocket.disconnect();
         };
      }
   }, [user]);


   const fetchMessageHistory = async (teamId: string, otherUserId?: string) => {
      try {
         const url = otherUserId 
            ? `/api/messages?teamId=${teamId}&userId=${user?.id}&targetId=${otherUserId}`
            : `/api/messages?teamId=${teamId}`;
         const res = await fetch(url);
         const data = await res.json();
         if (data.success) {
            const formatted = data.messages.map((m: any) => ({
               ...m,
               content: m.content || m.text
            }));
            setMessages(formatted);
         }
      } catch (e) {
         console.error("Failed to fetch message history");
      }
   };

   useEffect(() => {
      if (socket && user) {
         const teamAllocation = schedules.find(s => s.teamAllocation)?.teamAllocation;
         const currentTeamId = teamAllocation || "global";
         
         setActiveTeamId(currentTeamId);
         socket.emit("join_team", currentTeamId);
         console.log("CHAT_SERVER: Joined room", currentTeamId);
         
         fetchMessageHistory(currentTeamId, selectedUser?.id);
      }
   }, [socket?.id, schedules, user?.id, selectedUser?.id]);

   useEffect(() => {
      if (messages.length > 0) {
         chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
   }, [messages]);


   const fetchStatus = async (id: string) => {
      try {
         const res = await fetch(`/api/intern/status?id=${id}`);
         const data = await res.json();
         setUserStatus(data);

         const lastAckOffer = localStorage.getItem(`offer_letter_ack_${id}`);
         if (data.offerLetterUrl && data.offerLetterUrl !== lastAckOffer) {
            setShowOfferLetterModal(true);
         }
      } catch (e) {
         console.error("Status check offline");
      }
   };

   const fetchTasks = async (id: string, batch?: string) => {
      try {
         const query = batch ? `?internId=${id}&batch=${encodeURIComponent(batch)}` : `?internId=${id}`;
         const res = await fetch(`/api/intern/tasks${query}`);
         const data = await res.json();
         setTasks(Array.isArray(data) ? data : []);
      } catch (error) {
         console.error("Failed to load tasks");
      } finally {
         setIsLoading(false);
      }
   };

   const fetchSchedules = async (id: string, batch?: string) => {
      try {
         const query = batch ? `?internId=${id}&batch=${encodeURIComponent(batch)}` : `?internId=${id}`;
         const res = await fetch(`/api/intern/schedule${query}`);
         const data = await res.json();
         if (data.success) {
            setSchedules(data.schedules);
         }
      } catch (error) {
         console.error("Failed to fetch schedules");
      }
   };

   const fetchAttendance = async (id: string) => {
      try {
         const res = await fetch(`/api/intern/attendance?internId=${id}`);
         if (res.ok) {
            const data = await res.json();
            setAttendanceData(data);
         }
      } catch (error) {
         console.error("Attendance retrieval offline");
      }
   };

   const fetchReports = async (internId: string) => {
      try {
         const res = await fetch(`/api/intern/reports?internId=${internId}`);
         const data = await res.json();
         if (data.success) {
            setReports(data.reports);
         }
      } catch (e) {
         console.error("Failed to load reports");
      }
   };

   const fetchExams = async (userId: string) => {
      try {
         const res = await fetch("/api/exams/session");
         const exData = await res.json();
         const userSessions = Array.isArray(exData) ? exData.filter((s: any) => s.userId === userId) : [];
         setExamSessions(userSessions);
      } catch (e) {
         console.error("Failed to load exams");
      }
   };

   const fetchAllInterns = async () => {
      try {
         const res = await fetch("/api/cleed/interns");
         const data = await res.json();
         if (Array.isArray(data)) setAllInterns(data);
      } catch (e) {
         console.error("Enclave synchronization failed");
      }
   };

   const updateTaskStatus = async (taskId: string, currentStatus: string) => {
      setIsUpdating(taskId);
      const newStatus = currentStatus === "pending" ? "completed" : "pending";
      try {
         const res = await fetch("/api/tasks", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: taskId, status: newStatus }),
         });
         if (res.ok) {
            setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
         }
      } catch (error) {
         console.error("Failed to update status");
      } finally {
         setIsUpdating(null);
      }
   };


   const handleSignOut = () => {
      localStorage.removeItem("intern_user");
      router.push("/intern/signin");
   };

   const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputText.trim() || !socket || !user || !activeTeamId) return;

      const messageContent = inputText;
      const messageData = {
         teamId: activeTeamId,
         senderId: user.id,
         senderName: user.name,
         message: messageContent,
         targetId: selectedUser?.id || null,
      };

      // Wake up server if needed during interaction
      fetch("https://redlix-chat-relay.onrender.com/ping").catch(() => {});

      socket.emit("send_message", messageData);

      // Local echo: add message to state immediately for responsiveness
      const localMsg: ChatMessage = {
         id: "temp-" + Date.now(),
         teamId: activeTeamId,
         senderId: user.id,
         senderName: user.name,
         content: messageContent,
         createdAt: new Date().toISOString(),
         targetId: selectedUser?.id || null
      };
      
      setMessages(prev => [...prev, localMsg]);
      setInputText("");
   };

   if (!user) return null;

   if (userStatus && userStatus.isApproved === false) {
      return (
         <div className="p-4 lg:p-6 max-w-7xl w-full mx-auto bg-white min-h-screen">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl w-full text-center space-y-10">
               <div className="flex justify-center"><div className="h-24 w-24 bg-amber-500 text-white flex items-center justify-center rounded-none shadow-2xl shadow-amber-500/20 relative"><Clock size={48} className="animate-pulse" /><div className="absolute -bottom-2 -right-2 h-8 w-8 bg-black text-[10px] font-bold flex items-center justify-center">SOS</div></div></div>
               <div className="space-y-4 shadow-sm p-4"><h1 className="text-4xl font-bold tracking-tight text-zinc-900">Registration pending</h1><p className="text-zinc-500 font-medium text-lg leading-relaxed">Your application has been received. Please wait while the team verifies your details. Access will be granted shortly.</p></div>
               <button onClick={handleSignOut} className="text-[12px] font-medium text-zinc-400 hover:text-black transition-colors">Sign out</button>
            </motion.div>
         </div>
      );
   }

   const fetchPersonalTasks = async (userId: string) => {
      try {
         const res = await fetch(`/api/intern/personal-tasks?userId=${userId}`);
         const data = await res.json();
         if (data.success) {
            setPersonalTasks(data.tasks);
         }
      } catch (err) {
         console.error("Failed to fetch personal tasks:", err);
      }
   };

   const handleAddPersonalTask = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newPersonalTask.title || isSavingPersonalTask) return;
      setIsSavingPersonalTask(true);
      try {
         const res = await fetch("/api/intern/personal-tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               userId: user.id,
               title: newPersonalTask.title,
               description: newPersonalTask.description,
               status: "TODO"
            })
         });
         const data = await res.json();
         console.log("Add task response:", data);
         if (data.success) {
            setPersonalTasks([data.task, ...personalTasks]);
            setNewPersonalTask({ title: "", description: "" });
            setIsAddingPersonalTask(false);
         } else {
            console.error("Server error adding task:", data.error, data.detail);
         }
      } catch (err) {
         console.error("Network error adding task:", err);
      } finally {
         setIsSavingPersonalTask(false);
      }
   };

   const updatePersonalTaskStatus = async (taskId: string, newStatus: string) => {
      try {
         const res = await fetch("/api/intern/personal-tasks", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ taskId, status: newStatus })
         });
         const data = await res.json();
         if (data.success) {
            setPersonalTasks(personalTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
         }
      } catch (err) {
         console.error("Failed to update status");
      }
   };

   const deletePersonalTask = async (taskId: string) => {
      try {
         const res = await fetch(`/api/intern/personal-tasks?taskId=${taskId}`, {
            method: "DELETE"
         });
         const data = await res.json();
         if (data.success) {
            setPersonalTasks(personalTasks.filter(t => t.id !== taskId));
         }
      } catch (err) {
         console.error("Failed to delete task");
      }
   };

   const attendanceCount = attendanceData.presentCount || attendanceData.history.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
   const attendancePercentage = attendanceData.totalTrackingDays > 0 ? Math.min(100, Math.round((attendanceCount / attendanceData.totalTrackingDays) * 100)) : 0;
   const isLowAttendance = attendancePercentage < 75;

   const handleApply = async (internshipId: string) => {
      if (!user) return;
      setIsApplying(internshipId);
      
      try {
         // 1. Fetch current resume data
         const resResume = await fetch(`/api/intern/resume?userId=${user.id}`);
         const resResumeData = await resResume.json();
         
         if (!resResumeData.success || !resResumeData.resumeData) {
            alert("Please create and save your resume in the Resume Builder before applying.");
            router.push("/intern/dashboard/resume");
            return;
         }

         // 2. Submit application
         const resApply = await fetch("/api/intern/apply", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               internId: user.id,
               internshipId,
               resumeData: resResumeData.resumeData
            })
         });
         
         const applyData = await resApply.json();
         if (applyData.success) {
            alert("Application submitted successfully!");
            fetchMyApplications(user.id);
         } else {
            alert(applyData.error || "Failed to submit application.");
         }
      } catch (err) {
         console.error("Application error:", err);
         alert("Failed to submit application. Please try again.");
      } finally {
         setIsApplying(null);
      }
   };

   return (
      <div key={activeTab} className="p-4 lg:p-6 max-w-[1600px] w-full mx-auto bg-white min-h-screen pb-24 lg:pb-6">
         {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
               {attendancePercentage < 65 && (
                  <motion.div 
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="bg-red-50 border border-red-100 p-4 rounded-lg flex items-center gap-4"
                  >
                     <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                        <AlertCircle className="text-red-600" size={20} />
                     </div>
                     <div className="flex-1">
                        <h4 className="text-[13px] font-bold text-red-700">Attendance Warning</h4>
                        <p className="text-[12px] text-red-600 font-medium leading-relaxed">
                           Your attendance is currently <span className="font-bold">{attendancePercentage}%</span>. Make sure to follow correct attendance procedures, else your internship completion details will not be issued.
                        </p>
                     </div>
                  </motion.div>
               )}
               {/* Hero Bento Section */}
               <div className="grid grid-cols-12 gap-4 text-left">
                  {/* Left Column: Greeting & Stats */}
                  <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
                      <div className="relative overflow-hidden bg-[#E0E7FF] p-6 text-[#003366] border border-[#003366]/5 rounded-lg">

                         <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-1">
                               <h1 className="text-2xl font-bold tracking-tight text-[#003366]">
                                  {(() => {
                                     const hour = new Date().getHours();
                                     if (hour < 12) return "Good morning";
                                     if (hour < 17) return "Good afternoon";
                                     return "Good evening";
                                  })()}, <span className="text-[#0055FF]">{user.name.split(' ')[0]}</span>
                               </h1>
                               <p className="text-[#003366]/60 text-[12px] font-medium max-w-sm">
                                  Welcome back scholar. You have <span className="text-[#003366] font-semibold">{(Array.isArray(tasks) ? tasks : []).filter(t => t.status === 'pending').length} pending</span> tasks today.
                               </p>
                            </div>
                            <div className="flex items-center gap-3">
                               <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md px-3 py-1.5 border border-white/30">
                                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#003366]/60">Live Sync</span>
                               </div>
                               <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-4 py-2 border border-white/40">
                                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#003366]/40">Active Batch</span>
                                  <div className="text-[14px] font-semibold text-[#003366]">{user.batch || "Batch 3"}</div>
                               </div>
                            </div>
                         </div>

                         {/* Integrated Stats Row with Separate Containers */}
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 pt-6 border-t border-[#003366]/10">
                            {[
                               { label: "Attendance", value: `${attendancePercentage}%`, icon: CheckCircle2 },
                               { label: "Milestones", value: schedules.filter(s => s.isCompleted).length, icon: Target },
                               { label: "Reports", value: reports.length + examSessions.length, icon: FileTextIcon },
                               { label: "Warnings", value: examSessions.reduce((acc, s) => acc + (s.violations || 0), 0), icon: AlertCircle }
                            ].map((stat, i) => (
                               <div key={i} className="bg-white/40 border border-[#003366]/5 p-3 flex flex-col justify-between group">
                                  <div className="flex items-center gap-2 opacity-60">
                                     <stat.icon size={12} className="text-[#003366]" />
                                     <span className="text-[9px] font-bold uppercase tracking-wider text-[#003366]">{stat.label}</span>
                                  </div>
                                  <p className="text-xl font-bold text-[#003366] mt-0.5">{stat.value}</p>
                               </div>
                            ))}
                         </div>
                      </div>
                  </div>

                  {/* Right Column: Key Actions */}
                  <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 h-full">
                     {/* Submission Portal Card */}
                      <div className="flex-1 bg-white border border-zinc-100 p-6 flex flex-col sm:flex-row items-center justify-between shadow-none relative overflow-hidden group min-h-[210px]">
                        <div className="absolute top-2 right-2 p-2 bg-blue-50 text-[#003366] z-10">
                           <Paperclip size={18} />
                        </div>

                        <div className="flex-1 flex flex-col justify-between h-full text-center sm:text-left relative z-10 w-full">
                           <div className="space-y-1">
                              <h3 className="text-sm font-semibold text-[#003366] tracking-tight">My Portal</h3>
                              <p className="text-[11px] text-zinc-500 font-medium leading-relaxed max-w-full sm:max-w-[180px]">
                                 Submit your work and get marks for your results. Daily progress tracking active.
                              </p>
                           </div>

                           <button
                              onClick={() => setShowUIUXModal(true)}
                              className="w-full sm:w-fit px-6 h-9 bg-[#003366] text-white text-[11px] font-semibold tracking-wide mt-4 hover:bg-black transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                           >
                              Submit Work <ArrowUpRight size={14} />
                           </button>
                        </div>

                        {/* Illustration Aligned to Container Height */}
                        <div className="w-40 h-40 sm:w-48 sm:h-full flex items-center justify-center flex-shrink-0 mt-4 sm:mt-0 pointer-events-none">
                           <img
                              src="https://ik.imagekit.io/dypkhqxip/Image%20folder-amico.svg"
                              alt="Illustration"
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
                           />
                        </div>
                     </div>

                     {/* Document Card (Conditional) */}
                     {userStatus?.offerLetterUrl ? (
                        <div className="bg-emerald-600 p-6 shadow-lg shadow-emerald-900/10 flex flex-col justify-between">
                           <div className="flex items-baseline justify-between mb-2">
                              <h3 className="text-xs font-bold text-white uppercase tracking-widest opacity-80">Certification</h3>
                              <ShieldCheck size={18} className="text-white/40" />
                           </div>
                           <p className="text-[15px] font-bold text-white mb-6 leading-tight">Your Offer Letter is now ready.</p>
                           <a href={userStatus.offerLetterUrl} target="_blank" className="w-full h-11 bg-white text-emerald-700 text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-50 transition-all">
                              Get PDF <Download size={14} />
                           </a>
                        </div>
                     ) : null}
                  </div>
               </div>

               {/* Portal Updates Card Section */}
               <div className="mt-8">
                  <div className="flex items-center gap-2 mb-4 border-b border-zinc-100 pb-2">
                     <Newspaper size={16} className="text-[#003366]" />
                     <h2 className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Portal Updates</h2>
                  </div>
                  
                  <div className="space-y-4">
                     {/* Announcement 1: Student Forge Hiring (Newest) */}
                     <div className="bg-zinc-50 border border-zinc-100 rounded-lg p-6 flex flex-col lg:flex-row items-center gap-8 hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="w-full lg:w-48 h-48 lg:h-48 bg-white rounded-md overflow-hidden shrink-0 border border-zinc-100">
                           <img 
                              src="https://ik.imagekit.io/dypkhqxip/hiring" 
                              alt="Student Forge Hiring"
                              className="w-full h-full object-cover lg:object-contain transition-all duration-500 group-hover:scale-105"
                           />
                        </div>

                        <div className="flex-1 space-y-3 w-full">
                           <div className="flex items-center gap-3">
                              <span className="bg-white text-emerald-600 border border-emerald-100 text-[9px] font-bold px-2 py-0.5 rounded">
                                 Active
                              </span>
                              <span className="text-[11px] text-zinc-400 font-medium">May 04, 2026</span>
                           </div>
                           <h3 className="text-xl font-bold text-[#003366] tracking-tight">Join Student Forge – We’re Hiring Interns</h3>
                           <p className="text-[13px] text-zinc-500 font-medium leading-relaxed line-clamp-3 max-w-2xl">
                              Student Forge is excited to welcome passionate and driven students to be part of our growing team. We are currently hiring Marketing Interns and Web Development Interns who are eager to learn, contribute, and build real-world experience.
                           </p>
                           
                           <div className="flex justify-start mt-4">
                              <Link 
                                 href="/intern/dashboard/news"
                                 className="flex items-center gap-1 text-[13px] font-semibold text-blue-500 hover:underline"
                              >
                                 View Details <ChevronRight size={14} />
                              </Link>
                           </div>
                        </div>
                     </div>

                     {/* Announcement 2: Summer Bootcamp (Previous) */}
                     <div className="bg-white border border-zinc-100 rounded-lg p-6 flex flex-col lg:flex-row items-center gap-8 hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="w-full lg:w-48 h-48 lg:h-48 bg-zinc-50 rounded-md overflow-hidden shrink-0 border border-zinc-100">
                           <img 
                              src="https://ik.imagekit.io/dypkhqxip/Summer%20Bootcamp%20(2).png?updatedAt=1776542583323" 
                              alt="Summer Bootcamp"
                              className="w-full h-full object-cover lg:object-contain transition-all duration-500 group-hover:scale-105"
                           />
                        </div>

                        <div className="flex-1 space-y-3 w-full">
                           <div className="flex items-center gap-3">
                              <span className="bg-zinc-100 text-zinc-500 border border-zinc-200 text-[9px] font-bold px-2 py-0.5 rounded">
                                 Notice
                              </span>
                              <span className="text-[11px] text-zinc-400 font-medium">April 20, 2026</span>
                           </div>
                           <h3 className="text-xl font-bold text-zinc-800 tracking-tight">Summer boot camp 2026 announcement</h3>
                           <p className="text-[13px] text-zinc-500 font-medium leading-relaxed line-clamp-3 max-w-2xl">
                              This notice announces the start of the 30-day "Summer Boot Camp 2026". The program is designed to provide high-quality technical skills to students. We focus on building industry-standard capabilities through practical training.
                           </p>
                           
                           <div className="flex justify-start mt-4">
                              <Link 
                                 href="/intern/dashboard/news"
                                 className="flex items-center gap-1 text-[13px] font-semibold text-blue-500 hover:underline"
                              >
                                 View Details <ChevronRight size={14} />
                              </Link>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Custom Floating Chat Icon */}
               <button 
                  onClick={() => setShowSupportModal(true)}
                  className="fixed bottom-8 right-8 z-[60] w-16 h-16 bg-[#1A3797] shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group overflow-hidden"
                  style={{
                     borderRadius: '32px 32px 5px 32px' // Leaf shape
                  }}
               >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-7 h-6 bg-white rounded-[6px] flex flex-col justify-center items-start px-1.5 gap-0.5">
                     <div className="w-4 h-0.5 bg-[#1A3797] rounded-full" />
                     <div className="w-2.5 h-0.5 bg-[#1A3797] rounded-full" />
                  </div>
                  
                  {/* Subtle Shadow Effect */}
                  <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] pointer-events-none" />
               </button>

               {/* Support Window (Message Us) */}
               <AnimatePresence>
                  {showSupportModal && (
                     <div className="fixed inset-0 z-[100] flex items-end justify-end p-6 pointer-events-none">
                        <motion.div 
                           initial={{ opacity: 0, y: 20, scale: 0.95 }}
                           animate={{ opacity: 1, y: 0, scale: 1 }}
                           exit={{ opacity: 0, y: 20, scale: 0.95 }}
                           className="w-full max-w-[350px] h-[420px] bg-[#F4F7FF] shadow-2xl rounded-none overflow-hidden border border-zinc-200 pointer-events-auto flex flex-col mb-20 mr-2"
                        >
                           {/* Window Title Bar */}
                           <div className="bg-white/70 backdrop-blur-md px-8 py-6 border-b border-zinc-100 relative flex flex-col items-start">
                              <button 
                                 onClick={() => setShowSupportModal(false)}
                                 className="absolute top-6 right-6 h-8 w-8 bg-zinc-50 text-zinc-400 rounded-none flex items-center justify-center hover:bg-zinc-100 hover:text-black transition-all"
                              >
                                 <X size={16} />
                              </button>
                              
                              <div className="h-9 w-9 bg-zinc-900 text-white rounded-none flex items-center justify-center mb-4 shadow-sm shadow-zinc-200">
                                 <MessageSquare size={16} />
                              </div>
                              
                              <h3 className="text-base font-bold text-zinc-900 tracking-tight">Help center</h3>
                              <p className="text-zinc-400 text-[10px] mt-0.5 font-medium">We are here to help you</p>
                           </div>

                           {/* Support Link */}
                           <div className="flex-1 p-6 flex flex-col justify-center">
                              <a 
                                 href="https://www.redlix.co.in/intern-support" 
                                 target="_blank"
                                 className="group p-5 bg-white border border-zinc-100 rounded-none flex items-center gap-4 hover:border-zinc-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all"
                              >
                                 <div className="h-10 w-10 rounded-none bg-zinc-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                    <MessageCircle size={16} />
                                 </div>
                                 <div className="flex-1">
                                    <h4 className="text-[12px] font-bold text-zinc-900 leading-none mb-1.5">Contact support</h4>
                                    <p className="text-[10px] text-zinc-400 font-medium">Get assistance from our team</p>
                                 </div>
                                 <ArrowRight size={14} className="text-zinc-300 group-hover:text-black transition-colors" />
                              </a>
                           </div>

                           {/* Footer */}
                           <div className="p-4 flex items-center justify-center gap-3 border-t border-zinc-100 bg-white/50">
                              <span className="text-[10px] font-medium text-zinc-400">Powered by</span>
                              <img 
                                 src="https://ik.imagekit.io/dypkhqxip/redlixlogo" 
                                 alt="Redlix" 
                                 className="h-4 w-auto drop-shadow-sm"
                              />
                           </div>
                        </motion.div>
                     </div>
                  )}
               </AnimatePresence>
            </motion.div>
         )}

         {activeTab === "kanban" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
               { }
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                     <h2 className="text-xl font-bold text-zinc-900">Agile Workspace</h2>
                     <p className="text-xs text-zinc-400 mt-0.5">Segregate your internal tasks and manage your daily workflow.</p>
                  </div>
                  <button
                     onClick={() => setIsAddingPersonalTask(true)}
                     className="h-10 px-6 bg-zinc-900 text-white text-[11px] font-bold flex items-center gap-2 hover:bg-[#0055FF] transition-all rounded-lg"
                  >
                     <Plus size={14} /> New Task
                  </button>
               </div>

               { }
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {(["TODO", "IN_PROGRESS", "DONE"] as const).map((status) => {
                     const col = {
                        TODO: {
                           bg: "bg-blue-50/60",
                           border: "border-blue-100",
                           headerText: "text-blue-600",
                           headerBg: "bg-blue-100/70",
                           dot: "text-blue-400",
                           cardBg: "bg-white",
                           cardBorder: "border-blue-100",
                           cardHover: "hover:border-blue-300 hover:shadow-blue-50",
                           divider: "border-blue-50",
                           actionColor: "text-blue-500 hover:text-blue-700",
                           emptyBorder: "border-blue-100",
                           emptyText: "text-blue-200",
                           label: "Todo",
                        },
                        IN_PROGRESS: {
                           bg: "bg-amber-50/60",
                           border: "border-amber-100",
                           headerText: "text-amber-700",
                           headerBg: "bg-amber-100/70",
                           dot: "text-amber-400",
                           cardBg: "bg-white",
                           cardBorder: "border-amber-100",
                           cardHover: "hover:border-amber-300 hover:shadow-amber-50",
                           divider: "border-amber-50",
                           actionColor: "text-amber-500 hover:text-amber-700",
                           emptyBorder: "border-amber-100",
                           emptyText: "text-amber-200",
                           label: "In Progress",
                        },
                        DONE: {
                           bg: "bg-emerald-50/60",
                           border: "border-emerald-100",
                           headerText: "text-emerald-700",
                           headerBg: "bg-emerald-100/70",
                           dot: "text-emerald-500",
                           cardBg: "bg-white",
                           cardBorder: "border-emerald-100",
                           cardHover: "hover:border-emerald-300 hover:shadow-emerald-50",
                           divider: "border-emerald-50",
                           actionColor: "text-emerald-500 hover:text-emerald-700",
                           emptyBorder: "border-emerald-100",
                           emptyText: "text-emerald-200",
                           label: "Done",
                        },
                     }[status];

                     const columnTasks = personalTasks.filter(t => t.status === status);

                     return (
                        <div key={status} className={`flex flex-col gap-3 rounded-2xl p-4 border ${col.bg} ${col.border}`}>
                           { }
                           <div className={`flex items-center justify-between px-3 py-2 rounded-xl ${col.headerBg}`}>
                              <h3 className={`text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 ${col.headerText}`}>
                                 <Circle size={8} fill="currentColor" className={col.dot} />
                                 {col.label}
                              </h3>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/70 ${col.headerText}`}>
                                 {columnTasks.length}
                              </span>
                           </div>

                           { }
                           <div className="space-y-2.5 min-h-[180px]">
                              {columnTasks.map((task) => (
                                 <div
                                    key={task.id}
                                    className={`p-4 rounded-xl border shadow-sm transition-all group ${col.cardBg} ${col.cardBorder} ${col.cardHover}`}
                                 >
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                       <h4 className="text-sm font-bold text-zinc-800 leading-snug">{task.title}</h4>
                                       <button
                                          onClick={() => deletePersonalTask(task.id)}
                                          className="text-zinc-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                                       >
                                          <Trash2 size={13} />
                                       </button>
                                    </div>
                                    {task.description && (
                                       <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">{task.description}</p>
                                    )}
                                    <div className={`flex items-center gap-1.5 pt-3 border-t ${col.divider}`}>
                                       {status !== "TODO" && (
                                          <button
                                             onClick={() => updatePersonalTaskStatus(task.id, status === "IN_PROGRESS" ? "TODO" : "IN_PROGRESS")}
                                             className="text-[9px] font-bold text-zinc-400 hover:text-zinc-600 uppercase"
                                          >
                                             ← {status === "IN_PROGRESS" ? "Back" : "Reopen"}
                                          </button>
                                       )}
                                       {status !== "DONE" && (
                                          <button
                                             onClick={() => updatePersonalTaskStatus(task.id, status === "TODO" ? "IN_PROGRESS" : "DONE")}
                                             className={`ml-auto text-[9px] font-bold uppercase ${col.actionColor}`}
                                          >
                                             {status === "TODO" ? "Start →" : "Complete →"}
                                          </button>
                                       )}
                                    </div>
                                 </div>
                              ))}

                              {columnTasks.length === 0 && (
                                 <div className={`py-10 border-2 border-dashed rounded-xl flex flex-col items-center justify-center ${col.emptyBorder}`}>
                                    <Activity size={18} className={`mb-1.5 ${col.emptyText}`} />
                                    <p className={`text-[9px] font-bold uppercase tracking-widest ${col.emptyText}`}>No tasks</p>
                                 </div>
                              )}
                           </div>
                        </div>
                     );
                  })}
               </div>

               { }
               <AnimatePresence>
                  {isAddingPersonalTask && (
                     <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
                        <motion.div
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, scale: 0.95 }}
                           className="bg-white w-full max-w-md p-8 rounded-2xl border border-zinc-100 shadow-2xl relative"
                        >
                           <button onClick={() => setIsAddingPersonalTask(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-black">
                              <X size={20} />
                           </button>
                           <div className="mb-7">
                              <h3 className="text-sm font-bold text-zinc-900 border-l-4 border-blue-400 pl-3 uppercase tracking-tight">Create Task</h3>
                              <p className="text-[11px] text-zinc-400 font-medium mt-1.5">Add a new task to your Agile workspace.</p>
                           </div>
                           <form onSubmit={handleAddPersonalTask} className="space-y-4">
                              <div className="space-y-1.5">
                                 <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Task Title</label>
                                 <input
                                    required
                                    type="text"
                                    value={newPersonalTask.title}
                                    onChange={(e) => setNewPersonalTask({ ...newPersonalTask, title: e.target.value })}
                                    className="w-full h-11 bg-blue-50/50 border border-blue-100 rounded-lg px-4 text-sm font-semibold outline-none focus:bg-white focus:border-blue-300 transition-all"
                                    placeholder="e.g., Implement sidebar logic..."
                                 />
                              </div>
                              <div className="space-y-1.5">
                                 <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Description</label>
                                 <textarea
                                    value={newPersonalTask.description}
                                    onChange={(e) => setNewPersonalTask({ ...newPersonalTask, description: e.target.value })}
                                    className="w-full h-24 bg-blue-50/50 border border-blue-100 rounded-lg p-4 text-sm font-medium outline-none focus:bg-white focus:border-blue-300 transition-all resize-none"
                                    placeholder="Add notes about this task..."
                                 />
                              </div>
                              <div className="pt-3 flex gap-3">
                                 <button type="button" onClick={() => setIsAddingPersonalTask(false)} className="flex-1 h-11 rounded-lg border border-zinc-200 text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-50 text-zinc-600">
                                    Cancel
                                 </button>
                                 <button type="submit" disabled={isSavingPersonalTask} className="flex-1 h-11 rounded-lg bg-blue-500 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-blue-600 disabled:opacity-50 transition-all">
                                    {isSavingPersonalTask ? "Saving..." : "Create Task"}
                                 </button>
                              </div>
                           </form>
                        </motion.div>
                     </div>
                  )}
               </AnimatePresence>
            </motion.div>
         )}


         {activeTab === "chat" && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="h-[calc(100vh-12rem)] lg:h-[calc(100vh-16rem)] min-h-[500px] flex bg-white border border-zinc-200 rounded-none shadow-2xl shadow-zinc-200/50 overflow-hidden text-left mb-6 relative">
               { }
               <aside className={`${showChatSidebar ? "flex" : "hidden"} lg:flex absolute inset-0 z-20 lg:relative lg:inset-auto w-full lg:w-72 bg-zinc-50/50 border-r border-zinc-100 flex-col shrink-0`}>
                  <div className="p-6 border-b border-zinc-100 bg-white/50 backdrop-blur-sm flex items-center justify-between">
                     <div>
                        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest leading-none">Team Relay</h3>
                        <p className="text-[10px] text-zinc-400 mt-2 font-medium">Internal communication</p>
                     </div>
                     <button onClick={() => setShowChatSidebar(false)} className="lg:hidden p-2 text-zinc-400">
                        <ChevronRight size={18} />
                     </button>
                  </div>

                  <div className="flex-1 overflow-y-auto no-scrollbar py-4">
                     { }
                     <div className="px-4 mb-6">
                        <button
                           onClick={() => { setSelectedUser(null); setShowChatSidebar(false); }}
                           className={`w-full flex items-center gap-3 p-3 text-xs font-bold transition-all rounded-none mb-2 ${!selectedUser ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200" : "hover:bg-zinc-200/50 text-zinc-600"}`}
                        >
                           <Users size={16} /> Group Enclave
                        </button>

                        <div className="h-px bg-zinc-200 my-4 mx-2" />

                        <p className="px-3 py-2 text-[10px] font-bold text-zinc-400 font-bold tracking-tight">Teammates</p>
                        <div className="space-y-1 mt-1">
                           {(() => {
                              const activeSchedule = schedules.find(s => s.id === activeTeamId) || schedules.find(s => s.teamInternIds?.length > 0);
                              const teamIds = activeSchedule?.teamInternIds || [];
                              const teamPeers = teamIds.filter(id => id !== user.id);

                              if (teamPeers.length === 0) {
                                 return (
                                    <div className="p-6 text-center">
                                       <p className="text-[10px] text-zinc-300 font-bold tracking-wider">No teammates yet</p>
                                    </div>
                                 );
                              }

                              return teamPeers.map((peerId, i) => {
                                 const peer = allInterns.find(it => it.id === peerId);
                                 if (!peer) return null;
                                 return (
                                    <button
                                       key={i}
                                       onClick={() => { setSelectedUser(peer); setShowChatSidebar(false); }}
                                       className={`w-full flex items-center gap-3 p-2.5 transition-all rounded-none mb-1 ${selectedUser?.id === peer.id ? "bg-white border border-zinc-200 shadow-sm text-zinc-900" : "text-zinc-500 hover:bg-white hover:shadow-sm"}`}
                                    >
                                       <div className="h-9 w-9 bg-zinc-100 text-zinc-900 flex items-center justify-center text-xs font-bold rounded-none shrink-0">
                                          {peer.name[0]}
                                       </div>
                                       <div className="text-left overflow-hidden">
                                          <p className="text-xs font-bold truncate leading-none mb-1">{peer.name}</p>
                                          <div className="flex items-center gap-1">
                                             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                             <p className="text-[9px] font-bold text-zinc-400 font-bold">Mission Active</p>
                                          </div>
                                       </div>
                                    </button>
                                 );
                              });
                           })()}
                        </div>
                     </div>
                  </div>

                  { }
                  <div className="p-4 bg-zinc-100/50 border-t border-zinc-200 flex items-center gap-3">
                     <div className="h-9 w-9 bg-black text-white flex items-center justify-center text-xs font-bold rounded-none">
                        {user.name[0]}
                     </div>
                     <div className="overflow-hidden">
                        <p className="text-xs font-bold text-zinc-900 truncate leading-none mb-1">{user.name}</p>
                        <p className="text-[9px] font-bold text-zinc-400 font-bold">You</p>
                     </div>
                  </div>
               </aside>

                             <div className={`flex-1 flex flex-col bg-white overflow-hidden ${!showChatSidebar ? "flex" : "hidden lg:flex"}`}>
                  {/* Window Header */}
                  <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-white sticky top-0 z-10">
                     <div className="flex items-center gap-4 truncate">
                        <button onClick={() => setShowChatSidebar(true)} className="lg:hidden p-2 -ml-2 text-zinc-400 hover:text-black transition-colors">
                           <ChevronLeft size={20} />
                        </button>
                        <div className="h-10 w-10 bg-zinc-900 text-white flex items-center justify-center rounded-none shadow-inner shrink-0">
                           {selectedUser ? <User size={18} /> : <Users size={18} />}
                        </div>
                        <div className="truncate">
                           <h2 className="text-sm font-bold text-zinc-900 leading-none mb-1.5 truncate">
                              {selectedUser ? selectedUser.name : (schedules.find(s => s.week.includes("Week 2"))?.teamAllocation || "Group Enclave")}
                           </h2>
                           <div className="flex items-center gap-2">
                              <div className={`h-1.5 w-1.5 rounded-full ${
                                 socketStatus === "connected" ? "bg-emerald-500 animate-pulse" : 
                                 socketStatus === "connecting" ? "bg-amber-500" : "bg-rose-500"
                              }`} />
                              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
                                 {socketStatus === "connected" ? "Live session" : 
                                  socketStatus === "connecting" ? "Syncing... " : "Offline"}
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>

                  { }
                  <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 lg:space-y-8 bg-zinc-50/30 no-scrollbar">
                     {messages.filter(m =>
                        selectedUser
                           ? (m.senderId === selectedUser.id || (m.senderId === user.id && m.targetId === selectedUser.id))
                           : (!m.targetId)
                     ).length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8">
                           <img src="https://ik.imagekit.io/dypkhqxip/Messaging-bro.svg" alt="No messages" className="w-48 lg:w-64 h-auto mb-6" />
                           <p className="text-sm font-bold text-zinc-900 leading-none mb-2">No conversations found</p>
                           <p className="text-[11px] text-zinc-400 font-bold">Start a new chat with your teammates.</p>
                        </div>
                     ) : (
                        messages.filter(m =>
                           selectedUser
                              ? (m.senderId === selectedUser.id || (m.senderId === user.id && m.targetId === selectedUser.id))
                              : (!m.targetId)
                        ).map((msg, i) => {
                           const isOwn = msg.senderId === user.id;
                           return (
                              <div key={i} className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                                 <div className={`max-w-[85%] lg:max-w-[70%] ${isOwn ? "text-right" : "text-left"}`}>
                                    {!isOwn && (
                                       <span className="text-[9px] lg:text-[10px] font-bold text-zinc-400 mb-1 lg:mb-2 block px-1">
                                          {msg.senderName}
                                       </span>
                                    )}
                                    <div className={`px-4 py-3 ${isOwn ? "bg-zinc-900 text-white rounded-none shadow-sm" : "bg-white border border-zinc-100 text-zinc-900 rounded-none shadow-sm"}`}>
                                       <p className="text-[13px] font-medium leading-relaxed">{msg.content}</p>
                                       <span className={`text-[8px] font-bold block mt-2 opacity-50 ${isOwn ? "text-zinc-400" : "text-zinc-500"}`}>
                                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                       </span>
                                    </div>
                                 </div>
                              </div>
                           );
                        })
                     )}
                     <div ref={chatEndRef} />
                  </div>

                  {/* Input Window */}
                  <form onSubmit={handleSendMessage} className="p-4 bg-zinc-50/50 border-t border-zinc-100 flex gap-3">
                     <div className="flex-1 relative">
                        <input
                           type="text"
                           value={inputText}
                           onChange={(e) => setInputText(e.target.value)}
                           className="w-full pl-6 pr-12 h-12 bg-white border border-zinc-200 text-sm font-medium rounded-none focus:border-zinc-400 outline-none transition-all shadow-sm placeholder:text-zinc-300"
                           placeholder={selectedUser ? `Reply to ${selectedUser.name.split(' ')[0]}...` : "Message group..."}
                        />
                     </div>
                     <button type="submit" disabled={!activeTeamId || !inputText.trim()} className="h-12 w-12 bg-zinc-900 text-white hover:bg-black transition-all rounded-none disabled:opacity-30 active:scale-95 flex items-center justify-center shadow-lg shadow-zinc-200">
                        <Send size={18} />
                     </button>
                  </form>
               </div>
            </motion.div>
         )}

         {activeTab === "tasks" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-left">
               <div><h2 className="text-xl font-bold text-zinc-900">Active assignments</h2><p className="text-xs text-zinc-400 mt-0.5">Your current tasks and goals.</p></div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tasks.map((task, idx) => {
                     const colors = [{ bg: "bg-blue-50/50", border: "border-blue-100", accent: "text-blue-600", dot: "bg-blue-500" }, { bg: "bg-emerald-50/50", border: "border-emerald-100", accent: "text-emerald-600", dot: "bg-emerald-500" }, { bg: "bg-indigo-50/50", border: "border-indigo-100", accent: "text-indigo-600", dot: "bg-indigo-500" }, { bg: "bg-amber-50/50", border: "border-amber-100", accent: "text-amber-600", dot: "bg-amber-500" }];
                     const theme = colors[idx % colors.length];
                     return (
                        <div key={task.id} className={`p-6 border ${theme.border} ${theme.bg} transition-all flex flex-col h-full text-left`}>
                           <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><div className={`h-1.5 w-1.5 ${theme.dot}`} /><span className={`text-[10px] font-bold ${theme.accent}`}>{task.status === "pending" ? "Todo" : "Done"}</span></div><span className="text-[10px] text-zinc-400">{new Date(task.createdAt).toLocaleDateString()}</span></div>
                           <h3 className="text-sm font-bold text-zinc-900 mb-2 leading-tight">{task.title}</h3>
                           <p className="text-xs text-zinc-500 leading-relaxed mb-6 flex-1">{task.description}</p>
                           <div className="pt-4 border-t border-zinc-900/5 flex flex-col gap-3 mt-auto">
                              <div className="flex items-center justify-between">
                                 {task.attachmentUrl ? <a href={task.attachmentUrl} target="_blank" className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-[#0055FF] transition-colors">Files <Download size={12} /></a> : <span className="text-[10px] text-zinc-300 italic">No files</span>}
                              </div>
                              <div className="flex gap-2">
                                 <button 
                                    onClick={() => {
                                       setSelectedTaskForSubmit(task);
                                       setTaskSubmissionForm({ ...taskSubmissionForm, name: user.name });
                                       setShowTaskSubmissionModal(true);
                                    }}
                                    className="flex-1 h-10 bg-black text-white text-[11px] font-bold uppercase tracking-wider hover:bg-blue-600 transition-all"
                                 >
                                    Submit
                                 </button>
                                 <button 
                                    onClick={() => updateTaskStatus(task.id, task.status)}
                                    className={`flex-1 h-10 text-[11px] font-bold uppercase tracking-wider transition-all border ${task.status === "completed" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50"}`}
                                 >
                                    {task.status === "completed" ? (
                                       <span className="flex items-center justify-center gap-1"><Check size={12} /> Done</span>
                                    ) : "Done"}
                                 </button>
                              </div>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </motion.div>
         )}

         {activeTab === "attendance" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
               {/* Page Header */}
               <header className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="h-1 w-6 bg-[#0055FF]" />
                     <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Attendance Log</span>
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900">Weekly <span className="text-[#0055FF]">Tracking</span></h2>
                  <p className="text-zinc-500 text-sm mt-1">Check your performance and attendance history.</p>
               </header>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col justify-between">
                     <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Average Rate</h4>
                        <p className="text-3xl font-bold text-zinc-900">{attendancePercentage}%</p>
                     </div>
                     <div className="mt-4">
                        <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                           <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${attendancePercentage}%` }}
                              className="h-full bg-[#0055FF]"
                           />
                        </div>
                        <p className="text-[10px] font-bold text-zinc-400 mt-2">{attendanceCount} Days Present</p>
                     </div>
                  </div>

                  <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col justify-between">
                     <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Status</h4>
                        <div className="flex items-center gap-2">
                           <div className={`h-2 w-2 rounded-full ${attendancePercentage >= 75 ? "bg-green-500" : "bg-amber-500"}`} />
                           <p className="text-lg font-bold text-zinc-900">{attendancePercentage >= 75 ? "Satisfactory" : "Low Attendance"}</p>
                        </div>
                     </div>
                     <p className="text-[10px] text-zinc-400 font-medium leading-tight mt-2">Required: 75% for certification.</p>
                  </div>

                  <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col justify-between">
                     <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Consistency</h4>
                        <p className="text-xl font-bold text-zinc-900">Steady</p>
                     </div>
                     <div className="flex gap-1 mt-4">
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                           <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 6 ? "bg-green-500" : "bg-zinc-100"}`} />
                        ))}
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                     <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Recent Activity</h3>
                     <span className="text-[10px] text-zinc-400">Latest records</span>
                  </div>
                  
                  <div className="bg-white border border-zinc-100 rounded-xl overflow-hidden shadow-sm">
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                           <thead className="bg-zinc-50/50 border-b border-zinc-100">
                              <tr>
                                 <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Session Date</th>
                                 <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Type</th>
                                 <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Status</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-zinc-50">
                              {attendanceData.history.map((log: any) => (
                                 <tr key={log.id} className="hover:bg-zinc-50/50 transition-all group">
                                    <td className="px-6 py-4">
                                       <div className="flex items-center gap-3">
                                          <div className="h-8 w-8 rounded-lg bg-zinc-50 flex flex-col items-center justify-center border border-zinc-100">
                                             <span className="text-[10px] font-bold text-[#003366] leading-none">{new Date(log.date).getDate()}</span>
                                             <span className="text-[7px] font-bold text-zinc-400 uppercase">{new Date(log.date).toLocaleString("default", { month: "short" })}</span>
                                          </div>
                                          <div>
                                             <p className="text-[13px] font-bold text-zinc-800">{new Date(log.date).toLocaleDateString(undefined, { weekday: "long" })}</p>
                                             <p className="text-[10px] text-zinc-400 font-medium">Regular Session</p>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="px-6 py-4">
                                       <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase tracking-tighter">Classroom</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                                          log.status === "PRESENT" ? "bg-emerald-50 text-emerald-600" : 
                                          log.status === "LATE" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
                                       }`}>
                                          {log.status === "PRESENT" ? "Present" : log.status === "LATE" ? "Late" : "Absent"}
                                       </span>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            </motion.div>
         )}
         {activeTab === "internships" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-left">
               <header className="pb-4 border-b border-zinc-100">
                  <h1 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                     <Briefcase className="text-[#003366]" size={20} /> Open Internships
                  </h1>
                  <p className="text-zinc-500 text-sm mt-1">Explore opportunities and build your career with premium roles.</p>
               </header>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Available Roles</h3>
                     {internships.length > 0 ? (
                        internships.map((job) => {
                           const hasApplied = myApplications.some(app => app.internshipId === job.id);
                           return (
                              <div key={job.id} className="bg-white border border-zinc-200 p-6 rounded-2xl hover:shadow-xl transition-all group relative overflow-hidden">
                                 <div className="absolute top-0 right-0 p-4">
                                    {hasApplied ? (
                                       <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
                                          <CheckCircle2 size={12} /> Applied
                                       </span>
                                    ) : (
                                       <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-100">
                                          New Role
                                       </span>
                                    )}
                                 </div>
                                 
                                 <div className="flex flex-col h-full">
                                    <div className="space-y-1 mb-4">
                                       <h4 className="text-lg font-bold text-zinc-900 group-hover:text-[#003366] transition-colors">{job.title}</h4>
                                       <p className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wide">{job.company}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                       <div className="flex items-center gap-2 text-zinc-400">
                                          <MapPin size={14} className="text-zinc-300" />
                                          <span className="text-xs font-medium">{job.location || "Remote"}</span>
                                       </div>
                                       <div className="flex items-center gap-2 text-zinc-400">
                                          <Clock size={14} className="text-zinc-300" />
                                          <span className="text-xs font-medium">{job.duration || "3 Months"}</span>
                                       </div>
                                       <div className="flex items-center gap-2 text-zinc-400">
                                          <Trophy size={14} className="text-zinc-300" />
                                          <span className="text-xs font-medium">{job.stipend || "Performance Based"}</span>
                                       </div>
                                       <div className="flex items-center gap-2 text-zinc-400">
                                          <Target size={14} className="text-zinc-300" />
                                          <span className="text-xs font-medium">{job.role || "Internship"}</span>
                                       </div>
                                    </div>

                                    <p className="text-[12px] text-zinc-500 leading-relaxed mb-6 line-clamp-3">
                                       {job.description}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-zinc-50 flex items-center justify-between gap-3">
                                       <button 
                                          onClick={() => handleApply(job.id)}
                                          disabled={hasApplied || isApplying === job.id}
                                          className={`flex-1 h-11 rounded-xl text-[12px] font-bold uppercase tracking-widest transition-all ${
                                             hasApplied 
                                             ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" 
                                             : "bg-black text-white hover:bg-[#003366] shadow-lg shadow-black/5"
                                          }`}
                                       >
                                          {isApplying === job.id ? "Applying..." : hasApplied ? "Application Sent" : "Apply with Forge Resume"}
                                       </button>
                                       {job.applyLink && !hasApplied && (
                                          <a 
                                             href={job.applyLink} 
                                             target="_blank" 
                                             className="px-4 h-11 border border-zinc-200 text-zinc-400 rounded-xl flex items-center justify-center hover:bg-zinc-50 transition-all"
                                          >
                                             <ArrowUpRight size={18} />
                                          </a>
                                       )}
                                    </div>
                                 </div>
                              </div>
                           );
                        })
                     ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl">
                           <Briefcase size={40} className="text-zinc-200 mb-4" />
                           <h4 className="text-sm font-bold text-zinc-900">No active roles right now</h4>
                           <p className="text-xs text-zinc-500 max-w-xs mt-1">Check back later or explore the roadmap for upcoming missions.</p>
                        </div>
                     )}
                  </div>

                  <div className="space-y-4">
                     <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">My Applications</h3>
                     <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
                        {myApplications.length > 0 ? (
                           <div className="divide-y divide-zinc-100">
                              {myApplications.map((app) => (
                                 <div key={app.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                       <div className="h-10 w-10 bg-zinc-100 rounded-lg flex items-center justify-center text-[#003366]">
                                          <CheckCircle2 size={18} />
                                       </div>
                                       <div>
                                          <p className="text-sm font-bold text-zinc-900">{app.internship?.title || "Role Title"}</p>
                                          <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">{app.internship?.company || "Company"} • {new Date(app.createdAt).toLocaleDateString()}</p>
                                       </div>
                                    </div>
                                    <span className={`text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest ${
                                       app.status === "PENDING" ? "bg-amber-50 text-amber-600" :
                                       app.status === "REVIEWED" ? "bg-blue-50 text-blue-600" :
                                       app.status === "ACCEPTED" ? "bg-emerald-50 text-emerald-600" :
                                       "bg-zinc-100 text-zinc-400"
                                    }`}>
                                       {app.status}
                                    </span>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="p-12 text-center">
                              <p className="text-xs text-zinc-400 font-medium italic">No applications submitted yet.</p>
                           </div>
                        )}
                     </div>

                     <div className="bg-[#003366] p-6 rounded-2xl text-white space-y-4 relative overflow-hidden">
                        <Sparkles className="absolute top-0 right-0 text-white/10 -m-4" size={100} />
                        <div className="relative z-10">
                           <h4 className="text-sm font-bold">Forge Career Guide</h4>
                           <p className="text-xs text-white/70 leading-relaxed mt-2">
                              Your Forge Resume is automatically updated with your latest achievements and project scores. Keep building to increase your selection chances!
                           </p>
                           <Link 
                              href="/intern/dashboard/resume"
                              className="inline-flex items-center gap-2 text-xs font-bold mt-4 hover:underline"
                           >
                              Refine Resume <ArrowRight size={14} />
                           </Link>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
         )}

         {activeTab === "reports" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl text-left">
               <header className="pb-4">
                  <h1 className="text-xl font-bold text-zinc-900">My reports</h1>
                  <p className="text-zinc-500 text-sm mt-1">Check your results and feedback from review sessions.</p>
               </header>

               <div className="grid grid-cols-1 gap-4">
                  {loadingReports ? (
                     <div className="py-12 flex flex-col items-center justify-center gap-2 bg-zinc-50 border border-zinc-100">
                        <RefreshCw className="animate-spin text-zinc-300" size={20} />
                        <p className="text-zinc-400 text-xs">Loading records...</p>
                     </div>
                  ) : reports.length > 0 ? (
                     reports.map((report) => (
                        <div key={report.id} className="bg-white border border-zinc-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-zinc-300 transition-all group">
                           <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                 <span className="text-[10px] font-medium px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100">
                                    {report.schedule.week}
                                 </span>
                                 <span className="text-zinc-300">|</span>
                                 <span className="text-[10px] text-zinc-400 font-medium">
                                    Checked on {new Date(report.reviewedAt).toLocaleDateString()}
                                 </span>
                              </div>

                              <div>
                                 <h3 className="text-sm font-bold text-zinc-900 leading-tight">
                                    {report.schedule.typeOfWork}
                                 </h3>
                                 <div className="mt-1 p-3 bg-zinc-50 border border-zinc-100 relative">
                                    <p className="text-xs text-zinc-600 leading-relaxed">
                                       "{report.review || "Standard evaluation completed. Overall performance remains consistent."}"
                                    </p>
                                 </div>
                              </div>
                           </div>

                           <div className="flex items-center gap-4 shrink-0 md:pl-4 md:border-l border-zinc-100 min-w-[100px] justify-end">
                              <div className="text-right">
                                 <div className="flex items-baseline justify-end gap-1">
                                    <span className="text-2xl font-bold text-zinc-900 leading-none">
                                       {report.marks}
                                    </span>
                                    <span className="text-xs font-medium text-zinc-400">/ 100</span>
                                 </div>
                                 <p className="text-[10px] text-zinc-400 font-medium mt-1">Score</p>
                                 <div className="w-16 h-1 bg-zinc-100 rounded-full mt-2 overflow-hidden">
                                    <div
                                       className={`h-full transition-all duration-1000 ${Number(report.marks) >= 75 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                       style={{ width: `${report.marks}%` }}
                                    />
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))
                  ) : (
                     <div className="py-12 flex flex-col items-center justify-center text-center bg-zinc-50 border border-zinc-200 border-dashed">
                        <div className="h-12 w-12 bg-white border border-zinc-200 flex items-center justify-center mb-3">
                           <FileTextIcon size={20} className="text-zinc-200" />
                        </div>
                        <h4 className="text-sm font-bold text-zinc-900">No records found</h4>
                        <p className="text-xs text-zinc-500 max-w-sm mt-1">Your weekly results will appear here after review.</p>
                     </div>
                  )}
               </div>
            </motion.div>
         )}



         <AnimatePresence>
            {showLetterModal && userStatus?.letterUrl && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white max-w-[300px] w-full p-6 border border-zinc-100 rounded-xl shadow-xl relative text-center">
                     <button onClick={() => { setShowLetterModal(false); localStorage.setItem(`letter_ack_${user.id}`, userStatus.letterUrl); }} className="absolute top-3 right-3 text-zinc-300 hover:text-zinc-600 transition-colors"><X size={16} /></button>

                     <div className="mx-auto h-10 w-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                        <FileBadge size={20} />
                     </div>

                     <div className="space-y-1 mb-6">
                        <h2 className="text-[15px] font-bold text-zinc-900">Letter Ready</h2>
                        <p className="text-[12px] font-medium text-zinc-500 leading-snug">
                           Your internship letter is ready. Download it now to verify your role.
                        </p>
                     </div>

                     <div className="flex flex-col gap-2">
                        <a href={userStatus.letterUrl} target="_blank" rel="noopener noreferrer" onClick={() => { setShowLetterModal(false); localStorage.setItem(`letter_ack_${user.id}`, userStatus.letterUrl); }} className="h-10 w-full bg-[#0055FF] text-white text-[12px] font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-md shadow-blue-500/20">
                           Download File <Download size={14} />
                        </a>
                        <button onClick={() => { setShowLetterModal(false); localStorage.setItem(`letter_ack_${user.id}`, userStatus.letterUrl); }} className="h-10 w-full text-[12px] font-bold text-zinc-400 hover:text-zinc-900 transition-colors">
                           Close
                        </button>
                     </div>
                  </motion.div>
               </div>
            )}

            {showOfferLetterModal && userStatus?.offerLetterUrl && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white max-w-[300px] w-full p-8 border border-zinc-100 rounded-2xl shadow-2xl relative text-center">
                     <button onClick={() => { setShowOfferLetterModal(false); localStorage.setItem(`offer_letter_ack_${user.id}`, userStatus.offerLetterUrl); }} className="absolute top-4 right-4 text-zinc-300 hover:text-zinc-600 transition-colors"><X size={18} /></button>

                     <div className="mx-auto h-12 w-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-5">
                        <ShieldCheck size={24} />
                     </div>

                     <div className="space-y-1.5 mb-7">
                        <h2 className="text-lg font-bold text-zinc-900">Offer Issued</h2>
                        <p className="text-xs font-medium text-zinc-500 leading-relaxed px-2">
                           Congratulations! Your official internship offer documents have been synchronized.
                        </p>
                     </div>

                     <div className="flex flex-col gap-3">
                        <a href={userStatus.offerLetterUrl} target="_blank" rel="noopener noreferrer" onClick={() => { setShowOfferLetterModal(false); localStorage.setItem(`offer_letter_ack_${user.id}`, userStatus.offerLetterUrl); }} className="h-12 w-full bg-zinc-900 text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all rounded-xl shadow-lg shadow-blue-600/10">
                           View Offer <Download size={15} />
                        </a>
                        <button onClick={() => { setShowOfferLetterModal(false); localStorage.setItem(`offer_letter_ack_${user.id}`, userStatus.offerLetterUrl); }} className="text-[11px] font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest">
                           Dismiss
                        </button>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
         {/* UI/UX Task Submission Modal */}
         <AnimatePresence>
            {showUIUXModal && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
               >
                  <motion.div
                     initial={{ scale: 0.95, y: 16 }}
                     animate={{ scale: 1, y: 0 }}
                     className="bg-white max-w-md w-full shadow-xl rounded-lg overflow-hidden"
                  >
                     <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
                        <div>
                           <h2 className="text-base font-semibold text-zinc-800">Submit your task</h2>
                           <p className="text-xs text-zinc-400 mt-0.5">UI/UX Development track submission</p>
                        </div>
                        <button onClick={() => setShowUIUXModal(false)} className="text-zinc-300 hover:text-zinc-600 transition-colors">
                           <X size={18} />
                        </button>
                     </div>
                     <form onSubmit={handleUIUXSubmit} className="p-6 space-y-4">
                        {uiuxSuccess ? (
                           <div className="py-8 text-center">
                              <CheckCircle2 className="mx-auto text-emerald-500 mb-3" size={32} />
                              <p className="text-sm font-semibold text-zinc-800">Submitted successfully!</p>
                              <p className="text-xs text-zinc-400 mt-1">Your task has been sent for review.</p>
                           </div>
                        ) : (
                           <>
                              <div className="space-y-1.5">
                                 <label className="text-sm font-medium text-zinc-600">Task name</label>
                                 <input
                                    required
                                    type="text"
                                    placeholder="e.g. Color Theory UI mockup"
                                    className="w-full border border-zinc-200 rounded-md p-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    value={uiuxForm.taskName}
                                    onChange={e => setUiuxForm({ ...uiuxForm, taskName: e.target.value })}
                                 />
                              </div>
                              <div className="space-y-1.5">
                                 <label className="text-sm font-medium text-zinc-600">Task / Live link</label>
                                 <input
                                    required
                                    type="url"
                                    placeholder="https://your-project-link.com"
                                    className="w-full border border-zinc-200 rounded-md p-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    value={uiuxForm.taskLink}
                                    onChange={e => setUiuxForm({ ...uiuxForm, taskLink: e.target.value })}
                                 />
                              </div>
                              <div className="space-y-1.5">
                                 <label className="text-sm font-medium text-zinc-600">GitHub link <span className="text-zinc-400 font-normal">(optional)</span></label>
                                 <input
                                    type="url"
                                    placeholder="https://github.com/you/repo"
                                    className="w-full border border-zinc-200 rounded-md p-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    value={uiuxForm.githubLink}
                                    onChange={e => setUiuxForm({ ...uiuxForm, githubLink: e.target.value })}
                                 />
                              </div>
                              <button
                                 disabled={uiuxSubmitting}
                                 type="submit"
                                 className="w-full bg-blue-600 text-white py-2.5 text-sm font-medium rounded-md hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                              >
                                 {uiuxSubmitting ? <><RefreshCw className="animate-spin" size={15} /> Submitting...</> : <><Send size={14} /> Submit task</>}
                              </button>
                           </>
                        )}
                     </form>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Mandatory Feedback Modal */}
         <AnimatePresence>
            {showFeedbackModal && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
               >
                  <motion.div
                     initial={{ scale: 0.95, y: 20 }}
                     animate={{ scale: 1, y: 0 }}
                     className="bg-white max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-xl rounded-lg"
                  >
                     <div className="p-6 border-b border-zinc-100">
                        <h2 className="text-lg font-semibold text-zinc-800">Quick Feedback</h2>
                        <p className="text-sm text-zinc-400 mt-0.5">Please fill this out before accessing your dashboard.</p>
                     </div>

                     <form onSubmit={handleFeedbackSubmit} className="p-6 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-1.5">
                              <label className="text-sm font-medium text-zinc-600">Your name</label>
                              <input
                                 required
                                 type="text"
                                 placeholder="Enter your full name"
                                 className="w-full border border-zinc-200 rounded-md p-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                 value={feedbackForm.name}
                                 onChange={e => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                              />
                           </div>
                           <div className="space-y-1.5">
                              <label className="text-sm font-medium text-zinc-600">College / University</label>
                              <select
                                 required
                                 className="w-full border border-zinc-200 rounded-md p-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                                 value={feedbackForm.college}
                                 onChange={e => setFeedbackForm({ ...feedbackForm, college: e.target.value })}
                              >
                                 <option value="">Select your college</option>
                                 <option value="CMR Institute of Technology, Hyderabad">CMR Institute of Technology, Hyderabad</option>
                                 <option value="Kamala Institute of Technology, Karimnagar">Kamala Institute of Technology, Karimnagar</option>
                                 <option value="IIT / NIT">IIT / NIT</option>
                                 <option value="VIT University">VIT University</option>
                                 <option value="SRM Institute">SRM Institute</option>
                                 <option value="Anna University">Anna University</option>
                                 <option value="JNTU / Osmania">JNTU / Osmania</option>
                                 <option value="VTU Karnataka">VTU Karnataka</option>
                                 <option value="Delhi University">Delhi University</option>
                                 <option value="Amity / LPU">Amity / LPU</option>
                                 <option value="Other">Other</option>
                              </select>
                           </div>
                        </div>

                        <div className="space-y-1.5">
                           <label className="text-sm font-medium text-zinc-600">How was your exam experience?</label>
                           <textarea
                              required
                              rows={3}
                              placeholder="Share how the exam went, difficulty level, etc."
                              className="w-full border border-zinc-200 rounded-md p-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                              value={feedbackForm.examExperience}
                              onChange={e => setFeedbackForm({ ...feedbackForm, examExperience: e.target.value })}
                           />
                        </div>

                        <div className="space-y-1.5">
                           <label className="text-sm font-medium text-zinc-600">What can we improve?</label>
                           <textarea
                              required
                              rows={3}
                              placeholder="Any suggestions for the platform or process..."
                              className="w-full border border-zinc-200 rounded-md p-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                              value={feedbackForm.upgradeSuggestions}
                              onChange={e => setFeedbackForm({ ...feedbackForm, upgradeSuggestions: e.target.value })}
                           />
                        </div>

                        <div className="space-y-1.5">
                           <label className="text-sm font-medium text-zinc-600">What do you want to learn?</label>
                           <textarea
                              required
                              rows={3}
                              placeholder="e.g. Next.js, AI/ML, DevOps, UI/UX..."
                              className="w-full border border-zinc-200 rounded-md p-2.5 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                              value={feedbackForm.learningGoals}
                              onChange={e => setFeedbackForm({ ...feedbackForm, learningGoals: e.target.value })}
                           />
                        </div>

                        <button
                           disabled={submittingFeedback}
                           type="submit"
                           className="w-full bg-blue-600 text-white py-3 text-sm font-medium rounded-md hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                           {submittingFeedback ? (
                              <>
                                 <RefreshCw className="animate-spin" size={16} />
                                 Submitting...
                              </>
                           ) : (
                              <>
                                 Submit and continue
                                 <Send size={14} />
                              </>
                           )}
                        </button>
                     </form>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>
         <AnimatePresence>
            {showTaskSubmissionModal && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
               >
                  <motion.div
                     initial={{ scale: 0.95, y: 16 }}
                     animate={{ scale: 1, y: 0 }}
                     className="bg-white max-w-md w-full shadow-2xl rounded-2xl overflow-hidden border border-zinc-100"
                  >
                     <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                        <div>
                           <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Submit Assignment</h2>
                           <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1">Assignment: {selectedTaskForSubmit?.title}</p>
                        </div>
                        <button onClick={() => setShowTaskSubmissionModal(false)} className="text-zinc-300 hover:text-zinc-600 transition-colors">
                           <X size={20} />
                        </button>
                     </div>
                     <form onSubmit={handleTaskSubmission} className="p-8 space-y-5">
                        {taskSubmissionSuccess ? (
                           <div className="py-10 text-center space-y-4">
                              <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                                 <CheckCircle2 size={32} />
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-zinc-900 uppercase">Submission Received</p>
                                 <p className="text-[11px] text-zinc-400 font-medium mt-1">Your response has been logged for review.</p>
                              </div>
                           </div>
                        ) : (
                           <>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Full Name</label>
                                 <input
                                    required
                                    type="text"
                                    placeholder="Enter your name"
                                    className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 h-11 text-sm font-semibold outline-none focus:bg-white focus:border-black transition-all"
                                    value={taskSubmissionForm.name}
                                    onChange={e => setTaskSubmissionForm({ ...taskSubmissionForm, name: e.target.value })}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">GitHub Repository Link</label>
                                 <input
                                    required
                                    type="url"
                                    placeholder="https://github.com/username/repo"
                                    className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 h-11 text-sm font-semibold outline-none focus:bg-white focus:border-black transition-all"
                                    value={taskSubmissionForm.githubLink}
                                    onChange={e => setTaskSubmissionForm({ ...taskSubmissionForm, githubLink: e.target.value })}
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Live Deployment Link</label>
                                 <input
                                    required
                                    type="url"
                                    placeholder="https://your-app.vercel.app"
                                    className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-4 h-11 text-sm font-semibold outline-none focus:bg-white focus:border-black transition-all"
                                    value={taskSubmissionForm.liveLink}
                                    onChange={e => setTaskSubmissionForm({ ...taskSubmissionForm, liveLink: e.target.value })}
                                 />
                              </div>
                              <div className="pt-2">
                                 <button
                                    disabled={isSubmittingTask}
                                    type="submit"
                                    className="w-full bg-black text-white h-12 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-black/5"
                                 >
                                    {isSubmittingTask ? <><RefreshCw className="animate-spin" size={14} /> Processing...</> : <><Send size={14} /> Complete Submission</>}
                                 </button>
                              </div>
                           </>
                        )}
                     </form>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
}

export default function InternDashboard() {
   return (
      <Suspense fallback={null}>
         <InternDashboardContent />
      </Suspense>
   );
}
