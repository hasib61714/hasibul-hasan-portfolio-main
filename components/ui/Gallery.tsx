"use client";

import { useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";

/** Screenshot grid with a click-to-enlarge dialog. */
export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState<string | null>(null);
  if (images.length === 0) return null;

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2">
        {images.map((src, i) => (
          <li key={src}>
            <button
              type="button"
              onClick={() => setActive(src)}
              aria-label={`Enlarge screenshot ${i + 1} of ${title}`}
              className="group relative block aspect-video w-full overflow-hidden rounded-xl border border-gray-200 dark:border-white/10"
            >
              <Image src={src} alt={`${title} screenshot ${i + 1}`} fill sizes="(min-width: 640px) 420px, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </button>
          </li>
        ))}
      </ul>

      <Modal isOpen={!!active} onClose={() => setActive(null)} size="xl">
        {active && (
          <div className="relative aspect-video w-full">
            <Image src={active} alt={`${title} screenshot`} fill sizes="900px" className="object-contain" />
          </div>
        )}
      </Modal>
    </>
  );
}
