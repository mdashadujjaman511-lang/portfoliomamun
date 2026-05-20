import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Maximize2, X, Plus, Calendar, Layers } from "lucide-react";
import { Project } from "../types";

interface PortfolioProps {
  projects: Project[];
  loading: boolean;
  onDeleteProject?: (id: string) => void;
  isAdmin?: boolean;
}

export default function Portfolio({ projects, loading, onDeleteProject, isAdmin = false }: PortfolioProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.categories)) {
          setCategories(["All", ...data.categories]);
        }
      })
      .catch(err => {
        console.error("Failed fetching dynamic tags", err);
        setCategories(["All", "Thumbnail Design", "Branding Systems", "Elite Logo Design", "Esports Artwork", "Poster Design & Framing"]);
      });
  }, [projects]);

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="work" className="py-24 relative overflow-hidden bg-[#050506]">
      {/* Background stardust & texture */}
      <div className="absolute inset-0 bg-repeat bg-center opacity-[0.02] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }} />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 uppercase">
              CRAFTED SHOWCASE
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-medium text-white mt-2">
              Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-300 font-extrabold italic">Visual</span> Artifacts
            </h2>
          </div>
          <p className="max-w-md text-sm text-gray-400 leading-relaxed font-light">
            Each project is an ecosystem of custom geometry, deliberate layout, and dynamic color. Designed to demand absolute viewer engagement.
          </p>
        </div>

        {/* Animated Filter system */}
        <div className="flex flex-wrap items-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-5 py-2 rounded-full text-xs font-mono transition-all cursor-pointer ${
                activeCategory === cat
                  ? "text-white"
                  : "text-gray-400 border border-white/5 hover:border-violet-500/30 hover:text-white bg-white/2"
              }`}
            >
              {activeCategory === cat && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 bg-gradient-to-r from-violet-600/60 to-cyan-500/60 border border-violet-400/40 rounded-full -z-10 shadow-lg shadow-violet-500/10"
                />
              )}
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Masonry & Loading states */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="aspect-[4/5] rounded-2xl bg-white/5 border border-white/10 animate-pulse flex flex-col justify-end p-6">
                <div className="h-4 w-2/3 bg-white/10 rounded-full mb-3" />
                <div className="h-3 w-1/3 bg-white/5 rounded-full" />
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/2">
            <Layers className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-white">No assets loaded in this category</h4>
            <p className="text-xs text-gray-500 mt-1">Check back later or register a custom thumbnail using the admin panel.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="group relative aspect-[4/5] rounded-2xl overflow-hidden glass-panel border border-white/10 cursor-pointer shadow-xl transition-all duration-500 hover:border-violet-500/30 hover:-translate-y-1.5"
                  data-cursor="view"
                >
                  {/* Image wrapper */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Dark gradient mapping overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
                  </div>

                  {/* Absolute Badge category on top */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 rounded bg-[#0c0819]/80 border border-violet-500/20 backdrop-blur-md text-[8px] font-mono tracking-widest text-violet-300 font-bold uppercase">
                      {project.category}
                    </span>
                  </div>

                  {/* Absolute visual content info on bottom */}
                  <div className="absolute bottom-0 left-0 w-full p-6 z-20 flex flex-col justify-end">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-wider mb-1">
                      {project.metrics || "Premium Graphic"}
                    </span>
                    <h3 className="text-xl font-display font-medium text-white tracking-tight leading-tight group-hover:text-cyan-200 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 mt-2 font-light leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {project.tools.slice(0, 3).map((t) => (
                        <span key={t} className="text-[8px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-gray-300">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Delete button for live simulation in Admin mode */}
                    {isAdmin && onDeleteProject && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(project.id);
                        }}
                        className="mt-4 py-2 text-center text-[10px] uppercase tracking-widest font-mono font-bold bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-500 hover:text-white rounded transition-all cursor-pointer"
                      >
                        Delete Project
                      </button>
                    )}
                  </div>

                  {/* Hover indicator overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/10 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Floating Action corner circle */}
                  <div className="absolute bottom-6 right-6 w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md">
                    <Maximize2 className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>

      {/* Fullscreen Interactive Spotlight Modal Preview */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#03000a]/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 30 }}
              className="w-full max-w-5xl rounded-3xl bg-[#0c0819] border border-violet-500/25 overflow-hidden shadow-2xl shadow-black relative grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] overflow-y-auto lg:overflow-y-hidden"
            >
              
              {/* Close Button top corner */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-5 right-5 z-40 p-2.5 rounded-full bg-black/60 border border-white/10 hover:border-violet-500/40 text-white transition-all cursor-pointer hover:rotate-90"
              >
                <X className="w-5 h-5" />
              </button>

              {/* View Left Column: Big Media Slider */}
              <div className="lg:col-span-7 bg-black min-h-[300px] lg:min-h-full relative flex items-center justify-center overflow-hidden">
                <img
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  className="w-full h-full object-contain"
                />
                
                {/* Additional Gallery Previews under image */}
                {selectedProject.fullGallery && selectedProject.fullGallery.length > 1 && (
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2.5 bg-[#03000a]/75 backdrop-blur-md p-3 rounded-xl border border-white/5 overflow-x-auto">
                    {selectedProject.fullGallery.map((img, idx) => (
                      <button
                        key={idx}
                        className="w-16 h-12 rounded-lg overflow-hidden border border-white/20 hover:border-violet-400 active:scale-95 transition-all shrink-0 cursor-pointer"
                        onClick={() => setSelectedProject({ ...selectedProject, imageUrl: img })}
                      >
                        <img src={img} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Detail Right Column: metadata details */}
              <div className="lg:col-span-5 p-8 md:p-10 flex flex-col justify-between bg-gradient-to-b from-[#0c0819] to-[#04020a]">
                
                <div>
                  <span className="px-3.5 py-1.5 rounded-full bg-violet-950/40 border border-violet-500/25 text-[9px] font-mono tracking-widest text-violet-300 font-bold uppercase inline-block mb-6">
                    {selectedProject.category}
                  </span>
                  
                  <h3 className="text-2xl md:text-3xl font-display font-medium text-white tracking-tight leading-snug mb-4">
                    {selectedProject.title}
                  </h3>

                  {selectedProject.metrics && (
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-mono font-bold text-emerald-300 tracking-wider">
                        {selectedProject.metrics}
                      </span>
                    </div>
                  )}

                  <p className="text-sm text-gray-400 leading-relaxed font-light mb-8 pt-4 border-t border-white/5">
                    {selectedProject.description}
                  </p>

                  <div className="mb-8">
                    <h5 className="text-[10px] font-mono uppercase text-gray-500 tracking-widest mb-3">Bespoke Design Stack</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tools.map((tag) => (
                        <span key={tag} className="text-xs font-mono px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-violet-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-500">
                    Elite Canvas Premium Portfolio System Suite
                  </span>
                  <a
                    href="#contact"
                    onClick={() => setSelectedProject(null)}
                    className="px-5 py-2.5 text-xs font-mono font-bold uppercase rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:scale-[1.03] transition-all"
                  >
                    Discuss similar project
                  </a>
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
