import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500", className)}>
      <Icon className="w-12 h-12 mb-3 opacity-20" />
      <p className="text-sm font-medium">{title}</p>
      {description && (
        <p className="text-xs mt-1 text-gray-400 dark:text-gray-600">{description}</p>
      )}
    </div>
  );
}
