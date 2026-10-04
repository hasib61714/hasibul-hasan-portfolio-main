import type { ContentBlock, Faq } from "@/types";

/**
 * Starter content for sections that are managed from the admin panel.
 * It is shown only until you add your own rows (Admin → FAQ).
 */
export const DEFAULT_FAQS: Faq[] = [
  {
    id: "d1",
    question: "Where are you based and which time zones do you work in?",
    answer:
      "I'm based in Dhaka, Bangladesh (GMT+6) and work remotely. I'm comfortable collaborating asynchronously and can arrange overlap hours with teams in Europe, the Middle East, Asia and the Americas.",
    order_index: 1,
  },
  {
    id: "d2",
    question: "What kind of work are you open to?",
    answer:
      "Remote full-time roles and contract or freelance projects: full-stack web applications, backend APIs, machine-learning features and AR/VR prototypes.",
    order_index: 2,
  },
  {
    id: "d3",
    question: "Which technologies do you work with?",
    answer:
      "TypeScript, React and Next.js on the front end; Laravel, Node.js and FastAPI on the back end; PostgreSQL, MySQL, MongoDB and Supabase for data; Python and scikit-learn for machine learning; Unity for AR/VR.",
    order_index: 3,
  },
  {
    id: "d4",
    question: "How do we get started?",
    answer:
      "Send a hire request or an email with a short description of your goals, timeline and budget range. I reply within 24 hours, usually with a few clarifying questions and a proposed next step such as a short call.",
    order_index: 4,
  },
  {
    id: "d5",
    question: "How do you keep projects on track?",
    answer:
      "Work is split into small, reviewable milestones with regular written updates, so you can see progress and give feedback early instead of at the very end.",
    order_index: 5,
  },
];

const block = (section: ContentBlock["section"], i: number, title: string, description: string, tags: string[] = [], icon: string | null = null): ContentBlock => ({
  id: `default-${section}-${i}`, section, title, description, tags, icon, order_index: i,
});

export const DEFAULT_SERVICES: ContentBlock[] = [
  block("service", 1, "Full-stack web applications", "Product-grade apps with React and Next.js on the front end and Laravel, Node.js or Supabase behind them.", ["React", "Next.js", "Laravel", "Supabase"], "layers"),
  block("service", 2, "APIs & backend systems", "Clean, documented REST APIs, authentication, background jobs and database design that scale with your product.", ["REST", "FastAPI", "PostgreSQL", "Node.js"], "server"),
  block("service", 3, "Machine learning features", "From data cleaning and model training to explainable predictions served through an API your app can call.", ["Python", "Scikit-learn", "NLP", "XAI"], "brain"),
  block("service", 4, "AR / VR experiences", "Interactive Unity prototypes and XR applications for mobile and wearable devices.", ["Unity", "C#", "AR Foundation"], "glasses"),
  block("service", 5, "Secure-by-default engineering", "Practical web-security thinking built into the code: validation, access control and safe deployments.", ["OWASP", "Pentesting basics", "Linux"], "shield"),
  block("service", 6, "Consulting & code review", "An outside set of eyes on architecture, performance and maintainability before small problems get expensive.", ["Architecture", "Performance", "Reviews"], "search"),
];

export const DEFAULT_PROCESS: ContentBlock[] = [
  block("process", 1, "Discover", "We clarify goals, users, constraints and what success looks like before any code is written."),
  block("process", 2, "Design", "I propose a simple architecture and interface, and we agree on scope and milestones together."),
  block("process", 3, "Build", "Iterative development in small, tested increments with regular written updates and demos."),
  block("process", 4, "Ship & support", "Deployment, documentation and hand-over — plus follow-up so the product keeps working."),
];

export const DEFAULT_PILLARS: ContentBlock[] = [
  block("pillar", 1, "What I do", "Full-stack web apps, ML systems, AR/VR experiences and enterprise platforms — React, Next.js, Laravel, FastAPI and Python.", [], "layers"),
  block("pillar", 2, "How I work", "Clear communication, typed and tested code, small reviewable changes. Comfortable working asynchronously with distributed teams.", [], "building"),
  block("pillar", 3, "Always learning", "Actively exploring applied ML, AR/VR and security so the systems I build stay modern, fast and safe by default.", [], "lightbulb"),
];
