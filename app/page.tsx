import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Certificates } from "@/components/sections/Certificates";
import { Resume } from "@/components/sections/Resume";
import { HireMe } from "@/components/sections/HireMe";
import { Contact } from "@/components/sections/Contact";
import { Testimonials } from "@/components/sections/Testimonials";
import { CommandPalette } from "@/components/CommandPalette";
import { SpotlightProvider } from "@/components/ui/SpotlightProvider";
import { getPortfolioData } from "@/lib/data";
import { getGithubStats } from "@/lib/github";
import { TESTIMONIALS } from "@/lib/testimonials";
import { projectSlug } from "@/lib/utils";

// Content is read on the server and cached; admin edits appear within a minute.
export const revalidate = 60;

export default async function HomePage() {
  const [{ projects, skills, certificates, documents, avatarUrl }, github] = await Promise.all([
    getPortfolioData(),
    getGithubStats(),
  ]);
  const cv = documents.find((d) => d.type === "cv");

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero
          avatarUrl={avatarUrl}
          cvUrl={cv?.file_url}
          projectCount={projects.length}
          certificateCount={certificates.length}
        />
        <About certificateCount={certificates.length} projectCount={projects.length} github={github} />
        <Experience />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Testimonials items={TESTIMONIALS} />
        <Certificates certificates={certificates} />
        <Resume documents={documents} />
        <HireMe />
        <Contact />
      </main>
      <Footer />
      <SpotlightProvider />
      <CommandPalette
        projects={projects.map((p) => ({ title: p.title, slug: projectSlug(p) }))}
        cvUrl={cv?.file_url}
      />
    </>
  );
}
