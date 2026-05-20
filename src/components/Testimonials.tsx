import { useEffect, useState } from "react";
import { Star, MessageSquareQuote } from "lucide-react";
import { Testimonial } from "../types";

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  // Double the list for infinite clean carousel effect
  const marqueeItems = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="py-24 relative overflow-hidden bg-[#030006]">
      {/* Background radial soft light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-950/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 mb-16">
        <div className="text-center">
          <span className="text-[10px] font-mono tracking-[0.35em] font-extrabold text-[#06b6d4] uppercase">
            CLIENT SATISFACTION INDEX
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-medium text-white mt-3">
            Trusted by Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-300 font-extrabold">Creators & startups</span>
          </h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto font-light mt-4">
            Hear from global esports managers, professional YouTube streamers with 2M+ audiences, and tech executives who trust my vector schematics.
          </p>
        </div>
      </div>

      {/* Live Continuous Marquee Panel */}
      <div className="w-full overflow-hidden py-4 select-none relative" data-cursor="drag">
        {/* Soft fading edges left and right */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#030006] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#030006] to-transparent z-10 pointer-events-none" />

        <div className="marquee-container flex">
          <div className="marquee-content flex gap-8">
            {marqueeItems.map((test, index) => (
              <div
                key={`${test.id}-${index}`}
                className="w-[380px] shrink-0 p-8 rounded-2xl bg-[#0c0819]/50 border border-white/5 backdrop-blur-md relative group flex flex-col justify-between"
              >
                {/* Quote Icon watermark */}
                <MessageSquareQuote className="absolute right-6 top-6 w-9 h-9 text-violet-500/10 pointer-events-none" />

                <div>
                  <div className="flex items-center gap-1.5 mb-5 text-amber-400">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs text-gray-300 font-light leading-relaxed italic mb-6">
                    "{test.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-white/5 mt-auto">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-violet-500/20">
                    <img src={test.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"} alt={test.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{test.name}</h4>
                    <p className="text-[10px] font-mono text-gray-500 uppercase">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-10">
        <span className="text-[11px] font-mono text-gray-600 uppercase">● Live automatic scrolling carousel (pause on hover)</span>
      </div>
    </section>
  );
}
