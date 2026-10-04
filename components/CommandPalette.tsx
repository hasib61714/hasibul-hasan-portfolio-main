"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, CalendarCheck, Copy, Download, FileText, FolderKanban, Mail, MessageCircle,
  Moon, Search, Sun, User, Briefcase, Wrench, Award, Send,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/SocialIcons";
import { NAV_ITEMS, SITE, whatsappUrl } from "@/lib/site";
import { mailtoHref, safeUrl } from "@/lib/utils";
import toast from "react-hot-toast";

export const OPEN_PALETTE_EVENT = "open-command-palette";

interface PaletteProject {
  title: string;
  slug: string;
}

interface Command {
  id: string;
  group: "Navigate" | "Projects" | "Actions";
  label: string;
  hint?: string;
  icon: LucideIcon | ((p: { className?: string }) => React.ReactElement);
  run: () => void;
}

const SECTION_ICONS: Record<string, LucideIcon> = {
  "#about": User,
  "#experience": Briefcase,
  "#skills": Wrench,
  "#projects": FolderKanban,
  "#certificates": Award,
  "#resume": FileText,
  "#contact": Send,
};

export function CommandPalette({ projects, cvUrl }: { projects: PaletteProject[]; cvUrl?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const goSection = useCallback(
    (href: string) => {
      if (pathname === "/") document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      else router.push(`/${href}`);
    },
    [pathname, router]
  );

  const commands = useMemo<Command[]>(() => {
    const list: Command[] = [
      ...NAV_ITEMS.map<Command>(({ label, href }) => ({
        id: `nav-${href}`, group: "Navigate", label: `Go to ${label}`, icon: SECTION_ICONS[href] ?? ArrowRight,
        run: () => goSection(href),
      })),
      { id: "nav-hire", group: "Navigate", label: "Go to Hire me", icon: Briefcase, run: () => goSection("#hire") },
      ...projects.map<Command>((p) => ({
        id: `project-${p.slug}`, group: "Projects", label: p.title, hint: "Case study", icon: FolderKanban,
        run: () => router.push(`/projects/${p.slug}`),
      })),
    ];
    const cv = safeUrl(cvUrl);
    if (SITE.bookingUrl) {
      list.push({ id: "book", group: "Actions", label: "Book a call", icon: CalendarCheck, run: () => window.open(SITE.bookingUrl, "_blank", "noopener") });
    }
    list.push(
      { id: "email", group: "Actions", label: "Send an email", hint: SITE.email, icon: Mail, run: () => (window.location.href = mailtoHref(SITE.email)) },
      {
        id: "copy-email", group: "Actions", label: "Copy email address", icon: Copy,
        run: () => navigator.clipboard.writeText(SITE.email).then(() => toast.success("Email copied"), () => toast.error("Couldn't copy")),
      },
      { id: "whatsapp", group: "Actions", label: "Chat on WhatsApp", icon: MessageCircle, run: () => window.open(whatsappUrl(), "_blank", "noopener") },
      { id: "github", group: "Actions", label: "Open GitHub", icon: GitHubIcon, run: () => window.open(SITE.github, "_blank", "noopener") },
      { id: "linkedin", group: "Actions", label: "Open LinkedIn", icon: LinkedInIcon, run: () => window.open(SITE.linkedin, "_blank", "noopener") },
    );
    if (cv) list.push({ id: "cv", group: "Actions", label: "Download CV", icon: Download, run: () => window.open(cv, "_blank", "noopener") });
    list.push({
      id: "theme", group: "Actions", label: resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme",
      icon: resolvedTheme === "dark" ? Sun : Moon, run: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
    });
    return list;
  }, [projects, cvUrl, goSection, router, resolvedTheme, setTheme]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? commands.filter((c) => `${c.label} ${c.hint ?? ""} ${c.group}`.toLowerCase().includes(q)) : commands;
  }, [commands, query]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    document.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const execute = (cmd?: Command) => {
    if (!cmd) return;
    close();
    // let the dialog unmount before scrolling/navigating
    setTimeout(cmd.run, 60);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); execute(results[active]); }
  };

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh]">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close} aria-hidden="true"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            role="dialog" aria-modal="true" aria-label="Command palette"
            initial={{ opacity: 0, y: -12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="glass-strong relative w-full max-w-xl overflow-hidden rounded-2xl"
          >
            <div className="flex items-center gap-3 border-b border-gray-200 px-4 dark:border-white/10">
              <Search className="h-4 w-4 shrink-0 text-gray-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
                placeholder="Search sections, projects, actions…"
                className="h-14 w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
              />
              <kbd className="hidden rounded-md border border-gray-200 px-1.5 py-0.5 font-mono text-[10px] text-gray-500 dark:border-white/15 sm:block">ESC</kbd>
            </div>

            <ul id={listId} ref={listRef} role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-gray-500">No results for “{query}”</li>}
              {results.map((cmd, i) => {
                const showGroup = cmd.group !== lastGroup;
                lastGroup = cmd.group;
                const Icon = cmd.icon;
                return (
                  <li key={cmd.id} role="presentation">
                    {showGroup && <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-widest text-gray-500">{cmd.group}</p>}
                    <button
                      id={`${listId}-${i}`}
                      data-index={i}
                      role="option"
                      aria-selected={i === active}
                      type="button"
                      onMouseMove={() => setActive(i)}
                      onClick={() => execute(cmd)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                        i === active ? "bg-brand-500/10 text-brand-700 dark:text-brand-200" : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0 opacity-70" />
                      <span className="flex-1 truncate">{cmd.label}</span>
                      {cmd.hint && <span className="truncate text-xs text-gray-500">{cmd.hint}</span>}
                      {i === active && <ArrowRight className="h-3.5 w-3.5 opacity-60" />}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-2.5 font-mono text-[10px] text-gray-500 dark:border-white/10">
              <span>↑↓ navigate · ↵ select</span>
              <span>Ctrl / ⌘ + K to toggle</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
