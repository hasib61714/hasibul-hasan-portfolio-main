"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Brain, Code2, Layers, ShoppingBag, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GitHubIcon } from "@/components/ui/SocialIcons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn, projectSlug, safeUrl } from "@/lib/utils";
import type { Project } from "@/types";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Full-Stack": Layers,
  "ML/AI":      Brain,
  "E-Commerce": ShoppingBag,
  Mobile:       Smartphone,
};

const PROJECT_GRADIENTS = [
  "from-brand-600 to-accent-500",
  "from-accent-600 to-brand-500",
  "from-brand-500 to-cyan-500",
  "from-cyan-600 to-brand-600",
  "from-accent-500 to-cyan-500",
  "from-brand-700 to-accent-500",
];

interface ProjectsProps {
  projects: Project[];
}

export function Projects({ projects }: ProjectsProps) {
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="section-padding relative overflow-hidden bg-gray-50/70 dark:bg-gray-900/40">
      <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 h-96 w-96 rounded-full bg-brand-500/5 blur-3xl" />
      <div className="container-max">
        <SectionHeader
          badge="Selected work"
          title="Projects I&apos;m"
          highlight="proud of"
          subtitle="From ML research tools to production ERP and marketplace platforms — built end to end."
        />

        {categories.length > 2 && (
          <div role="group" aria-label="Filter projects by category" className="mb-12 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                aria-pressed={filter === cat}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200",
                  filter === cat
                    ? "bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-600/25"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-brand-400/60 hover:text-brand-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-400 dark:hover:text-brand-300"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <motion.ul layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, idx) => {
              const live = safeUrl(project.live_url);
              const code = safeUrl(project.github_url);
              const image = safeUrl(project.image_url);
              const Icon = CATEGORY_ICONS[project.category] ?? Code2;
              return (
                <motion.li
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.35, delay: idx * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  className="group card-premium flex flex-col overflow-hidden rounded-2xl"
                >
                  <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${PROJECT_GRADIENTS[idx % PROJECT_GRADIENTS.length]}`}>
                    {image ? (
                      <Image
                        src={image}
                        alt={`${project.title} screenshot`}
                        fill
                        sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <>
                        <div aria-hidden className="absolute inset-0 bg-grid opacity-40 [mask-image:none]" />
                        <Icon aria-hidden className="absolute right-4 bottom-3 h-24 w-24 text-white/25 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" />
                        <span aria-hidden className="absolute left-5 bottom-4 font-mono text-5xl font-bold text-white/30">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </>
                    )}
                    <span className="absolute left-3 top-3 rounded-lg bg-black/40 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="absolute right-3 top-3 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-bold text-brand-700 shadow-sm">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-300">
                      <Link
                        href={`/projects/${projectSlug(project)}`}
                        className="after:absolute after:inset-0 after:z-10 focus-visible:outline-offset-4"
                      >
                        {project.title}
                      </Link>
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      {project.description}
                    </p>

                    <ul className="mb-5 flex flex-wrap gap-1.5">
                      {project.tech_stack.slice(0, 5).map((tech) => (
                        <li
                          key={tech}
                          className="rounded-md border border-gray-200/80 bg-gray-100 px-2 py-1 font-mono text-[11px] text-gray-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-gray-400"
                        >
                          {tech}
                        </li>
                      ))}
                      {project.tech_stack.length > 5 && (
                        <li className="rounded-md px-2 py-1 font-mono text-[11px] text-gray-500">+{project.tech_stack.length - 5}</li>
                      )}
                    </ul>

                    <div className="relative z-20 mt-auto flex items-center gap-2 border-t border-gray-100 pt-4 dark:border-white/[0.06]">
                      <Link
                        href={`/projects/${projectSlug(project)}`}
                        className="mr-auto inline-flex items-center gap-1 text-xs font-semibold text-brand-600 transition-colors hover:text-brand-500 dark:text-brand-300"
                      >
                        Case study <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      {live && (
                        <a
                          href={live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-500"
                        >
                          Live <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {code && (
                        <a
                          href={code}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:border-brand-400/60 hover:text-brand-600 dark:border-white/10 dark:text-gray-300 dark:hover:text-brand-300"
                        >
                          <GitHubIcon className="h-3.5 w-3.5" /> Source
                        </a>
                      )}
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
