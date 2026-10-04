import Link from "next/link";
import { Code2, Mail, ArrowUpRight, ArrowUp } from "lucide-react";
import { GitHubIcon, LinkedInIcon, FacebookIcon } from "@/components/ui/SocialIcons";
import { NAV_ITEMS, SITE } from "@/lib/site";
import { mailtoHref } from "@/lib/utils";

const SOCIAL_LINKS = [
  { icon: GitHubIcon,   href: SITE.github,                label: "GitHub"   },
  { icon: LinkedInIcon, href: SITE.linkedin,              label: "LinkedIn" },
  { icon: FacebookIcon, href: SITE.facebook,              label: "Facebook" },
  { icon: Mail,         href: mailtoHref(SITE.email),     label: "Email"    },
];

const STACK = ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Supabase", "Framer Motion"];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-gray-950 text-gray-400">
      <div className="pointer-events-none absolute top-0 left-1/4 h-96 w-96 rounded-full bg-brand-600/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-accent-600/10 blur-3xl" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        {/* CTA banner */}
        <div className="relative mb-14 flex flex-col items-start justify-between gap-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-brand-500/15 via-accent-500/10 to-transparent p-8 sm:flex-row sm:items-center">
          <div>
            <p className="eyebrow !text-brand-300 mb-2">Let&apos;s work together</p>
            <h3 className="text-xl sm:text-2xl font-bold text-white text-balance">
              Have a product to build or a team to join? Let&apos;s talk.
            </h3>
            <p className="mt-1 text-sm text-gray-400">{SITE.availability} · {SITE.timezone}</p>
          </div>
          <a
            href={mailtoHref(SITE.email)}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-all hover:-translate-y-0.5 hover:bg-brand-50"
          >
            Get in touch <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="group mb-5 flex w-fit items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 via-accent-500 to-cyan-400 shadow-lg shadow-brand-500/30 transition-transform group-hover:scale-105">
                <Code2 className="h-5 w-5 text-white" />
              </span>
              <span className="text-xl font-bold tracking-tight">
                <span className="gradient-text-static">{SITE.brand}</span>
                <span className="text-white">.dev</span>
              </span>
            </Link>
            <p className="mb-6 max-w-sm text-sm leading-relaxed">
              Software engineer building performant web applications, machine-learning
              systems and immersive AR/VR experiences for teams around the world.
            </p>
            <div className="flex gap-2">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-gray-400 transition-all hover:border-brand-500/50 hover:bg-brand-500/10 hover:text-brand-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="hidden md:col-span-1 md:block" />

          <nav aria-label="Footer" className="md:col-span-3">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-gray-500">Navigation</h3>
            <ul className="space-y-3">
              {NAV_ITEMS.map(({ label, href }) => (
                <li key={href}>
                  <a href={href} className="group flex w-fit items-center gap-1.5 text-sm transition-colors hover:text-brand-300">
                    <span className="h-px w-0 rounded-full bg-brand-400 transition-all duration-200 group-hover:w-3" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-gray-500">Built with</h3>
            <div className="flex flex-wrap gap-2">
              {STACK.map((tech) => (
                <span key={tech} className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-xs text-gray-400">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-gray-500">© {year} {SITE.name}. All rights reserved.</p>
          <a href="#hero" className="inline-flex items-center gap-1.5 text-xs text-gray-500 transition-colors hover:text-brand-300">
            Back to top <ArrowUp className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
