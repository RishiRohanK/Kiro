"use client";

import { useEffect, useState } from "react";
import { User, Mail, Shield, ChevronRight, Lock, Bell } from "lucide-react";
import { motion } from "framer-motion";

export default function InternSettings() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("intern_user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    if (!user) return null;

    return (
        <div className="p-4 lg:p-12 max-w-4xl mx-auto space-y-10 pb-24 lg:pb-12">
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900">Settings</h1>
                <p className="text-zinc-500 text-[11px] lg:text-sm mt-1">Manage your account preferences and security.</p>
            </div>

            {/* Profile Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
                    <User size={16} className="text-[#0055FF]" />
                    <h2 className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">Profile Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-2xl space-y-1">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Full Name</p>
                        <p className="text-sm font-bold text-zinc-900">{user.name}</p>
                    </div>
                    <div className="p-6 bg-zinc-50 border border-zinc-100 rounded-2xl space-y-1">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email Address</p>
                        <p className="text-sm font-bold text-zinc-900">{user.email}</p>
                    </div>
                </div>
            </section>

            {/* Security Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
                    <Shield size={16} className="text-[#0055FF]" />
                    <h2 className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">Security</h2>
                </div>

                <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm">
                    <button className="w-full p-6 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500">
                                <Lock size={18} />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-zinc-900">Change Password</p>
                                <p className="text-xs text-zinc-500">Update your account access key</p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-zinc-300" />
                    </button>
                </div>
            </section>

            {/* Preferences Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
                    <Bell size={16} className="text-[#0055FF]" />
                    <h2 className="text-[12px] font-bold uppercase tracking-widest text-zinc-400">Preferences</h2>
                </div>

                <div className="bg-white border border-zinc-100 rounded-2xl p-6">
                   <div className="flex items-center justify-between">
                      <div>
                         <p className="text-sm font-bold text-zinc-900">Email Notifications</p>
                         <p className="text-xs text-zinc-500">Receive assignment updates via email</p>
                      </div>
                      <div className="h-6 w-11 bg-zinc-200 rounded-full relative p-1 cursor-pointer">
                         <div className="h-4 w-4 bg-white rounded-full translate-x-5 shadow-sm" />
                      </div>
                   </div>
                </div>
            </section>
        </div>
    );
}
