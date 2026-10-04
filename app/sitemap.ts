import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { getPortfolioData } from "@/lib/data";
import { getPublishedPosts } from "@/lib/posts";
import { projectSlug } from "@/lib/utils";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [{ projects }, posts] = await Promise.all([getPortfolioData(), getPublishedPosts()]);
  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/resume`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...projects.map((p) => ({
      url: `${base}/projects/${projectSlug(p)}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
