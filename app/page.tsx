import React from 'react';

export default function LandingPage() {
  return (
    <div className="relative w-full h-screen bg-zinc-950 overflow-hidden">
      {/* Background Image with Gradient Mask */}
      <div 
        className="absolute inset-0 z-0 bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/a72ca2f3-9dd1-4fe4-84ba-fe86468a5237_3840w.webp?w=800&q=80)] bg-cover bg-center opacity-40"
        style={{
          maskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
        }}
      />
    </div>
  );
}
