export default function LearningRibbon() {
  const steps = ["Learn", "Build", "Grow"];

  return (
    <div className="w-full bg-[#09090b] border-y border-white/5 py-5 lg:py-6">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex items-center justify-center gap-8 md:gap-16 lg:gap-24">

          {steps.map((step, index) => (
            <div key={step} className="flex items-center gap-8 md:gap-16 lg:gap-24">
              {/* The Word - Medium weight, Sentence case, Reduced size for better fit */}
              <span className="text-[18px] md:text-[22px] font-medium tracking-tight text-zinc-400 transition-all duration-300 hover:text-white cursor-default">
                {step}
              </span>

              {/* Minimalist Separator - A small blue dot that fits the reduced height */}
              {index < steps.length - 1 && (
                <div className="h-1 w-1 rounded-full bg-blue-600/60" />
              )}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}