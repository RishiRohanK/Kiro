"use client";

import { useState, useMemo, useRef } from "react";
import Navbar from "../components/home/Navbar";
import SubNavbar from "../components/home/SubNavbar";
import Footer from "../components/home/Footer";
import { Search, Globe, Star, Zap, ExternalLink, Cpu, Sparkles, Brain, Code2, Terminal, Layout, Database, Box, Shield, Share2 } from "lucide-react";

// Master Tool Logomap
const toolLogos: Record<string, string> = {
  "Cursor AI": "https://img.icons8.com/color/512/cursor-ai.png",
  "v0 by Vercel": "https://v0.dev/favicon.ico",
  "Perplexity": "https://www.perplexity.ai/favicon.ico",
  "Claude": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Anthropic_logo.svg/640px-Anthropic_logo.svg.png",
  "Wolfram Alpha": "https://upload.wikimedia.org/wikipedia/commons/e/e5/Wolfram_Alpha_logo.svg",
  "GitHub Copilot": "https://github.githubassets.com/favicons/favicon.svg",
  "Midjourney": "https://www.midjourney.com/favicon.ico",
  "Framer AI": "https://www.framer.com/favicon.ico",
  "Relume": "https://plgdemos.com/content/images/2024/05/image-removebg-preview.png",
  "Tabnine": "https://www.tabnine.com/favicon.ico",
  "Resend": "https://resend.com/static/favicons/favicon.ico",
  "Supabase": "https://monkedo-static.s3.eu-central-1.amazonaws.com/component-icons/supabase.png",
  "Neon": "https://neon.tech/favicon.ico",
  "Stripe": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
  "Clerk": "https://clerk.com/favicon.ico",
  "Postman": "https://www.postman.com/favicon.ico",
  "Sentry": "https://sentry.io/favicon.ico",
  "Vercel": "https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png",
  "PlanetScale": "https://planetscale.com/favicon.ico",
  "Upstash": "https://upstash.com/favicon.ico",
  "Railway": "https://logovtor.com/wp-content/uploads/2023/10/railway-app-logo-vector.png",
  "Render": "https://render.com/favicon.ico",
  "Cloudflare": "https://www.cloudflare.com/favicon.ico",
  "Auth0": "https://auth0.com/favicon.ico",
  "Sourcegraph Cody": "https://sourcegraph.com/favicon.ico",
  "Hugging Face": "https://huggingface.co/front/assets/huggingface_logo-noborder.svg",
  "LangChain": "https://avatars.githubusercontent.com/u/126733545?s=200&v=4",
  "Pinecone": "https://www.pinecone.io/favicon.ico",
  "Mistral AI": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Mistral_AI_logo.svg",
  "Linear": "https://linear.app/favicon.ico",
  "Notion AI": "https://www.notion.so/favicon.ico",
  "Raycast": "https://www.raycast.com/favicon.ico",
  "Warp": "https://www.warp.dev/favicon.ico",
  "Arc Browser": "https://arc.net/favicon.ico",
  "Figma": "https://www.figma.com/favicon.ico",
  "Canva AI": "https://www.canva.com/favicon.ico",
  "Grammarly AI": "https://www.grammarly.com/favicon.ico",
  "Otter.ai": "https://otter.ai/favicon.ico",
  "Jasper": "https://www.jasper.ai/favicon.ico",
  "Copy.ai": "https://www.copy.ai/favicon.ico",
  "Synthesia": "https://www.synthesia.io/favicon.ico",
  "Runway": "https://runwayml.com/favicon.ico",
  "Pika": "https://pika.art/favicon.ico",
  "Luma AI": "https://lumalabs.ai/favicon.ico",
  "Leonardo.ai": "https://leonardo.ai/favicon.ico",
  "1Password": "https://1password.com/favicon.ico",
  "Tailscale": "https://tailscale.com/favicon.ico",
  "Ngrok": "https://ngrok.com/favicon.ico",
  "Tableau AI": "https://www.tableau.com/favicon.ico",
  "Code Rabbit": "https://coderabbit.ai/favicon.ico",
  "Lovable": "https://lovable.dev/favicon.ico",
  "Bolt": "https://cdn-1.webcatalog.io/catalog/bolt-new/bolt-new-icon-filled-256.png?v=1730692903154",
  "Durable": "https://durable.com/favicon.ico",
  "Figma AI": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Figma-logo.svg/1920px-Figma-logo.svg.png",
  "Relume AI": "https://cdn.prod.website-files.com/6177739448baa66404ce1d9c/659f6c11eb69d1510ba12158_Dashboard%20Logo.png",
  "Trae": "https://images.saasworthy.com/trae_51840_logo_1753948921_8ohgm.png",
  "Windsurf": "https://codeium.com/favicon.ico",
  "OpenHands": "https://github.com/All-Hands-AI/OpenHands/raw/main/frontend/public/favicon.ico"
};

