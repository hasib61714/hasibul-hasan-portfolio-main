import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ProfileProvider } from "@/components/ProfileProvider";
import { getSiteUrl } from "@/lib/site";
import { getProfile } from "@/lib/profile";
import { socialLinks } from "@/lib/profile-defaults";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  const title = `${profile.name} | ${profile.role}`;
  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: title,
      template: `%s | ${profile.name}`,
    },
    description: profile.seoDescription,
    applicationName: `${profile.name} — Portfolio`,
    keywords: [
      profile.name,
      profile.role,
      "Software Engineer",
      "Full-Stack Developer",
      "Remote Software Engineer",
      "Freelance Developer",
      ...profile.techMarquee,
    ],
    authors: [{ name: profile.name, url: profile.github || undefined }],
    creator: profile.name,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/",
      siteName: `${profile.name} — Portfolio`,
      title,
      description: profile.seoDescription,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: profile.seoDescription,
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
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1f3f9" },
    { media: "(prefers-color-scheme: dark)",  color: "#030712" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: getSiteUrl(),
    email: profile.email,
    jobTitle: profile.role,
    description: profile.seoDescription,
    address: { "@type": "PostalAddress", addressLocality: profile.location },
    sameAs: socialLinks(profile).map((l) => l.href),
    knowsAbout: profile.coreStack,
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${mono.variable} ${display.variable}`}>
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
        <ProfileProvider profile={profile}>
          <Providers>{children}</Providers>
        </ProfileProvider>
      </body>
    </html>
  );
}
