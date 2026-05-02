"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ExternalLink, Github, Filter } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/types";

const FALLBACK_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Internship Hub",
    description: "Role-based job & internship platform for students, employers and admins with JWT auth, bilingual (Bengali/English) UI and application tracking. Deployed on Vercel.",
    tech_stack: ["React", "Laravel", "MySQL", "JWT", "Vercel"],
    category: "Full-Stack",
    featured: true,
    live_url: undefined,
    github_url: "https://github.com/hasib61714/internship-hub",
    order_index: 1,
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    title: "Heart Disease Prediction",
    description: "ML model with explainable AI (XAI) and PDF export. FastAPI backend + React frontend for predicting heart disease risk with model insights.",
    tech_stack: ["Python", "FastAPI", "React", "Scikit-learn"],
    category: "ML/AI",
    featured: true,
    live_url: undefined,
    github_url: "https://github.com/hasib61714/heart-disease-prediction",
    order_index: 2,
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    title: "HairHub ERP System",
    description: "Production 9-module ERP for multi-factory business — inventory, challan, cash flow, party settlement. Mobile-ready via Capacitor; live on Netlify.",
    tech_stack: ["React", "TypeScript", "Supabase", "Capacitor", "Tailwind CSS"],
    category: "Full-Stack",
    featured: true,
    live_url: "https://magenta-pasca-36250e.netlify.app",
    github_url: undefined,
    order_index: 3,
    created_at: "",
    updated_at: "",
  },
  {
    id: "4",
    title: "IMAP — AI Service Platform",
    description: "National AI-powered service marketplace with live GPS tracking, real-time WebSocket chat, OTP auth and 19+ features.",
    tech_stack: ["JavaScript", "AI", "GPS", "WebSocket", "Node.js"],
    category: "Full-Stack",
    featured: false,
    live_url: undefined,
    github_url: "https://github.com/hasib61714/imap-bangladesh",
    order_index: 4,
    created_at: "",
    updated_at: "",
  },
  {
    id: "5",
    title: "TrendHaus E-Commerce",
    description: "Full e-commerce platform with cart, checkout, order tracking, wishlist, coupons, admin panel and inventory management.",
    tech_stack: ["React", "TypeScript", "Supabase", "Tailwind CSS"],
    category: "E-Commerce",
    featured: false,
    live_url: undefined,
    github_url: undefined,
    order_index: 5,
    created_at: "",
    updated_at: "",
  },
  {
    id: "6",
    title: "Fake News Detection",
    description: "TF-IDF + multiple ML classifiers (Naive Bayes, Logistic Regression, LinearSVC, Random Forest) for fake news classification with high accuracy.",
    tech_stack: ["Python", "Scikit-learn", "NLP", "TF-IDF", "Pandas"],
    category: "ML/AI",
    featured: false,
    live_url: undefined,
    github_url: "https://github.com/hasib61714/Fake-News-Detector",
    order_index: 6,
    created_at: "",
    updated_at: "",
  },
];

const PROJECT_COLORS = [
  "from-brand-500 to-cyan-500",
  "from-purple-500 to-accent-500",
  "from-green-500 to-teal-500",
  "from-orange-500 to-red-500",
  "from-pink-500 to-rose-500",
  "from-amber-500 to-orange-500",
];

export function Projects() {
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("projects")
      .select("*")
      .order("order_index")
      .then(({ data }) => {
        if (data && data.length > 0) setProjects(data);
      });
  }, []);

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="section-padding bg-gray-50/80 dark:bg-gray-900/60 relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-brand-400/5 dark:bg-brand-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="container-max">
        <SectionHeader
          badge="My Work"
          title="Featured"
          highlight="Projects"
          subtitle="A selection of projects I've built — from MVPs to production-ready applications."
        />

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                filter === cat
                  ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30 scale-105"
                  : "glass-card text-gray-600 dark:text-gray-400 hover:text-brand-500 hover:scale-105"
              }`}
            >
              {cat === "All" && <Filter className="w-3.5 h-3.5" />}
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -8 }}
                transition={{ duration: 0.35, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="group card-premium rounded-2xl overflow-hidden"
              >
                {/* Image / color block */}
                <div className={`relative h-48 bg-gradient-to-br ${PROJECT_COLORS[idx % PROJECT_COLORS.length]} overflow-hidden`}>
                  {project.image_url ? (
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl opacity-30 group-hover:scale-110 transition-transform duration-500">📦</span>
                    </div>
                  )}
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {project.featured && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-brand-500 to-accent-500 text-white text-xs font-bold shadow-lg">✦ Featured</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white text-xs font-semibold">{project.category}</span>
                  </div>

                  {/* Quick action links on hover */}
                  <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    {project.live_url && project.live_url !== "#" && (
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer" title="Live Demo"
                        className="w-8 h-8 rounded-lg bg-white/90 dark:bg-gray-900/90 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-brand-500 shadow-lg backdrop-blur-sm transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {project.github_url && project.github_url !== "#" && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" title="View Code"
                        className="w-8 h-8 rounded-lg bg-white/90 dark:bg-gray-900/90 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-brand-500 shadow-lg backdrop-blur-sm transition-colors">
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-extrabold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors duration-200">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-4">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech_stack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200/80 dark:border-gray-700/60"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech_stack.length > 4 && (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500">
                        +{project.tech_stack.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
