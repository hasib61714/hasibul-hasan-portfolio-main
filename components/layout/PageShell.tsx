import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CommandPalette } from "@/components/CommandPalette";
import { SpotlightProvider } from "@/components/ui/SpotlightProvider";
import { ViewTracker } from "@/components/ViewTracker";
import { getPortfolioData } from "@/lib/data";
import { projectSlug } from "@/lib/utils";

const PALETTE_LINKS = [
  { label: "Read the blog", href: "/blog" },
  { label: "Printable resume", href: "/resume" },
];

/** Shared chrome (navbar, footer, command palette, analytics) for sub-pages. */
export async function PageShell({ children }: { children: React.ReactNode }) {
  const { projects, documents } = await getPortfolioData();
  const cv = documents.find((d) => d.type === "cv");
  return (
    <>
      <Navbar />
      <main id="main" className="relative overflow-hidden pb-24 pt-28 sm:pt-32">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[30rem]" />
        {children}
      </main>
      <Footer />
      <SpotlightProvider />
      <ViewTracker />
      <CommandPalette
        projects={projects.map((p) => ({ title: p.title, slug: projectSlug(p) }))}
        cvUrl={cv?.file_url}
        extraLinks={PALETTE_LINKS}
      />
    </>
  );
}
