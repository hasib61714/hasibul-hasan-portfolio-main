"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Testimonial } from "@/types";

/** Renders nothing until real testimonials are added to lib/testimonials.ts. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <section id="testimonials" className="section-padding bg-white dark:bg-gray-950">
      <div className="container-max">
        <SectionHeader
          badge="Testimonials"
          title="Kind words from"
          highlight="people I've worked with"
        />
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <motion.li
              key={`${t.name}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.08 }}
              className="card-premium flex flex-col rounded-2xl p-6"
            >
              <Quote aria-hidden className="mb-4 h-7 w-7 text-brand-500/70" />
              <blockquote className="flex-1 leading-relaxed text-gray-700 dark:text-gray-300">“{t.quote}”</blockquote>
              <figcaption className="mt-6 border-t border-gray-100 pt-4 dark:border-white/[0.06]">
                <p className="font-semibold text-gray-900 dark:text-white">{t.name}</p>
                <p className="text-sm text-gray-500">
                  {t.role}
                  {t.company ? ` · ${t.company}` : ""}
                </p>
              </figcaption>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
