"use client";

import { useState, useMemo, useRef } from "react";
import Navbar from "../components/home/Navbar";
import SubNavbar from "../components/home/SubNavbar";
import Footer from "../components/home/Footer";
import { Search, ExternalLink, BookOpen, Globe, Code2, Cpu, Zap, Library, GraduationCap, Box, Star } from "lucide-react";


const resources = [
  { name: "Python Docs", provider: "Python Software Foundation", description: "The definitive guide to Python programming and standard library.", url: "https://docs.python.org/3/", tags: ["Language", "Python"], category: "Programming", rating: 4.9, level: "Fundamental" },
  { name: "MDN JavaScript", provider: "Mozilla", description: "Comprehensive web technical developer guide for JavaScript.", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", tags: ["Language", "JavaScript", "Web"], category: "Programming", rating: 4.8, level: "Core" },
  { name: "React Documentation", provider: "Meta", description: "The library for web and native user interfaces.", url: "https://react.dev/", tags: ["Frontend", "React", "UI"], category: "Frontend", rating: 4.9, level: "Library" },
  { name: "TypeScript Handbook", provider: "Microsoft", description: "Typed JavaScript at any scale documentation.", url: "https://www.typescriptlang.org/docs/", tags: ["Language", "TypeScript"], category: "Programming", rating: 4.7, level: "Advanced" },
  { name: "Node.js Docs", provider: "OpenJS Foundation", description: "Asynchronous event-driven JavaScript runtime guide.", url: "https://nodejs.org/en/docs", tags: ["Backend", "Node.js"], category: "Backend", rating: 4.8, level: "Runtime" },
  { name: "Go Technical Docs", provider: "Google", description: "Cross-platform, open source language for developers.", url: "https://go.dev/doc/", tags: ["Language", "Go"], category: "Programming", rating: 4.7, level: "Core" },
  { name: "Java tutorials", provider: "Oracle", description: "The official Java documentation and structured learning paths.", url: "https://docs.oracle.com/en/java/", tags: ["Language", "Java"], category: "Programming", rating: 4.6, level: "Enterprise" },
  { name: "PostgreSQL Docs", provider: "PostgreSQL Global", description: "The definitive guide to the world's advanced open source database.", url: "https://www.postgresql.org/docs/", tags: ["Database", "SQL"], category: "Database", rating: 4.8, level: "Advanced" },
  { name: "MongoDB Manual", provider: "MongoDB Inc.", description: "Flexible, scalable NoSQL document database documentation.", url: "https://www.mongodb.com/docs/", tags: ["Database", "NoSQL"], category: "Database", rating: 4.7, level: "Modern" },
  { name: "Docker Guides", provider: "Docker", description: "Containerization platform for modern technical engineering.", url: "https://docs.docker.com/", tags: ["DevOps", "Docker", "Containers"], category: "DevOps", rating: 4.9, level: "SysAdmin" },
  { name: "Git Documentation", provider: "Git Project", description: "Distributed version control system technical documentation.", url: "https://git-scm.com/doc", tags: ["DevOps", "Git", "VersionControl"], category: "DevOps", rating: 4.8, level: "Universal" },
  { name: "Next.js Learning", provider: "Vercel", description: "The React framework for the web - Full documentation.", url: "https://nextjs.org/docs", tags: ["Frontend", "Next.js", "React"], category: "Frontend", rating: 4.9, level: "FullStack" },
  { name: "Tailwind CSS", provider: "Tailwind Labs", description: "Utility-first CSS framework for rapid UI development.", url: "https://tailwindcss.com/docs", tags: ["Frontend", "CSS"], category: "Frontend", rating: 4.8, level: "Utility" },
  { name: "Rust Book", provider: "Rust Community", description: "Powerful language for memory safety and high-performance.", url: "https://doc.rust-lang.org/book/", tags: ["Language", "Rust"], category: "Programming", rating: 4.9, level: "Systems" },
  { name: "C++ Reference", provider: "Standard C++", description: "Comprehensive C++ reference and standard library docs.", url: "https://en.cppreference.com/w/", tags: ["Language", "C++"], category: "Programming", rating: 4.6, level: "Legacy" },
  { name: "AWS Documentation", provider: "Amazon", description: "Cloud computing services and technical architecture guides.", url: "https://docs.aws.amazon.com/", tags: ["Cloud", "AWS"], category: "Cloud", rating: 4.8, level: "Infra" },
  { name: "Azure Learn", provider: "Microsoft", description: "Cloud services architectural and implementation documentation.", url: "https://learn.microsoft.com/en-us/azure/", tags: ["Cloud", "Azure"], category: "Cloud", rating: 4.7, level: "Enterprise" },
  { name: "GCP Docs", provider: "Google Cloud", description: "Cloud infrastructure and AI service documentation.", url: "https://cloud.google.com/docs", tags: ["Cloud", "GCP"], category: "Cloud", rating: 4.7, level: "AI Ready" }
];

const categories = ["All", "Programming", "Frontend", "Backend", "Database", "DevOps", "Cloud"];


const resourceLogos: Record<string, string> = {
  "Python Docs": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  "MDN JavaScript": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  "React Documentation": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "TypeScript Handbook": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  "Node.js Docs": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  "Go Technical Docs": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
  "Java tutorials": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  "PostgreSQL Docs": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  "MongoDB Manual": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  "Docker Guides": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  "Git Documentation": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  "Next.js Learning": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  "Tailwind CSS": "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg",
  "Rust Book": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg",
  "C++ Reference": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  "AWS Documentation": "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
  "Azure Learn": "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  "GCP Docs": "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg"
};

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getLogo = (res: any) => {
    if (resourceLogos[res.name]) return resourceLogos[res.name];
    return "https://upload.wikimedia.org/wikipedia/commons/a/ab/Circle-icons-cloud.svg";
  };

  const filteredResources = useMemo(() => {
    return resources.filter(res => {
      const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || res.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100">
      <Navbar />
      <SubNavbar />

      <main>
        {}
        <section className="bg-zinc-900 py-6 md:py-8 border-b border-white/5 overflow-hidden relative text-left">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-blue-600/5 blur-[100px] pointer-events-none" />
          <div className="mx-auto max-w-7xl px-6 relative z-10">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex h-4 items-center px-1.5 border border-white/10 bg-white/5 text-blue-400 text-[9px] font-bold leading-none">
                Knowledge base
              </div>
              <h1 className="text-3xl md:text-4xl font-normal tracking-tighter text-white leading-tight">
                Academic <span className="text-blue-500">Resources</span>.
              </h1>
              <p className="text-zinc-400 text-[14px] font-normal max-w-xl">
                The definitive registry of official documentation and technical guides for high-speed skill acquisition.
              </p>
            </div>
          </div>
        </section>

        {}
        <section className="sticky top-[56px] z-50 bg-white/95 backdrop-blur-md border-b border-zinc-100 py-2 shadow-sm">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-10 pr-4 bg-zinc-50 border border-zinc-200 text-[13px] focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div ref={scrollContainerRef} className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-3.5 h-8 text-[11px] font-semibold transition-all ${selectedCategory === cat
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {}
        <section className="py-6 md:py-8 bg-zinc-50 min-h-[800px]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredResources.map((res, index) => (
                <div
                  key={index}
                  className="group flex flex-col bg-white border border-zinc-200 hover:border-blue-600 transition-all duration-200 p-5 rounded-none"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-10 w-10 flex items-center justify-center transition-all">
                      <img
                        src={getLogo(res)}
                        alt={res.provider}
                        className="h-full w-full object-contain transition-all"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://upload.wikimedia.org/wikipedia/commons/a/ab/Circle-icons-cloud.svg"; }}
                      />
                    </div>
                    <div className="flex items-center gap-1 text-zinc-400">
                      <Star size={10} className="text-zinc-300 group-hover:text-blue-500 group-hover:fill-blue-500 transition-all" />
                      <span className="text-[10px] font-bold">{res.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-[14px] font-bold text-zinc-900 mb-1 leading-snug group-hover:text-blue-600 transition-colors line-clamp-1">
                    {res.name}
                  </h3>
                  <p className="text-zinc-500 text-[11px] font-medium mb-2 line-clamp-1">
                    {res.provider}
                  </p>
                  
                  <p className="text-zinc-400 text-[12px] font-normal line-clamp-2 mb-4 leading-relaxed h-[36px]">
                    {res.description}
                  </p>

                  <div className="flex items-center gap-3 text-zinc-400 mb-4 font-mono text-[9px] font-bold mt-auto">
                    <div className="flex items-center gap-1">
                      <GraduationCap size={10} />
                      <span>{res.level}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap size={10} />
                      <span>{res.category}</span>
                    </div>
                  </div>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pt-3 border-t border-zinc-100 flex items-center justify-between group/link"
                  >
                    <span className="text-[11px] font-semibold text-zinc-400 group-hover/link:text-blue-600 transition-colors">Open source</span>
                    <ExternalLink size={12} className="text-zinc-300 group-hover/link:text-blue-600 transition-colors" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
