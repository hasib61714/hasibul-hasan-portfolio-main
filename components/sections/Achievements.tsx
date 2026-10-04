"use client";

import { motion } from "framer-motion";
import { Award, BookOpen, GitPullRequest, Mic, Sparkles, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { formatDate, safeUrl } from "@/lib/utils";
import type { Achievement, AchievementKind } from "@/types";

const KIND_META: Record<AchievementKind, { label: string; icon: LucideIcon; gradient: string }> = {
  award:         { label: "Award",        icon: Award,          gradient: "from-amber-500 to-orange-500" },
  "open-source": { label: "Open source",  icon: GitPullRequest, gradient: "from-emerald-500 to-teal-500" },
  talk:          { label: "Talk",         icon: Mic,            gradient: "from-accent-500 to-pink-500" },
  publication:   { label: "Publication",  icon: BookOpen,       gradient: "from-brand-500 to-cyan-500" },
  other:         { label: "Achievement",  icon: Sparkles,       gradient: "from-brand-500 to-accent-500" },
};

/** Renders nothing until you add achievements in Admin → Achievements. */
export function Achievements({ items }: { items: Achievement[] }) {
  if (items.length === 0) return null;

  return (
    <section id="achievements" className="section-padding bg-white dark:bg-gray-950">
      <div className="container-max">
        <SectionHeader
          badge="Achievements"
          title="Recognition &"
          highlight="contributions"
          subtitle="Awards, open-source work, talks and publications."
        />

        <ul className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
          {items.map((item, i) => {
            const meta = KIND_META[item.kind] ?? KIND_META.other;
            const Icon = meta.icon;
            const url = safeUrl(item.url);
            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 2) * 0.08 }}
                className="card-premium flex gap-4 rounded-2xl p-5"
              >
                <span className={`relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${meta.gradient} text-white shadow-md`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="relative z-10 min-w-0">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-gray-500">
                    {meta.label}
                    {item.achieved_on ? ` · ${formatDate(item.achieved_on)}` : ""}
                  </p>
                  <h3 className="mt-1 font-bold text-gray-900 dark:text-white">{item.title}</h3>
                  {item.organization && <p className="text-sm font-medium text-brand-600 dark:text-brand-300">{item.organization}</p>}
                  {item.description && <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{item.description}</p>}
                  {url && (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-300">
                      Learn more <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
