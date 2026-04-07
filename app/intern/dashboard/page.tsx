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
   Settings,
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
   MoreVertical
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { supabase } from "@/lib/supabase";

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

   
   const [personalTasks, setPersonalTasks] = useState<PersonalTask[]>([]);
   const [isAddingPersonalTask, setIsAddingPersonalTask] = useState(false);
   const [newPersonalTask, setNewPersonalTask] = useState({ title: "", description: "" });
   const [isSavingPersonalTask, setIsSavingPersonalTask] = useState(false);


   // Relay Terminal (Group Chat)
   const [messages, setMessages] = useState<ChatMessage[]>([]);
   const [inputText, setInputText] = useState("");
   const [socket, setSocket] = useState<any>(null);
   const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
   const [selectedUser, setSelectedUser] = useState<any>(null);
   const [allInterns, setAllInterns] = useState<any[]>([]);
   const chatEndRef = useRef<HTMLDivElement>(null);

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
         const syncInterval = setInterval(() => {
            fetchTasks(userData.id, userData.batch);
            fetchStatus(userData.id);
            fetchAttendance(userData.id);
            fetchSchedules(userData.id, userData.batch);
            fetchAllInterns();
            fetch(`/api/intern/personal-tasks?userId=${userData.id}`)
               .then(r => r.json())
               .then(d => { if (d.success) setPersonalTasks(d.tasks); })
               .catch(() => {});
         }, 20000);

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

   const [showChatSidebar, setShowChatSidebar] = useState(true);

   
   useEffect(() => {
      if (user && !socket) {
         const newSocket = io("https://serversf.onrender.com");
         setSocket(newSocket);
         
         
         newSocket.on("receive_message", (msg: ChatMessage) => {
            setMessages(prev => [...prev, msg]);
         });

         return () => {
            newSocket.disconnect();
         };
      }
   }, [user, socket]);

   
   useEffect(() => {
      if (socket && schedules.length > 0 && user) {
         
         const teamSchedule = schedules.find(s => s.week.includes("Week 2") && s.teamInternIds?.length > 0) 
                              || schedules.find(s => s.teamInternIds?.length > 0) 
                              || schedules[0];
         
         const currentTeamId = teamSchedule.id; 
         setActiveTeamId(currentTeamId);
         socket.emit("join_team", currentTeamId);
         
         
         fetch(`/api/messages?teamId=${currentTeamId}`)
            .then(res => res.json())
            .then(data => {
               if (data.success) {
                  const formatted = data.messages.map((m: any) => ({
                    ...m,
                    content: m.content || m.text
                  }));
                  setMessages(formatted);
               }
            });
      }
   }, [socket, schedules, user]);

   useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
         setTasks(data);
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

      const messageData = {
         teamId: activeTeamId,
         senderId: user.id,
         senderName: user.name,
         message: inputText,
         targetId: selectedUser?.id || null,
      };

      socket.emit("send_message", messageData);
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

   return (
      <div className="p-4 lg:p-6 max-w-[1600px] w-full mx-auto bg-white min-h-screen pb-24 lg:pb-6">
         {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
               <div className="mb-8 font-sans flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                     <h1 className="text-xl lg:text-2xl font-bold text-zinc-900 leading-tight">Welcome back, {user.name.split(' ')[0]}</h1>
                     <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold rounded-sm uppercase tracking-tight flex items-center gap-1.5 shrink-0">
                           <Layers size={10} /> {user.batch || "Batch 1"}
                        </span>
                        <span className="px-2 py-0.5 bg-zinc-50 text-zinc-500 border border-zinc-100 text-[10px] font-bold rounded-sm flex items-center gap-1.5">
                           <School size={10} /> {user.college || "Forge Academy Intern"}
                        </span>
                     </div>
                  </div>
                  <p className="text-zinc-400 text-[10px] lg:text-xs font-semibold uppercase tracking-widest bg-zinc-50 px-2 py-1 border border-zinc-100 sm:border-none sm:bg-transparent sm:p-0">Session Active</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 border border-blue-100 bg-blue-50/40 shadow-sm flex flex-col justify-between h-32">
                     <div className="flex items-center justify-between"><span className="text-[10px] font-bold text-blue-600 uppercase tracking-tight">Assignments</span><Briefcase size={16} className="text-blue-500" /></div>
                     <div className="mt-auto"><p className="text-2xl font-bold text-zinc-900">{tasks.filter(t => t.status === 'pending').length}</p><p className="text-[10px] text-blue-500/70 mt-1 uppercase font-bold tracking-tight">Pending tasks</p></div>
                  </div>
                  <div className="p-5 border border-emerald-100 bg-emerald-50/40 shadow-sm flex flex-col justify-between h-32">
                     <div className="flex items-center justify-between"><span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">Attendance</span><Check size={16} className="text-emerald-500" /></div>
                      <div className="mt-auto">
                        <div className="flex items-baseline gap-2">
                           <p className="text-2xl font-bold text-zinc-900">{attendancePercentage}%</p>
                           <span className="text-[10px] text-emerald-500/70 font-bold">({attendanceCount}/{attendanceData.totalTrackingDays} Days)</span>
                        </div>
                        <p className="text-[10px] text-emerald-500/70 mt-1 uppercase font-bold tracking-tight">Mission Presence Ratio</p>
                        <p className="text-[8px] text-zinc-400 mt-2 italic font-medium">*Calculated relative to sessions active since your enrollment</p>
                      </div>
                  </div>
                  <div className="p-5 border border-zinc-200 bg-zinc-50 shadow-sm flex flex-col justify-between h-32">
                     <div className="flex items-center justify-between"><span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">Status</span><FileBadge size={16} className={userStatus?.offerLetterUrl ? "text-emerald-500" : "text-zinc-300"} /></div>
                     <div className="mt-auto"><p className="text-sm font-bold text-zinc-900 uppercase tracking-tight">{userStatus?.offerLetterUrl ? "Letter Issued" : "Processing"}</p><p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold tracking-tight">Current phase</p></div>
                  </div>
                  <div className="p-5 border border-amber-100 bg-amber-50/40 shadow-sm flex flex-col justify-between h-32">
                     <div className="flex items-center justify-between"><span className="text-[10px] font-bold text-amber-600 uppercase tracking-tight">Next shift</span><Calendar size={16} className="text-amber-500" /></div>
                     <div className="mt-auto"><p className="text-sm font-bold text-zinc-900 uppercase tracking-tight">Today, 10:00 AM</p><p className="text-[10px] text-amber-500/70 mt-1 uppercase font-bold tracking-tight">Starting time</p></div>
                  </div>
               </div>
                
               <div className="p-4 bg-red-50 border-l-4 border-red-500 flex items-center gap-3">
                  <Hand size={18} className="text-red-600 shrink-0" />
                  <p className="text-xs font-bold text-red-600 leading-relaxed">
                     Admin notice: Interns make sure to raise your hand whenever you come in for the day, at least once, so that your attendance can be calculated
                  </p>
               </div>

               {isLowAttendance && attendanceData.totalTrackingDays > 0 && (
                  <motion.div 
                     initial={{ opacity: 0, x: -20 }} 
                     animate={{ opacity: 1, x: 0 }}
                     className="p-4 bg-amber-50 border border-amber-200 flex items-center gap-4 shadow-sm"
                  >
                     <div className="h-10 w-10 bg-amber-500 text-white flex items-center justify-center shrink-0 rounded-full">
                        <AlertCircle size={20} />
                     </div>
                     <div className="flex-1">
                        <h3 className="text-xs font-bold text-amber-900 uppercase tracking-tight">Low Attendance Warning</h3>
                        <p className="text-[10px] text-amber-700 mt-1 font-medium leading-relaxed">
                           Your current attendance is <span className="font-bold underline">{attendancePercentage}%</span>. The minimum required attendance is 75%. Please ensure regular attendance to avoid mission termination.
                        </p>
                     </div>
                  </motion.div>
               )}
               {userStatus?.offerLetterUrl && (
                  <div className="p-4 lg:p-6 border border-emerald-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-emerald-200 transition-all">
                     <div className="flex items-start lg:items-center gap-3">
                       <div className="h-10 w-10 bg-zinc-900 text-white flex items-center justify-center shrink-0">
                          <ShieldCheck size={20} />
                       </div>
                       <div>
                          <h3 className="text-xs lg:text-sm font-bold text-zinc-900">Internship offer letter issued</h3>
                          <p className="text-[10px] lg:text-xs text-zinc-500 mt-1 leading-relaxed">Welcome to the forge program. Your official legal documents are ready.</p>
                       </div>
                     </div>
                     <a href={userStatus.offerLetterUrl} target="_blank" className="w-full sm:w-auto h-10 px-6 bg-zinc-900 text-white text-[11px] font-bold flex items-center justify-center gap-2 hover:bg-black transition-all">
                        Download Document <Download size={14} />
                     </a>
                  </div>
               )}

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4 border-t border-zinc-100">
                  <div className="lg:col-span-8 space-y-6">
                     <div className="flex items-center justify-between mb-4"><h2 className="text-xs font-bold text-zinc-400">Active roadmap progression ({user.batch || "Batch 1"})</h2><Link href="/intern/dashboard/schedule" className="text-xs font-bold text-[#0055FF] hover:underline flex items-center gap-1">Full roadmap <ChevronRight size={12} /></Link></div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {schedules.length > 0 ? schedules.slice(0, 2).map((item) => (
                           <div key={item.id} className="p-6 border border-zinc-100 bg-white hover:border-blue-200 transition-all flex flex-col h-full text-left shadow-sm group">
                              <div className="flex items-center justify-between mb-4">
                                 <span className="text-[10px] font-bold text-blue-600 bg-blue-50/50 px-2 py-0.5 border border-blue-100/50">
                                    {item.week}
                                 </span>
                                 {item.isCompleted && <CheckCircle2 size={14} className="text-emerald-500" />}
                              </div>
                              <h3 className="text-sm font-bold text-zinc-900 mb-2 group-hover:text-blue-600 transition-colors">{item.typeOfWork}</h3>
                              <p className="text-xs text-zinc-500 leading-relaxed mb-4 flex-1 line-clamp-3">{item.description}</p>
                              <div className="pt-4 border-t border-zinc-50 flex items-center justify-between mt-auto">
                                 <div className="flex items-center gap-2"><Target size={14} className="text-zinc-300" /><span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">Timeline: {item.deadline.split('T')[0]}</span></div>
                                 <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Ongoing</span>
                              </div>
                           </div>
                        )) : (
                           <div className="col-span-2 p-12 border border-dashed border-zinc-100 bg-zinc-50/30 text-center flex flex-col items-center justify-center">
                              <Map size={24} className="text-zinc-200 mb-2" />
                              <p className="text-xs font-bold text-zinc-400">Roadmap processing for {user.batch || "Batch 1"}</p>
                           </div>
                        )}
                     </div>
                  </div>

                  <aside className="lg:col-span-4 space-y-6">
                     <div className="p-6 border border-zinc-200 bg-zinc-50/50 flex flex-col gap-5 text-left rounded-sm">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-900 uppercase tracking-widest pb-3 border-b border-zinc-200/50">
                           <Map size={14} className="text-blue-500" /> Program overview
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">Your professional growth is mapped across your {user.batch || "Batch 1"} internship duration. Ensure all milestones are met on time.</p>
                        <div className="space-y-2">
                           <div className="flex items-center justify-between p-3 bg-white border border-zinc-100 shadow-xs"><span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Weeks completed</span><span className="text-sm font-bold text-zinc-900">{schedules.filter(s => s.isCompleted).length}</span></div>
                           <div className="flex items-center justify-between p-3 bg-white border border-zinc-100 shadow-xs"><span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Total milestones</span><span className="text-sm font-bold text-zinc-900">{schedules.length}</span></div>
                        </div>
                        <Link href="/intern/dashboard/schedule" className="w-full h-11 bg-zinc-900 text-white text-[10px] font-bold flex items-center justify-center hover:bg-black transition-all shadow-lg shadow-zinc-900/10">View full progression</Link>
                     </div>
                  </aside>
               </div>
            </motion.div>
         )}

         {activeTab === "kanban" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
               {}
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

               {}
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
                           {}
                           <div className={`flex items-center justify-between px-3 py-2 rounded-xl ${col.headerBg}`}>
                              <h3 className={`text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 ${col.headerText}`}>
                                 <Circle size={8} fill="currentColor" className={col.dot} />
                                 {col.label}
                              </h3>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/70 ${col.headerText}`}>
                                 {columnTasks.length}
                              </span>
                           </div>

                           {}
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

               {}
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-12rem)] min-h-[500px] flex bg-white border border-zinc-200 rounded-lg overflow-hidden text-left mb-6 shadow-sm relative">
               {}
               <aside className={`${showChatSidebar ? "flex" : "hidden"} lg:flex absolute inset-0 z-20 lg:relative lg:inset-auto w-full lg:w-64 bg-zinc-50 border-r border-zinc-200 flex-col shrink-0`}>
                  <div className="p-6 border-b border-zinc-200 bg-white flex items-center justify-between">
                     <div>
                        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest leading-none">Your Team</h3>
                        <p className="text-[10px] text-zinc-400 mt-2 font-medium">Chat with your group members.</p>
                     </div>
                     <button onClick={() => setShowChatSidebar(false)} className="lg:hidden p-2 text-zinc-400">
                        <ChevronRight size={18} />
                     </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto no-scrollbar py-4">
                     {}
                     <div className="px-4 mb-6">
                        <button 
                           onClick={() => { setSelectedUser(null); setShowChatSidebar(false); }}
                           className={`w-full flex items-center gap-3 p-3 text-xs font-bold transition-all rounded-xl mb-2 ${!selectedUser ? "bg-black text-white shadow-md" : "hover:bg-zinc-200 text-zinc-600"}`}
                        >
                           <Users size={16} /> Team Chat
                        </button>
                        
                        <div className="h-px bg-zinc-200 my-4 mx-2" />
                        
                        <p className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Teammates</p>
                        <div className="space-y-1 mt-1">
                           {(() => {
                              const activeSchedule = schedules.find(s => s.id === activeTeamId) || schedules.find(s => s.teamInternIds?.length > 0);
                              const teamIds = activeSchedule?.teamInternIds || [];
                              const teamPeers = teamIds.filter(id => id !== user.id);

                              if (teamPeers.length === 0) {
                                 return (
                                    <div className="p-6 text-center">
                                       <p className="text-[10px] text-zinc-300 font-bold uppercase tracking-wider">No teammates yet</p>
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
                                       className={`w-full flex items-center gap-3 p-3 transition-all rounded-xl ${selectedUser?.id === peer.id ? "bg-white border border-zinc-200 text-black shadow-sm" : "text-zinc-600 hover:bg-zinc-100"}`}
                                    >
                                       <div className="h-8 w-8 bg-zinc-900 text-white flex items-center justify-center text-xs font-bold rounded-lg group-hover:scale-105 transition-transform">
                                          {peer.name[0]}
                                       </div>
                                       <div className="text-left overflow-hidden">
                                          <p className="text-xs font-bold truncate leading-none mb-1">{peer.name}</p>
                                          <div className="flex items-center gap-1">
                                             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                             <p className="text-[9px] font-bold text-zinc-400 uppercase">Mission Active</p>
                                          </div>
                                       </div>
                                    </button>
                                 );
                              });
                           })()}
                        </div>
                     </div>
                  </div>

                  {}
                  <div className="p-4 bg-zinc-100/50 border-t border-zinc-200 flex items-center gap-3">
                     <div className="h-9 w-9 bg-black text-white flex items-center justify-center text-xs font-bold rounded-lg">
                        {user.name[0]}
                     </div>
                     <div className="overflow-hidden">
                        <p className="text-xs font-bold text-zinc-900 truncate leading-none mb-1">{user.name}</p>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase">You</p>
                     </div>
                  </div>
               </aside>

               {}
               <div className={`flex-1 flex flex-col bg-white overflow-hidden ${!showChatSidebar ? "flex" : "hidden lg:flex"}`}>
                  {}
                  <div className="px-4 lg:px-8 py-4 lg:py-6 border-b border-zinc-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                     <div className="flex items-center gap-3 lg:gap-4 truncate">
                        <button onClick={() => setShowChatSidebar(true)} className="lg:hidden p-2 -ml-2 text-zinc-400 hover:text-black transition-colors">
                           <ChevronLeft size={20} />
                        </button>
                        <div className="h-8 w-8 lg:h-10 lg:w-10 bg-black text-white flex items-center justify-center font-bold rounded-lg shrink-0">
                           {selectedUser ? <User size={16} /> : <Users size={16} />}
                        </div>
                        <div className="truncate">
                           <h2 className="text-sm lg:text-base font-bold text-zinc-900 leading-none mb-1 lg:mb-1.5 truncate">
                              {selectedUser ? selectedUser.name : (schedules.find(s => s.week.includes("Week 2"))?.teamAllocation || "Team Chat")}
                           </h2>
                           <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[9px] lg:text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Active session</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {}
                  <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 lg:space-y-8 bg-zinc-50/30 no-scrollbar">
                     {messages.filter(m => 
                        selectedUser 
                           ? (m.senderId === selectedUser.id || (m.senderId === user.id && m.targetId === selectedUser.id)) 
                           : (!m.targetId)
                     ).length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-300">
                           <MessageSquare size={48} className="mb-4 opacity-20" />
                           <p className="text-xs font-bold uppercase tracking-widest opacity-40">Start a conversation</p>
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
                                       <span className="text-[9px] lg:text-[10px] font-bold text-zinc-400 mb-1 lg:mb-2 block uppercase px-1">
                                          {msg.senderName}
                                       </span>
                                    )}
                                    <div className={`px-4 lg:px-5 py-3 lg:py-4 border ${isOwn ? "bg-black border-black text-white rounded-2xl rounded-tr-sm shadow-lg shadow-black/10" : "bg-white border-zinc-200 text-zinc-900 rounded-2xl rounded-tl-sm shadow-sm"}`}>
                                       <p className="text-xs lg:text-sm font-medium leading-relaxed">{msg.content}</p>
                                       <span className={`text-[8px] lg:text-[9px] font-bold block mt-2 lg:mt-3 opacity-40 ${isOwn ? "text-zinc-400" : "text-zinc-500"}`}>
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

                  {}
                  <form onSubmit={handleSendMessage} className="px-4 lg:px-8 py-4 lg:py-6 bg-white border-t border-zinc-100 flex gap-2 lg:gap-4">
                     <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="flex-1 px-4 lg:px-6 h-12 lg:h-14 bg-zinc-50 border border-zinc-200 text-xs lg:text-sm font-semibold rounded-xl lg:rounded-2xl focus:border-black focus:bg-white outline-none transition-all placeholder:text-zinc-300"
                        placeholder={selectedUser ? `Message ${selectedUser.name}...` : "Send a message..."}
                     />
                     <button type="submit" disabled={!activeTeamId || !inputText.trim()} className="h-12 w-12 lg:h-14 lg:px-10 lg:w-auto bg-black text-white hover:bg-zinc-800 transition-all font-bold text-[10px] lg:text-xs uppercase tracking-widest rounded-xl lg:rounded-2xl disabled:opacity-30 active:scale-95 flex items-center justify-center gap-2">
                        <Send size={16} /> <span className="hidden lg:inline">Send</span>
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
                           <p className="text-xs text-zinc-500 leading-relaxed mb-6 flex-1 line-clamp-3">{task.description}</p>
                           <div className="pt-4 border-t border-zinc-900/5 flex items-center justify-between mt-auto">
                              {task.attachmentUrl ? <a href={task.attachmentUrl} target="_blank" className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-[#0055FF] transition-colors">Files <Download size={12} /></a> : <span className="text-[10px] text-zinc-300 italic">No files</span>}
                              <button onClick={() => updateTaskStatus(task.id, task.status)} className={`h-9 px-5 text-xs font-semibold transition-all ${task.status === "pending" ? "bg-black text-white hover:bg-[#0055FF]" : "bg-white border border-zinc-200 text-zinc-900"}`}>{task.status === "pending" ? "Submit work" : "Marked done"}</button>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </motion.div>
         )}

         {activeTab === "attendance" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-100">
                  <div className="max-w-xl"><h1 className="text-xl font-bold text-zinc-900 mb-2">Attendance logs</h1><p className="text-zinc-500 text-sm leading-relaxed">Check your presence record and overall attendance percentage for this internship.</p></div>
                  <div className="p-6 bg-[#0055FF] text-white flex flex-col justify-center min-w-[200px]"><div className="text-center md:text-left"><h4 className="text-xs font-semibold opacity-60 mb-1">Attendance rate</h4><p className="text-3xl font-bold">{attendancePercentage}%</p></div></div>
               </div>
               <div className="bg-white border border-zinc-100 overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                     <thead><tr className="bg-zinc-50/50 border-b border-zinc-100"><th className="px-8 py-5 text-xs font-bold text-zinc-400">Date</th><th className="px-8 py-5 text-xs font-bold text-zinc-400">Type</th><th className="px-8 py-5 text-xs font-bold text-zinc-400 text-right">Status</th></tr></thead>
                     <tbody className="divide-y divide-zinc-50">
                        {attendanceData.history.map((log: any) => (
                           <tr key={log.id} className="hover:bg-zinc-50/30 transition-colors">
                              <td className="px-8 py-4"><div className="flex flex-col"><span className="text-sm font-semibold text-zinc-900">{new Date(log.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span><span className="text-[10px] text-zinc-300">{new Date(log.date).getFullYear()} record</span></div></td>
                              <td className="px-8 py-4"><span className="text-xs text-zinc-500">Regular session</span></td>
                              <td className="px-8 py-4 text-right"><div className="flex items-center justify-end gap-2"><div className={`h-1.5 w-1.5 ${log.status === "PRESENT" || log.status === "LATE" ? "bg-emerald-500" : "bg-rose-500"}`} /><span className={`text-xs font-semibold ${log.status === "PRESENT" || log.status === "LATE" ? "text-emerald-600" : "text-rose-600"}`}>{log.status === "PRESENT" ? "Present" : log.status === "LATE" ? "Late" : "Absent"}</span></div></td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </motion.div>
         )}

         {activeTab === "settings" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-5xl text-left">
               <header className="pb-4"><h1 className="text-xl font-bold tracking-tight text-zinc-900 font-sans">Account settings.</h1><p className="text-zinc-400 text-[12px] font-medium mt-1">Manage your account details and security protocols.</p></header>
               <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  <div className="md:col-span-8 space-y-6">
                     <section className="p-8 border border-zinc-100 bg-white shadow-sm space-y-6"><div className="flex items-center gap-3 pb-4 border-b border-zinc-50"><User size={18} className="text-[#0055FF]" /><h3 className="text-sm font-bold text-zinc-900">Personal information</h3></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="space-y-1.5"><p className="text-[10px] font-bold text-zinc-400">Full name</p><div className="p-3 bg-zinc-50 border border-zinc-100 text-sm font-medium text-zinc-900">{user.name}</div></div><div className="space-y-1.5"><p className="text-[10px] font-bold text-zinc-400">Email address</p><div className="p-3 bg-zinc-50 border border-zinc-100 text-sm font-medium text-zinc-900 flex items-center gap-2"><Mail size={12} className="text-zinc-400" />{user.email}</div></div></div></section>
                  </div>
                  <div className="md:col-span-4 space-y-6"><div className="p-8 border border-zinc-100 bg-white shadow-sm text-center"><div className="h-20 w-20 bg-[#0055FF]/10 text-[#0055FF] flex items-center justify-center mx-auto mb-4"><User size={36} /></div><h4 className="text-sm font-bold text-zinc-900">{user.name}</h4><p className="text-[10px] text-zinc-400 mb-8 font-medium">{user.college || "Forge Academy Intern"} • {user.batch || "Batch 1"}</p><button onClick={handleSignOut} className="w-full h-10 bg-black text-white text-[10px] font-bold flex items-center justify-center gap-2">Log out <LogOut size={14} /></button></div></div>
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
      </div>
   );
}

export default function InternDashboard() {
   return (
      <Suspense fallback={<div className="p-12 text-zinc-400 text-xs font-bold animate-pulse">Loading dashboard...</div>}>
         <InternDashboardContent />
      </Suspense>
   );
}
