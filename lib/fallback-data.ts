import type { Certificate, Project, Skill } from "@/types";

/**
 * Seed content shown until the matching Supabase table has rows.
 * This is the single source of truth for fallback data — the public sections
 * never embed their own copies.
 */

export const FALLBACK_SKILLS: Skill[] = [
  // Languages
  { id: "1",  name: "C / C++",                  category: "Languages", proficiency: 72, order_index: 1,  created_at: "" },
  { id: "2",  name: "Java",                      category: "Languages", proficiency: 72, order_index: 2,  created_at: "" },
  { id: "3",  name: "Python",                    category: "Languages", proficiency: 88, order_index: 3,  created_at: "" },
  { id: "4",  name: "JavaScript",                category: "Languages", proficiency: 90, order_index: 4,  created_at: "" },
  { id: "5",  name: "TypeScript",                category: "Languages", proficiency: 90, order_index: 5,  created_at: "" },
  // Frontend
  { id: "6",  name: "React.js",                  category: "Frontend",  proficiency: 92, order_index: 6,  created_at: "" },
  { id: "7",  name: "Next.js",                category: "Frontend",  proficiency: 90, order_index: 7,  created_at: "" },
  { id: "8",  name: "HTML5 / CSS3",              category: "Frontend",  proficiency: 92, order_index: 8,  created_at: "" },
  { id: "9",  name: "Tailwind CSS",              category: "Frontend",  proficiency: 90, order_index: 9,  created_at: "" },
  // Backend
  { id: "10", name: "Laravel",                   category: "Backend",   proficiency: 85, order_index: 10, created_at: "" },
  { id: "11", name: "Node.js / Express.js",      category: "Backend",   proficiency: 82, order_index: 11, created_at: "" },
  { id: "12", name: "FastAPI",                   category: "Backend",   proficiency: 78, order_index: 12, created_at: "" },
  { id: "13", name: "REST API Design",           category: "Backend",   proficiency: 80, order_index: 13, created_at: "" },
  // AI / ML
  { id: "14", name: "Scikit-learn",              category: "ML/AI",     proficiency: 78, order_index: 14, created_at: "" },
  { id: "15", name: "Pandas / NumPy",            category: "ML/AI",     proficiency: 80, order_index: 15, created_at: "" },
  { id: "16", name: "NLP / TF-IDF",             category: "ML/AI",     proficiency: 75, order_index: 16, created_at: "" },
  { id: "17", name: "Feature Engineering",       category: "ML/AI",     proficiency: 72, order_index: 17, created_at: "" },
  // Database
  { id: "18", name: "MySQL / PostgreSQL",        category: "Database",  proficiency: 85, order_index: 18, created_at: "" },
  { id: "19", name: "MongoDB",                   category: "Database",  proficiency: 80, order_index: 19, created_at: "" },
  { id: "20", name: "Supabase (Realtime)",       category: "Database",  proficiency: 80, order_index: 20, created_at: "" },
  // AR / VR
  { id: "21", name: "Unity",                     category: "AR/VR",     proficiency: 70, order_index: 21, created_at: "" },
  { id: "22", name: "XR Development",            category: "AR/VR",     proficiency: 68, order_index: 22, created_at: "" },
  // Security
  { id: "23", name: "Web Pentesting",            category: "Security",  proficiency: 72, order_index: 23, created_at: "" },
  { id: "24", name: "SQL Injection / OSINT",     category: "Security",  proficiency: 70, order_index: 24, created_at: "" },
  { id: "25", name: "Linux OS / Forensics",      category: "Security",  proficiency: 70, order_index: 25, created_at: "" },
  // Tools
  { id: "26", name: "Git / GitHub",              category: "Tools",     proficiency: 90, order_index: 26, created_at: "" },
  { id: "27", name: "VS Code / Postman",         category: "Tools",     proficiency: 88, order_index: 27, created_at: "" },
  { id: "28", name: "Vercel / Netlify",          category: "Tools",     proficiency: 80, order_index: 28, created_at: "" },
  { id: "29", name: "Prisma / Capacitor",        category: "Tools",     proficiency: 74, order_index: 29, created_at: "" },
];

