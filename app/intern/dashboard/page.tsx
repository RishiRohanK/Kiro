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
   Hand
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";

interface Task {
   id: string;
   title: string;
   description: string;
   attachmentUrl?: string;
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
}

interface ChatMessage {
   userId: string;
   userName: string;
   text: string;
   time: string;
   colorIndex: number;
   targetSocketId?: string;
   isPrivate?: boolean;
}

function InternDashboardContent() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const activeTab = searchParams.get("view") || "overview";

   const [user, setUser] = useState<any>(null);
   const [tasks, setTasks] = useState<Task[]>([]);
   const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
   const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isUpdating, setIsUpdating] = useState<string | null>(null);
   const [userStatus, setUserStatus] = useState<any>(null);
   const [showLetterModal, setShowLetterModal] = useState(false);

   // Chat State
   const [messages, setMessages] = useState<ChatMessage[]>([]);
   const [inputText, setInputText] = useState("");
   const [socket, setSocket] = useState<any>(null);
   const [activeUsersList, setActiveUsersList] = useState<any[]>([]);
   const [allInterns, setAllInterns] = useState<any[]>([]);
   const [selectedUser, setSelectedUser] = useState<any>(null); 
   const [myId, setMyId] = useState<string | null>(null);
   const chatEndRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const storedUser = localStorage.getItem("intern_user");
      if (!storedUser) {
         router.push("/intern/signin");
         return;
      }
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchTasks(userData.id);
      fetchStatus(userData.id);
      fetchAttendance(userData.id);
      fetchSchedules(userData.id);
      fetchAllInterns();

      const syncInterval = setInterval(() => {
         fetchTasks(userData.id);
         fetchStatus(userData.id);
         fetchAttendance(userData.id);
         fetchSchedules(userData.id);
      }, 20000);

      // Socket init
      const newSocket = io({ reconnectionDelayMax: 10000 });
      setSocket(newSocket);

      newSocket.on("connect", () => {
         setMyId(newSocket.id || null);
         newSocket.emit("join-community", { 
           id: userData.id, 
           name: userData.name, 
           colorIndex: userData.id.length % 4 
         });
      });

      newSocket.on("receive-message", (msg: ChatMessage) => {
         setMessages(prev => [...prev, msg]);
      });

      newSocket.on("active-users", (users: any[]) => {
         setActiveUsersList(users);
      });

      return () => {
         clearInterval(syncInterval);
         newSocket.disconnect();
      };
   }, [router]);

   useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "auto" });
   }, [messages]);

   const fetchAllInterns = async () => {
      try {
         const res = await fetch("/api/intern/all");
         const data = await res.json();
         setAllInterns(data);
      } catch (error) {
         console.error("Failed to fetch all interns");
      }
   };

   const fetchStatus = async (id: string) => {
      try {
         const res = await fetch(`/api/intern/status?id=${id}`);
         const data = await res.json();
         setUserStatus(data);
         const lastAck = localStorage.getItem(`letter_ack_${id}`);
         if (data.letterUrl && data.letterUrl !== lastAck) {
            setShowLetterModal(true);
         }
      } catch (e) {
         console.error("Status check offline");
      }
   };

   const fetchTasks = async (id: string) => {
      try {
         const res = await fetch(`/api/intern/tasks?internId=${id}`);
         const data = await res.json();
         setTasks(data);
      } catch (error) {
         console.error("Failed to load tasks");
      } finally {
         setIsLoading(false);
      }
   };

   const fetchSchedules = async (id: string) => {
      try {
         const res = await fetch(`/api/intern/schedule?internId=${id}`);
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
            setAttendanceHistory(data);
         }
      } catch (error) {
         console.error("Attendance retrieval offline");
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

   const handleSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputText.trim() || !socket || !user) return;

      const message: ChatMessage = {
         userId: user.id,
         userName: user.name,
         text: inputText,
         time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
         colorIndex: user.id.length % 4,
         targetSocketId: selectedUser?.socketId,
         isPrivate: !!selectedUser
      };

      socket.emit("send-message", message);
      setInputText("");
   };

   const handleSignOut = () => {
      localStorage.removeItem("intern_user");
      router.push("/intern/signin");
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

   const attendanceCount = attendanceHistory.filter(a => a.status === 'PRESENT').length;
   const attendancePercentage = attendanceHistory.length > 0 ? Math.round((attendanceCount / attendanceHistory.length) * 100) : 0;

   const bubbleColors = [
      { bg: "bg-blue-50/50", border: "border-blue-100", text: "text-blue-900", name: "text-blue-600" },
      { bg: "bg-emerald-50/50", border: "border-emerald-100", text: "text-emerald-900", name: "text-emerald-600" },
      { bg: "bg-indigo-50/50", border: "border-indigo-100", text: "text-indigo-900", name: "text-indigo-600" },
      { bg: "bg-amber-50/50", border: "border-amber-100", text: "text-amber-900", name: "text-amber-600" }
   ];

   const filteredMessages = messages.filter(msg => {
      if (selectedUser) {
         return (msg.isPrivate && (
            (msg.userId === selectedUser.id && msg.targetSocketId === myId) || 
            (msg.userId === user.id && msg.targetSocketId === selectedUser.socketId)
         ));
      }
      return !msg.isPrivate;
   });

   return (
      <div className={`p-4 lg:p-6 max-w-[1600px] w-full mx-auto bg-white ${activeTab === "community" ? "h-[calc(100vh-3.5rem)] overflow-hidden" : "min-h-screen"}`}>
         {activeTab === "overview" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-left">
               <div className="mb-8 font-sans"><h1 className="text-xl font-bold text-zinc-900">Welcome back, {user.name.split(' ')[0]}</h1><p className="text-zinc-400 text-xs mt-0.5">Your account is active.</p></div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 border border-zinc-100 bg-white shadow-sm flex flex-col justify-between h-32"><div className="flex items-center justify-between"><span className="text-xs font-medium text-zinc-400">Assignments</span><Briefcase size={16} className="text-[#0055FF]" /></div><div className="mt-auto"><p className="text-2xl font-bold">{tasks.filter(t => t.status === 'pending').length}</p><p className="text-[10px] text-zinc-500 mt-1">Pending tasks</p></div></div>
                  <div className="p-5 border border-zinc-100 bg-white shadow-sm flex flex-col justify-between h-32"><div className="flex items-center justify-between"><span className="text-xs font-medium text-zinc-400">Attendance</span><Check size={16} className="text-emerald-500" /></div><div className="mt-auto"><div className="flex items-baseline gap-2"><p className="text-2xl font-bold text-zinc-900">{attendancePercentage}%</p><span className="text-[10px] text-zinc-400">({attendanceCount} Days)</span></div><p className="text-[10px] text-zinc-500 mt-1">Present percentage</p></div></div>
                  <div className="p-5 border border-zinc-100 bg-white shadow-sm flex flex-col justify-between h-32"><div className="flex items-center justify-between"><span className="text-xs font-medium text-zinc-400">Status</span><FileBadge size={16} className={userStatus?.letterUrl ? "text-blue-500" : "text-zinc-300"} /></div><div className="mt-auto"><p className="text-sm font-bold text-zinc-900">{userStatus?.letterUrl ? "Letter ready" : "Still processing"}</p><p className="text-[10px] text-zinc-500 mt-1">Current status</p></div></div>
                  <div className="p-5 border border-zinc-100 bg-white shadow-sm flex flex-col justify-between h-32"><div className="flex items-center justify-between"><span className="text-xs font-medium text-zinc-400">Next shift</span><Calendar size={16} className="text-amber-500" /></div><div className="mt-auto"><p className="text-sm font-bold text-zinc-900">Today, 10:00 AM</p><p className="text-[10px] text-zinc-500 mt-1">Starting time</p></div></div>
               </div>
               
               <div className="p-4 bg-red-50 border-l-4 border-red-500 flex items-center gap-3">
                  <Hand size={18} className="text-red-600 shrink-0" />
                  <p className="text-xs font-bold text-red-600 leading-relaxed">
                     Admin notice: Interns make sure to raise your hand whenever you come in for the day, at least once, so that your attendance can be calculated
                  </p>
               </div>

               {userStatus?.letterUrl && (
                  <div className="p-4 border border-zinc-100 bg-white flex items-center justify-between shadow-sm">
                     <div className="flex items-center gap-3"><div className="h-8 w-8 bg-black text-white flex items-center justify-center"><FileBadge size={16} /></div><div><h3 className="text-xs font-bold text-zinc-900">Internship letter</h3><p className="text-[10px] text-zinc-500 mt-0.5">Your official letter is now available for download.</p></div></div>
                     <a href={userStatus.letterUrl} target="_blank" className="h-8 px-4 bg-[#0055FF] text-white text-xs font-semibold flex items-center gap-2 hover:bg-black transition-all">Download <Download size={13} /></a>
                  </div>
               )}

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4 border-t border-zinc-100">
                  <div className="lg:col-span-8 space-y-6">
                     <div className="flex items-center justify-between mb-4"><h2 className="text-xs font-bold text-zinc-400">Active roadmap progression</h2><Link href="/intern/dashboard/schedule" className="text-xs font-bold text-[#0055FF] hover:underline flex items-center gap-1">Full roadmap <ChevronRight size={12} /></Link></div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {schedules.slice(0, 2).map((item) => (
                           <div key={item.id} className="p-6 border border-zinc-100 bg-white hover:border-[#0055FF]/30 transition-all flex flex-col h-full text-left">
                              <div className="flex items-center justify-between mb-4"><span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 border border-blue-100">{item.week}</span>{item.isCompleted && <CheckCircle2 size={14} className="text-emerald-500" />}</div>
                              <h3 className="text-sm font-bold text-zinc-900 mb-2">{item.typeOfWork}</h3>
                              <p className="text-xs text-zinc-500 leading-relaxed mb-4 flex-1 line-clamp-3">{item.description}</p>
                              <div className="pt-4 border-t border-zinc-50 flex items-center justify-between mt-auto">
                                 <div className="flex items-center gap-2"><Target size={14} className="text-zinc-300" /><span className="text-[10px] text-zinc-400 font-medium">Goal: {item.deadline.split('T')[0]}</span></div>
                                 <span className="text-[10px] text-zinc-400 font-bold">Ongoing</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <aside className="lg:col-span-4 space-y-6">
                     <div className="p-6 border border-zinc-100 bg-[#FAFAFA] flex flex-col gap-4 text-left">
                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-900"><Map size={16} className="text-[#0055FF]" /> Program overview</div>
                        <p className="text-xs text-zinc-500 leading-relaxed">Your professional growth is mapped across your entire internship duration. Ensure all milestones are met on time.</p>
                        <div className="space-y-3">
                           <div className="flex items-center justify-between p-3 bg-white border border-zinc-100"><span className="text-[10px] font-bold text-zinc-400">Weeks completed</span><span className="text-sm font-bold text-zinc-900">{schedules.filter(s => s.isCompleted).length}</span></div>
                           <div className="flex items-center justify-between p-3 bg-white border border-zinc-100"><span className="text-[10px] font-bold text-zinc-400">Total milestones</span><span className="text-sm font-bold text-zinc-900">{schedules.length}</span></div>
                        </div>
                        <Link href="/intern/dashboard/schedule" className="w-full h-11 bg-black text-white text-[10px] font-bold flex items-center justify-center hover:bg-[#0055FF] transition-all">View roadmap progression</Link>
                     </div>
                  </aside>
               </div>
            </motion.div>
         )}

         {activeTab === "community" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col bg-white border border-zinc-100 overflow-hidden text-left">
               <div className="flex flex-1 overflow-hidden h-full">
                  <aside className="w-64 border-r border-zinc-100 bg-[#FAFAFA] flex flex-col h-full overflow-hidden shrink-0">
                     <div className="p-5 border-b border-zinc-100 bg-white shrink-0">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400 mb-4">
                           <Users size={14} /> Intern roster
                        </div>
                        <button 
                           onClick={() => setSelectedUser(null)}
                           className={`w-full flex items-center gap-3 p-3 text-sm font-semibold transition-all ${
                              !selectedUser ? "bg-[#0055FF] text-white shadow-sm" : "bg-white border border-zinc-100 text-zinc-500 hover:bg-zinc-50"
                           }`}
                        >
                           <Globe size={14} /> Community hub
                        </button>
                     </div>
                     <div className="flex-1 overflow-y-auto p-3 space-y-1 no-scrollbar">
                        {allInterns.filter(u => u.id !== user.id).map((u, i) => {
                             const activeUser = activeUsersList.find(au => au.id === u.id);
                             const isSelected = selectedUser?.id === u.id;
                             return (
                                <button 
                                   key={i}
                                   disabled={!activeUser}
                                   onClick={() => setSelectedUser(activeUser)}
                                   className={`w-full flex items-center gap-3 p-3 transition-all border ${
                                      isSelected 
                                      ? "bg-white border-[#0055FF]/20 text-[#0055FF] shadow-sm font-semibold" 
                                      : activeUser 
                                        ? "border-transparent text-zinc-500 hover:bg-white hover:border-zinc-100"
                                        : "border-transparent opacity-40 grayscale cursor-not-allowed"
                                   }`}
                                >
                                   <div className="relative shrink-0">
                                      <div className="h-8 w-8 bg-zinc-200 text-zinc-500 flex items-center justify-center text-[11px] font-bold">
                                         {u.name[0]}
                                      </div>
                                      {activeUser && (
                                         <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 bg-emerald-500 border-2 border-[#FAFAFA] rounded-full" />
                                      )}
                                   </div>
                                   <div className="text-left overflow-hidden">
                                      <p className="text-xs font-semibold truncate leading-none mb-1">{u.name}</p>
                                      <p className="text-[9px] font-medium text-zinc-400">
                                         {activeUser ? "Active now" : "Offline"}
                                      </p>
                                   </div>
                                </button>
                             );
                          })}
                     </div>
                  </aside>

                  <div className="flex-1 flex flex-col bg-white h-full relative overflow-hidden">
                     <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-white z-10 shrink-0">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 bg-zinc-50 border border-zinc-100 flex items-center justify-center text-[#0055FF]">
                              {selectedUser ? <User size={20} /> : <Globe size={20} />}
                           </div>
                           <div>
                              <h2 className="text-sm font-bold text-zinc-900 leading-none mb-1">
                                 {selectedUser ? selectedUser.name : "Community chat"}
                              </h2>
                              <div className="flex items-center gap-1.5">
                                 <Circle size={6} fill="currentColor" className={selectedUser ? "text-emerald-500" : "text-blue-500"} />
                                 <span className="text-[10px] font-semibold text-zinc-400 capitalize">
                                    {selectedUser ? "Direct session" : "Broadcast channel"}
                                 </span>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FBFBFB] no-scrollbar">
                        {filteredMessages.length === 0 ? (
                           <div className="h-full flex flex-col items-center justify-center text-zinc-300">
                              <MessageSquare size={32} className="mb-2 opacity-50" />
                              <p className="text-xs font-semibold uppercase tracking-widest opacity-50">Secure connection</p>
                           </div>
                        ) : (
                           filteredMessages.map((msg, i) => {
                              const isOwn = msg.userId === user.id;
                              const theme = bubbleColors[msg.colorIndex % 4];
                              return (
                                 <div key={i} className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                                     <div className={`max-w-[75%] ${isOwn ? "text-right" : "text-left"}`}>
                                        {!isOwn && !selectedUser && (
                                           <span className={`text-[10px] font-bold mb-1.5 block ${theme.name}`}>
                                              {msg.userName}
                                           </span>
                                        )}
                                        <div className={`p-4 border ${isOwn ? "bg-white border-[#0055FF]/20 shadow-sm rounded-l-2xl rounded-tr-2xl" : `bg-white ${theme.border} shadow-sm rounded-r-2xl rounded-tl-2xl`} `}>
                                           <p className="text-[14px] leading-relaxed text-zinc-800 font-medium">{msg.text}</p>
                                           <span className="text-[9px] font-bold text-zinc-400 block mt-2 tracking-tighter">{msg.time}</span>
                                        </div>
                                     </div>
                                 </div>
                              );
                           })
                        )}
                        <div ref={chatEndRef} />
                     </div>

                     <form onSubmit={handleSendMessage} className="p-5 border-t border-zinc-100 flex gap-3 bg-white shrink-0">
                        <input 
                           type="text" 
                           value={inputText}
                           onChange={(e) => setInputText(e.target.value)}
                           className="flex-1 px-4 h-11 border border-zinc-100 bg-[#FAFAFA] text-sm font-medium focus:bg-white focus:border-[#0055FF]/30 outline-none transition-all placeholder:text-zinc-300"
                           placeholder={selectedUser ? `Message ${selectedUser.name}...` : "Broadcast to community..."}
                        />
                        <button type="submit" className="h-11 px-6 bg-black text-white hover:bg-[#0055FF] transition-all flex items-center justify-center font-bold text-[11px]">
                           Send <Send size={14} className="ml-2" />
                        </button>
                     </form>
                  </div>
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
                        {attendanceHistory.map((log) => (
                           <tr key={log.id} className="hover:bg-zinc-50/30 transition-colors">
                              <td className="px-8 py-4"><div className="flex flex-col"><span className="text-sm font-semibold text-zinc-900">{new Date(log.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span><span className="text-[10px] text-zinc-300">{new Date(log.date).getFullYear()} record</span></div></td>
                              <td className="px-8 py-4"><span className="text-xs text-zinc-500">Regular session</span></td>
                              <td className="px-8 py-4 text-right"><div className="flex items-center justify-end gap-2"><div className={`h-1.5 w-1.5 ${log.status === "PRESENT" ? "bg-emerald-500" : "bg-rose-500"}`} /><span className={`text-xs font-semibold ${log.status === "PRESENT" ? "text-emerald-600" : "text-rose-600"}`}>{log.status === "PRESENT" ? "Present" : "Absent"}</span></div></td>
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
                  <div className="md:col-span-4 space-y-6"><div className="p-8 border border-zinc-100 bg-white shadow-sm text-center"><div className="h-20 w-20 bg-[#0055FF]/10 text-[#0055FF] flex items-center justify-center mx-auto mb-4"><User size={36} /></div><h4 className="text-sm font-bold text-zinc-900">{user.name}</h4><p className="text-[10px] text-zinc-400 mb-8 font-medium">Authenticated account</p><button onClick={handleSignOut} className="w-full h-10 bg-black text-white text-[10px] font-bold flex items-center justify-center gap-2">Log out <LogOut size={14} /></button></div></div>
               </div>
            </motion.div>
         )}

         <AnimatePresence>
            {showLetterModal && userStatus?.letterUrl && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} className="bg-white max-md w-full p-10 border border-zinc-200 rounded-none shadow-2xl relative">
                     <button onClick={() => { setShowLetterModal(false); localStorage.setItem(`letter_ack_${user.id}`, userStatus.letterUrl); }} className="absolute top-4 right-4 text-zinc-400 hover:text-black transition-none"><X size={20} /></button>
                     <div className="space-y-6 text-left"><div className="space-y-2"><h2 className="text-xs font-bold text-[#0055FF]">Confirmation letter</h2><p className="text-sm font-medium text-zinc-900 leading-relaxed">Your official internship letter has been issued. You can now download it and view your credentials.</p></div><div className="pt-4 flex flex-col gap-3"><a href={userStatus.letterUrl} target="_blank" rel="noopener noreferrer" onClick={() => { setShowLetterModal(false); localStorage.setItem(`letter_ack_${user.id}`, userStatus.letterUrl); }} className="h-10 bg-[#0055FF] text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-black transition-none">Download letter <Download size={14} /></a><button onClick={() => { setShowLetterModal(false); localStorage.setItem(`letter_ack_${user.id}`, userStatus.letterUrl); }} className="text-[10px] font-bold text-zinc-400 hover:text-zinc-900 transition-none py-2">Close notice</button></div></div>
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
