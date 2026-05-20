import { useState, useEffect } from "react";
import { Menu, X, ShieldAlert, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SiteSettings } from "../types";

interface NavbarProps {
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onAdminLogout: () => void;
  settings: SiteSettings;
  showAdminEntrance: boolean;
}

export default function Navbar({ onOpenAdmin, isAdminLoggedIn, onAdminLogout, settings, showAdminEntrance }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");

  const menuItems = [
    { name: "Home", href: "#home" },
    { name: "Work", href: "#work" },
    { name: "Services", href: "#services" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Basic scroll spy
      const sections = menuItems.map(item => document.getElementById(item.name.toLowerCase()));
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveTab(menuItems[i].name);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
          isScrolled
            ? "py-4 bg-[#03000a]/75 backdrop-blur-md border-b border-violet-500/10 shadow-lg shadow-black/45"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Brand Logo */}
          <a href="#home" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 overflow-hidden shadow-md shadow-violet-500/15">
              <Cpu className="w-5 h-5 text-white animate-pulse" />
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <span className="font-display font-medium text-lg leading-tight tracking-wider bg-gradient-to-r from-violet-200 via-white to-cyan-300 bg-clip-text text-transparent uppercase">
                {settings.designerName.split(" ")[0]}
              </span>
              <span className="block text-[8px] font-mono tracking-[0.3em] uppercase text-violet-400 font-bold">
                {settings.designerName.split(" ").slice(1).join(" ") || "STUDIOS"}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setActiveTab(item.name)}
                className={`relative px-4 py-1.5 text-xs font-medium tracking-wide rounded-full transition-all duration-300 ${
                  activeTab === item.name
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {activeTab === item.name && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-700 rounded-full -z-10 shadow-sm shadow-violet-500/30"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {item.name}
              </a>
            ))}
          </nav>

          {/* Actions panel */}
          <div className="hidden md:flex items-center gap-3">
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAdmin}
                  className="px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-all text-emerald-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Admin Cabin
                </button>
                <button
                  onClick={onAdminLogout}
                  className="px-3 py-2 text-xs font-mono rounded-lg border border-red-500/20 hover:border-red-500/60 hover:text-red-300 text-gray-400 transition-all cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : showAdminEntrance ? (
              <button
                onClick={onOpenAdmin}
                className="px-4 py-2 text-xs font-mono font-medium rounded-lg text-white hover:text-cyan-300 border border-white/10 hover:border-cyan-500/40 bg-white/5 hover:translate-y-[-1px] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-violet-400" />
                <span>Sign In</span>
              </button>
            ) : null}

            <a
              href="#contact"
              className="px-5 py-2 text-xs font-mono font-semibold tracking-wider rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 text-white hover:shadow-lg hover:shadow-violet-600/30 hover:scale-[1.03] transition-all cursor-pointer"
            >
              H_IRE ME
            </a>
          </div>

          {/* Mobile Menu Button Router */}
          <div className="md:hidden flex items-center gap-2.5">
            {isAdminLoggedIn && (
              <button
                onClick={onOpenAdmin}
                className="p-2 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-300"
              >
                <Cpu className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg border border-white/10 bg-[#0c0819]/60 text-white hover:border-violet-500/30 transition-all"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu Backdrop Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 pt-24 pb-10 px-8 bg-[#04020a]/98 backdrop-blur-lg flex flex-col justify-between md:hidden border-b border-violet-500/10"
          >
            <div className="flex flex-col gap-6 mt-6">
              {menuItems.map((item, idx) => (
                <motion.a
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    setActiveTab(item.name);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-2xl font-display font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-500 hover:to-violet-400 transition-all py-1"
                >
                  {item.name}
                </motion.a>
              ))}
            </div>

            <div className="flex flex-col gap-3 mt-10">
              {isAdminLoggedIn ? (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full py-3 rounded-lg text-center font-mono font-bold text-xs bg-emerald-600/20 border border-emerald-500/40 text-emerald-300"
                >
                  ADMIN INSTRUMENT PANEL
                </button>
              ) : showAdminEntrance ? (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full py-3 rounded-lg text-center font-mono text-xs bg-white/5 border border-white/10 text-gray-300"
                >
                  SIGN IN AS ADMIN
                </button>
              ) : null}
              
              <a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-4.5 rounded-xl text-center font-mono font-bold text-sm bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-xl shadow-violet-500/20"
              >
                PROPOSE PROJECT
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
