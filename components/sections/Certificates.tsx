"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Download, ExternalLink, Award } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { Certificate } from "@/types";

const FALLBACK_CERTS: Certificate[] = [
  {
    id: "1",
    title: "Software Engineer",
    issuer: "HackerRank",
    issue_date: "2026-04-01",
    description: "Credential ID: 842FC65F25FE",
    credential_url: "https://www.hackerrank.com/certificates/842FC65F25FE",
    created_at: "",
  },
  {
    id: "2",
    title: "Software Engineer Intern",
    issuer: "HackerRank",
    issue_date: "2026-04-01",
    description: "Credential ID: AE645963A25B",
    credential_url: "https://www.hackerrank.com/certificates/AE645963A25B",
    created_at: "",
  },
  {
    id: "3",
    title: "Frontend Developer (React)",
    issuer: "HackerRank",
    issue_date: "2026-04-01",
    description: "Credential ID: 77F03DAEDFC5",
    credential_url: "https://www.hackerrank.com/certificates/77F03DAEDFC5",
    created_at: "",
  },
  {
    id: "4",
    title: "Cyber Security & Ethical Hacking",
    issuer: "Arena Web Security",
    issue_date: "2024-03-01",
    description: "18-week certified programme — Verification: A47W1403S045",
    created_at: "",
  },
  {
    id: "5",
    title: "Job Ready: Employability Skills",
    issuer: "Wadhwani Foundation",
    issue_date: "2026-04-01",
    description: "Green University of Bangladesh · 75 hours",
    created_at: "",
  },
  {
    id: "6",
    title: "AR/VR Development Training",
    issuer: "Battery Low Interactive Ltd.",
    issue_date: "2026-01-01",
    description: "Hands-on AR/VR development training with live project work using Unity.",
    created_at: "",
  },
  {
    id: "7",
    title: "Machine Learning & Data Science",
    issuer: "Self-Directed / Project-Based",
    issue_date: "2024-01-01",
    description: "Project-based learning covering Scikit-learn, Pandas, NumPy, NLP, and feature engineering.",
    created_at: "",
  },
];

const CERT_GRADIENTS = [
  "from-brand-500 to-cyan-500",
  "from-purple-500 to-accent-500",
  "from-green-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-pink-500 to-rose-500",
  "from-indigo-500 to-blue-500",
];

export function Certificates() {
  const [certs, setCerts] = useState<Certificate[]>(FALLBACK_CERTS);
  const [selected, setSelected] = useState<Certificate | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("certificates")
      .select("*")
      .order("issue_date", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) setCerts(data);
      });
  }, []);

  return (
    <section id="certificates" className="section-padding bg-white dark:bg-gray-950">
      <div className="container-max">
        <SectionHeader
          badge="Certifications"
          title="My"
          highlight="Certificates"
          subtitle="Professional certifications and courses that validate my expertise."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert, idx) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="group card-premium rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-brand-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              onClick={() => setSelected(cert)}
            >
              {/* Certificate card header */}
              <div className={`relative h-36 bg-gradient-to-br ${CERT_GRADIENTS[idx % CERT_GRADIENTS.length]} flex items-center justify-center`}>
                {cert.image_url ? (
                  <Image
                    src={cert.image_url}
                    alt={cert.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-90">
                    <Award className="w-12 h-12 text-white" />
                    <span className="text-white/80 text-xs font-medium uppercase tracking-widest">Certificate</span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-brand-500 transition-colors line-clamp-2">
                  {cert.title}
                </h3>
                <p className="text-sm text-brand-500 dark:text-brand-400 font-medium mb-1">{cert.issuer}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Issued: {cert.issue_date ? formatDate(cert.issue_date) : "—"}
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                    leftIcon={<ExternalLink className="w-3 h-3" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(cert);
                    }}
                  >
                    View
                  </Button>
                  {cert.file_url && (
                    <a href={cert.file_url} download target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" variant="ghost" className="text-xs" leftIcon={<Download className="w-3 h-3" />}>
                        Download
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Certificate detail modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title}
        size="lg"
      >
        {selected && (
          <div className="space-y-4">
            {selected.image_url ? (
              <div className="relative w-full h-64 rounded-xl overflow-hidden">
                <Image src={selected.image_url} alt={selected.title} fill className="object-contain" />
              </div>
            ) : (
              <div className={`h-40 rounded-xl bg-gradient-to-br ${CERT_GRADIENTS[0]} flex items-center justify-center`}>
                <Award className="w-16 h-16 text-white" />
              </div>
            )}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Issuer</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{selected.issuer}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Issue Date</p>
                <p className="text-sm text-gray-900 dark:text-white">{selected.issue_date ? formatDate(selected.issue_date) : "—"}</p>
              </div>
              {selected.expiry_date && (
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Expiry Date</p>
                  <p className="text-sm text-gray-900 dark:text-white">{formatDate(selected.expiry_date)}</p>
                </div>
              )}
              {selected.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{selected.description}</p>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              {selected.credential_url && (
                <a href={selected.credential_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full" leftIcon={<ExternalLink className="w-4 h-4" />}>
                    View Credential
                  </Button>
                </a>
              )}
              {selected.file_url && (
                <a href={selected.file_url} download target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" className="w-full" leftIcon={<Download className="w-4 h-4" />}>
                    Download PDF
                  </Button>
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
