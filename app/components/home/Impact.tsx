"use client";

import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

const stats = [
  { label: "Active students", value: 1200, suffix: "+" },
  { label: "Industry internships", value: 150, suffix: "+" },
  { label: "Partner colleges", value: 25, suffix: "+" },
  { label: "Technical events", value: 60, suffix: "+" }
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const spring = useSpring(0, { stiffness: 40, damping: 20 });
  const displayValue = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    if (inView) {
      spring.set(value);
    }
  }, [inView, value, spring]);

  return (
    <span ref={ref} className="text-2xl lg:text-3xl font-medium tracking-tight text-white tabular-nums">
      <motion.span>{displayValue}</motion.span>
      <span className="text-blue-200 ml-0.5">{suffix}</span>
    </span>
  );
}

export default function Impact() {
  return (
    <section className="relative bg-blue-600 py-10 lg:py-12 overflow-hidden" id="impact">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-20">

          {/* Left Side: Minimal Section Title */}
          <div className="shrink-0">
            <div className="flex items-center gap-3 mb-1">
              <div className="h-[1px] w-4 bg-white/60" />
              <span className="text-[13px] font-medium text-white/70 tracking-tight">
                Our impact
              </span>
            </div>
            <h2 className="text-xl font-medium text-white tracking-tight">
              Global student reach.
            </h2>
          </div>

          {/* Right Side: Horizontal Stats Row */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="relative flex flex-col items-start lg:items-center lg:text-center"
              >
                {/* Clean Vertical Divider for Desktop */}
                {index !== 0 && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden lg:block h-8 w-[1px] bg-white/20" />
                )}

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Counter value={stat.value} suffix={stat.suffix} />
                  <p className="mt-1 text-[13px] font-normal text-white/70 tracking-tight">
                    {stat.label}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}