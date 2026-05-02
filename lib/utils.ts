import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year:  "numeric",
    month: "long",
    day:   "numeric",
  });
}

export function formatCurrency(amount: string): string {
  return amount;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const WHATSAPP_NUMBER = "8801794517497";
export const PHONE_NUMBER    = "880192195641";
export const EMAIL_ADDRESS   = "mh.hasan14200@gmail.com";
export const GITHUB_URL      = "https://github.com/hasib61714";
export const LINKEDIN_URL    = "https://linkedin.com/in/hasibulhasan";
export const FACEBOOK_URL    = "https://www.facebook.com/mhhasan2347";
