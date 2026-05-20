export interface Project {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  metrics?: string;
  tools: string[];
  fullGallery?: string[];
}

export interface Message {
  id: string;
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
  status: 'unread' | 'read' | 'answered';
  timestamp: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  avatarUrl?: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalMessages: number;
  unreadMessages: number;
  totalTestimonials: number;
}

export interface SiteSettings {
  designerName: string;
  designerRole: string;
  bioSummary: string;
  experienceText: string;
  whatsappNumber: string;
  contactEmail: string;
  behanceUrl: string;
  dribbbleUrl: string;
  instagramUrl: string;
  heroTitleFirst: string;
  heroTitleSecond: string;
  heroSubtitle: string;
  skillsText: string;
  completedThumbnailsCount: string;
  combinedReachCount: string;
  retentionScore: string;
  
  // Custom Profile fields
  personalPhoto?: string;
  personalName?: string;
  personalDetails?: string;
  personalPhone?: string;
  personalEmail?: string;
  personalLocation?: string;
  
  // A to Z extended controls fallback editable fields
  servicesTitle?: string;
  servicesSubtitle?: string;
  servicesBadge?: string;
  
  service1Title?: string;
  service1Desc?: string;
  service1Metric?: string;
  
  service2Title?: string;
  service2Desc?: string;
  service2Metric?: string;
  
  service3Title?: string;
  service3Desc?: string;
  service3Metric?: string;
  
  service4Title?: string;
  service4Desc?: string;
  service4Metric?: string;
  
  service5Title?: string;
  service5Desc?: string;
  service5Metric?: string;
  
  milestone1Title?: string;
  milestone1Desc?: string;
  milestone2Title?: string;
  milestone2Desc?: string;
  
  philosophy1Title?: string;
  philosophy1Text?: string;
  
  philosophy2Title?: string;
  philosophy2Text?: string;
  
  philosophy3Title?: string;
  philosophy3Text?: string;
  
  contactTitle?: string;
  contactSubtitle?: string;
}

