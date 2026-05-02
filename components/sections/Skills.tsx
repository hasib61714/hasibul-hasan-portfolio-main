"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Server, Database, Rocket, Brain, Code2, Shield, Glasses } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createClient } from "@/lib/supabase/client";
import type { Skill } from "@/types";
import type { LucideIcon } from "lucide-react";

const FALLBACK_SKILLS: Skill[] = [
  // Languages
  { id: "1",  name: "C / C++",                  category: "Languages", proficiency: 72, order_index: 1,  created_at: "" },
  { id: "2",  name: "Java",                      category: "Languages", proficiency: 72, order_index: 2,  created_at: "" },
  { id: "3",  name: "Python",                    category: "Languages", proficiency: 88, order_index: 3,  created_at: "" },
  { id: "4",  name: "JavaScript",                category: "Languages", proficiency: 90, order_index: 4,  created_at: "" },
  { id: "5",  name: "TypeScript",                category: "Languages", proficiency: 90, order_index: 5,  created_at: "" },
  // Frontend
  { id: "6",  name: "React.js",                  category: "Frontend",  proficiency: 92, order_index: 6,  created_at: "" },
  { id: "7",  name: "Next.js 14",                category: "Frontend",  proficiency: 90, order_index: 7,  created_at: "" },
  { id: "8",  name: "HTML5 / CSS3",              category: "Frontend",  proficiency: 92, order_index: 8,  created_at: "" },
  { id: "9",  name: "Tailwind CSS",              category: "Frontend",  proficiency: 90, order_index: 9,  created_at: "" },
  // Backend
  { id: "10", name: "Laravel",                   category: "Backend",   proficiency: 85, order_index: 10, created_at: "" },
  { id: "11", name: "Node.js / Express.js",      category: "Backend",   proficiency: 82, order_index: 11, created_at: "" },
  { id: "12", name: "FastAPI",                   category: "Backend",   proficiency: 78, order_index: 12, created_at: "" },
  { id: "13", name: "REST API Design",           category: "Backend",   proficiency: 80, order_index: 13, created_at: "" },
  // AI / ML
  { id: "14", name: "Scikit-learn",              category: "ML/AI",     proficiency: 78, order_index: 14, created_at: "" },
  { id: "15", name: "Pandas / NumPy",            category: "ML/AI",     proficiency: 80, order_index: 15, created_at: "" },
  { id: "16", name: "NLP / TF-IDF",             category: "ML/AI",     proficiency: 75, order_index: 16, created_at: "" },
  { id: "17", name: "Feature Engineering",       category: "ML/AI",     proficiency: 72, order_index: 17, created_at: "" },
  // Database
  { id: "18", name: "MySQL / PostgreSQL",        category: "Database",  proficiency: 85, order_index: 18, created_at: "" },
  { id: "19", name: "MongoDB",                   category: "Database",  proficiency: 80, order_index: 19, created_at: "" },
  { id: "20", name: "Supabase (Realtime)",       category: "Database",  proficiency: 80, order_index: 20, created_at: "" },
  // AR / VR
  { id: "21", name: "Unity",                     category: "AR/VR",     proficiency: 70, order_index: 21, created_at: "" },
  { id: "22", name: "XR Development",            category: "AR/VR",     proficiency: 68, order_index: 22, created_at: "" },
  // Security
  { id: "23", name: "Web Pentesting",            category: "Security",  proficiency: 72, order_index: 23, created_at: "" },
  { id: "24", name: "SQL Injection / OSINT",     category: "Security",  proficiency: 70, order_index: 24, created_at: "" },
  { id: "25", name: "Linux OS / Forensics",      category: "Security",  proficiency: 70, order_index: 25, created_at: "" },
  // Tools
  { id: "26", name: "Git / GitHub",              category: "Tools",     proficiency: 90, order_index: 26, created_at: "" },
  { id: "27", name: "VS Code / Postman",         category: "Tools",     proficiency: 88, order_index: 27, created_at: "" },
  { id: "28", name: "Vercel / Netlify",          category: "Tools",     proficiency: 80, order_index: 28, created_at: "" },
  { id: "29", name: "Prisma / Capacitor",        category: "Tools",     proficiency: 74, order_index: 29, created_at: "" },
];

