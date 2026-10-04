"use client";

import { Briefcase } from "lucide-react";
import { CrudPage } from "@/components/admin/CrudPage";
import { EXPERIENCES, type ExperienceRow } from "@/lib/experience";

const COLORS = [
  { value: "from-brand-500 to-cyan-500", label: "Blue → Cyan" },
  { value: "from-purple-500 to-accent-500", label: "Purple → Violet" },
  { value: "from-amber-500 to-orange-500", label: "Amber → Orange" },
  { value: "from-red-500 to-rose-500", label: "Red → Rose" },
  { value: "from-green-500 to-emerald-500", label: "Green → Emerald" },
  { value: "from-blue-500 to-indigo-500", label: "Blue → Indigo" },
  { value: "from-teal-500 to-cyan-500", label: "Teal → Cyan" },
  { value: "from-pink-500 to-rose-500", label: "Pink → Rose" },
];

const SEED = EXPERIENCES.map((e, i) => ({
  kind: e.type,
  title: e.title,
  organization: e.organization,
  location: e.location || null,
  period: e.period,
  is_current: !!e.current,
  description: e.description,
  tech: e.tech ?? [],
  color: e.color,
  link: e.link ?? null,
  order_index: i + 1,
}));

export default function AdminExperiencePage() {
  return (
    <CrudPage<ExperienceRow>
      table="experiences"
      title="Experience & Education"
      subtitle="Your work history and education timeline"
      singular="Entry"
      icon={Briefcase}
      orderField="order_index"
      orderBy={[{ column: "kind", ascending: false }, { column: "order_index" }]}
      seedRows={SEED}
      fields={[
        {
          name: "kind", label: "Type", type: "select", defaultValue: "work",
          options: [{ value: "work", label: "Work experience" }, { value: "education", label: "Education" }],
        },
        { name: "title", label: "Title / degree", type: "text", required: true, placeholder: "Software Engineer" },
        { name: "organization", label: "Company / school", type: "text", required: true },
        { name: "period", label: "Period", type: "text", required: true, placeholder: "Feb 2026 – Present" },
        { name: "location", label: "Location", type: "text", placeholder: "Dhaka, Bangladesh" },
        { name: "is_current", label: "Current position?", type: "boolean", defaultValue: "false" },
        { name: "description", label: "Highlights (one per line)", type: "lines", rows: 6 },
        { name: "tech", label: "Technologies / skills", type: "tags", placeholder: "React, Next.js, Laravel", help: "Comma separated." },
        { name: "color", label: "Accent colour", type: "select", defaultValue: COLORS[0].value, options: COLORS },
        { name: "link", label: "Website", type: "url", placeholder: "https://…" },
        { name: "order_index", label: "Order", type: "number", help: "Lower numbers appear first within each type. Leave empty to add at the end." },
      ]}
      renderItem={(e) => ({
        title: e.title,
        meta: `${e.kind === "work" ? "Work" : "Education"} · ${e.organization} · ${e.period}${e.is_current ? " · Current" : ""}`,
        body: e.description?.[0],
      })}
    />
  );
}
