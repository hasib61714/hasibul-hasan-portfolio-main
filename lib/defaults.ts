import type { Faq } from "@/types";

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

export const SERVICES = [
  {
    title: "Full-stack web applications",
    description: "Product-grade apps with React and Next.js on the front end and Laravel, Node.js or Supabase behind them.",
    tags: ["React", "Next.js", "Laravel", "Supabase"],
    icon: "layers",
  },
  {
    title: "APIs & backend systems",
    description: "Clean, documented REST APIs, authentication, background jobs and database design that scale with your product.",
    tags: ["REST", "FastAPI", "PostgreSQL", "Node.js"],
    icon: "server",
  },
  {
    title: "Machine learning features",
    description: "From data cleaning and model training to explainable predictions served through an API your app can call.",
    tags: ["Python", "Scikit-learn", "NLP", "XAI"],
    icon: "brain",
  },
  {
    title: "AR / VR experiences",
    description: "Interactive Unity prototypes and XR applications for mobile and wearable devices.",
    tags: ["Unity", "C#", "AR Foundation"],
    icon: "glasses",
  },
  {
    title: "Secure-by-default engineering",
    description: "Practical web-security thinking built into the code: validation, access control and safe deployments.",
    tags: ["OWASP", "Pentesting basics", "Linux"],
    icon: "shield",
  },
  {
    title: "Consulting & code review",
    description: "An outside set of eyes on architecture, performance and maintainability before small problems get expensive.",
    tags: ["Architecture", "Performance", "Reviews"],
    icon: "search",
  },
] as const;

export const PROCESS_STEPS = [
  {
    title: "Discover",
    description: "We clarify goals, users, constraints and what success looks like before any code is written.",
  },
  {
    title: "Design",
    description: "I propose a simple architecture and interface, and we agree on scope and milestones together.",
  },
  {
    title: "Build",
    description: "Iterative development in small, tested increments with regular written updates and demos.",
  },
  {
    title: "Ship & support",
    description: "Deployment, documentation and hand-over — plus follow-up so the product keeps working.",
  },
] as const;
