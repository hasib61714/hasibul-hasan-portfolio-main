"use client";

import { motion } from "framer-motion";
import {
  MapPin, Clock, Layers, Building2, Lightbulb, GraduationCap, Briefcase, Sparkles,
  Brain, Code2, Server, Shield, Rocket, Search, Glasses, Database, Smartphone, Cloud, Palette,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CountUp } from "@/components/ui/CountUp";
import { useProfile } from "@/components/ProfileProvider";
import type { GithubStats } from "@/lib/github";
import type { ExperienceItem } from "@/lib/experience";
import type { ContentBlock } from "@/types";

interface AboutProps {
  projectCount: number;
  certificateCount: number;
  github: GithubStats | null;
  pillars: ContentBlock[];
  experiences: ExperienceItem[];
}

const PILLAR_ICONS: Record<string, LucideIcon> = {
  layers: Layers, building: Building2, lightbulb: Lightbulb, brain: Brain, code: Code2, server: Server,
  shield: Shield, rocket: Rocket, search: Search, glasses: Glasses, database: Database, smartphone: Smartphone,
  cloud: Cloud, palette: Palette,
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as const } }),
};

/** Renders **bold** markers inside a paragraph. */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

const chip = "rounded-md border border-gray-200/80 bg-gray-100 px-2 py-1 font-mono text-[11px] text-gray-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-gray-400";

export function About({ projectCount, certificateCount, github, pillars, experiences }: AboutProps) {
  const profile = useProfile();
  const paragraphs = profile.aboutStory.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  const currentJob = experiences.find((e) => e.type === "work" && e.current) ?? experiences.find((e) => e.type === "work");
  const education = experiences.find((e) => e.type === "education");

  const stats = [
    { value: profile.yearsExperience, label: "Years building software" },
    { value: `${projectCount}`,       label: "Projects showcased" },
    { value: `${certificateCount}`,   label: "Certifications" },
    ...(github
      ? [
          { value: `${github.repos}`, label: "Public GitHub repos" },
          { value: `${github.stars}`, label: "GitHub stars earned" },
        ]
      : []),
  ];

  const cardProps = (i: number) => ({
    variants: item,
    custom: i,
    initial: "hidden" as const,
    whileInView: "show" as const,
    viewport: { once: true, margin: "-60px" },
  });

  return (
    <section id="about" className="section-padding relative overflow-hidden bg-gray-50/70 dark:bg-gray-900/40">
      <div className="container-max">
        <SectionHeader
          badge="About"
          title="Engineer, problem-solver,"
          highlight="lifelong learner"
          subtitle="Turning complex requirements into elegant, dependable software."
        />

        <div className="grid gap-5 md:grid-cols-12">
          {/* Story */}
          <motion.article {...cardProps(0)} className="card-premium rounded-3xl p-7 sm:p-9 md:col-span-7 md:row-span-2">
            <h3 className="mb-5 text-2xl font-bold text-gray-900 dark:text-white">My story</h3>
            <div className="space-y-4 leading-relaxed text-gray-600 dark:text-gray-400">
              {paragraphs.map((p, i) => <p key={i}><RichText text={p} /></p>)}
            </div>

            <div className="mt-7 flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-gray-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-300">
                <MapPin className="h-4 w-4 text-brand-500" /> {profile.location}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-gray-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-300">
                <Clock className="h-4 w-4 text-brand-500" /> {profile.timezone}
              </span>
              {profile.openToWork && (
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 font-medium text-emerald-700 dark:text-emerald-300">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> Open to opportunities
                </span>
              )}
            </div>
          </motion.article>

          {/* Current role */}
          {currentJob && (
            <motion.article {...cardProps(1)} className="card-premium rounded-3xl p-6 md:col-span-5">
              <div className="mb-3 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white shadow-md">
                  <Briefcase className="h-5 w-5" />
                </span>
                <p className="eyebrow !tracking-[0.14em]">{currentJob.current ? "Currently" : "Latest role"}</p>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{currentJob.title} · {currentJob.organization}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{currentJob.description[0]} <span className="whitespace-nowrap text-gray-500">({currentJob.period})</span></p>
              {currentJob.tech && currentJob.tech.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {currentJob.tech.slice(0, 4).map((t) => <li key={t} className={chip}>{t}</li>)}
                </ul>
              )}
            </motion.article>
          )}

          {/* Education */}
          {education && (
            <motion.article {...cardProps(2)} className="card-premium rounded-3xl p-6 md:col-span-5">
              <div className="mb-3 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white shadow-md">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <p className="eyebrow !tracking-[0.14em]">Education</p>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{education.title}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {education.organization} · {education.period}
                {education.description[0] ? ` · ${education.description[0]}` : ""}
              </p>
              {education.tech && education.tech.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {education.tech.slice(0, 4).map((t) => <li key={t} className={chip}>{t}</li>)}
                </ul>
              )}
            </motion.article>
          )}

          {/* Pillars */}
          {pillars.map(({ id, icon, title, description }, i) => {
            const Icon = PILLAR_ICONS[icon ?? ""] ?? Sparkles;
            return (
              <motion.article key={id} {...cardProps(3 + i)} className="card-premium group rounded-3xl p-6 md:col-span-4">
                <span className={`mb-4 grid h-11 w-11 place-items-center rounded-xl bg-brand-600 text-white shadow-md transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{description}</p>
              </motion.article>
            );
          })}

          {/* Stack */}
          <motion.article {...cardProps(6)} className="card-premium rounded-3xl p-6 md:col-span-8">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Core stack</h3>
            </div>
            <ul className="flex flex-wrap gap-2">
              {profile.coreStack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-lg border border-brand-100 bg-brand-50 px-3 py-1.5 font-mono text-xs font-medium text-brand-700 transition-colors hover:bg-brand-100 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300 dark:hover:bg-brand-500/20"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </motion.article>

          {/* Stats */}
          <motion.article {...cardProps(7)} className="card-premium rounded-3xl p-6 md:col-span-4">
            <dl className="grid h-full grid-cols-3 gap-3 text-center md:grid-cols-1 md:content-center md:gap-3 md:text-left">
              {stats.map((s) => (
                <div key={s.label} className="md:grid md:grid-cols-[4rem_1fr] md:items-baseline md:gap-3">
                  <dd className="gradient-text text-3xl font-bold md:text-right"><CountUp value={s.value} /></dd>
                  <dt className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 md:mt-0 md:text-sm">{s.label}</dt>
                </div>
              ))}
            </dl>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
