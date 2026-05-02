import Link from "next/link";
import { Code2, Heart, Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon, FacebookIcon } from "@/components/ui/SocialIcons";
import { GITHUB_URL, LINKEDIN_URL, FACEBOOK_URL, EMAIL_ADDRESS } from "@/lib/utils";

const SOCIAL_LINKS = [
  { icon: GitHubIcon,   href: GITHUB_URL,               label: "GitHub"   },
  { icon: LinkedInIcon, href: LINKEDIN_URL,              label: "LinkedIn" },
  { icon: FacebookIcon, href: FACEBOOK_URL,              label: "Facebook" },
  { icon: Mail,         href: `mailto:${EMAIL_ADDRESS}`, label: "Email"    },
];

const FOOTER_LINKS = [
  { label: "About",      href: "#about"       },
  { label: "Experience", href: "#experience"  },
  { label: "Projects",   href: "#projects"    },
  { label: "Skills",     href: "#skills"      },
  { label: "Resume",     href: "#resume"      },
  { label: "Contact",    href: "#contact"     },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-gray-200/60 dark:border-gray-800/60 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm overflow-hidden">
      {/* top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">
                <span className="gradient-text-static">Hasibul</span>
                <span className="text-gray-900 dark:text-white">.dev</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
              Full-Stack Developer crafting beautiful, performant web
              experiences with modern technologies.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-5 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-5 text-sm uppercase tracking-wider">Connect</h3>
            <div className="flex gap-2">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl card-premium flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <p className="mt-5 text-sm text-gray-500 dark:text-gray-400">
              Available for freelance & full-time opportunities.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {year} Md. Hasibul Hasan. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> using Next.js &amp; Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
