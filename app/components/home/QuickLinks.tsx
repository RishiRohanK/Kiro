import Link from "next/link";
import { ArrowRight } from "lucide-react";

const links = [
  { label: "Certifications", href: "/certifications" },
  { label: "DSA mastery", href: "/dsa" },
  { label: "Innovation ideas", href: "/ideas" },
  { label: "Technical roadmaps", href: "/roadmaps" },
];

export default function QuickLinks() {
  return (
    <section className="w-full bg-black border-b border-zinc-800">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="flex items-center justify-between h-12 overflow-x-auto scrollbar-hide">

          {}
          <span className="shrink-0 text-[11px] font-bold text-zinc-500 pr-6 border-r border-zinc-800">
            Quick links
          </span>

          {}
          <div className="flex items-center divide-x divide-zinc-800 flex-1">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group flex items-center gap-1.5 px-5 h-12 text-[13px] font-medium text-zinc-400 hover:text-white transition-colors duration-150 whitespace-nowrap"
              >
                {link.label}
                <ArrowRight className="h-3 w-3 opacity-30 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150" />
              </Link>
            ))}
          </div>

          {}
          <Link
            href="/courses"
            className="shrink-0 hidden sm:flex items-center gap-1.5 text-[12px] text-zinc-500 hover:text-white font-medium transition-colors pl-6 border-l border-zinc-800 h-12"
          >
            Explore all hubs
            <ArrowRight className="h-3 w-3" />
          </Link>

        </div>
      </div>
    </section>
  );
}
