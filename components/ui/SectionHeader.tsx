import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  badge,
  title,
  highlight,
  subtitle,
  centered = true,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-14 sm:mb-16", centered && "text-center", className)}>
      {badge && (
        <p className={cn("eyebrow mb-4 flex items-center gap-3", centered && "justify-center")}>
          <span aria-hidden className="h-px w-8 bg-gradient-to-r from-transparent to-brand-500/70" />
          {badge}
          <span aria-hidden className="h-px w-8 bg-gradient-to-l from-transparent to-brand-500/70" />
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight leading-[1.1] text-balance">
        {title}{" "}
        {highlight && <span className="gradient-text accent-serif">{highlight}</span>}
      </h2>
      {subtitle && (
        <p className={cn("mt-5 text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed text-pretty", centered && "max-w-2xl mx-auto")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
