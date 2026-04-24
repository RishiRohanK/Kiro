"use client";

import { useEffect, useState } from "react";
import { Download, Share, PlusSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function PWAInstallButton() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    // Only proceed if we are on the CLEED login page
    if (pathname !== "/cleed/login") {
      setIsVisible(false);
      setShowIOSPrompt(false);
      return;
    }
    
    const isIOSDevice = 
      /iPad|iPhone|iPod/.test(navigator.userAgent) || 
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
        return;
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    if (isIOSDevice && !isStandalone) {
      setTimeout(() => setShowIOSPrompt(true), 3000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, [pathname]);

  if (pathname !== "/cleed/login") return null;

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && !isIOS && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center"
          >
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-2 px-6 py-2 bg-white text-zinc-950 hover:bg-zinc-100 transition-all duration-300 text-[13px] font-medium rounded-none shadow-sm whitespace-nowrap"
            >
              <Download size={14} />
              <span>Install App</span>
            </button>
          </motion.div>
        )}

        {showIOSPrompt && isIOS && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-4 md:right-8 z-[100] w-[calc(100vw-32px)] md:w-80"
          >
            <div className="bg-white border border-zinc-200 p-4 shadow-2xl relative">
              <button 
                onClick={() => setShowIOSPrompt(false)}
                className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-black"
              >
                <X size={14} />
              </button>
              
              <div className="flex items-start gap-4 pr-6">
                <div className="bg-zinc-900 p-2 text-white shrink-0">
                    <Download size={16} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-[11px] text-zinc-900">Install Dashboard</h3>
                  <p className="text-[10px] text-zinc-500 leading-tight font-medium">
                    Tap <Share size={12} className="inline mx-0.5 text-zinc-900" /> then <PlusSquare size={12} className="inline mx-0.5 text-zinc-900" /> <span className="font-bold text-black text-[11px]">"Add to Home Screen"</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
