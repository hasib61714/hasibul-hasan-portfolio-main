import { createPublicClient } from "@/lib/supabase/public";
import { FALLBACK_CERTS, FALLBACK_PROJECTS, FALLBACK_SKILLS } from "@/lib/fallback-data";
import { DEFAULT_FAQS, DEFAULT_PILLARS, DEFAULT_PROCESS, DEFAULT_SERVICES } from "@/lib/defaults";
import { EXPERIENCES, fromRow, type ExperienceItem, type ExperienceRow } from "@/lib/experience";
import { mergeProfile, type Profile, type SettingsRow } from "@/lib/profile-defaults";
import type { Achievement, Certificate, ContentBlock, Document, Faq, Post, Project, Skill, Testimonial } from "@/types";

export interface PortfolioData {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  certificates: Certificate[];
  documents: Document[];
  avatarUrl: string | null;
  testimonials: Testimonial[];
  faqs: Faq[];
  achievements: Achievement[];
  latestPosts: Post[];
  experiences: ExperienceItem[];
  services: ContentBlock[];
  processSteps: ContentBlock[];
  pillars: ContentBlock[];
}

/**
 * Loads everything the public page needs in one server-side pass.
 * Any table that is empty or fails to load falls back to the built-in content,
 * so the site always renders something sensible.
 */
export async function getPortfolioData(): Promise<PortfolioData> {
  const supabase = createPublicClient();
  if (!supabase) {
    return {
      profile: mergeProfile(null),
      projects: FALLBACK_PROJECTS,
      skills: FALLBACK_SKILLS,
      certificates: FALLBACK_CERTS,
      documents: [],
      avatarUrl: null,
      testimonials: [],
      faqs: DEFAULT_FAQS,
      achievements: [],
      latestPosts: [],
      experiences: EXPERIENCES,
      services: DEFAULT_SERVICES,
      processSteps: DEFAULT_PROCESS,
      pillars: DEFAULT_PILLARS,
    };
  }

  const [projects, skills, certificates, documents, avatar, testimonials, faqs, achievements, posts, settings, experiences, blocks] = await Promise.all([
    supabase.from("projects").select("*").order("order_index"),
    supabase.from("skills").select("*").order("order_index"),
    supabase.from("certificates").select("*").order("issue_date", { ascending: false }),
    supabase.from("documents").select("*").eq("is_active", true).order("type"),
    supabase.storage.from("profile").list("avatar", { limit: 10 }),
    supabase.from("testimonials").select("*").order("order_index"),
    supabase.from("faqs").select("*").order("order_index"),
    supabase.from("achievements").select("*").order("order_index").order("achieved_on", { ascending: false }),
    supabase.from("posts").select("*").eq("published", true).order("published_at", { ascending: false }).limit(3),
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("experiences").select("*").order("order_index"),
    supabase.from("content_blocks").select("*").order("order_index"),
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

  const allBlocks = (blocks.error ? [] : (blocks.data as ContentBlock[])) ?? [];
  const pick = (section: ContentBlock["section"], fallback: ContentBlock[]) => {
    const rows = allBlocks.filter((b) => b.section === section);
    return rows.length > 0 ? rows : fallback;
  };

  const experienceRows = experiences.error ? [] : ((experiences.data as ExperienceRow[]) ?? []);

  return {
    profile:      mergeProfile(settings.error ? null : (settings.data as SettingsRow | null)),
    projects:     orFallback<Project>(projects, FALLBACK_PROJECTS),
    skills:       orFallback<Skill>(skills, FALLBACK_SKILLS),
    certificates: orFallback<Certificate>(certificates, FALLBACK_CERTS),
    documents:    documents.error ? [] : (documents.data ?? []),
    avatarUrl,
    testimonials: testimonials.error ? [] : ((testimonials.data as Testimonial[]) ?? []),
    faqs:         orFallback<Faq>(faqs, DEFAULT_FAQS),
    achievements: achievements.error ? [] : ((achievements.data as Achievement[]) ?? []),
    latestPosts:  posts.error ? [] : ((posts.data as Post[]) ?? []),
    experiences:  experienceRows.length > 0 ? experienceRows.map(fromRow) : EXPERIENCES,
    services:     pick("service", DEFAULT_SERVICES),
    processSteps: pick("process", DEFAULT_PROCESS),
    pillars:      pick("pillar", DEFAULT_PILLARS),
  };
}
