"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HelpCircle, X, ShieldCheck, 
  ChevronRight, Info, Menu
} from "lucide-react";
import FloatingLines from "@/components/ui/FloatingLines";

interface PortalOption {
  title: string;
  description: string;
  icon: any;
  href: string;
  status: "Active" | "Maintenance";
  delay: number;
}

const options: PortalOption[] = [
  {
    title: "Internship Workspace",
    description: "Access your daily training modules, track curricula progress, and manage your technical assignments.",
    icon: ShieldCheck,
    href: "/intern/signin",
    status: "Active",
    delay: 0.1
  },
  {
    title: "Course Catalog",
    description: "Explore our full range of industry-vetted courses, from MERN stack development to systems architecture.",
    icon: ShieldCheck,
    href: "/courses",
    status: "Active",
    delay: 0.2
  }
];

export default function LandingPage() {
  const [showGuide, setShowGuide] = useState(false);
  const [showCookies, setShowCookies] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("sf_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setShowCookies(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-900 font-sans flex flex-col overflow-hidden selection:bg-blue-100 relative">
      
      {/* Animated Background Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none">
        <FloatingLines 
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[4, 5, 6]}
          lineDistance={[6, 5, 4]}
          bendRadius={5.0}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
          linesGradient={['#3B82F6', '#2563EB', '#1E40AF']}
          mixBlendMode="multiply"
        />
      </div>

      {/* Main Navbar */}
      <nav className="flex-none bg-white border-b border-slate-200 px-4 md:px-10 py-4 flex items-center justify-between relative z-30">
        <div className="flex items-center gap-3 md:gap-6">
          <Link href="/" className="flex items-center group">
            <img src="https://ik.imagekit.io/dypkhqxip/sflogo" alt="Student Forge" className="h-7 md:h-8 w-auto group-hover:scale-105 transition-transform" />
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button 
            onClick={() => setShowGuide(true)}
            className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-50 text-[12px] md:text-[13px] font-medium text-slate-600 hover:bg-slate-100 rounded-none transition-all border border-slate-100"
          >
            <HelpCircle size={15} /> <span>Help Guide</span>
          </button>
          
          <Link href="https://www.redlix.co.in/intern-support" className="hidden sm:flex px-4 md:px-5 py-2 bg-blue-600 text-white text-[12px] md:text-[13px] font-medium rounded-none hover:bg-blue-700 transition-all shadow-sm">
            Support
          </Link>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex md:hidden items-center justify-center p-2 text-slate-600 bg-slate-50 border border-slate-100 hover:bg-slate-100"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Sub-Navbar (Platform Menu) */}
      <div className="flex-none bg-slate-100 border-b border-slate-200 px-4 md:px-10 relative z-20">
        {/* Desktop View */}
        <div className="hidden md:flex max-w-7xl mx-auto items-center gap-8 py-2 overflow-x-auto no-scrollbar scroll-smooth">
          <Link href="/" className="subnav-link text-blue-600 border-b-2 border-blue-600">Home</Link>
          <Link href="/intern/signin" className="subnav-link">Intern Portal</Link>
          <Link href="/courses" className="subnav-link">Courses</Link>
          <Link href="/bootcamp" className="subnav-link">Bootcamp</Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden fixed inset-0 top-[73px] z-[40] bg-white/95 backdrop-blur-md flex flex-col p-6"
          >
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-2">Navigation</span>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/" className="mob-link-v2 active">Home</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/intern/signin" className="mob-link-v2">Intern Portal</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/courses" className="mob-link-v2">Courses</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/bootcamp" className="mob-link-v2">Bootcamp</Link>
            </div>
            
            <div className="mt-auto pt-8 border-t border-slate-100 flex flex-col gap-3">
               <button 
                 onClick={() => { setShowGuide(true); setIsMobileMenuOpen(false); }} 
                 className="flex items-center justify-between w-full p-4 bg-slate-50 text-slate-700 text-[13px] font-medium border border-slate-200"
               >
                 <span>Help Guide</span>
                 <HelpCircle size={16} className="text-slate-400" />
               </button>
               <Link 
                 href="https://www.redlix.co.in/intern-support" 
                 onClick={() => setIsMobileMenuOpen(false)}
                 className="flex items-center justify-center w-full p-4 bg-blue-600 text-white text-[13px] font-bold uppercase tracking-wider"
               >
                 Technical Support
               </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .subnav-link {
          @apply text-[12px] font-medium text-slate-500 hover:text-slate-900 py-2 transition-all whitespace-nowrap;
        }
        .mob-link-v2 {
          @apply px-4 py-3.5 text-[15px] font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all border-b border-slate-50 flex items-center;
        }
        .mob-link-v2.active {
          @apply text-blue-600 font-bold bg-blue-50/50;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-start justify-center p-6 md:p-8 md:px-20 relative z-10 overflow-y-auto">
        <div className="w-full max-w-4xl space-y-8 md:space-y-10 py-6">
          
          {/* Left-Aligned Heading & Tag */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-left space-y-4"
          >
            <div className="flex justify-start">
              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-bold uppercase tracking-[0.2em] border border-blue-100">
                Official Access Point
              </span>
            </div>
            
            <div className="space-y-3">
              <h1 className="text-2xl md:text-4xl font-medium text-slate-900 tracking-tight leading-tight">
                Welcome to the <span className="text-blue-600">Student Forge Platform</span>
              </h1>
              <p className="text-slate-500 text-[14px] md:text-[16px] max-w-lg font-medium leading-relaxed">
                Choose your workspace portal below to start your professional journey.
              </p>
            </div>
          </motion.div>

          {/* Portal Selection Grid */}
          <div className="grid gap-4 w-full">
            {options.map((option) => (
              <PortalCard key={option.title} option={option} />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex-none bg-white border-t border-slate-200 px-6 md:px-20 py-6 relative z-30">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div>
              <p className="text-[12px] text-slate-500 font-medium">
                © {new Date().getFullYear()} Student Forge Technologies Pvt Ltd.
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Powered by Cheetah Servers • Redlix Systems, Hyderabad
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-[11px] font-medium text-slate-500 hover:text-slate-900">Privacy Policy</Link>
            <Link href="/terms" className="text-[11px] font-medium text-slate-500 hover:text-slate-900">Terms of Use</Link>
            <Link href="/security" className="text-[11px] font-medium text-slate-500 hover:text-slate-900">Security</Link>
          </div>
        </div>
      </footer>

      {/* Help Modal */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white max-w-md w-full p-8 shadow-xl rounded-none relative"
            >
              <button onClick={() => setShowGuide(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
              <div className="space-y-6">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-none border border-blue-100 flex items-center justify-center">
                  <Info size={24} />
                </div>
                <h2 className="text-xl font-medium text-slate-900 tracking-tight">How to use the platform</h2>
                <div className="space-y-4 text-[14px] text-slate-600 leading-relaxed">
                  <p>• If you are an <span className="font-semibold">intern</span>, please use the Intern Portal to log in and manage your tasks.</p>
                  <p>• Use the <span className="font-semibold">Explore Courses</span> portal to browse through our current training programs and materials.</p>
                </div>
                <button
                  onClick={() => setShowGuide(false)}
                  className="w-full py-3 bg-blue-600 text-white text-[14px] font-medium rounded-none hover:bg-blue-700 transition-colors"
                >
                  Close Guide
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showCookies && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-[100] bg-blue-600 text-white shadow-2xl"
          >
            <div className="max-w-7xl mx-auto px-8 py-10 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-3 font-medium">
                  <ShieldCheck size={22} className="text-blue-100" />
                  <span className="text-lg tracking-tight">Privacy & Security Control</span>
                </div>

                <div className="space-y-4 text-[14px] text-blue-50 leading-relaxed max-w-4xl">
                  <p>
                    We use essential cookies to make our platform work correctly. These cookies are necessary for logging in,
                    staying secure, and ensuring your data is handled safely while you use the hub.
                  </p>
                  <p>
                    We also use analytics to understand how our visitors interact with the site. This helps us improve our
                    services and provide you with a smoother, more helpful experience every time you return.
                  </p>
                  <p>
                    By clicking accept, you agree to our use of these tools for functionality and performance. You can read more
                    about how we protect your data in our privacy policy link found in the footer.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={() => {
                    localStorage.setItem("sf_cookie_consent", "true");
                    setShowCookies(false);
                  }}
                  className="w-full sm:w-auto px-12 py-3 bg-white text-blue-600 text-[13px] font-semibold rounded-none hover:bg-blue-50 transition-all active:scale-[0.98]"
                >
                  Accept and Continue
                </button>
                <button
                  onClick={() => setShowCookies(false)}
                  className="w-full sm:w-auto px-10 py-3 border border-white/30 text-white text-[13px] font-semibold rounded-none hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <X size={16} /> Decline
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PortalCard({ option }: { option: PortalOption }) {
  const isMaintenance = option.status === "Maintenance";
  const Icon = option.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: option.delay }}
    >
      <div className={`bg-white border border-slate-200 p-5 rounded-none flex flex-col md:flex-row items-center gap-6 transition-all ${!isMaintenance ? 'hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5' : 'opacity-70'}`}>
        <div className={`w-12 h-12 rounded-none flex items-center justify-center shrink-0 border ${isMaintenance ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
          <Icon size={24} />
        </div>

        <div className="flex-1 text-center md:text-left space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <h3 className="text-[17px] font-medium text-slate-900 tracking-tight">{option.title}</h3>
            {isMaintenance && (
              <span className="text-[9px] font-bold bg-slate-100 text-slate-400 px-2 py-0.5 rounded-none border border-slate-200 uppercase tracking-widest">
                Updating
              </span>
            )}
          </div>
          <p className="text-[13px] text-slate-500 leading-relaxed max-w-xl">
            {option.description}
          </p>
        </div>

        <div className="shrink-0 w-full md:w-auto">
          {isMaintenance ? (
            <div className="w-full md:w-32 py-2.5 text-center text-[11px] font-bold text-slate-300 bg-slate-50 rounded-none border border-slate-100 uppercase tracking-widest">
              Disabled
            </div>
          ) : (
            <Link
              href={option.href}
              className="w-full md:w-40 py-3 bg-blue-600 text-white text-[13px] font-semibold rounded-none flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-md active:scale-[0.98]"
            >
              Enter Portal <ChevronRight size={16} />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
