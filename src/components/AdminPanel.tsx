import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { 
  X, LayoutGrid, Monitor, User, Briefcase, Tags, 
  Wand2, CreditCard, Quote, FileText, Mail, MessageSquare, 
  Share2, Globe, Sliders, Database, Trash2, Edit, Plus, Search, 
  Lock, Eye, CheckCircle2, ShieldAlert
} from "lucide-react";
import { Project, Message, Testimonial, SiteSettings } from "../types";

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverUrl: string;
  date: string;
  tag: string;
}

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  features: string;
  tag?: string;
}

interface AdminPanelProps {
  onClose: () => void;
  token: string | null;
  onLoginSuccess: (token: string) => void;
  projects: Project[];
  refreshProjects: () => void;
  testimonials: Testimonial[];
  refreshTestimonials: () => void;
  settings: SiteSettings;
  onSettingsUpdated: () => void;
}

type TabType = 
  | "dashboard"
  | "hero"
  | "about"
  | "portfolio"
  | "categories"
  | "services"
  | "pricing"
  | "testimonials"
  | "blog"
  | "inquiries"
  | "hire_settings"
  | "socials"
  | "seo"
  | "general"
  | "seed";

interface ImageUploaderFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onRandomMock?: () => void;
}

function ImageUploaderField({ label, value, onChange, onRandomMock }: ImageUploaderFieldProps) {
  const fileInputId = "file-" + label.toLowerCase().replace(/[^a-z0-9]/g, "-");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 20 * 1024 * 1024) {
      alert("Image size must be less than 20MB.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onChange(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-semibold text-gray-400">{label}</label>
        {onRandomMock && (
          <button 
            type="button" 
            onClick={onRandomMock} 
            className="text-[10px] text-[#2563eb] hover:underline cursor-pointer font-medium"
          >
            Random Preview
          </button>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... or upload local image"
          className="flex-1 px-4 py-2 bg-[#0c0c10] border border-white/5 rounded-lg text-white text-xs placeholder-gray-600 focus:outline-none focus:border-[#2563eb]"
        />
        <div className="flex shrink-0 gap-1.5">
          <label 
            htmlFor={fileInputId} 
            className="px-3.5 py-2.5 bg-[#2563eb] hover:bg-blue-600 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center justify-center gap-1 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span>Upload Device</span>
          </label>
          <input
            id={fileInputId}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
      {value && value.startsWith("data:") && (
        <span className="text-[9px] font-mono text-cyan-400 block truncate max-w-full">
          ✓ Locally uploaded image (Base64 encoded)
        </span>
      )}
    </div>
  );
}

export default function AdminPanel({
  onClose,
  token,
  onLoginSuccess,
  projects,
  refreshProjects,
  testimonials,
  refreshTestimonials,
  settings,
  onSettingsUpdated
}: AdminPanelProps) {
  // Login credentials states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  // Workspace tabs
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  // Extensively loaded local dynamic states
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [socialLinks, setSocialLinks] = useState<any>({});
  const [seoSettings, setSeoSettings] = useState<any>({});
  
  // Form submission notifications
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Inquiries Inbox
  const [inquiries, setInquiries] = useState<Message[]>([]);

  // Editing and Creation Dialog States
  const [projectEditItem, setProjectEditItem] = useState<Project | null>(null);
  const [testimonialEditItem, setTestimonialEditItem] = useState<Testimonial | null>(null);
  const [blogEditItem, setBlogEditItem] = useState<Blog | null>(null);
  const [pricingEditItem, setPricingEditItem] = useState<PricingPlan | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Dynamic configuration states mapped
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({ ...settings });
  
  // Simple creation forms
  const [newProject, setNewProject] = useState({
    title: "",
    category: "",
    imageUrl: "",
    description: "",
    metrics: "",
    tools: ""
  });

  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    role: "",
    comment: "",
    rating: 5,
    avatarUrl: ""
  });

  const [newBlog, setNewBlog] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverUrl: "",
    tag: "",
    date: ""
  });

  const [newPricing, setNewPricing] = useState({
    name: "",
    price: "",
    features: "",
    tag: ""
  });

  const [newCategoryName, setNewCategoryName] = useState("");

  // Initialize and load dynamic settings
  useEffect(() => {
    if (settings) {
      setSettingsForm({ ...settings });
    }
  }, [settings]);

  useEffect(() => {
    if (token) {
      fetchInboxAndDynamicAssets();
    }
  }, [token]);

  const fetchInboxAndDynamicAssets = async () => {
    try {
      const headers = { "Authorization": `Bearer ${token}` };

      // Fetch inquiries
      const msgRes = await fetch("/api/messages", { headers });
      const msgData = await msgRes.json();
      if (msgData.success) {
        setInquiries(msgData.messages);
      }

      // Fetch blogs
      const blogRes = await fetch("/api/blogs");
      const blogData = await blogRes.json();
      if (blogData.success) {
        setBlogs(blogData.blogs);
      }

      // Fetch categories
      const catRes = await fetch("/api/categories");
      const catData = await catRes.json();
      if (catData.success) {
        setCategories(catData.categories);
        if (catData.categories.length > 0 && !newProject.category) {
          setNewProject(p => ({ ...p, category: catData.categories[0] }));
        }
      }

      // Fetch pricing plans
      const prRes = await fetch("/api/pricing");
      const prData = await prRes.json();
      if (prData.success) {
        setPricingPlans(prData.pricingPlans);
      }

      // Fetch socials
      const socRes = await fetch("/api/socials");
      const socData = await socRes.json();
      if (socData.success) {
        setSocialLinks(socData.socialLinks);
      }

      // Fetch SEO
      const seoRes = await fetch("/api/seo");
      const seoData = await seoRes.json();
      if (seoData.success) {
        setSeoSettings(seoData.seoSettings);
      }
    } catch (err) {
      console.error("Failed fetching dynamic databases", err);
    }
  };

  // Notification Helpers
  const triggerSuccessMsg = (msg: string) => {
    setActionSuccess(msg);
    setActionError(null);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const triggerErrorMsg = (msg: string) => {
    setActionError(msg);
    setActionSuccess(null);
    setTimeout(() => setActionError(null), 4000);
  };

  // Primary Login Handler
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        onLoginSuccess(data.token);
      } else {
        setLoginError(data.error || "Access Denied: Invalid email address or credentials.");
      }
    } catch (err) {
      setLoginError("Failed to establish a safe database connection.");
    }
  };

  // Reset database entirely to original seeds
  const handleResetDatabase = async () => {
    if (!confirm("CRITICAL WARNING: This will immediately delete all your custom edited metrics, listings, inquiries, portfolio entries, blogs, categories, and reset the admin auth credentials to mdashadujjaman511@gmail.com with password PIN admin123. Are you absolutely sure?")) return;
    try {
      const res = await fetch("/api/admin/reset-database", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccessMsg("Database restored successfully!");
        refreshProjects();
        refreshTestimonials();
        fetchInboxAndDynamicAssets();
        onSettingsUpdated();
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      triggerErrorMsg("Operation failed.");
    }
  };

  // 1. SAVE SITE SETTINGS (Common wrapper)
  const handleSaveSiteSettings = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/site-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(settingsForm)
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccessMsg("Updates saved successfully!");
        onSettingsUpdated();
      } else {
        triggerErrorMsg("Server rejected update settings action.");
      }
    } catch (err) {
      triggerErrorMsg("Network fail saving settings.");
    }
  };

  // 2. PROJECT OPERATIONS (CRUD)
  const handleAddProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.imageUrl || !newProject.description) {
      triggerErrorMsg("Required: Title, Image URL, and Description.");
      return;
    }
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newProject,
          tools: newProject.tools.split(",").map(t => t.trim())
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccessMsg(`Project "${newProject.title}" published!`);
        setNewProject({ title: "", category: categories[0] || "", imageUrl: "", description: "", metrics: "", tools: "" });
        setShowAddModal(false);
        refreshProjects();
      }
    } catch (err) {
      triggerErrorMsg("Error submitting project.");
    }
  };

  const handleUpdateProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!projectEditItem) return;
    try {
      const res = await fetch(`/api/projects/${projectEditItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...projectEditItem,
          tools: Array.isArray(projectEditItem.tools) 
            ? projectEditItem.tools 
            : (projectEditItem.tools as string).split(",").map((s: string) => s.trim())
        })
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccessMsg("Project updated successfully!");
        setProjectEditItem(null);
        refreshProjects();
      }
    } catch (err) {
      triggerErrorMsg("Failed updating project.");
    }
  };

  const handleDeleteProject = async (id: string, name: string) => {
    if (!confirm(`Do you really want to delete project: "${name}"?`)) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccessMsg("Project deleted.");
        refreshProjects();
      }
    } catch (err) {
      triggerErrorMsg("Delete failed.");
    }
  };

  // 3. CATEGORY OPERATIONS (CRUD in page)
  const handleAddCategoryOnList = async (e: FormEvent) => {
    e.preventDefault();
    const cleanName = newCategoryName.trim();
    if (!cleanName) return;
    if (categories.includes(cleanName)) {
      triggerErrorMsg("Category already exists.");
      return;
    }
    const updated = [...categories, cleanName];
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ categories: updated })
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccessMsg(`Added "${cleanName}" category!`);
        setNewCategoryName("");
        setCategories(data.categories);
      }
    } catch (err) {
      triggerErrorMsg("Error saving category.");
    }
  };

  const handleDeleteCategoryFromList = async (cat: string) => {
    if (!confirm(`Are you sure you want to remove "${cat}"? This might make some projects Category Tag stale.`)) return;
    const updated = categories.filter(c => c !== cat);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ categories: updated })
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccessMsg(`Removed "${cat}" category.`);
        setCategories(data.categories);
      }
    } catch (err) {
      triggerErrorMsg("Failed category extraction.");
    }
  };

  // 4. TESTIMONIALS OPERATIONS (CRUD)
  const handleAddTestimonial = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.name || !newTestimonial.role || !newTestimonial.comment) {
      triggerErrorMsg("Fill crucial client details.");
      return;
    }
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newTestimonial)
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccessMsg(`Testimonial for ${newTestimonial.name} published.`);
        setNewTestimonial({ name: "", role: "", comment: "", rating: 5, avatarUrl: "" });
        setShowAddModal(false);
        refreshTestimonials();
      }
    } catch (err) {
      triggerErrorMsg("Error saving testimonial.");
    }
  };

  const handleUpdateTestimonial = async (e: FormEvent) => {
    e.preventDefault();
    if (!testimonialEditItem) return;
    try {
      const res = await fetch(`/api/testimonials/${testimonialEditItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(testimonialEditItem)
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccessMsg("Testimonial updated!");
        setTestimonialEditItem(null);
        refreshTestimonials();
      }
    } catch (err) {
      triggerErrorMsg("Testimonial update failed.");
    }
  };

  const handleDeleteTestimonial = async (id: string, client: string) => {
    if (!confirm(`Remove feedback for: "${client}"?`)) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccessMsg("Feedback deleted.");
        refreshTestimonials();
      }
    } catch (err) {
      triggerErrorMsg("Delete failed.");
    }
  };

  // 5. BLOG OPERATIONS (CRUD)
  const handleAddBlog = async (e: FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.content || !newBlog.excerpt) {
      triggerErrorMsg("Fill title, excerpt, and core post story content.");
      return;
    }
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newBlog)
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccessMsg(`Article "${newBlog.title}" published.`);
        setNewBlog({ title: "", excerpt: "", content: "", coverUrl: "", tag: "", date: "" });
        setShowAddModal(false);
        fetchInboxAndDynamicAssets();
      }
    } catch (err) {
      triggerErrorMsg("Error publishing blog.");
    }
  };

  const handleUpdateBlog = async (e: FormEvent) => {
    e.preventDefault();
    if (!blogEditItem) return;
    try {
      const res = await fetch(`/api/blogs/${blogEditItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(blogEditItem)
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccessMsg("Blog updated!");
        setBlogEditItem(null);
        fetchInboxAndDynamicAssets();
      }
    } catch (err) {
      triggerErrorMsg("Blog update failed.");
    }
  };

  const handleDeleteBlog = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete blog: "${title}"?`)) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccessMsg("Blog post removed.");
        fetchInboxAndDynamicAssets();
      }
    } catch (err) {
      triggerErrorMsg("Delete failed.");
    }
  };

  // 6. PRICING OPERATIONS (CRUD)
  const handleAddPricing = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPricing.name || !newPricing.price || !newPricing.features) {
      triggerErrorMsg("Fill name, price, and features.");
      return;
    }
    try {
      const res = await fetch("/api/pricing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newPricing)
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccessMsg(`Pricing active: ${newPricing.name}`);
        setNewPricing({ name: "", price: "", features: "", tag: "" });
        setShowAddModal(false);
        fetchInboxAndDynamicAssets();
      }
    } catch (err) {
      triggerErrorMsg("Error saving pricing package.");
    }
  };

  const handleUpdatePricing = async (e: FormEvent) => {
    e.preventDefault();
    if (!pricingEditItem) return;
    try {
      const res = await fetch(`/api/pricing/${pricingEditItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(pricingEditItem)
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccessMsg("Pricing plan saved!");
        setPricingEditItem(null);
        fetchInboxAndDynamicAssets();
      }
    } catch (err) {
      triggerErrorMsg("Pricing plan shift failed.");
    }
  };

  const handleDeletePricing = async (id: string, name: string) => {
    if (!confirm(`Delete plan: "${name}"?`)) return;
    try {
      const res = await fetch(`/api/pricing/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccessMsg("Pricing Plan removed.");
        fetchInboxAndDynamicAssets();
      }
    } catch (err) {
      triggerErrorMsg("Delete failed.");
    }
  };

  // 7. INBOX MESSAGE OPERATIONS
  const handleMarkReadInquiry = async (id: string) => {
    try {
      const res = await fetch(`/api/messages/read/${id}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchInboxAndDynamicAssets();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message forever?")) return;
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccessMsg("Inbox message removed.");
        fetchInboxAndDynamicAssets();
      }
    } catch (err) {
      triggerErrorMsg("Action failed.");
    }
  };

  // 8. SOCIAL LINKS UPDATE
  const handleSaveSocials = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/socials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(socialLinks)
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccessMsg("Social networks updated successfully!");
        fetchInboxAndDynamicAssets();
        // Trigger generic setting update to hydrate footer/header
        onSettingsUpdated();
      }
    } catch (err) {
      triggerErrorMsg("Error saving socials.");
    }
  };

  // 9. SEO SETTINGS UPDATE
  const handleSaveSeo = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(seoSettings)
      });
      const data = await res.json();
      if (data.success) {
        triggerSuccessMsg("SEO parameters successfully saved!");
        fetchInboxAndDynamicAssets();
      }
    } catch (err) {
      triggerErrorMsg("Failed committing SEO parameters.");
    }
  };

  // 10. GENERAL CONFIGURATION (Credentials & App details)
  const handleSaveGeneralSettings = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Step A: Save custom email PIN code settings
      const passwordResponse = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          newEmail: settingsForm.contactEmail || undefined, 
          newPassword: password ? password : undefined 
        })
      });
      
      const pwdData = await passwordResponse.json();
      if (pwdData.success) {
        // Step B: Update Site Name via Settings
        const siteResponse = await fetch("/api/site-settings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(settingsForm)
        });

        const siteData = await siteResponse.json();
        if (siteData.success) {
          triggerSuccessMsg("General settings & credentials saved securely.");
          setPassword("");
          onSettingsUpdated();
        } else {
          triggerErrorMsg("General Site details update rejected.");
        }
      } else {
        triggerErrorMsg(pwdData.error || "Credentials change rejected.");
      }
    } catch (err) {
      triggerErrorMsg("Communications network issue.");
    }
  };

  // Random placeholder mock generator
  const handleMockUrlGenerator = (type: "project" | "blog" | "testimonial") => {
    const urls = [
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1561715276-a2d087060f1d?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1567095117738-4334f2de3fc4?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop"
    ];
    const pick = urls[Math.floor(Math.random() * urls.length)];
    if (type === "project") {
      setNewProject(p => ({ ...p, imageUrl: pick }));
      if (projectEditItem) setProjectEditItem(p => p ? { ...p, imageUrl: pick } : null);
    } else if (type === "blog") {
      setNewBlog(b => ({ ...b, coverUrl: pick }));
      if (blogEditItem) setBlogEditItem(b => b ? { ...b, coverUrl: pick } : null);
    } else {
      setNewTestimonial(t => ({ ...t, avatarUrl: pick }));
      if (testimonialEditItem) setTestimonialEditItem(t => t ? { ...t, avatarUrl: pick } : null);
    }
  };

  // Tab Item Renderer helper (Side Link)
  const renderSidebarLink = (id: TabType, label: string, IconComponent: any) => {
    const isActive = activeTab === id;
    return (
      <button
        key={id}
        onClick={() => {
          setActiveTab(id);
          setProjectEditItem(null);
          setTestimonialEditItem(null);
          setBlogEditItem(null);
          setPricingEditItem(null);
          setShowAddModal(false);
        }}
        className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-lg text-xs font-sans tracking-wide transition-all cursor-pointer text-left ${
          isActive 
            ? "bg-[#2563eb] text-white font-bold" 
            : "text-gray-400 hover:text-white hover:bg-white/5"
        }`}
      >
        <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-gray-500 group-hover:text-white"}`} />
        <span className="truncate">{label}</span>
      </button>
    );
  };

  // Helper values
  const activeUnreadCount = inquiries.filter(i => i.status === "unread").length;

  return (
    <div className="fixed inset-0 z-50 bg-[#07070a]/95 backdrop-blur-md flex items-center justify-center p-0 md:p-6 font-sans text-xs antialiased text-gray-200">
      
      {/* Container Frame styled cleanly with a dark/black aesthetic and sleek borders */}
      <div className="w-full h-full md:max-h-[92vh] max-w-7xl bg-[#0d0d12] border-0 md:border border-white/5 rounded-none md:rounded-xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* TOP STATUS BAR CONTAINER */}
        <div className="px-6 py-4.5 bg-[#09090d] border-b border-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 bg-white/5 border border-white/10 rounded flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#2563eb] rounded-full animate-pulse" />
              <span className="text-[10px] font-mono tracking-wider font-semibold text-gray-400">ADMIN CONTROL PANEL</span>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="px-3.5 py-2 hover:bg-white/5 text-gray-400 hover:text-white rounded-lg transition-all text-xs cursor-pointer flex items-center gap-1.5"
          >
            <X className="w-4 h-4" /> Exit Mode
          </button>
        </div>

        {/* WORKSPACE DIVIDER */}
        {!token ? (
          /* LOGIN FORM - CLEAN, REFINED SANS INTER WITHOUT MONOSPACE CLUTTER */
          <div className="flex-1 overflow-y-auto flex items-center justify-center py-12 px-6">
            <div className="w-full max-w-sm space-y-6">
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#2563eb] mx-auto">
                  <Lock className="w-5 h-5 text-blue-500" />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">Administrator Access Guard</h2>
                <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
                  Sign in using your administrative credentials to update portfolios, posts, and details.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-400">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#13131a] rounded-lg border border-white/5 text-white text-xs focus:outline-none focus:border-[#2563eb] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-400">Credentials Passkey PIN</label>
                  <input
                    type="password"
                    required
                    placeholder="e.g. admin123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[#13131a] rounded-lg border border-white/5 text-white text-xs focus:outline-none focus:border-[#2563eb] transition-all"
                  />
                </div>

                {loginError && (
                  <div className="px-4 py-2.5 bg-red-950/20 border border-red-500/20 rounded-lg text-red-400 text-center">
                    ● {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#2563eb] hover:bg-blue-600 text-white rounded-lg text-xs font-bold tracking-wide uppercase transition-all duration-200 shadow-lg cursor-pointer text-center"
                >
                  Confirm Administrative Login
                </button>
              </form>

            </div>
          </div>
        ) : (
          /* CORE ADMIN PANEL SYSTEM - TWO COLUMN SIDEBAR & DESK */
          <div className="flex-1 flex flex-col md:flex-row min-h-0 bg-[#0c0c10]">
            
            {/* LEFT COMPACT LIST SIDEBAR - HUMBLE INTER SANS LABELS */}
            <div className="w-full md:w-60 bg-[#09090d] border-r border-white/5 p-4.5 flex flex-col gap-1 shrink-0 overflow-y-auto">
              {/* Logo exactly styled like ADMINDASH in screenshot */}
              <div className="px-3 mb-6">
                <h1 className="text-lg tracking-wider font-extrabold text-white flex items-center gap-1">
                  ADMIN<span className="text-[#2563eb]">DASH</span>
                </h1>
                <p className="text-[9px] font-mono tracking-widest text-[#2563eb]/70 mt-0.5">VERSION 4.2 LIVE</p>
              </div>

              <div className="space-y-1">
                {renderSidebarLink("dashboard", "Dashboard", LayoutGrid)}
                {renderSidebarLink("hero", "Hero Section", Monitor)}
                {renderSidebarLink("about", "About Me", User)}
                {renderSidebarLink("portfolio", `Portfolio (${projects.length})`, Briefcase)}
                {renderSidebarLink("categories", "Categories", Tags)}
                {renderSidebarLink("services", "Services", Wand2)}
                {renderSidebarLink("pricing", "Pricing", CreditCard)}
                {renderSidebarLink("testimonials", `Testimonials (${testimonials.length})`, Quote)}
                {renderSidebarLink("blog", `Blog (${blogs.length})`, FileText)}
                
                <button
                  onClick={() => {
                    setActiveTab("inquiries");
                    setProjectEditItem(null);
                    setShowAddModal(false);
                  }}
                  className={`w-full flex items-center justify-between px-4.5 py-3 rounded-lg text-xs font-sans tracking-wide transition-all cursor-pointer ${
                    activeTab === "inquiries" 
                      ? "bg-[#2563eb] text-white font-bold" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span>Inbound Inquiries</span>
                  </div>
                  {activeUnreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      {activeUnreadCount}
                    </span>
                  )}
                </button>

                {renderSidebarLink("hire_settings", "Hire Me Settings", MessageSquare)}
                {renderSidebarLink("socials", "Social Links", Share2)}
                {renderSidebarLink("seo", "SEO Settings", Globe)}
                {renderSidebarLink("general", "General Settings", Sliders)}
                {renderSidebarLink("seed", "Seed Data", Database)}
              </div>

              {/* Bottom administrator status box */}
              <div className="mt-8 pt-4 border-t border-white/5 px-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-gray-500 font-bold uppercase text-[10px]">
                    {settingsForm.designerName.slice(0, 2)}
                  </div>
                  <div className="truncate">
                    <p className="text-[10px] text-white font-bold truncate">{settingsForm.designerName}</p>
                    <p className="text-[9px] text-gray-500 truncate">Local Database</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN MAIN COMPACT WORKSPACE */}
            <div className="flex-1 p-6 md:p-9 overflow-y-auto bg-[#0a0a0d] flex flex-col justify-start min-h-0 relative">
              
              {/* SUCCESS / ERROR INLINE Banner */}
              {actionSuccess && (
                <div className="absolute top-4 left-6 right-6 z-20 px-4 py-3 bg-green-950/20 border border-green-500/20 rounded-lg text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> {actionSuccess}
                </div>
              )}
              {actionError && (
                <div className="absolute top-4 left-6 right-6 z-20 px-4 py-3 bg-red-950/20 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> {actionError}
                </div>
              )}

              {/* HEADER ROW OF SELECTED WORKSPACE SECTION */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white capitalize">
                    {activeTab === "hire_settings" ? "Hire Me Settings" : activeTab === "seo" ? "SEO Settings" : activeTab === "seed" ? "Seed Data" : activeTab + " Configuration"}
                  </h2>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Manage real, persistent portfolio layout copy and metadata values securely
                  </p>
                </div>

                {/* Primary dynamic actions triggers (Add Project / Add Item) */}
                {activeTab === "portfolio" && !projectEditItem && (
                  <button
                    onClick={() => { setShowAddModal(true); setProjectEditItem(null); }}
                    className="px-4 py-2.5 bg-[#2563eb] hover:bg-blue-600 text-white rounded-lg font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg"
                  >
                    <Plus className="w-4 h-4" /> Add Project
                  </button>
                )}
                {activeTab === "testimonials" && !testimonialEditItem && (
                  <button
                    onClick={() => { setShowAddModal(true); setTestimonialEditItem(null); }}
                    className="px-4 py-2.5 bg-[#2563eb] hover:bg-blue-600 text-white rounded-lg font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg"
                  >
                    <Plus className="w-4 h-4" /> Add Testimonial
                  </button>
                )}
                {activeTab === "blog" && !blogEditItem && (
                  <button
                    onClick={() => { setShowAddModal(true); setBlogEditItem(null); }}
                    className="px-4 py-2.5 bg-[#2563eb] hover:bg-blue-600 text-white rounded-lg font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg"
                  >
                    <Plus className="w-4 h-4" /> Write Article
                  </button>
                )}
                {activeTab === "pricing" && !pricingEditItem && (
                  <button
                    onClick={() => { setShowAddModal(true); setPricingEditItem(null); }}
                    className="px-4 py-2.5 bg-[#2563eb] hover:bg-blue-600 text-white rounded-lg font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg"
                  >
                    <Plus className="w-4 h-4" /> Add Pricing Pack
                  </button>
                )}
              </div>

              {/* 1. DASHBOARD OVERVIEW TAB */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  {/* Grid statistics elements */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 bg-[#0f0f14] border border-white/5 rounded-xl">
                      <span className="text-gray-400 text-xs block">Active Projects</span>
                      <span className="text-2xl font-bold text-white block mt-2">{projects.length}</span>
                    </div>
                    <div className="p-5 bg-[#0f0f14] border border-white/5 rounded-xl">
                      <span className="text-gray-400 text-xs block">Form Inquiries</span>
                      <span className="text-2xl font-bold text-white block mt-2">{inquiries.length}</span>
                      {activeUnreadCount > 0 && (
                        <span className="text-[10px] text-red-400 mt-1 block">● {activeUnreadCount} unread message(s)</span>
                      )}
                    </div>
                    <div className="p-5 bg-[#0f0f14] border border-white/5 rounded-xl">
                      <span className="text-gray-400 text-xs block">Client Testimonials</span>
                      <span className="text-2xl font-bold text-white block mt-2">{testimonials.length}</span>
                    </div>
                    <div className="p-5 bg-[#0f0f14] border border-white/5 rounded-xl">
                      <span className="text-gray-400 text-xs block">Blog Posts</span>
                      <span className="text-2xl font-bold text-white block mt-2">{blogs.length}</span>
                    </div>
                  </div>

                  {/* Quick summary logging list */}
                  <div className="p-6 bg-[#0f0f14] border border-white/5 rounded-xl space-y-4">
                    <h3 className="text-sm font-bold text-white">Latest Registered System Connections</h3>
                    {inquiries.length === 0 ? (
                      <p className="text-xs text-gray-500 italic">No activity or form inquiries logged yet. Share your portfolio or submit the homepage form!</p>
                    ) : (
                      <div className="divide-y divide-white/5">
                        {inquiries.slice(0, 4).map((msg) => (
                          <div key={msg.id} className="py-3 flex justify-between items-center text-xs">
                            <div>
                              <span className="font-bold text-white">{msg.name}</span>
                              <span className="text-gray-500 ml-2">({msg.email})</span>
                              <p className="text-gray-400 mt-0.5 font-sans truncate max-w-lg">{msg.message}</p>
                            </div>
                            <span className="text-[10px] font-mono text-gray-500 shrink-0 select-none">
                              {new Date(msg.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. HERO SECTION FORM */}
              {activeTab === "hero" && (
                <form onSubmit={handleSaveSiteSettings} className="space-y-6">
                  <div className="bg-[#0f0f14] border border-white/5 p-6 rounded-xl space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">Hero Main Headline (Regular Text)</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.heroTitleFirst}
                          onChange={(e) => setSettingsForm({ ...settingsForm, heroTitleFirst: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs focus:outline-none focus:border-[#2563eb]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">Hero Secondary Headline (Gradient/Blue text)</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.heroTitleSecond}
                          onChange={(e) => setSettingsForm({ ...settingsForm, heroTitleSecond: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs focus:outline-none focus:border-[#2563eb]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs text-gray-400">Hero Subtitle Paragraph Narrative</label>
                      <textarea
                        rows={3}
                        required
                        value={settingsForm.heroSubtitle}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                        className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs focus:outline-none focus:border-[#2563eb]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">Completed Assets Stat Count</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.completedThumbnailsCount}
                          onChange={(e) => setSettingsForm({ ...settingsForm, completedThumbnailsCount: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs focus:outline-none focus:border-[#2563eb]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">Combined Reach Stat Count</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.combinedReachCount}
                          onChange={(e) => setSettingsForm({ ...settingsForm, combinedReachCount: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs focus:outline-none focus:border-[#2563eb]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">Retention Score Tag</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.retentionScore}
                          onChange={(e) => setSettingsForm({ ...settingsForm, retentionScore: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs focus:outline-none focus:border-[#2563eb]"
                        />
                      </div>
                    </div>

                    {/* Unique Profile fields for Hero active stage banner */}
                    <div className="pt-5 border-t border-white/5 space-y-4">
                      <h4 className="text-xs font-bold text-[#a78bfa] uppercase tracking-wider">
                        Personal Profile & Mockup Identification
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        Customize the profile picture, display name, and subtitle shown inside the 3D-style active rendering layer mockup on your homepage.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs text-gray-400">Profile Name (Mockup Display)</label>
                          <input
                            type="text"
                            placeholder="e.g. Md Asadujjaman"
                            value={settingsForm.personalName || ""}
                            onChange={(e) => setSettingsForm({ ...settingsForm, personalName: e.target.value })}
                            className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs focus:outline-none focus:border-[#2563eb]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs text-gray-400">Subtitle Details (Shown in Mockup)</label>
                          <input
                            type="text"
                            placeholder="e.g. Visual Specialist & Lead Designer"
                            value={settingsForm.personalDetails || ""}
                            onChange={(e) => setSettingsForm({ ...settingsForm, personalDetails: e.target.value })}
                            className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs focus:outline-none focus:border-[#2563eb]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs text-gray-400">Personal Phone / WhatsApp</label>
                          <input
                            type="text"
                            placeholder="e.g. +880 1700-000000"
                            value={settingsForm.personalPhone || ""}
                            onChange={(e) => setSettingsForm({ ...settingsForm, personalPhone: e.target.value })}
                            className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs focus:outline-none focus:border-[#2563eb]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs text-gray-400">Personal Email</label>
                          <input
                            type="email"
                            placeholder="e.g. designer@example.com"
                            value={settingsForm.personalEmail || ""}
                            onChange={(e) => setSettingsForm({ ...settingsForm, personalEmail: e.target.value })}
                            className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs focus:outline-none focus:border-[#2563eb]"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs text-gray-400">Personal Location</label>
                          <input
                            type="text"
                            placeholder="e.g. Dhaka, Bangladesh"
                            value={settingsForm.personalLocation || ""}
                            onChange={(e) => setSettingsForm({ ...settingsForm, personalLocation: e.target.value })}
                            className="w-full px-4 py-2.5 bg-[#0e0d14] rounded-lg border border-white/5 text-white text-xs focus:outline-none focus:border-[#2563eb]"
                          />
                        </div>
                      </div>

                      <ImageUploaderField
                        label="Personal Profile Picture (Device select converting to local base64)"
                        value={settingsForm.personalPhoto || ""}
                        onChange={(val) => setSettingsForm({ ...settingsForm, personalPhoto: val })}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-3 bg-[#2563eb] hover:bg-blue-600 font-bold rounded-lg text-xs cursor-pointer text-white"
                  >
                    Save Changes
                  </button>
                </form>
              )}

              {/* 3. ABOUT ME FORM */}
              {activeTab === "about" && (
                <form onSubmit={handleSaveSiteSettings} className="space-y-6">
                  <div className="bg-[#0f0f14] border border-white/5 p-6 rounded-xl space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs text-gray-400">Primary Biographical Story Summary</label>
                      <textarea
                        rows={4}
                        required
                        value={settingsForm.bioSummary}
                        onChange={(e) => setSettingsForm({ ...settingsForm, bioSummary: e.target.value })}
                        className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs focus:outline-none focus:border-[#2563eb]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs text-gray-400">Secondary Experience Narrative Detail</label>
                      <textarea
                        rows={3}
                        required
                        value={settingsForm.experienceText}
                        onChange={(e) => setSettingsForm({ ...settingsForm, experienceText: e.target.value })}
                        className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs focus:outline-none focus:border-[#2563eb]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">Milestone 1 Core Title</label>
                        <input
                          type="text"
                          value={settingsForm.milestone1Title || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, milestone1Title: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">Milestone 1 Subtext Description</label>
                        <input
                          type="text"
                          value={settingsForm.milestone1Desc || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, milestone1Desc: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">Milestone 2 Core Title</label>
                        <input
                          type="text"
                          value={settingsForm.milestone2Title || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, milestone2Title: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">Milestone 2 Subtext Description</label>
                        <input
                          type="text"
                          value={settingsForm.milestone2Desc || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, milestone2Desc: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-4 border-t border-white/5">
                      <label className="block text-xs text-gray-400">Designer Technical Inventory List (Comma Separated)</label>
                      <input
                        type="text"
                        required
                        value={settingsForm.skillsText}
                        onChange={(e) => setSettingsForm({ ...settingsForm, skillsText: e.target.value })}
                        className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs focus:outline-none"
                        placeholder="Photoshop, Illustrator, Figma, Blender"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-3 bg-[#2563eb] hover:bg-blue-600 font-bold rounded-lg text-xs cursor-pointer text-white"
                  >
                    Save Biography
                  </button>
                </form>
              )}

              {/* 4. PORTFOLIO WORKSPACE - LIST, EDITABLE ROWS & DIALOGS */}
              {activeTab === "portfolio" && (
                <div className="space-y-6">
                  {/* SEARCH & FILTERS ROW */}
                  <div className="flex bg-[#0f0f14] border border-white/5 px-4 py-2 rounded-xl items-center gap-3">
                    <Search className="w-4 h-4 text-gray-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search showcase by title or category..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent border-none focus:outline-none text-xs text-white placeholder-gray-500"
                    />
                  </div>

                  {projectEditItem ? (
                    /* PROJECT INLINE EDIT FORM */
                    <form onSubmit={handleUpdateProject} className="bg-[#0f0f14] border border-white/5 p-6 rounded-xl space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-2">
                        <h4 className="font-bold text-white text-xs">Edit Project Workspace: {projectEditItem.title}</h4>
                        <button 
                          type="button" 
                          onClick={() => setProjectEditItem(null)} 
                          className="text-[11px] text-gray-400 hover:text-white underline"
                        >
                          Cancel Edit
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs text-gray-400">Project Title</label>
                          <input
                            type="text"
                            required
                            value={projectEditItem.title}
                            onChange={(e) => setProjectEditItem({ ...projectEditItem, title: e.target.value })}
                            className="w-full px-4 py-2 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs text-gray-400">Artwork Category</label>
                          <select
                            value={projectEditItem.category}
                            onChange={(e) => setProjectEditItem({ ...projectEditItem, category: e.target.value })}
                            className="w-full px-4 py-2 bg-[#0d0d12] rounded-lg border border-white/5 text-white text-xs"
                          >
                            {categories.map((cat, i) => (
                              <option key={i} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ImageUploaderField
                            label="Cover Thumbnail (or upload from computer)"
                            value={projectEditItem.imageUrl}
                            onChange={(val) => setProjectEditItem({ ...projectEditItem, imageUrl: val })}
                            onRandomMock={() => handleMockUrlGenerator("project")}
                          />
                        <div className="space-y-1.5">
                          <label className="block text-xs text-gray-400">Tools Involved (e.g. Photoshop, Canva)</label>
                          <input
                            type="text"
                            required
                            value={Array.isArray(projectEditItem.tools) ? projectEditItem.tools.join(", ") : (projectEditItem.tools as string)}
                            onChange={(e) => setProjectEditItem({ ...projectEditItem, tools: e.target.value as any })}
                            className="w-full px-4 py-2 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">Marketing metrics / Highlight (Optional)</label>
                        <input
                          type="text"
                          value={projectEditItem.metrics || ""}
                          onChange={(e) => setProjectEditItem({ ...projectEditItem, metrics: e.target.value })}
                          className="w-full px-4 py-2 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                          placeholder="e.g. CTR increased to 24%"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">Short Description Story</label>
                        <textarea
                          rows={3}
                          required
                          value={projectEditItem.description}
                          onChange={(e) => setProjectEditItem({ ...projectEditItem, description: e.target.value })}
                          className="w-full px-4 py-2 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          className="px-4 py-2.5 bg-[#2563eb] hover:bg-blue-600 rounded-lg font-bold text-xs text-white"
                        >
                          Commit Updates
                        </button>
                        <button
                          type="button"
                          onClick={() => setProjectEditItem(null)}
                          className="px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 text-xs"
                        >
                          Discard
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* STAND-ALONE PORTFOLIO TABLE LIST EXACTLY CORRESPONDING TO SCREENSHOT */
                    <div className="bg-[#0f0f14] border border-white/5 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 bg-[#0a0a0d] text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                            <th className="px-5 py-3.5">THUMBNAIL</th>
                            <th className="px-5 py-3.5">PROJECT TITLE</th>
                            <th className="px-5 py-3.5">CATEGORY</th>
                            <th className="px-5 py-3.5">STATUS</th>
                            <th className="px-5 py-3.5 text-right">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {projects
                            .filter(p => 
                              p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.category.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map((proj) => (
                              <tr key={proj.id} className="hover:bg-white/[0.01] transition-all text-gray-300">
                                <td className="px-5 py-3">
                                  <img 
                                    src={proj.imageUrl} 
                                    alt="" 
                                    className="w-12 h-12 object-cover rounded-md bg-[#050508] border border-white/10 shrink-0" 
                                  />
                                </td>
                                <td className="px-5 py-3 font-semibold text-white max-w-xs truncate">
                                  {proj.title}
                                  <p className="text-[10px] text-gray-500 font-normal mt-0.5 truncate max-w-[240px]">
                                    {proj.description}
                                  </p>
                                </td>
                                <td className="px-5 py-3 text-gray-400">{proj.category}</td>
                                <td className="px-5 py-3 select-none">
                                  <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-green-500/10 text-emerald-400 px-2 py-0.5 rounded-full uppercase border border-green-500/15">
                                    PUBLISHED
                                  </span>
                                </td>
                                <td className="px-5 py-3 text-right">
                                  <div className="flex gap-2.5 justify-end">
                                    <button
                                      onClick={() => setProjectEditItem(proj)}
                                      className="p-1.5 hover:bg-white/5 text-gray-400 hover:text-white rounded cursor-pointer"
                                      title="Edit"
                                    >
                                      <Edit className="w-4 h-4 text-[#2563eb]" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteProject(proj.id, proj.title)}
                                      className="p-1.5 hover:bg-red-950/20 text-gray-500 hover:text-red-400 rounded cursor-pointer"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* 5. CATEGORIES SECTIONS */}
              {activeTab === "categories" && (
                <div className="space-y-6">
                  <form onSubmit={handleAddCategoryOnList} className="bg-[#0f0f14] border border-white/5 p-6 rounded-xl flex gap-3 items-end">
                    <div className="space-y-1.5 flex-1">
                      <label className="block text-xs text-gray-400">Initialize New Portfolio Category Tag</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Esports posters, YouTube Thumbnails, Merch design"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-3 bg-[#2563eb] hover:bg-blue-600 font-bold rounded-lg text-xs cursor-pointer text-white flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Tag
                    </button>
                  </form>

                  <div className="bg-[#0f0f14] border border-white/5 rounded-xl p-5 space-y-4">
                    <h3 className="font-bold text-white text-xs">Currently Active Dynamic Category Lists</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {categories.map((cat, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3.5 bg-black/30 border border-white/5 rounded-lg">
                          <span className="font-medium text-white">{cat}</span>
                          <button
                            onClick={() => handleDeleteCategoryFromList(cat)}
                            className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-950/20 rounded cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4.5 h-4.5 text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 6. SERVICES DETAILS CONFIGURATION */}
              {activeTab === "services" && (
                <form onSubmit={handleSaveSiteSettings} className="space-y-6">
                  <div className="bg-[#0f0f14] border border-white/5 p-6 rounded-xl space-y-4">
                    <h3 className="font-bold text-white text-xs pb-2 border-b border-white/5">Services Segment Intro Labels</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">Services Badge Label</label>
                        <input
                          type="text"
                          value={settingsForm.servicesBadge || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, servicesBadge: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">Services Main Title Header</label>
                        <input
                          type="text"
                          value={settingsForm.servicesTitle || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, servicesTitle: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs text-gray-400">Services Secondary Subtitle Narrative</label>
                      <textarea
                        rows={2}
                        value={settingsForm.servicesSubtitle || ""}
                        onChange={(e) => setSettingsForm({ ...settingsForm, servicesSubtitle: e.target.value })}
                        className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                      />
                    </div>
                  </div>

                  {/* Individual service slot panels */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Service Slot 1 */}
                    <div className="bg-[#0f0f14] border border-white/5 p-5 rounded-xl space-y-3">
                      <h4 className="font-bold text-[#2563eb] text-xs">Service Card 1 (Thumbnail Design)</h4>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-gray-400">Service Title</label>
                        <input
                          type="text"
                          value={settingsForm.service1Title || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, service1Title: e.target.value })}
                          className="w-full px-3.5 py-2 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-gray-400">Highlight Metric Badge</label>
                        <input
                          type="text"
                          value={settingsForm.service1Metric || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, service1Metric: e.target.value })}
                          className="w-full px-3.5 py-2 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-gray-400">Card Explanation</label>
                        <textarea
                          rows={2}
                          value={settingsForm.service1Desc || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, service1Desc: e.target.value })}
                          className="w-full px-3.5 py-2 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                        />
                      </div>
                    </div>

                    {/* Service Slot 2 */}
                    <div className="bg-[#0f0f14] border border-white/5 p-5 rounded-xl space-y-3">
                      <h4 className="font-bold text-[#2563eb] text-xs">Service Card 2 (Branding Systems)</h4>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-gray-400">Service Title</label>
                        <input
                          type="text"
                          value={settingsForm.service2Title || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, service2Title: e.target.value })}
                          className="w-full px-3.5 py-2 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-gray-400">Highlight Metric Badge</label>
                        <input
                          type="text"
                          value={settingsForm.service2Metric || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, service2Metric: e.target.value })}
                          className="w-full px-3.5 py-2 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-gray-400">Card Explanation</label>
                        <textarea
                          rows={2}
                          value={settingsForm.service2Desc || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, service2Desc: e.target.value })}
                          className="w-full px-3.5 py-2 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-3 bg-[#2563eb] hover:bg-blue-600 font-bold rounded-lg text-xs cursor-pointer text-white"
                  >
                    Save All Services Settings
                  </button>
                </form>
              )}

              {/* 7. PRICING PACKAGES WORKSPACE */}
              {activeTab === "pricing" && (
                <div className="space-y-6">
                  {pricingEditItem ? (
                    <form onSubmit={handleUpdatePricing} className="bg-[#0f0f14] border border-white/5 p-6 rounded-xl space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <h4 className="font-bold text-white text-xs">Edit Pricing: {pricingEditItem.name}</h4>
                        <button type="button" onClick={() => setPricingEditItem(null)} className="text-[11px] text-gray-400 underline">
                          Cancel Edit
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs text-gray-400">Package Name</label>
                          <input
                            type="text"
                            required
                            value={pricingEditItem.name}
                            onChange={(e) => setPricingEditItem({ ...pricingEditItem, name: e.target.value })}
                            className="w-full px-4 py-2 bg-[#0d0d12] rounded-lg border border-white/5 text-white text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs text-gray-400">Package Price Tag</label>
                          <input
                            type="text"
                            required
                            value={pricingEditItem.price}
                            onChange={(e) => setPricingEditItem({ ...pricingEditItem, price: e.target.value })}
                            className="w-full px-4 py-2 bg-[#0d0d12] rounded-lg border border-white/5 text-white text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs text-gray-400">Package Accent Badge (Optional)</label>
                          <input
                            type="text"
                            value={pricingEditItem.tag || ""}
                            onChange={(e) => setPricingEditItem({ ...pricingEditItem, tag: e.target.value })}
                            className="w-full px-4 py-2 bg-[#0d0d12] rounded-lg border border-white/5 text-white text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">Features List (Comma Separated)</label>
                        <textarea
                          rows={2}
                          required
                          value={pricingEditItem.features}
                          onChange={(e) => setPricingEditItem({ ...pricingEditItem, features: e.target.value })}
                          className="w-full px-4 py-2 bg-[#0d0d12] rounded-lg border border-white/5 text-white text-xs"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button type="submit" className="px-4 py-2 bg-[#2563eb] text-white rounded font-bold text-xs">
                          Save Plan Configuration
                        </button>
                        <button type="button" onClick={() => setPricingEditItem(null)} className="px-4 py-2 bg-white/5 text-gray-400 rounded text-xs">
                          Back
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="bg-[#0f0f14] border border-white/5 rounded-xl p-5 space-y-4">
                      <h3 className="font-bold text-white text-xs">Inbuilt Price System Details</h3>
                      {pricingPlans.length === 0 ? (
                        <p className="text-xs text-gray-500 italic">No custom packages designed. Add one to customize your client choices!</p>
                      ) : (
                        <div className="divide-y divide-white/5">
                          {pricingPlans.map((plan) => (
                            <div key={plan.id} className="py-4 flex justify-between items-center text-xs">
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-white text-sm">{plan.name}</span>
                                  {plan.tag && (
                                    <span className="text-[9px] bg-[#2563eb]/20 text-[#2563eb] px-1.5 py-0.5 rounded-full uppercase font-bold">
                                      {plan.tag}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[#2563eb] font-extrabold mt-1 text-sm">{plan.price}</p>
                                <p className="text-gray-400 mt-2 font-normal max-w-xl">{plan.features}</p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setPricingEditItem(plan)}
                                  className="p-1 text-[#2563eb] hover:bg-white/5 rounded"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeletePricing(plan.id, plan.name)}
                                  className="p-1 text-red-500 hover:bg-white/5 rounded"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 8. TESTIMONIALS MANAGER */}
              {activeTab === "testimonials" && (
                <div className="space-y-6">
                  {testimonialEditItem ? (
                    <form onSubmit={handleUpdateTestimonial} className="bg-[#0f0f14] border border-white/5 p-6 rounded-xl space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <h4 className="font-bold text-white text-xs">Edit Client: {testimonialEditItem.name}</h4>
                        <button type="button" onClick={() => setTestimonialEditItem(null)} className="text-[11px] text-gray-400 underline">
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs text-gray-400">Client / Creator Name</label>
                          <input
                            type="text"
                            required
                            value={testimonialEditItem.name}
                            onChange={(e) => setTestimonialEditItem({ ...testimonialEditItem, name: e.target.value })}
                            className="w-full px-4 py-2 bg-[#0d0d12] rounded-lg border border-white/5 text-white text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs text-gray-400">Corporate Role / Organization</label>
                          <input
                            type="text"
                            required
                            value={testimonialEditItem.role}
                            onChange={(e) => setTestimonialEditItem({ ...testimonialEditItem, role: e.target.value })}
                            className="w-full px-4 py-2 bg-[#0d0d12] rounded-lg border border-white/5 text-white text-xs"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">Client Review Feedback Text</label>
                        <textarea
                          rows={3}
                          required
                          value={testimonialEditItem.comment}
                          onChange={(e) => setTestimonialEditItem({ ...testimonialEditItem, comment: e.target.value })}
                          className="w-full px-4 py-2 bg-[#0d0d12] rounded-lg border border-white/5 text-white text-xs"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button type="submit" className="px-4 py-2 bg-[#2563eb] text-white rounded font-bold text-xs cursor-pointer">
                          Apply Changes
                        </button>
                        <button type="button" onClick={() => setTestimonialEditItem(null)} className="px-4 py-2 bg-white/5 text-gray-400 rounded text-xs cursor-pointer">
                          Discard
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="bg-[#0f0f14] border border-white/5 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 bg-[#0a0a0d] text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                            <th className="px-5 py-3.5">CLIENT NAME</th>
                            <th className="px-5 py-3.5">ROLE / COMPANY</th>
                            <th className="px-5 py-3.5">RATING</th>
                            <th className="px-5 py-3.5 text-right">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {testimonials.map((test) => (
                            <tr key={test.id} className="hover:bg-white/[0.01]">
                              <td className="px-5 py-3 font-semibold text-white">{test.name}</td>
                              <td className="px-5 py-3 text-gray-400">{test.role}</td>
                              <td className="px-5 py-3 text-yellow-400">{"⭐".repeat(test.rating)}</td>
                              <td className="px-5 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => setTestimonialEditItem(test)} className="p-1 hover:bg-white/5 rounded text-[#2563eb]">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDeleteTestimonial(test.id, test.name)} className="p-1 hover:bg-white/5 rounded text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* 9. BLOG BOARD */}
              {activeTab === "blog" && (
                <div className="space-y-6">
                  {blogEditItem ? (
                    <form onSubmit={handleUpdateBlog} className="bg-[#0f0f14] border border-white/5 p-6 rounded-xl space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-3">
                        <h4 className="font-bold text-white text-xs">Edit Article: {blogEditItem.title}</h4>
                        <button type="button" onClick={() => setBlogEditItem(null)} className="text-[11px] text-gray-400 underline">Cancel</button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs text-gray-400">Post Title</label>
                          <input
                            type="text"
                            required
                            value={blogEditItem.title}
                            onChange={(e) => setBlogEditItem({ ...blogEditItem, title: e.target.value })}
                            className="w-full px-4 py-2 bg-[#0d0d12] border border-white/5 text-white text-xs rounded-lg"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs text-gray-400">Tag Trigger (e.g. Design Principle)</label>
                          <input
                            type="text"
                            required
                            value={blogEditItem.tag}
                            onChange={(e) => setBlogEditItem({ ...blogEditItem, tag: e.target.value })}
                            className="w-full px-4 py-2 bg-[#0d0d12] border border-white/5 text-white text-xs rounded-lg"
                          />
                        </div>
                      </div>

                      <ImageUploaderField
                        label="Cover Picture (or upload from computer)"
                        value={blogEditItem.coverUrl}
                        onChange={(val) => setBlogEditItem({ ...blogEditItem, coverUrl: val })}
                        onRandomMock={() => handleMockUrlGenerator("blog")}
                      />

                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">Short Excerpt (Search Listing Preview)</label>
                        <input
                          type="text"
                          required
                          value={blogEditItem.excerpt}
                          onChange={(e) => setBlogEditItem({ ...blogEditItem, excerpt: e.target.value })}
                          className="w-full px-4 py-2 bg-[#0d0d12] border border-white/5 text-white text-xs rounded-lg"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400 font-medium">Main Article Body (Markdown supported)</label>
                        <textarea
                          rows={6}
                          required
                          value={blogEditItem.content}
                          onChange={(e) => setBlogEditItem({ ...blogEditItem, content: e.target.value })}
                          className="w-full px-4 py-2.5 bg-[#0d0d12] border border-white/5 text-white text-xs rounded-lg"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button type="submit" className="px-5 py-2.5 bg-[#2563eb] text-white font-bold rounded-lg text-xs cursor-pointer">Commit Post</button>
                        <button type="button" onClick={() => setBlogEditItem(null)} className="px-5 py-2.5 bg-white/5 text-gray-400 rounded-lg text-xs cursor-pointer">Discard</button>
                      </div>
                    </form>
                  ) : (
                    <div className="bg-[#0f0f14] border border-white/5 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 bg-[#0a0a0d] text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                            <th className="px-5 py-3.5">COVER</th>
                            <th className="px-5 py-3.5">ARTICLE TITLE</th>
                            <th className="px-5 py-3.5">TAG</th>
                            <th className="px-5 py-3.5">DATE</th>
                            <th className="px-5 py-3.5 text-right">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {blogs.map((b) => (
                            <tr key={b.id} className="hover:bg-white/[0.01]">
                              <td className="px-5 py-3">
                                <img src={b.coverUrl} className="w-10 h-10 object-cover border border-white/10 rounded" />
                              </td>
                              <td className="px-5 py-3 font-semibold text-white max-w-sm truncate">{b.title}</td>
                              <td className="px-5 py-3 text-[#2563eb] font-bold">{b.tag}</td>
                              <td className="px-5 py-3 text-gray-500 font-mono">{b.date}</td>
                              <td className="px-5 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => setBlogEditItem(b)} className="p-1 hover:bg-white/5 rounded text-[#2563eb]">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDeleteBlog(b.id, b.title)} className="p-1 hover:bg-white/5 rounded text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* 10. INBOUND INQUIRIES LIST / MAILBOX */}
              {activeTab === "inquiries" && (
                <div className="space-y-4">
                  {inquiries.length === 0 ? (
                    <p className="text-xs text-gray-500 italic p-12 bg-[#0f0f14] border border-white/5 rounded-xl text-center">
                      Your Inbound Inbox is empty. When clients submit inquiries via the front-facing intake block, they display here!
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {inquiries.map((inq) => (
                        <div 
                          key={inq.id}
                          className={`p-6 bg-[#0f0f14] border rounded-xl relative transition-all ${
                            inq.status === "unread" ? "border-blue-500/40 shadow-md shadow-blue-500/5" : "border-white/5 opacity-80"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-white text-sm">{inq.name}</h4>
                                {inq.status === "unread" && (
                                  <span className="text-[9px] bg-red-500 text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase">NEW</span>
                                )}
                              </div>
                              <p className="text-gray-400 mt-1 text-xs select-all font-semibold">{inq.email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {inq.status === "unread" && (
                                <button
                                  onClick={() => handleMarkReadInquiry(inq.id)}
                                  className="px-2.5 py-1.5 bg-[#2563eb] text-white hover:bg-blue-600 rounded text-[10px] cursor-pointer"
                                >
                                  Mark as Read
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteInquiry(inq.id)}
                                className="p-2 bg-white/5 text-gray-500 hover:text-red-400 hover:bg-red-950/20 rounded cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 gap-3 bg-[#08080c] p-3 rounded-lg text-[11px] text-gray-400">
                            <div>
                              <span className="text-gray-500 text-[8px] font-bold block uppercase tracking-wider">PROJECT CATEGORY</span>
                              <span className="text-white mt-0.5 block">{inq.projectType}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 text-[8px] font-bold block uppercase tracking-wider">BUDGET ESTIMATE</span>
                              <span className="text-white mt-0.5 block">{inq.budget}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 text-[8px] font-bold block uppercase tracking-wider">TIME INGESTED</span>
                              <span className="text-white mt-0.5 block">{new Date(inq.timestamp).toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="mt-4 p-4 bg-[#08080c]/50 border border-white/5 rounded-lg text-xs leading-relaxed text-gray-300">
                            {inq.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 11. HIRE ME SETTINGS FORM */}
              {activeTab === "hire_settings" && (
                <form onSubmit={handleSaveSiteSettings} className="space-y-6">
                  <div className="bg-[#0f0f14] border border-white/5 p-6 rounded-xl space-y-4">
                    <h3 className="font-bold text-white text-xs pb-2 border-b border-white/5">Interactive Intake Form Copy</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">Contact Section Badge / Title header</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.contactTitle || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, contactTitle: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">Sub-headline Copy</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.contactSubtitle || ""}
                          onChange={(e) => setSettingsForm({ ...settingsForm, contactSubtitle: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">Admin WhatsApp Number (Include country code, no symbols)</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.whatsappNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs font-mono text-cyan-400"
                          placeholder="e.g. 1234567890"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">Corporate Notification Email address</label>
                        <input
                          type="email"
                          required
                          value={settingsForm.contactEmail}
                          onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-3 bg-[#2563eb] hover:bg-blue-600 font-bold rounded-lg text-xs cursor-pointer text-white"
                  >
                    Save Intake Params
                  </button>
                </form>
              )}

              {/* 12. SOCIAL LINKS FORM */}
              {activeTab === "socials" && (
                <form onSubmit={handleSaveSocials} className="space-y-6">
                  <div className="bg-[#0f0f14] border border-white/5 p-6 rounded-xl space-y-4">
                    <h3 className="font-bold text-white text-xs pb-2 border-b border-white/5">External Profile Links</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">Behance Page URL</label>
                        <input
                          type="url"
                          value={socialLinks.behance || ""}
                          onChange={(e) => setSocialLinks({ ...socialLinks, behance: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">Dribbble Portfolio URL</label>
                        <input
                          type="url"
                          value={socialLinks.dribbble || ""}
                          onChange={(e) => setSocialLinks({ ...socialLinks, dribbble: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">Instagram Handle link</label>
                        <input
                          type="url"
                          value={socialLinks.instagram || ""}
                          onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">YouTube Channel URL</label>
                        <input
                          type="url"
                          value={socialLinks.youtube || ""}
                          onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">LinkedIn Profile URL</label>
                        <input
                          type="url"
                          value={socialLinks.linkedin || ""}
                          onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">GitHub Developer Page URL</label>
                        <input
                          type="url"
                          value={socialLinks.github || ""}
                          onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-3 bg-[#2563eb] hover:bg-blue-600 font-bold rounded-lg text-xs cursor-pointer text-white"
                  >
                    Save Social Handles
                  </button>
                </form>
              )}

              {/* 13. SEO METRICS SHIFT */}
              {activeTab === "seo" && (
                <form onSubmit={handleSaveSeo} className="space-y-6">
                  <div className="bg-[#0f0f14] border border-white/5 p-6 rounded-xl space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs text-gray-400">Meta Title Header (Tab Bar Head)</label>
                      <input
                        type="text"
                        required
                        value={seoSettings.metaTitle || ""}
                        onChange={(e) => setSeoSettings({ ...seoSettings, metaTitle: e.target.value })}
                        className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs text-gray-400">Search Engine Keywords (Comma Separated)</label>
                      <input
                        type="text"
                        required
                        value={seoSettings.keywords || ""}
                        onChange={(e) => setSeoSettings({ ...seoSettings, keywords: e.target.value })}
                        className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs text-gray-400 font-medium">Meta Description Text (Google index block summary)</label>
                      <textarea
                        rows={3}
                        required
                        value={seoSettings.metaDescription || ""}
                        onChange={(e) => setSeoSettings({ ...seoSettings, metaDescription: e.target.value })}
                        className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs focus:ring-0"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs text-gray-400">Google Analytics Tracking ID (G-XXXXX) (Optional)</label>
                      <input
                        type="text"
                        value={seoSettings.googleAnalyticsId || ""}
                        onChange={(e) => setSeoSettings({ ...seoSettings, googleAnalyticsId: e.target.value })}
                        className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-3 bg-[#2563eb] hover:bg-blue-600 font-bold rounded-lg text-xs cursor-pointer text-white"
                  >
                    Save SEO Metadata
                  </button>
                </form>
              )}

              {/* 14. GENERAL SETTINGS AND SECURITY UPDATES */}
              {activeTab === "general" && (
                <form onSubmit={handleSaveGeneralSettings} className="space-y-6">
                  <div className="bg-[#0f0f14] border border-white/5 p-6 rounded-xl space-y-4">
                    <h3 className="font-bold text-white text-xs pb-2 border-b border-white/5">Corporate Branding & Identity Settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">Brand Name</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.designerName}
                          onChange={(e) => setSettingsForm({ ...settingsForm, designerName: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">Corporate Subtitle Label</label>
                        <input
                          type="text"
                          required
                          value={settingsForm.designerRole}
                          onChange={(e) => setSettingsForm({ ...settingsForm, designerRole: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                        />
                      </div>
                    </div>

                    <h3 className="font-bold text-white text-xs pt-4 pb-2 border-b border-silver/5 flex items-center gap-2">
                       Security overrides / Administrative credentials
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">Administrative Login Email Address</label>
                        <input
                          type="email"
                          required
                          value={settingsForm.contactEmail}
                          onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                          className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs text-gray-400">New Password Code PIN (Leave blank to keep current)</label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-2.5 bg-black/40 rounded-lg border border-white/5 text-white text-xs font-mono"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-3 bg-[#2563eb] hover:bg-blue-600 font-bold rounded-lg text-xs cursor-pointer text-white"
                  >
                    Save General Configuration
                  </button>
                </form>
              )}

              {/* 15. SEED DATA ACTIONS */}
              {activeTab === "seed" && (
                <div className="bg-[#0f0f14] border border-white/5 p-6 rounded-xl space-y-5">
                  <div className="flex gap-4 items-start">
                    <ShieldAlert className="w-8 h-8 text-[#2563eb] shrink-0 mt-1" />
                    <div className="space-y-2">
                      <h4 className="text-base font-bold text-white">Reset Database Assets to Factory Defaults</h4>
                      <p className="text-xs text-gray-400 leading-relaxed max-w-xl font-sans">
                        Erase custom portfolios, testimonials, active blog posts, and feedback logs. Safe fallback parameters will instantly populate:
                      </p>
                      <ul className="list-disc pl-5 text-gray-500 space-y-1 mt-2 text-xs">
                        <li>Portfolios reset back to Cyberpunk digital keyarts and banners</li>
                        <li>Testimonials loops reset safely to Alex Thorne and NeoLabs CEO comments</li>
                        <li>Email credentials restore to default login: <strong>mdashadujjaman511@gmail.com</strong></li>
                        <li>Master passkey security PIN code fallback to: <strong>admin123</strong></li>
                      </ul>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-4.5">
                    <button
                      type="button"
                      onClick={handleResetDatabase}
                      className="px-5 py-3.5 bg-white/5 hover:bg-red-950/30 text-semibold text-red-400 rounded-lg text-xs cursor-pointer transition-all border border-red-500/10 inline-flex items-center gap-2"
                    >
                      <Database className="w-4 h-4" /> Erase Databases & Restore Seeds
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* POPUP CREATION MODALS FOR ADDING PORTFOLIO / TESTIMONIALS / BLOGS / PRICING INLINE */}
      {showAddModal && token && (
        <div className="fixed inset-0 z-50 bg-[#040406]/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f0f14] border border-white/5 w-full max-w-lg rounded-xl overflow-hidden shadow-2xl flex flex-col">
            
            <div className="bg-[#0a0a0d] px-6 py-4.5 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white capitalize">
                {activeTab === "portfolio" ? "Publish New Portfolio Item" : activeTab === "testimonials" ? "Post Client testimonial Review" : activeTab === "blog" ? "Publish Dynamic Blog Post" : "Add Custom Pricing plan"}
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 text-gray-500 hover:text-white rounded"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[75vh]">
              {/* Add Project Form inline */}
              {activeTab === "portfolio" && (
                <form onSubmit={handleAddProject} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs text-gray-400">Project Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Esports Champion Banner"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-black/40 border border-white/5 rounded-lg text-white text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs text-gray-400">Category Tag</label>
                      <select
                        value={newProject.category}
                        onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                        className="w-full px-4 py-2 bg-[#0c0c10] border border-white/5 rounded-lg text-white text-xs"
                      >
                        {categories.map((c, idx) => (
                          <option key={idx} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs text-gray-400">Frameworks / Tools Used</label>
                      <input
                        type="text"
                        placeholder="Photoshop, Illustrator"
                        value={newProject.tools}
                        onChange={(e) => setNewProject({ ...newProject, tools: e.target.value })}
                        className="w-full px-4 py-2.5 bg-black/40 border border-white/5 rounded-lg text-white text-xs"
                      />
                    </div>
                  </div>

                  <ImageUploaderField
                    label="Illustration Cover Image (or upload from computer)"
                    value={newProject.imageUrl}
                    onChange={(val) => setNewProject({ ...newProject, imageUrl: val })}
                    onRandomMock={() => handleMockUrlGenerator("project")}
                  />

                  <div className="space-y-1.5">
                    <label className="block text-xs text-gray-400">Accent Tag / Metric (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. +40% higher click through metrics on YouTube"
                      value={newProject.metrics}
                      onChange={(e) => setNewProject({ ...newProject, metrics: e.target.value })}
                      className="w-full px-4 py-2.5 bg-black/40 border border-white/5 rounded-lg text-white text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs text-gray-400 font-medium">Short Case Study / description text</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Explain workflow composition and lighting palettes layout..."
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      className="w-full px-4 py-2.5 bg-black/40 border border-white/5 rounded-lg text-white text-xs"
                    />
                  </div>

                  <button type="submit" className="w-full py-3 bg-[#2563eb] text-white font-bold rounded-lg text-xs cursor-pointer">
                    Publish Project Item
                  </button>
                </form>
              )}

              {/* Add Testimonial Form inline */}
              {activeTab === "testimonials" && (
                <form onSubmit={handleAddTestimonial} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs text-gray-400">Client / Creator Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Chloe Brooks"
                        value={newTestimonial.name}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                        className="w-full px-3.5 py-2 bg-black/40 border border-white/5 rounded-lg text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs text-gray-400">Creator Role / Company</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Chief Editor at Overrun"
                        value={newTestimonial.role}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                        className="w-full px-3.5 py-2 bg-black/40 border border-white/5 rounded-lg text-white text-xs"
                      />
                    </div>
                  </div>

                  <ImageUploaderField
                    label="Client Avatar/Logo (or upload from computer)"
                    value={newTestimonial.avatarUrl}
                    onChange={(val) => setNewTestimonial({ ...newTestimonial, avatarUrl: val })}
                    onRandomMock={() => handleMockUrlGenerator("testimonial")}
                  />

                  <div className="space-y-1.5">
                    <label className="block text-xs text-gray-400">Star Rating Badge</label>
                    <select
                      value={newTestimonial.rating}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 bg-[#0c0c10] border border-white/5 rounded-lg text-white text-xs"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5/5 Pristine)</option>
                      <option value={4}>⭐⭐⭐⭐ (4/5 Great Work)</option>
                      <option value={3}>⭐⭐⭐ (3/5 Average)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs text-gray-400">Testimonial Comment Text</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Everything delivered was exceptional..."
                      value={newTestimonial.comment}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, comment: e.target.value })}
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/5 rounded-lg text-white text-xs"
                    />
                  </div>

                  <button type="submit" className="w-full py-3 bg-[#2563eb] text-white font-bold rounded-lg text-xs cursor-pointer">
                    Commit Testimonial Review
                  </button>
                </form>
              )}

              {/* Add Blog Post inline */}
              {activeTab === "blog" && (
                <form onSubmit={handleAddBlog} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs text-gray-400">Post Title</label>
                      <input
                        type="text"
                        required
                        placeholder="Psychology of Saturation"
                        value={newBlog.title}
                        onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                        className="w-full px-3.5 py-2 bg-black/40 border border-white/5 rounded-lg text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs text-gray-400">Category Tag (e.g. Branding)</label>
                      <input
                        type="text"
                        required
                        placeholder="Theory"
                        value={newBlog.tag}
                        onChange={(e) => setNewBlog({ ...newBlog, tag: e.target.value })}
                        className="w-full px-3.5 py-2 bg-black/40 border border-white/5 rounded-lg text-white text-xs"
                      />
                    </div>
                  </div>

                  <ImageUploaderField
                    label="Cover Display Picture (or upload from computer)"
                    value={newBlog.coverUrl}
                    onChange={(val) => setNewBlog({ ...newBlog, coverUrl: val })}
                    onRandomMock={() => handleMockUrlGenerator("blog")}
                  />

                  <div className="space-y-1.5">
                    <label className="block text-xs text-gray-400 font-medium">Preview Listing Short Excerpt</label>
                    <input
                      type="text"
                      required
                      placeholder="Brief 1-sentence descriptor for listing preview cards..."
                      value={newBlog.excerpt}
                      onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/5 rounded-lg text-white text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs text-gray-400 font-medium">Main Story Content (Supports layout markdown)</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Write your article composition here..."
                      value={newBlog.content}
                      onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/5 rounded-lg text-white text-xs"
                    />
                  </div>

                  <button type="submit" className="w-full py-3 bg-[#2563eb] text-white font-bold rounded-lg text-xs cursor-pointer">
                    Publish Blog Article
                  </button>
                </form>
              )}

              {/* Add Pricing plan inline */}
              {activeTab === "pricing" && (
                <form onSubmit={handleAddPricing} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs text-gray-400">Package Title Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Standard, Pro Creator Retainer"
                        value={newPricing.name}
                        onChange={(e) => setNewPricing({ ...newPricing, name: e.target.value })}
                        className="w-full px-3.5 py-2 bg-black/40 border border-white/5 rounded-lg text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs text-gray-400">Price Display (Numeric / Hourly / Monthly)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. $49 or $495/mo"
                        value={newPricing.price}
                        onChange={(e) => setNewPricing({ ...newPricing, price: e.target.value })}
                        className="w-full px-3.5 py-2 bg-black/40 border border-white/5 rounded-lg text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs text-gray-400">Accent Tag Bubble (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Best Value, Popular, 2 Slots Remaining"
                      value={newPricing.tag}
                      onChange={(e) => setNewPricing({ ...newPricing, tag: e.target.value })}
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/5 rounded-lg text-white text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs text-gray-400 font-medium">Plan Inclusions/Features (Comma separated)</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Figma source access, 4 Thumbnails, Priority turnaround delivery, Commercial license..."
                      value={newPricing.features}
                      onChange={(e) => setNewPricing({ ...newPricing, features: e.target.value })}
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/5 rounded-lg text-white text-xs"
                    />
                  </div>

                  <button type="submit" className="w-full py-3 bg-[#2563eb] text-white font-bold rounded-lg text-xs cursor-pointer">
                    Save Pricing Package
                  </button>
                </form>
              )}
            </div>

            <div className="bg-[#0a0a0d] px-6 py-4 border-t border-white/5 flex justify-end">
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-white/5 text-gray-400 hover:text-white rounded-lg text-xs"
              >
                Close Dialog
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
