import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Markdown } from "@/components/Markdown";
import { getPostBySlug, getPublishedPosts, readingMinutes } from "@/lib/posts";
import { SITE, getSiteUrl } from "@/lib/site";
import { formatDate, safeUrl } from "@/lib/utils";

export const revalidate = 60;

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  const cover = safeUrl(post.cover_url);
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt ?? undefined,
      url: `/blog/${slug}`,
      publishedTime: post.published_at ?? undefined,
      tags: post.tags,
      ...(cover ? { images: [cover] } : {}),
    },
  };
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const [post, all] = await Promise.all([getPostBySlug(slug), getPublishedPosts()]);
  if (!post) notFound();

  const cover = safeUrl(post.cover_url);
  const index = all.findIndex((p) => p.id === post.id);
  const next = all.length > 1 ? all[(index + 1) % all.length] : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    image: cover ? [cover] : undefined,
    keywords: post.tags.join(", "),
    mainEntityOfPage: `${getSiteUrl()}/blog/${post.slug}`,
    author: { "@type": "Person", name: SITE.name, url: getSiteUrl() },
  };

  return (
    <PageShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <article className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-300">
          <ArrowLeft className="h-4 w-4" /> All posts
        </Link>

        <header className="mb-10">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-gray-500">
            {formatDate(post.published_at ?? post.created_at)} · {readingMinutes(post.content)} min read
          </p>
          <h1 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 dark:text-white sm:text-5xl">{post.title}</h1>
          {post.excerpt && <p className="mt-5 text-xl leading-relaxed text-gray-600 dark:text-gray-400">{post.excerpt}</p>}
          {post.tags.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {post.tags.map((t) => (
                <li key={t} className="rounded-md border border-brand-100 bg-brand-50 px-2.5 py-1 font-mono text-xs text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300">{t}</li>
              ))}
            </ul>
          )}
        </header>

        {cover && (
          <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10">
            <Image src={cover} alt="" fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
          </div>
        )}

        <div className="text-lg"><Markdown>{post.content}</Markdown></div>

        <footer className="mt-16 border-t border-gray-200 pt-8 dark:border-white/10">
          <p className="text-gray-600 dark:text-gray-400">
            Written by <strong className="text-gray-900 dark:text-white">{SITE.name}</strong>. Questions or feedback?{" "}
            <Link href="/#contact" className="font-medium text-brand-600 underline underline-offset-4 dark:text-brand-300">Get in touch</Link>.
          </p>
          {next && next.id !== post.id && (
            <Link href={`/blog/${next.slug}`} className="card-premium group mt-8 flex items-center justify-between gap-6 rounded-2xl p-6">
              <span className="relative z-10">
                <span className="font-mono text-[11px] uppercase tracking-widest text-gray-500">Next post</span>
                <span className="mt-1 block text-xl font-bold text-gray-900 transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-300">{next.title}</span>
              </span>
              <ArrowRight className="relative z-10 h-5 w-5 shrink-0 text-brand-500 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </footer>
      </article>
    </PageShell>
  );
}
