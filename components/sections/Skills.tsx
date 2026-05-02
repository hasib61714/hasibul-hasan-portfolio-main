"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createClient } from "@/lib/supabase/client";
import type { Skill } from "@/types";

const FALLBACK_SKILLS: Skill[] = [
  { id: "1",  name: "React / Next.js",          category: "Frontend",  proficiency: 95, order_index: 1,  created_at: "" },
  { id: "2",  name: "TypeScript / JavaScript",  category: "Frontend",  proficiency: 90, order_index: 2,  created_at: "" },
  { id: "3",  name: "Tailwind CSS / HTML / CSS", category: "Frontend",  proficiency: 92, order_index: 3,  created_at: "" },
  { id: "4",  name: "Laravel",                  category: "Backend",   proficiency: 85, order_index: 4,  created_at: "" },
  { id: "5",  name: "Node.js / Express.js",     category: "Backend",   proficiency: 82, order_index: 5,  created_at: "" },
  { id: "6",  name: "FastAPI / REST API",        category: "Backend",   proficiency: 78, order_index: 6,  created_at: "" },
  { id: "7",  name: "PostgreSQL / MySQL",        category: "Database",  proficiency: 85, order_index: 7,  created_at: "" },
  { id: "8",  name: "MongoDB / Supabase",        category: "Database",  proficiency: 80, order_index: 8,  created_at: "" },
  { id: "9",  name: "Python",                   category: "ML/AI",     proficiency: 88, order_index: 9,  created_at: "" },
  { id: "10", name: "Scikit-learn / NLP",        category: "ML/AI",     proficiency: 78, order_index: 10, created_at: "" },
  { id: "11", name: "Pandas / NumPy",            category: "ML/AI",     proficiency: 75, order_index: 11, created_at: "" },
  { id: "12", name: "C / C++ / Java",            category: "Languages", proficiency: 72, order_index: 12, created_at: "" },
  { id: "13", name: "Git / GitHub",              category: "DevOps",    proficiency: 90, order_index: 13, created_at: "" },
  { id: "14", name: "Vercel / Netlify / Docker", category: "DevOps",    proficiency: 80, order_index: 14, created_at: "" },
  { id: "15", name: "Prisma / Capacitor",        category: "DevOps",    proficiency: 72, order_index: 15, created_at: "" },
  { id: "16", name: "Web Pentesting / OSINT",    category: "Security",  proficiency: 70, order_index: 16, created_at: "" },
  { id: "17", name: "Linux OS / Forensics",      category: "Security",  proficiency: 68, order_index: 17, created_at: "" },
  { id: "18", name: "Unity / XR / AR/VR",        category: "Other",     proficiency: 70, order_index: 18, created_at: "" },
];

const CATEGORY_COLORS: Record<string, string> = {
  Frontend:  "from-brand-500 to-cyan-500",
  Backend:   "from-green-500 to-emerald-600",
  Database:  "from-purple-500 to-violet-600",
  DevOps:    "from-orange-500 to-amber-500",
  "ML/AI":   "from-pink-500 to-rose-500",
  Languages: "from-indigo-500 to-blue-500",
  Security:  "from-red-500 to-rose-600",
  Other:     "from-gray-500 to-gray-600",
};

function SkillBar({ skill, isVisible }: { skill: Skill; isVisible: boolean }) {
  const gradient = CATEGORY_COLORS[skill.category] || "from-brand-500 to-brand-600";

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {skill.name}
        </span>
        <span className={`text-sm font-extrabold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
          {skill.proficiency}%
        </span>
      </div>
      <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isVisible ? `${skill.proficiency}%` : "0%" }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className={`h-full rounded-full bg-gradient-to-r ${gradient} shadow-sm relative overflow-hidden`}
        >
          {/* Shimmer sweep */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        </motion.div>
      </div>
    </div>
  );
}

export function Skills() {
  const [skills, setSkills] = useState<Skill[]>(FALLBACK_SKILLS);
  const [activeCategory, setActiveCategory] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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

  const categories = ["All", ...Array.from(new Set(skills.map((s) => s.category)))];
  const filtered =
    activeCategory === "All"
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="section-padding bg-white dark:bg-gray-950 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-400/5 dark:bg-accent-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="container-max">
        <SectionHeader
          badge="My Skills"
          title="Technical"
          highlight="Expertise"
          subtitle="A comprehensive overview of technologies and tools I work with daily."
        />

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30 scale-105"
                  : "glass-card text-gray-600 dark:text-gray-400 hover:text-brand-500 hover:scale-105"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div ref={ref} className="grid md:grid-cols-2 gap-5">
          {filtered.map((skill, idx) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.05, ease: "easeOut" }}
              className="card-premium rounded-2xl p-5 group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r ${CATEGORY_COLORS[skill.category] || "from-brand-500 to-brand-600"} text-white shadow-sm`}>
                  {skill.category}
                </span>
              </div>
              <SkillBar skill={skill} isVisible={isInView} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
