export interface Project {
  id: string;
  title: string;
  description: string;
  long_description?: string;
  tech_stack: string[];
  image_url?: string;
  live_url?: string;
  github_url?: string;
  category: string;
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number; // 0-100
  icon?: string;
  order_index: number;
  created_at: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  credential_url?: string;
  image_url?: string;
  file_url?: string;
  description?: string;
  created_at: string;
}

export interface Document {
  id: string;
  type: "cv" | "cover_letter";
  title: string;
  file_url: string;
  file_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface HireRequest {
  id: string;
  name: string;
  email: string;
  company?: string;
  project_type: string;
  budget: string;
  timeline?: string;
  message: string;
  status: "pending" | "reviewing" | "accepted" | "rejected";
  created_at: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}
