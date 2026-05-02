import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  glass?: boolean;
}

export function Card({ className, children, hover = true, glass = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-300",
        glass
          ? "glass-card"
          : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800",
        hover && "hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("p-6 pb-0", className)}>{children}</div>
  );
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("p-6", className)}>{children}</div>
  );
}

export function CardFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("p-6 pt-0", className)}>{children}</div>
  );
}
