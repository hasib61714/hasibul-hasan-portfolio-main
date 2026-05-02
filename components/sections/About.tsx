"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Calendar, Briefcase, GraduationCap, Coffee, Layers, Building2, Lightbulb } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const STATS = [
  { icon: Briefcase,      value: "3+",   label: "Years Experience"    },
  { icon: Coffee,         value: "10+",  label: "Projects Completed"  },
  { icon: GraduationCap,  value: "5+",   label: "Certifications"      },
  { icon: Calendar,       value: "100%", label: "Client Satisfaction" },
];

const ABOUT_ITEMS = [
  {
    icon: Layers,
    color: "from-brand-500 to-cyan-500",
    title: "What I Do",
    desc: "I build full-stack web apps, machine learning systems, AR/VR experiences, and enterprise platforms — spanning React, Next.js, Laravel, FastAPI, and Python.",
  },
  {
    icon: Building2,
    color: "from-green-500 to-emerald-500",
    title: "Where I Work",
    desc: "Software Engineer at Red Data (Pvt.) Ltd., Dhaka, Bangladesh. Promoted from intern to full-time based on performance. Open to remote and global opportunities.",
  },
  {
    icon: Lightbulb,
    color: "from-accent-500 to-pink-500",
    title: "Always Learning",
    desc: "Actively exploring ML, AR/VR, and cyber security. I continuously sharpen my skills across emerging tech to deliver cutting-edge, future-proof solutions.",
  },
];

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding bg-gray-50/80 dark:bg-gray-900/60 relative overflow-hidden">
      {/* subtle bg accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-400/5 dark:bg-brand-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="container-max">
        <SectionHeader
          badge="About Me"
          title="Passionate Developer"
          highlight="& Problem Solver"
          subtitle="I turn complex problems into elegant, user-friendly solutions."
        />

        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — story */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              My Story
            </h3>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                Hi! I&apos;m <strong className="text-gray-900 dark:text-white">Md. Hasibul Hasan</strong>, a
                final-year CSE student at{" "}
                <strong className="text-gray-900 dark:text-white">Green University of Bangladesh</strong>{" "}
                and a full-time Software Engineer at{" "}
                <strong className="text-gray-900 dark:text-white">Red Data (Pvt.) Ltd.</strong> — promoted
                from Intern to permanent Software Engineer after demonstrated
                performance and delivery.
              </p>
              <p>
                I have hands-on experience building production-grade full-stack web
                applications, machine learning systems, and enterprise platforms. My
                stack spans React, Next.js, Laravel, FastAPI, Python, and more. I also
                completed specialized AR/VR development training at Battery Low
                Interactive and a certified cyber security programme at Arena Web Security.
              </p>
              <p>
                I am passionate about clean code, bilingual user experiences, and
                impactful digital solutions. I continuously push boundaries across
                full-stack development, ML systems, and emerging technologies.
              </p>
            </div>

            {/* Location / availability */}
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="w-4 h-4 text-brand-500" />
                Dakshinkhan, Uttara, Dhaka-1230
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-600 dark:text-green-400 font-medium">
                  Open to opportunities
                </span>
              </div>
            </div>

            {/* About items */}
            <div className="grid gap-4 mt-8">
              {ABOUT_ITEMS.map(({ icon: Icon, color, title, desc }) => (
                <div key={title} className="flex gap-4 p-4 glass-card rounded-2xl group">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — stats */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-6">
              {STATS.map(({ icon: Icon, value, label }, idx) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                >
                  <div className="card-premium rounded-2xl p-6 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 dark:from-brand-900/40 dark:to-brand-800/20 flex items-center justify-center mx-auto mb-3 shadow-inner">
                      <Icon className="w-6 h-6 text-brand-500" />
                    </div>
                    <p className="text-4xl font-extrabold gradient-text">{value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tech highlights */}
            <div className="mt-8 p-6 card-premium rounded-2xl">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Core Expertise
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "JavaScript", "TypeScript", "React", "Next.js",
                  "Node.js", "PostgreSQL", "Supabase", "Tailwind CSS",
                  "REST APIs", "GraphQL", "Docker", "Git",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-800/60 hover:bg-brand-100 dark:hover:bg-brand-900/30 transition-colors cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

