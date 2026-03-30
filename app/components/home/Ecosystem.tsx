"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Ecosystem() {
  const offerings = [
    {
      title: "Startup incubation",
      desc: "Access initial funding, legal aid, and technical resources to launch your engineering venture.",
      step: "01",
      href: "/startup",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
    },
    {
      title: "Expert mentorship",
      desc: "Connect with industry leaders from top tech companies for dedicated career guidance.",
      step: "02",
      href: "/mentorship",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1974&auto=format&fit=crop"
    },
    {
      title: "Global network",
      desc: "Join a curated community of 10k+ students and professionals across 20+ countries.",
      step: "03",
      href: "/community",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Career opportunities",
      desc: "Get exclusive access to internships and job placements across global engineering hubs.",
      step: "04",
      href: "/aboard",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <section className="py-12 bg-white border-b border-zinc-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        {/* Ecosystem Header - High Impact Support Pathways */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-5 bg-blue-600" />
              <span className="text-[13px] font-medium text-blue-600 tracking-tight">
                Support ecosystem
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-zinc-900 leading-[1.15]">
              Beyond learning. <br />
              <span className="text-zinc-400">We support your growth.</span>
            </h2>
            <p className="mt-6 text-[16px] text-zinc-500 font-normal leading-relaxed">
              Our ecosystem is engineered to ensure you succeed at every stage of your 
              professional journey, from your first project to your global career.
            </p>
          </div>
          
          {/* Illustration - Side Content */}
          <div className="hidden lg:block w-72 h-72 shrink-0 relative">
             <img 
                src="https://ik.imagekit.io/dypkhqxip/Research%20paper-amico.svg" 
                alt="Research support" 
                className="w-full h-full object-contain drop-shadow-sm opacity-90 group-hover:opacity-100 transition-opacity" 
             />
             <div className="absolute -inset-4 bg-blue-50/50 rounded-full blur-3xl -z-10" />
          </div>
        </div>

        {/* Offerings Grid - Editorial Style with Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-12">
          {offerings.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <Link
                href={item.href}
                className="block h-full transition-all duration-300 pr-8"
              >
                {/* Image Component */}
                <div className="aspect-[4/5] w-full overflow-hidden bg-zinc-100 mb-8 relative">
                   <img 
                      src={item.image} 
                      alt={item.title} 
                      className="h-full w-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                   />
                   <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   
                   {/* Step Number Overlay */}
                   <div className="absolute top-0 right-0 bg-blue-600 w-10 h-10 flex items-center justify-center text-[11px] font-black text-white">
                      {item.step}
                   </div>
                </div>

                <h3 className="text-[18px] font-bold text-zinc-900 mb-3 group-hover:text-blue-600 transition-colors tracking-tight">
                  {item.title}
                </h3>

                <p className="text-[14px] text-zinc-500 font-normal leading-relaxed mb-6">
                  {item.desc}
                </p>

                {/* Subtle Arrow Indicator */}
                <div className="flex items-center gap-2 text-[12px] font-bold text-zinc-900 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                  <span>Explore pathway</span>
                  <div className="h-[1px] w-4 bg-zinc-900" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}