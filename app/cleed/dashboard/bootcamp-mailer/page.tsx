"use client";

import { useState, useEffect } from "react";
import { Mail, Send, Users, CheckCircle2, AlertCircle, Loader2, Search, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Registration {
    id: string;
    name: string;
    email: string;
    college: string;
    paymentStatus: string;
    createdAt: string;
}

export default function BootcampMailerPage() {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    
    const [formData, setFormData] = useState({
        subject: "Important Update: Summer Boot Camp 2026",
        title: "Summer Boot Camp Training Update",
        content: "Dear Candidate,\n\nWe are pleased to inform you that the training schedule for the Summer Boot Camp 2026 has been finalized. Please log in to your dashboard to view the latest updates and curriculum details.\n\nBest regards,\nStudent Forge Team"
    });

    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const res = await fetch("/api/cleed/bootcamp-registrations");
            const data = await res.json();
            if (Array.isArray(data)) {
                setRegistrations(data);
                setSelectedIds(data.map(r => r.id)); // Default select all
            }
        } catch (err) {
            console.error("Failed to fetch registrations");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAll = () => {
        if (selectedIds.length === filteredRegistrations.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredRegistrations.map(r => r.id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSend = async () => {
        if (!selectedIds.length) return;
        setSending(true);
        setStatus(null);

        try {
            const res = await fetch("/api/cleed/send-bulk-bootcamp-mail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    targetIds: selectedIds
                })
            });

            const data = await res.json();
            if (res.ok) {
                setStatus({ type: 'success', message: `Successfully queued ${selectedIds.length} emails!` });
            } else {
                setStatus({ type: 'error', message: data.error || "Failed to send emails" });
            }
        } catch (err) {
            setStatus({ type: 'error', message: "Internal server error" });
        } finally {
            setSending(false);
        }
    };

    const filteredRegistrations = registrations.filter(r => 
        r.name.toLowerCase().includes(search.toLowerCase()) || 
        r.email.toLowerCase().includes(search.toLowerCase()) ||
        r.college.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => window.location.href = "/cleed/dashboard"}
                            className="h-10 px-4 bg-white border border-zinc-200 text-zinc-900 text-xs font-bold uppercase tracking-widest hover:bg-zinc-50 transition-all flex items-center gap-2"
                        >
                            <LayoutDashboard size={14} /> Dashboard
                        </button>
                        <div className="h-8 w-[1px] bg-zinc-200 mx-2 hidden md:block" />
                        <div>
                            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#F5332C] text-white flex items-center justify-center rounded-none shadow-lg shadow-red-500/20">
                                    <Mail size={20} />
                                </div>
                                Bootcamp Mailer
                            </h1>
                            <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-tighter mt-1">Industrial Dispatch Protocol</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-2 border border-zinc-200 shadow-sm rounded-none">
                        <div className="px-5 py-2 bg-zinc-50 border border-zinc-100 text-right">
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Authorized Nodes</span>
                            <span className="text-lg font-black text-zinc-900 tabular-nums">{selectedIds.length} <span className="text-xs text-zinc-400">/ {registrations.length}</span></span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Compose Form */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
                            <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                                <Send size={14} className="text-blue-500" />
                                Compose Message
                            </h2>
                            
                            <div className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Email Subject</label>
                                    <input 
                                        value={formData.subject}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                        className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-black/5 outline-none transition-all"
                                        placeholder="Enter subject line..."
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Display Title</label>
                                    <input 
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-black/5 outline-none transition-all"
                                        placeholder="Headline in email body..."
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Email Content</label>
                                    <textarea 
                                        value={formData.content}
                                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                                        className="w-full h-48 bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-black/5 outline-none transition-all resize-none"
                                        placeholder="Write your message here..."
                                    />
                                </div>

                                <button 
                                    onClick={handleSend}
                                    disabled={sending || selectedIds.length === 0}
                                    className="w-full h-12 bg-black text-white rounded-xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-black/10"
                                >
                                    {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                    {sending ? "Processing Queue..." : "Dispatch to All Selected"}
                                </button>
                            </div>

                            <AnimatePresence>
                                {status && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className={`mt-6 p-4 rounded-xl flex items-start gap-3 ${
                                            status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                                        }`}
                                    >
                                        {status.type === 'success' ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
                                        <p className="text-[13px] font-medium">{status.message}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right: Candidate List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-tight flex items-center gap-2">
                                    <Users size={14} className="text-zinc-400" />
                                    Registered Candidates
                                </h2>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                                    <input 
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Search by name or email..."
                                        className="h-9 w-64 bg-zinc-50 border border-zinc-200 rounded-lg pl-9 pr-4 text-xs font-medium focus:bg-white outline-none"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-zinc-50/50 text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100">
                                            <th className="px-6 py-4 w-12">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedIds.length === filteredRegistrations.length && filteredRegistrations.length > 0}
                                                    onChange={handleSelectAll}
                                                    className="w-4 h-4 rounded border-zinc-300 accent-black"
                                                />
                                            </th>
                                            <th className="px-6 py-4">Candidate Info</th>
                                            <th className="px-6 py-4">Institution</th>
                                            <th className="px-6 py-4">Payment</th>
                                            <th className="px-6 py-4">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-50">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-20 text-center">
                                                    <Loader2 className="animate-spin mx-auto text-zinc-300" size={32} />
                                                    <p className="text-zinc-400 text-sm mt-4 font-medium">Synchronizing records...</p>
                                                </td>
                                            </tr>
                                        ) : filteredRegistrations.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-20 text-center">
                                                    <p className="text-zinc-400 text-sm font-medium">No candidates found matching your criteria.</p>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredRegistrations.map((reg) => (
                                                <tr key={reg.id} className="hover:bg-zinc-50/50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={selectedIds.includes(reg.id)}
                                                            onChange={() => toggleSelect(reg.id)}
                                                            className="w-4 h-4 rounded border-zinc-300 accent-black"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="text-sm font-bold text-zinc-900">{reg.name}</p>
                                                            <p className="text-[11px] font-medium text-zinc-400">{reg.email}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-[12px] font-medium text-zinc-600">{reg.college}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                                            reg.paymentStatus === 'paid' || reg.paymentStatus === 'success' || reg.paymentStatus === 'verified' 
                                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                                            : 'bg-amber-50 text-amber-600 border-amber-100'
                                                        }`}>
                                                            {reg.paymentStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-[11px] font-medium text-zinc-400">
                                                            {new Date(reg.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
