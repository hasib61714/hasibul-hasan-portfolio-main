"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { formatDate, safeUrl } from "@/lib/utils";
import { readingMinutes } from "@/lib/posts";
import type { Post } from "@/types";

/** Latest blog posts teaser. Renders nothing until you publish a post in Admin → Blog. */
export function Writing({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section id="writing" className="section-padding bg-gray-50/70 dark:bg-gray-900/40">
      <div className="container-max">
        <SectionHeader
          badge="Writing"
          title="Notes from the"
          highlight="workbench"
          subtitle="Short write-ups on what I build, learn and debug."
        />

        <ul className="grid gap-6 md:grid-cols-3">
          {posts.map((post, i) => {
            const cover = safeUrl(post.cover_url);
            return (
              <motion.li
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-premium group flex flex-col overflow-hidden rounded-2xl"
              >
                <div className="relative h-40 bg-gradient-to-br from-brand-600 to-accent-500">
                  {cover && <Image src={cover} alt="" fill sizes="(min-width: 768px) 380px, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />}
                </div>
                <div className="relative z-10 flex flex-1 flex-col p-5">
                  <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-gray-500">
                    {post.published_at ? formatDate(post.published_at) : ""} · {readingMinutes(post.content)} min read
                  </p>
                  <h3 className="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-300">
                    <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">{post.title}</Link>
                  </h3>
                  {post.excerpt && <p className="line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{post.excerpt}</p>}
                </div>
              </motion.li>
            );
          })}
        </ul>

        <div className="mt-10 text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-300">
            Read all posts <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
