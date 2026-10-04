import { getPublishedPosts } from "@/lib/posts";
import { SITE, getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export async function GET() {
  const base = getSiteUrl();
  const posts = await getPublishedPosts();
  const items = posts
    .map(
      (p) => `<item>
<title>${esc(p.title)}</title>
<link>${base}/blog/${p.slug}</link>
<guid isPermaLink="true">${base}/blog/${p.slug}</guid>
<pubDate>${new Date(p.published_at ?? p.created_at).toUTCString()}</pubDate>
${p.excerpt ? `<description>${esc(p.excerpt)}</description>` : ""}
</item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${esc(SITE.name)} — Blog</title>
<link>${base}/blog</link>
<description>Notes on web development, machine learning and engineering.</description>
<language>en</language>
${items}
</channel></rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
