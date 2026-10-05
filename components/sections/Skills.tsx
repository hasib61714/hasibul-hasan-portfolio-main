"use client";

import { motion } from "framer-motion";
import { Monitor, Server, Database, Rocket, Brain, Code2, Shield, Glasses } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Skill } from "@/types";
import type { LucideIcon } from "lucide-react";

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

interface SkillsProps {
  skills: Skill[];
}

export function Skills({ skills }: SkillsProps) {
  // Group by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="section-padding bg-white dark:bg-gray-950 relative overflow-hidden">
      {/* Background decorations */}

      <div className="container-max">
        <SectionHeader
          badge="Skills"
          title="Technical"
          highlight="expertise"
          subtitle="The languages, frameworks and tools I use to design, build and ship software."
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
                  <div className={`w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-md flex-shrink-0`}>
                    <meta.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-sm font-extrabold text-brand-600 dark:text-brand-400`}>
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
                        title={`${skill.name} — ${label}`}
                        className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl ${meta.bg} border border-black/5 dark:border-white/5 hover:scale-105 transition-transform duration-200 cursor-default`}
                      >
                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                          {skill.name}
                          <span className="sr-only"> — {label}</span>
                        </span>
                        {/* Proficiency dots */}
                        <div aria-hidden className="flex gap-0.5 flex-shrink-0">
                          {Array.from({ length: 5 }).map((_, d) => (
                            <div
                              key={d}
                              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                d < dots
                                  ? `bg-brand-600`
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
          aria-hidden className="flex flex-wrap justify-center gap-4 mt-10 text-xs text-gray-500 dark:text-gray-500"
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
