"use client";

import { motion } from "framer-motion";
import { Brain, Glasses, Layers, Search, Server, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SERVICES } from "@/lib/defaults";

const ICONS: Record<string, LucideIcon> = {
  layers: Layers,
  server: Server,
  brain: Brain,
  glasses: Glasses,
  shield: Shield,
  search: Search,
};

const GRADIENTS = [
  "from-brand-500 to-cyan-500",
  "from-accent-500 to-brand-500",
  "from-emerald-500 to-cyan-500",
  "from-accent-500 to-pink-500",
  "from-brand-600 to-accent-500",
  "from-cyan-500 to-brand-500",
];

export function Services() {
  return (
    <section id="services" className="section-padding bg-white dark:bg-gray-950">
      <div className="container-max">
        <SectionHeader
          badge="Services"
          title="How I can"
          highlight="help your team"
          subtitle="Focused engineering help — from a first prototype to a production system."
        />

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => {
            const Icon = ICONS[service.icon] ?? Layers;
            return (
              <motion.li
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: (i % 3) * 0.08, duration: 0.5 }}
                className="card-premium group flex flex-col rounded-2xl p-6"
              >
                <span className={`relative z-10 mb-5 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="relative z-10 mb-2 text-lg font-bold text-gray-900 dark:text-white">{service.title}</h3>
                <p className="relative z-10 mb-5 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{service.description}</p>
                <ul className="relative z-10 flex flex-wrap gap-1.5">
                  {service.tags.map((tag) => (
                    <li key={tag} className="rounded-md border border-gray-200/80 bg-gray-100 px-2 py-1 font-mono text-[11px] text-gray-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-gray-400">
                      {tag}
                    </li>
                  ))}
                </ul>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
