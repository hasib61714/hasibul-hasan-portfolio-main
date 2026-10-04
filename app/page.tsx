import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Process } from "@/components/sections/Process";
import { Achievements } from "@/components/sections/Achievements";
import { Certificates } from "@/components/sections/Certificates";
import { Testimonials } from "@/components/sections/Testimonials";
import { Writing } from "@/components/sections/Writing";
import { Resume } from "@/components/sections/Resume";
import { Faq } from "@/components/sections/Faq";
import { HireMe } from "@/components/sections/HireMe";
import { Contact } from "@/components/sections/Contact";
import { CommandPalette } from "@/components/CommandPalette";
import { SpotlightProvider } from "@/components/ui/SpotlightProvider";
import { ViewTracker } from "@/components/ViewTracker";
import { getPortfolioData } from "@/lib/data";
import { getGithubStats } from "@/lib/github";
import { projectSlug } from "@/lib/utils";

// Content is read on the server and cached; admin edits appear within a minute.
export const revalidate = 60;

const PALETTE_LINKS = [
  { label: "Read the blog", href: "/blog" },
  { label: "Printable resume", href: "/resume" },
];

export default async function HomePage() {
  const [data, github] = await Promise.all([getPortfolioData(), getGithubStats()]);
  const { projects, skills, certificates, documents, avatarUrl, testimonials, faqs, achievements, latestPosts, settings } = data;
  const cv = documents.find((d) => d.type === "cv");

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero
          avatarUrl={avatarUrl}
          cvUrl={cv?.file_url}
          bookingUrl={settings.bookingUrl}
          openToWork={settings.open_to_work}
          availabilityText={settings.availability_text}
          projectCount={projects.length}
          certificateCount={certificates.length}
        />
        <About certificateCount={certificates.length} projectCount={projects.length} github={github} />
        <Services />
        <Experience />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Process />
        <Achievements items={achievements} />
        <Certificates certificates={certificates} />
        <Testimonials items={testimonials} />
        <Writing posts={latestPosts} />
        <Resume documents={documents} />
        <Faq items={faqs} />
        <HireMe />
        <Contact bookingUrl={settings.bookingUrl} />
      </main>
      <Footer />
      <SpotlightProvider />
      <ViewTracker />
      <CommandPalette
        projects={projects.map((p) => ({ title: p.title, slug: projectSlug(p) }))}
        cvUrl={cv?.file_url}
        bookingUrl={settings.bookingUrl}
        extraLinks={PALETTE_LINKS}
      />
    </>
  );
}