const tools = [
  { title: "Trae", provider: "ByteDance", description: "Adaptive AI code editor for high-speed technical missions.", link: "https://trae.ai", tags: ["Development", "AI", "IDE"], category: "Development", rating: 4.8, platform: "Desktop" },
  { title: "Windsurf", provider: "Codeium", description: "The world's first agentic IDE for professional engineering.", link: "https://codeium.com/windsurf", tags: ["Development", "AI", "Agentic"], category: "Development", rating: 4.9, platform: "Desktop" },
  { title: "OpenHands", provider: "Open Source", description: "Open-source AI software engineer agent for complex missions.", link: "https://github.com/All-Hands-AI/OpenHands", tags: ["Development", "AI", "Agent"], category: "Development", rating: 4.7, platform: "Self-Hosted" },
  { title: "Supabase", provider: "Supabase Inc.", description: "Open source Firebase alternative with enterprise SQL.", link: "https://supabase.com", tags: ["Database", "Backend", "Auth"], category: "Database", rating: 4.9, platform: "Cloud" },
  { title: "Code Rabbit", provider: "Coderabbit.ai", description: "The definitive AI code reviewer for pull requests.", link: "https://coderabbit.ai", tags: ["Development", "AI", "Review"], category: "Development", rating: 4.8, platform: "GitHub/GitLab" },
  { title: "Lovable", provider: "Lovable Labs", description: "Generate full-stack software from technical text.", link: "https://lovable.dev", tags: ["Development", "AI", "NoCode"], category: "Development", rating: 4.7, platform: "Web" },
  { title: "Bolt", provider: "StackBlitz", description: "AI-native webcontainer for in-browser dev missions.", link: "https://bolt.new", tags: ["Development", "AI", "Cloud"], category: "Development", rating: 4.9, platform: "Web" },
  { title: "Durable", provider: "Durable", description: "Generate a complete professional site in 30 seconds.", link: "https://durable.com", tags: ["Design", "AI", "Business"], category: "Design", rating: 4.6, platform: "Web" },
  { title: "Figma AI", provider: "Adobe", description: "AI design assistant for professional UI missions.", link: "https://figma.com/ai", tags: ["Design", "AI", "UI"], category: "Design", rating: 4.8, platform: "Desktop/Web" },
  { title: "Relume AI", provider: "Relume", description: "AI sitemap and wireframe generator for designers.", link: "https://relume.io", tags: ["Design", "AI", "Web"], category: "Design", rating: 4.7, platform: "Web" },
  { title: "Cursor AI", provider: "Anysphere", description: "AI-native code editor for high-speed engineering.", link: "https://cursor.com", tags: ["Development", "AI", "IDE"], category: "Development", rating: 4.9, platform: "Desktop" },
  { title: "v0 by Vercel", provider: "Vercel", description: "Generate UI components with AI in seconds.", link: "https://v0.dev", tags: ["Frontend", "AI", "Design"], category: "Frontend", rating: 4.8, platform: "Web" },
  { title: "Perplexity", provider: "Perplexity AI", description: "Real-time research engine for technical docs.", link: "https://perplexity.ai", tags: ["Research", "AI", "Search"], category: "Research", rating: 4.9, platform: "Web/Mobile" },
  { title: "Claude", provider: "Anthropic", description: "Advanced technical writing and logic reasoning.", link: "https://claude.ai", tags: ["Logic", "AI", "Text"], category: "Logic & Text", rating: 4.8, platform: "Web" },
  { title: "Wolfram Alpha", provider: "Wolfram", description: "Computational engine for engineering math.", link: "https://wolframalpha.com", tags: ["Math", "AI", "Computation"], category: "Computation", rating: 4.7, platform: "Web" },
  { title: "GitHub Copilot", provider: "Microsoft", description: "AI pair programmer for algorithm writing.", link: "https://github.com/features/copilot", tags: ["Development", "AI", "Pairing"], category: "Development", rating: 4.8, platform: "IDE" },
  { title: "Midjourney", provider: "Midjourney", description: "AI generative art for product concepts.", link: "https://midjourney.com", tags: ["Design", "AI", "Creative"], category: "Design", rating: 4.7, platform: "Discord" },
  { title: "Framer AI", provider: "Framer", description: "Zero-code site generation with AI.", link: "https://framer.com", tags: ["Design", "Web", "AI"], category: "Frontend", rating: 4.6, platform: "Web" },
  { title: "Tabnine", provider: "Tabnine", description: "Private AI code completion for teams.", link: "https://tabnine.com", tags: ["Development", "AI", "Privacy"], category: "Development", rating: 4.5, platform: "IDE" },
  { title: "Resend", provider: "Resend", description: "Modern email API for technical innovators.", link: "https://resend.com", tags: ["Backend", "API", "Email"], category: "Development", rating: 4.9, platform: "Web/API" },
  { title: "Neon", provider: "Neon Tech", description: "Serverless Postgres with branching.", link: "https://neon.tech", tags: ["Database", "SQL", "Cloud"], category: "Database", rating: 4.7, platform: "Cloud" },
  { title: "Stripe", provider: "Stripe", description: "Definitive payment infrastructure for dev.", link: "https://stripe.com", tags: ["Fintech", "API", "Payments"], category: "Development", rating: 4.9, platform: "Web/API" },
  { title: "Clerk", provider: "Clerk", description: "Complete user authentication for Next.js.", link: "https://clerk.com", tags: ["Auth", "Frontend", "Next.js"], category: "Frontend", rating: 4.8, platform: "Web/SDK" },
  { title: "Postman", provider: "Postman", description: "API development and testing platform.", link: "https://postman.com", tags: ["API", "Testing", "Dev"], category: "Development", rating: 4.7, platform: "Desktop/Web" },
  { title: "Sentry", provider: "Sentry", description: "Real-time error tracking and performance.", link: "https://sentry.io", tags: ["Debugging", "DevOps", "Monitoring"], category: "DevOps", rating: 4.7, platform: "Cloud/SDK" },
  { title: "Vercel", provider: "Vercel", description: "The platform for frontend deployment.", link: "https://vercel.com", tags: ["DevOps", "Cloud", "Frontend"], category: "DevOps", rating: 4.9, platform: "Cloud" },
  { title: "PlanetScale", provider: "PlanetScale", description: "Scalable MySQL database for enterprises.", link: "https://planetscale.com", tags: ["Database", "MySQL", "Scalability"], category: "Database", rating: 4.6, platform: "Cloud" },
  { title: "Upstash", provider: "Upstash", description: "Serverless Redis, Kafka, and Vector SQL.", link: "https://upstash.com", tags: ["Database", "Redis", "Serverless"], category: "Database", rating: 4.7, platform: "Cloud/API" },
  { title: "Railway", provider: "Railway", description: "Instant infrastructure deployment for apps.", link: "https://railway.app", tags: ["DevOps", "Hosting", "Cloud"], category: "DevOps", rating: 4.8, platform: "Cloud" },
  { title: "Render", provider: "Render", description: "The fastest way to host your web apps.", link: "https://render.com", tags: ["DevOps", "Hosting", "Cloud"], category: "DevOps", rating: 4.7, platform: "Cloud" },
  { title: "Cloudflare", provider: "Cloudflare", description: "Global CDN and security infrastructure.", link: "https://cloudflare.com", tags: ["Networking", "Security", "CDN"], category: "Cybersecurity", rating: 4.9, platform: "Cloud" },
  { title: "Auth0", provider: "Okta", description: "Identity platform for login management.", link: "https://auth0.com", tags: ["Auth", "Security", "IAM"], category: "Cybersecurity", rating: 4.6, platform: "Cloud/SDK" },
  { title: "Sourcegraph Cody", provider: "Sourcegraph", description: "The AI that knows your entire codebase.", link: "https://sourcegraph.com", tags: ["Development", "AI", "Search"], category: "Development", rating: 4.5, platform: "IDE/Web" },
  { title: "Hugging Face", provider: "Hugging Face", description: "The platform for AI models and datasets.", link: "https://huggingface.co", tags: ["AI", "ML", "Models"], category: "AI & ML", rating: 4.9, platform: "Cloud" },
  { title: "LangChain", provider: "LangChain", description: "Framework for building LLM applications.", link: "https://langchain.com", tags: ["AI", "LLM", "Framework"], category: "AI & ML", rating: 4.7, platform: "Library" },
  { title: "Pinecone", provider: "Pinecone", description: "The vector database for AI agents.", link: "https://pinecone.io", tags: ["AI", "Database", "Vectors"], category: "Database", rating: 4.6, platform: "Cloud" },
  { title: "Mistral AI", provider: "Mistral", description: "Open source, high-performance LLMs.", link: "https://mistral.ai", tags: ["AI", "LLM", "OpenSource"], category: "AI & ML", rating: 4.8, platform: "API/Models" },
  { title: "Linear", provider: "Linear", description: "Better way to build products.", link: "https://linear.app", tags: ["Productivity", "Management", "Agile"], category: "Specialized", rating: 4.9, platform: "Desktop/Web" },
  { title: "Notion AI", provider: "Notion", description: "AI integrated into your workspace.", link: "https://notion.com", tags: ["Productivity", "AI", "Text"], category: "Logic & Text", rating: 4.8, platform: "Desktop/Web" },
  { title: "Raycast", provider: "Raycast", description: "Extensible launcher for Mac productivity.", link: "https://raycast.com", tags: ["Productivity", "Mac", "Dev"], category: "Development", rating: 4.9, platform: "Mac" },
  { title: "Warp", provider: "Warp", description: "AI-powered terminal for modern teams.", link: "https://warp.dev", tags: ["Terminal", "AI", "Dev"], category: "Development", rating: 4.7, platform: "Desktop" },
  { title: "Arc Browser", provider: "Browser Company", description: "A browser that helps you think.", link: "https://arc.net", tags: ["Productivity", "Web", "Design"], category: "Specialized", rating: 4.8, platform: "Desktop" },
  { title: "Canva AI", provider: "Canva", description: "Design anything with AI generation.", link: "https://canva.com", tags: ["Design", "AI", "Creative"], category: "Design", rating: 4.7, platform: "Web/Mobile" },
  { title: "Grammarly AI", provider: "Grammarly", description: "AI communication assistant for technicals.", link: "https://grammarly.com", tags: ["Writing", "AI", "Logic"], category: "Logic & Text", rating: 4.8, platform: "Web/Desktop" },
  { title: "Otter.ai", provider: "Otter", description: "AI meeting notes and transcriptions.", link: "https://otter.ai", tags: ["Productivity", "AI", "Audio"], category: "Specialized", rating: 4.6, platform: "Web/Mobile" },
  { title: "Jasper", provider: "Jasper", description: "AI content creation for marketing.", link: "https://jasper.ai", tags: ["Marketing", "AI", "Text"], category: "Logic & Text", rating: 4.5, platform: "Web" },
  { title: "Copy.ai", provider: "Copy.ai", description: "AI copywriter for technical blogs.", link: "https://copy.ai", tags: ["Marketing", "AI", "Text"], category: "Logic & Text", rating: 4.4, platform: "Web" },
  { title: "Synthesia", provider: "Synthesia", description: "Generate AI videos from technical text.", link: "https://synthesia.io", tags: ["Video", "AI", "Creative"], category: "Design", rating: 4.7, platform: "Web" },
  { title: "Runway", provider: "Runway", description: "Next-gen AI creative tools for video.", link: "https://runwayml.com/image/upload/v1588805858/repositories/vercel/logo.png", tags: ["Video", "AI", "Design"], category: "Design", rating: 4.8, platform: "Web" },
  { title: "Pika", provider: "Pika", description: "Idea-to-video AI platform.", link: "https://pika.art", tags: ["Video", "AI", "Design"], category: "Design", rating: 4.6, platform: "Web" },
  { title: "Luma AI", provider: "Luma Labs", description: "Capture and generate 3D with AI.", link: "https://lumalabs.ai", tags: ["3D", "AI", "Design"], category: "Design", rating: 4.7, platform: "Web/iOS" },
  { title: "Leonardo.ai", provider: "Leonardo", description: "Generative AI for game design assets.", link: "https://leonardo.ai", tags: ["GameDev", "AI", "Design"], category: "Design", rating: 4.7, platform: "Web" },
  { title: "1Password", provider: "AgileBits", description: "The definitive password manager for dev.", link: "https://1password.com", tags: ["Security", "Privacy", "IAM"], category: "Cybersecurity", rating: 4.9, platform: "Desktop/Web" },
  { title: "Tailscale", provider: "Tailscale", description: "Zero config VPN for technical teams.", link: "https://tailscale.com", tags: ["Networking", "Security", "DevOps"], category: "Cybersecurity", rating: 4.8, platform: "Multi" },
  { title: "Ngrok", provider: "Ngrok", description: "Secure ingress for local development.", link: "https://ngrok.com", tags: ["Networking", "Dev", "Ingress"], category: "Development", rating: 4.7, platform: "CLI" },
  { title: "Tableau AI", provider: "Salesforce", description: "AI-driven data analytics and viz.", link: "https://tableau.com", tags: ["Data", "AI", "Analytics"], category: "Computation", rating: 4.6, platform: "Desktop/Web" }
];

