"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  Github,
  Trophy,
  Clock,
  CheckCircle2,
  FileText,
  ExternalLink,
  Shield,
  ShieldCheck,
  FileBadge,
  User as UserIcon,
  Briefcase,
  Zap,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InternData {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  college?: string;
  department?: string;
  branch?: string;
  year?: string;
  graduationYear?: string;
  batch?: string;
  isApproved: boolean;
  githubLink?: string;
  phoneNumber?: string;
  dob?: string;
  interestedArea?: string;
  attendancePercentage?: number;
  presentCount?: number;
  reportingManager?: string;
  joiningDate?: string | Date;
  tasks: any[];
  personalTasks: any[];
  scheduleSubmissions: any[];
  attendances: any[];
  examSessions: any[];
  feedback?: any[];
}

export default function InternProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<{
    intern: InternData;
    taskSubmissions: any[];
    uiuxSubmissions: any[];
    feedback: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSegment, setActiveSegment] = useState<"overview" | "tasks" | "submissions" | "reports">("overview");

  useEffect(() => {
    const fetchInternDetails = async () => {
      try {
        const res = await fetch(`/api/cleed/interns/${id}`);
        const result = await res.json();
        if (result.success) {
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch intern details");
      } finally {
        setLoading(false);
      }
    };

    fetchInternDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
          <p className="text-[12px] font-semibold text-zinc-500 tracking-widest">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-zinc-500 font-semibold">Intern not found in registry.</p>
          <button onClick={() => router.back()} className="text-zinc-900 underline font-semibold text-sm">Return to Dashboard</button>
        </div>
      </div>
    );
  }

  const { intern, taskSubmissions, uiuxSubmissions, feedback } = data;

  // Real-time stats calculation
  const presentCount = intern.attendances.filter((a: any) => a.status === 'PRESENT').length;
  const totalDays = intern.attendances.length;
  const attendancePercentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.back()}
                className="h-9 w-9 flex items-center justify-center bg-white border border-zinc-200 text-[#003366] hover:bg-zinc-50 transition-all rounded-sm"
              >
                <ChevronLeft size={18} />
              </button>
              <h1 className="text-sm font-semibold tracking-tighter text-zinc-900">Intern Profile</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 text-[10px] font-medium border ${intern.isApproved ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                {intern.isApproved ? 'Approved' : 'Pending Review'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar / Profile Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-zinc-200 overflow-hidden">
              <div className="h-32 bg-[#E0E7FF] relative">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#003366_1px,transparent_1px)] [background-size:16px_16px]" />
              </div>
              <div className="px-6 pb-8">
                <div className="relative -mt-16 mb-6">
                  <div className="h-32 w-32 bg-zinc-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                    {intern.profileImage ? (
                      <img src={intern.profileImage} alt={intern.name} className="h-full w-full object-cover" />
                    ) : (
                      <UserIcon size={48} className="text-zinc-300" />
                    )}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight leading-none">{intern.name}</h2>
                  <p className="text-[12px] font-medium text-zinc-500 tracking-widest">{intern.batch || 'Batch Active'}</p>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-zinc-600">
                    <Mail size={16} />
                    <span className="text-[13px] font-medium">{intern.email}</span>
                  </div>
                  {intern.phoneNumber && (
                    <div className="flex items-center gap-3 text-zinc-600">
                      <Phone size={16} />
                      <span className="text-[13px] font-medium">{intern.phoneNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-zinc-600">
                    <Building2 size={16} />
                    <span className="text-[13px] font-medium">{intern.college || 'Undeclared'}</span>
                  </div>
                  {intern.githubLink && (
                    <a href={intern.githubLink} target="_blank" className="flex items-center gap-3 text-zinc-900 hover:text-black hover:underline transition-colors uppercase font-medium text-[11px]">
                      <Github size={16} /> GitHub Profile <ExternalLink size={10} />
                    </a>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-zinc-100 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-50 border border-zinc-100">
                    <p className="text-[9px] font-medium text-zinc-400 tracking-widest mb-1">Performance</p>
                    <p className="text-xl font-semibold text-zinc-900 leading-none">{attendancePercentage}%</p>
                  </div>
                  <div className="p-4 bg-zinc-50 border border-zinc-100">
                    <p className="text-[9px] font-medium text-zinc-400 tracking-widest mb-1">Days Present</p>
                    <p className="text-xl font-semibold text-zinc-900 leading-none">{presentCount}d</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 p-6">
              <h3 className="text-[11px] font-semibold tracking-[0.2em] text-[#003366] mb-6 flex items-center gap-2">
                <Shield size={12} /> Profile Details
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                <div>
                  <p className="text-[10px] font-medium text-zinc-400">Department</p>
                  <p className="text-[12px] font-semibold text-zinc-900">{intern.department || intern.branch || 'None'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-zinc-400">Joined On</p>
                  <p className="text-[12px] font-semibold text-zinc-900">{intern.joiningDate ? new Date(intern.joiningDate).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-zinc-400">Phone</p>
                  <p className="text-[12px] font-semibold text-zinc-900">{intern.phoneNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-zinc-400">Graduation</p>
                  <p className="text-[12px] font-semibold text-zinc-900">{intern.graduationYear || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-zinc-400">College</p>
                  <p className="text-[12px] font-semibold text-zinc-900 line-clamp-1">{intern.college || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-zinc-400">D.O.B</p>
                  <p className="text-[12px] font-semibold text-zinc-900">{intern.dob || 'N/A'}</p>
                </div>
                {intern.reportingManager && (
                  <div className="col-span-2">
                    <p className="text-[10px] font-medium text-zinc-400">Reporting Manager</p>
                    <p className="text-[12px] font-semibold text-zinc-900">{intern.reportingManager}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="text-[10px] font-medium text-zinc-400">Interest Areas</p>
                  <p className="text-[12px] font-semibold text-zinc-900">{intern.interestedArea || 'None'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Tabs */}
            <div className="flex bg-white border border-zinc-200 p-1 gap-1">
              {[
                { id: "overview", label: "Overview", icon: Zap },
                { id: "tasks", label: "Tasks", icon: Briefcase },
                { id: "submissions", label: "Work Logs", icon: CheckCircle2 },
                { id: "reports", label: "Analytics", icon: FileText }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSegment(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-semibold tracking-wider transition-all ${
                    activeSegment === tab.id 
                    ? 'bg-[#E0E7FF] text-[#003366]' 
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Segments */}
            <div className="min-h-[500px]">
              <AnimatePresence mode="wait">
                {activeSegment === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div className="bg-white border border-zinc-200 p-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="h-10 w-10 bg-[#E0E7FF] text-[#003366] flex items-center justify-center shadow-sm border border-[#003366]/10">
                          <Trophy size={20} />
                        </div>
                        <h3 className="text-lg font-semibold tracking-tight text-zinc-900">Task Progress</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed font-medium">Tracking all tasks and project goals assigned to the intern.</p>
                      </div>
                      <div className="mt-8">
                        <p className="text-3xl font-semibold text-zinc-900">{intern.tasks.length} <span className="text-xs font-medium text-zinc-400 tracking-widest ml-1">Total Tasks</span></p>
                      </div>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="h-10 w-10 bg-[#E0E7FF] text-[#003366] flex items-center justify-center shadow-sm border border-[#003366]/10">
                          <CheckCircle2 size={20} />
                        </div>
                        <h3 className="text-lg font-semibold tracking-tight text-zinc-900">Work Integrity</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed font-medium">Verification of weekly submissions and work milestones.</p>
                      </div>
                      <div className="mt-8">
                        <p className="text-3xl font-semibold text-zinc-900">{intern.scheduleSubmissions.length} <span className="text-xs font-medium text-zinc-400 tracking-widest ml-1">Submissions</span></p>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="md:col-span-2 bg-white border border-zinc-200 p-8">
                      <h3 className="text-sm font-semibold tracking-[0.2em] text-[#003366] mb-8 flex items-center gap-3">
                        <Clock size={16} /> Recent Activity
                      </h3>
                      <div className="space-y-6">
                        {[...intern.tasks, ...intern.scheduleSubmissions]
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .slice(0, 5)
                          .map((activity, idx) => (
                            <div key={idx} className="flex gap-6 pb-6 border-b border-zinc-100 last:border-0 last:pb-0">
                              <div className="flex flex-col items-center gap-2">
                                <div className={`h-2 w-2 rounded-full mt-1.5 ${'title' in activity ? 'bg-zinc-900' : 'bg-red-600'}`} />
                                <div className="w-[1px] flex-1 bg-zinc-100" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-medium text-zinc-400 tracking-widest mb-1">
                                  {new Date(activity.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-[13px] font-semibold text-zinc-900">
                                  {'title' in activity ? `Assigned: ${activity.title}` : `Submitted: ${activity.schedule?.week || 'Work'}`}
                                </p>
                                <p className="text-[11px] text-zinc-500 font-medium mt-1">
                                  {'title' in activity ? activity.description : `Project: ${activity.schedule?.projectName || 'General Work'}`}
                                </p>
                              </div>
                            </div>
                          ))}
                        {intern.tasks.length === 0 && intern.scheduleSubmissions.length === 0 && (
                          <div className="py-12 text-center border-2 border-dashed border-zinc-100 italic text-zinc-400 text-sm">No recent signals recorded.</div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeSegment === "tasks" && (
                  <motion.div
                    key="tasks"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    {intern.tasks.length === 0 ? (
                      <div className="bg-white border border-zinc-200 p-12 text-center">
                        <p className="text-zinc-400 font-medium text-[10px] tracking-widest">No tasks assigned yet.</p>
                      </div>
                    ) : (
                      intern.tasks.map((task) => (
                        <div key={task.id} className="bg-white border border-zinc-200 p-6 hover:border-zinc-400 transition-colors group">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-4 flex-1">
                              <div className="flex items-center gap-3">
                                <div className="px-2 py-0.5 bg-[#E0E7FF] text-[#003366] text-[9px] font-semibold tracking-widest border border-[#003366]/5">
                                  {task.batch || 'General'}
                                </div>
                                <span className="text-[10px] font-medium text-zinc-400 tabular-nums">
                                  ID: {task.id.slice(-8)}
                                </span>
                              </div>
                              <h3 className="text-lg font-semibold tracking-tight text-zinc-900 leading-none">{task.title}</h3>
                              <p className="text-sm text-zinc-500 font-medium leading-relaxed max-w-2xl">{task.description}</p>
                              <div className="flex items-center gap-6 pt-2">
                                <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-400">
                                  <Clock size={12} /> {new Date(task.createdAt).toLocaleDateString()}
                                </div>
                                <div className={`flex items-center gap-2 text-[11px] font-semibold ${task.status === 'completed' ? 'text-emerald-600' : 'text-amber-500'}`}>
                                  {task.status === 'completed' ? <CheckCircle2 size={12} /> : <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />}
                                  {task.status}
                                </div>
                              </div>
                            </div>
                            {task.attachmentUrl && (
                              <a href={task.attachmentUrl} target="_blank" className="h-10 px-4 bg-[#E0E7FF] border border-[#003366]/10 text-[#003366] flex items-center gap-2 text-[10px] font-semibold tracking-wider hover:bg-[#003366] hover:text-white transition-all">
                                <FileText size={14} /> View Task
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                    {/* Personal Tasks */}
                    {intern.personalTasks && intern.personalTasks.length > 0 && (
                      <div className="pt-8 space-y-4">
                        <h3 className="text-[11px] font-semibold tracking-[0.2em] text-[#003366] flex items-center gap-2">
                          <CheckCircle2 size={14} /> Personal Directives
                        </h3>
                        {intern.personalTasks.map((ptask: any) => (
                          <div key={ptask.id} className="bg-white border border-zinc-200 p-6 flex items-center justify-between">
                            <div>
                              <p className="text-[14px] font-semibold text-zinc-900">{ptask.title}</p>
                              <p className="text-[11px] text-zinc-500 mt-1">{ptask.description || 'No description provided.'}</p>
                            </div>
                            <div className={`text-[10px] font-semibold px-2 py-1 rounded-sm ${ptask.status === 'DONE' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-50 text-zinc-500'}`}>
                              {ptask.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeSegment === "submissions" && (
                  <motion.div
                    key="submissions"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    {/* Exam Sessions */}
                    <div className="space-y-4">
                      <h3 className="text-[11px] font-semibold tracking-[0.2em] text-[#003366] flex items-center gap-2">
                        <ShieldCheck size={14} /> Exam History
                      </h3>
                      {intern.examSessions.length === 0 ? (
                        <div className="bg-white border border-zinc-200 p-8 text-center italic text-zinc-400 text-xs">No exam records found.</div>
                      ) : (
                        intern.examSessions.map((exam) => (
                          <div key={exam.id} className="bg-white border border-zinc-200 p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 bg-zinc-50 border border-zinc-100 flex items-center justify-center text-[#003366]">
                                <FileBadge size={18} />
                              </div>
                              <div>
                                <p className="text-[13px] font-semibold text-zinc-900">{exam.examType || 'General'} Exam</p>
                                <p className="text-[10px] font-medium text-zinc-400">{new Date(exam.startedAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-zinc-900">{exam.score !== null ? `${exam.score} Pts` : 'Pending'}</p>
                              <p className={`text-[9px] font-medium ${exam.status === 'SUBMITTED' ? 'text-emerald-600' : 'text-red-600'}`}>
                                {exam.status}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Weekly Submissions */}
                    <div className="space-y-4">
                      <h3 className="text-[11px] font-semibold tracking-[0.2em] text-[#003366] flex items-center gap-2">
                        <BookOpen size={14} /> Weekly Work
                      </h3>
                      {intern.scheduleSubmissions.length === 0 ? (
                        <div className="bg-white border border-zinc-200 p-8 text-center italic text-zinc-400 text-xs">No weekly logs found.</div>
                      ) : (
                        intern.scheduleSubmissions.map((sub) => (
                          <div key={sub.id} className="bg-white border border-zinc-200 p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                              <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <span className="text-[10px] font-semibold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5">
                                    {sub.schedule?.week || 'Week'}
                                  </span>
                                  <h4 className="text-[15px] font-semibold text-zinc-900 tracking-tight">{sub.schedule?.projectName || 'Weekly Work'}</h4>
                                </div>
                                <div className="flex items-center gap-6">
                                  <a href={sub.githubLink} target="_blank" className="flex items-center gap-2 text-[11px] font-medium text-zinc-500 hover:text-black hover:underline underline-offset-4">
                                    <Github size={12} /> GitHub Source
                                  </a>
                                  <a href={sub.liveLink} target="_blank" className="flex items-center gap-2 text-[11px] font-medium text-zinc-500 hover:text-black hover:underline underline-offset-4">
                                    <ExternalLink size={12} /> Live Link
                                  </a>
                                </div>
                              </div>
                              <div className="text-right flex flex-col items-end gap-2">
                                <span className="text-[10px] font-semibold text-zinc-400 tabular-nums">
                                  Submitted: {new Date(sub.createdAt).toLocaleString()}
                                </span>
                                {sub.marks && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-medium text-zinc-400">Score:</span>
                                    <span className="text-sm font-semibold text-zinc-900">{sub.marks}/100</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            {sub.review && (
                              <div className="mt-4 p-4 bg-zinc-50 border-l-2 border-[#003366] text-[12px] font-medium text-zinc-600 italic">
                                "{sub.review}"
                                {sub.reviewedBy && <span className="block mt-2 font-semibold text-[9px] text-zinc-400 not-italic">— {sub.reviewedBy}</span>}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {/* Other Submissions */}
                    {(taskSubmissions.length > 0 || uiuxSubmissions.length > 0) && (
                      <div className="space-y-4 pt-8">
                        <h3 className="text-[11px] font-semibold tracking-[0.2em] text-[#003366] flex items-center gap-2">
                          <CheckCircle2 size={14} /> Other Submissions
                        </h3>
                        {taskSubmissions.map((sub, idx) => (
                          <div key={idx} className="bg-white border border-zinc-200 p-6 flex items-center justify-between">
                            <div>
                              <p className="text-[13px] font-semibold text-zinc-900">{sub.taskAllocated}</p>
                              <p className="text-[10px] font-medium text-zinc-400 mt-1">Task Submission</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <a href={sub.githubLink} target="_blank" className="h-9 w-9 flex items-center justify-center bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-sm"><Github size={14} /></a>
                              <a href={sub.liveLink} target="_blank" className="h-9 w-9 flex items-center justify-center bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-sm"><ExternalLink size={14} /></a>
                            </div>
                          </div>
                        ))}
                        {uiuxSubmissions.map((sub, idx) => (
                          <div key={idx} className="bg-white border border-zinc-200 p-6 flex items-center justify-between">
                            <div>
                              <p className="text-[13px] font-semibold text-zinc-900">{sub.taskName}</p>
                              <p className="text-[10px] font-medium text-zinc-400 mt-1">Design Submission</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <a href={sub.taskLink} target="_blank" className="h-9 w-9 flex items-center justify-center bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-sm"><ExternalLink size={14} /></a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeSegment === "reports" && (
                  <motion.div
                    key="reports"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="bg-white border border-zinc-200 p-8"
                  >
                    <div className="max-w-4xl mx-auto space-y-12">
                      <div className="text-center space-y-2">
                        <h3 className="text-2xl font-semibold text-zinc-900 tracking-tighter">Performance Analytics</h3>
                        <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-[0.3em]">Comprehensive Activity Profile</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="p-6 bg-zinc-50 border border-zinc-100 text-center">
                          <p className="text-[9px] font-semibold text-zinc-400 mb-1">Success Rate</p>
                          <p className="text-2xl font-semibold text-zinc-900">
                             {Math.round(((intern.tasks.filter((t:any) => t.status==='completed').length + intern.scheduleSubmissions.length) / (intern.tasks.length || 1)) * 100)}%
                          </p>
                        </div>
                        <div className="p-6 bg-zinc-50 border border-zinc-100 text-center">
                          <p className="text-[9px] font-semibold text-zinc-400 mb-1">Total Submits</p>
                          <p className="text-2xl font-semibold text-zinc-900">{intern.scheduleSubmissions.length + taskSubmissions.length + uiuxSubmissions.length}</p>
                        </div>
                        <div className="p-6 bg-zinc-50 border border-zinc-100 text-center">
                          <p className="text-[9px] font-semibold text-zinc-400 mb-1">Presence</p>
                          <p className="text-2xl font-semibold text-zinc-900">{presentCount}d <span className="text-[10px] opacity-40">/ {totalDays}</span></p>
                        </div>
                        <div className="p-6 bg-zinc-50 border border-zinc-100 text-center">
                          <p className="text-[9px] font-semibold text-zinc-400 mb-1">Violations</p>
                          <p className="text-2xl font-semibold text-red-600">{intern.examSessions.reduce((acc: number, s: any) => acc + (s.violations || 0), 0)}</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                          <h4 className="text-[11px] font-semibold tracking-widest text-[#003366]">Attendance Breakdown</h4>
                          <p className="text-[10px] font-medium text-zinc-400 italic">Showing last 35 active sessions</p>
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                          {intern.attendances.slice(0, 35).map((att:any, i:number) => {
                             const dateObj = new Date(att.date);
                             return (
                              <div key={i} title={att.workSummary || 'No summary'} className={`h-10 border flex flex-col items-center justify-center text-[8px] font-medium transition-all hover:scale-105 cursor-help ${att.status === 'PRESENT' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                                <span>{dateObj.getDate()}/{dateObj.getMonth()+1}</span>
                                <span className="text-[6px] font-semibold opacity-50">{att.status === 'PRESENT' ? 'IN' : 'ABS'}</span>
                              </div>
                             )
                          })}
                        </div>
                      </div>

                      {/* Signals & Feedback */}
                      {feedback && feedback.length > 0 && (
                        <div className="space-y-6 pt-12 border-t border-zinc-100">
                          <div className="flex items-center justify-between">
                            <h4 className="text-[11px] font-semibold tracking-widest text-[#003366]">Intern Feedback</h4>
                            <p className="text-[10px] font-medium text-zinc-400">Post-Exam Sentiment</p>
                          </div>
                          <div className="space-y-4">
                            {feedback.map((f: any) => (
                              <div key={f.id} className="bg-zinc-50 border border-zinc-100 p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b border-zinc-200/50">
                                  <div>
                                    <p className="text-[9px] font-semibold text-zinc-400 mb-1">Exam Experience</p>
                                    <p className="text-[13px] font-medium text-zinc-700">"{f.examExperience}"</p>
                                  </div>
                                  <div>
                                    <p className="text-[9px] font-semibold text-zinc-400 mb-1">Learning Goals</p>
                                    <p className="text-[13px] font-medium text-zinc-700">{f.learningGoals}</p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-[9px] font-semibold text-zinc-400 mb-1">Suggestions for Upgrades</p>
                                  <p className="text-[13px] font-medium text-zinc-700 italic">"{f.upgradeSuggestions}"</p>
                                </div>
                                <p className="text-[9px] text-zinc-400 text-right">{new Date(f.createdAt).toLocaleDateString()}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-12 flex justify-center border-t border-zinc-100">
                        <div className="text-center">
                          <div className="h-16 w-16 border-[4px] border-[#003366] flex items-center justify-center mx-auto mb-4">
                            <Shield size={32} className="text-[#003366]" />
                          </div>
                          <p className="text-[10px] font-semibold text-[#003366] tracking-widest">Student Forge Certified</p>
                          <p className="text-[8px] font-medium text-zinc-400 mt-1">LMS Verification Profile</p>
                        </div>
                      </div>
                    </div>
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
