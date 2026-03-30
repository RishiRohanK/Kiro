import Link from "next/link";
import { CircleUser, ArrowRight } from "lucide-react";

export default function Navbar() {
  const navLinks = [
    { name: "Courses", href: "/courses" },
    { name: "Docs", href: "/docs" },
    { name: "Support", href: "/support" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/95 backdrop-blur-md">
      {/* Height kept strictly at h-16 */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-10">

        {/* Left Side: Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-4 group">
            {/* Logo increased to h-11 (44px) - fits perfectly in h-16 bar */}
            <img
              src="/sf-next-logo.png"
              alt="Student Forge Logo"
              className="h-11 w-11 object-contain transition-transform duration-300 group-hover:scale-105"
            />

            {/* Text Group: Side-by-Side */}
            <div className="flex items-center gap-3">
              <span className="text-[18px] font-bold tracking-tight text-zinc-900 whitespace-nowrap">
                Student Forge
              </span>

              {/* Vertical Divider */}
              <div className="h-4 w-[1.5px] bg-zinc-200" />

              {/* "Academy" in Blue */}
              <span className="text-[14px] font-semibold text-blue-600 tracking-tight ">
                Academy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3 py-1.5 text-[14px] text-zinc-500 transition-all duration-200 hover:text-black hover:bg-zinc-50 rounded-md font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3">

          {/* Intern Portal */}
          <Link
            href="/intern/signin"
            className="hidden md:flex h-10 items-center gap-2 bg-[#0055FF] px-4 text-[13px] text-white transition-all duration-200 hover:bg-blue-700 active:scale-[0.98] font-semibold rounded-sm"
          >
            <CircleUser className="h-4 w-4 text-white/90" />
            Intern Portal
          </Link>

          {/* Get Started */}
          <Link
            href="/get-started"
            className="group inline-flex h-10 items-center justify-center bg-black px-6 text-[13px] text-white transition-all duration-200 hover:bg-zinc-800 active:scale-[0.98] font-semibold"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>

        </div>
      </div>
    </nav>
  );
}