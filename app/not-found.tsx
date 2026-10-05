import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="bg-white dark:bg-gray-950 relative grid min-h-screen place-items-center overflow-hidden px-4">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
      <div className="relative text-center">
        <Compass className="mx-auto mb-6 h-12 w-12 text-brand-500" />
        <p className="eyebrow mb-3">Error 404</p>
        <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
          This page <span className="gradient-text accent-serif">wandered off</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-gray-600 dark:text-gray-400">The link may be broken, or the page may have been moved or unpublished.</p>
        <Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5">
          <ArrowLeft className="h-4 w-4" /> Back to the portfolio
        </Link>
      </div>
    </main>
  );
}
