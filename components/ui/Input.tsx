import { cn } from "@/lib/utils";
import { forwardRef, useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const autoId = useId();
    const inputId = id || autoId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              "w-full rounded-xl border bg-white dark:bg-white/[0.04] px-4 py-2.5 text-sm",
              "text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600",
              "border-gray-300 dark:border-white/12",
              "focus:outline-none focus:ring-2 focus:ring-brand-500/70 focus:border-brand-500",
              "transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-red-500 focus:ring-red-500",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p id={errorId} role="alert" className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, label, error, id, ...props }, ref) => {
    const autoId = useId();
    const inputId = id || autoId;
    const errorId = `${inputId}-error`;

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "w-full rounded-xl border bg-white dark:bg-white/[0.04] px-4 py-3 text-sm",
            "text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600",
            "border-gray-300 dark:border-white/12",
            "focus:outline-none focus:ring-2 focus:ring-brand-500/70 focus:border-brand-500",
            "transition-all duration-200 resize-none",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {error && <p id={errorId} role="alert" className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    const autoId = useId();
    const inputId = id || autoId;
    const errorId = `${inputId}-error`;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "w-full rounded-xl border bg-white dark:bg-gray-900 px-4 py-2.5 text-sm",
            "text-gray-900 dark:text-gray-100",
            "border-gray-300 dark:border-white/12",
            "focus:outline-none focus:ring-2 focus:ring-brand-500/70 focus:border-brand-500",
            "transition-all duration-200",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p id={errorId} role="alert" className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
