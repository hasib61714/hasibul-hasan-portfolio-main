"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase, GraduationCap, MapPin, Calendar, ExternalLink } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

type TabType = "work" | "education";

interface ExperienceItem {
  id: string;
  type: TabType;
  title: string;
  organization: string;
  location: string;
  period: string;
  current?: boolean;
  description: string[];
  tech?: string[];
  color: string;
  link?: string;
}

const EXPERIENCES: ExperienceItem[] = [
  {
    id: "1",
    type: "work",
    title: "Software Engineer (Full-Time)",
    organization: "Red Data (Pvt.) Ltd.",
    location: "134 Gulshan Ave, Dhaka 1212",
    period: "Feb 2026 – Present",
    current: true,
    description: [
      "Full-time Software Engineer at a BTRC-licensed ISP contributing to enterprise-grade web systems and infrastructure.",
      "Promoted from Intern to permanent Software Engineer after demonstrated performance and delivery.",
      "Building and maintaining enterprise web solutions, REST APIs, and internal tooling.",
      "Working in an agile team under CEO Moin Uddin Ahmed; supervised by Rukonuzzaman, Software Engineer.",
    ],
    tech: ["React", "Next.js", "TypeScript", "Laravel", "Supabase", "PostgreSQL", "REST APIs", "Tailwind CSS"],
    color: "from-brand-500 to-cyan-500",
    link: "https://reddata.com.bd",
  },
  {
    id: "2",
    type: "work",
    title: "AR/VR Developer Training",
    organization: "Battery Low Interactive Ltd.",
    location: "Bangladesh",
    period: "2026",
    description: [
      "Completed specialized AR/VR development training with hands-on live project work using Unity.",
      "Built interactive AR applications targeting mobile and wearable platforms.",
      "Gained practical experience in XR development workflows and 3D asset integration.",
    ],
    tech: ["Unity", "C#", "AR Foundation", "XR Development", "3D Modeling"],
    color: "from-purple-500 to-accent-500",
  },
  {
    id: "3",
    type: "work",
    title: "Business Development Executive Manager",
    organization: "Mahin Enterprise",
    location: "Bangladesh",
    period: "2022 – Present",
    current: true,
    description: [
      "Leading business development, client acquisition, partnerships and team coordination.",
      "Managing full-time operations alongside technical career — driving growth strategy and client relations.",
    ],
    tech: ["Business Development", "Client Management", "Team Leadership"],
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "4",
    type: "work",
    title: "Cyber Security Trainee",
    organization: "Arena Web Security",
    location: "Bangladesh",
    period: "2023 – 2024",
    description: [
      "Completed 18-week certified cyber security programme.",
      "Studied web pentesting, SQL injection, OSINT, social engineering, and digital forensics.",
      "Gained hands-on experience with Linux OS and real-world security tools.",
    ],
    tech: ["Web Pentesting", "SQL Injection", "OSINT", "Social Engineering", "Digital Forensics", "Linux"],
    color: "from-red-500 to-rose-500",
  },
  {
    id: "5",
    type: "education",
    title: "B.Sc. in Computer Science & Engineering",
    organization: "Green University of Bangladesh",
    location: "Dhaka, Bangladesh",
    period: "2022 – Present",
    current: true,
    description: [
      "Final-year student (Student ID: 222002023) specializing in software engineering and machine learning.",
      "Core coursework: Data Structures & Algorithms, Machine Learning, DBMS, Software Engineering, Computer Networks.",
      "Working on thesis related to explainable AI and health prediction systems.",
      "Active participant in university tech clubs and programming competitions.",
    ],
    tech: ["Python", "Java", "C++", "Data Structures", "Algorithms", "Machine Learning", "Statistics"],
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "6",
    type: "education",
    title: "HSC — Higher Secondary Certificate",
    organization: "Govt. Ananda Mohan College",
    location: "Mymensingh, Bangladesh",
    period: "2020",
    description: [
      "Completed Higher Secondary Certificate (EIIN: 111914).",
      "Achieved GPA 5.00 — Golden A+.",
    ],
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: "7",
    type: "education",
    title: "SSC — Secondary School Certificate",
    organization: "Imam Bari High School",
    location: "Sherpur, Bangladesh",
    period: "2017",
    description: [
      "Completed Secondary School Certificate (EIIN: 113831).",
      "Achieved GPA 5.00 — Golden A+.",
    ],
    color: "from-teal-500 to-cyan-500",
  },
];

export function Experience() {
  const [activeTab, setActiveTab] = useState<TabType>("work");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const filtered = EXPERIENCES.filter((e) => e.type === activeTab);

  return (
    <section id="experience" className="section-padding bg-white dark:bg-gray-950 relative overflow-hidden">
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-brand-400/5 dark:bg-brand-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-max">
        <SectionHeader
          badge="Experience"
          title="My"
          highlight="Journey"
          subtitle="Professional experience and academic background that shaped my skills."
        />

        {/* Tab switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-gray-100/80 dark:bg-gray-800/80 rounded-2xl p-1.5 gap-1">
            {(["work", "education"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? "text-white shadow-lg"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="experience-tab"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 shadow-lg shadow-brand-500/30"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {tab === "work" ? <Briefcase className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                  {tab === "work" ? "Work Experience" : "Education"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div ref={ref} className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/60 via-brand-300/30 to-transparent hidden sm:block" />

          <div className="space-y-6">
            {filtered.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -24 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="relative sm:pl-20"
              >
                {/* Timeline dot */}
                <div className="absolute left-4 top-6 hidden sm:flex">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-gray-950 -translate-x-1/2`}>
                    {item.type === "work"
                      ? <Briefcase className="w-4 h-4 text-white" />
                      : <GraduationCap className="w-4 h-4 text-white" />
                    }
                  </div>
                </div>

                {/* Card */}
                <div className="card-premium rounded-2xl p-6 group">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-lg font-extrabold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {item.title}
                        </h3>
                        {item.current && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <p className={`text-sm font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                          {item.organization}
                        </p>
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${item.organization} website`} className="text-gray-400 hover:text-brand-500 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Period & location */}
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                        <Calendar className="w-3 h-3" />
                        {item.period}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {item.location}
                      </span>
                    </div>
                  </div>

                  {/* Description bullets */}
                  <ul className="space-y-2 mb-4">
                    {item.description.map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        <span className={`mt-2 w-1.5 h-1.5 rounded-full bg-gradient-to-br ${item.color} flex-shrink-0`} />
                        {point}
                      </li>
                    ))}
                  </ul>

                  {/* Tech badges */}
                  {item.tech && item.tech.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-100 dark:border-gray-800/60">
                      {item.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200/80 dark:border-gray-700/60"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
