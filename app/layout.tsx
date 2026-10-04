import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SITE, getSiteUrl } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const TITLE = `${SITE.name} | ${SITE.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: TITLE,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: `${SITE.name} — Portfolio`,
  keywords: [
    SITE.name,
    "Hasibul Hasan",
    "Software Engineer",
    "Full-Stack Developer",
    "Machine Learning Engineer",
    "AR/VR Developer",
    "Remote Software Engineer",
    "Freelance Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Laravel",
    "Python",
    "FastAPI",
    "Supabase",
  ],
  authors: [{ name: SITE.name, url: SITE.github }],
  creator: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: `${SITE.name} — Portfolio`,
    title: TITLE,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#030712" },
  ],
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  url: getSiteUrl(),
  email: SITE.email,
  jobTitle: "Software Engineer",
  description: SITE.description,
  worksFor: { "@type": "Organization", name: "Red Data (Pvt.) Ltd." },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Green University of Bangladesh" },
  address: { "@type": "PostalAddress", addressLocality: "Dhaka", addressCountry: "BD" },
  sameAs: [SITE.github, SITE.linkedin],
  knowsAbout: [
    "Full-stack web development",
    "React",
    "Next.js",
    "TypeScript",
    "Laravel",
    "Python",
    "Machine learning",
    "AR/VR development",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-white dark:bg-gray-950 antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-xl focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
