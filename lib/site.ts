/**
 * Single source of truth for personal details and site-wide copy.
 * Edit this file to update the portfolio — nothing else hardcodes these values.
 */
export const SITE = {
  name: "Md. Hasibul Hasan",
  brand: "Hasibul",
  role: "Software & ML Engineer",
  headline: "Software engineer working on web apps and ML",
  description:
    "Software engineer in Dhaka (GMT+6) working with React, Next.js, Laravel and Python, plus machine learning and AR/VR. Open to remote roles and contracts.",
  email: "mh.hasan14200@gmail.com",
  whatsapp: "8801794517497",
  github: "https://github.com/hasib61714",
  linkedin: "https://www.linkedin.com/in/md-hasibul-hasan-10749537a",
  facebook: "https://www.facebook.com/mhhasan2347",
  location: "Dhaka, Bangladesh",
  timezone: "GMT+6",
  availability: "Open to remote roles & contracts worldwide",
  /** Years of professional experience shown in the hero/about stats. */
  yearsExperience: "3+",
  /** Optional scheduling link (Cal.com, Calendly…). Set NEXT_PUBLIC_BOOKING_URL to show "Book a call" buttons. */
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL ?? "",
  githubUser: "hasib61714",
} as const;

export const NAV_ITEMS = [
  { label: "About",        href: "#about"        },
  { label: "Experience",   href: "#experience"   },
  { label: "Skills",       href: "#skills"       },
  { label: "Projects",     href: "#projects"     },
  { label: "Certificates", href: "#certificates" },
  { label: "Resume",       href: "#resume"       },
  { label: "Contact",      href: "#contact"      },
] as const;

export const WHATSAPP_MESSAGE =
  "Hi Hasibul, I found your portfolio and would like to connect!";

export function whatsappUrl() {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
}

/** Absolute site URL, resolved from env (works locally, on Vercel and custom domains). */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}
