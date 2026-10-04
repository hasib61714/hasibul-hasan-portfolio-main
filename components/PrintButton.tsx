"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 ring-1 ring-inset ring-white/15 transition-all hover:-translate-y-0.5"
    >
      <Printer className="h-4 w-4" /> Print / Save as PDF
    </button>
  );
}
