import Link from "next/link";
import { ArrowRight } from "lucide-react";

const contentCards = [
  {
    title: "Certification",
    description: "Get industry-recognized certificates for your career.",
    href: "/certifications",
    color: "bg-blue-50 text-blue-600 border-blue-100/50 hover:bg-blue-100/80 hover:border-blue-200 hover:shadow-md hover:shadow-blue-200/20",
  },
  {
    title: "DSA",
    description: "Master algorithms and data structures through modules.",
    href: "/dsa",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100/50 hover:bg-emerald-100/80 hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-200/20",
  },
  {
    title: "Events",
    description: "Engage in hackathons, workshops, and community events.",
    href: "/events",
    color: "bg-violet-50 text-violet-600 border-violet-100/50 hover:bg-violet-100/80 hover:border-violet-200 hover:shadow-md hover:shadow-violet-200/20",
  },
  {
    title: "Ideas",
    description: "Collaborate on ideas within our student ecosystem.",
    href: "/ideas",
    color: "bg-pink-50 text-pink-600 border-pink-100/50 hover:bg-pink-100/80 hover:border-pink-200 hover:shadow-md hover:shadow-pink-200/20",
  },
  {
    title: "Roadmaps",
    description: "Follow curated paths to reach your skill goals quickly.",
    href: "/roadmaps",
    color: "bg-orange-50 text-orange-600 border-orange-100/50 hover:bg-orange-100/80 hover:border-orange-200 hover:shadow-md hover:shadow-orange-200/20",
  },
  {
    title: "Internships",
    description: "Apply for real-world internship opportunities.",
    href: "/internships",
    color: "bg-amber-50 text-amber-600 border-amber-100/50 hover:bg-amber-100/80 hover:border-amber-200 hover:shadow-md hover:shadow-amber-200/20",
  },
  {
    title: "Tools",
    description: "Access essential tools built specifically for students.",
    href: "/tools",
    color: "bg-cyan-50 text-cyan-600 border-cyan-100/50 hover:bg-cyan-100/80 hover:border-cyan-200 hover:shadow-md hover:shadow-cyan-200/20",
  },
];

export default function ContentExplorer() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        
        {}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex h-6 items-center border border-zinc-200 bg-zinc-50 px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.15em]">
              Explore Platform
            </div>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-zinc-900 leading-tight">
              Curated <span className="text-blue-600">Content Hub.</span>
            </h2>
          </div>
          <p className="max-w-md text-[14px] text-zinc-400 leading-relaxed">
            Everything you need for skill-building, real projects, and career transitions in one centralized hub.
          </p>
        </div>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contentCards.map((card) => {
            return (
              <Link 
                key={card.title} 
                href={card.href}
                className={`group flex flex-col p-8 border transition-all duration-300 h-full ${card.color} rounded-none border-t-2`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold tracking-tight text-zinc-900">
                    {card.title}
                  </h3>
                  <ArrowRight size={16} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>

                <p className="text-[14px] text-zinc-500 leading-relaxed pr-2">
                  {card.description}
                </p>

                {}
                <div className="mt-8 h-[1px] w-full bg-current opacity-10" />
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
