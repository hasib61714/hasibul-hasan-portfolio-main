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
    <div className={cn("mb-16", centered && "text-center", className)}>
      {badge && (
        <div className={cn("flex mb-5", centered && "justify-center")}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold glass-card border border-brand-200/60 dark:border-brand-700/40 text-brand-600 dark:text-brand-400 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            {badge}
          </span>
        </div>
      )}
      <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
        {title}{" "}
        {highlight && <span className="gradient-text">{highlight}</span>}
      </h2>
      {/* Decorative line */}
      <div className={cn("flex mt-5", centered && "justify-center")}>
        <div className="flex items-center gap-1.5">
          <div className="h-1 w-8 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
          <div className="h-1 w-4 rounded-full bg-gradient-to-r from-accent-500 to-pink-500 opacity-60" />
          <div className="h-1 w-2 rounded-full bg-pink-400 opacity-30" />
        </div>
      </div>
      {subtitle && (
        <p className="mt-5 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