const categories = [
  "All", "Development", "Frontend", "Research", "Logic & Text", "Computation", "Design", "Database", "DevOps", "Cybersecurity", "AI & ML", "Specialized"
];

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getLogo = (tool: any) => {
    if (toolLogos[tool.title]) return toolLogos[tool.title];
    return "https://upload.wikimedia.org/wikipedia/commons/a/ab/Circle-icons-cloud.svg";
  };

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100">
      <Navbar />
      <SubNavbar />

      <main>
        {/* Condensed Hero Section */}
        <section className="bg-zinc-900 py-6 md:py-8 border-b border-white/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-violet-600/5 blur-[100px] pointer-events-none" />
          <div className="mx-auto max-w-7xl px-6 relative z-10 text-left">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex h-4 items-center px-1.5 border border-white/10 bg-white/5 text-violet-400 text-[9px] font-bold leading-none">
                Innovation base
              </div>
              <h1 className="text-3xl md:text-4xl font-normal tracking-tighter text-white leading-tight">
                Engineering <span className="text-violet-500">Accelerators</span>.
              </h1>
              <p className="text-zinc-400 text-[14px] font-normal max-w-xl">
                50+ definitive AI and technical tools synchronized for high-speed student innovation.
              </p>
            </div>
          </div>
        </section>

        {/* Condensed Action Bar */}
        <section className="sticky top-[56px] z-50 bg-white/95 backdrop-blur-md border-b border-zinc-100 py-2 shadow-sm">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input
                  type="text"
                  placeholder="Search accelerators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-10 pr-4 bg-zinc-50 border border-zinc-200 text-[13px] focus:outline-none focus:border-violet-600 focus:bg-white"
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

        {/* High-Density Simplified Grid */}
        <section className="py-6 md:py-8 bg-zinc-50 min-h-[800px]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTools.map((tool, index) => (
                <div
                  key={index}
                  className="group flex flex-col bg-white border border-zinc-200 hover:border-violet-600 transition-all duration-200 p-5 rounded-none"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-10 w-10 flex items-center justify-center transition-all">
                      <img
                        src={getLogo(tool)}
                        alt={tool.provider}
                        className="h-full w-full object-contain transition-all"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://upload.wikimedia.org/wikipedia/commons/a/ab/Circle-icons-cloud.svg"; }}
                      />
                    </div>
                    <div className="flex items-center gap-1 text-zinc-400">
                      <Star size={10} className="text-zinc-300 group-hover:text-violet-500 group-hover:fill-violet-500 transition-all" />
                      <span className="text-[10px] font-bold">{tool.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-[14px] font-bold text-zinc-900 mb-1 leading-snug group-hover:text-violet-600 transition-colors line-clamp-1">
                    {tool.title}
                  </h3>
                  <p className="text-zinc-500 text-[11px] font-medium mb-2">
                    {tool.provider}
                  </p>

                  <p className="text-zinc-400 text-[12px] font-normal line-clamp-2 mb-4 leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="flex items-center gap-3 text-zinc-400 mb-4 font-mono text-[9px] font-bold">
                    <div className="flex items-center gap-1">
                      <Box size={10} />
                      <span>{tool.platform}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap size={10} />
                      <span>{tool.category}</span>
                    </div>
                  </div>

                  <a
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto pt-3 border-t border-zinc-100 flex items-center justify-between group/link"
                  >
                    <span className="text-[11px] font-semibold text-zinc-400 group-hover/link:text-violet-600 transition-colors">Launch tool</span>
                    <ExternalLink size={12} className="text-zinc-300 group-hover/link:text-violet-600 transition-colors" />
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
