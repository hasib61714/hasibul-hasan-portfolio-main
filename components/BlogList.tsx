"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn, formatDate, safeUrl } from "@/lib/utils";
import { readingMinutes } from "@/lib/posts";
import type { Post } from "@/types";

export function BlogList({ posts }: { posts: Post[] }) {
  const [tag, setTag] = useState("All");
  const tags = useMemo(() => ["All", ...Array.from(new Set(posts.flatMap((p) => p.tags)))], [posts]);
  const visible = tag === "All" ? posts : posts.filter((p) => p.tags.includes(tag));

  return (
    <>
      {tags.length > 2 && (
        <div role="group" aria-label="Filter posts by tag" className="mb-10 flex flex-wrap gap-2">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTag(t)}
              aria-pressed={tag === t}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
                tag === t
                  ? "bg-brand-600 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-brand-400/60 dark:border-white/10 dark:bg-white/[0.04] dark:text-gray-400"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <ul className="grid gap-6 md:grid-cols-2">
        {visible.map((post) => {
          const cover = safeUrl(post.cover_url);
          return (
            <li key={post.id} className="card-premium group flex flex-col overflow-hidden rounded-2xl">
              <div className="relative h-48 bg-gradient-to-br from-brand-600 to-accent-500">
                {cover && <Image src={cover} alt="" fill sizes="(min-width: 768px) 480px, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />}
              </div>
              <div className="relative z-10 flex flex-1 flex-col p-6">
                <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-gray-500">
                  {post.published_at ? formatDate(post.published_at) : ""} · {readingMinutes(post.content)} min read
                </p>
                <h2 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-300">
                  <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">{post.title}</Link>
                </h2>
                {post.excerpt && <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{post.excerpt}</p>}
                {post.tags.length > 0 && (
                  <ul className="mt-auto flex flex-wrap gap-1.5">
                    {post.tags.map((t) => (
                      <li key={t} className="rounded-md border border-gray-200/80 bg-gray-100 px-2 py-0.5 font-mono text-[11px] text-gray-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-gray-400">{t}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
