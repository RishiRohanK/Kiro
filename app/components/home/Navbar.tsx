"use client";

import Link from "next/link";
import { CircleUser, ArrowRight, Menu, X, Globe, MessageSquare, Zap, Layout } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navLinks = [
    { name: "Courses", href: "/courses", icon: Globe },
    { name: "Support", href: "/support", icon: MessageSquare },
  ];

  return (
    <>
      <nav className="sticky top-0 z-[100] w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md">
        { }
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">

          { }
          <div className="flex items-center gap-4 lg:gap-8">
            <Link href="/" className="flex items-center gap-2 sm:gap-4 transition-opacity hover:opacity-80">
              { }
              <img
                src="https://ik.imagekit.io/dypkhqxip/sflogo"
                alt="Student Forge Logo"
                className="h-6 sm:h-8 w-auto object-contain"
              />

              { }
              <div className="h-4 sm:h-5 w-[1px] bg-zinc-200" />

              { }
              <img
                src="https://ik.imagekit.io/dypkhqxip/platform?updatedAt=1776791557303"
                alt="Platform Logo"
                className="h-5 sm:h-7 w-auto object-contain"
              />
            </Link>

            { }
            <div className="hidden items-center gap-1 md:flex xl:gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-3 py-1 text-[13px] font-medium text-zinc-500 transition-colors hover:text-black"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          { }
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-3 md:flex">
              {/* Get Started Button */}
              <Link
                href="/get-started"
                className="group flex h-8 items-center bg-black px-5 text-[12px] font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] rounded-none"
              >
                Get started
                <ArrowRight className="ml-2 h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              {/* Intern Login Button */}
              <Link
                href="/intern/signin"
                className="flex h-8 items-center gap-2 border border-zinc-300 bg-white px-4 text-[12px] font-semibold text-zinc-700 transition-all hover:border-zinc-800 hover:text-black active:bg-zinc-50 rounded-none shadow-sm"
              >
                <CircleUser className="h-3.5 w-3.5" />
                Intern Login
              </Link>
            </div>

            { }
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-9 w-9 items-center justify-center border border-zinc-200 bg-zinc-50 text-black transition-colors hover:bg-zinc-100 md:hidden"
              aria-label="Toggle Navigation"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        { }
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-0 top-14 z-[99] md:hidden overflow-y-auto"
            >
              { }
              <div className="absolute inset-0 bg-white/98 backdrop-blur-xl" />

              { }
              <div className="relative flex min-h-[calc(100vh-3.5rem)] flex-col p-6">
                { }
                <div className="space-y-1 mb-8">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4 px-2">Navigation</p>
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center gap-4 py-4 px-3 text-sm font-bold text-zinc-900 border-b border-zinc-100/50 hover:bg-zinc-50 transition-all"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-zinc-50 text-zinc-500 group-hover:bg-black group-hover:text-white transition-all duration-300">
                          <link.icon className="h-4 w-4" />
                        </div>
                        <span className="uppercase tracking-tight text-[11px] font-bold">{link.name}</span>
                        <ArrowRight className="ml-auto h-3 w-3 text-zinc-300 transform translate-x-1 group-hover:translate-x-0 transition-all opacity-0 group-hover:opacity-100" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                { }
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-auto space-y-3 pb-8"
                >
                  <div className="h-[1px] w-full bg-zinc-100 mb-6" />
                  <Link
                    href="/intern/signin"
                    onClick={() => setIsOpen(false)}
                    className="flex h-14 w-full items-center justify-center gap-3 border border-zinc-200 bg-white text-base font-bold text-zinc-700 shadow-sm active:bg-zinc-50 rounded-none"
                  >
                    <CircleUser className="h-5 w-5" />
                    Intern Login
                  </Link>

                  <Link
                    href="/get-started"
                    onClick={() => setIsOpen(false)}
                    className="flex h-14 w-full items-center justify-center gap-3 bg-black text-base font-bold text-white shadow-lg shadow-black/10 active:scale-[0.98] rounded-none"
                  >
                    Get Started Now
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </motion.div>

                { }
                <div className="mb-4 text-center">
                  <span className="text-[11px] font-medium text-zinc-400">© 2026 Student Forge. Forge Your Future.</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}