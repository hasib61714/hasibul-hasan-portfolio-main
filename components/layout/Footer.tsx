import Link from "next/link";
import { Code2, Mail, ArrowUpRight } from "lucide-react";
import { GitHubIcon, LinkedInIcon, FacebookIcon } from "@/components/ui/SocialIcons";
import { GITHUB_URL, LINKEDIN_URL, FACEBOOK_URL, EMAIL_ADDRESS } from "@/lib/utils";

const SOCIAL_LINKS = [
  { icon: GitHubIcon,   href: GITHUB_URL,               label: "GitHub"   },
  { icon: LinkedInIcon, href: LINKEDIN_URL,              label: "LinkedIn" },
  { icon: FacebookIcon, href: FACEBOOK_URL,              label: "Facebook" },
  { icon: Mail,         href: `mailto:${EMAIL_ADDRESS}`, label: "Email"    },
];

const FOOTER_LINKS = [
  { label: "About",        href: "#about"        },
  { label: "Experience",   href: "#experience"   },
  { label: "Projects",     href: "#projects"     },
  { label: "Skills",       href: "#skills"       },
  { label: "Certificates", href: "#certificates" },
  { label: "Resume",       href: "#resume"       },
  { label: "Contact",      href: "#contact"      },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-gray-950 overflow-hidden">
      {/* gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-600/8 rounded-full blur-3xl pointer-events-none" />
      {/* top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        {/* CTA banner */}
        <div className="relative rounded-2xl bg-gradient-to-r from-brand-600/20 to-accent-600/20 border border-brand-500/20 p-8 mb-14 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 to-transparent" />
          <div className="relative">
            <p className="text-xs font-semibold text-brand-400 uppercase tracking-widest mb-1">Open to work</p>
            <h3 className="text-xl font-bold text-white">Let&apos;s build something great together</h3>
            <p className="text-sm text-gray-400 mt-1">Available for freelance & full-time opportunities</p>
          </div>
          <a
            href={`mailto:${EMAIL_ADDRESS}`}
            className="relative flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg shadow-brand-500/30"
          >
            Get in Touch <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">

          {/* Brand — 5 cols */}
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group w-fit">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-110 transition-transform">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">
                <span className="gradient-text-static">Hasibul</span>
                <span className="text-white">.dev</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm mb-6">
              Full-Stack Developer & ML enthusiast crafting high-performance web apps,
              AR/VR experiences, and intelligent systems.
            </p>
            {/* Social icons */}
            <div className="flex gap-2">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-gray-800/80 border border-gray-700/50 flex items-center justify-center text-gray-400 hover:text-brand-400 hover:border-brand-500/50 hover:bg-brand-500/10 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer — 1 col */}
          <div className="hidden md:block md:col-span-1" />

          {/* Links — 3 cols */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-5">Navigation</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-sm text-gray-400 hover:text-brand-400 transition-colors flex items-center gap-1.5 group w-fit"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-brand-500 transition-all duration-200 rounded-full" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack — 3 cols */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-5">Built With</h3>
            <div className="flex flex-wrap gap-2">
              {["Next.js 15", "TypeScript", "Tailwind CSS", "Supabase", "Framer Motion", "Vercel"].map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-2.5 py-1 rounded-lg bg-gray-800/80 border border-gray-700/50 text-gray-400"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="pt-6 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {year} Md Hasibul Hasan. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Designed &amp; Developed by <span className="text-brand-500 font-medium">Hasibul Hasan</span>
          </p>
        </div>

      </div>
    </footer>
  );
}


