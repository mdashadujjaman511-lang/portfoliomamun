import { useState, FormEvent } from "react";
import { Send, CheckCircle2, AlertTriangle, MessageCircle, ArrowRight } from "lucide-react";
import { SiteSettings } from "../types";

export default function Contact({ settings }: { settings: SiteSettings }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "Thumbnail Design",
    budget: "$1,000 - $2,500",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const budgetOptions = [
    "< $500",
    "$500 - $1,000",
    "$1,000 - $2,500",
    "$2,500 - $5,000",
    "$5,000+"
  ];

  const projectTypes = [
    "Thumbnail Design",
    "Elite Logo Design",
    "Branding System",
    "Esports Banner Art",
    "Brutalist Poster Art",
    "Alternative Inquiry"
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitError("Please fill out all primary fields so we can index your secure project brief.");
      return;
    }

    setLoading(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (data.success) {
        setSubmitSuccess(`Visual briefs successfully indexed! ${settings.designerName} will review and consult soon.`);
        setFormData({
          name: "",
          email: "",
          projectType: "Thumbnail Design",
          budget: "$1,000 - $2,500",
          message: ""
        });
      } else {
        setSubmitError(data.error || "System timed out posting message block.");
      }
    } catch (err) {
      setSubmitError("Failed to reach creative server API. Please double check secure connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#050506]">
      {/* Background stardust */}
      <div className="absolute inset-0 bg-repeat bg-center opacity-[0.015] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-950/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left instructions block */}
          <div className="lg:col-span-5">
            <span className="text-[10px] font-mono tracking-[0.3em] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 uppercase">
              SECURE BRIEF INGESTION
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-medium text-white mt-3 mb-6">
              {settings.contactTitle || "Let's create a Visual Legacy"}
            </h2>
            
            <p className="text-sm text-gray-400 font-light leading-relaxed mb-10">
              {settings.contactSubtitle || "Submit your project details directly below. Our automated server parses each proposal layout and immediately notifies me on WhatsApp and Discord so we can respond within 12 hours."}
            </p>

            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#0c0819]/60 border border-white/5">
                <span className="block text-[8px] font-mono tracking-widest text-violet-400 uppercase font-bold">Standard turnaround times</span>
                <p className="text-xs text-white mt-1">Logo designs: 3-5 business days. YouTube Thumbnails/Banners: 24-48 hour hyper delivery slots.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#0c0819]/60 border border-white/5">
                <span className="block text-[8px] font-mono tracking-widest text-cyan-400 uppercase font-bold">Confidentiality Guarantee</span>
                <p className="text-xs text-white mt-1">All pre-launch files, startup concepts, and custom graphics keys are handled under strict NDA protocols.</p>
              </div>

              {/* Direct WhatsApp Action Link */}
              <a
                href={`https://wa.me/${settings.whatsappNumber || "1234567890"}?text=Hello%20${encodeURIComponent(settings.designerName || "Designer")}!%20I%20reviewed%20your%20design%20portfolio%20and%20want%20to%20hire%20you.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/25 hover:border-emerald-500 transition-all text-emerald-300 hover:text-white font-mono text-xs font-bold w-full justify-center group cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400 group-hover:text-white" />
                <span>INSTANT WHATSAPP DIRECT CHAT</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right actual Contact Form */}
          <div className="lg:col-span-7 bg-[#0c0819]/40 border border-violet-500/10 p-8 md:p-10 rounded-2xl relative">
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 mb-2">My Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samantha Brooks"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-black/60 rounded-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-gray-400 mb-2">My Secure Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sam@brooksmedia.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-black/60 rounded-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Project Type selector dropdown */}
              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-400 mb-2.5">Specific Brief Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {projectTypes.map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setFormData({ ...formData, projectType: type })}
                      className={`px-3 py-2 text-left rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                        formData.projectType === type
                          ? "bg-violet-950/45 border-violet-500 text-white font-bold"
                          : "bg-black/40 border-white/5 text-gray-500 hover:border-white/10 hover:text-gray-300"
                      }`}
                    >
                      {formData.projectType === type ? "● " : "○ "}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 3: Budget tier tags selection */}
              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-400 mb-2.5 font-bold">Project Allocation Budget (USD)</label>
                <div className="flex flex-wrap gap-2.5">
                  {budgetOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setFormData({ ...formData, budget: opt })}
                      className={`px-4 py-2 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                        formData.budget === opt
                          ? "bg-cyan-950/45 border-cyan-500 text-cyan-200 font-bold"
                          : "bg-black/40 border-white/5 text-gray-500 hover:border-white/10 hover:text-gray-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Row 4: Custom Message detail textarea */}
              <div>
                <label className="block text-[10px] font-mono uppercase text-gray-400 mb-2">Creative Direction Brief *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide reference links, target audience, dimensions, colors, or core content you would like incorporated."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-black/60 rounded-xl border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm transition-all"
                />
              </div>

              {/* Toast response messages */}
              {submitSuccess && (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              {submitError && (
                <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 text-red-300 text-xs flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 text-white text-xs font-mono font-bold uppercase tracking-wider hover:shadow-xl hover:shadow-violet-600/30 duration-300 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Transmitting secure bytes...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-violet-300" />
                    <span> TRANSMIT SECURE PROJECT BRIEF</span>
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
