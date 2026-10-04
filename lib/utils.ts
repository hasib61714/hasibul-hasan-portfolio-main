import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    year:  "numeric",
    month: "long",
    day:   "numeric",
  });
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

/**
 * Returns the URL only when it is a plain http(s) link, otherwise undefined.
 * Use for every URL that originates from the database before rendering it in an
 * `href`/`src` — it blocks `javascript:`, `data:` and other dangerous schemes.
 */
export function safeUrl(value?: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed === "#") return undefined;
  try {
    const url = new URL(trimmed);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

/** Builds a mailto: link with a correctly encoded subject. */
export function mailtoHref(email: string, subject?: string): string {
  const base = `mailto:${email}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}

/** Accepts only same-origin relative paths — prevents open redirects after login. */
export function safeRedirectPath(path: string | null | undefined, fallback = "/admin"): string {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
    return fallback;
  }
  return path;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** URL slug for a project's case-study page, e.g. "IMAP — AI Service Platform" → "imap-ai-service-platform". */
export function projectSlug(project: { title: string }): string {
  return slugify(project.title);
}