const CATEGORY_META: Record<string, { gradient: string; bg: string; icon: LucideIcon }> = {
  Languages: { gradient: "from-indigo-500 to-blue-500",   bg: "bg-indigo-500/10 dark:bg-indigo-500/15", icon: Code2    },
  Frontend:  { gradient: "from-brand-500 to-cyan-500",    bg: "bg-brand-500/10 dark:bg-brand-500/15",   icon: Monitor  },
  Backend:   { gradient: "from-green-500 to-emerald-600", bg: "bg-green-500/10 dark:bg-green-500/15",   icon: Server   },
  "ML/AI":   { gradient: "from-pink-500 to-rose-500",     bg: "bg-pink-500/10 dark:bg-pink-500/15",     icon: Brain    },
  Database:  { gradient: "from-purple-500 to-violet-600", bg: "bg-purple-500/10 dark:bg-purple-500/15", icon: Database },
  "AR/VR":   { gradient: "from-teal-500 to-cyan-600",     bg: "bg-teal-500/10 dark:bg-teal-500/15",     icon: Glasses  },
  Security:  { gradient: "from-red-500 to-rose-600",      bg: "bg-red-500/10 dark:bg-red-500/15",       icon: Shield   },
  Tools:     { gradient: "from-orange-500 to-amber-500",  bg: "bg-orange-500/10 dark:bg-orange-500/15", icon: Rocket   },
};

function proficiencyLabel(p: number) {
  if (p >= 90) return { label: "Expert",        dots: 5 };
  if (p >= 80) return { label: "Advanced",      dots: 4 };
  if (p >= 70) return { label: "Proficient",    dots: 3 };
  if (p >= 55) return { label: "Intermediate",  dots: 2 };
  return              { label: "Beginner",       dots: 1 };
}

export function Skills() {
  const [skills, setSkills] = useState<Skill[]>(FALLBACK_SKILLS);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("skills")
      .select("*")
      .order("order_index")
      .then(({ data }) => {
        if (data && data.length > 0) setSkills(data);
      });
  }, []);

  // Group by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="section-padding bg-white dark:bg-gray-950 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-400/5 dark:bg-brand-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-400/5 dark:bg-accent-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-max">
        <SectionHeader
          badge="My Skills"
          title="Technical"
          highlight="Expertise"
          subtitle="A comprehensive overview of technologies and tools I work with daily."
        />

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Object.entries(grouped).map(([category, catSkills], catIdx) => {
            const meta = CATEGORY_META[category] ?? CATEGORY_META["Tools"];
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: catIdx * 0.07, ease: "easeOut" }}
                className="card-premium rounded-2xl p-5 flex flex-col gap-4"
              >
                {/* Category header */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
                    <meta.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-extrabold bg-gradient-to-r ${meta.gradient} bg-clip-text text-transparent`}>
                      {category}
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{catSkills.length} skill{catSkills.length > 1 ? "s" : ""}</p>
                  </div>
                </div>

                {/* Skill pills */}
                <div className="flex flex-wrap gap-2">
                  {catSkills.map((skill, i) => {
                    const { label, dots } = proficiencyLabel(skill.proficiency);
                    return (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.85 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: catIdx * 0.07 + i * 0.04 }}
                        title={`${skill.name} — ${label} (${skill.proficiency}%)`}
                        className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl ${meta.bg} border border-white/10 dark:border-white/5 hover:scale-105 transition-transform duration-200 cursor-default`}
                      >
                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                          {skill.name}
                        </span>
                        {/* Proficiency dots */}
                        <div className="flex gap-0.5 flex-shrink-0">
                          {Array.from({ length: 5 }).map((_, d) => (
                            <div
                              key={d}
                              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                d < dots
                                  ? `bg-gradient-to-br ${meta.gradient}`
                                  : "bg-gray-300 dark:bg-gray-700"
                              }`}
                            />
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mt-10 text-xs text-gray-400 dark:text-gray-500"
        >
          {[
            { dots: 1, label: "Beginner" },
            { dots: 2, label: "Intermediate" },
            { dots: 3, label: "Proficient" },
            { dots: 4, label: "Advanced" },
            { dots: 5, label: "Expert" },
          ].map(({ dots, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, d) => (
                  <div key={d} className={`w-1.5 h-1.5 rounded-full ${d < dots ? "bg-brand-500" : "bg-gray-300 dark:bg-gray-700"}`} />
                ))}
              </div>
              <span>{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
