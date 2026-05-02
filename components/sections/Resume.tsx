"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Eye, FileCheck } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { Document } from "@/types";

export function Resume() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("documents")
      .select("*")
      .eq("is_active", true)
      .order("type")
      .then(({ data }) => {
        if (data) setDocuments(data);
        setLoading(false);
      });
  }, []);

  const cv = documents.find((d) => d.type === "cv");
  const coverLetter = documents.find((d) => d.type === "cover_letter");

  return (
    <section id="resume" className="section-padding bg-gray-50 dark:bg-gray-900/50">
      <div className="container-max">
        <SectionHeader
          badge="Resume"
          title="Download My"
          highlight="CV & Resume"
          subtitle="Get to know my professional background, skills, and experience."
        />

        <div className="max-w-4xl mx-auto">
          {/* Document cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* CV */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-premium rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center mb-4 shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Curriculum Vitae</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Detailed overview of my education, work experience, and skills.
              </p>
              {cv && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
                  Updated: {formatDate(cv.updated_at)}
                </p>
              )}
              <div className="flex gap-3 w-full mt-auto pt-4">
                {cv ? (
                  <>
                    <a href={cv.file_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button size="sm" variant="outline" className="w-full" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                        Preview
                      </Button>
                    </a>
                    <a href={cv.file_url} download={cv.file_name} className="flex-1">
                      <Button size="sm" className="w-full" leftIcon={<Download className="w-3.5 h-3.5" />}>
                        Download
                      </Button>
                    </a>
                  </>
                ) : (
                  <Button size="sm" className="w-full" disabled={loading}>
                    {loading ? "Loading…" : "Not Available"}
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Cover Letter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="card-premium rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-xl hover:shadow-accent-500/10 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center mb-4 shadow-lg">
                <FileCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Cover Letter</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                A personalized letter introducing myself and my motivations.
              </p>
              {coverLetter && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
                  Updated: {formatDate(coverLetter.updated_at)}
                </p>
              )}
              <div className="flex gap-3 w-full mt-auto pt-4">
                {coverLetter ? (
                  <>
                    <a href={coverLetter.file_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button size="sm" variant="outline" className="w-full" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                        Preview
                      </Button>
                    </a>
                    <a href={coverLetter.file_url} download={coverLetter.file_name} className="flex-1">
                      <Button size="sm" variant="secondary" className="w-full" leftIcon={<Download className="w-3.5 h-3.5" />}>
                        Download
                      </Button>
                    </a>
                  </>
                ) : (
                  <Button size="sm" variant="secondary" className="w-full" disabled={loading}>
                    {loading ? "Loading…" : "Not Available"}
                  </Button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Quick summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="card-premium rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Professional Highlights
            </h3>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { label: "Education",    value: "B.Sc. CSE",   sub: "Green University of Bangladesh" },
                { label: "Experience",   value: "3+ Years",    sub: "Full-Stack & Enterprise Dev"    },
                { label: "Availability", value: "Immediate",   sub: "Remote / On-site / Hybrid"      },
              ].map(({ label, value, sub }) => (
                <div key={label} className="text-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                  <p className="font-bold text-gray-900 dark:text-white">{value}</p>
                  <p className="text-xs text-brand-500 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
