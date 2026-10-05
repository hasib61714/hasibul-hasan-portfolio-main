"use client";

import { motion } from "framer-motion";
import { FileText, Download, Eye, FileCheck } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useProfile } from "@/components/ProfileProvider";
import { formatDate, safeUrl } from "@/lib/utils";
import type { Document } from "@/types";

interface ResumeProps {
  documents: Document[];
}

/** Supabase serves public files with `Content-Disposition: attachment` when `?download=` is present. */
function downloadHref(doc: Document): string | undefined {
  const url = safeUrl(doc.file_url);
  if (!url) return undefined;
  return url.includes("/storage/v1/object/public/")
    ? `${url}${url.includes("?") ? "&" : "?"}download=${encodeURIComponent(doc.file_name)}`
    : url;
}

function DocCard({
  doc,
  title,
  description,
  icon: Icon,
  delay,
}: {
  doc?: Document;
  title: string;
  description: string;
  icon: typeof FileText;
  gradient: string;
  delay: number;
}) {
  const preview = doc ? safeUrl(doc.file_url) : undefined;
  const download = doc ? downloadHref(doc) : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="card-premium flex flex-col items-center rounded-2xl p-7 text-center"
    >
      <div className={`mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-brand-600 shadow-lg`}>
        <Icon className="h-8 w-8 text-white" />
      </div>
      <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
      <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
      {doc && <p className="text-xs text-gray-500">Updated {formatDate(doc.updated_at)}</p>}

      <div className="mt-auto flex w-full gap-3 pt-6">
        {preview && download ? (
          <>
            <a
              href={preview}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-800 transition-all hover:-translate-y-0.5 hover:border-brand-500/60 hover:text-brand-600 dark:border-white/15 dark:text-gray-100 dark:hover:text-brand-300"
            >
              <Eye className="h-4 w-4" /> Preview
            </a>
            <a
              href={download}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:from-brand-400"
            >
              <Download className="h-4 w-4" /> Download
            </a>
          </>
        ) : (
          <p className="w-full rounded-xl border border-dashed border-gray-300 py-2.5 text-sm text-gray-500 dark:border-white/15">
            Available on request
          </p>
        )}
      </div>
    </motion.div>
  );
}

export function Resume({ documents }: ResumeProps) {
  const profile = useProfile();
  const cv = documents.find((d) => d.type === "cv");
  const coverLetter = documents.find((d) => d.type === "cover_letter");

  const highlights = [
    { label: "Education",    value: "B.Sc. in CSE",              sub: "Green University of Bangladesh" },
    { label: "Experience",   value: `${profile.yearsExperience} years`, sub: "Full-stack, ML & enterprise development" },
    { label: "Availability", value: "Remote · Worldwide",        sub: `${profile.timezone} · async-friendly` },
  ];

  return (
    <section id="resume" className="section-padding bg-gray-50/70 dark:bg-gray-900/40">
      <div className="container-max">
        <SectionHeader
          badge="Resume"
          title="Take a closer look at my"
          highlight="CV"
          subtitle="Download my CV and cover letter for the full picture of my background and experience."
        />

        <div className="mx-auto max-w-4xl">
          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <DocCard
              doc={cv}
              title="Curriculum Vitae"
              description="Education, work experience, projects and skills."
              icon={FileText}
              gradient="from-brand-500 to-brand-600"
              delay={0}
            />
            <DocCard
              doc={coverLetter}
              title="Cover Letter"
              description="A short introduction to who I am and what I'm looking for."
              icon={FileCheck}
              gradient="from-accent-500 to-accent-600"
              delay={0.12}
            />
          </div>

          <motion.dl
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="card-premium grid gap-4 rounded-2xl p-6 sm:grid-cols-3"
          >
            {highlights.map(({ label, value, sub }) => (
              <div key={label} className="rounded-xl bg-gray-50 p-4 text-center dark:bg-white/[0.04]">
                <dt className="mb-1 font-mono text-[11px] uppercase tracking-widest text-gray-500">{label}</dt>
                <dd className="font-bold text-gray-900 dark:text-white">{value}</dd>
                <dd className="mt-0.5 text-xs text-brand-600 dark:text-brand-300">{sub}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
