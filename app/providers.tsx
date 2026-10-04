"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {/* Honour the visitor's "reduce motion" OS setting for every animation. */}
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#111827",
            color: "#f9fafb",
            border: "1px solid rgba(255,255,255,0.1)",
          },
          success: {
            iconTheme: { primary: "#6366f1", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fff" },
          },
        }}
      />
    </ThemeProvider>
  );
}
