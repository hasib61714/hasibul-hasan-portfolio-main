"use client";

import { motion } from "framer-motion";

interface Segment {
  text: string;
  className?: string;
}

/** Headline that reveals word by word. Each segment can carry its own styling. */
export function WordReveal({ segments, delay = 0, className }: { segments: Segment[]; delay?: number; className?: string }) {
  let index = 0;
  return (
    <span className={className} aria-label={segments.map((s) => s.text).join(" ")}>
      {segments.map((seg, si) =>
        seg.text.split(" ").filter(Boolean).map((word) => {
          const i = index++;
          return (
            <span key={`${si}-${i}`} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span
                className={`inline-block ${seg.className ?? ""}`}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: delay + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}&nbsp;
              </motion.span>
            </span>
          );
        })
      )}
    </span>
  );
}
