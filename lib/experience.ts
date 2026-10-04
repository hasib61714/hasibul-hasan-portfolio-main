/** Work and education history shown on the home page and the printable resume. */

export type TabType = "work" | "education";

export interface ExperienceItem {
  id: string;
  type: TabType;
  title: string;
  organization: string;
  location: string;
  period: string;
  current?: boolean;
  description: string[];
  tech?: string[];
  color: string;
  link?: string;
}

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: "1",
    type: "work",
    title: "Software Engineer (Full-Time)",
    organization: "Red Data (Pvt.) Ltd.",
    location: "Dhaka, Bangladesh",
    period: "Feb 2026 – Present",
    current: true,
    description: [
      "Full-time Software Engineer at a licensed internet service provider, contributing to enterprise-grade web systems and infrastructure.",
      "Promoted from Intern to permanent Software Engineer after demonstrated performance and delivery.",
      "Building and maintaining enterprise web solutions, REST APIs, and internal tooling.",
      "Working in an agile team: code reviews, sprint planning and cross-functional delivery with product and operations.",
    ],
    tech: ["React", "Next.js", "TypeScript", "Laravel", "Supabase", "PostgreSQL", "REST APIs", "Tailwind CSS"],
    color: "from-brand-500 to-cyan-500",
    link: "https://reddata.com.bd",
  },
  {
    id: "2",
    type: "work",
    title: "AR/VR Developer Training",
    organization: "Battery Low Interactive Ltd.",
    location: "Bangladesh",
    period: "2026",
    description: [
      "Completed specialized AR/VR development training with hands-on live project work using Unity.",
      "Built interactive AR applications targeting mobile and wearable platforms.",
      "Gained practical experience in XR development workflows and 3D asset integration.",
    ],
    tech: ["Unity", "C#", "AR Foundation", "XR Development", "3D Modeling"],
    color: "from-purple-500 to-accent-500",
  },
  {
    id: "3",
    type: "work",
    title: "Business Development Executive Manager",
    organization: "Mahin Enterprise",
    location: "Bangladesh",
    period: "2022 – Present",
    current: true,
    description: [
      "Leading business development, client acquisition, partnerships and team coordination.",
      "Running day-to-day operations alongside my engineering career — growth strategy, client relations and process improvement.",
    ],
    tech: ["Business Development", "Client Management", "Team Leadership"],
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "4",
    type: "work",
    title: "Cyber Security Trainee",
    organization: "Arena Web Security",
    location: "Bangladesh",
    period: "2023 – 2024",
    description: [
      "Completed 18-week certified cyber security programme.",
      "Studied web pentesting, SQL injection, OSINT, social engineering, and digital forensics.",
      "Gained hands-on experience with Linux OS and real-world security tools.",
    ],
    tech: ["Web Pentesting", "SQL Injection", "OSINT", "Social Engineering", "Digital Forensics", "Linux"],
    color: "from-red-500 to-rose-500",
  },
  {
    id: "5",
    type: "education",
    title: "B.Sc. in Computer Science & Engineering",
    organization: "Green University of Bangladesh",
    location: "Dhaka, Bangladesh",
    period: "2022 – Present",
    current: true,
    description: [
      "Final-year student specializing in software engineering and machine learning.",
      "Core coursework: Data Structures & Algorithms, Machine Learning, DBMS, Software Engineering, Computer Networks.",
      "Working on thesis related to explainable AI and health prediction systems.",
    ],
    tech: ["Python", "Java", "C++", "Data Structures", "Algorithms", "Machine Learning", "Statistics"],
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "6",
    type: "education",
    title: "Higher Secondary Certificate (HSC)",
    organization: "Govt. Ananda Mohan College",
    location: "Mymensingh, Bangladesh",
    period: "2020",
    description: [
      "Higher secondary education in Science.",
      "Graduated with a perfect GPA of 5.00 / 5.00.",
    ],
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: "7",
    type: "education",
    title: "Secondary School Certificate (SSC)",
    organization: "Imam Bari High School",
    location: "Sherpur, Bangladesh",
    period: "2017",
    description: [
      "Secondary education in Science.",
      "Graduated with a perfect GPA of 5.00 / 5.00.",
    ],
    color: "from-teal-500 to-cyan-500",
  },
];

