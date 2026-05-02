"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Mail, ExternalLink, Sparkles } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/SocialIcons";
import { GITHUB_URL, LINKEDIN_URL, EMAIL_ADDRESS } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const SOCIAL_LINKS = [
  { icon: GitHubIcon,   href: GITHUB_URL,               label: "GitHub"   },
  { icon: LinkedInIcon, href: LINKEDIN_URL,              label: "LinkedIn" },
  { icon: Mail,         href: `mailto:${EMAIL_ADDRESS}`, label: "Email"    },
];

const TECH_BADGES = ["React", "Next.js", "TypeScript", "Laravel", "Python", "Supabase"];

const STATS = [
  { value: "3+",   label: "Years Exp.",          color: "from-brand-500 to-cyan-500"   },
  { value: "10+",  label: "Projects",             color: "from-accent-500 to-pink-500"  },
  { value: "100%", label: "Client Satisfaction",  color: "from-green-500 to-emerald-500" },
];

export function Hero() {
  const [profilePicUrl, setProfilePicUrl] = useState<string>("");
  const [profilePicError, setProfilePicError] = useState(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
    const supabase = createClient();
    const { data } = supabase.storage.from("profile").getPublicUrl("avatar/current");
    setProfilePicUrl(data.publicUrl);
  }, []);

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToHire = () => {
    document.getElementById("hire")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden mesh-gradient"
    >
      {/* ── Aurora background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large aurora blobs */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-brand-400/25 to-cyan-400/15 dark:from-brand-600/20 dark:to-cyan-600/10 blur-[100px] animate-blob" />
        <div className="absolute -top-20 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-accent-400/20 to-purple-400/15 dark:from-accent-600/15 dark:to-purple-600/10 blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-cyan-400/15 to-brand-400/10 blur-[80px] animate-blob animation-delay-4000" />

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #3b82f6 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white dark:from-gray-950 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left column ── */}
          <div className="order-2 lg:order-1 space-y-7">

            {/* Available badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex"
            >
              <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-green-500/30 bg-green-50/80 dark:bg-green-900/20 backdrop-blur-sm text-green-600 dark:text-green-400 text-sm font-medium shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                Available for new projects
              </span>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight">
                <span className="block text-gray-900 dark:text-white">Hi, I&apos;m</span>
                <span className="block gradient-text mt-1">Md.Hasibul Hasan</span>
                <span className="block text-gray-500 dark:text-gray-400 text-4xl md:text-5xl lg:text-6xl font-bold mt-2">
                  Software &amp; ML Engineer
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg"
            >
              I build production-grade full-stack web apps, machine learning
              systems, and enterprise platforms. Currently a Software Engineer
              at Red Data — passionate about clean code and impactful solutions.
            </motion.p>

            {/* Tech badges */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              {TECH_BADGES.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl glass-card text-gray-700 dark:text-gray-300 hover:border-brand-400/50 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-200 cursor-default"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={scrollToHire}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 via-brand-500 to-accent-500 text-white font-semibold text-base shadow-xl shadow-brand-500/30 hover:shadow-brand-500/50 transition-shadow duration-300"
              >
                <Sparkles className="w-5 h-5" />
                Hire Me
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={scrollToProjects}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl glass-card border border-brand-500/30 hover:border-brand-500 text-brand-600 dark:text-brand-400 font-semibold text-base hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all duration-200"
              >
                <ExternalLink className="w-5 h-5" />
                View Work
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => document.getElementById("resume")?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-gray-600 dark:text-gray-400 font-semibold text-base hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <Download className="w-5 h-5" />
                Download CV
              </motion.button>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-3 pt-1"
            >
              <span className="text-sm text-gray-400">Find me on:</span>
              <div className="flex gap-2">
                {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 hover:border-brand-400/40 transition-colors duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right column — avatar ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 blur-3xl opacity-20 scale-110 animate-pulse-slow" />

              {/* Rotating dashed ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-12px] rounded-full border-2 border-dashed border-brand-400/25"
              />

              {/* Avatar frame */}
              <div className="relative w-72 h-72 md:w-[340px] md:h-[340px] rounded-full p-1 bg-gradient-to-br from-brand-500 via-accent-500 to-cyan-400 shadow-2xl shadow-brand-500/25">
                <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center text-[100px] select-none">
                  {profilePicUrl && !profilePicError ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profilePicUrl}
                      alt="Hasibul Hasan"
                      className="w-full h-full object-cover"
                      onError={() => setProfilePicError(true)}
                    />
                  ) : (
                    "👨‍💻"
                  )}
                </div>
              </div>

              {/* Floating stat cards */}
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.15, type: "spring", stiffness: 200 }}
                  className={`absolute glass-strong rounded-2xl px-4 py-3 shadow-xl ${
                    i === 0 ? "-left-10 top-14" :
                    i === 1 ? "-right-10 top-1/3" :
                    "-bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  }`}
                >
                  <p className={`text-2xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500"
        >
          <span className="text-xs font-medium tracking-widest uppercase">Scroll down</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-9 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-start justify-center pt-1.5"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
