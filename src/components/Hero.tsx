import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowDownRight, Layers, Paintbrush, Sparkles, Wand2, Mail, Phone, MapPin, User } from "lucide-react";
import { SiteSettings } from "../types";

export default function Hero({ settings }: { settings: SiteSettings }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeLayers, setActiveLayers] = useState<number[]>([1, 2, 3]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const toggleLayer = (id: number) => {
    if (activeLayers.includes(id)) {
      setActiveLayers(activeLayers.filter((l) => l !== id));
    } else {
      setActiveLayers([...activeLayers, id]);
    }
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#03000a]"
    >
      {/* Absolute Ambient Spotlight Gradient - Follows Mouse with Lag */}
      <div
        className="absolute hidden md:block w-[500px] h-[500px] rounded-full pointer-events-none opacity-25 blur-[120px] transition-all duration-300 -translate-x-1/2 -translate-y-1/2 z-0"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(6, 182, 212, 0) 70%)"
        }}
      />

      {/* Static Background Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-violet-800/10 blur-[90px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-[10%] w-[350px] h-[350px] rounded-full bg-cyan-800/10 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Typography Block */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/15 bg-violet-950/20 text-violet-300 text-[10px] font-mono font-bold tracking-widest uppercase mb-6 self-start"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
            <span>CRISP PIXEL PERFECT SCHEMATICS </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl xl:text-7xl font-display font-medium leading-[1.05] tracking-tight text-white mb-6"
          >
            {settings.heroTitleFirst} <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-500 to-cyan-300 font-extrabold">{settings.heroTitleSecond}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-400 max-w-xl mb-10 leading-relaxed font-sans font-light"
          >
            {settings.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            <a
              href="#work"
              className="px-8 py-4 rounded-xl font-mono text-xs font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 text-white shadow-xl shadow-violet-600/20 hover:shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all text-center flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>EXPLORE SHOWCASE</span>
              <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
            </a>

            <a
              href="#contact"
              className="px-8 py-4 rounded-xl font-mono text-xs font-semibold bg-white/5 border border-white/10 hover:border-violet-500/30 hover:bg-violet-950/20 text-white transition-all text-center hover:shadow-lg hover:shadow-black/50 cursor-pointer"
            >
              BOOK DIRECT CONSULTATION
            </a>
          </motion.div>

          {/* Quick Stats banner */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-6 pt-12 mt-12 border-t border-white/5"
          >
            <div>
              <span className="block text-2xl font-display font-bold text-white">{settings.completedThumbnailsCount}</span>
              <span className="text-[10px] font-mono uppercase text-gray-500">Thumbnails Completed</span>
            </div>
            <div>
              <span className="block text-2xl font-display font-bold text-cyan-400">{settings.combinedReachCount}</span>
              <span className="text-[10px] font-mono uppercase text-gray-500">Combined Reach</span>
            </div>
            <div>
              <span className="block text-2xl font-display font-bold text-violet-400">{settings.retentionScore}</span>
              <span className="text-[10px] font-mono uppercase text-gray-500">Retention Score</span>
            </div>
          </motion.div>

        </div>

        {/* Right Side: High-End Layered Canvas illustration Simulator */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-[420px] aspect-[4/5] relative"
          >
            {/* Layers Sandbox Box */}
            <div className="absolute inset-0 rounded-2xl border border-violet-500/10 bg-gradient-to-br from-violet-950/15 to-[#0c0819]/90 backdrop-blur-xl p-5 shadow-2xl shadow-violet-900/10 flex flex-col justify-between overflow-hidden">
              
              {/* Box Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-[10px] font-mono text-gray-500 ml-2">
                    {settings.designerName.toLowerCase().replace(/ /g, "_")}_render_stage.psd
                  </span>
                </div>
                <Wand2 className="w-4 h-4 text-violet-400 animate-spin [animation-duration:8s]" />
              </div>

              {/* Rendering Canvas Preview Area */}
              <div className="relative flex-1 my-4 rounded-lg bg-[#070510] overflow-hidden border border-white/5 flex items-center justify-center">
                {settings.personalPhoto ? (
                  <div className="absolute inset-0 w-full h-full">
                    <img 
                      src={settings.personalPhoto} 
                      alt={settings.personalName || settings.designerName} 
                      className="w-full h-full object-cover select-none"
                      referrerPolicy="no-referrer"
                    />
                    {/* Dark gradient to ensure contrast overlay is readable */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                    
                    {/* Minimal verified badge indicator */}
                    <div className="absolute top-3 right-3 bg-cyan-400/10 border border-cyan-400/35 px-2 py-0.5 rounded backdrop-blur-md z-10 select-none">
                      <span className="text-[7.5px] font-mono font-bold tracking-widest text-[#22d3ee] uppercase flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                        ACTIVE LAYOUT
                      </span>
                    </div>

                    {/* Personal name / tagline built directly into the frame bottom overlay */}
                    <div className="absolute bottom-3 left-3 right-3 z-10 text-left pointer-events-none">
                      <h4 className="text-sm font-bold text-white tracking-wide truncate">
                        {settings.personalName || settings.designerName}
                      </h4>
                      <p className="text-[10px] text-cyan-300 font-medium truncate">
                        {settings.personalDetails || settings.designerRole}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Background Grid Pattern dots */}
                    <div className="absolute inset-0 bg-[radial-gradient(#1e153b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 animate-pulse" />

                    {/* Layer 1: Stars / Ambient light - Animated */}
                    <motion.div
                      animate={{
                        opacity: activeLayers.includes(1) ? 1 : 0.05,
                        scale: activeLayers.includes(1) ? 1 : 0.9,
                      }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <div className="absolute top-10 left-12 w-28 h-28 rounded-full bg-violet-600/30 blur-[24px] animate-pulse" />
                      <div className="absolute bottom-8 right-12 w-32 h-32 rounded-full bg-cyan-500/20 blur-[30px]" />
                    </motion.div>

                    {/* Layer 2: Geometric Glow Ring */}
                    <motion.div
                      animate={{
                        opacity: activeLayers.includes(2) ? 1 : 0.05,
                        rotate: activeLayers.includes(2) ? 360 : 0,
                      }}
                      transition={{ rotate: { repeat: Infinity, duration: 12, ease: "linear" } }}
                      className="absolute w-44 h-44 rounded-full border border-dashed border-violet-400/40 flex items-center justify-center pointer-events-none"
                    >
                      <div className="w-36 h-36 rounded-full border border-cyan-400/20 flex items-center justify-center">
                        <div className="w-4 h-4 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50" />
                      </div>
                    </motion.div>

                    {/* Layer 3: Central Masking Silhouette Art */}
                    <motion.div
                      animate={{
                        opacity: activeLayers.includes(3) ? 1 : 0.1,
                        y: activeLayers.includes(3) ? [0, -10, 0] : 0,
                      }}
                      transition={{ y: { repeat: Infinity, duration: 4, ease: "easeInOut" } }}
                      className="absolute pointer-events-none text-center flex flex-col items-center justify-center max-w-[160px]"
                    >
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-400 p-[1px] shadow-2xl shadow-violet-500/20 flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full rounded-[15px] bg-[#0c0819] flex items-center justify-center overflow-hidden">
                          <Paintbrush className="w-10 h-10 text-violet-300" />
                        </div>
                      </div>
                      
                      {/* Name and personal details underneath */}
                      <span className="block mt-2 px-1 text-xs font-bold text-white tracking-wide truncate max-w-full">
                        {settings.designerName}
                      </span>
                      <span className="block text-[9px] font-sans text-cyan-400 font-medium truncate max-w-full leading-tight">
                        {settings.designerRole}
                      </span>
                    </motion.div>
                  </>
                )}

                {/* Live rendering mode overlay badge */}
                <div className="absolute bottom-2 right-2 bg-black/80 px-2.5 py-0.5 rounded border border-white/5 backdrop-blur-md z-1 z-10 select-none">
                  <span className="text-[7px] font-mono text-cyan-400 uppercase font-black">Mode: Linear Dodge / Overlay</span>
                </div>
              </div>

              {/* Box Footer Personal Profile Details */}
              <div className="flex flex-col gap-1.5 pt-3 border-t border-white/5 bg-white/[0.01] p-3 rounded-lg border border-white/[0.03]">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 select-none">
                  <User className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
                  PERSONAL WORK CONTACT
                </span>
                
                <div className="grid grid-cols-1 gap-2 mt-1 text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                      <User className="w-3 h-3 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-[7.5px] uppercase tracking-wider text-gray-500 font-bold leading-none">Full Name</p>
                      <p className="text-[11px] font-bold text-white leading-tight">
                        {settings.personalName || settings.designerName}
                      </p>
                    </div>
                  </div>

                  {(settings.personalPhone || settings.whatsappNumber) && (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                        <Phone className="w-3 h-3 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-[7.5px] uppercase tracking-wider text-gray-500 font-bold leading-none">WhatsApp / Call</p>
                        <p className="text-[11px] font-mono font-bold text-cyan-400 leading-tight">
                          {settings.personalPhone || settings.whatsappNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  {(settings.personalEmail || settings.contactEmail) && (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                        <Mail className="w-3 h-3 text-purple-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[7.5px] uppercase tracking-wider text-gray-500 font-bold leading-none">Inquiries Email</p>
                        <p className="text-[11px] font-mono text-gray-300 leading-tight truncate">
                          {settings.personalEmail || settings.contactEmail}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[7.5px] uppercase tracking-wider text-gray-500 font-bold leading-none">Location / HQ</p>
                      <p className="text-[11px] text-violet-300 leading-tight">
                        {settings.personalLocation || "Dhaka, Bangladesh"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>

      </div>

      {/* Mouse scroll indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-[9px] font-mono text-gray-500 tracking-wider uppercase">Scroll to explore portfolio</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-5 h-9 rounded-full border-2 border-white/15 flex justify-center pt-2"
        >
          <div className="w-1 h-2 rounded-full bg-violet-400" />
        </motion.div>
      </div>
    </section>
  );
}
