import { motion } from "motion/react";
import { Paintbrush, Image, Zap, Presentation, Box } from "lucide-react";
import { SiteSettings } from "../types";

export default function Services({ settings }: { settings: SiteSettings }) {
  const serviceList = [
    {
      icon: Zap,
      title: settings.service1Title || "Thumbnail Design",
      metrics: settings.service1Metric || "Average 22%+ CTR growth",
      description: settings.service1Desc || "High click-through-rate, hyper-saturated, pixel perfect YouTube & Twitch thumbnail layouts. Crafted with meticulous lighting, custom text shapes, and expressive vector subjects.",
      glowColor: "from-purple-500/20 to-purple-600/5",
    },
    {
      icon: Presentation,
      title: settings.service2Title || "Branding Systems",
      metrics: settings.service2Metric || "Cohesive vector manuals",
      description: settings.service2Desc || "Comprehensive brand strategy detailing responsive logo layout variants, exact color weight metrics, unique geometric guides, and typography matching across desktop and mobile channels.",
      glowColor: "from-cyan-500/20 to-cyan-600/5",
    },
    {
      icon: Paintbrush,
      title: settings.service3Title || "Elite Logo Design",
      metrics: settings.service3Metric || "Golden ratio vector geometry",
      description: settings.service3Desc || "Bespoke clean emblems and minimalist vector trademarks built from strict mathematically balanced circles and shapes. Ideal for luxury watchmakers, startups, and tech groups.",
      glowColor: "from-pink-500/20 to-violet-600/5",
    },
    {
      icon: Image,
      title: settings.service4Title || "Adrenaline Esports Art",
      metrics: settings.service4Metric || "+1.2M collective reach",
      description: settings.service4Desc || "Esports tournament key visuals, social media banner wraps, and high-frequency stream overlays. Created with advanced photo manipulation, light leaks, speed sweeps, and raw action.",
      glowColor: "from-blue-500/20 to-purple-800/5",
    },
    {
      icon: Box,
      title: settings.service5Title || "Brutalist Poster Layouts",
      metrics: settings.service5Metric || "Collector quality print design",
      description: settings.service5Desc || "Dark retro-futuristic streetwear poster templates, vinyl cover envelopes, and concert flyers. Blends brutalist framing grids, chromatic aberration, analog scanner grain, and bold labels.",
      glowColor: "from-violet-500/20 to-cyan-400/5",
    }
  ];

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-[#030006]">
      {/* Background stardust glow */}
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-purple-950/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[350px] h-[350px] bg-[#0c0819] blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-[10px] font-mono tracking-[0.34em] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-300 uppercase">
            {settings.servicesBadge || "CREATIVE SERVICE VECTOR"}
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-medium text-white tracking-tight mt-3">
            {settings.servicesTitle || "Bespoke Visual Assets"}
          </h2>
          <p className="text-sm text-gray-400 font-light mt-4 leading-relaxed">
            {settings.servicesSubtitle || "I don’t just paint canvas. I reverse engineer viewer psychology, color-weight balance, and platform algorithms to create high-frequency graphic design systems that secure high conversions."}
          </p>
        </div>

        {/* Services Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceList.map((service, idx) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                key={service.title}
                className="group relative rounded-2xl p-8 bg-[#0c0819]/40 border border-white/5 overflow-hidden transition-all duration-500 hover:border-violet-500/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-950/10"
              >
                {/* Custom Card Ambient Lighting Glow */}
                <div className={`absolute -right-24 -bottom-24 w-52 h-52 rounded-full bg-gradient-to-tr ${service.glowColor} blur-[50px] transition-opacity duration-500 opacity-60 group-hover:opacity-100 pointer-events-none`} />

                {/* Service Card Top Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-xl bg-violet-950/50 border border-violet-500/25 flex items-center justify-center text-violet-300 group-hover:scale-110 group-hover:bg-gradient-to-tr group-hover:from-violet-600 group-hover:to-cyan-500 group-hover:text-white transition-all duration-500">
                    <IconComponent className="w-5.5 h-5.5" />
                  </div>
                  <span className="text-[8px] font-mono tracking-widest text-cyan-400 bg-cyan-950/30 px-3 py-1 rounded border border-cyan-500/15 uppercase font-bold">
                    {service.metrics}
                  </span>
                </div>

                {/* Info Text */}
                <h3 className="text-xl font-display font-semibold text-white group-hover:text-violet-300 transition-colors mb-3">
                  {service.title}
                </h3>
                
                <p className="text-xs text-gray-400 font-light leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Floating graphic footer line */}
                <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-violet-500 to-cyan-400 group-hover:w-full transition-all duration-700 ease-out" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
