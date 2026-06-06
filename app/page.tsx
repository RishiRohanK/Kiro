"use client";

import React from "react";
import { 
  Home, User, FileText, HelpCircle, ArrowRight,
  CodeIcon, UserPlusIcon,
  Shield, Handshake, MenuIcon, XIcon,
  ShieldCheck, Award, Map, Settings
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuLink,
  type NavItemType,
  NavGridCard,
  NavSmallItem,
  NavLargeItem,
  NavItemMobile,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BadgeTag from "@/components/ui/badge-tag";

// --- NAVIGATION LINKS ---
const workspaceLinks: NavItemType[] = [
  {
    title: "Intern Workspace",
    href: "/intern/signin",
    description: "Access daily curricula and manage assignments",
    icon: ShieldCheck,
  },
  {
    title: "Ambassador Portal",
    href: "/ambassador",
    description: "Join our campus leadership initiative",
    icon: UserPlusIcon,
  },
  {
    title: "Admin Dashboard",
    href: "/admin",
    description: "Access system metrics and user roles",
    icon: Settings,
  },
  {
    title: "Certifications",
    href: "/certifications",
    icon: Award,
  },
  {
    title: "Hiring Portal",
    href: "/hiring",
    icon: Handshake,
  },
  {
    title: "Bootcamp",
    href: "/bootcamp",
    icon: CodeIcon,
  },
];

const learningLinks: NavItemType[] = [
  {
    title: "Course Catalog",
    href: "/courses",
    description: "Explore industry-vetted tech training",
    icon: FileText,
  },
  {
    title: "Technical Roadmaps",
    href: "/roadmaps",
    description: "Interactive tech stack learning paths",
    icon: Map,
  },
  {
    title: "DSA Curriculum",
    href: "/dsa",
    description: "Structured data structures & algorithms",
    icon: CodeIcon,
  },
  {
    title: "Help Center",
    href: "https://www.redlix.co.in/intern-support",
    icon: HelpCircle,
  },
  {
    title: "Privacy Policy",
    href: "/privacy",
    icon: Shield,
  },
  {
    title: "Terms of Service",
    href: "/terms",
    icon: FileText,
  },
];

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="relative w-full h-screen bg-zinc-950 p-4 md:p-6 flex items-center justify-center font-sans">
      {/* Floating Hero Background Container with Rounded Edges and Border */}
      <div className="relative w-full h-full bg-zinc-900/50 border border-white/10 rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl flex flex-col justify-center items-start px-8 sm:px-16 md:px-24">
        {/* Background Image with Gradient Mask */}
        <div
          className="absolute inset-0 z-0 bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/a72ca2f3-9dd1-4fe4-84ba-fe86468a5237_3840w.webp?w=800&q=80)] bg-cover bg-center opacity-40"
          style={{
            maskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
            WebkitMaskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
          }}
        />

        {/* Floating Navbar Container inside Hero wrapper */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[320px] sm:max-w-[360px] md:max-w-[540px] lg:max-w-[850px] z-50 flex items-center justify-between border border-white/5 bg-zinc-900/40 backdrop-blur-md px-4 py-2 rounded-xl">
          <div className="flex items-center gap-3">
            <img 
              src="https://ik.imagekit.io/dypkhqxip/platform?updatedAt=1776791557303" 
              alt="Logo" 
              className="h-6 sm:h-[26px] w-auto brightness-0 invert opacity-80 hover:opacity-100 transition-opacity" 
            />
            <div className="hidden lg:block h-4 w-[1px] bg-white/15 mx-1" />
            <DesktopMenu />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/intern/signin")}
              className="bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-medium px-4 py-1.5 rounded-lg transition-all active:scale-[0.98] cursor-pointer"
            >
              Get Started
            </button>
            <MobileNav />
          </div>
        </div>

        {/* Left-Aligned Hero Content Block */}
        <div className="relative z-10 max-w-2xl text-left space-y-6 flex flex-col items-start justify-center pt-12">
          {/* Badge Tag */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            <BadgeTag />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-white leading-tight"
          >
            A Workspace for <br />
            <span className="bg-gradient-to-r from-white via-white to-amber-300 bg-clip-text text-transparent">
              Next-Gen Engineers
            </span>
          </motion.h1>

          {/* Subtitle Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm sm:text-base text-zinc-400 max-w-lg leading-relaxed font-normal"
          >
            Access your daily internship tasks, track learning curricula, and discover industry-vetted engineering courses in one unified space.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-3.5 pt-2"
          >
            <button
              onClick={() => router.push("/intern/signin")}
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white px-7 py-3 text-xs font-medium text-zinc-950 transition-all hover:scale-[1.02] hover:bg-zinc-200 active:scale-[0.98] cursor-pointer"
            >
              Intern Portal
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => router.push("/courses")}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-7 py-3 text-xs font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/25 active:scale-[0.98] cursor-pointer"
            >
              Explore Courses
            </button>
          </motion.div>
        </div>

        {/* Developed and maintained by Studio Redlix */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-[11px] font-medium text-zinc-500 tracking-wider whitespace-nowrap">
          Developed and maintained by{" "}
          <a 
            href="https://www.redlix.co.in" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="underline hover:text-white transition-colors"
          >
            Studio Redlix
          </a>
        </div>
      </div>
    </div>
  );
}

function DesktopMenu() {
  return (
    <NavigationMenu className="hidden lg:block text-white">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-zinc-300 hover:text-white bg-transparent px-4 py-2 hover:bg-white/5 data-[state=open]:bg-white/5 rounded-md transition-colors">
            Workspace
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-full md:w-3xl md:grid-cols-[1fr_.40fr] bg-zinc-950 border border-white/10 text-white rounded-lg overflow-hidden shadow-2xl">
              <ul className="grid grow gap-4 p-4 md:grid-cols-2 md:border-r border-white/5">
                {workspaceLinks.slice(0, 3).map((link) => (
                  <li key={link.title}>
                    <NavGridCard link={link} className="bg-zinc-900 border-white/5 hover:bg-zinc-800 transition-colors" />
                  </li>
                ))}
              </ul>
              <ul className="space-y-1 p-4 bg-zinc-900/40">
                {workspaceLinks.slice(3).map((link) => (
                  <li key={link.title}>
                    <NavSmallItem
                      item={link}
                      href={link.href}
                      className="gap-x-1 text-zinc-300 hover:text-white hover:bg-zinc-800/60"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-zinc-300 hover:text-white bg-transparent px-4 py-2 hover:bg-white/5 data-[state=open]:bg-white/5 rounded-md transition-colors">
            Learning
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-full md:w-3xl md:grid-cols-[1fr_.40fr] bg-zinc-950 border border-white/10 text-white rounded-lg overflow-hidden shadow-2xl">
              <ul className="grid grow gap-4 p-4 md:grid-cols-2 md:border-r border-white/5">
                {learningLinks.slice(0, 3).map((link) => (
                  <li key={link.title}>
                    <NavGridCard link={link} className="bg-zinc-900 border-white/5 hover:bg-zinc-800 transition-colors" />
                  </li>
                ))}
              </ul>
              <ul className="space-y-1 p-4 bg-zinc-900/40">
                {learningLinks.slice(3).map((link) => (
                  <li key={link.title}>
                    <NavLargeItem
                      link={link}
                      href={link.href}
                      className="text-zinc-300 hover:text-white border-white/5 bg-zinc-900/60 hover:bg-zinc-800/80"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink href="https://www.redlix.co.in/intern-support" className="cursor-pointer text-zinc-300 hover:text-white text-sm font-medium px-4 py-2 hover:bg-white/5 rounded-md transition-colors">
            Support
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileNav() {
  const sections = [
    {
      id: "workspace",
      name: "Workspace",
      list: workspaceLinks,
    },
    {
      id: "learning",
      name: "Learning",
      list: learningLinks,
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" className="rounded-full text-zinc-300 hover:text-white hover:bg-white/5 lg:hidden">
          <MenuIcon className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-zinc-950/95 border-l border-white/10 text-white w-full gap-0 backdrop-blur-lg"
        showClose={false}
      >
        <div className="flex h-14 items-center justify-end border-b border-white/10 px-4">
          <SheetClose asChild>
            <Button size="icon" variant="ghost" className="rounded-full text-zinc-300 hover:text-white hover:bg-white/5">
              <XIcon className="size-5" />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
        </div>
        <div className="container grid gap-y-2 overflow-y-auto px-4 pt-5 pb-12">
          <Accordion type="single" collapsible className="w-full">
            {sections.map((section) => (
              <AccordionItem key={section.id} value={section.id} className="border-white/5">
                <AccordionTrigger className="capitalize text-zinc-200 hover:text-white hover:no-underline font-medium">
                  {section.name}
                </AccordionTrigger>
                <AccordionContent className="space-y-1">
                  <ul className="grid gap-1">
                    {section.list.map((link) => (
                      <li key={link.title}>
                        <SheetClose asChild>
                          <NavItemMobile 
                            item={link} 
                            href={link.href} 
                            className="text-zinc-300 hover:text-white hover:bg-white/5 border-transparent"
                          />
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}
