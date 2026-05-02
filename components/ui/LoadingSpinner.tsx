import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-5 h-5",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center py-10", className)}>
      <div
        className={cn(
          "border-2 border-brand-500 border-t-transparent rounded-full animate-spin",
          sizes[size]
        )}
      />
    </div>
  );
}
