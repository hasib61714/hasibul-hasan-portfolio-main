/**
 * Converts a YouTube, Vimeo or Loom share link into a privacy-friendly embed URL.
 * Returns null for anything else, so arbitrary URLs are never put into an iframe.
 */
export function videoEmbedUrl(raw?: string | null): string | null {
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtube.com" || host === "m.youtube.com") {
    const id = url.pathname === "/watch" ? url.searchParams.get("v") : /^\/(embed|shorts)\/([\w-]{6,})/.exec(url.pathname)?.[2];
    return id && /^[\w-]{6,}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === "youtu.be") {
    const id = url.pathname.slice(1);
    return /^[\w-]{6,}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === "vimeo.com") {
    const id = /^\/(\d+)/.exec(url.pathname)?.[1];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  if (host === "loom.com") {
    const id = /^\/(share|embed)\/([a-f0-9]{16,})/i.exec(url.pathname)?.[2];
    return id ? `https://www.loom.com/embed/${id}` : null;
  }
  return null;
}
