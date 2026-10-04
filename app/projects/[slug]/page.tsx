import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, Lightbulb, Target } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BrowserMockup } from "@/components/ui/BrowserMockup";
import { Gallery } from "@/components/ui/Gallery";
import { videoEmbedUrl } from "@/lib/video";
import { GitHubIcon } from "@/components/ui/SocialIcons";
import { CommandPalette } from "@/components/CommandPalette";
import { SpotlightProvider } from "@/components/ui/SpotlightProvider";
import { getPortfolioData } from "@/lib/data";
import { SITE, getSiteUrl } from "@/lib/site";
import { projectSlug, safeUrl } from "@/lib/utils";

export const revalidate = 60;

type Params = { slug: string };

const GRADIENTS = [
  "from-brand-600 to-accent-500",
  "from-accent-600 to-brand-500",
  "from-brand-500 to-cyan-500",
  "from-cyan-600 to-brand-600",
  "from-accent-500 to-cyan-500",
  "from-brand-700 to-accent-500",
];

export async function generateStaticParams(): Promise<Params[]> {
  const { projects } = await getPortfolioData();
  return projects.map((p) => ({ slug: projectSlug(p) }));
}

async function loadProject(slug: string) {
  const data = await getPortfolioData();
  const index = data.projects.findIndex((p) => projectSlug(p) === slug);
  return { data, index, project: index >= 0 ? data.projects[index] : undefined };
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const { project } = await loadProject(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.title} — case study`,
    description: project.description,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: { title: `${project.title} | ${SITE.name}`, description: project.description, url: `/projects/${slug}`, type: "article" },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const { data, index, project } = await loadProject(slug);
  if (!project) notFound();

  const live = safeUrl(project.live_url);
  const code = safeUrl(project.github_url);
  const image = safeUrl(project.image_url);
  const highlights = project.highlights?.filter(Boolean) ?? [];
  const video = videoEmbedUrl(project.video_url);
  const gallery = (project.gallery ?? []).map((g) => safeUrl(g)).filter((g): g is string => !!g);
  const next = data.projects[(index + 1) % data.projects.length];
  const cv = data.documents.find((d) => d.type === "cv");

  const meta = [
    { label: "Category", value: project.category },
    project.role ? { label: "Role", value: project.role } : null,
    project.year ? { label: "Year", value: project.year } : null,
  ].filter((m): m is { label: string; value: string } => m !== null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: `${getSiteUrl()}/projects/${slug}`,
    author: { "@type": "Person", name: SITE.name },
    keywords: project.tech_stack.join(", "),
  };

  return (
    <>
      <Navbar />
      <main id="main" className="relative overflow-hidden pb-24 pt-28 sm:pt-32">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[34rem]" />
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

        <article className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link href="/#projects" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-300">
            <ArrowLeft className="h-4 w-4" /> All projects
          </Link>

          <header className="mb-12">
            <p className="eyebrow mb-4">Case study</p>
            <h1 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>
            <p className="mt-5 max-w-3xl text-pretty text-lg leading-relaxed text-gray-600 dark:text-gray-400">{project.description}</p>

            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
              {meta.map((m) => (
                <div key={m.label}>
                  <dt className="font-mono text-[11px] uppercase tracking-widest text-gray-500">{m.label}</dt>
                  <dd className="mt-1 font-semibold text-gray-900 dark:text-white">{m.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              {live && (
                <a href={live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-brand-500 to-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 ring-1 ring-inset ring-white/15 transition-all hover:-translate-y-0.5">
                  Visit live site <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
              {code && (
                <a href={code} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white/70 px-5 py-3 text-sm font-semibold text-gray-800 transition-all hover:-translate-y-0.5 hover:border-brand-500/60 dark:border-white/15 dark:bg-white/[0.04] dark:text-gray-100">
                  <GitHubIcon className="h-4 w-4" /> View source
                </a>
              )}
              {!live && !code && (
                <span className="rounded-xl border border-dashed border-gray-300 px-5 py-3 text-sm text-gray-500 dark:border-white/15">Private / client project</span>
              )}
            </div>
          </header>

          <BrowserMockup title={project.title} image={image} url={live} gradient={GRADIENTS[index % GRADIENTS.length]} className="mb-16" />

          <div className="grid gap-12 lg:grid-cols-[1fr_20rem]">
            <div className="space-y-12">
              {video && (
                <section>
                  <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Demo</h2>
                  <div className="aspect-video overflow-hidden rounded-2xl border border-gray-200 bg-black dark:border-white/10">
                    <iframe
                      src={video}
                      title={`${project.title} demo video`}
                      loading="lazy"
                      allow="fullscreen; picture-in-picture"
                      referrerPolicy="strict-origin-when-cross-origin"
                      className="h-full w-full"
                    />
                  </div>
                </section>
              )}

              {project.long_description && (
                <section>
                  <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Overview</h2>
                  <p className="whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-300">{project.long_description}</p>
                </section>
              )}

              {project.problem && (
                <section>
                  <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-white"><Target className="h-5 w-5" /></span>
                    The challenge
                  </h2>
                  <p className="leading-relaxed text-gray-700 dark:text-gray-300">{project.problem}</p>
                </section>
              )}

              {project.solution && (
                <section>
                  <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white"><Lightbulb className="h-5 w-5" /></span>
                    The solution
                  </h2>
                  <p className="leading-relaxed text-gray-700 dark:text-gray-300">{project.solution}</p>
                </section>
              )}

              {gallery.length > 0 && (
                <section>
                  <h2 className="mb-5 text-2xl font-bold text-gray-900 dark:text-white">Screenshots</h2>
                  <Gallery images={gallery} title={project.title} />
                </section>
              )}

              {highlights.length > 0 && (
                <section>
                  <h2 className="mb-5 text-2xl font-bold text-gray-900 dark:text-white">Highlights</h2>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {highlights.map((h) => (
                      <li key={h} className="card-premium flex items-start gap-3 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle2 className="relative z-10 mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        <span className="relative z-10">{h}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="card-premium rounded-2xl p-6">
                <h2 className="mb-4 font-mono text-[11px] uppercase tracking-widest text-gray-500">Tech stack</h2>
                <ul className="flex flex-wrap gap-2">
                  {project.tech_stack.map((t) => (
                    <li key={t} className="relative z-10 rounded-lg border border-brand-100 bg-brand-50 px-2.5 py-1 font-mono text-xs text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300">{t}</li>
                  ))}
                </ul>
                <div className="relative z-10 mt-6 border-t border-gray-100 pt-5 dark:border-white/[0.06]">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Want something like this built for your team?</p>
                  <Link href="/#hire" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-500 dark:text-brand-300">
                    Start a project <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          {next && next.id !== project.id && (
            <Link
              href={`/projects/${projectSlug(next)}`}
              className="card-premium group mt-20 flex items-center justify-between gap-6 rounded-2xl p-6 sm:p-8"
            >
              <span className="relative z-10">
                <span className="font-mono text-[11px] uppercase tracking-widest text-gray-500">Next project</span>
                <span className="mt-1 block text-2xl font-bold text-gray-900 transition-colors group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-300 sm:text-3xl">{next.title}</span>
              </span>
              <ArrowRight className="relative z-10 h-6 w-6 shrink-0 text-brand-500 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </article>
      </main>
      <Footer />
      <SpotlightProvider />
      <CommandPalette projects={data.projects.map((p) => ({ title: p.title, slug: projectSlug(p) }))} cvUrl={cv?.file_url} />
    </>
  );
}
