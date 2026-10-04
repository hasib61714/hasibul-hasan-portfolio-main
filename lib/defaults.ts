import type { ContentBlock, Faq } from "@/types";

/**
 * Starter content for sections that are managed from the admin panel.
 * It is shown only until you add your own rows (Admin → FAQ).
 */
export const DEFAULT_FAQS: Faq[] = [
  {
    id: "d1",
    question: "Where are you based?",
    answer:
      "Dhaka, Bangladesh (GMT+6). I work remotely and can overlap with European or US hours if the team needs it.",
    order_index: 1,
  },
  {
    id: "d2",
    question: "What kind of work are you looking for?",
    answer:
      "Remote full-time roles, plus contract projects when my schedule allows. Mostly web apps and backend work, sometimes ML features.",
    order_index: 2,
  },
  {
    id: "d3",
    question: "What do you work with?",
    answer:
      "React, Next.js and TypeScript on the front end. Laravel, Node.js and FastAPI on the back end. PostgreSQL, MySQL, MongoDB and Supabase for data. Python with scikit-learn for ML, and Unity for AR/VR.",
    order_index: 3,
  },
  {
    id: "d4",
    question: "How do I get in touch?",
    answer:
      "Email or WhatsApp is fastest, or use the contact form. Tell me a bit about the project and when you need it.",
    order_index: 4,
  },
];

const block = (section: ContentBlock["section"], i: number, title: string, description: string, tags: string[] = [], icon: string | null = null): ContentBlock => ({
  id: `default-${section}-${i}`, section, title, description, tags, icon, order_index: i,
});

export const DEFAULT_SERVICES: ContentBlock[] = [
  block("service", 1, "Web applications", "Full-stack apps with React or Next.js on the front and Laravel, Node.js or Supabase behind them.", ["React", "Next.js", "Laravel", "Supabase"], "layers"),
  block("service", 2, "APIs and databases", "REST APIs, authentication and database design.", ["REST", "FastAPI", "PostgreSQL", "Node.js"], "server"),
  block("service", 3, "Machine learning", "Cleaning data, training a model, and putting it behind an API your app can call.", ["Python", "Scikit-learn", "NLP"], "brain"),
  block("service", 4, "AR / VR prototypes", "Unity prototypes for mobile and headsets.", ["Unity", "C#"], "glasses"),
];

export const DEFAULT_PROCESS: ContentBlock[] = [
  block("process", 1, "Talk", "We go over what you need, who it's for and the deadline."),
  block("process", 2, "Plan", "I write down the scope and a rough milestone list so we agree before I start."),
  block("process", 3, "Build", "I build in small pieces and send updates as things work."),
  block("process", 4, "Hand over", "I deploy it, document it, and stay around for fixes."),
];

export const DEFAULT_PILLARS: ContentBlock[] = [
  block("pillar", 1, "What I build", "Full-stack web apps, ML projects and some AR/VR.", [], "layers"),
  block("pillar", 2, "How I work", "Small changes, written updates, and I'm comfortable working async.", [], "building"),
  block("pillar", 3, "What I'm learning", "Applied ML and security, mostly through side projects.", [], "lightbulb"),
];
