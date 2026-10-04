"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const label = mounted ? (isDark ? "Switch to light theme" : "Switch to dark theme") : "Toggle theme";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative grid h-9 w-9 place-items-center rounded-xl border border-gray-200/80 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] text-gray-600 dark:text-gray-300 transition-colors hover:text-brand-600 dark:hover:text-brand-300 hover:border-brand-500/50"
      aria-label={label}
    >
      {/* Reserve the space before hydration to avoid layout shift. */}
      {mounted && (isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />)}
    </button>
  );
}
