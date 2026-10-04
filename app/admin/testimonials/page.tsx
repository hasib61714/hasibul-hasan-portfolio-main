"use client";

import { Quote } from "lucide-react";
import { CrudPage } from "@/components/admin/CrudPage";
import type { Testimonial } from "@/types";

type Row = Testimonial & { id: string };

export default function AdminTestimonialsPage() {
  return (
    <CrudPage<Row>
      table="testimonials"
      title="Testimonials"
      subtitle="Kind words from clients and colleagues — shown on the home page once you add one"
      singular="Testimonial"
      icon={Quote}
      orderField="order_index"
      orderBy={[{ column: "order_index" }]}
      fields={[
        { name: "quote", label: "Quote", type: "textarea", required: true, rows: 5, placeholder: "What did they say about working with you?" },
        { name: "name", label: "Name", type: "text", required: true },
        { name: "role", label: "Role / title", type: "text", required: true, placeholder: "Product Manager" },
        { name: "company", label: "Company", type: "text", placeholder: "Acme Inc. (optional)" },
        { name: "order_index", label: "Order", type: "number", help: "Lower numbers appear first. Leave empty to add at the end." },
      ]}
      renderItem={(t) => ({ title: t.name, meta: `${t.role}${t.company ? ` · ${t.company}` : ""}`, body: `“${t.quote}”` })}
    />
  );
}
