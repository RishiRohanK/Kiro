"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
   Users,
   Activity,
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
   RefreshCw,
   LogOut,
   Eye,
   Edit,
   Shield,
   MessageSquare,
   Zap,
   BookOpen,
   Video
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PWAInstallButton } from "@/app/components/PWAInstallButton";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
   year?: string;
   graduationYear?: string;
   dob?: string;
   interestedArea?: string;
   department?: string;
   profileImage?: string;
   githubLink?: string;
   batch?: string;
   attendancePercentage?: number;
   presentCount?: number;
   totalTrackingDays?: number;
}

const getCollegeLogo = (collegeName: string) => {
   const college = collegeName?.toLowerCase() || "";
   if (college.includes("cmrit") || college.includes("cmr")) {
      return "https://ik.imagekit.io/dypkhqxip/cmrit";
   }
   if (college.includes("kits") || college.includes("kamala institute")) {
      return "https://ik.imagekit.io/dypkhqxip/kits";
   }
   if (college.includes("mohan babu") || college.includes("mbu")) {
      return "https://upload.wikimedia.org/wikipedia/en/4/4b/Mohan_Babu_University_Logo%2C_Tirupati%2C_Andhra_Pradesh%2C_India.png";
   }
   if (college.includes("visvesvaraya")) {
      return "https://vcethyd.ac.in/wp-content/uploads/2026/02/Visvesvaraya-College-emblem-fin-white.png";
   }
   if (college.includes("malla reddy university")) {
      return "https://media.collegedekho.com/media/img/institute/logo/Malla_reddy_University_logo.png";
   }
   return null;
};

