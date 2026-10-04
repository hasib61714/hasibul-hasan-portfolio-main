"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Faq as FaqItem } from "@/types";

export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  if (items.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <section id="faq" className="section-padding bg-gray-50/70 dark:bg-gray-900/40">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="container-max">
        <SectionHeader
          badge="FAQ"
          title="Questions,"
          highlight="answered"
          subtitle="The things people ask most before we start working together."
        />

        <ul className="mx-auto max-w-3xl space-y-3">
          {items.map((item) => {
            const isOpen = open === item.id;
            return (
              <li key={item.id} className="card-premium overflow-hidden rounded-2xl">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${item.id}`}
                    className="relative z-10 flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-gray-900 dark:text-white"
                  >
                    <span>{item.question}</span>
                    <Plus className={`h-5 w-5 shrink-0 text-brand-500 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${item.id}`}
                      role="region"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="relative z-10 overflow-hidden"
                    >
                      <p className="px-5 pb-5 leading-relaxed text-gray-600 dark:text-gray-400">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
