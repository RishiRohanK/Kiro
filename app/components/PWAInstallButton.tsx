"use client";

import { useEffect, useState } from "react";
import { Download, Share, PlusSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    
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
  }, []);

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
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-[60]"
          >
            <button
              onClick={handleInstallClick}
              className="group flex items-center gap-3 bg-[#0055FF] text-white px-6 py-4 rounded-none font-bold text-sm shadow-2xl hover:bg-black transition-all active:scale-95"
            >
              <Download size={18} className="animate-bounce" />
              <span>INSTALL DASHBOARD APP</span>
            </button>
          </motion.div>
        )}

        {showIOSPrompt && isIOS && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-6 right-6 z-[60] md:left-auto md:right-6 md:w-80"
          >
            <div className="bg-white border-2 border-black p-6 shadow-2xl relative">
              <button 
                onClick={() => setShowIOSPrompt(false)}
                className="absolute top-2 right-2 p-2 text-zinc-400 hover:text-black"
              >
                <X size={16} />
              </button>
              
              <div className="flex items-start gap-4">
                <div className="bg-[#0055FF] p-2 text-white">
                    <Download size={20} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-sm uppercase tracking-tight">Install Dashboard</h3>
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                    Install this app on your iPhone: tap <Share size={14} className="inline mx-0.5 text-[#0055FF]" /> then <PlusSquare size={14} className="inline mx-0.5 text-[#0055FF]" /> <span className="font-bold text-black">"Add to Home Screen"</span>
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
