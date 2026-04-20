"use client";

import { AlertCircle, Terminal, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function MaintenanceBanner() {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full bg-[#00A36C] text-white py-3 px-6 flex flex-col md:flex-row items-center justify-center gap-3 text-center sticky top-0 z-[100]"
        >
            <div className="flex items-center gap-2 text-[13px] font-bold">
                <CheckCircle2 size={18} />
                <span>Status Update: All systems are operational</span>
                <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest">PATCH V3.0.41 VERIFIED</span>
            </div>
            <div className="hidden md:block w-px h-3 bg-white/40" />
            <p className="text-[12px] font-medium">
                The technical incident has been resolved and all services are stable.
            </p>
            <Link 
                href="/admin/logs" 
                className="text-[12px] font-bold underline underline-offset-4 hover:opacity-80 transition-opacity ml-2"
            >
                View system logs
            </Link>
        </motion.div>
    );
}