interface HiringApplication {
   id: string;
   name: string;
   email: string;
   phone: string;
   position: string;
   resumeLink: string;
   college?: string;
   portfolioLink?: string;
   yearOfStudy?: string;
   status: string;
   interviewTiming?: string;
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

interface BootcampRegistration {
   id: string;
   name: string;
   email: string;
   college: string;
   branch: string;
   year: string;
   phone: string;
   transactionId?: string;
   paymentStatus: string;
   createdAt: string;
}

export default function CleedDashboard() {
   const router = useRouter();
   const [activeTab, setActiveTab] = useState("overview");
   const [reportMonth, setReportMonth] = useState(new Date().getMonth() + 1);
   const [reportYear, setReportYear] = useState(new Date().getFullYear());
   const [isDownloadingReport, setIsDownloadingReport] = useState(false);
   const [viewingIntern, setViewingIntern] = useState<Intern | null>(null);
   const [interns, setInterns] = useState<Intern[]>([]);
   const [hiringApplications, setHiringApplications] = useState<HiringApplication[]>([]);
   const [tasks, setTasks] = useState<Task[]>([]);
   const [mentorshipSessions, setMentorshipSessions] = useState<MentorshipSession[]>([]);
   const [events, setEvents] = useState<EventItem[]>([]);
   const [ideas, setIdeas] = useState<IdeaItem[]>([]);
   const [internships, setInternships] = useState<InternshipItem[]>([]);
   const [employees, setEmployees] = useState<any[]>([]);
   const [bootcampRegistrations, setBootcampRegistrations] = useState<BootcampRegistration[]>([]);
   const [isLoading, setIsLoading] = useState(false);


   const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
   const [isAuthorizing, setIsAuthorizing] = useState<string | null>(null);
   const [internBatchFilter, setInternBatchFilter] = useState("All");

   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
   const [attendanceStats, setAttendanceStats] = useState<any[]>([]);
   const [currentAttendance, setCurrentAttendance] = useState<any[]>([]);
   const [markingId, setMarkingId] = useState<string | null>(null);

   const [taskData, setTaskData] = useState({ title: "", description: "", attachmentUrl: "", batch: "Batch 2" });
   const [sendingTask, setSendingTask] = useState(false);
   const [taskSuccess, setTaskSuccess] = useState(false);




   
   const [letterUrl, setLetterUrl] = useState("");
   const [offerLetterUrl, setOfferLetterUrl] = useState("");
   const [sendingLetter, setSendingLetter] = useState(false);
   const [sendingOfferLetter, setSendingOfferLetter] = useState(false);
   const [formSuccess, setFormSuccess] = useState(false);
   const [letterSuccess, setLetterSuccess] = useState(false);
   const [offerLetterSuccess, setOfferLetterSuccess] = useState(false);

   // Project certificate states
   const [certSubTab, setCertSubTab] = useState<"offer" | "individual" | "group">("offer");
   const [groupLetterUrl, setGroupLetterUrl] = useState("");
   const [selectedGroupInternIds, setSelectedGroupInternIds] = useState<string[]>([]);
   const [sendingGroupLetter, setSendingGroupLetter] = useState(false);
   const [groupLetterSuccess, setGroupLetterSuccess] = useState(false);

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
      teamInternIds: []
   });
   const [sendingSchedule, setSendingSchedule] = useState(false);
   const [scheduleSuccess, setScheduleSuccess] = useState(false);
   const [submissions, setSubmissions] = useState<any[]>([]);
   const [loadingSubmissions, setLoadingSubmissions] = useState(false);
   const [allSchedules, setAllSchedules] = useState<any[]>([]);
   const [loadingSchedules, setLoadingSchedules] = useState(false);
   const [editingSchedule, setEditingSchedule] = useState<any>(null);
   const [batchFilter, setBatchFilter] = useState("Batch 1");
   const [submissionFilter, setSubmissionFilter] = useState("all");

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

   const [internshipData, setInternshipData] = useState({
      title: "",
      description: "",
      role: "",
      company: "",
      location: "",
      duration: "",
      stipend: "",
      image: "",
      applyLink: ""
   });
   const [sendingInternship, setSendingInternship] = useState(false);
   const [internshipSuccess, setInternshipSuccess] = useState(false);

   const [employeeData, setEmployeeData] = useState({
      name: "",
      email: "",
      password: "",
      role: "MEDIA_TEAM" as any,
      batch: "Batch 1"
   });
   const [sendingEmployee, setSendingEmployee] = useState(false);
   const [employeeSuccess, setEmployeeSuccess] = useState(false);
   const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null);
   const [editEmployeeData, setEditEmployeeData] = useState<any>({});

   const [offerData, setOfferData] = useState({ name: "", email: "", link: "", message: "" });
   const [sendingOffer, setSendingOffer] = useState(false);
   const [offerSuccess, setOfferSuccess] = useState(false);

   const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
   const [selectedApplicant, setSelectedApplicant] = useState<HiringApplication | null>(null);
   const [interviewTiming, setInterviewTiming] = useState("");
   const [isSendingInterview, setIsSendingInterview] = useState(false);
   const [interviewSuccess, setInterviewSuccess] = useState(false);

   const [examIsActive, setExamIsActive] = useState(false);
   const [globalExitKey, setGlobalExitKey] = useState("000000");
   const [isUpdatingExam, setIsUpdatingExam] = useState(false);
   const [isSchedulingExam, setIsSchedulingExam] = useState(false);
   const [examSessions, setExamSessions] = useState<any[]>([]);
   const [examViewMode, setExamViewMode] = useState<"UI_UX" | "FULLSTACK">("UI_UX");
   const [feedbacks, setFeedbacks] = useState<any[]>([]);
   const [uiuxSubmissions, setUiuxSubmissions] = useState<any[]>([]);

   const [examsList, setExamsList] = useState<any[]>([]);
   const [richExamsList, setRichExamsList] = useState<any[]>([]);
   const [examFormData, setExamFormData] = useState({ title: "", description: "", date: "", duration: "", batch: "All" });
   const [sendingExamForm, setSendingExamForm] = useState(false);

   const [resourcesList, setResourcesList] = useState<any[]>([]);
   const [copySuccess, setCopySuccess] = useState<string | null>(null);
   const [resourceFormData, setResourceFormData] = useState({ 
       title: "", description: "", type: "PDF", url: "", category: "Documentation", date: new Date().toISOString().split('T')[0], batch: "All" 
   });
   const [sendingResourceForm, setSendingResourceForm] = useState(false);

   const handleScheduleInterview = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedApplicant || !interviewTiming) return;
      setIsSendingInterview(true);
      setInterviewSuccess(false);

      const isReschedule = selectedApplicant.status === "interview_scheduled";

      try {
         const res = await fetch("/api/cleed/hiring/interview", {
            method: isReschedule ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ applicantId: selectedApplicant.id, timing: interviewTiming }),
         });
         const data = await res.json();
         if (data.success) {
            setInterviewSuccess(true);
            setTimeout(() => {
               setIsInterviewModalOpen(false);
               setInterviewSuccess(false);
               setInterviewTiming("");
               fetchData();
            }, 2000);
         }
      } catch (error) {
         console.error("Interview schedule action failed");
      } finally {
         setIsSendingInterview(false);
      }
   };


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

   const downloadExamPdf = () => {
      const sorted = [...examSessions].sort((a, b) => (b.score || 0) - (a.score || 0));
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      const html = `
         <html>
         <head>
            <title>Exam Results Report</title>
            <style>
               body { font-family: sans-serif; padding: 40px; color: #18181b; }
               h1 { color: #000; font-size: 20px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
               p { font-size: 10px; color: #71717a; margin-bottom: 30px; }
               table { width: 100%; border-collapse: collapse; margin-top: 20px; }
               th, td { border: 1px solid #e4e4e7; padding: 10px; text-align: left; }
               th { background-color: #f4f4f5; font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a; font-weight: bold; }
               td { font-size: 11px; }
               .rank { font-weight: bold; color: #a1a1aa; width: 40px; }
               .score { font-weight: bold; color: #18181b; }
               .violations { font-weight: bold; color: #dc2626; }
               .status { font-size: 9px; font-weight: bold; padding: 2px 6px; background: #f4f4f5; display: inline-block; }
            </style>
         </head>
         <body>
            <h1>Final Assessment Rankings</h1>
            <p>Batch: ${batchFilter} | Report Generated: ${new Date().toLocaleString()} | Total Sessions: ${sorted.length}</p>
            <table>
               <thead>
                  <tr>
                     <th>Rank</th>
                     <th>Intern Name</th>
                     <th>Time Started</th>
                     <th>Final Score</th>
                     <th>Violations</th>
                     <th>Status</th>
                  </tr>
               </thead>
               <tbody>
                  ${sorted.map((s, idx) => `
                     <tr>
                        <td class="rank">#${idx + 1}</td>
                        <td style="font-weight: 500;">${s.user?.name || "N/A"}</td>
                        <td>${new Date(s.startedAt).toLocaleString()}</td>
                        <td class="score">${s.score !== null ? s.score + ' / 150' : '--'}</td>
                        <td class="violations">${s.violations}</td>
                        <td><span class="status">${s.status}</span></td>
                     </tr>
                  `).join('')}
               </tbody>
            </table>
            <div style="margin-top: 50px; border-top: 1px solid #e4e4e7; padding-top: 20px; font-size: 8px; color: #a1a1aa; text-align: center;">
               Student Forge Industrial Gateway - Proprietary Examination Data
            </div>
            <script>
               window.onload = () => {
                  window.print();
                  setTimeout(() => window.close(), 500);
               };
            </script>
         </body>
         </html>
      `;
      printWindow.document.write(html);
      printWindow.document.close();
   };

   const downloadInternsPdf = () => {
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      const html = `
         <html>
         <head>
            <title>Interns Directory Report</title>
            <style>
               body { font-family: sans-serif; padding: 40px; color: #18181b; }
               h1 { color: #000; font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em; border-bottom: 4px solid #000; padding-bottom: 10px; margin-bottom: 30px; }
               .header-meta { font-size: 10px; color: #71717a; margin-bottom: 40px; display: flex; justify-content: space-between; }
               .intern-card { border: 1px solid #e4e4e7; padding: 20px; margin-bottom: 20px; display: flex; gap: 24px; page-break-inside: avoid; }
               .profile-image { width: 120px; height: 120px; background: #f4f4f5; object-fit: cover; flex-shrink: 0; border: 1px solid #000; }
               .placeholder-image { width: 120px; height: 120px; background: #000; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 40px; font-weight: bold; flex-shrink: 0; }
               .info { flex: 1; display: grid; grid-template-cols: 1fr 1fr; gap: 15px; }
               .field { display: flex; flex-direction: column; gap: 2px; }
               .label { font-size: 8px; font-weight: bold; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.1em; }
               .value { font-size: 12px; font-weight: bold; color: #18181b; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
               .status-badge { display: inline-block; padding: 2px 6px; font-size: 9px; font-weight: bold; text-transform: uppercase; background: #000; color: #fff; }
            </style>
         </head>
         <body>
            <h1>Interns Protocol Directory</h1>
            <div class="header-meta">
               <span>Generated: ${new Date().toLocaleString()}</span>
               <span>Total Records: ${interns.length}</span>
            </div>
            ${interns.map(intern => `
               <div class="intern-card">
                  ${intern.profileImage ? 
                     `<img src="${intern.profileImage}" class="profile-image" />` : 
                     `<div class="placeholder-image">${intern.name?.charAt(0) || 'U'}</div>`
                  }
                  <div class="info">
                     <div class="field" style="grid-column: span 2">
                        <span class="label">Full Name</span>
                        <span class="value" style="font-size: 16px; text-transform: uppercase;">${intern.name}</span>
                     </div>
                     <div class="field">
                        <span class="label">Email Identity</span>
                        <span class="value">${intern.email}</span>
                     </div>
                     <div class="field">
                        <span class="label">Institution</span>
                        <span class="value">${intern.college || 'N/A'}</span>
                     </div>
                     <div class="field">
                        <span class="label">Department / Year</span>
                        <span class="value">${intern.department || intern.branch || 'N/A'} / ${intern.year || 'N/A'}</span>
                     </div>
                     <div class="field">
                        <span class="label">Batch</span>
                        <span class="value">${intern.batch || 'Batch 1'}</span>
                     </div>
                     <div class="field">
                        <span class="label">Date of Birth</span>
                        <span class="value">${intern.dob || 'N/A'}</span>
                     </div>
                     <div class="field">
                        <span class="label">Graduation Goal</span>
                        <span class="value">${intern.graduationYear || 'N/A'}</span>
                     </div>
                     <div class="field">
                        <span class="label">Standing</span>
                        <span class="value"><span class="status-badge">${intern.isApproved ? 'Approved' : 'Review'}</span></span>
                     </div>
                     <div class="field" style="grid-column: span 2">
                        <span class="label">Tech Stack / Interest</span>
                        <span class="value" style="white-space: normal;">${intern.interestedArea || 'N/A'}</span>
                     </div>
                  </div>
               </div>
            `).join('')}
            <script>
               window.onload = () => {
                  window.print();
                  setTimeout(() => window.close(), 500);
               };
            </script>
         </body>
         </html>
      `;
      printWindow.document.write(html);
      printWindow.document.close();
   };

   useEffect(() => {
      fetchData();
      const interval = setInterval(fetchData, 60000); 
      
      const fetchFeedbacks = async () => {
         try {
            const res = await fetch("/api/cleed/feedback");
            const data = await res.json();
            if (Array.isArray(data)) setFeedbacks(data);
         } catch (err) { console.error("Feedback fetch failure"); }
      };
      
      fetchFeedbacks();

      const fetchUIUXSubmissions = async () => {
         try {
            const res = await fetch("/api/intern/uiux-submission");
            const data = await res.json();
            if (Array.isArray(data)) setUiuxSubmissions(data);
         } catch (err) { console.error("UI/UX submissions fetch failure"); }
      };
      fetchUIUXSubmissions();
      return () => clearInterval(interval);
   }, []);

   useEffect(() => {
      if (activeTab === "submissions") {
         fetchSubmissions();
      }
   }, [activeTab]);


   const handleDeleteRichExam = async (id: string) => {
      if (!confirm("Permanently delete this advanced exam node?")) return;
      try {
         await fetch(`/api/admin/exam?id=${id}`, { method: "DELETE" });
         fetchData();
      } catch (err) { console.error("Rich Exam deletion failed"); }
   };

   const handleCopyLink = (id: string) => {
      const url = `${window.location.origin}/exams?id=${id}`;
      navigator.clipboard.writeText(url);
      setCopySuccess(id);
      setTimeout(() => setCopySuccess(null), 2000);
   };

   const handleDeleteHiringApplication = async (id: string) => {
      if (!confirm("Permanently neutralize this application node?")) return;
      try {
         await fetch(`/api/hiring?id=${id}`, { method: "DELETE" });
         fetchData();
      } catch (err) {
         console.error("Delete fail");
      }
   };

   const fetchBootcampRegistrations = async () => {
      try {
         const res = await fetch("/api/cleed/bootcamp");
         const data = await res.json();
         if (data.success) setBootcampRegistrations(data.registrations);
      } catch (err) { console.error("Bootcamp fetch failure"); }
   };

   const handleUpdateBootcampStatus = async (id: string, status: string) => {
      try {
         const res = await fetch("/api/cleed/bootcamp", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status })
         });
         if (res.ok) fetchBootcampRegistrations();
      } catch (err) { console.error("Status update failure"); }
   };

   const fetchSubmissions = async () => {
      setLoadingSubmissions(true);
      try {
         const res = await fetch("/api/cleed/submissions");
         const data = await res.json();
         if (data.weekly) {
            setSubmissions(data.weekly);
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

   const handleDownloadMonthlyAttendance = async () => {
      setIsDownloadingReport(true);
      try {
         const res = await fetch(`/api/cleed/attendance/monthly?month=${reportMonth}&year=${reportYear}`);
         const attendanceData = await res.json();
         
         if (!Array.isArray(attendanceData)) {
            alert("No attendance data found for this period.");
            return;
         }

         const daysInMonth = new Date(reportYear, reportMonth, 0).getDate();
         const headers = ["Intern Name", "Email", "Batch", ...Array.from({ length: daysInMonth }, (_, i) => `Day ${i + 1}`), "Total Present"];

         const userMap = new Map();
         interns.filter(i => i.isApproved).forEach(intern => {
            userMap.set(intern.id, {
               name: intern.name,
               email: intern.email,
               batch: intern.batch || "N/A",
               days: Array(daysInMonth).fill("-"),
               presentCount: 0
            });
         });

         attendanceData.forEach(record => {
            const intern = userMap.get(record.userId);
            if (intern) {
               const day = new Date(record.date).getDate();
               if (record.status === "PRESENT") {
                  intern.days[day - 1] = "P";
                  intern.presentCount++;
               } else if (record.status === "ABSENT") {
                  intern.days[day - 1] = "A";
               }
            }
         });

         const rows = Array.from(userMap.values()).map(u => [
            u.name,
            u.email,
            u.batch,
            ...u.days,
            u.presentCount
         ]);

         const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
         ].join("\n");

         const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
         const url = URL.createObjectURL(blob);
         const link = document.createElement("a");
         link.href = url;
         const monthName = new Date(reportYear, reportMonth - 1).toLocaleString('default', { month: 'long' });
         link.setAttribute("download", `Attendance_Report_${monthName}_${reportYear}.csv`);
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
      } catch (err) {
         console.error("Report download failed:", err);
         alert("Failed to generate report.");
      } finally {
         setIsDownloadingReport(false);
      }
   };

   const handleDownloadMonthlyAttendancePDF = async () => {
      setIsDownloadingReport(true);
      try {
         const res = await fetch(`/api/cleed/attendance/monthly?month=${reportMonth}&year=${reportYear}`);
         const attendanceData = await res.json();
         
         if (!Array.isArray(attendanceData)) {
            alert("No attendance data found for this period.");
            return;
         }

         const daysInMonth = new Date(reportYear, reportMonth, 0).getDate();
         const monthName = new Date(reportYear, reportMonth - 1).toLocaleString('default', { month: 'long' });

         const doc = new jsPDF('l', 'mm', 'a4');
         
         doc.setFontSize(20);
         doc.setTextColor(0, 85, 255);
         doc.text(`Monthly Attendance Report - ${monthName} ${reportYear}`, 14, 22);
         
         doc.setFontSize(10);
         doc.setTextColor(100);
         doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

         const userMap = new Map();
         interns.filter(i => i.isApproved).forEach(intern => {
            userMap.set(intern.id, {
               name: intern.name,
               email: intern.email,
               batch: intern.batch || "N/A",
               days: Array(daysInMonth).fill("-"),
               presentCount: 0
            });
         });

         attendanceData.forEach(record => {
            const intern = userMap.get(record.userId);
            if (intern) {
               const day = new Date(record.date).getDate();
               if (record.status === "PRESENT") {
                  intern.days[day - 1] = "P";
                  intern.presentCount++;
               } else if (record.status === "ABSENT") {
                  intern.days[day - 1] = "A";
               }
            }
         });

         const headers = ["Name", "Batch", ...Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`), "%"];
         const rows = Array.from(userMap.values()).map(u => {
            const percentage = ((u.presentCount / daysInMonth) * 100).toFixed(1);
            return [
               u.name,
               u.batch,
               ...u.days,
               `${percentage}%`
            ];
         });

         autoTable(doc, {
            head: [headers],
            body: rows,
            startY: 40,
            styles: { fontSize: 6, cellPadding: 0.8, halign: 'center' },
            headStyles: { fillColor: [0, 85, 255], textColor: 255, fontStyle: 'bold' },
            columnStyles: {
               0: { halign: 'left', cellWidth: 35 },
               1: { halign: 'left', cellWidth: 15 }
            },
            alternateRowStyles: { fillColor: [245, 247, 250] },
            margin: { top: 40 },
         });

         doc.save(`Attendance_Report_${monthName}_${reportYear}.pdf`);
      } catch (err) {
         console.error("PDF generation failed:", err);
         alert("Failed to generate PDF report.");
      } finally {
         setIsDownloadingReport(false);
      }
   };

   const downloadHiringCsv = () => {
      if (hiringApplications.length === 0) return;

      const headers = ["ID", "Name", "Email", "Phone", "Position", "College", "Year", "Portfolio", "Resume Link", "Status", "Created At"];
      const rows = hiringApplications.map(i => [
         i.id,
         i.name,
         i.email,
         i.phone,
         i.position,
         i.college || "N/A",
         i.yearOfStudy || "N/A",
         i.portfolioLink || "N/A",
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

   const downloadMissingCsv = (list: any[], batch: string) => {
      if (list.length === 0) return;

      const headers = ["ID", "Name", "Email", "Batch", "Status"];
      const rows = list.map(i => [
         i.id,
         i.name,
         i.email,
         i.batch,
         "NOT SUBMITTED (Task 1)"
      ]);

      const csvContent = [
         headers.join(","),
         ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `not_submitted_Task1_${batch.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   };

   const fetchAllSchedules = async () => {
      try {
         const res = await fetch("/api/intern/schedule");
         const data = await res.json();
         if (data.success) setAllSchedules(data.schedules);
      } catch (err) { console.error("Schedules fetch failure"); }
   };

   useEffect(() => {
      fetchAllSchedules();
   }, []);

   useEffect(() => {
      fetchAttendance();
   }, [selectedDate]);

   const fetchAttendance = async () => {
      try {
         const res = await fetch(`/api/cleed/attendance?date=${selectedDate}`);
         const data = await res.json();
         if (Array.isArray(data)) setCurrentAttendance(data);
         else setCurrentAttendance([]);
      } catch (err) {
         console.error("Attendance synchronization failure");
      }
   };

   const fetchData = async () => {

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

      const fetchEmployees = async () => {
         try {
            const res = await fetch("/api/cleed/employees");
            const data = await res.json();
            if (data.success) setEmployees(data.employees);
         } catch (err) { console.error("Employees fetch failure"); }
      };

      const fetchExamStatus = async () => {
         try {
            const res = await fetch("/api/cleed/exams/status");
            const data = await res.json();
            if (data.id) {
                setExamIsActive(data.isActive);
                if (data.exitKey) setGlobalExitKey(data.exitKey);
            }
         } catch (err) { console.error("Exam status fetch failure"); }
      };

      const fetchExamSessions = async () => {
         try {
            const res = await fetch("/api/exams/session");
            const data = await res.json();
            if (Array.isArray(data)) setExamSessions(data);
         } catch (err) { console.error("Exam sessions fetch failure"); }
      };

      const fetchBootcampRegistrations = async () => {
         try {
            const res = await fetch("/api/cleed/bootcamp");
            const data = await res.json();
            if (data.success) setBootcampRegistrations(data.registrations);
         } catch (err) { console.error("Bootcamp fetch failure"); }
      };

      const fetchExamsList = async () => {
         try {
            const res = await fetch("/api/cleed/exams");
            const data = await res.json();
            if (data.success) setExamsList(data.exams);
         } catch (err) { console.error("Exams fetch failure"); }
      };

      const fetchRichExams = async () => {
         try {
            const res = await fetch("/api/admin/exam");
            const data = await res.json();
            if (data.success) setRichExamsList(data.exams);
         } catch (err) { console.error("Rich exams fetch failure"); }
      };

      const fetchResourcesList = async () => {
         try {
            const res = await fetch("/api/cleed/resources");
            const data = await res.json();
            if (data.success) setResourcesList(data.resources);
         } catch (err) { console.error("Resources fetch failure"); }
      };

      await Promise.allSettled([
         fetchInterns(),
         fetchTasks(),
         fetchMentorship(),
         fetchHiring(),
         fetchEvents(),
         fetchIdeas(),
         fetchInternships(),
         fetchEmployees(),
         fetchAllSchedules(),
         fetchSubmissions(),
         fetchExamStatus(),
         fetchExamSessions(),
         fetchBootcampRegistrations(),
         fetchExamsList(),
         fetchRichExams(),
         fetchResourcesList()
      ]);
      setIsLoading(false);
   };

   const onlineInternsCount = interns.filter(intern => {
      if (!intern.lastActive) return false;
      const lastActive = new Date(intern.lastActive).getTime();
      const now = new Date().getTime();
      return (now - lastActive) < (5 * 60 * 1000);
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

   const handleSendGroupLetter = async (e: React.FormEvent) => {
      e.preventDefault();
      if (selectedGroupInternIds.length === 0 || !groupLetterUrl) return;
      setSendingGroupLetter(true);
      try {
         const res = await fetch("/api/cleed/letter/bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ internIds: selectedGroupInternIds, letterUrl: groupLetterUrl }),
         });

         if (res.ok) {
            setGroupLetterSuccess(true);
            setGroupLetterUrl("");
            setSelectedGroupInternIds([]);
            setTimeout(() => setGroupLetterSuccess(false), 3000);
            fetchData();
         }
      } catch (err) {
         console.error("Group letter transmission failed");
      } finally {
         setSendingGroupLetter(false);
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

   const toggleExamStatus = async () => {
      setIsUpdatingExam(true);
      try {
         const res = await fetch("/api/cleed/exams/status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: !examIsActive })
         });
         if (res.ok) {
            setExamIsActive(!examIsActive);
         }
      } catch (err) {
         console.error("Exam status update failure");
      } finally {
         setIsUpdatingExam(false);
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
            setInternshipData({ title: "", description: "", role: "", company: "", location: "", duration: "", stipend: "", image: "", applyLink: "" });
            setTimeout(() => setInternshipSuccess(false), 3000);
            fetchData();
         }
      } catch (err) {
         console.error("Internship registry failure.");
      }
   };

   const handleUpdateEmployee = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingEmployeeId) return;
      try {
         const res = await fetch("/api/cleed/employees", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editingEmployeeId, ...editEmployeeData })
         });
         if (res.ok) {
            setEditingEmployeeId(null);
            const empRes = await fetch("/api/cleed/employees");
            const empData = await empRes.json();
            if (empData.success) setEmployees(empData.employees);
         }
      } catch (err) {
         console.error("Employee update failure.");
      }
   };

   const handlePostEmployee = async (e: React.FormEvent) => {
      e.preventDefault();
      setSendingEmployee(true);
      try {
         const res = await fetch("/api/cleed/employees", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(employeeData)
         });
         const data = await res.json();
         if (res.ok) {
            setEmployeeSuccess(true);
            setEmployeeData({ name: "", email: "", password: "", role: "MEDIA_TEAM" as any, batch: "Batch 1" });
            setTimeout(() => setEmployeeSuccess(false), 3000);
            const empRes = await fetch("/api/cleed/employees");
            const empData = await empRes.json();
            if (empData.success) setEmployees(empData.employees);
         } else {
            alert(data.error || "Failed to create employee");
         }
      } catch (err) {
         console.error("Employee registry failure.");
      } finally {
         setSendingEmployee(false);
      }
   };

   const handleSendOffer = async (e: React.FormEvent) => {
      e.preventDefault();
      setSendingOffer(true);
      try {
         const res = await fetch("/api/cleed/offer-letter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               name: offerData.name,
               email: offerData.email,
               offerLetterUrl: offerData.link,
               customMessage: offerData.message
            })
         });
         if (res.ok) {
            setOfferSuccess(true);
            setOfferData({ name: "", email: "", link: "", message: "" });
            setTimeout(() => setOfferSuccess(false), 3000);
         } else {
            const errData = await res.json();
            alert(errData.error || "Failed to send offer letter");
         }
      } catch (err) {
         console.error("Offer letter dispatch failure.");
      } finally {
         setSendingOffer(false);
      }
   };

   const handleDeleteEmployee = async (id: string) => {
      if (!confirm("Are you sure you want to remove this employee?")) return;
      try {
         const res = await fetch(`/api/cleed/employees?id=${id}`, { method: "DELETE" });
         if (res.ok) {
            const empRes = await fetch("/api/cleed/employees");
            const empData = await empRes.json();
            if (empData.success) setEmployees(empData.employees);
         }
      } catch (err) {
         console.error("Employee deletion failed");
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
      if (!confirm("Neutralize this opportunity?")) return;
      try {
         const res = await fetch(`/api/cleed/internships?id=${id}`, { method: "DELETE" });
         if (res.ok) fetchData();
      } catch (err) {
         console.error("Opportunity neutralizing failed");
      }
   };

   const handlePostExam = async (e: React.FormEvent) => {
      e.preventDefault();
      setSendingExamForm(true);
      try {
         const res = await fetch("/api/cleed/exams", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(examFormData)
         });
         if (res.ok) {
            setExamFormData({ title: "", description: "", date: "", duration: "", batch: "All" });
            const fetchExams = async () => {
               const res = await fetch("/api/cleed/exams");
               const data = await res.json();
               if (data.success) setExamsList(data.exams);
            };
            fetchExams();
         }
      } catch (err) { console.error("Exam registry failure"); }
      finally { setSendingExamForm(false); }
   };

   const handleDeleteExam = async (id: string) => {
      if (!confirm("Remove this scheduled exam?")) return;
      try {
         const res = await fetch(`/api/cleed/exams?id=${id}`, { method: "DELETE" });
         if (res.ok) {
            const fetchExams = async () => {
               const res = await fetch("/api/cleed/exams");
               const data = await res.json();
               if (data.success) setExamsList(data.exams);
            };
            fetchExams();
         }
      } catch (err) { console.error("Exam deletion failure"); }
   };

   const handlePostResource = async (e: React.FormEvent) => {
      e.preventDefault();
      setSendingResourceForm(true);
      try {
         const res = await fetch("/api/cleed/resources", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resourceFormData)
         });
         
         const data = await res.json();
         
         if (res.ok && data.success) {
            alert("Resource published successfully!");
            setResourceFormData({ 
               title: "", 
               description: "", 
               type: "PDF", 
               url: "", 
               category: "Documentation", 
               date: new Date().toISOString().split('T')[0], 
               batch: "All" 
            });
            // Re-fetch resources list
            const fetchRes = await fetch("/api/cleed/resources");
            const fetchDate = await fetchRes.json();
            if (fetchDate.success) setResourcesList(fetchDate.resources);
         } else {
            alert(`Failed to publish resource: ${data.error || 'Unknown error'}`);
         }
      } catch (err) { 
         console.error("Resource registry failure", err);
         alert("Resource registry failure. Please check your connection.");
      } finally { 
         setSendingResourceForm(false); 
      }
   };

   const handleDeleteResource = async (id: string) => {
      if (!confirm("Remove this technical resource?")) return;
      try {
         const res = await fetch(`/api/cleed/resources?id=${id}`, { method: "DELETE" });
         if (res.ok) {
            const fetchResources = async () => {
               const res = await fetch("/api/cleed/resources");
               const data = await res.json();
               if (data.success) setResourcesList(data.resources);
            };
            fetchResources();
         }
      } catch (err) { console.error("Resource deletion failure"); }
   };

   const raisedHandsCount = interns.filter(i => i.handRaised).length;

   return (
      <div className="min-h-screen bg-[#F5F7FA] font-sans text-zinc-900 pb-20 md:pb-0">
         { }
         <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white z-[60] flex items-center justify-between px-6 pt-[env(safe-area-inset-top)] box-content border-b border-zinc-100 shadow-sm group">
            <div className="flex items-center gap-2">
               <span className="text-xl font-black text-zinc-900 tracking-tighter uppercase leading-none select-none">Cleed</span>
               <div className="h-1.5 w-1.5 rounded-none" style={{ backgroundColor: '#F5332C' }} />
            </div>
            <button
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               className="text-zinc-400 p-2"
            >
               {isMobileMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
            </button>
         </div>

         { }
         <AnimatePresence>
            {isMobileMenuOpen && (
               <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="md:hidden fixed inset-0 z-[55] pt-24 px-6 overflow-y-auto pb-40"
                  style={{ backgroundColor: '#F5332C' }}
               >
                  <div className="grid grid-cols-2 gap-3">
                     {[
                        { id: "overview", icon: LayoutDashboard, label: "Home" },
                        { id: "events", icon: LayoutDashboard, label: "Events" },
                        { id: "ideas", icon: Globe, label: "Ideas" },
                        { id: "interns", icon: Users, label: "Interns" },
                        { id: "authorizations", icon: ShieldCheck, label: "Approvals" },
                        { id: "hiring", icon: Briefcase, label: "Hiring" },
                        { id: "internships", icon: Briefcase, label: "Internships" },
                        { id: "certification", icon: FileBadge, label: "Certificates" },
                        { id: "attendance", icon: CalendarCheck, label: "Attendance" },
                        { id: "vault", icon: Shield, label: "Vault" },
                        { id: "mailer", icon: Mail, label: "Mailer" },
                        { id: "schedule", icon: Calendar, label: "Daily Plan" },
                        { id: "manage_schedules", icon: Settings, label: "Schedules" },
                        { id: "assign", icon: Send, label: "Dispatch" },
                        { id: "submissions", icon: ExternalLink, label: "Audit" },
                        { id: "mentorship", icon: Users, label: "Mentors" },
                        { id: "history", icon: History, label: "Logbook" }
                     ].map((item) => (
                        <button
                           key={item.id}
                           onClick={() => { 
                              if (item.id === "vault") {
                                 router.push("/cleed/dashboard/submissions");
                              } else if (item.id === "mailer") {
                                 router.push("/cleed/dashboard/bootcamp-mailer");
                              } else {
                                 setActiveTab(item.id); 
                              }
                              setIsMobileMenuOpen(false); 
                           }}
                           className={`h-24 border flex flex-col items-center justify-center gap-2.5 transition-all rounded-none ${activeTab === item.id
                              ? "bg-white/20 text-white border-white border-l-4 -ml-[1px]"
                              : "bg-white/5 text-white/80 border-white/10"
                              }`}
                        >
                           <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                           <span className="text-[11px] font-bold text-center tracking-tight leading-none">{item.label}</span>
                        </button>
                     ))}
                  </div>
                  <div className="mt-12 pt-8 border-t border-white/10 text-center pb-20">
                     <p className="text-white/40 text-[9px] font-bold tracking-widest uppercase">Cleed Admin</p>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         { }
         <aside className="hidden md:flex fixed left-0 top-0 h-full w-20 lg:w-[260px] border-r border-red-700 z-50 flex-col pt-[env(safe-area-inset-top)]" style={{ backgroundColor: '#F5332C' }}>
            <div className="p-8 pb-4 flex items-center justify-start gap-2">
               <span className="text-2xl font-black text-white tracking-tighter uppercase leading-none select-none">Cleed</span>
               <div className="h-1.5 w-1.5 bg-white rounded-none" />
            </div>

            <nav className="flex-1 mt-6 px-3 overflow-y-auto space-y-4 custom-scrollbar pb-8">
               <details open className="group">
                  <summary className="hidden lg:flex items-center justify-between text-[11px] font-bold text-white/60 uppercase tracking-widest px-3 py-2 cursor-pointer hover:text-white transition-colors select-none list-none [&::-webkit-details-marker]:hidden">
                     Records
                     <ChevronDown size={14} className="group-open:rotate-180 transition-transform text-white/40" />
                  </summary>
                  <div className="mt-1 space-y-1 ml-2 border-l border-white/10 pl-2">
                     {[
                        { id: "interns", icon: Users, label: "Interns" },
                        { id: "internships", icon: Briefcase, label: "Internships" },
                        { id: "authorizations", icon: ShieldCheck, label: "Approvals" },
                        { id: "employees", icon: ShieldCheck, label: "Employees" },
                        { id: "certification", icon: FileBadge, label: "Certificates" },
                        { id: "exams", icon: FileText, label: "Exams" },
                        { id: "resources", icon: BookOpen, label: "Resources" },
                        { id: "bootcamp", icon: Zap, label: "Bootcamp" },
                        { id: "mailer", icon: Mail, label: "Mailer" },
                        { id: "attendance", icon: CalendarCheck, label: "Attendance" },
                        { id: "vault", icon: Shield, label: "Vault" },
                     ].map((item) => (
                        <button
                           key={item.id}
                           onClick={() => {
                              if (item.id === "vault") {
                                 router.push("/cleed/dashboard/submissions");
                              } else if (item.id === "mailer") {
                                 router.push("/cleed/dashboard/bootcamp-mailer");
                              } else {
                                 setActiveTab(item.id);
                              }
                           }}
                           className={`w-full h-10 flex items-center px-3 gap-3 transition-all rounded-none ${activeTab === item.id
                              ? "bg-white/10 text-white font-bold border-l-2 border-white -ml-[9px] pl-[10px]"
                              : "text-white/70 hover:text-white hover:bg-white/5"
                              }`}
                        >
                           <item.icon size={16} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                           <span className={`hidden lg:block text-[13px]`}>{item.label}</span>
                        </button>
                     ))}
                  </div>
               </details>

               <details open className="group">
                  <summary className="hidden lg:flex items-center justify-between text-[11px] font-bold text-white/60 uppercase tracking-widest px-3 py-2 cursor-pointer hover:text-white transition-colors select-none list-none [&::-webkit-details-marker]:hidden">
                     Tracking
                     <ChevronDown size={14} className="group-open:rotate-180 transition-transform text-white/40" />
                  </summary>
                  <div className="mt-1 space-y-1 ml-2 border-l border-white/10 pl-2">
                     {[
                        { id: "schedule", icon: Calendar, label: "Daily Plan" },
                        { id: "manage_schedules", icon: Settings, label: "Manage" },
                        { id: "assign", icon: Send, label: "Assign" },
                        { id: "submissions", icon: ExternalLink, label: "Audit" },
                        { id: "mentorship", icon: Users, label: "Mentors" },
                        { id: "history", icon: History, label: "Log" }
                     ].map((item) => (
                        <button
                           key={item.id}
                           onClick={() => {
                              if (item.id === "vault") {
                                 router.push("/cleed/dashboard/submissions");
                              } else {
                                 setActiveTab(item.id);
                              }
                           }}
                           className={`w-full h-10 flex items-center px-3 gap-3 transition-all rounded-none ${activeTab === item.id
                              ? "bg-white/10 text-white font-bold border-l-2 border-white -ml-[9px] pl-[10px]"
                              : "text-white/70 hover:text-white hover:bg-white/5"
                              }`}
                        >
                           <item.icon size={16} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                           <span className={`hidden lg:block text-[13px]`}>{item.label}</span>
                        </button>
                     ))}
                  </div>
               </details>
            </nav>

            <div className="p-5 border-t border-white/10">
               <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-white/10 flex items-center justify-center text-white rounded-none">
                     <Users size={16} />
                  </div>
                  <div className="hidden lg:block text-left overflow-hidden">
                     <p className="text-[12px] text-white font-bold truncate">Dashboard Admin</p>
                     <p className="text-[10px] text-white/50 truncate uppercase tracking-widest leading-none mt-1">Operator</p>
                  </div>
               </div>
            </div>
         </aside>

         {/* Main Content Area */}
         <main className="md:pl-20 lg:pl-[260px] min-h-screen pt-[calc(4rem+env(safe-area-inset-top))] md:pt-0">
            {/* Grey Top Banner Group */}
            <div className="sticky top-16 md:top-0 z-40 bg-zinc-100 border-b border-zinc-200">
               <header className="h-14 md:h-16 flex items-center justify-between px-4 md:px-8">
                  <div className="flex items-center gap-2 overflow-hidden">
                     <span className="text-zinc-500 text-[10px] md:text-[11px] font-bold tracking-tight">Admin Panel</span>
                     <ChevronRight size={10} className="text-zinc-400" />
                     <span className="text-zinc-900 font-bold text-[10px] md:text-[11px] tracking-tight truncate">
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                     </span>
                  </div>

                  <div className="flex items-center gap-2 md:gap-4">
                      <div className="relative group hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400" />
                        <input className="h-9 w-64 bg-white border border-zinc-200 pl-9 pr-4 text-[12px] outline-none focus:border-red-600 transition-all rounded-none font-medium text-zinc-900" placeholder="Search records..." />
                     </div>
                     <Link href="/cleed/dashboard/health" className="px-3 md:px-5 h-8 md:h-9 bg-zinc-900 text-white text-[9px] md:text-[10px] font-bold flex items-center justify-center hover:bg-black transition-all rounded-none shadow-sm whitespace-nowrap">
                        Health
                     </Link>
                     <div className="h-4 md:h-5 w-[1px] bg-zinc-200" />
                     <Link href="/" className="px-3 md:px-6 h-8 md:h-9 bg-[#F5332C] text-white text-[9px] md:text-[10px] font-bold flex items-center justify-center hover:bg-red-700 transition-all rounded-none shadow-sm whitespace-nowrap">
                        Sign out
                     </Link>
                  </div>
               </header>

               {/* Grey Subnavbar */}
               <div className="flex px-8 border-t border-zinc-200 overflow-x-auto scrollbar-hide">
                  {[
                     { id: "overview", label: "Overview" },
                     { id: "interns", label: "Interns" },
                     { id: "hiring", label: "Applications" },
                     { id: "exams", label: "Exams" },
                     { id: "submissions", label: "Submissions" },
                     { id: "attendance", label: "Attendance" },
                     { id: "history", label: "Logs" }
                  ].map((tab) => (
                     <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`h-12 px-5 text-[11px] font-bold tracking-tight transition-all border-b-2 whitespace-nowrap ${activeTab === tab.id
                           ? "border-[#F5332C] text-[#F5332C]"
                           : "border-transparent text-zinc-500 hover:text-zinc-900 hover:border-zinc-300"
                           }`}
                     >
                        {tab.label}
                     </button>
                  ))}
               </div>
            </div>

            <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-8 pb-[env(safe-area-inset-bottom,20px)]">
               {activeTab === "internships" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                     <div className="grid md:grid-cols-2 gap-8 text-left">
                        <div className="space-y-6">
                           <h2 className="text-2xl font-bold tracking-tighter text-zinc-900">Post Opportunity</h2>
                           <form onSubmit={handlePostInternship} className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-zinc-400">Position Title</label>
                                    <input required value={internshipData.title} onChange={(e) => setInternshipData({ ...internshipData, title: e.target.value })} className="w-full h-10 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none" placeholder="e.g., Full Stack Intern" />
                                 </div>
                                 <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-zinc-400">Company / Dept</label>
                                    <input required value={internshipData.company} onChange={(e) => setInternshipData({ ...internshipData, company: e.target.value })} className="w-full h-10 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none" placeholder="Cleed Digital" />
                                 </div>
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400">Job Role</label>
                                 <input value={internshipData.role} onChange={(e) => setInternshipData({ ...internshipData, role: e.target.value })} className="w-full h-10 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none" placeholder="Technical / Creative / Management" />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400">Description</label>
                                 <textarea required rows={3} value={internshipData.description} onChange={(e) => setInternshipData({ ...internshipData, description: e.target.value })} className="w-full bg-white border border-zinc-200 p-4 text-sm font-bold outline-none focus:border-red-600 resize-none rounded-none" placeholder="What will they learn?" />
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                 <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-zinc-400">Location</label>
                                    <input value={internshipData.location} onChange={(e) => setInternshipData({ ...internshipData, location: e.target.value })} className="w-full h-10 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none" placeholder="Remote" />
                                 </div>
                                 <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-zinc-400">Duration</label>
                                    <input value={internshipData.duration} onChange={(e) => setInternshipData({ ...internshipData, duration: e.target.value })} className="w-full h-10 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none" placeholder="3 Months" />
                                 </div>
                                 <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-zinc-400">Stipend</label>
                                    <input value={internshipData.stipend} onChange={(e) => setInternshipData({ ...internshipData, stipend: e.target.value })} className="w-full h-10 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none" placeholder="Unpaid / Performance" />
                                 </div>
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400">Poster Image URL (Optional)</label>
                                 <input value={internshipData.image || ''} onChange={(e) => setInternshipData({ ...internshipData, image: e.target.value })} className="w-full h-10 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none" placeholder="https://..." />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400">Application Link</label>
                                 <input required value={internshipData.applyLink} onChange={(e) => setInternshipData({ ...internshipData, applyLink: e.target.value })} className="w-full h-10 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none" placeholder="https://..." />
                              </div>
                              <button disabled={sendingInternship} className="w-full h-12 bg-black text-white text-[11px] font-bold tracking-widest hover:bg-zinc-800 transition-all rounded-none shadow-sm disabled:opacity-50">
                                 {sendingInternship ? "Posting..." : "Submit Opportunity"}
                              </button>
                              {internshipSuccess && <p className="text-emerald-600 text-[10px] font-bold text-center">Opportunity posted successfully.</p>}
                           </form>
                        </div>
                        <div className="space-y-6">
                           <h2 className="text-2xl font-bold tracking-tighter text-zinc-900 text-left">Active Opportunities</h2>
                           <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
                              {internships.map((job) => (
                                 <div key={job.id} className={`bg-white border p-6 flex flex-col gap-4 group transition-all rounded-none ${job.isApproved ? 'border-zinc-200 hover:border-zinc-400' : 'border-amber-200 bg-amber-50/10'}`}>
                                    <div className="flex items-start justify-between">
                                       <div className="space-y-1 overflow-hidden">
                                          <div className="flex items-center gap-2">
                                             <h4 className="text-[14px] font-bold leading-tight truncate">{job.title}</h4>
                                             {!job.isApproved && <span className="bg-amber-100 text-amber-700 text-[9px] font-bold px-1.5 py-0.5 border border-amber-200">Pending</span>}
                                          </div>
                                           <p className="text-[11px] font-bold text-red-600">{job.company}</p>
                                           <p className="text-[9px] text-zinc-400 font-bold">Added {new Date(job.createdAt).toLocaleDateString()} ({(() => {
                                              const diff = Date.now() - new Date(job.createdAt).getTime();
                                              const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                                              if (days === 0) return "Today";
                                              return `${days}d ago`;
                                           })()})</p>
                                        </div>
                                       <div className="flex items-center gap-1.5">
                                          {!job.isApproved ? (
                                             <button
                                                onClick={() => handleApproveInternship(job.id, true)}
                                                className="h-8 px-4 bg-zinc-900 text-white text-[10px] font-bold tracking-widest hover:bg-zinc-700 transition-all rounded-none"
                                             >
                                                Approve
                                             </button>
                                          ) : (
                                             <button
                                                onClick={() => handleApproveInternship(job.id, false)}
                                                className="h-8 px-4 border border-zinc-200 text-zinc-400 text-[10px] font-bold tracking-widest hover:bg-zinc-100 transition-all rounded-none"
                                             >
                                                Revoke
                                             </button>
                                          )}
                                          <button
                                             onClick={() => handleDeleteInternship(job.id)}
                                             className="h-8 w-8 text-[#F5332C] hover:bg-red-50 flex items-center justify-center transition-all bg-white border border-zinc-200 rounded-none"
                                          >
                                             <Trash2 size={13} />
                                          </button>
                                       </div>
                                    </div>

                                    <div className="pt-4 border-t border-zinc-100 grid grid-cols-2 gap-4">
                                       <div className="space-y-1">
                                          <p className="text-[9px] font-bold text-zinc-400">Context</p>
                                          <p className="text-[11px] font-bold text-zinc-600">{job.location || 'Remote'} · {job.duration || '3m'} · {job.stipend || 'Unpaid'}</p>
                                       </div>
                                       <div className="space-y-1 text-right">
                                          <p className="text-[9px] font-bold text-zinc-400">Posted by</p>
                                          <p className="text-[11px] font-bold text-zinc-900">{job.submitterName || 'Admin'}</p>
                                          <p className="text-[10px] font-medium text-zinc-400 tabular-nums">{job.submitterMobile}</p>
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </motion.div>
               )}

               {activeTab === "employees" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                     <div className="grid md:grid-cols-2 gap-8 text-left">
                        <div className="space-y-6">
                           <h2 className="text-2xl font-bold tracking-tighter text-zinc-900">Add Employee</h2>
                           <form onSubmit={handlePostEmployee} className="space-y-4">
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400">Full Name</label>
                                 <input required value={employeeData.name} onChange={(e) => setEmployeeData({ ...employeeData, name: e.target.value })} className="w-full h-10 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none" placeholder="e.g., John Doe" />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400">Email Address</label>
                                 <input required type="email" value={employeeData.email} onChange={(e) => setEmployeeData({ ...employeeData, email: e.target.value })} className="w-full h-10 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none" placeholder="john@example.com" />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400">Password</label>
                                 <input required type="password" value={employeeData.password} onChange={(e) => setEmployeeData({ ...employeeData, password: e.target.value })} className="w-full h-10 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none" placeholder="••••••••" />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400">Role</label>
                                 <select value={employeeData.role} onChange={(e) => setEmployeeData({ ...employeeData, role: e.target.value as any })} className="w-full h-10 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none">
                                    <option value="CEO">CEO</option>
                                    <option value="CTO">CTO</option>
                                    <option value="CFO">CFO</option>
                                    <option value="CMO">CMO</option>
                                    <option value="COO">COO</option>
                                    <option value="CSO">CSO</option>
                                    <option value="TECHNICAL_TEAM">Technical Team</option>
                                    <option value="MARKETING_TEAM">Marketing Team</option>
                                    <option value="UI_UX_DEPARTMENT">UI/UX Department</option>
                                    <option value="CLEED_TEAM">Cleed Team</option>
                                    <option value="MEDIA_TEAM">Media Team</option>
                                 </select>
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400">Allocate Batch</label>
                                 <select value={employeeData.batch} onChange={(e) => setEmployeeData({ ...employeeData, batch: e.target.value })} className="w-full h-10 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none">
                                    <option value="Batch 1">Batch 1</option>
                                    <option value="Batch 2">Batch 2</option>
                                    <option value="Batch 3">Batch 3</option>
                                    <option value="All">All Batches</option>
                                 </select>
                              </div>
                              <button disabled={sendingEmployee} className="w-full h-12 bg-black text-white text-[11px] font-bold tracking-widest hover:bg-zinc-800 transition-all rounded-none shadow-sm disabled:opacity-50">
                                 {sendingEmployee ? "Adding..." : "Add Employee"}
                              </button>
                              {employeeSuccess && <p className="text-emerald-600 text-[10px] font-bold text-center">Employee added successfully.</p>}
                           </form>

                           <div className="pt-8 border-t border-zinc-100">
                              <h2 className="text-2xl font-bold tracking-tighter text-zinc-900">Issue Internship Offer</h2>
                              <p className="text-[11px] text-zinc-500 mb-6">Send personalized offer letter links to selected interns.</p>
                              
                              <form onSubmit={handleSendOffer} className="space-y-4">
                                 <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Intern Name</label>
                                    <input required value={offerData.name} onChange={(e) => setOfferData({ ...offerData, name: e.target.value })} className="w-full h-10 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-blue-600 rounded-none" placeholder="Enter intern full name" />
                                 </div>
                                 <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Intern Email</label>
                                    <input required type="email" value={offerData.email} onChange={(e) => setOfferData({ ...offerData, email: e.target.value })} className="w-full h-10 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-blue-600 rounded-none" placeholder="intern@example.com" />
                                 </div>
                                 <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Offer Letter Link (URL)</label>
                                    <input required value={offerData.link} onChange={(e) => setOfferData({ ...offerData, link: e.target.value })} className="w-full h-10 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-blue-600 rounded-none" placeholder="https://docs.google.com/..." />
                                 </div>
                                 <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Greetings & Details</label>
                                    <textarea required value={offerData.message} onChange={(e) => setOfferData({ ...offerData, message: e.target.value })} className="w-full min-h-[100px] bg-white border border-zinc-200 p-4 text-sm font-medium outline-none focus:border-blue-600 rounded-none resize-none" placeholder="e.g., We are pleased to offer you the Full Stack Developer Internship role..." />
                                 </div>
                                 <button disabled={sendingOffer} className="w-full h-12 bg-blue-600 text-white text-[11px] font-bold tracking-widest hover:bg-blue-700 transition-all rounded-none shadow-sm disabled:opacity-50">
                                    {sendingOffer ? "SENDING OFFER..." : "DISPATCH OFFER LETTER"}
                                 </button>
                                 {offerSuccess && <p className="text-emerald-600 text-[10px] font-bold text-center">Offer letter dispatched successfully.</p>}
                              </form>
                           </div>
                        </div>
                        <div className="space-y-6">
                           <h2 className="text-2xl font-bold tracking-tighter text-zinc-900 text-left">Active Employees</h2>
                           <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
                              {employees.map((emp) => (
                                 <div key={emp.id} className="bg-white border border-zinc-200 p-6 flex flex-col gap-4 group transition-all rounded-none hover:border-zinc-400">
                                    <div className="flex items-start justify-between">
                                       <div className="space-y-1 overflow-hidden">
                                          <h4 className="text-[14px] font-bold leading-tight truncate">{emp.name}</h4>
                                          <p className="text-[11px] font-medium text-zinc-500">{emp.email}</p>
                                          <div className="flex items-center gap-2 mt-2">
                                             <span className="bg-zinc-100 text-zinc-600 text-[9px] font-bold px-1.5 py-0.5 border border-zinc-200 uppercase tracking-widest">{emp.role.replace('_', ' ')}</span>
                                             {emp.employeeId && <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none mt-1">{emp.employeeId}</span>}
                                          </div>
                                       </div>
                                       <div className="flex items-center gap-1.5">
                                          <button
                                             onClick={() => {
                                                setEditingEmployeeId(emp.id);
                                                setEditEmployeeData({
                                                   name: emp.name,
                                                   email: emp.email,
                                                   role: emp.role,
                                                   employeeId: emp.employeeId || "",
                                                   phoneNumber: emp.phoneNumber || "",
                                                   department: emp.department || "",
                                                   reportingManager: emp.reportingManager || "",
                                                   location: emp.location || "Remote",
                                                   employmentType: emp.employmentType || "Full-time"
                                                });
                                             }}
                                             className="h-8 w-8 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 flex items-center justify-center transition-all bg-white border border-zinc-200 rounded-none"
                                          >
                                             <Edit size={13} />
                                          </button>
                                          <button
                                             onClick={() => handleDeleteEmployee(emp.id)}
                                             className="h-8 w-8 text-[#F5332C] hover:bg-red-50 flex items-center justify-center transition-all bg-white border border-zinc-200 rounded-none"
                                          >
                                             <Trash2 size={13} />
                                          </button>
                                       </div>
                                    </div>

                                    {editingEmployeeId === emp.id && (
                                       <form
                                          onSubmit={handleUpdateEmployee}
                                          className="mt-4 pt-4 border-t border-zinc-100 grid grid-cols-2 gap-x-4 gap-y-3"
                                       >
                                          <div className="col-span-2 space-y-1">
                                             <label className="text-[10px] font-bold text-zinc-400">Full Name</label>
                                             <input required value={editEmployeeData.name} onChange={(e) => setEditEmployeeData({ ...editEmployeeData, name: e.target.value })} className="w-full h-8 bg-zinc-50 border border-zinc-200 px-3 text-[11px] font-bold outline-none focus:border-red-600 rounded-none" />
                                          </div>
                                          <div className="space-y-1">
                                             <label className="text-[10px] font-bold text-zinc-400">Email</label>
                                             <input required type="email" value={editEmployeeData.email} onChange={(e) => setEditEmployeeData({ ...editEmployeeData, email: e.target.value })} className="w-full h-8 bg-zinc-50 border border-zinc-200 px-3 text-[11px] font-bold outline-none focus:border-red-600 rounded-none" />
                                          </div>
                                          <div className="space-y-1">
                                             <label className="text-[10px] font-bold text-zinc-400">Employee ID</label>
                                             <input value={editEmployeeData.employeeId} onChange={(e) => setEditEmployeeData({ ...editEmployeeData, employeeId: e.target.value })} className="w-full h-8 bg-zinc-50 border border-zinc-200 px-3 text-[11px] font-bold outline-none focus:border-red-600 rounded-none" />
                                          </div>
                                          <div className="space-y-1">
                                             <label className="text-[10px] font-bold text-zinc-400">Phone</label>
                                             <input value={editEmployeeData.phoneNumber} onChange={(e) => setEditEmployeeData({ ...editEmployeeData, phoneNumber: e.target.value })} className="w-full h-8 bg-zinc-50 border border-zinc-200 px-3 text-[11px] font-bold outline-none focus:border-red-600 rounded-none" />
                                          </div>
                                          <div className="space-y-1">
                                             <label className="text-[10px] font-bold text-zinc-400">Department</label>
                                             <input value={editEmployeeData.department} onChange={(e) => setEditEmployeeData({ ...editEmployeeData, department: e.target.value })} className="w-full h-8 bg-zinc-50 border border-zinc-200 px-3 text-[11px] font-bold outline-none focus:border-red-600 rounded-none" />
                                          </div>
                                          <div className="space-y-1">
                                             <label className="text-[10px] font-bold text-zinc-400">Location</label>
                                             <select value={editEmployeeData.location} onChange={(e) => setEditEmployeeData({ ...editEmployeeData, location: e.target.value })} className="w-full h-8 bg-zinc-50 border border-zinc-200 px-3 text-[11px] font-bold outline-none focus:border-red-600 rounded-none">
                                                <option value="Remote">Remote</option>
                                                <option value="Office">Office</option>
                                             </select>
                                          </div>
                                          <div className="space-y-1">
                                             <label className="text-[10px] font-bold text-zinc-400">Employment</label>
                                             <select value={editEmployeeData.employmentType} onChange={(e) => setEditEmployeeData({ ...editEmployeeData, employmentType: e.target.value })} className="w-full h-8 bg-zinc-50 border border-zinc-200 px-3 text-[11px] font-bold outline-none focus:border-red-600 rounded-none">
                                                <option value="Full-time">Full-time</option>
                                                <option value="Intern">Intern</option>
                                             </select>
                                          </div>
                                          <div className="col-span-2 space-y-1">
                                             <label className="text-[10px] font-bold text-zinc-400">Allocated Batch</label>
                                             <select value={editEmployeeData.batch} onChange={(e) => setEditEmployeeData({...editEmployeeData, batch: e.target.value})} className="w-full h-8 bg-zinc-50 border border-zinc-200 px-3 text-[11px] font-bold outline-none focus:border-red-600 rounded-none">
                                                <option value="Batch 1">Batch 1</option>
                                                <option value="Batch 2">Batch 2</option>
                                                <option value="Batch 3">Batch 3</option>
                                                <option value="All">All Batches</option>
                                             </select>
                                          </div>
                                          <div className="col-span-2 flex gap-2 pt-2">
                                             <button type="submit" className="flex-1 h-9 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800">Save</button>
                                             <button type="button" onClick={() => setEditingEmployeeId(null)} className="h-9 px-4 border border-zinc-200 text-zinc-400 text-[10px] font-bold uppercase hover:bg-zinc-50 transition-all">Cancel</button>
                                          </div>
                                       </form>
                                    )}
                                 </div>
                              ))}
                              {employees.length === 0 && (
                                   <p className="text-zinc-400 text-sm italic py-10 text-center border border-dashed border-zinc-200">No employees registered.</p>
                              )}
                           </div>
                        </div>
                     </div>
                  </motion.div>
               )}

               {activeTab === "exams" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 pb-20">
                     <div className="grid lg:grid-cols-2 gap-12">
                        <div className="space-y-6 pt-16">
                           <div className="space-y-4 text-center">
                              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 leading-none">Start the test</h2>
                              <p className="text-zinc-500 font-bold">Use the button below to start or stop the exam for everyone.</p>
                           </div>

                           <div className={`p-8 border border-zinc-200 transition-all ${examIsActive ? 'bg-blue-50' : 'bg-white'}`}>
                              <div className="flex flex-col items-center gap-6">
                                 <div className="space-y-1">
                                    <p className={`text-[11px] font-bold uppercase tracking-widest ${examIsActive ? 'text-blue-600' : 'text-zinc-400'}`}>
                                       Status: {examIsActive ? 'Now Running' : 'Stopped'}
                                    </p>
                                 </div>

                                 <button 
                                    disabled={isUpdatingExam}
                                    onClick={toggleExamStatus}
                                    className={`h-14 px-12 text-xs font-bold uppercase tracking-widest transition-all ${examIsActive ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}
                                 >
                                    {isUpdatingExam ? '...' : examIsActive ? 'Stop Test' : 'Start Test'}
                                 </button>
                                 
                                 {examIsActive && (
                                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 text-center rounded w-full max-w-sm">
                                       <p className="text-[10px] text-yellow-700 font-bold uppercase tracking-widest mb-2">Global Exit Key</p>
                                       <p className="text-3xl font-black text-yellow-800 tracking-[0.2em]">{globalExitKey}</p>
                                       <p className="text-[9px] text-yellow-600 font-bold uppercase mt-2 italic">Provide to candidates for exam exit</p>
                                       <button 
                                          onClick={async () => {
                                             const newKey = Math.floor(100000 + Math.random() * 900000).toString();
                                             await fetch("/api/cleed/exams/status", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ exitKey: newKey })
                                             });
                                             setGlobalExitKey(newKey);
                                          }}
                                          className="mt-3 text-[10px] font-bold text-yellow-800 hover:text-yellow-900 border-b border-yellow-800"
                                       >
                                          Regenerate Key
                                       </button>
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>

                        <div className="space-y-6 pt-16">
                           <div className="space-y-4 text-center">
                              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 leading-none">Advanced Builder</h2>
                              <p className="text-zinc-500 font-bold">Create structured exams with automated guidelines.</p>
                           </div>

                           <div className="p-8 border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center gap-6">
                              <div className="w-16 h-16 bg-white border border-zinc-200 flex items-center justify-center text-zinc-400">
                                 <Plus size={24} />
                              </div>
                              <div className="text-center space-y-1">
                                 <p className="text-sm font-bold text-zinc-900 uppercase tracking-tight">New Assessment Node</p>
                                 <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Supports MCQ, Text, Images & Patterns</p>
                              </div>
                              <Link 
                                 href="/admin/exam/login"
                                 className="h-12 px-8 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3"
                              >
                                 Open Builder <ExternalLink size={14} />
                              </Link>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center justify-between border-b border-zinc-200 pb-5">
                        <h2 className="text-2xl font-bold tracking-tighter text-zinc-900">Technical Registry</h2>
                        <button 
                           onClick={() => setIsSchedulingExam(!isSchedulingExam)}
                           className="h-10 px-6 bg-[#003366] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all rounded-none"
                        >
                           {isSchedulingExam ? "Cancel Scheduling" : "Schedule Assessment"}
                        </button>
                     </div>

                     <AnimatePresence>
                        {isSchedulingExam && (
                           <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                           >
                              <div className="p-8 bg-zinc-50 border border-zinc-200 mb-8">
                                 <form onSubmit={handlePostExam} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                       <div className="space-y-1">
                                          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Assessment Title</label>
                                          <input 
                                             required 
                                             value={examFormData.title} 
                                             onChange={(e) => setExamFormData({ ...examFormData, title: e.target.value })} 
                                             className="w-full h-11 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-[#003366] rounded-none" 
                                             placeholder="e.g., React Core Evaluation" 
                                          />
                                       </div>
                                       <div className="space-y-1">
                                          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Target Batch</label>
                                          <select 
                                             value={examFormData.batch} 
                                             onChange={(e) => setExamFormData({ ...examFormData, batch: e.target.value })} 
                                             className="w-full h-11 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-[#003366] rounded-none"
                                          >
                                             <option value="All">All Batches</option>
                                             <option value="Batch 1">Batch 1</option>
                                             <option value="Batch 2">Batch 2</option>
                                             <option value="Batch 3">Batch 3</option>
                                          </select>
                                       </div>
                                    </div>

                                    <div className="space-y-1">
                                       <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Detailed Description / Instructions</label>
                                       <textarea 
                                          rows={3}
                                          value={examFormData.description} 
                                          onChange={(e) => setExamFormData({ ...examFormData, description: e.target.value })} 
                                          className="w-full bg-white border border-zinc-200 p-4 text-sm font-bold outline-none focus:border-[#003366] rounded-none resize-none" 
                                          placeholder="Provide context or rules for the assessment..." 
                                       />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                       <div className="space-y-1">
                                          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Exam Date</label>
                                          <input 
                                             required 
                                             type="date"
                                             value={examFormData.date} 
                                             onChange={(e) => setExamFormData({ ...examFormData, date: e.target.value })} 
                                             className="w-full h-11 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-[#003366] rounded-none" 
                                          />
                                       </div>
                                       <div className="space-y-1">
                                          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Duration (Minutes)</label>
                                          <input 
                                             required 
                                             type="number"
                                             value={examFormData.duration} 
                                             onChange={(e) => setExamFormData({ ...examFormData, duration: e.target.value })} 
                                             className="w-full h-11 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-[#003366] rounded-none" 
                                             placeholder="60"
                                          />
                                       </div>
                                    </div>

                                    <div className="pt-4">
                                       <button 
                                          disabled={sendingExamForm}
                                          className="w-full h-12 bg-[#003366] text-white text-[11px] font-bold uppercase tracking-widest hover:bg-black transition-all rounded-none shadow-sm disabled:opacity-50"
                                       >
                                          {sendingExamForm ? "Scheduling..." : "Confirm & Schedule Exam"}
                                       </button>
                                    </div>
                                 </form>
                              </div>
                           </motion.div>
                        )}
                     </AnimatePresence>

                     <div className="grid lg:grid-cols-1 gap-8 pt-12">
                        <div className="bg-white border border-zinc-200">
                           <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
                              <div>
                                 <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-800">Advanced Exams</h3>
                                 <p className="text-[10px] text-zinc-400 font-bold uppercase">Complex assessments with multi-pattern questions</p>
                              </div>
                           </div>
                           <div className="overflow-x-auto">
                              <table className="w-full text-left">
                                 <thead>
                                    <tr className="bg-zinc-50 border-b border-zinc-100">
                                       <th className="px-6 py-4 text-[10px] font-bold uppercase text-zinc-400">Title</th>
                                       <th className="px-6 py-4 text-[10px] font-bold uppercase text-zinc-400">Date/Time</th>
                                       <th className="px-6 py-4 text-[10px] font-bold uppercase text-zinc-400">Questions</th>
                                       <th className="px-6 py-4 text-[10px] font-bold uppercase text-zinc-400 text-right">Actions</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-zinc-50">
                                    {richExamsList.map((exam) => (
                                       <tr key={exam.id} className="hover:bg-zinc-50 transition-colors">
                                          <td className="px-6 py-4">
                                             <div className="flex flex-col">
                                                <span className="text-xs font-bold">{exam.title}</span>
                                                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-tight">{exam.status}</span>
                                             </div>
                                          </td>
                                          <td className="px-6 py-4">
                                             <div className="flex flex-col">
                                                <span className="text-xs font-medium">{exam.date}</span>
                                                <span className="text-[9px] text-zinc-400 font-bold uppercase">{exam.time}</span>
                                             </div>
                                          </td>
                                          <td className="px-6 py-4 text-xs font-bold text-zinc-600">{exam.questions?.length || 0} Nodes</td>
                                          <td className="px-6 py-4 text-right">
                                             <div className="flex items-center justify-end gap-2">
                                                <button 
                                                   onClick={() => handleCopyLink(exam.id)} 
                                                   className={`h-8 px-3 text-[10px] font-bold uppercase tracking-widest border transition-all flex items-center gap-2 ${copySuccess === exam.id ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
                                                >
                                                   <Globe size={13} /> {copySuccess === exam.id ? 'Copied' : 'Link'}
                                                </button>
                                                <button onClick={() => handleDeleteRichExam(exam.id)} className="h-8 w-8 text-[#F5332C] hover:bg-red-50 inline-flex items-center justify-center border border-zinc-200 transition-all">
                                                   <Trash2 size={13} />
                                                </button>
                                             </div>
                                          </td>
                                       </tr>
                                    ))}
                                    {richExamsList.length === 0 && (
                                       <tr>
                                          <td colSpan={4} className="px-6 py-12 text-center text-zinc-400 text-[10px] font-bold uppercase tracking-[0.1em]">No advanced exams published yet</td>
                                       </tr>
                                    )}
                                 </tbody>
                              </table>
                           </div>
                        </div>
                     </div>

                     <div className="bg-white border border-zinc-200">
                        <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
                           <div>
                              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-800">Upcoming Exams</h3>
                              <p className="text-[10px] text-zinc-400 font-bold uppercase">Manage scheduled assessments for interns</p>
                           </div>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="w-full text-left">
                              <thead>
                                 <tr className="bg-zinc-50 border-b border-zinc-100">
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase text-zinc-400">Exam Title</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase text-zinc-400">Date</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase text-zinc-400">Duration</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase text-zinc-400 text-right">Actions</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-50">
                                 {examsList.map((exam) => (
                                    <tr key={exam.id} className="hover:bg-zinc-50 transition-colors">
                                       <td className="px-6 py-4 text-xs font-bold">{exam.title}</td>
                                       <td className="px-6 py-4 text-xs font-medium">{exam.date}</td>
                                       <td className="px-6 py-4 text-xs font-medium">{exam.duration} mins</td>
                                       <td className="px-6 py-4 text-right">
                                          <button onClick={() => handleDeleteExam(exam.id)} className="h-8 w-8 text-[#F5332C] hover:bg-red-50 inline-flex items-center justify-center border border-zinc-200 transition-all">
                                             <Trash2 size={13} />
                                          </button>
                                       </td>
                                    </tr>
                                 ))}
                                 {examsList.length === 0 && (
                                    <tr>
                                       <td colSpan={4} className="px-6 py-12 text-center text-zinc-400 text-xs italic border border-dashed border-zinc-100 m-4">No exams scheduled in technical registry.</td>
                                    </tr>
                                 )}
                              </tbody>
                           </table>
                        </div>
                     </div>

                     <div className="bg-white border border-zinc-200">
                        <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
                           <div>
                              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-800">Live Results</h3>
                              <p className="text-[10px] text-zinc-400 font-bold uppercase">See student scores and rules breaking here</p>
                           </div>
                           <div className="flex bg-zinc-100 p-1 rounded-sm gap-1">
                              <button onClick={() => setExamViewMode("UI_UX")} className={`px-4 py-1.5 text-[10px] font-bold uppercase transition-all ${examViewMode === "UI_UX" ? 'bg-white shadow text-blue-600' : 'text-zinc-500'}`}>UI/UX</button>
                              <button onClick={() => setExamViewMode("FULLSTACK")} className={`px-4 py-1.5 text-[10px] font-bold uppercase transition-all ${examViewMode === "FULLSTACK" ? 'bg-white shadow text-zinc-900' : 'text-zinc-500'}`}>Full Stack</button>
                           </div>
                           <div className="flex items-center gap-2">
                              <button onClick={fetchData} className="px-3 py-1.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest">Refresh</button>
                              <button onClick={downloadExamPdf} className="px-3 py-1.5 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest">PDF</button>
                           </div>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="w-full text-left">
                              <thead>
                                 <tr className="bg-zinc-50 border-b border-zinc-100">
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase text-zinc-400">Intern</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase text-zinc-400">Score</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase text-zinc-400">Errors</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase text-zinc-400 text-right">Status</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-50">
                                 {examSessions.filter(s => s.examType === examViewMode).map((session) => (
                                    <tr key={session.id} className="hover:bg-zinc-50 transition-colors">
                                       <td className="px-6 py-4">
                                          <div className="font-bold text-xs">{session.user?.name}</div>
                                          <div className="text-[10px] text-zinc-400">{session.user?.email}</div>
                                       </td>
                                       <td className="px-6 py-4 text-xs font-bold">{session.score ?? '--'}</td>
                                       <td className="px-6 py-4 text-xs font-bold text-red-600">{session.violations}</td>
                                       <td className="px-6 py-4 text-right">
                                          <div className="flex items-center justify-end gap-3">
                                             <span className="text-[9px] font-bold uppercase px-2 py-1 bg-zinc-100">{session.status}</span>
                                             <Link href="/admin/exam/proctor" className="h-8 px-3 bg-violet-600 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-violet-700 transition-all flex items-center gap-2">
                                                <Video size={12} /> Stream
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

               {activeTab === "resources" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20">
                     <div className="grid md:grid-cols-2 gap-8 text-left">
                        <div className="space-y-6">
                           <h2 className="text-2xl font-bold tracking-tighter text-zinc-900">Add Resource</h2>
                           <form onSubmit={handlePostResource} className="space-y-4">
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400">Title</label>
                                 <input required value={resourceFormData.title} onChange={(e) => setResourceFormData({ ...resourceFormData, title: e.target.value })} className="w-full h-11 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none shadow-sm" placeholder="e.g., React Core Principles" />
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400">Description</label>
                                 <textarea required rows={3} value={resourceFormData.description} onChange={(e) => setResourceFormData({ ...resourceFormData, description: e.target.value })} className="w-full bg-white border border-zinc-200 p-4 text-sm font-bold outline-none focus:border-red-600 resize-none rounded-none shadow-sm" placeholder="Short summary..." />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-zinc-400">Type</label>
                                    <select value={resourceFormData.type} onChange={(e) => setResourceFormData({ ...resourceFormData, type: e.target.value })} className="w-full h-11 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none shadow-sm">
                                       <option value="PDF">PDF Document</option>
                                       <option value="VIDEO">Video Link</option>
                                       <option value="WEB">External Website</option>
                                       <option value="ZIP">ZIP Archive</option>
                                       <option value="DOC">Word / Doc</option>
                                    </select>
                                 </div>
                                 <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-zinc-400">Category</label>
                                    <input value={resourceFormData.category} onChange={(e) => setResourceFormData({ ...resourceFormData, category: e.target.value })} className="w-full h-11 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none shadow-sm" placeholder="e.g., Frontend" />
                                 </div>
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400">Resource URL</label>
                                 <input required value={resourceFormData.url} onChange={(e) => setResourceFormData({ ...resourceFormData, url: e.target.value })} className="w-full h-11 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none shadow-sm" placeholder="https://..." />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                 <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-zinc-400">Date</label>
                                    <input type="date" required value={resourceFormData.date} onChange={(e) => setResourceFormData({ ...resourceFormData, date: e.target.value })} className="w-full h-11 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none shadow-sm" />
                                 </div>
                                 <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-zinc-400">Batch Target</label>
                                    <select value={resourceFormData.batch} onChange={(e) => setResourceFormData({ ...resourceFormData, batch: e.target.value })} className="w-full h-11 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none shadow-sm">
                                       <option value="All">All Batches</option>
                                       <option value="Batch 1">Batch 1</option>
                                       <option value="Batch 2">Batch 2</option>
                                       <option value="Batch 3">Batch 3</option>
                                    </select>
                                 </div>
                              </div>
                              <button 
                                 type="submit"
                                 disabled={sendingResourceForm} 
                                 className="w-full h-14 bg-black text-white text-[11px] font-bold tracking-widest hover:bg-zinc-800 transition-all rounded-none shadow-sm disabled:opacity-50"
                              >
                                 {sendingResourceForm ? "Publish..." : "Publish Resource"}
                              </button>
                           </form>
                        </div>
                        <div className="space-y-6">
                           <h2 className="text-2xl font-bold tracking-tighter text-zinc-900 text-left">Published Resources</h2>
                           <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
                              {resourcesList.map((res) => (
                                 <div key={res.id} className="bg-white border border-zinc-200 p-6 flex flex-col gap-4 group transition-all rounded-none hover:border-zinc-400 text-left">
                                    <div className="flex items-start justify-between">
                                       <div className="space-y-1 overflow-hidden">
                                          <div className="flex items-center gap-2">
                                             <h4 className="text-[14px] font-bold leading-tight truncate">{res.title}</h4>
                                             <span className="bg-zinc-100 text-zinc-500 text-[9px] font-bold px-1.5 py-0.5 border border-zinc-200 uppercase">{res.type}</span>
                                          </div>
                                          <p className="text-[11px] font-medium text-zinc-500 line-clamp-2">{res.description}</p>
                                          <div className="flex items-center gap-3 mt-2">
                                             <span className="text-[10px] font-bold text-red-600">{res.category}</span>
                                             <span className="text-[10px] font-bold text-zinc-400">{res.date}</span>
                                          </div>
                                       </div>
                                       <div className="flex items-center gap-1.5">
                                          <a href={res.url} target="_blank" className="h-8 w-8 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 flex items-center justify-center transition-all bg-white border border-zinc-200 rounded-none shadow-sm">
                                             <ExternalLink size={13} />
                                          </a>
                                          <button onClick={() => handleDeleteResource(res.id)} className="h-8 w-8 text-[#F5332C] hover:bg-red-50 flex items-center justify-center transition-all bg-white border border-zinc-200 rounded-none shadow-sm">
                                             <Trash2 size={13} />
                                          </button>
                                       </div>
                                    </div>
                                 </div>
                              ))}
                              {resourcesList.length === 0 && (
                                 <p className="text-zinc-400 text-sm italic py-10 text-center border border-dashed border-zinc-200">No resources published.</p>
                              )}
                           </div>
                        </div>
                     </div>
                  </motion.div>
               )}

               {activeTab === "overview" && (
                  <div className="space-y-10 animate-in fade-in duration-500 text-left">
                     <div className="border-b border-zinc-200 pb-5 flex items-center justify-between">
                        <h1 className="text-3xl font-light tracking-tighter text-zinc-900 leading-tight">
                           {(() => {
                              const hr = new Date().getHours();
                              if (hr < 12) return "Good morning";
                              if (hr < 18) return "Good afternoon";
                              return "Good evening";
                           })()}, <span className="font-bold">Admin.</span>
                        </h1>

                        {raisedHandsCount > 0 && (
                           <div
                              onClick={() => setActiveTab("interns")}
                              className="px-3 py-1.5 bg-white border border-red-100 flex items-center gap-3 cursor-pointer hover:bg-red-50 transition-colors rounded-none"
                           >
                              <div className="relative">
                                 <div className="h-2 w-2 rounded-none" style={{ backgroundColor: '#F5332C' }} />
                                 <div className="absolute inset-0 h-2 w-2 rounded-none animate-ping" style={{ backgroundColor: '#F5332C', animationDuration: '0.7s' }} />
                              </div>
                              <span className="text-[12px] font-bold text-zinc-900 leading-none">
                                 {raisedHandsCount} Hand response required
                              </span>
                           </div>
                        )}
                     </div>

                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                           { label: "Total interns", value: interns.length, color: "text-zinc-900", bg: "bg-white" },
                           { label: "Active now", value: onlineInternsCount, color: "text-red-600", bg: "bg-white" },
                           { label: "Review pending", value: interns.filter(i => !i.isApproved).length, color: "text-red-600", bg: "bg-white" },
                           { label: "Submissions", value: submissions.length, color: "text-zinc-900", bg: "bg-white" }
                        ].map((stat, idx) => (
                           <div key={idx} className={`p-6 bg-white border border-zinc-200 hover:border-zinc-400 transition-all rounded-none text-left`}>
                              <p className="text-[9px] font-bold text-zinc-400 mb-2 uppercase tracking-tighter">{stat.label}</p>
                              <h3 className={`text-3xl font-light tracking-tighter ${stat.color}`}>{stat.value}</h3>
                           </div>
                        ))}
                     </div>

                     <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                           <h2 className="text-[11px] font-bold text-zinc-400">Recent Onboarding</h2>
                           <button onClick={() => setActiveTab("interns")} className="text-[10px] font-bold text-red-600 hover:text-black transition-colors">View All Interns</button>
                        </div>
                        <div className="space-y-2">
                           {interns.slice(0, 5).map((intern) => (
                              <div key={intern.id} className="p-5 bg-white border border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-zinc-400 transition-all rounded-none">
                                 <div className="flex flex-col min-w-[200px] flex-1">
                                    <span className="text-[9px] font-bold text-zinc-400 mb-1">Intern</span>
                                    <h4 className="text-[14px] font-bold text-zinc-900 leading-none">{intern.name}</h4>
                                    <p className="text-[10px] text-zinc-500 font-medium mt-1">{intern.email}</p>
                                 </div>
                                 <div className="flex items-center gap-10">
                                    <div className="hidden md:flex flex-col text-right">
                                       <span className="text-[9px] font-bold text-zinc-400 mb-1">Status</span>
                                       <div className="flex items-center justify-end gap-1.5">
                                          <div className={`h-1.5 w-1.5 ${intern.isApproved ? 'bg-emerald-500' : 'bg-red-600'}`} />
                                          <span className={`text-[10px] font-bold ${intern.isApproved ? 'text-emerald-700' : 'text-red-600'}`}>
                                             {intern.isApproved ? 'Approved' : 'Review'}
                                          </span>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                       {!intern.isApproved && (
                                          <button onClick={() => handleApprove(intern.id)} className="h-9 px-6 bg-zinc-900 text-white text-[10px] font-bold tracking-widest hover:bg-black transition-all rounded-none">
                                             Approve
                                          </button>
                                       )}
                                       <button onClick={() => handleDeleteIntern(intern.id)} className="h-9 w-9 flex items-center justify-center border border-zinc-200 text-[#F5332C] hover:bg-red-50 transition-colors bg-zinc-50/20 rounded-none">
                                          <Trash2 size={14} />
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === "interns" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-left">
                     <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
                           <div className="space-y-1">
                              <h2 className="text-2xl font-bold tracking-tighter text-zinc-900">Interns</h2>
                              <p className="text-[12px] text-zinc-500 font-medium tracking-tight">View and manage all intern records, approvals, and performance metrics.</p>
                           </div>
                           <div className="flex flex-wrap items-center gap-2 font-bold">
                               <button
                                   onClick={downloadInternsPdf}
                                   className="bg-zinc-900 text-white px-4 h-9 text-[10px] tracking-widest transition-all active:scale-95 flex items-center gap-2 rounded-none hover:bg-black"
                               >
                                   <Download size={12} /> Export PDF
                               </button>
                               {raisedHandsCount > 0 && (
                                 <button
                                    onClick={handleLowerAllSignals}
                                    className="bg-black text-white px-4 h-9 text-[10px] tracking-widest transition-all active:scale-95 flex items-center gap-2 rounded-none"
                                 >
                                    <Hand size={12} /> Clear Flags
                                 </button>
                              )}
                              <div className="px-3 h-9 bg-zinc-50 border border-zinc-200 text-zinc-900 text-[10px] flex items-center">
                                 {interns.filter(i => i.isApproved).length} Approved
                              </div>
                              <div className="px-3 h-9 bg-red-50 border border-red-100 text-red-700 text-[10px] flex items-center">
                                 {interns.filter(i => !i.isApproved).length} Review
                              </div>
                           </div>
                        </div>

                        <div className="space-y-3">
                           {interns.length === 0 ? (
                              <div className="py-24 text-center bg-zinc-50 border border-zinc-200">
                                 <p className="text-[13px] text-zinc-400 font-bold">No intern records found.</p>
                              </div>
                           ) : (
                              [...interns].sort((a, b) => (b.handRaised ? 1 : 0) - (a.handRaised ? 1 : 0)).map((intern) => (
                                 <div key={intern.id} onClick={() => router.push(`/cleed/dashboard/interns/${intern.id}`)} className={`p-5 bg-white border flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-zinc-400 transition-all rounded-none cursor-pointer group/row ${intern.handRaised ? "border-l-4 border-red-600 bg-red-50/10" : "border-zinc-200"}`}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 flex-1 gap-6 md:gap-12">
                                       <div className="flex items-center gap-4">
                                          <div className="relative h-12 w-12 flex-shrink-0">
                                             {intern.profileImage ? (
                                                <img src={intern.profileImage} alt={intern.name} className="h-full w-full object-cover rounded-none transition-all" />
                                             ) : (
                                                <div className="h-full w-full bg-zinc-900 text-white flex items-center justify-center text-sm font-bold">
                                                   {intern.name?.charAt(0) || "U"}
                                                </div>
                                             )}
                                             {intern.handRaised && <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-600 animate-pulse border-2 border-white" />}
                                          </div>
                                          <div className="flex flex-col overflow-hidden">
                                             <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Intern Node</span>
                                             </div>
                                             <h4 className="text-[14px] font-bold text-zinc-900 leading-tight truncate uppercase tracking-tight">{intern.name}</h4>
                                             <p className="text-[10px] text-zinc-500 font-medium tabular-nums">{intern.email}</p>
                                          </div>
                                       </div>

                                       <div className="flex items-center gap-3 overflow-hidden">
                                          {getCollegeLogo(intern.college || "") && (
                                             <img 
                                                src={getCollegeLogo(intern.college || "")!} 
                                                alt="College Logo" 
                                                className="h-8 w-8 object-contain shrink-0" 
                                             />
                                          )}
                                          <div className="flex flex-col overflow-hidden">
                                             <span className="text-[9px] font-bold text-zinc-400 mb-1">Institution</span>
                                             <h4 className="text-[13px] font-bold text-zinc-900 leading-none truncate">{intern.college || 'Undeclared'}</h4>
                                             <p className="text-[10px] text-red-600 font-bold mt-1">{intern.branch || 'General branch'}</p>
                                          </div>
                                       </div>

                                       <div className="flex items-center gap-8 lg:justify-start">
                                          <div className="flex flex-col">
                                             <span className="text-[9px] font-bold text-zinc-400 mb-1">Standing</span>
                                             <div className={`px-1.5 py-0.5 text-[9px] font-bold border w-fit ${intern.isApproved ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                                                {intern.isApproved ? 'Approved' : 'Review'}
                                             </div>
                                          </div>
                                          {intern.isApproved && (
                                             <div className="flex flex-col border-l border-zinc-100 pl-8">
                                                <span className="text-[9px] font-bold text-zinc-400 mb-1">Performance</span>
                                                <p className="text-[11px] font-bold text-zinc-900 tabular-nums">
                                                   {intern.attendancePercentage ?? 0}%·{intern.presentCount ?? 0}d
                                                </p>
                                             </div>
                                          )}
                                       </div>
                                    </div>

                                    <div className="flex items-center gap-3 md:border-l md:border-zinc-100 md:pl-6 font-bold">
                                       {!intern.isApproved ? (
                                          <button onClick={() => handleApprove(intern.id)} className="h-9 px-6 bg-zinc-900 text-white text-[10px] tracking-widest hover:bg-black transition-all rounded-none">
                                             Approve
                                          </button>
                                       ) : (
                                          <div className="flex items-center gap-2">
                                             {intern.githubLink && (
                                                <a href={intern.githubLink} target="_blank" className="h-9 w-9 flex items-center justify-center bg-zinc-50 border border-zinc-200 text-zinc-400 hover:text-zinc-950 transition-colors rounded-none">
                                                   <Github size={14} />
                                                </a>
                                             )}
                                             <button className="h-9 w-9 flex items-center justify-center bg-zinc-50 border border-zinc-200 text-zinc-400 hover:text-zinc-950 transition-colors rounded-none">
                                                <Mail size={14} />
                                             </button>
                                          </div>
                                       )}
                                       <button onClick={() => handleDeleteIntern(intern.id)} className="h-9 w-9 flex items-center justify-center border border-zinc-200 text-[#F5332C] hover:bg-red-50 transition-colors rounded-none bg-zinc-50/50">
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

               {activeTab === "certification" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                     <div className="flex justify-center">
                        <div className="flex bg-zinc-50 border border-zinc-200/80 p-1.5 rounded-none font-bold">
                           <button
                              type="button"
                              onClick={() => setCertSubTab("offer")}
                              className={`px-6 py-2.5 text-[10px] tracking-widest uppercase transition-all rounded-none ${certSubTab === "offer" ? "bg-zinc-900 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-900"}`}
                           >
                              Offer Letters
                           </button>
                           <button
                              type="button"
                              onClick={() => setCertSubTab("individual")}
                              className={`px-6 py-2.5 text-[10px] tracking-widest uppercase transition-all rounded-none ${certSubTab === "individual" ? "bg-zinc-900 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-900"}`}
                           >
                              Individual Certificates
                           </button>
                           <button
                              type="button"
                              onClick={() => setCertSubTab("group")}
                              className={`px-6 py-2.5 text-[10px] tracking-widest uppercase transition-all rounded-none ${certSubTab === "group" ? "bg-zinc-900 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-900"}`}
                           >
                              Group Certificates
                           </button>
                        </div>
                     </div>

                     {certSubTab === "offer" && (
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
                     )}

                     {certSubTab === "individual" && (
                        <div className="max-w-2xl mx-auto bg-white border border-zinc-100 p-8">
                           <div className="space-y-2 mb-8">
                              <h2 className="text-xl font-bold tracking-tight text-zinc-900 line-clamp-1">Individual Certificate Issuance</h2>
                              <p className="text-[12px] text-zinc-500 font-medium">Issue an official project completion certificate to a specific intern. This updates their certification status and sends a real-time email notification.</p>
                           </div>
                           <form onSubmit={handleSendLetter} className="space-y-6">
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400">Target intern</label>
                                 <select
                                    required
                                    className="w-full h-11 bg-zinc-50 border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600"
                                    onChange={(e) => {
                                       const intern = interns.find(i => i.id === e.target.value);
                                       if (intern) setSelectedIntern(intern);
                                    }}
                                 >
                                    <option value="">Select a student...</option>
                                    {interns.filter(i => i.isApproved).map(i => (
                                       <option key={i.id} value={i.id}>
                                          {i.name} {i.letterUrl ? "✓ Cert Issued" : ""}
                                       </option>
                                    ))}
                                 </select>
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400">Document link (PDF/Image)</label>
                                 <input required value={letterUrl} onChange={(e) => setLetterUrl(e.target.value)} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600" placeholder="https://res.cloudinary.com/..." />
                              </div>
                              <button disabled={sendingLetter || !selectedIntern} className="w-full h-14 bg-zinc-900 text-white text-[13px] font-bold hover:bg-blue-600 transition-all disabled:opacity-50">
                                 {sendingLetter ? "Dispatching certificate..." : "Issue project certificate"}
                              </button>
                           </form>
                        </div>
                     )}

                     {certSubTab === "group" && (
                        <div className="max-w-2xl mx-auto bg-white border border-zinc-100 p-8">
                           <div className="space-y-2 mb-8">
                              <h2 className="text-xl font-bold tracking-tight text-zinc-900 line-clamp-1">Group Certificate Issuance</h2>
                              <p className="text-[12px] text-zinc-500 font-medium">Issue project certificates to a group of interns at once. Selected interns will receive their certificates and personal email notifications immediately.</p>
                           </div>
                           <form onSubmit={handleSendGroupLetter} className="space-y-6">
                              <div className="space-y-2">
                                 <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-bold text-zinc-400">Select target interns</label>
                                    <button
                                       type="button"
                                       onClick={() => {
                                          const approvedInternIds = interns.filter(i => i.isApproved).map(i => i.id);
                                          if (selectedGroupInternIds.length === approvedInternIds.length) {
                                             setSelectedGroupInternIds([]);
                                          } else {
                                             setSelectedGroupInternIds(approvedInternIds);
                                          }
                                       }}
                                       className="text-[10px] font-bold text-[#0055FF] hover:text-black transition-colors"
                                    >
                                       {selectedGroupInternIds.length === interns.filter(i => i.isApproved).length ? "Deselect All" : "Select All"}
                                    </button>
                                 </div>
                                 <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto p-4 bg-zinc-50 border border-zinc-100 rounded-none">
                                    {interns.filter(i => i.isApproved).map((intern) => (
                                       <label key={intern.id} className={`flex items-center gap-3 p-2.5 border transition-all cursor-pointer rounded-none ${selectedGroupInternIds.includes(intern.id) ? 'bg-zinc-900 border-zinc-900 text-white shadow-md' : 'bg-white border-zinc-100 hover:border-zinc-200 text-zinc-800'}`}>
                                          <input
                                             type="checkbox"
                                             checked={selectedGroupInternIds.includes(intern.id)}
                                             onChange={(e) => {
                                                if (e.target.checked) {
                                                   setSelectedGroupInternIds([...selectedGroupInternIds, intern.id]);
                                                } else {
                                                   setSelectedGroupInternIds(selectedGroupInternIds.filter(id => id !== intern.id));
                                                }
                                             }}
                                             className="h-3.5 w-3.5 accent-blue-600 cursor-pointer"
                                          />
                                          <span className="text-[11px] font-bold truncate">{intern.name}</span>
                                       </label>
                                    ))}
                                    {interns.filter(i => i.isApproved).length === 0 && (
                                       <p className="col-span-2 text-center text-zinc-400 text-xs py-4">No approved interns available.</p>
                                    )}
                                 </div>
                                 {selectedGroupInternIds.length > 0 && (
                                    <p className="text-[10px] font-bold text-emerald-600">{selectedGroupInternIds.length} interns selected for dispatch.</p>
                                 )}
                              </div>
                              <div className="space-y-1">
                                 <label className="text-[11px] font-bold text-zinc-400">Document link (PDF/Image)</label>
                                 <input required value={groupLetterUrl} onChange={(e) => setGroupLetterUrl(e.target.value)} className="w-full h-11 bg-white border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600" placeholder="https://res.cloudinary.com/..." />
                              </div>
                              <button disabled={sendingGroupLetter || selectedGroupInternIds.length === 0} className="w-full h-14 bg-zinc-900 text-white text-[13px] font-bold hover:bg-blue-600 transition-all disabled:opacity-50">
                                 {sendingGroupLetter ? "Dispatching bulk certificates..." : `Issue certificates to ${selectedGroupInternIds.length} interns`}
                              </button>
                           </form>
                        </div>
                     )}
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
                   {letterSuccess && (
                      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
                         <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white max-w-[320px] w-full p-8 border border-zinc-100 shadow-2xl text-center relative">
                            <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
                               <Check size={24} />
                            </div>
                            <h3 className="text-sm font-bold text-zinc-900 mb-2">Certificate Dispatch Successful</h3>
                            <p className="text-[11px] text-zinc-500 font-medium mb-6">The project certificate has been successfully associated with the intern's record and notification email dispatched.</p>
                            <button onClick={() => setLetterSuccess(false)} className="w-full h-11 bg-zinc-900 text-white text-[11px] font-bold hover:bg-black transition-all">Dismiss Protocol</button>
                         </motion.div>
                      </div>
                   )}
                   {groupLetterSuccess && (
                      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
                         <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white max-w-[320px] w-full p-8 border border-zinc-100 shadow-2xl text-center relative">
                            <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
                               <Check size={24} />
                            </div>
                            <h3 className="text-sm font-bold text-zinc-900 mb-2">Group Dispatch Successful</h3>
                            <p className="text-[11px] text-zinc-500 font-medium mb-6">Bulk project certificates have been associated with all selected intern records and notification emails dispatched in parallel.</p>
                            <button onClick={() => setGroupLetterSuccess(false)} className="w-full h-11 bg-zinc-900 text-white text-[11px] font-bold hover:bg-black transition-all">Dismiss Protocol</button>
                         </motion.div>
                      </div>
                   )}
                </AnimatePresence>

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

               { }
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
                                                <div className="flex items-center gap-2">
                                                   {getCollegeLogo(intern.college || "") && (
                                                      <img 
                                                         src={getCollegeLogo(intern.college || "")!} 
                                                         alt="Logo" 
                                                         className="h-4 w-4 object-contain" 
                                                      />
                                                   )}
                                                   <p className="text-[11px] text-zinc-400">{intern.college || "N/A"}</p>
                                                </div>
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

               { }
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

                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[300px] overflow-y-auto p-4 bg-zinc-50 border border-zinc-100 rounded">
                                 {interns
                                    .filter(i => i.isApproved)
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

               { }
               {activeTab === "hiring" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                     <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
                           <div className="space-y-1">
                              <h2 className="text-2xl font-bold tracking-tighter text-zinc-900">Applicants</h2>
                              <p className="text-[12px] text-zinc-500 font-medium tracking-tight">Review and manage incoming candidate applications for internship cycles.</p>
                           </div>
                           <button onClick={downloadHiringCsv} className="h-9 px-4 bg-black text-white text-[10px] font-bold flex items-center gap-2 hover:bg-zinc-800 transition-all rounded-none shadow-sm">
                              <Download size={14} /> Export Candidates
                           </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                           {hiringApplications.length === 0 ? (
                              <div className="col-span-full py-24 text-center bg-zinc-50 border border-zinc-200">
                                 <p className="text-[13px] text-zinc-400 font-bold">No candidates found in the database.</p>
                              </div>
                           ) : (
                              hiringApplications.map((app) => (
                                 <div key={app.id} className="bg-white border border-zinc-200 p-6 space-y-5 hover:border-zinc-400 transition-all group flex flex-col justify-between">
                                    <div className="space-y-4">
                                       <div className="flex items-start justify-between gap-4">
                                          <div className="space-y-1 overflow-hidden">
                                             <h4 className="text-[15px] font-bold text-zinc-900 truncate">{app.name}</h4>
                                             <p className="text-[11px] font-bold text-red-600">{app.position}</p>
                                          </div>
                                          <div className={`px-2 py-0.5 text-[9px] font-bold border ${app.status === 'pending' ? 'bg-amber-50 border-amber-100 text-amber-700' : app.status === 'interview_scheduled' ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                                             {app.status.replace("_", " ")}
                                          </div>
                                       </div>

                                       <div className="space-y-2 text-zinc-600">
                                          <div className="flex items-center gap-3">
                                             <Mail size={12} className="text-zinc-400" />
                                             <span className="text-[11px] font-medium truncate">{app.email}</span>
                                          </div>
                                          <div className="flex items-center gap-3">
                                             <Phone size={12} className="text-zinc-400" />
                                             <span className="text-[11px] font-medium">{app.phone}</span>
                                          </div>
                                          <div className="flex items-center gap-3">
                                             <Paperclip size={12} className="text-zinc-400" />
                                             <a href={app.resumeLink} target="_blank" className="text-[11px] font-bold text-zinc-900 hover:text-red-600 border-b border-zinc-200 flex items-center gap-1 transition-colors">
                                                Resume link
                                                <ExternalLink size={10} />
                                             </a>
                                          </div>
                                          {app.college && (
                                             <div className="flex items-center gap-3">
                                                {getCollegeLogo(app.college) ? (
                                                   <img 
                                                      src={getCollegeLogo(app.college)!} 
                                                      alt="College Logo" 
                                                      className="h-4 w-4 object-contain shrink-0" 
                                                   />
                                                ) : (
                                                   <Building2 size={12} className="text-zinc-400" />
                                                )}
                                                <span className="text-[11px] font-medium truncate">{app.college} {app.yearOfStudy ? `(${app.yearOfStudy})` : ""}</span>
                                             </div>
                                          )}
                                          {app.portfolioLink && (
                                             <div className="flex items-center gap-3">
                                                <Globe size={12} className="text-zinc-400" />
                                                <a href={app.portfolioLink} target="_blank" className="text-[11px] font-bold text-zinc-900 hover:text-red-600 border-b border-zinc-200 flex items-center gap-1 transition-colors truncate max-w-full">
                                                   Portfolio
                                                   <ExternalLink size={10} />
                                                </a>
                                             </div>
                                          )}
                                          {app.interviewTiming && (
                                             <div className="flex items-center gap-3 text-red-600 bg-red-50/50 p-2 border border-red-100/50">
                                                <Clock size={12} />
                                                <span className="text-[10px] font-bold">Interview: {app.interviewTiming}</span>
                                             </div>
                                          )}
                                       </div>
                                    </div>

                                    <div className="pt-4 border-t border-zinc-50 space-y-3">
                                       <div className="flex gap-2">
                                          <button
                                             onClick={() => {
                                                setSelectedApplicant(app);
                                                setIsInterviewModalOpen(true);
                                                if (app.interviewTiming) setInterviewTiming(app.interviewTiming);
                                             }}
                                             className="h-9 px-4 bg-zinc-100 border border-zinc-200 text-zinc-900 text-[10px] font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 flex-1"
                                          >
                                             <Calendar size={12} />
                                             {app.status === "interview_scheduled" ? "Reschedule" : "Interview"}
                                          </button>

                                          <div className="relative group/status flex-1">
                                             <button className="h-9 w-full px-4 bg-zinc-900 text-white text-[10px] font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
                                                Status
                                                <ChevronDown size={12} />
                                             </button>
                                             <div className="absolute bottom-full left-0 w-full bg-white border border-zinc-200 shadow-xl opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all z-20">
                                                {['pending', 'interview_scheduled', 'offered', 'rejected'].map((s) => (
                                                   <button
                                                      key={s}
                                                      onClick={async () => {
                                                         try {
                                                            await fetch("/api/hiring", {
                                                               method: "PATCH",
                                                               headers: { "Content-Type": "application/json" },
                                                               body: JSON.stringify({ id: app.id, status: s })
                                                            });
                                                            fetchData();
                                                         } catch (err) { console.error("Status update fail"); }
                                                      }}
                                                      className={`w-full text-left px-3 py-2.5 text-[10px] font-bold border-b border-zinc-50 last:border-0 hover:bg-zinc-50 ${app.status === s ? 'text-red-600 bg-red-50/20' : 'text-zinc-600'}`}
                                                   >
                                                      {s.replace("_", " ")}
                                                   </button>
                                                ))}
                                             </div>
                                          </div>
                                       </div>
                                       <button onClick={() => handleDeleteHiringApplication(app.id)} className="h-9 w-full flex items-center justify-center border border-zinc-100 text-[#F5332C] hover:bg-red-50 transition-colors">
                                          <Trash2 size={13} />
                                          <span className="ml-2 text-[10px] font-bold">Delete</span>
                                       </button>
                                    </div>
                                 </div>
                              ))
                           )}
                        </div>
                     </div>
                  </motion.div>
               )}

               { }
               {activeTab === "submissions" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-left">
                     <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
                           <div className="space-y-1">
                              <h2 className="text-2xl font-bold tracking-tighter text-zinc-900">Project Submissions</h2>
                              <p className="text-[12px] text-zinc-500 font-medium tracking-tight">Review and verify completed work from the intern pool.</p>
                           </div>
                        </div>

                        {loadingSubmissions ? (
                           <div className="py-24 text-center bg-zinc-50 border border-zinc-200">
                              <p className="text-[13px] text-zinc-400 font-bold animate-pulse">Loading submissions...</p>
                           </div>
                        ) : (
                           <div className="space-y-6">
                              { }
                              <div className="flex flex-wrap items-center gap-3 border-b border-zinc-100 pb-6">
                                 <button
                                    onClick={() => setSubmissionFilter("all")}
                                    className={`h-9 px-5 text-[10px] font-bold tracking-widest border transition-all flex items-center gap-2 ${submissionFilter === "all" ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400"}`}
                                 >
                                    ALL SUBMISSIONS
                                 </button>
                                 <button
                                    onClick={() => setSubmissionFilter("missing_task1_batch1")}
                                    className={`h-9 px-5 text-[10px] font-bold tracking-widest border transition-all flex items-center gap-2 ${submissionFilter === "missing_task1_batch1" ? "bg-red-600 text-white border-red-600" : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400"}`}
                                 >
                                    <AlertCircle size={13} /> MISSING TASK 1 (BATCH 1)
                                 </button>
                                 <button
                                    onClick={() => setSubmissionFilter("missing_task1_batch2")}
                                    className={`h-9 px-5 text-[10px] font-bold tracking-widest border transition-all flex items-center gap-2 ${submissionFilter === "missing_task1_batch2" ? "bg-red-600 text-white border-red-600" : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400"}`}
                                 >
                                    <AlertCircle size={13} /> MISSING TASK 1 (BATCH 2)
                                 </button>
                              </div>

                              {submissionFilter === "all" ? (
                                 submissions.length === 0 ? (
                                    <div className="py-24 text-center bg-zinc-50 border border-zinc-200">
                                       <p className="text-[13px] text-zinc-400 font-bold">No project submissions found.</p>
                                    </div>
                                 ) : (
                                    <div className="grid grid-cols-1 gap-3">
                                       {submissions.map((sub: any) => (
                                          <div key={sub.id} className="p-5 bg-white border border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-zinc-400 transition-all rounded-none">
                                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 flex-1 gap-6 md:gap-12">
                                                <div className="flex flex-col">
                                                   <span className="text-[9px] font-bold text-zinc-400 mb-1">Intern</span>
                                                   <h4 className="text-[14px] font-bold text-zinc-900 leading-none">{sub.intern?.name || "Unknown"}</h4>
                                                   <div className="flex items-center gap-1.5 mt-1.5">
                                                      <p className="text-[10px] text-zinc-500 font-medium tabular-nums">{sub.intern?.email}</p>
                                                      <span className="text-[9px] font-bold bg-red-50 text-red-600 px-1.5 py-0.5 border border-red-100 uppercase tracking-tighter">{sub.schedule?.batch || "N/A"}</span>
                                                   </div>
                                                </div>

                                                <div className="flex flex-col">
                                                   <span className="text-[9px] font-bold text-zinc-400 mb-1">Project</span>
                                                   <h4 className="text-[13px] font-bold text-zinc-900 leading-none truncate">{sub.schedule?.typeOfWork || sub.schedule?.projectName || "General Work"}</h4>
                                                   <p className="text-[10px] text-red-600 font-bold mt-1">{sub.schedule?.projectName || "Internal Assignment"}</p>
                                                </div>

                                                <div className="flex items-center gap-8 lg:justify-start">
                                                   <div className="flex flex-col">
                                                      <span className="text-[9px] font-bold text-zinc-400 mb-1">Source</span>
                                                      <a href={sub.githubLink} target="_blank" className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-900 hover:text-red-600 transition-colors">
                                                         <Github size={13} /> Repository
                                                      </a>
                                                   </div>
                                                   <div className="flex flex-col border-l border-zinc-100 pl-8">
                                                      <span className="text-[9px] font-bold text-zinc-400 mb-1">Portfolio</span>
                                                      <a href={sub.submissionLink} target="_blank" className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-900 hover:text-red-600 transition-colors">
                                                         <ExternalLink size={13} /> View Link
                                                      </a>
                                                   </div>
                                                </div>
                                             </div>

                                             <div className="flex items-center gap-3 md:border-l md:border-zinc-100 md:pl-6">
                                                <button className="h-9 px-6 bg-zinc-900 text-white text-[10px] font-bold tracking-widest hover:bg-black transition-all rounded-none flex items-center gap-2">
                                                   <CheckCircle2 size={13} /> Verify
                                                </button>
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                 )
                              ) : (

                                 (() => {
                                    const targetBatch = submissionFilter === "missing_task1_batch1" ? "Batch 1" : "Batch 2";
                                    const missingInterns = interns.filter(intern => {

                                       if (!intern.batch || intern.batch.toLowerCase() !== targetBatch.toLowerCase()) return false;
                                       if (!intern.isApproved) return false;

                                       const hasSubmitted = submissions.some(sub => {
                                          const isSameIntern = String(sub.internId) === String(intern.id);
                                          if (!isSameIntern) return false;


                                          const scheduleTitle = (sub.schedule?.projectName || "").toLowerCase();
                                          const scheduleWeek = (sub.schedule?.week || "").toLowerCase();
                                          const scheduleWork = (sub.schedule?.typeOfWork || "").toLowerCase();
                                          const scheduleMainTitle = (sub.schedule?.title || "").toLowerCase();

                                          return scheduleWeek.includes("1") ||
                                             scheduleWeek.includes("one") ||
                                             scheduleTitle.includes("task 1") ||
                                             scheduleTitle.includes("week 1") ||
                                             scheduleMainTitle.includes("task 1") ||
                                             scheduleMainTitle.includes("week 1") ||
                                             scheduleWork.includes("task 1") ||
                                             scheduleWork.includes("week 1") ||
                                             (scheduleWeek === "1") ||
                                             (scheduleTitle.includes("task") && scheduleTitle.includes("1"));
                                       });

                                       return !hasSubmitted;
                                    });

                                    return (
                                       <div className="space-y-6">
                                          <div className="flex items-center justify-between px-1 bg-zinc-50 border border-zinc-100 p-4">
                                             <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-red-50 flex items-center justify-center">
                                                   <AlertCircle className="text-red-600" size={20} />
                                                </div>
                                                <div className="space-y-0.5">
                                                   <p className="text-[11px] font-bold text-zinc-900 uppercase tracking-widest">SUBMISSION AUDIT: {targetBatch}</p>
                                                   <p className="text-[10px] text-zinc-500 font-bold">{missingInterns.length} students pending Task 1</p>
                                                </div>
                                             </div>
                                             <button
                                                onClick={() => downloadMissingCsv(missingInterns, targetBatch)}
                                                className="h-10 px-6 bg-zinc-900 text-white text-[10px] font-bold tracking-widest hover:bg-black transition-all rounded-none flex items-center gap-2"
                                             >
                                                <Download size={14} /> DOWNLOAD CSV
                                             </button>
                                          </div>

                                          {missingInterns.length === 0 ? (
                                             <div className="py-24 text-center bg-zinc-50 border border-zinc-200">
                                                <CheckCircle2 className="mx-auto mb-4 text-emerald-500" size={32} />
                                                <p className="text-[13px] text-zinc-400 font-bold uppercase tracking-tighter">Mission Accomplished</p>
                                                <p className="text-[11px] text-zinc-400 mt-1">All {targetBatch} interns have submitted Task 1.</p>
                                             </div>
                                          ) : (
                                             <div className="grid grid-cols-1 gap-3">
                                                {missingInterns.map((intern: any) => (
                                                   <div key={intern.id} className="p-5 bg-white border border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-red-400 transition-all rounded-none">
                                                      <div className="flex flex-col flex-1">
                                                         <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-[9px] font-bold text-red-600 uppercase bg-red-50 px-2 py-0.5">Missing Task 1</span>
                                                            <span className="text-[9px] font-bold text-zinc-400 uppercase">{intern.batch}</span>
                                                         </div>
                                                         <h4 className="text-[14px] font-bold text-zinc-900 leading-none">{intern.name}</h4>
                                                         <p className="text-[10px] text-zinc-500 font-medium mt-1">{intern.email}</p>
                                                      </div>
                                                      <div className="flex items-center gap-3 md:border-l md:border-zinc-100 md:pl-6">
                                                         <a href={`mailto:${intern.email}`} className="h-9 px-6 bg-red-600 text-white text-[10px] font-bold tracking-widest hover:bg-red-700 transition-all rounded-none flex items-center gap-2">
                                                            <Mail size={13} /> Nudge Intern
                                                         </a>
                                                      </div>
                                                   </div>
                                                ))}
                                             </div>
                                          )}
                                       </div>
                                    );
                                 })()
                              )}
                           </div>
                        )}
                     </div>
                  </motion.div>
               )}

               { }
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
                                       <span className="text-[9px] font-bold text-red-600 uppercase tracking-tighter">{ev.category}</span>
                                       <button onClick={() => handleDeleteEvent(ev.id)} className="text-[#F5332C] hover:bg-red-50 p-1 transition-all"><Trash2 size={12} /></button>
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

               { }
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
                                 <div className="flex items-center justify-between mb-4 font-bold">
                                    <div className="flex items-center gap-2">
                                       <div className={`h-2 w-2 rounded-none ${idea.isApproved ? 'bg-emerald-500' : 'bg-red-600'}`} />
                                       <span className="text-[10px] text-zinc-400 tracking-tight">{idea.isApproved ? 'Approved' : 'Review'}</span>
                                    </div>
                                    <button onClick={() => handleDeleteIdea(idea.id)} className="text-[#F5332C] hover:bg-red-50 p-1.5 transition-all"><Trash2 size={14} /></button>
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

               { }
               {activeTab === "attendance" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-left">
                     <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-200 pb-8">
                        <div className="space-y-4">
                           <div className="space-y-1">
                              <h2 className="text-2xl font-bold tracking-tighter text-zinc-900">Attendance</h2>
                              <p className="text-[12px] text-zinc-500 font-medium">Daily tracking and monthly reporting.</p>
                           </div>
                           <div className="flex items-center gap-2 bg-zinc-50 p-1 border border-zinc-100 w-fit">
                              <span className="text-[10px] text-zinc-400 font-bold uppercase pl-2">Select Date:</span>
                              <input 
                                 type="date" 
                                 value={selectedDate} 
                                 onChange={(e) => setSelectedDate(e.target.value)} 
                                 className="text-[11px] font-bold text-[#0055FF] bg-white px-3 py-1 outline-none border border-zinc-200 focus:border-[#0055FF] transition-all cursor-pointer" 
                              />
                           </div>
                        </div>

                        <div className="flex flex-col gap-4">
                           <div className="flex items-center gap-2 bg-zinc-900 p-2 border border-zinc-800">
                              <div className="flex items-center gap-1">
                                 <select 
                                    value={reportMonth} 
                                    onChange={(e) => setReportMonth(parseInt(e.target.value))}
                                    className="bg-zinc-800 text-white text-[10px] font-bold px-2 py-1 outline-none border border-zinc-700"
                                 >
                                    {Array.from({ length: 12 }, (_, i) => (
                                       <option key={i + 1} value={i + 1}>
                                          {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                       </option>
                                    ))}
                                 </select>
                                 <select 
                                    value={reportYear} 
                                    onChange={(e) => setReportYear(parseInt(e.target.value))}
                                    className="bg-zinc-800 text-white text-[10px] font-bold px-2 py-1 outline-none border border-zinc-700"
                                 >
                                    {[2024, 2025, 2026].map(y => (
                                       <option key={y} value={y}>{y}</option>
                                    ))}
                                 </select>
                                 <button 
                                 onClick={handleDownloadMonthlyAttendancePDF}
                                 disabled={isDownloadingReport}
                                 className="h-7 px-4 bg-[#0055FF] text-white text-[10px] font-bold hover:bg-blue-600 disabled:opacity-50 transition-all flex items-center gap-2"
                              >
                                 <FileBadge size={12} /> {isDownloadingReport ? "Generating..." : "Download PDF Report"}
                              </button>
                                 <button 
                                     onClick={handleDownloadMonthlyAttendance}
                                     disabled={isDownloadingReport}
                                     className="h-7 px-3 bg-zinc-800 text-zinc-400 text-[10px] font-bold hover:bg-zinc-700 disabled:opacity-50 transition-all flex items-center gap-2 border-l border-zinc-700"
                                     title="Download CSV Format"
                                  >
                                     <Download size={12} />
                                  </button>
                              </div>
                           </div>

                           <div className="flex flex-wrap items-center gap-2 justify-end">
                              <button onClick={() => handleMarkAllAttendance("PRESENT")} className="h-8 px-4 bg-zinc-100 border border-zinc-200 text-zinc-900 text-[10px] font-bold hover:bg-zinc-200 transition-all">Mark all present</button>
                              <button onClick={() => handleMarkAllAttendance("ABSENT")} className="h-8 px-4 bg-zinc-900 text-white text-[10px] font-bold hover:bg-black transition-all">Mark all absent</button>
                              <button onClick={() => handleMarkHandRaisedAttendance()} className="h-8 px-4 bg-red-600 text-white text-[10px] font-bold hover:bg-red-700 transition-all flex items-center gap-2">
                                 <Hand size={14} /> Quick-Mark
                              </button>
                           </div>
                        </div>
                     </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                           {interns.filter(i => i.isApproved).map((intern) => {
                              const record = Array.isArray(currentAttendance) ? currentAttendance.find(a => a.userId === intern.id) : null;
                              return (
                                 <div key={intern.id} className={`p-5 border group transition-all relative rounded-none flex flex-col justify-between ${intern.handRaised ? "bg-amber-50/20 border-amber-500/50" : "bg-white border-zinc-200"}`}>
                                    <div className="space-y-4">
                                       <div className="flex items-start justify-between">
                                          <div className="flex flex-col min-w-0">
                                             <div className="flex items-center gap-2 mb-0.5">
                                                <p className="text-[14px] font-bold text-zinc-900 truncate">{intern.name}</p>
                                                {intern.handRaised && <div className="h-1.5 w-1.5 bg-amber-500 rounded-none animate-ping" />}
                                             </div>
                                             <p className="text-[10px] font-bold text-zinc-400 truncate">{intern.branch || 'General branch'}</p>
                                          </div>
                                          {record && (
                                             <div className={`px-2 py-0.5 text-[9px] font-bold border ${record.status === "PRESENT" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"}`}>
                                                {record.status}
                                             </div>
                                          )}
                                       </div>

                                       <div className="flex items-center gap-2">
                                          <span className={`text-[10px] font-bold px-1.5 py-0.5 ${intern.attendancePercentage && intern.attendancePercentage < 75 ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-zinc-50 text-zinc-600 border border-zinc-100'}`}>
                                             {intern.attendancePercentage ?? 0}% Attendance
                                          </span>
                                          <span className="text-[10px] font-bold text-zinc-400 tabular-nums">
                                             ({intern.presentCount ?? 0}/{intern.totalTrackingDays ?? 0} d)
                                          </span>
                                       </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-6">
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
                     </motion.div>
                  )}

               {activeTab === "bootcamp" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-left">
                     <div className="bg-white border border-zinc-100 p-8">
                        <div className="flex justify-between items-center mb-10">
                           <div className="space-y-1">
                              <h2 className="text-2xl font-bold tracking-tighter text-zinc-900">Summer Bootcamp 2026</h2>
                              <p className="text-[12px] text-zinc-500 font-medium tracking-tight">Managing {bootcampRegistrations.length} enrollment registrations.</p>
                           </div>
                           <button onClick={() => fetchBootcampRegistrations()} className="p-2 border border-zinc-100 hover:bg-zinc-50 transition-colors">
                              <RefreshCw size={16} className={isLoading ? "animate-spin text-red-600" : "text-zinc-400"} />
                           </button>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="w-full text-left border-collapse">
                              <thead>
                                 <tr className="border-b border-zinc-200">
                                    <th className="py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Candidate</th>
                                    <th className="py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Affiliation</th>
                                    <th className="py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Contact</th>
                                    <th className="py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Transaction ID</th>
                                    <th className="py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                                    <th className="py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Actions</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {bootcampRegistrations.map((reg) => (
                                    <tr key={reg.id} className="border-b border-zinc-50 group hover:bg-zinc-50/50 transition-colors">
                                       <td className="py-4">
                                          <p className="text-[14px] font-bold text-zinc-900">{reg.name}</p>
                                          <p className="text-[11px] text-zinc-400">{reg.email}</p>
                                       </td>
                                       <td className="py-4">
                                          <p className="text-[13px] font-medium text-zinc-700">{reg.college}</p>
                                          <p className="text-[11px] text-zinc-400">{reg.branch} • {reg.year}</p>
                                       </td>
                                       <td className="py-4">
                                          <p className="text-[13px] font-medium text-zinc-700">{reg.phone}</p>
                                       </td>
                                       <td className="py-4">
                                          <p className="text-[12px] tabular-nums font-mono text-zinc-500">{reg.transactionId || "MANUAL_PENDING"}</p>
                                       </td>
                                       <td className="py-4">
                                          <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-tight ${reg.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"}`}>
                                             {reg.paymentStatus}
                                          </span>
                                       </td>
                                       <td className="py-4">
                                          <div className="flex gap-2">
                                             {reg.paymentStatus !== "paid" && (
                                                <button onClick={() => handleUpdateBootcampStatus(reg.id, "paid")} className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700 transition-colors">Verify</button>
                                             )}
                                             <button onClick={() => { if(confirm("Neutralize registration?")) fetch(`/api/cleed/bootcamp?id=${reg.id}`, { method: 'DELETE' }).then(() => fetchBootcampRegistrations()) }} className="p-1.5 border border-zinc-100 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                                          </div>
                                       </td>
                                    </tr>
                                 ))}
                                 {bootcampRegistrations.length === 0 && (
                                    <tr><td colSpan={6} className="py-20 text-center text-zinc-400 italic text-sm">No synchronized entry nodes found.</td></tr>
                                 )}
                              </tbody>
                           </table>
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

               {/* Manage Schedules */}
               {activeTab === "manage_schedules" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-left">
                     <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
                           <div className="space-y-1">
                              <h2 className="text-2xl font-bold tracking-tighter text-zinc-900">Schedules</h2>
                              <p className="text-[12px] text-zinc-500 font-medium tracking-tight">Manage project timelines, team assignments, and delivery deadlines.</p>
                           </div>
                           <div className="flex items-center gap-2">

                              <button
                                 onClick={() => { fetchData(); }}
                                 className="h-9 px-3 border border-zinc-200 bg-white hover:bg-zinc-50 transition-all rounded-none"
                              >
                                 <RefreshCw size={14} className={isLoading ? "animate-spin text-red-600" : "text-zinc-400"} />
                              </button>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                           {allSchedules.length === 0 ? (
                              <div className="col-span-full py-24 text-center bg-zinc-50 border border-zinc-200">
                                 <p className="text-[13px] text-zinc-400 font-bold italic">No schedules found.</p>
                              </div>
                           ) : (
                              allSchedules.map((schedule) => (
                                 <div key={schedule.id} className="border border-zinc-200 bg-white p-6 space-y-6 hover:border-zinc-400 transition-all rounded-none flex flex-col justify-between">
                                    <div className="space-y-5">
                                       <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                             <span className="text-[10px] font-bold bg-zinc-900 px-2 py-0.5 text-white">{schedule.week}</span>
                                             <span className="text-[10px] font-bold bg-red-50 text-red-600 px-2 py-0.5 border border-red-100">{schedule.batch}</span>
                                          </div>
                                          <div className="flex items-center gap-1.5 font-bold">
                                             <button
                                                onClick={async () => {
                                                   const res = await fetch("/api/intern/schedule", {
                                                      method: "PATCH",
                                                      headers: { "Content-Type": "application/json" },
                                                      body: JSON.stringify({ id: schedule.id, isManualOpen: !schedule.isManualOpen })
                                                   });
                                                   if (res.ok) fetchData();
                                                }}
                                                className={`h-8 w-8 flex items-center justify-center border transition-all ${schedule.isManualOpen ? "bg-red-600 text-white border-red-600" : "bg-zinc-50 text-zinc-400 hover:text-zinc-900 border-zinc-200"}`}
                                                title={schedule.isManualOpen ? "Close Week" : "Re-open Week (Allow Late Submissions)"}
                                             >
                                                <RefreshCw size={14} className={schedule.isManualOpen ? "animate-spin-slow" : ""} />
                                             </button>
                                             <button
                                                onClick={() => setEditingSchedule(schedule)}
                                                className="h-8 w-8 flex items-center justify-center bg-zinc-50 text-zinc-400 hover:text-zinc-900 border border-zinc-200 transition-all"
                                             >
                                                <FileText size={14} />
                                             </button>
                                             <button
                                                onClick={async () => {
                                                   if (confirm("Permanently delete this schedule?")) {
                                                      const res = await fetch(`/api/intern/schedule?id=${schedule.id}`, { method: "DELETE" });
                                                      if (res.ok) fetchData();
                                                   }
                                                }}
                                                className="h-8 w-8 flex items-center justify-center bg-zinc-50 text-[#F5332C] hover:bg-red-50 border border-zinc-200 transition-all"
                                             >
                                                <Trash2 size={14} />
                                             </button>
                                          </div>
                                       </div>

                                       <div className="space-y-2">
                                          <h4 className="text-[16px] font-bold text-zinc-900 leading-tight">{schedule.projectName || schedule.typeOfWork}</h4>
                                          <p className="text-[12px] text-zinc-500 font-medium leading-relaxed line-clamp-2">{schedule.description}</p>
                                       </div>

                                       <div className="grid grid-cols-2 gap-4 pt-2">
                                          <div className="space-y-0.5 border-l-2 border-zinc-100 pl-3">
                                             <span className="text-[9px] font-bold text-zinc-400">Assignment</span>
                                             <p className="text-[12px] font-bold text-zinc-900 truncate">{schedule.teamAllocation || "All Interns"}</p>
                                          </div>
                                          <div className="space-y-0.5 border-l-2 border-zinc-100 pl-3">
                                             <span className="text-[9px] font-bold text-zinc-400">Deadline</span>
                                             <p className="text-[12px] font-bold text-red-600">{new Date(schedule.deadline).toLocaleDateString()}</p>
                                          </div>
                                          <div className="space-y-0.5 border-l-2 border-zinc-100 pl-3">
                                             <span className="text-[9px] font-bold text-zinc-400">Mentor</span>
                                             <p className="text-[12px] font-bold text-zinc-900 truncate">{schedule.mentorName || "Admin"}</p>
                                          </div>
                                          <div className="space-y-0.5 border-l-2 border-zinc-100 pl-3">
                                             <span className="text-[9px] font-bold text-zinc-400">Project Lead</span>
                                             <p className="text-[12px] font-bold text-zinc-900 truncate">{schedule.teamLead || "Not Assigned"}</p>
                                          </div>
                                       </div>
                                    </div>

                                    <div className="pt-6 mt-6 border-t border-zinc-50 space-y-4">
                                       <div className="space-y-2">
                                          <span className="text-[9px] font-bold text-zinc-400">Team Roster ({schedule.teamInternNames?.length || 0})</span>
                                          <div className="flex flex-wrap gap-1.5">
                                             {Array.isArray(schedule.teamInternNames) && schedule.teamInternNames.length > 0 ? (
                                                schedule.teamInternNames.map((name: string, i: number) => (
                                                   <span key={i} className="text-[10px] bg-zinc-50 border border-zinc-100 px-2 py-0.5 font-bold text-zinc-600">{name}</span>
                                                ))
                                             ) : (
                                                <p className="text-[10px] text-zinc-400 font-bold">No members assigned.</p>
                                             )}
                                          </div>
                                       </div>

                                       <div className="flex items-center justify-between gap-4">
                                          <div className="flex flex-wrap gap-1.5 max-w-[60%]">
                                             {schedule.toolsUsed?.map((tool: string, i: number) => (
                                                <span key={i} className="text-[10px] font-bold text-red-600">#{tool}</span>
                                             ))}
                                          </div>
                                          {schedule.projectDocLink && (
                                             <a href={schedule.projectDocLink} target="_blank" className="text-[10px] font-bold text-zinc-900 flex items-center gap-1.5 hover:text-red-600 transition-colors border-b border-zinc-200 pb-0.5">
                                                Documents <ExternalLink size={10} />
                                             </a>
                                          )}
                                       </div>
                                    </div>
                                 </div>
                              ))
                           )}
                        </div>
                     </div>

                     <AnimatePresence>
                        {editingSchedule && (
                           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                              <motion.div
                                 initial={{ opacity: 0, scale: 0.95 }}
                                 animate={{ opacity: 1, scale: 1 }}
                                 exit={{ opacity: 0, scale: 0.95 }}
                                 className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto p-10 border border-zinc-200 shadow-2xl relative rounded-none"
                              >
                                 <button onClick={() => setEditingSchedule(null)} className="absolute top-6 right-6 text-zinc-400 hover:text-black transition-colors"><CloseIcon size={20} /></button>

                                 <div className="mb-10 text-left space-y-1">
                                    <h3 className="text-2xl font-bold tracking-tighter text-zinc-900">Update Schedule</h3>
                                    <p className="text-[12px] text-zinc-500 font-medium">Modify project parameters for {editingSchedule.week}.</p>
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
                                          if (res.ok) { setEditingSchedule(null); fetchData(); }
                                       } catch (err) { console.error("Update fail"); }
                                       finally { setLoadingSchedules(false); }
                                    }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left"
                                 >
                                    <div className="space-y-1">
                                       <label className="text-[11px] font-bold text-zinc-400">Week</label>
                                       <input required value={editingSchedule.week} onChange={(e) => setEditingSchedule({ ...editingSchedule, week: e.target.value })} className="w-full h-11 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none" />
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[11px] font-bold text-zinc-400">Project Name</label>
                                       <input required value={editingSchedule.projectName} onChange={(e) => setEditingSchedule({ ...editingSchedule, projectName: e.target.value })} className="w-full h-11 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none" />
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                       <label className="text-[11px] font-bold text-zinc-400">Description</label>
                                       <textarea required rows={4} value={editingSchedule.description} onChange={(e) => setEditingSchedule({ ...editingSchedule, description: e.target.value })} className="w-full bg-white border border-zinc-200 p-4 text-sm font-bold outline-none focus:border-red-600 resize-none rounded-none" />
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[11px] font-bold text-zinc-400">Assignment</label>
                                       <input value={editingSchedule.teamAllocation} onChange={(e) => setEditingSchedule({ ...editingSchedule, teamAllocation: e.target.value })} className="w-full h-11 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none" />
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[11px] font-bold text-zinc-400">Project Lead</label>
                                       <input value={editingSchedule.teamLead} onChange={(e) => setEditingSchedule({ ...editingSchedule, teamLead: e.target.value })} className="w-full h-11 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none" />
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[11px] font-bold text-zinc-400">Mentor</label>
                                       <input value={editingSchedule.mentorName} onChange={(e) => setEditingSchedule({ ...editingSchedule, mentorName: e.target.value })} className="w-full h-11 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none" />
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[11px] font-bold text-zinc-400">Project Link</label>
                                       <input value={editingSchedule.projectDocLink} onChange={(e) => setEditingSchedule({ ...editingSchedule, projectDocLink: e.target.value })} className="w-full h-11 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none" />
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[11px] font-bold text-zinc-400">Deadline</label>
                                       <input type="date" value={new Date(editingSchedule.deadline).toISOString().split('T')[0]} onChange={(e) => setEditingSchedule({ ...editingSchedule, deadline: e.target.value })} className="w-full h-11 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none" />
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[11px] font-bold text-zinc-400">Tech Stack (comma separated)</label>
                                       <input value={Array.isArray(editingSchedule.toolsUsed) ? editingSchedule.toolsUsed.join(", ") : editingSchedule.toolsUsed} onChange={(e) => setEditingSchedule({ ...editingSchedule, toolsUsed: e.target.value })} className="w-full h-11 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none" />
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[11px] font-bold text-zinc-400">Type of Work</label>
                                       <input required value={editingSchedule.typeOfWork} onChange={(e) => setEditingSchedule({ ...editingSchedule, typeOfWork: e.target.value })} className="w-full h-11 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none" />
                                    </div>
                                    <div className="space-y-1">
                                       <label className="text-[11px] font-bold text-zinc-400">Deployment Tools (comma separated)</label>
                                       <input value={Array.isArray(editingSchedule.deploymentTools) ? editingSchedule.deploymentTools.join(", ") : (editingSchedule.deploymentTools || "")} onChange={(e) => setEditingSchedule({ ...editingSchedule, deploymentTools: e.target.value })} className="w-full h-11 bg-white border border-zinc-200 px-4 text-sm font-bold outline-none focus:border-red-600 rounded-none" />
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                       <label className="text-[11px] font-bold text-zinc-400">Requirements (enter each on a new line)</label>
                                       <textarea rows={4} value={Array.isArray(editingSchedule.requirements) ? editingSchedule.requirements.join("\n") : (editingSchedule.requirements || "")} onChange={(e) => setEditingSchedule({ ...editingSchedule, requirements: e.target.value })} className="w-full bg-white border border-zinc-200 p-4 text-sm font-bold outline-none focus:border-red-600 resize-none rounded-none" />
                                    </div>
                                    <div className="md:col-span-2 space-y-1">
                                       <label className="text-[11px] font-bold text-zinc-400">Outcomes (enter each on a new line)</label>
                                       <textarea rows={4} value={Array.isArray(editingSchedule.outcomes) ? editingSchedule.outcomes.join("\n") : (editingSchedule.outcomes || "")} onChange={(e) => setEditingSchedule({ ...editingSchedule, outcomes: e.target.value })} className="w-full bg-white border border-zinc-200 p-4 text-sm font-bold outline-none focus:border-red-600 resize-none rounded-none" />
                                    </div>
                                    <button disabled={loadingSchedules} className="md:col-span-2 mt-4 h-14 bg-zinc-900 text-white text-[12px] font-bold tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 rounded-none">
                                       {loadingSchedules ? <RefreshCw className="animate-spin" size={18} /> : "Update Schedule"}
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

         <AnimatePresence>
            {isInterviewModalOpen && selectedApplicant && (
               <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                  <motion.div
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="bg-white max-w-lg w-full p-6 md:p-10 border border-zinc-100 shadow-2xl relative text-left"
                  >
                     <button
                        onClick={() => setIsInterviewModalOpen(false)}
                        className="absolute top-6 right-6 text-zinc-300 hover:text-black transition-colors"
                     >
                        <CloseIcon size={20} />
                     </button>

                     <div className="mb-10">
                        <h3 className="text-xl font-bold tracking-tight text-zinc-900 mb-2">
                           {selectedApplicant?.status === "interview_scheduled" ? "Reschedule Interview" : "Schedule Interview"}
                        </h3>
                        <p className="text-[13px] text-zinc-500 font-medium">Invitation for <b>{selectedApplicant?.name}</b> · <b>{selectedApplicant?.position}</b></p>
                     </div>

                     <form onSubmit={handleScheduleInterview} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                 <Calendar size={12} />
                                 Date
                              </label>
                              <input
                                 required
                                 type="date"
                                 value={interviewTiming.split(' at ')[0] || ""}
                                 onChange={(e) => {
                                    const time = interviewTiming.split(' at ')[1] || "";
                                    setInterviewTiming(`${e.target.value}${time ? ' at ' + time : ''}`);
                                 }}
                                 className="w-full h-12 bg-zinc-50 border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm"
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                 <Clock size={12} />
                                 Time
                              </label>
                              <input
                                 required
                                 type="time"
                                 value={interviewTiming.split(' at ')[1] || ""}
                                 onChange={(e) => {
                                    const date = interviewTiming.split(' at ')[0] || "";
                                    setInterviewTiming(`${date}${e.target.value ? ' at ' + e.target.value : ''}`);
                                 }}
                                 className="w-full h-12 bg-zinc-50 border border-zinc-100 px-4 text-sm font-bold outline-none focus:border-blue-600 focus:bg-white transition-all shadow-sm"
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Selected Schedule Preview</label>
                           <div className="h-12 bg-zinc-900 text-white flex items-center px-4 text-xs font-bold tracking-tight">
                              {interviewTiming || "Selection required..."}
                           </div>
                        </div>

                        <div className="p-4 bg-zinc-50 border border-zinc-100 text-[11px] text-zinc-500 space-y-2">
                           <p className="font-bold text-zinc-900 uppercase tracking-tighter">Location (Fixed Node)</p>
                           <p>STUDENT FORGE Corporate office</p>
                           <p>HF2R+CCV, Devender Colony, Kompally, Hyderabad, Telangana 500100</p>
                        </div>

                        <button
                           disabled={isSendingInterview || !interviewTiming.includes(' at ')}
                           className="w-full h-14 bg-blue-600 text-white text-[13px] font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                           {isSendingInterview ? <RefreshCw className="animate-spin" size={18} /> :
                              selectedApplicant?.status === "interview_scheduled" ? "Confirm & Send Reschedule Notice" : "Confirm & Send Invitation"}
                        </button>
                        {interviewSuccess && (
                           <p className="text-emerald-600 text-[11px] font-bold text-center animate-pulse">
                              {selectedApplicant?.status === "interview_scheduled" ? "Reschedule Notice Sent." : "Invitation Sent."} Applicant standing updated.
                           </p>
                        )}
                     </form>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
      </div>
   );
}
