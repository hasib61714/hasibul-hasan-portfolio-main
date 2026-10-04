"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CalendarCheck, Download, Globe2, Mail, MapPin, Clock } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";
import { WordReveal } from "@/components/ui/WordReveal";
import { CountUp } from "@/components/ui/CountUp";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/SocialIcons";
import { SITE } from "@/lib/site";
import { mailtoHref, safeUrl } from "@/lib/utils";

interface HeroProps {
  avatarUrl: string | null;
  cvUrl?: string;
  projectCount: number;
  certificateCount: number;
}

const SOCIAL_LINKS = [
  { icon: GitHubIcon,   href: SITE.github,            label: "GitHub"   },
  { icon: LinkedInIcon, href: SITE.linkedin,          label: "LinkedIn" },
  { icon: Mail,         href: mailtoHref(SITE.email), label: "Email"    },
];

const TECH_MARQUEE = [
  "React", "Next.js", "TypeScript", "Node.js", "Laravel", "Python", "FastAPI",
  "PostgreSQL", "Supabase", "Docker", "Tailwind CSS", "Scikit-learn", "Unity", "REST APIs",
];

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function Hero({ avatarUrl, cvUrl, projectCount, certificateCount }: HeroProps) {
  const cvHref = safeUrl(cvUrl);
  const portraitRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: portraitRef, offset: ["start end", "end start"] });
  const portraitY = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const stats = [
    { value: SITE.yearsExperience, label: "Years exp." },
    { value: String(projectCount), label: "Projects" },
    { value: String(certificateCount), label: "Certificates" },
  ];

  return (
    <section id="hero" className="bg-noise relative flex min-h-[100svh] flex-col overflow-hidden mesh-gradient">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white dark:from-gray-950 to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-4 pt-28 pb-14 sm:px-6 lg:px-8">
        <div className="grid w-full grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          {/* ── Copy ── */}
          <div className="space-y-7">
            <motion.div {...fadeUp(0)}>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                {SITE.availability}
              </span>
            </motion.div>

            <motion.div {...fadeUp(0.08)} className="space-y-4">
              <p className="eyebrow">Hi, I&apos;m {SITE.name}</p>
              <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight text-gray-900 dark:text-white sm:text-5xl xl:text-6xl">
                <WordReveal
                  delay={0.15}
                  segments={[
                    { text: "I build reliable web platforms" },
                    { text: "& ML systems", className: "gradient-text accent-serif" },
                    { text: "for teams worldwide." },
                  ]}
                />
              </h1>
            </motion.div>

            <motion.p {...fadeUp(0.16)} className="max-w-xl text-pretty text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              Software Engineer at Red Data with a full-stack focus — React, Next.js, Laravel and
              Python — plus applied ML and AR/VR. I care about clean architecture, performance and
              shipping things that hold up in production.
            </motion.p>

            <motion.ul {...fadeUp(0.22)} className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-brand-500" />{SITE.location}</li>
              <li className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-brand-500" />{SITE.timezone} · async-friendly</li>
              <li className="inline-flex items-center gap-1.5"><Globe2 className="h-4 w-4 text-brand-500" />Remote-first</li>
            </motion.ul>

            <motion.div {...fadeUp(0.28)} className="flex flex-wrap items-center gap-3">
              <Magnetic>
                <button
                  type="button"
                  onClick={() => scrollTo("hire")}
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-brand-500 to-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-xl shadow-brand-600/30 ring-1 ring-inset ring-white/15 transition-colors hover:from-brand-400"
                >
                  Hire me
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </Magnetic>
              {SITE.bookingUrl && (
                <a
                  href={SITE.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3.5 text-base font-semibold text-emerald-700 transition-all hover:-translate-y-0.5 dark:text-emerald-300"
                >
                  <CalendarCheck className="h-4 w-4" />
                  Book a call
                </a>
              )}
              <button
                type="button"
                onClick={() => scrollTo("projects")}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white/70 px-6 py-3.5 text-base font-semibold text-gray-800 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-brand-500/60 dark:border-white/15 dark:bg-white/[0.04] dark:text-gray-100 dark:hover:border-brand-400/60"
              >
                View projects
              </button>
              {cvHref ? (
                <a
                  href={cvHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-3.5 text-base font-semibold text-gray-600 transition-colors hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-300"
                >
                  <Download className="h-4 w-4" />
                  Download CV
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => scrollTo("resume")}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-3.5 text-base font-semibold text-gray-600 transition-colors hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-300"
                >
                  <Download className="h-4 w-4" />
                  Resume
                </button>
              )}
            </motion.div>

            <motion.div {...fadeUp(0.34)} className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Find me on</span>
              <div className="flex gap-2">
                {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-gray-200 bg-white/70 text-gray-500 transition-all hover:-translate-y-0.5 hover:border-brand-500/50 hover:text-brand-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-400 dark:hover:text-brand-300"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Portrait + code card ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center"
          >
            <motion.div ref={portraitRef} style={{ y: portraitY }} className="relative w-full max-w-[19rem] sm:max-w-sm">
              <div aria-hidden className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-brand-500/30 via-accent-500/20 to-cyan-400/20 blur-3xl" />

              <div className="relative aspect-[4/5] rounded-3xl bg-gradient-to-br from-brand-400 via-accent-400 to-cyan-400 p-[1.5px] shadow-2xl shadow-brand-600/25">
                <div className="relative h-full w-full overflow-hidden rounded-[calc(1.5rem-1.5px)] bg-gray-100 dark:bg-gray-900">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={`Portrait of ${SITE.name}`}
                      fill
                      priority
                      sizes="(min-width: 1024px) 384px, 90vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-500/10 via-transparent to-cyan-400/10">
                      <span className="gradient-text select-none text-8xl font-bold tracking-tighter">HH</span>
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-950/85 via-gray-950/40 to-transparent p-4 pt-16">
                    <p className="text-sm font-semibold text-white">{SITE.name}</p>
                    <p className="text-xs text-gray-300">{SITE.role}</p>
                    <dl className="mt-3 grid grid-cols-3 gap-2">
                      {stats.map((s) => (
                        <div key={s.label} className="rounded-xl border border-white/10 bg-white/10 px-2 py-2 text-center backdrop-blur-md">
                          <dd className="text-lg font-bold leading-none text-white"><CountUp value={s.value} /></dd>
                          <dt className="mt-1 text-[11px] text-gray-300">{s.label}</dt>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </div>

              {/* Code card */}
              <motion.div
                aria-hidden
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="relative z-10 mx-3 mt-4 rounded-2xl border border-gray-200/80 bg-white/90 p-4 font-mono text-[11px] leading-relaxed shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/85 sm:absolute sm:-right-6 sm:-top-8 sm:mx-0 sm:mt-0 sm:w-60 xl:-right-14"
              >
                <div className="mb-2 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                </div>
                <p><span className="text-accent-600 dark:text-accent-400">const</span> <span className="text-brand-600 dark:text-brand-300">hasibul</span> = {"{"}</p>
                <p className="pl-3">role: <span className="text-emerald-600 dark:text-emerald-300">&quot;Software Engineer&quot;</span>,</p>
                <p className="pl-3">stack: <span className="text-emerald-600 dark:text-emerald-300">[&quot;Next.js&quot;, &quot;Laravel&quot;, &quot;Python&quot;]</span>,</p>
                <p className="pl-3">focus: <span className="text-emerald-600 dark:text-emerald-300">[&quot;ML&quot;, &quot;AR/VR&quot;]</span>,</p>
                <p className="pl-3">timezone: <span className="text-emerald-600 dark:text-emerald-300">&quot;{SITE.timezone}&quot;</span>,</p>
                <p className="pl-3">openTo: <span className="text-emerald-600 dark:text-emerald-300">&quot;remote&quot;</span>,</p>
                <p>{"}"}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Technology marquee */}
      <div className="relative z-10 border-y border-gray-200/70 bg-white/50 py-5 backdrop-blur-sm dark:border-white/[0.06] dark:bg-white/[0.02]">
        <p className="eyebrow mb-4 text-center !text-gray-500 dark:!text-gray-500">Technologies I ship with</p>
        <div className="group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 animate-marquee items-center gap-10 pr-10 group-hover:[animation-play-state:paused]"
            >
              {TECH_MARQUEE.map((tech) => (
                <li key={tech} className="whitespace-nowrap font-mono text-sm text-gray-500 dark:text-gray-400">
                  {tech}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
