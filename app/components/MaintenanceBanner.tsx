"use client";

import { AlertCircle, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function MaintenanceBanner() {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full bg-[#FF0000] text-white py-3 px-6 flex flex-col md:flex-row items-center justify-center gap-3 text-center sticky top-0 z-[100]"
        >
            <div className="flex items-center gap-2 text-[13px] font-bold">
                <AlertCircle size={16} />
                <span>Critical: Systems have crashed</span>
            </div>
            <div className="hidden md:block w-px h-3 bg-white/40" />
            <p className="text-[13px] font-semibold">
                Major technical failure detected. All authentication flows are currently offline.
            </p>
            <Link 
                href="/admin/logs" 
                className="text-[12px] font-bold underline underline-offset-4 hover:opacity-80 transition-opacity ml-2"
            >
                View technical logs
            </Link>
        </motion.div>
    );
}
