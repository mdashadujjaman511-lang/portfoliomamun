import { useState, useEffect } from "react";
import { Cpu, Instagram, Chrome, Sparkles, Wand2 } from "lucide-react";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Portfolio from "./components/Portfolio";
import Services from "./components/Services";
import About from "./components/About";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import AdminPanel from "./components/AdminPanel";
import { Project, Testimonial, SiteSettings } from "./types";

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Site copy customizable A to Z
  const [settings, setSettings] = useState<SiteSettings>({
    designerName: "Elite Canvas",
    designerRole: "Creator & Premium Art Designer",
    bioSummary: "I’m Elite Canvas, an award-winning UI/UX designer, digital artwork composite artist, and creator. For over 4 years, I have worked alongside scaling technology startups, legendary gaming tournaments, top tier content creators (collecting 2M+ audience bases), and premium luxury houses.",
    experienceText: "My designs avoid low-effort gradients and boilerplate shapes. I blend high-frequency color palettes, sharp typographic contrasts, and meticulous detail to elevate user trust.",
    whatsappNumber: "1234567890",
    contactEmail: "contact@elitecanvas.com",
    behanceUrl: "https://behance.net",
    dribbbleUrl: "https://dribbble.com",
    instagramUrl: "https://instagram.com",
    heroTitleFirst: "Amplify Visual Identity",
    heroTitleSecond: "with Precision Craft",
    heroSubtitle: "Hi, I’m Elite Canvas — a high-frequency Graphics Designer and Digital Artist. I forge high-conversion thumbnails, elite luxury brand logos, high-adrenaline esports banners, and cinema-grade key art overlays. Let’s turn raw pixels into interactive legacy pieces.",
    skillsText: "Photoshop, Illustrator, Figma, Blender",
    completedThumbnailsCount: "400+",
    combinedReachCount: "180K+",
    retentionScore: "99.2%"
  });
  
  // Admin cabinet state indicators
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [showAdminEntrance, setShowAdminEntrance] = useState(false);

  useEffect(() => {
    fetchRequiredAssets();
    
    // Auto restore session if they already keyed it in during current turn
    const curToken = localStorage.getItem("vandal_admin_session_token");
    if (curToken) {
      setAdminToken(curToken);
      setShowAdminEntrance(true);
    }

    // Parse URL target queries to reveal secret cabin door
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("admin") === "true" || searchParams.get("cabin") === "true") {
      setShowAdminEntrance(true);
      if (!curToken) {
        setIsAdminPanelOpen(true);
      }
    }
  }, []);

  const fetchRequiredAssets = async () => {
    setLoading(true);
    try {
      const projRes = await fetch("/api/projects");
      const projData = await projRes.json();
      if (projData.success) {
        setProjects(projData.projects);
      }

      const testRes = await fetch("/api/testimonials");
      const testData = await testRes.json();
      if (testData.success) {
        setTestimonials(testData.testimonials);
      }

      const settingsRes = await fetch("/api/site-settings");
      const settingsData = await settingsRes.json();
      if (settingsData.success && settingsData.settings) {
        setSettings(settingsData.settings);
      }
    } catch (err) {
      console.error("Failed fetching live portfolio data.", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = (token: string) => {
    setAdminToken(token);
    localStorage.setItem("vandal_admin_session_token", token);
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem("vandal_admin_session_token");
  };

  return (
    <div className="relative min-h-screen bg-[#050506] text-white overflow-hidden flex flex-col selection:bg-cyan-500 selection:text-white">
      
      {/* Absolute Immersive UI Background Lights and Blur Spotlights */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top-left subtle ambient glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#9333ea]/10 blur-[130px] rounded-full" />
        
        {/* Bottom-right cyan ambient light */}
        <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-[#0891b2]/10 blur-[150px] rounded-full" />
        
        {/* Fixed Noise Overlay Layer for Cinema Film Feel */}
        <div className="noise-overlay" />
      </div>

      {/* Dynamic Cursor Replacement */}
      <CustomCursor />

      {/* Primary Landing Navigation */}
      <Navbar
        onOpenAdmin={() => setIsAdminPanelOpen(true)}
        isAdminLoggedIn={!!adminToken}
        onAdminLogout={handleAdminLogout}
        settings={settings}
        showAdminEntrance={showAdminEntrance}
      />

      {/* Secondary App Scroller Screen Space */}
      <main className="relative z-10 flex-1">
        
        {/* 1. HERO SECTION */}
        <Hero settings={settings} />

        {/* 2. PORTFOLIO SHOWCASE MASONRY FILTER GRID */}
        <Portfolio
          projects={projects}
          loading={loading}
          isAdmin={!!adminToken}
          onDeleteProject={async (id) => {
            if (!confirm("Are you sure?")) return;
            const res = await fetch(`/api/projects/${id}`, {
              method: "DELETE",
              headers: { "Authorization": `Bearer ${adminToken}` }
            });
            const d = await res.json();
            if (d.success) {
              fetchRequiredAssets();
            }
          }}
        />

        {/* 3. RESPONSIVE CRITICAL SERVICES */}
        <Services settings={settings} />

        {/* 4. DESIGNER BIO, MILESTONES, AND CAPABILITIES */}
        <About settings={settings} />

        {/* 5. USER TESTIMONIAL MARQUEE AUTO LOOP */}
        {testimonials.length > 0 && (
          <Testimonials testimonials={testimonials} />
        )}

        {/* 6. CONVERSATION CONTACT BRIEF INGESTION */}
        <Contact settings={settings} />

      </main>

      {/* IMMERSIVE UI PREMIUM FOOTER */}
      <footer className="relative z-10 px-8 py-10 border-t border-white/5 bg-black/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest font-mono">Verified Design Stack</span>
              <div className="flex gap-3 mt-1.5 text-gray-400 text-xs font-medium">
                {settings.skillsText.split(",").map((skill, idx) => (
                  <span key={idx}>{skill.trim()}</span>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest font-mono">Social Networks</span>
              <div className="flex gap-3.5 mt-1.5 text-gray-400 text-xs font-medium">
                <a href={settings.behanceUrl || "https://behance.net"} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">Behance</a>
                <a href={settings.dribbbleUrl || "https://dribbble.com"} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">Dribbble</a>
                <a href={settings.instagramUrl || "https://instagram.com"} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">Instagram</a>
              </div>
            </div>
          </div>

          <div className="text-right flex flex-col items-center md:items-end">
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium font-mono mb-1">DESIGN AGENCY STATUS</p>
            <p className="text-sm text-cyan-300 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Currently available for contract works / projects
            </p>
          </div>

        </div>
      </footer>

      {/* ADMIN CONTROL PANEL TERMINAL GATE MODAL */}
      {isAdminPanelOpen && (
        <AdminPanel
          onClose={() => setIsAdminPanelOpen(false)}
          token={adminToken}
          onLoginSuccess={handleAdminLogin}
          projects={projects}
          refreshProjects={fetchRequiredAssets}
          testimonials={testimonials}
          refreshTestimonials={fetchRequiredAssets}
          settings={settings}
          onSettingsUpdated={fetchRequiredAssets}
        />
      )}

      {/* Static quick message button floating */}
      <a
        href="#contact"
        className="fixed bottom-6 right-6 z-30 w-12 h-12 bg-white rounded-full flex items-center justify-center text-black cursor-pointer shadow-2xl hover:scale-110 active:scale-95 transition-transform"
        title="Send direct proposal brief"
      >
        <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </a>

    </div>
  );
}
