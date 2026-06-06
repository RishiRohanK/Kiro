import React from 'react';

export default function LandingPage() {
  return (
    <div className="relative w-full h-screen bg-white p-4 md:p-6 flex items-center justify-center">
      {/* Floating Hero Background Container with Rounded Edges and Border */}
      <div className="relative w-full h-full bg-white border border-zinc-200 rounded-[24px] md:rounded-[32px] overflow-hidden shadow-md">
        {/* Background Image with Gradient Mask */}
        <div
          className="absolute inset-0 z-0 bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/a72ca2f3-9dd1-4fe4-84ba-fe86468a5237_3840w.webp?w=800&q=80)] bg-cover bg-center opacity-30 mix-blend-multiply grayscale"
          style={{
            maskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
            WebkitMaskImage: "linear-gradient(180deg, transparent, black 0%, black 70%, transparent)",
          }}
        />
      </div>
    </div>
  );
}
