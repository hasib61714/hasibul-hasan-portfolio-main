import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrowserMockupProps {
  title: string;
  image?: string;
  url?: string;
  className?: string;
  gradient?: string;
}

/** Browser-window frame used on case-study pages. Falls back to a generated cover when there's no screenshot. */
export function BrowserMockup({ title, image, url, className, gradient = "from-brand-600 to-accent-500" }: BrowserMockupProps) {
  let host = "";
  try {
    host = url ? new URL(url).host : "";
  } catch {
    host = "";
  }
  return (
    <figure className={cn("overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-brand-600/10 dark:border-white/10 dark:bg-gray-900", className)}>
      <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="mx-auto max-w-[60%] truncate rounded-md bg-white px-3 py-1 font-mono text-[11px] text-gray-500 dark:bg-white/[0.06] dark:text-gray-400">
          {host || title}
        </span>
      </div>
      <div className={`relative aspect-[16/10] bg-gradient-to-br ${gradient}`}>
        {image ? (
          <Image src={image} alt={`${title} screenshot`} fill priority sizes="(min-width: 1024px) 960px, 100vw" className="object-cover object-top" />
        ) : (
          <div className="absolute inset-0 grid place-items-center p-8 text-center">
            <div aria-hidden className="bg-grid absolute inset-0 opacity-30 [mask-image:none]" />
            <span className="relative font-display text-4xl italic text-white/90 sm:text-6xl">{title}</span>
          </div>
        )}
      </div>
    </figure>
  );
}
