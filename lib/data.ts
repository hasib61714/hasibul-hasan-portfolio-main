import { createPublicClient } from "@/lib/supabase/public";
import { FALLBACK_CERTS, FALLBACK_PROJECTS, FALLBACK_SKILLS } from "@/lib/fallback-data";
import type { Certificate, Document, Project, Skill } from "@/types";

export interface PortfolioData {
  projects: Project[];
  skills: Skill[];
  certificates: Certificate[];
  documents: Document[];
  avatarUrl: string | null;
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
    };
  }

  const [projects, skills, certificates, documents, avatar] = await Promise.all([
    supabase.from("projects").select("*").order("order_index"),
    supabase.from("skills").select("*").order("order_index"),
    supabase.from("certificates").select("*").order("issue_date", { ascending: false }),
    supabase.from("documents").select("*").eq("is_active", true).order("type"),
    supabase.storage.from("profile").list("avatar", { limit: 10 }),
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
  };
}
