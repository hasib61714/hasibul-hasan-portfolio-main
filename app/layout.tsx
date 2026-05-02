import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Md. Hasibul Hasan | Software Engineer & Full-Stack Developer",
    template: "%s | Md. Hasibul Hasan",
  },
  description:
    "Final-year CS student and Software Engineer at Red Data (Pvt.) Ltd. Specializing in full-stack web development, machine learning systems, and AR/VR. Based in Dhaka, Bangladesh.",
  keywords: [
    "Md. Hasibul Hasan",
    "Hasibul Hasan",
    "Software Engineer",
    "Full-Stack Developer",
    "ML Engineer",
    "AR/VR Developer",
    "React",
    "Next.js",
    "Laravel",
    "Python",
    "TypeScript",
    "Web Developer",
    "Bangladesh",
    "Dhaka",
  ],
  authors: [{ name: "Md. Hasibul Hasan" }],
  creator: "Md. Hasibul Hasan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Md. Hasibul Hasan Portfolio",
    title: "Md. Hasibul Hasan | Software Engineer & Full-Stack Developer",
    description:
      "Software Engineer at Red Data specializing in full-stack web development, ML systems, and AR/VR. Based in Dhaka, Bangladesh.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Md. Hasibul Hasan | Software Engineer & Full-Stack Developer",
    description:
      "Software Engineer at Red Data specializing in full-stack web development, ML systems, and AR/VR. Based in Dhaka, Bangladesh.",
    creator: "@hasibulhasan",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className="min-h-screen bg-white dark:bg-gray-950 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

