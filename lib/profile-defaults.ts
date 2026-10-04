import { SITE } from "@/lib/site";
import { safeUrl } from "@/lib/utils";

/** Everything about the site owner that the admin panel can edit (Admin → Site & Profile). */
export interface Profile {
  name: string;
  brand: string;
  role: string;
  headlineBefore: string;
  headlineAccent: string;
  headlineAfter: string;
  heroDescription: string;
  /** Paragraphs separated by a blank line. `**bold**` is supported. */
  aboutStory: string;
  seoDescription: string;
  footerTagline: string;
  email: string;
  whatsapp: string;
  github: string;
  linkedin: string;
  facebook: string;
  twitter: string;
  youtube: string;
  instagram: string;
  location: string;
  timezone: string;
  yearsExperience: string;
  availability: string;
  openToWork: boolean;
  bookingUrl: string;
  techMarquee: string[];
  coreStack: string[];
}

export const DEFAULT_TECH_MARQUEE = [
  "React", "Next.js", "TypeScript", "Node.js", "Laravel", "Python", "FastAPI",
  "PostgreSQL", "Supabase", "Docker", "Tailwind CSS", "Scikit-learn", "Unity", "REST APIs",
];

export const DEFAULT_CORE_STACK = [
  "TypeScript", "JavaScript", "React", "Next.js", "Node.js", "Laravel", "Python", "FastAPI",
  "PostgreSQL", "Supabase", "MongoDB", "Tailwind CSS", "REST APIs", "Docker", "Git", "Scikit-learn",
];

export const DEFAULT_PROFILE: Profile = {
  name: SITE.name,
  brand: SITE.brand,
  role: SITE.role,
  headlineBefore: "I build reliable web platforms",
  headlineAccent: "& ML systems",
  headlineAfter: "for teams worldwide.",
  heroDescription:
    "Software Engineer at Red Data with a full-stack focus — React, Next.js, Laravel and Python — plus applied ML and AR/VR. I care about clean architecture, performance and shipping things that hold up in production.",
  aboutStory: [
    "I'm **Md. Hasibul Hasan**, a Software Engineer at **Red Data (Pvt.) Ltd.**, a licensed internet service provider in Dhaka, where I was promoted from intern to full-time engineer for consistently shipping. I'm also completing my B.Sc. in Computer Science & Engineering at **Green University of Bangladesh**.",
    "My work spans production full-stack applications, machine-learning systems and enterprise platforms, plus AR/VR development with Unity and a certified cyber-security programme that shapes how I think about building secure-by-default software.",
    "I care about clean, maintainable code, accessible and multilingual user experiences, and measurable impact. I'm based in Dhaka (GMT+6) and enjoy collaborating with distributed teams across time zones.",
  ].join("\n\n"),
  seoDescription: SITE.description,
  footerTagline:
    "Software engineer building performant web applications, machine-learning systems and immersive AR/VR experiences for teams around the world.",
  email: SITE.email,
  whatsapp: SITE.whatsapp,
  github: SITE.github,
  linkedin: SITE.linkedin,
  facebook: SITE.facebook,
  twitter: "",
  youtube: "",
  instagram: "",
  location: SITE.location,
  timezone: SITE.timezone,
  yearsExperience: SITE.yearsExperience,
  availability: SITE.availability,
  openToWork: true,
  bookingUrl: SITE.bookingUrl,
  techMarquee: DEFAULT_TECH_MARQUEE,
  coreStack: DEFAULT_CORE_STACK,
};

/** Raw `site_settings` row (snake_case). Every field may be null. */
export interface SettingsRow {
  name?: string | null; brand?: string | null; role?: string | null;
  headline_before?: string | null; headline_accent?: string | null; headline_after?: string | null;
  hero_description?: string | null; about_story?: string | null; seo_description?: string | null;
  footer_tagline?: string | null; email?: string | null; whatsapp?: string | null;
  github_url?: string | null; linkedin_url?: string | null; facebook_url?: string | null;
  twitter_url?: string | null; youtube_url?: string | null; instagram_url?: string | null;
  location?: string | null; timezone?: string | null; years_experience?: string | null;
  availability_text?: string | null; open_to_work?: boolean | null; booking_url?: string | null;
  tech_marquee?: string[] | null; core_stack?: string[] | null;
}

const text = (v: string | null | undefined, fallback: string) => (v && v.trim() ? v.trim() : fallback);
const list = (v: string[] | null | undefined, fallback: string[]) => (v && v.length > 0 ? v : fallback);
/** Empty string in the DB means "hide this link"; NULL means "use the default". */
const link = (v: string | null | undefined, fallback: string) => (v == null ? fallback : v.trim());

/** Merges a settings row over the built-in defaults. */
export function mergeProfile(row: SettingsRow | null | undefined): Profile {
  const d = DEFAULT_PROFILE;
  if (!row) return d;
  return {
    name: text(row.name, d.name),
    brand: text(row.brand, d.brand),
    role: text(row.role, d.role),
    headlineBefore: text(row.headline_before, d.headlineBefore),
    headlineAccent: text(row.headline_accent, d.headlineAccent),
    headlineAfter: text(row.headline_after, d.headlineAfter),
    heroDescription: text(row.hero_description, d.heroDescription),
    aboutStory: text(row.about_story, d.aboutStory),
    seoDescription: text(row.seo_description, d.seoDescription),
    footerTagline: text(row.footer_tagline, d.footerTagline),
    email: text(row.email, d.email),
    whatsapp: link(row.whatsapp, d.whatsapp),
    github: link(row.github_url, d.github),
    linkedin: link(row.linkedin_url, d.linkedin),
    facebook: link(row.facebook_url, d.facebook),
    twitter: link(row.twitter_url, d.twitter),
    youtube: link(row.youtube_url, d.youtube),
    instagram: link(row.instagram_url, d.instagram),
    location: text(row.location, d.location),
    timezone: text(row.timezone, d.timezone),
    yearsExperience: text(row.years_experience, d.yearsExperience),
    availability: text(row.availability_text, d.availability),
    openToWork: row.open_to_work ?? d.openToWork,
    bookingUrl: link(row.booking_url, d.bookingUrl),
    techMarquee: list(row.tech_marquee, d.techMarquee),
    coreStack: list(row.core_stack, d.coreStack),
  };
}

export type SocialKey = "github" | "linkedin" | "facebook" | "twitter" | "youtube" | "instagram";

const SOCIAL_LABELS: Record<SocialKey, string> = {
  github: "GitHub", linkedin: "LinkedIn", facebook: "Facebook", twitter: "X (Twitter)", youtube: "YouTube", instagram: "Instagram",
};

/** The social profiles that have a (safe) link, in display order. */
export function socialLinks(profile: Profile, keys: SocialKey[] = ["github", "linkedin", "facebook", "twitter", "youtube", "instagram"]) {
  return keys
    .map((key) => ({ key, label: SOCIAL_LABELS[key], href: safeUrl(profile[key]) }))
    .filter((l): l is { key: SocialKey; label: string; href: string } => !!l.href);
}

export function whatsappLink(profile: Profile): string | undefined {
  const digits = profile.whatsapp.replace(/\D/g, "");
  if (!digits) return undefined;
  return `https://wa.me/${digits}?text=${encodeURIComponent("Hi, I found your portfolio and would like to connect!")}`;
}

/** GitHub username extracted from the profile URL (used for the live stats). */
export function githubUsername(profile: Profile): string {
  try {
    return new URL(profile.github).pathname.split("/").filter(Boolean)[0] ?? SITE.githubUser;
  } catch {
    return SITE.githubUser;
  }
}

export function profileHost(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}
