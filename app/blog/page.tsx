import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, PenLine } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { BlogList } from "@/components/BlogList";
import { getPublishedPosts } from "@/lib/posts";
import { getProfile } from "@/lib/profile";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: "Blog",
    description: `Notes on web development, machine learning and engineering by ${profile.name}.`,
    alternates: { canonical: "/blog", types: { "application/rss+xml": "/blog/rss.xml" } },
  };
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <PageShell>
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-300">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>
        <header className="mb-12">
          <p className="eyebrow mb-4">Blog</p>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Notes from the <span className="gradient-text accent-serif">workbench</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">What I build, learn and debug — on web development, machine learning and engineering.</p>
        </header>

        {posts.length === 0 ? (
          <div className="card-premium rounded-2xl p-12 text-center">
            <PenLine className="relative z-10 mx-auto mb-3 h-8 w-8 text-gray-400" />
            <p className="relative z-10 text-gray-600 dark:text-gray-400">No posts yet — check back soon.</p>
          </div>
        ) : (
          <BlogList posts={posts} />
        )}
      </div>
    </PageShell>
  );
}