export const FALLBACK_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Internship Hub",
    problem: "Students, employers and admins needed one place to post internships, apply and track applications, in Bengali or English.",
    solution: "A job and internship platform with separate student, employer and admin accounts, JWT login, application tracking and a Bengali/English interface. Deployed on Vercel.",
    highlights: ["Student, employer and admin roles", "JWT login", "Bengali / English interface", "Application tracking"],
    description: "Job and internship platform with student, employer and admin roles, JWT login and a Bengali/English interface.",
    tech_stack: ["React", "Laravel", "MySQL", "JWT", "Vercel"],
    category: "Full-Stack",
    featured: true,
    live_url: "https://internship-hub-ten.vercel.app",
    github_url: "https://github.com/hasib61714/internship-hub",
    order_index: 1,
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    title: "Heart Disease Prediction",
    problem: "A risk score is hard to trust if you cannot see why the model gave it.",
    solution: "A FastAPI service runs a scikit-learn model. The React frontend shows the predicted risk with explainability output and lets you export the result as a PDF.",
    highlights: ["Explainability output with each prediction", "PDF export", "FastAPI backend, React frontend"],
    description: "Heart disease risk prediction with explainability output and PDF export. FastAPI backend, React frontend.",
    tech_stack: ["Python", "FastAPI", "React", "Scikit-learn"],
    category: "ML/AI",
    featured: true,
    live_url: undefined,
    github_url: "https://github.com/hasib61714/heart-disease-prediction",
    order_index: 2,
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    title: "HairHub ERP System",
    problem: "A multi-factory business had to keep inventory, challans, cash flow and party settlements in one place.",
    solution: "An ERP with nine modules, built with React, TypeScript and Supabase. It is packaged for mobile with Capacitor and hosted on Netlify.",
    highlights: ["Nine modules", "Inventory, challan, cash flow, party settlement", "Mobile build with Capacitor"],
    description: "ERP for a multi-factory business: inventory, challan, cash flow and party settlement. Nine modules.",
    tech_stack: ["React", "TypeScript", "Supabase", "Capacitor", "Tailwind CSS"],
    category: "Full-Stack",
    featured: true,
    live_url: "https://magenta-pasca-36250e.netlify.app",
    github_url: undefined,
    order_index: 3,
    created_at: "",
    updated_at: "",
  },
  {
    id: "4",
    title: "IMAP Service Platform",
    problem: "Finding and booking a local service provider usually runs on phone calls and trust.",
    solution: "A service marketplace with live GPS tracking, WebSocket chat and OTP login.",
    highlights: ["Live GPS tracking", "WebSocket chat", "OTP login"],
    description: "Service marketplace with live GPS tracking, WebSocket chat and OTP login.",
    tech_stack: ["JavaScript", "AI", "GPS", "WebSocket", "Node.js"],
    category: "Full-Stack",
    featured: false,
    live_url: undefined,
    github_url: "https://github.com/hasib61714/imap-bangladesh",
    order_index: 4,
    created_at: "",
    updated_at: "",
  },
  {
    id: "5",
    title: "TrendHaus E-Commerce",
    problem: "An online store needs the shopping flow and the admin tools behind it.",
    solution: "An e-commerce site with cart, checkout, order tracking, wishlist and coupons, plus an admin panel and inventory management.",
    highlights: ["Cart, checkout, order tracking", "Wishlist and coupons", "Admin panel and inventory"],
    description: "E-commerce site with cart, checkout, order tracking, coupons and an admin panel.",
    tech_stack: ["React", "TypeScript", "Supabase", "Tailwind CSS"],
    category: "E-Commerce",
    featured: false,
    live_url: undefined,
    github_url: undefined,
    order_index: 5,
    created_at: "",
    updated_at: "",
  },
  {
    id: "6",
    title: "Fake News Detection",
    problem: "Fake articles spread faster than anyone can check them by hand.",
    solution: "Articles are converted to TF-IDF features and four classifiers are compared: Naive Bayes, Logistic Regression, LinearSVC and Random Forest.",
    highlights: ["TF-IDF features", "Four classifiers compared"],
    description: "Fake news classifier comparing four models on TF-IDF features.",
    tech_stack: ["Python", "Scikit-learn", "NLP", "TF-IDF", "Pandas"],
    category: "ML/AI",
    featured: false,
    live_url: undefined,
    github_url: "https://github.com/hasib61714/Fake-News-Detector",
    order_index: 6,
    created_at: "",
    updated_at: "",
  },
];

export const FALLBACK_CERTS: Certificate[] = [
  {
    id: "1",
    title: "Software Engineer",
    issuer: "HackerRank",
    issue_date: "2026-04-01",
    description: "Credential ID: 842FC65F25FE",
    credential_url: "https://www.hackerrank.com/certificates/842FC65F25FE",
    created_at: "",
  },
  {
    id: "2",
    title: "Software Engineer Intern",
    issuer: "HackerRank",
    issue_date: "2026-04-01",
    description: "Credential ID: AE645963A25B",
    credential_url: "https://www.hackerrank.com/certificates/AE645963A25B",
    created_at: "",
  },
  {
    id: "3",
    title: "Frontend Developer (React)",
    issuer: "HackerRank",
    issue_date: "2026-04-01",
    description: "Credential ID: 77F03DAEDFC5",
    credential_url: "https://www.hackerrank.com/certificates/77F03DAEDFC5",
    created_at: "",
  },
  {
    id: "4",
    title: "Cyber Security & Ethical Hacking",
    issuer: "Arena Web Security",
    issue_date: "2024-03-01",
    description: "18-week course. Verification: A47W1403S045",
    created_at: "",
  },
  {
    id: "5",
    title: "Job Ready: Employability Skills",
    issuer: "Wadhwani Foundation",
    issue_date: "2026-04-01",
    description: "Green University of Bangladesh · 75 hours",
    created_at: "",
  },
  {
    id: "6",
    title: "AR/VR Development Training",
    issuer: "Battery Low Interactive Ltd.",
    issue_date: "2026-01-01",
    description: "Hands-on AR/VR development training with live project work using Unity.",
    created_at: "",
  },
  {
    id: "7",
    title: "Machine Learning & Data Science",
    issuer: "Self-Directed / Project-Based",
    issue_date: "2024-01-01",
    description: "Project-based learning covering Scikit-learn, Pandas, NumPy, NLP, and feature engineering.",
    created_at: "",
  },
];

/** Fallback rows without client-side ids/timestamps, ready to insert into the database. */
export function forImport<T extends { id: string; created_at: string; updated_at?: string }>(rows: T[]): Record<string, unknown>[] {
  return rows.map((row) => {
    const copy: Record<string, unknown> = { ...row };
    delete copy.id;
    delete copy.created_at;
    delete copy.updated_at;
    return copy;
  });
}
