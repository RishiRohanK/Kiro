"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  AlertCircle, 
  LogOut, 
  CheckCircle, 
  Clock, 
  Settings, 
  ArrowLeftRight, 
  Activity 
} from "lucide-react";
import Navbar from "../../components/home/Navbar";
import Footer from "../../components/home/Footer";

export default function PaymentGatewayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);

  useEffect(() => {
    setActiveTab(pathname);
    if (!localStorage.getItem("pg_admin_token")) {
      router.push("/payment-gateway/login");
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("pg_admin_token");
    router.push("/payment-gateway/login");
  };

  const navItems = [
    { name: "All Transactions", href: "/payment-gateway/dashboard", icon: ArrowLeftRight },
    { name: "Failed Transactions", href: "/payment-gateway/dashboard/failed", icon: AlertCircle },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-[#0055FF]/10">
      <Navbar />
      <div className="flex">
        {}
        <aside className="w-72 fixed left-0 top-[64px] bottom-0 border-r border-zinc-100 bg-white z-40 hidden lg:block">
          <div className="flex flex-col h-full py-8 px-6">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1.5 w-1.5 bg-[#0055FF] rounded-none" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Gateway Admin</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">Console</h2>
            </div>

            <nav className="flex-1 space-y-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 text-[13px] font-bold uppercase tracking-widest transition-all ${
                      isActive 
                        ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200" 
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                    }`}
                  >
                    <item.icon className={`h-4 w-4 ${isActive ? "text-[#0055FF]" : ""}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-8 border-t border-zinc-100 mt-auto pb-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-[13px] font-bold uppercase tracking-widest text-red-600 transition-all hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {}
        <main className="flex-1 lg:ml-72 min-h-[calc(100vh-64px)] overflow-x-hidden">
          <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
