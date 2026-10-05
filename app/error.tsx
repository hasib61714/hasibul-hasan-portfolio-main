"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="bg-white dark:bg-gray-950 grid min-h-screen place-items-center px-4">
      <div className="text-center">
        <p className="eyebrow mb-3">Something went wrong</p>
        <h1 className="text-balance text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">An unexpected error occurred</h1>
        <p className="mx-auto mt-4 max-w-md text-gray-600 dark:text-gray-400">Please try again. If the problem continues, send me a message and I&apos;ll fix it.</p>
        <button onClick={reset} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white">
          <RefreshCw className="h-4 w-4" /> Try again
        </button>
      </div>
    </main>
  );
}
