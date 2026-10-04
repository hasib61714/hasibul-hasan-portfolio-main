import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PrintButton } from "@/components/PrintButton";
import { Navbar } from "@/components/layout/Navbar";
import { getPortfolioData } from "@/lib/data";
import { getProfile } from "@/lib/profile";
import { profileHost } from "@/lib/profile-defaults";
import { safeUrl } from "@/lib/utils";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    title: "Resume",
    description: `Printable resume of ${profile.name}, ${profile.role}.`,
    alternates: { canonical: "/resume" },
  };
}

export default async function ResumePage() {
  const { profile, projects, skills, certificates, experiences } = await getPortfolioData();
  const work = experiences.filter((e) => e.type === "work");
  const education = experiences.filter((e) => e.type === "education");

  const byCategory = skills.reduce<Record<string, string[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s.name);
    return acc;
  }, {});

  return (
    <>
      <div className="print:hidden"><Navbar /></div>
      <main id="main" className="px-4 pb-20 pt-28 print:p-0 sm:px-6">
        <div className="mx-auto mb-6 flex max-w-[52rem] items-center justify-between print:hidden">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-300">
            <ArrowLeft className="h-4 w-4" /> Back to portfolio
          </Link>
          <PrintButton />
        </div>

        {/* The sheet is always light so it prints well, whatever theme the visitor uses. */}
        <article className="mx-auto max-w-[52rem] rounded-2xl bg-white p-8 text-[13px] leading-relaxed text-gray-800 shadow-2xl ring-1 ring-black/5 print:max-w-none print:rounded-none print:p-0 print:shadow-none print:ring-0 sm:p-12">
          <header className="border-b border-gray-300 pb-5">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{profile.name}</h1>
            <p className="mt-1 text-base font-medium text-brand-700">{profile.role}</p>
            <p className="mt-3 text-gray-600">
              {[profile.email, `${profile.location} (${profile.timezone})`, profile.github && profileHost(profile.github), profile.linkedin && profileHost(profile.linkedin)].filter(Boolean).join(" · ")}
            </p>
          </header>

          <section className="mt-6">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">Summary</h2>
            <p>{profile.seoDescription}</p>
          </section>

          <section className="mt-6">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">Experience</h2>
            <div className="space-y-4">
              {work.map((e) => (
                <div key={e.id} className="break-inside-avoid">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <p className="font-semibold text-gray-900">{e.title} · {e.organization}</p>
                    <p className="text-gray-500">{e.period}</p>
                  </div>
                  <ul className="mt-1 list-disc space-y-0.5 pl-5">
                    {e.description.map((d) => <li key={d}>{d}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-6">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">Selected projects</h2>
            <ul className="space-y-2">
              {projects.map((p) => {
                const link = safeUrl(p.live_url) ?? safeUrl(p.github_url);
                return (
                  <li key={p.id} className="break-inside-avoid">
                    <p><span className="font-semibold text-gray-900">{p.title}</span> — {p.description}</p>
                    <p className="text-gray-500">{p.tech_stack.join(" · ")}{link ? ` · ${link.replace(/^https?:\/\//, "")}` : ""}</p>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="mt-6">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">Skills</h2>
            <dl className="space-y-1">
              {Object.entries(byCategory).map(([cat, names]) => (
                <div key={cat} className="flex gap-2">
                  <dt className="w-24 shrink-0 font-semibold text-gray-900">{cat}</dt>
                  <dd>{names.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-6">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">Education</h2>
            <div className="space-y-2">
              {education.map((e) => (
                <div key={e.id} className="flex flex-wrap items-baseline justify-between gap-x-4 break-inside-avoid">
                  <p><span className="font-semibold text-gray-900">{e.title}</span> · {e.organization}</p>
                  <p className="text-gray-500">{e.period}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-6">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">Certifications</h2>
            <ul className="list-disc space-y-0.5 pl-5">
              {certificates.map((c) => <li key={c.id}>{c.title} — {c.issuer}</li>)}
            </ul>
          </section>
        </article>
      </main>
    </>
  );
}
