import { createPublicClient } from "@/lib/supabase/public";
import { FALLBACK_CERTS, FALLBACK_PROJECTS, FALLBACK_SKILLS } from "@/lib/fallback-data";
import { DEFAULT_FAQS } from "@/lib/defaults";
import { SITE } from "@/lib/site";
import type { Achievement, Certificate, Document, Faq, Post, Project, SiteSettings, Skill, Testimonial } from "@/types";

export interface PortfolioData {
  projects: Project[];
  skills: Skill[];
  certificates: Certificate[];
  documents: Document[];
  avatarUrl: string | null;
  testimonials: Testimonial[];
  faqs: Faq[];
  achievements: Achievement[];
  latestPosts: Post[];
  settings: SiteSettings & { bookingUrl: string };
}

const DEFAULT_SETTINGS: SiteSettings = { open_to_work: true, booking_url: null, availability_text: null };

function resolveSettings(row: SiteSettings | null | undefined): PortfolioData["settings"] {
  const base = row ?? DEFAULT_SETTINGS;
  return { ...base, bookingUrl: base.booking_url || SITE.bookingUrl || "" };
}

/**
 * Loads everything the public page needs in one server-side pass.
 * Any table that is empty or fails to load falls back to the seed content,
 * so the site always renders something sensible.
 */
export async function getPortfolioData(): Promise<PortfolioData> {
  const supabase = createPublicClient();
  if (!supabase) {
    return {
      projects: FALLBACK_PROJECTS,
      skills: FALLBACK_SKILLS,
      certificates: FALLBACK_CERTS,
      documents: [],
      avatarUrl: null,
      testimonials: [],
      faqs: DEFAULT_FAQS,
      achievements: [],
      latestPosts: [],
      settings: resolveSettings(null),
    };
  }

  const [projects, skills, certificates, documents, avatar, testimonials, faqs, achievements, posts, settings] = await Promise.all([
    supabase.from("projects").select("*").order("order_index"),
    supabase.from("skills").select("*").order("order_index"),
    supabase.from("certificates").select("*").order("issue_date", { ascending: false }),
    supabase.from("documents").select("*").eq("is_active", true).order("type"),
    supabase.storage.from("profile").list("avatar", { limit: 10 }),
    supabase.from("testimonials").select("*").order("order_index"),
    supabase.from("faqs").select("*").order("order_index"),
    supabase.from("achievements").select("*").order("order_index").order("achieved_on", { ascending: false }),
    supabase.from("posts").select("id,slug,title,excerpt,cover_url,tags,published,published_at,created_at,updated_at,content").eq("published", true).order("published_at", { ascending: false }).limit(3),
    supabase.from("site_settings").select("booking_url,open_to_work,availability_text").eq("id", 1).maybeSingle(),
  ]);

  const orFallback = <T,>(res: { data: T[] | null; error: unknown }, fallback: T[]): T[] =>
    !res.error && res.data && res.data.length > 0 ? res.data : fallback;

  // Only link the avatar when the object really exists; version it so replacements bust the CDN cache.
  let avatarUrl: string | null = null;
  const avatarObject = avatar.data?.find((o) => o.name === "current");
  if (avatarObject) {
    const { data } = supabase.storage.from("profile").getPublicUrl("avatar/current");
    const version = avatarObject.updated_at ? Date.parse(avatarObject.updated_at) : Date.now();
    avatarUrl = `${data.publicUrl}?v=${version}`;
  }

  return {
    projects:     orFallback<Project>(projects, FALLBACK_PROJECTS),
    skills:       orFallback<Skill>(skills, FALLBACK_SKILLS),
    certificates: orFallback<Certificate>(certificates, FALLBACK_CERTS),
    documents:    documents.error ? [] : (documents.data ?? []),
    avatarUrl,
    testimonials: testimonials.error ? [] : ((testimonials.data as Testimonial[]) ?? []),
    faqs:         orFallback<Faq>(faqs, DEFAULT_FAQS),
    achievements: achievements.error ? [] : ((achievements.data as Achievement[]) ?? []),
    latestPosts:  posts.error ? [] : ((posts.data as Post[]) ?? []),
    settings:     resolveSettings(settings.error ? null : (settings.data as SiteSettings | null)),
  };
}
