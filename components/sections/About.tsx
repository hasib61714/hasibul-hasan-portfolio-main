"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Layers, Building2, Lightbulb, GraduationCap, Briefcase, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SITE } from "@/lib/site";

interface AboutProps {
  projectCount: number;
  certificateCount: number;
}

const PILLARS = [
  {
    icon: Layers,
    color: "from-brand-500 to-cyan-500",
    title: "What I do",
    desc: "Full-stack web apps, ML systems, AR/VR experiences and enterprise platforms — React, Next.js, Laravel, FastAPI and Python.",
  },
  {
    icon: Building2,
    color: "from-emerald-500 to-teal-500",
    title: "How I work",
    desc: "Clear communication, typed and tested code, small reviewable changes. Comfortable working asynchronously with distributed teams.",
  },
  {
    icon: Lightbulb,
    color: "from-accent-500 to-pink-500",
    title: "Always learning",
    desc: "Actively exploring applied ML, AR/VR and security so the systems I build stay modern, fast and safe by default.",
  },
];

const CORE_STACK = [
  "TypeScript", "JavaScript", "React", "Next.js", "Node.js", "Laravel", "Python", "FastAPI",
  "PostgreSQL", "Supabase", "MongoDB", "Tailwind CSS", "REST APIs", "Docker", "Git", "Scikit-learn",
];

const item = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as const } }),
};

export function About({ projectCount, certificateCount }: AboutProps) {
  const stats = [
    { value: SITE.yearsExperience, label: "Years building software" },
    { value: `${projectCount}`,      label: "Projects showcased" },
    { value: `${certificateCount}`,  label: "Certifications" },
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
      <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-brand-500/5 blur-3xl" />
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
              <p>
                I&apos;m <strong className="text-gray-900 dark:text-white">{SITE.name}</strong>, a Software
                Engineer at <strong className="text-gray-900 dark:text-white">Red Data (Pvt.) Ltd.</strong>, a
                licensed internet service provider in Dhaka, where I was promoted from intern to full-time
                engineer for consistently shipping. I&apos;m also completing my B.Sc. in Computer Science &amp;
                Engineering at <strong className="text-gray-900 dark:text-white">Green University of Bangladesh</strong>.
              </p>
              <p>
                My work spans production full-stack applications, machine-learning systems and enterprise
                platforms, plus AR/VR development with Unity and a certified cyber-security programme that
                shapes how I think about building secure-by-default software.
              </p>
              <p>
                I care about clean, maintainable code, accessible and multilingual user experiences, and
                measurable impact. I&apos;m based in Dhaka ({SITE.timezone}) and enjoy collaborating with
                distributed teams across time zones.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-gray-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-300">
                <MapPin className="h-4 w-4 text-brand-500" /> {SITE.location}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-gray-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-300">
                <Clock className="h-4 w-4 text-brand-500" /> {SITE.timezone}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 font-medium text-emerald-700 dark:text-emerald-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> Open to opportunities
              </span>
            </div>
          </motion.article>

          {/* Current role */}
          <motion.article {...cardProps(1)} className="card-premium rounded-3xl p-6 md:col-span-5">
            <div className="mb-3 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 text-white shadow-md">
                <Briefcase className="h-5 w-5" />
              </span>
              <p className="eyebrow !tracking-[0.14em]">Currently</p>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Software Engineer · Red Data</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Building enterprise web systems, REST APIs and internal tooling since Feb 2026.
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {["Next.js", "Laravel", "PostgreSQL", "REST APIs"].map((t) => (
                <li key={t} className="rounded-md border border-gray-200/80 bg-gray-100 px-2 py-1 font-mono text-[11px] text-gray-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-gray-400">{t}</li>
              ))}
            </ul>
          </motion.article>

          {/* Education */}
          <motion.article {...cardProps(2)} className="card-premium rounded-3xl p-6 md:col-span-5">
            <div className="mb-3 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md">
                <GraduationCap className="h-5 w-5" />
              </span>
              <p className="eyebrow !tracking-[0.14em]">Education</p>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">B.Sc. in Computer Science &amp; Engineering</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Green University of Bangladesh · final year · thesis on explainable AI for health prediction.
            </p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {["Algorithms", "Machine Learning", "Software Engineering", "Databases"].map((t) => (
                <li key={t} className="rounded-md border border-gray-200/80 bg-gray-100 px-2 py-1 font-mono text-[11px] text-gray-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-gray-400">{t}</li>
              ))}
            </ul>
          </motion.article>

          {/* Pillars */}
          {PILLARS.map(({ icon: Icon, color, title, desc }, i) => (
            <motion.article key={title} {...cardProps(3 + i)} className="card-premium group rounded-3xl p-6 md:col-span-4">
              <span className={`mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${color} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}>
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{desc}</p>
            </motion.article>
          ))}

          {/* Stack */}
          <motion.article {...cardProps(6)} className="card-premium rounded-3xl p-6 md:col-span-8">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Core stack</h3>
            </div>
            <ul className="flex flex-wrap gap-2">
              {CORE_STACK.map((tech) => (
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
            <dl className="grid h-full grid-cols-3 gap-3 text-center md:grid-cols-1 md:content-center md:gap-4 md:text-left">
              {stats.map((s) => (
                <div key={s.label} className="md:grid md:grid-cols-[4rem_1fr] md:items-baseline md:gap-3">
                  <dd className="gradient-text text-3xl font-bold md:text-right">{s.value}</dd>
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
