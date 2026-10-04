"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ContentBlock } from "@/types";

export function Process({ items }: { items: ContentBlock[] }) {
  return (
    <section id="process" className="section-padding relative overflow-hidden bg-gray-50/70 dark:bg-gray-900/40">
      <div className="container-max">
        <SectionHeader
          badge="Process"
          title="A clear path from"
          highlight="idea to launch"
          subtitle="Predictable steps, regular updates and no surprises."
        />

        <ol className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div aria-hidden className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent md:block" />
          {items.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative"
            >
              <span className="relative z-10 mb-4 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 font-mono text-sm font-bold text-white shadow-lg shadow-brand-600/30 ring-4 ring-gray-50 dark:ring-gray-900">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">{step.title}</h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{step.description}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
