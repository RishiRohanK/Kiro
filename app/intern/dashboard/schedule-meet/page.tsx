"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
    Calendar as CalendarIcon, 
    Clock, 
    CheckCircle2, 
    ArrowLeft, 
    Info, 
    User, 
    Mail, 
    Sparkles,
    AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Booking {
    id: string;
    name: string;
    email: string;
    date: string;
    time: string;
    topic: string;
    status: string;
    createdAt: string;
}

const SLOTS = [
    "10:00 AM - 10:45 AM",
    "07:00 PM - 07:45 PM",
    "08:00 PM - 08:45 PM"
];

// Generate dates from May 25, 2026 to June 20, 2026
const generateDates = () => {
    const dates = [];
    const start = new Date(2026, 4, 25); // May 25, 2026
    const end = new Date(2026, 5, 20);   // June 20, 2026
    while (start <= end) {
        dates.push(new Date(start));
        start.setDate(start.getDate() + 1);
    }
    return dates;
};

export default function ScheduleMeetPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [datesList] = useState<Date[]>(generateDates());
    const [selectedDate, setSelectedDate] = useState<string>("2026-05-25");
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [existingBookings, setExistingBookings] = useState<Booking[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("intern_user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            router.push("/intern/signin");
        }
        fetchBookings();
    }, [router]);

    const fetchBookings = async () => {
        try {
            const res = await fetch("/api/mentorship");
            const data = await res.json();
            if (Array.isArray(data)) {
                setExistingBookings(data);
            }
        } catch (err) {
            console.error("Failed to load existing bookings:", err);
        } finally {
            setLoadingBookings(false);
        }
    };

    const formatDateString = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSchedule = async () => {
        if (!user || !selectedDate || !selectedSlot || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/mentorship", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: user.name,
                    email: user.email,
                    date: selectedDate,
                    time: selectedSlot,
                    topic: "Week 3 Evaluation Interview"
                })
            });

            if (res.ok) {
                setShowSuccessModal(true);
                setSelectedSlot(null);
                fetchBookings();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to schedule. Please try again.");
            }
        } catch (err) {
            console.error("Scheduling error:", err);
            alert("Server error occurred while scheduling.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Filter bookings for selected date to check slot availability
    const isSlotBooked = (slotTime: string) => {
        return existingBookings.some(
            b => b.date === selectedDate && b.time === slotTime
        );
    };

    const getAvailableSlotsCount = (dateStr: string) => {
        const bookedCount = existingBookings.filter(b => b.date === dateStr).length;
        return Math.max(0, 3 - bookedCount);
    };

    // Get booking details if booked by the current user
    const userBookedSlot = existingBookings.find(
        b => b.email === user?.email
    );

    return (
        <div className="p-6 lg:p-10 w-full min-h-screen pb-24 bg-[#FBFBFB] font-sans">
            <div className="max-w-7xl mx-auto w-full">
                <header className="mb-8 border-b border-zinc-100 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Link href="/intern/dashboard" className="inline-flex items-center gap-1 text-[11px] font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-wider mb-2">
                            <ArrowLeft size={12} /> Dashboard
                        </Link>
                        <h1 className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
                            <CalendarIcon size={20} className="text-[#003366]" /> Week 3 Interview Scheduling
                        </h1>
                        <p className="text-zinc-500 text-xs mt-1 leading-relaxed">
                            Select a date and available time slot for your evaluation interview.
                        </p>
                    </div>
                </header>

                {userBookedSlot ? (
                    <div className="max-w-xl mx-auto bg-white border border-zinc-200 p-8 rounded-2xl shadow-sm text-center">
                        <div className="h-12 w-12 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
                            <CheckCircle2 size={24} />
                        </div>
                        <h3 className="text-base font-bold text-zinc-950 mb-1">Interview Already Scheduled</h3>
                        <p className="text-xs text-zinc-500 font-medium mb-6">
                            You have successfully scheduled your evaluation interview. Please find the details below.
                        </p>
                        
                        <div className="bg-zinc-50 border border-zinc-150 rounded-xl p-5 text-left space-y-4 max-w-sm mx-auto text-xs">
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase">Topic</span>
                                <span className="col-span-2 font-bold text-zinc-800">{userBookedSlot.topic}</span>
                            </div>
                            <div className="h-px bg-zinc-200" />
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase">Date</span>
                                <span className="col-span-2 font-bold text-zinc-800">
                                    {new Date(userBookedSlot.date).toLocaleDateString('en-IN', {
                                        weekday: 'long',
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                            <div className="h-px bg-zinc-200" />
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase">Time Slot</span>
                                <span className="col-span-2 font-bold text-zinc-800">{userBookedSlot.time}</span>
                            </div>
                            <div className="h-px bg-zinc-200" />
                            <div className="grid grid-cols-3 gap-2">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase">Status</span>
                                <span className="col-span-2"><span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded text-[9px] font-bold uppercase">{userBookedSlot.status}</span></span>
                            </div>
                        </div>
                        
                        <div className="mt-8 flex gap-3 justify-center">
                            <Link href="/intern/dashboard" className="h-10 px-6 bg-zinc-950 text-white text-xs font-bold rounded-lg hover:bg-black transition-all flex items-center justify-center">
                                Return to Dashboard
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8 w-full">
                        {/* 1. Choose Date (Full Width) */}
                        <div className="space-y-4 w-full">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">1. Choose Date</h3>
                            <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm w-full">
                                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-10 gap-3.5 max-h-[480px] overflow-y-auto pr-1">
                                    {datesList.map((date) => {
                                        const dateStr = formatDateString(date);
                                        const isSelected = selectedDate === dateStr;
                                        const availableCount = getAvailableSlotsCount(dateStr);
                                        
                                        return (
                                            <button
                                                key={dateStr}
                                                onClick={() => {
                                                    setSelectedDate(dateStr);
                                                    setSelectedSlot(null);
                                                }}
                                                className={`py-5 px-3.5 min-h-[115px] border rounded-xl flex flex-col items-center justify-center transition-all ${
                                                    isSelected 
                                                    ? "bg-[#003366] border-[#003366] text-white shadow-md shadow-[#003366]/10" 
                                                    : "bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700"
                                                }`}
                                            >
                                                <span className={`text-[9px] font-bold uppercase tracking-wide ${isSelected ? 'text-blue-200' : 'text-zinc-400'}`}>
                                                    {date.toLocaleString('en-US', { weekday: 'short' })}
                                                </span>
                                                <span className="text-base font-bold my-0.5 leading-none">{date.getDate()}</span>
                                                <span className={`text-[9px] font-bold uppercase ${isSelected ? 'text-blue-200' : 'text-zinc-400'}`}>
                                                    {date.toLocaleString('en-US', { month: 'short' })}
                                                </span>
                                                
                                                {/* Slots Count */}
                                                <span className={`text-[8px] font-bold mt-2 px-1.5 py-0.5 rounded-full ${
                                                    isSelected
                                                    ? "bg-white/20 text-white"
                                                    : availableCount === 0
                                                    ? "bg-red-50 text-red-500 border border-red-150"
                                                    : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                                }`}>
                                                    {availableCount} {availableCount === 1 ? "slot" : "slots"}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Slots & Confirmation */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
                            <div className="lg:col-span-2 space-y-4">
                                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">2. Available Slots</h3>
                                <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm space-y-3">
                                    {loadingBookings ? (
                                        <div className="py-10 text-center text-xs text-zinc-400">Loading slot availability...</div>
                                    ) : (
                                        SLOTS.map((slot) => {
                                            const booked = isSlotBooked(slot);
                                            const isSelected = selectedSlot === slot;
                                            return (
                                                <button
                                                    key={slot}
                                                    disabled={booked}
                                                    onClick={() => setSelectedSlot(slot)}
                                                    className={`w-full p-4 border rounded-xl flex items-center justify-between transition-all text-left ${
                                                        booked 
                                                        ? "bg-zinc-50 border-zinc-150 text-zinc-400 cursor-not-allowed opacity-60" 
                                                        : isSelected 
                                                        ? "bg-blue-50/70 border-blue-500 text-blue-900 shadow-sm"
                                                        : "bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Clock size={16} className={isSelected ? "text-blue-600" : booked ? "text-zinc-300" : "text-zinc-400"} />
                                                        <span className="text-xs font-bold leading-none">{slot}</span>
                                                    </div>
                                                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                                        booked 
                                                        ? "bg-zinc-100 text-zinc-400" 
                                                        : isSelected 
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                                    }`}>
                                                        {booked ? "Booked" : isSelected ? "Selected" : "Available"}
                                                    </span>
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {selectedSlot ? (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="space-y-4"
                                    >
                                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">3. Confirm Reservation</h3>
                                        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                                            <div className="space-y-4 text-left">
                                                <div className="flex items-start gap-3 bg-blue-50/30 border border-blue-100 p-3.5 rounded-xl">
                                                    <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                                    <p className="text-[11px] text-zinc-500 leading-normal">
                                                        By confirming, you will register a slot for <strong>Week 3 Evaluation Interview</strong>. Details will be synced with your mentor.
                                                    </p>
                                                </div>

                                                <div className="space-y-2 text-xs">
                                                    <div className="flex items-center gap-2 text-zinc-500">
                                                        <User size={14} className="text-zinc-400" />
                                                        <span className="font-bold text-zinc-700">{user?.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-zinc-500">
                                                        <Mail size={14} className="text-zinc-400" />
                                                        <span className="font-bold text-zinc-700">{user?.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-zinc-500">
                                                        <CalendarIcon size={14} className="text-zinc-400" />
                                                        <span className="font-bold text-zinc-750">
                                                            {new Date(selectedDate).toLocaleDateString('en-IN', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-zinc-500">
                                                        <Clock size={14} className="text-zinc-400" />
                                                        <span className="font-bold text-zinc-750">{selectedSlot}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={handleSchedule}
                                                disabled={isSubmitting}
                                                className="w-full mt-6 h-11 bg-[#003366] text-white text-xs font-bold rounded-lg hover:bg-black transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                                            >
                                                {isSubmitting ? "Scheduling slot..." : "Confirm & Schedule"}
                                            </button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="hidden lg:flex h-[230px] border border-dashed border-zinc-200 rounded-2xl flex-col items-center justify-center text-zinc-400 text-xs p-5">
                                        <Clock size={20} className="mb-2 text-zinc-300" />
                                        <span>Select a slot to confirm your booking</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showSuccessModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            exit={{ opacity: 0, scale: 0.9 }} 
                            className="bg-white max-w-[340px] w-full p-8 border border-zinc-100 shadow-2xl text-center rounded-2xl relative"
                        >
                            <div className="h-12 w-12 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                                <Sparkles size={24} />
                            </div>
                            <h3 className="text-sm font-bold text-zinc-900 mb-2">Slot Scheduled Successfully</h3>
                            <p className="text-[11px] text-zinc-500 font-medium mb-6 leading-relaxed">
                                Your evaluation interview slot has been confirmed and synced with the Cleed dashboard. Prepare well!
                            </p>
                            <button 
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    fetchBookings();
                                }} 
                                className="w-full h-11 bg-zinc-900 text-white text-[11px] font-bold hover:bg-black transition-all rounded-lg"
                            >
                                Ok, Got it
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
