"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Privacy-friendly page-view counter: sends only the path and the referrer host
 * (no cookies, no IP storage). Respects Do Not Track, and you can exclude your own
 * browser by running `localStorage.setItem("no-track", "1")` once in the console.
 */
export function ViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (navigator.doNotTrack === "1" || localStorage.getItem("no-track")) return;
      const key = `pv:${pathname}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");

      let referrer = "";
      if (document.referrer) {
        const host = new URL(document.referrer).host;
        if (host !== window.location.host) referrer = host;
      }
      const body = new Blob([JSON.stringify({ path: pathname, referrer })], { type: "application/json" });
      navigator.sendBeacon("/api/track", body);
    } catch {
      // Analytics must never break the page.
    }
  }, [pathname]);

  return null;
}
