import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "outline";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default:  "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
    primary:  "bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300",
    success:  "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    warning:  "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
    danger:   "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
    outline:  "border border-brand-500 text-brand-600 dark:text-brand-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
