import Link from "next/link";
import { CircleUser, ArrowRight } from "lucide-react";

export default function Navbar() {
  const navLinks = [
    { name: "Courses", href: "/courses" },
    { name: "Docs", href: "/docs" },
    { name: "Support", href: "/support" },
    { name: "Events", href: "/events" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
      {/* Container strictly h-14 */}
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">

        {/* Left Side: Logos & Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-4 transition-opacity hover:opacity-80">
            {/* Student Forge Logo */}
            <img
              src="https://ik.imagekit.io/dypkhqxip/sflogo"
              alt="Student Forge Logo"
              className="h-8 w-auto object-contain"
            />

            {/* Sharp Vertical Divider */}
            <div className="h-5 w-[1px] bg-zinc-200" />

            {/* Skill Grid Logo */}
            <img
              src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1774885412/Screenshot_2026-03-30_at_21.13.11-removebg-preview_gaqcdz.png"
              alt="Skill Grid Logo"
              className="h-7 w-auto object-contain"
            />
          </Link>

          {/* Nav Links - Render Style */}
          <div className="hidden items-center gap-2 md:flex">
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

        {/* Right Side: Render-Style Button Layout */}
        <div className="flex items-center gap-3">

          {/* Intern Portal - Sharp Outlined (Render Secondary Style) */}
          <Link
            href="/intern/signin"
            className="hidden h-8 items-center gap-2 border border-zinc-300 bg-white px-4 text-[12px] font-semibold text-zinc-700 transition-all hover:border-zinc-800 hover:text-black active:bg-zinc-50 sm:flex rounded-none"
          >
            <CircleUser className="h-3.5 w-3.5" />
            Intern portal
          </Link>

          {/* Get started - Sharp solid (Render Primary Style) */}
          <Link
            href="/get-started"
            className="group flex h-8 items-center bg-black px-5 text-[12px] font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] rounded-none"
          >
            Get started
            <ArrowRight className="ml-2 h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>

        </div>
      </div>
    </nav>
  );
}