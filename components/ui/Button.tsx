import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:opacity-60 disabled:cursor-not-allowed select-none";

    const variants = {
      primary:
        "bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-600/25 ring-1 ring-inset ring-white/15 hover:from-brand-400 hover:to-brand-600 hover:shadow-brand-500/40 hover:-translate-y-0.5 active:translate-y-0",
      secondary:
        "bg-gradient-to-b from-accent-500 to-accent-600 text-white shadow-lg shadow-accent-600/25 ring-1 ring-inset ring-white/15 hover:from-accent-400 hover:to-accent-600 hover:-translate-y-0.5 active:translate-y-0",
      outline:
        "border border-gray-300 dark:border-white/15 text-gray-800 dark:text-gray-100 bg-white/60 dark:bg-white/[0.03] hover:border-brand-500/60 hover:text-brand-600 dark:hover:text-brand-300 hover:bg-brand-50/60 dark:hover:bg-brand-500/10 hover:-translate-y-0.5",
      ghost:
        "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06]",
      danger:
        "bg-gradient-to-b from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 ring-1 ring-inset ring-white/15 hover:from-red-400 hover:to-red-600 hover:-translate-y-0.5",
    };

    const sizes = {
      sm: "text-sm px-4 py-2",
      md: "text-sm px-6 py-2.5",
      lg: "text-base px-8 py-3.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
