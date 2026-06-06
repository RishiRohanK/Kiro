"use client";

import React from "react";
import { Home, User, FileText, HelpCircle } from "lucide-react";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  const tabs = [
    { title: "Home", icon: Home, href: "/" },
    { title: "Intern Portal", icon: User, href: "/intern/signin" },
    { type: "separator" as const },
    { title: "Courses", icon: FileText, href: "/courses" },
    { title: "Support", icon: HelpCircle, href: "https://www.redlix.co.in/intern-support" },
  ];

  const handleTabChange = (index: number | null) => {
    if (index !== null) {
      const tab = tabs[index];
      if (tab && "href" in tab && tab.href) {
        if (tab.href.startsWith("http")) {
          window.location.href = tab.href;
        } else {
          router.push(tab.href);
        }
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-zinc-950 p-4 md:p-6 flex items-center justify-center font-sans">
      {/* Floating Hero Background Container with Rounded Edges and Border */}
      <div className="relative w-full h-full bg-zinc-900/50 border border-white/10 rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl">
        {/* Background Image with Gradient Mask */}
        <div
          className="absolute inset-0 z-0 bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/a72ca2f3-9dd1-4fe4-84ba-fe86468a5237_3840w.webp?w=800&q=80)] bg-cover bg-center opacity-40"
          style={{
            maskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
            WebkitMaskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
          }}
        />

        {/* Floating Navbar */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
          <ExpandableTabs
            tabs={tabs as any}
            onChange={handleTabChange}
            activeColor="text-blue-400"
            className="border-white/10 bg-zinc-900/80 backdrop-blur-md text-white shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
