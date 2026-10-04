"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Download, ExternalLink, Award, BadgeCheck } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatDate, safeUrl } from "@/lib/utils";
import type { Certificate } from "@/types";

const CERT_GRADIENTS = [
  "from-brand-600 to-accent-500",
  "from-accent-600 to-brand-500",
  "from-brand-500 to-cyan-500",
  "from-cyan-600 to-brand-600",
  "from-accent-500 to-cyan-500",
  "from-brand-700 to-accent-500",
];

interface CertificatesProps {
  certificates: Certificate[];
}

export function Certificates({ certificates }: CertificatesProps) {
  const [selected, setSelected] = useState<Certificate | null>(null);
  const selectedImage = safeUrl(selected?.image_url);

  return (
    <section id="certificates" className="section-padding bg-white dark:bg-gray-950">
      <div className="container-max">
        <SectionHeader
          badge="Certifications"
          title="Verified skills &"
          highlight="credentials"
          subtitle="Industry certifications and training that back up the work."
        />

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, idx) => {
            const image = safeUrl(cert.image_url);
            const credential = safeUrl(cert.credential_url);
            const file = safeUrl(cert.file_url);
            return (
              <motion.li
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (idx % 3) * 0.08 }}
                className="group card-premium flex flex-col overflow-hidden rounded-2xl"
              >
                <button
                  type="button"
                  onClick={() => setSelected(cert)}
                  aria-label={`View details for ${cert.title}`}
                  className="flex flex-1 flex-col text-left"
                >
                  <div className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${CERT_GRADIENTS[idx % CERT_GRADIENTS.length]}`}>
                    {image ? (
                      <Image
                        src={image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <Award aria-hidden className="h-12 w-12 text-white/90 transition-transform duration-300 group-hover:scale-110" />
                    )}
                  </div>
                  <div className="flex-1 p-5 pb-3">
                    <h3 className="mb-1 line-clamp-2 font-bold text-gray-900 transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-300">
                      {cert.title}
                    </h3>
                    <p className="mb-1 text-sm font-medium text-brand-600 dark:text-brand-300">{cert.issuer}</p>
                    <p className="text-xs text-gray-500">
                      Issued {cert.issue_date ? formatDate(cert.issue_date) : "—"}
                    </p>
                  </div>
                </button>

                {(credential || file) && (
                  <div className="flex gap-2 px-5 pb-5">
                    {credential && (
                      <a
                        href={credential}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:border-brand-400/60 hover:text-brand-600 dark:border-white/10 dark:text-gray-300 dark:hover:text-brand-300"
                      >
                        <BadgeCheck className="h-3.5 w-3.5" /> Verify
                      </a>
                    )}
                    {file && (
                      <a
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-gray-600 transition-colors hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-300"
                      >
                        <Download className="h-3.5 w-3.5" /> PDF
                      </a>
                    )}
                  </div>
                )}
              </motion.li>
            );
          })}
        </ul>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.title} size="lg">
        {selected && (
          <div className="space-y-4">
            {selectedImage ? (
              <div className="relative h-64 w-full overflow-hidden rounded-xl">
                <Image src={selectedImage} alt={selected.title} fill sizes="640px" className="object-contain" />
              </div>
            ) : (
              <div className={`flex h-40 items-center justify-center rounded-xl bg-gradient-to-br ${CERT_GRADIENTS[0]}`}>
                <Award aria-hidden className="h-16 w-16 text-white" />
              </div>
            )}
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="font-medium text-gray-500 dark:text-gray-400">Issuer</dt>
                <dd className="font-semibold text-gray-900 dark:text-white">{selected.issuer}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="font-medium text-gray-500 dark:text-gray-400">Issue date</dt>
                <dd className="text-gray-900 dark:text-white">{selected.issue_date ? formatDate(selected.issue_date) : "—"}</dd>
              </div>
              {selected.expiry_date && (
                <div className="flex items-center justify-between">
                  <dt className="font-medium text-gray-500 dark:text-gray-400">Expiry date</dt>
                  <dd className="text-gray-900 dark:text-white">{formatDate(selected.expiry_date)}</dd>
                </div>
              )}
            </dl>
            {selected.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{selected.description}</p>
            )}
            <div className="flex gap-3 pt-2">
              {safeUrl(selected.credential_url) && (
                <a href={safeUrl(selected.credential_url)} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full" leftIcon={<ExternalLink className="h-4 w-4" />}>
                    View credential
                  </Button>
                </a>
              )}
              {safeUrl(selected.file_url) && (
                <a href={safeUrl(selected.file_url)} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" className="w-full" leftIcon={<Download className="h-4 w-4" />}>
                    Open PDF
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
