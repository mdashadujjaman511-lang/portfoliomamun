import { motion } from "motion/react";
import { Sparkles, Milestone, Award, CheckCircle2 } from "lucide-react";
import { SiteSettings } from "../types";

export default function About({ settings }: { settings: SiteSettings }) {
  const tools = [
    {
      name: "Photoshop",
      level: "Elite",
      desc: "Pixel manipulation, lighting control, advanced filters, compositing, saturation matching.",
      iconUrl: "https://img.icons8.com/?size=100&id=13677&format=png&color=000000"
    },
    {
      name: "Illustrator",
      level: "Master",
      desc: "Vector geometry, golden ratios, logo schematics, clean typographic pathing.",
      iconUrl: "https://img.icons8.com/?size=100&id=13631&format=png&color=000000"
    },
    {
      name: "Figma",
      level: "Proficient",
      desc: "Components, grids, vector systems, UI/UX frames, landing page layout wireframes.",
      iconUrl: "https://img.icons8.com/?size=100&id=zfH6Zg7uYtA8&format=png&color=000000"
    },
    {
      name: "Canva",
      level: "Productive",
      desc: "Dynamic layout testing, high pacing client template setup, rapid prototypes.",
      iconUrl: "https://img.icons8.com/?size=100&id=iW6pZ9HG7vdf&format=png&color=000000"
    }
  ];

  const philosophyPoints = [
    {
      title: settings.philosophy1Title || "Atmosphere & Scale",
      text: settings.philosophy1Text || "Every piece must have logical light sources and visual hierarchy. If a poster doesn’t command eyes from 10 feet away, it fails."
    },
    {
      title: settings.philosophy2Title || "No Half-baked Details",
      text: settings.philosophy2Text || "Every shadow anchor-point, chromatic offset level, and distress brush stroke is applied by hand. Precision is my sole benchmark."
    },
    {
      title: settings.philosophy3Title || "Platforms & Conversion",
      text: settings.philosophy3Text || "Design must deliver functional results. High CTR on thumbnails or high premium trust on logos directly secure client revenue growth."
    }
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-[#050506]">
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-10 w-[400px] h-[400px] bg-violet-950/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Layout: Grid splits philosophy and introduction */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24">
          
          {/* Left Block: Narrative */}
          <div className="lg:col-span-6">
            <span className="text-[10px] font-mono tracking-[0.3em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 uppercase">
              CREATIVE PROFILE & HISTORY
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-medium text-white tracking-tight mt-3 mb-8">
              Pristine Visuals, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-300 font-extrabold italic">No Exceptions.</span>
            </h2>

            <p className="text-sm text-gray-300 font-light leading-relaxed mb-6">
              {settings.bioSummary}
            </p>

            <p className="text-sm text-gray-400 font-light leading-relaxed mb-10">
              {settings.experienceText}
            </p>

            {/* Quick Milestones Checklist */}
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-xl bg-violet-950/20 border border-violet-500/10 backdrop-blur-sm">
                <Milestone className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">{settings.milestone1Title || "4+ Years Active Experience"}</h4>
                  <p className="text-xs text-gray-400 mt-1">{settings.milestone1Desc || "Shipping high-adrenaline thumbnails, premium vector branding, and luxury design templates globally."}</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/10 backdrop-blur-sm">
                <Award className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">{settings.milestone2Title || "Client-Centric Philosophy"}</h4>
                  <p className="text-xs text-gray-400 mt-1">{settings.milestone2Desc || "Providing dedicated Figma workboards and fully transparent live design preview feedback channels."}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Block: Core Philosophy Points */}
          <div className="lg:col-span-6 bg-[#0c0819]/40 border border-white/5 p-8 md:p-10 rounded-2xl relative">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-tr from-violet-600/10 to-transparent blur-[30px] pointer-events-none" />
            
            <h3 className="text-2xl font-display font-medium text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" />
              Core Design Philosophy
            </h3>

            <div className="space-y-8">
              {philosophyPoints.map((pt, idx) => (
                <div key={idx} className="relative pl-6 border-l border-violet-500/15">
                  <div className="absolute top-1.5 left-[-4px] w-2 h-2 rounded-full bg-cyan-400" />
                  <h4 className="text-base font-medium text-white mb-1.5">{pt.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">{pt.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Tools Section Grid */}
        <div>
          <div className="text-center mb-12">
            <span className="text-[9px] font-mono text-gray-500 tracking-widest uppercase block">TECHNICAL INVENTORY</span>
            <h3 className="text-2xl font-display text-white mt-1">Creative Production Engine</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="group relative p-6 rounded-xl bg-[#0c0819]/50 border border-white/5 hover:border-violet-500/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  {/* Tool icon */}
                  <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform">
                    {tool.iconUrl ? (
                      <img src={tool.iconUrl} alt={tool.name} className="w-6 h-6 object-contain invert" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-gray-400" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-white">{tool.name}</h4>
                    <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase">{tool.level}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  {tool.desc}
                </p>

                {/* Cover highlight effect on hover */}
                <div className="absolute inset-0 bg-violet-600/[0.015] opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
