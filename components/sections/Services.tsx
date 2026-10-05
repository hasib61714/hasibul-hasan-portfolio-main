"use client";

import { motion } from "framer-motion";
import { Brain, Cloud, Code2, Database, Glasses, Layers, Palette, Rocket, Search, Server, Shield, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ContentBlock } from "@/types";

const ICONS: Record<string, LucideIcon> = {
  layers: Layers,
  server: Server,
  brain: Brain,
  glasses: Glasses,
  shield: Shield,
  search: Search,
  code: Code2,
  rocket: Rocket,
  database: Database,
  smartphone: Smartphone,
  cloud: Cloud,
  palette: Palette,
};

export function Services({ items }: { items: ContentBlock[] }) {
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
          {items.map((service, i) => {
            const Icon = ICONS[service.icon ?? ""] ?? Layers;
            return (
              <motion.li
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: (i % 3) * 0.08, duration: 0.5 }}
                className="card-premium group flex flex-col rounded-2xl p-6"
              >
                <span className={`relative z-10 mb-5 grid h-12 w-12 place-items-center rounded-xl bg-brand-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="relative z-10 mb-2 text-lg font-bold text-gray-900 dark:text-white">{service.title}</h3>
                <p className="relative z-10 mb-5 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{service.description}</p>
                {service.tags && service.tags.length > 0 && (
                <ul className="relative z-10 flex flex-wrap gap-1.5">
                  {(service.tags ?? []).map((tag) => (
                    <li key={tag} className="rounded-md border border-gray-200/80 bg-gray-100 px-2 py-1 font-mono text-[11px] text-gray-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-gray-400">
                      {tag}
                    </li>
                  ))}
                </ul>
                )}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
