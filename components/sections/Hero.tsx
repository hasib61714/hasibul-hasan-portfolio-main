"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CalendarCheck, Download, Globe2, Mail, MapPin, Clock } from "lucide-react";
import { Magnetic } from "@/components/ui/Magnetic";
import { WordReveal } from "@/components/ui/WordReveal";
import { CountUp } from "@/components/ui/CountUp";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { useProfile } from "@/components/ProfileProvider";
import { socialLinks } from "@/lib/profile-defaults";
import { mailtoHref, safeUrl } from "@/lib/utils";

interface HeroProps {
  avatarUrl: string | null;
  cvUrl?: string;
  projectCount: number;
  certificateCount: number;
}

const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export function Hero({ avatarUrl, cvUrl, projectCount, certificateCount }: HeroProps) {
  const profile = useProfile();
  const bookingUrl = safeUrl(profile.bookingUrl);
  const socials = socialLinks(profile, ["github", "linkedin", "twitter", "youtube", "instagram"]);
  const cvHref = safeUrl(cvUrl);
  // Repeat short lists so the scrolling strip never shows gaps.
  const marqueeItems = Array.from({ length: Math.max(1, Math.ceil(14 / Math.max(1, profile.techMarquee.length))) }).flatMap(() => profile.techMarquee);
  const portraitRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: portraitRef, offset: ["start end", "end start"] });
  const portraitY = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const stats = [
    { value: profile.yearsExperience, label: "Years exp." },
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
              {profile.openToWork ? (
                <span className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  {profile.availability}
                </span>
              ) : (
                <span className="inline-flex items-center gap-2.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-700 dark:text-amber-300">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Currently booked — open to future projects
                </span>
              )}
            </motion.div>

            <motion.div {...fadeUp(0.08)} className="space-y-4">
              <p className="eyebrow">Hi, I&apos;m {profile.name}</p>
              <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight text-gray-900 dark:text-white sm:text-5xl xl:text-6xl">
                <WordReveal
                  delay={0.15}
                  segments={[
                    { text: profile.headlineBefore },
                    { text: profile.headlineAccent, className: "gradient-text accent-serif" },
                    { text: profile.headlineAfter },
                  ].filter((s) => s.text.trim())}
                />
              </h1>
            </motion.div>

            <motion.p {...fadeUp(0.16)} className="max-w-xl text-pretty text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              {profile.heroDescription}
            </motion.p>

            <motion.ul {...fadeUp(0.22)} className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-brand-500" />{profile.location}</li>
              <li className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-brand-500" />{profile.timezone} · async-friendly</li>
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
              {bookingUrl && (
                <a
                  href={bookingUrl}
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
                {socials.map(({ key, href, label }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-gray-200 bg-white/70 text-gray-500 transition-all hover:-translate-y-0.5 hover:border-brand-500/50 hover:text-brand-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-400 dark:hover:text-brand-300"
                  >
                    <SocialIcon name={key} className="h-4 w-4" />
                  </a>
                ))}
                <a
                  href={mailtoHref(profile.email)}
                  aria-label="Email"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-gray-200 bg-white/70 text-gray-500 transition-all hover:-translate-y-0.5 hover:border-brand-500/50 hover:text-brand-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-400 dark:hover:text-brand-300"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* ── Circular portrait ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center"
          >
            <motion.div ref={portraitRef} style={{ y: portraitY }} className="relative">
              {/* Soft glow */}
              <div aria-hidden className="absolute inset-0 scale-110 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 opacity-25 blur-3xl animate-pulse-slow" />

              {/* Rotating dashed ring */}
              <motion.div
                aria-hidden
                animate={{ rotate: 360 }}
                transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-3 rounded-full border-2 border-dashed border-brand-400/30"
              />

              {/* Avatar frame */}
              <div className="relative h-72 w-72 rounded-full bg-gradient-to-br from-brand-500 via-accent-500 to-cyan-400 p-1 shadow-2xl shadow-brand-600/30 sm:h-80 sm:w-80 lg:h-[22rem] lg:w-[22rem]">
                <div className="relative h-full w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-900">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={`Portrait of ${profile.name}`}
                      fill
                      priority
                      sizes="(min-width: 1024px) 352px, 320px"
                      className="object-cover object-top"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-500/10 via-transparent to-cyan-400/10">
                      <span className="gradient-text select-none text-8xl font-bold tracking-tighter">HH</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Floating stat cards (large screens) */}
              {stats.map((st, i) => (
                <motion.div
                  key={st.label}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.15, type: "spring", stiffness: 200 }}
                  className={`glass-strong absolute hidden rounded-2xl px-4 py-3 shadow-xl lg:block ${
                    i === 0 ? "-left-10 top-14" : i === 1 ? "-right-10 top-1/3" : "-bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  }`}
                >
                  <p className="gradient-text text-2xl font-extrabold leading-none"><CountUp value={st.value} /></p>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{st.label}</p>
                </motion.div>
              ))}

              {/* Stats row (smaller screens) */}
              <dl className="mt-8 grid grid-cols-3 gap-2 lg:hidden">
                {stats.map((st) => (
                  <div key={st.label} className="card-premium rounded-xl px-2 py-3 text-center">
                    <dd className="relative z-10 text-xl font-bold leading-none text-gray-900 dark:text-white"><CountUp value={st.value} /></dd>
                    <dt className="relative z-10 mt-1.5 text-[11px] text-gray-500 dark:text-gray-400">{st.label}</dt>
                  </div>
                ))}
              </dl>
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
              {marqueeItems.map((tech, ti) => (
                <li key={`${tech}-${ti}`} className="whitespace-nowrap font-mono text-sm text-gray-500 dark:text-gray-400">
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
