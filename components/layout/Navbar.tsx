"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Menu, X, Code2, Search } from "lucide-react";
import { OPEN_PALETTE_EVENT } from "@/components/CommandPalette";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/site";
import { useProfile } from "@/components/ProfileProvider";

export function Navbar() {
  const profile = useProfile();
  const [isScrolled,    setIsScrolled]    = useState(false);
  const [isMobileOpen,  setIsMobileOpen]  = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const onHome = pathname === "/";

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    // The hero is observed too so scrolling back to the top clears the highlight.
    ["#hero", ...NAV_ITEMS.map(({ href }) => href)].forEach((href) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsMobileOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isMobileOpen]);

  const goTo = (href: string) => {
    setIsMobileOpen(false);
    if (onHome) document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    else router.push(`/${href}`);
  };

  return (
    <>
      {/* Reading progress */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-brand-600"
      />

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-3 sm:pt-4 px-3 sm:px-4 pointer-events-none"
      >
        <div
          className={cn(
            "pointer-events-auto flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2 transition-all duration-500",
            isScrolled ? "glass-strong max-w-4xl" : "glass-card max-w-5xl"
          )}
        >
          <Link href="/" aria-label={`${profile.name} — home`} className="group flex items-center gap-2.5 shrink-0">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 transition-transform duration-300 group-hover:scale-105">
              <Code2 className="h-5 w-5 text-white" />
            </span>
            <span className="hidden sm:block text-base font-bold tracking-tight">
              <span className="gradient-text-static">{profile.brand}</span>
              <span className="text-gray-900 dark:text-white">.dev</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden lg:flex items-center gap-0.5 rounded-xl bg-gray-100/70 dark:bg-white/[0.05] p-1">
            {NAV_ITEMS.map(({ label, href }) => {
              const active = activeSection === href.slice(1);
              return (
                <button
                  key={href}
                  type="button"
                  onClick={() => goTo(href)}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200",
                    active
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-lg bg-brand-600 shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
              aria-label="Open command palette"
              className="hidden xl:inline-flex h-9 items-center gap-2 rounded-xl border border-gray-200/80 bg-white/60 px-3 text-xs text-gray-500 transition-colors hover:border-brand-500/50 hover:text-brand-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-400 dark:hover:text-brand-300"
            >
              <Search className="h-3.5 w-3.5" />
              <kbd className="font-mono text-[10px]">Ctrl K</kbd>
            </button>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => goTo("#hire")}
              className="hidden sm:inline-flex items-center rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-brand-400 hover:-translate-y-0.5"
            >
              Hire me
            </button>
            <button
              type="button"
              onClick={() => setIsMobileOpen((v) => !v)}
              className="lg:hidden grid h-9 w-9 place-items-center rounded-xl border border-gray-200/80 dark:border-white/10 bg-white/60 dark:bg-white/[0.04]"
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-menu"
            >
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed top-[4.25rem] left-3 right-3 z-30 glass-strong rounded-2xl lg:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-1 p-2">
              {NAV_ITEMS.map(({ label, href }) => (
                <button
                  key={href}
                  type="button"
                  onClick={() => goTo(href)}
                  className={cn(
                    "w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors",
                    activeSection === href.slice(1)
                      ? "bg-brand-500 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.06]"
                  )}
                >
                  {label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => goTo("#hire")}
                className="mt-1 w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white"
              >
                Hire me
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
