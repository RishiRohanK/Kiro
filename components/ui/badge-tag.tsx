"use client";

import React from "react";

export default function BadgeTag() {
    return (
        <div className="flex items-center space-x-2.5 border border-white/10 rounded-full bg-white/5 p-1 text-sm text-zinc-300">
            <div className="bg-white border border-gray-500/30 rounded-2xl px-3 py-1 text-zinc-950 font-semibold text-xs">
                <p>Version 7.8</p>
            </div>
            <p className="pr-3">New feature is ready to use, let's try</p>
        </div>
    );
}
