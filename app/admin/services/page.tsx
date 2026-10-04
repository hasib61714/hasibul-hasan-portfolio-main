"use client";

import { Layers } from "lucide-react";
import { CrudPage } from "@/components/admin/CrudPage";
import { DEFAULT_SERVICES } from "@/lib/defaults";
import type { ContentBlock } from "@/types";

const ICON_OPTIONS = [
  "layers", "server", "brain", "glasses", "shield", "search", "code", "rocket", "database", "smartphone", "cloud", "palette",
].map((v) => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }));

export default function AdminServicesPage() {
  return (
    <CrudPage<ContentBlock>
      table="content_blocks"
      filter={{ column: "section", value: "service" }}
      title="Services"
      subtitle="What you offer — shown as cards in the “Services” section"
      singular="Service"
      icon={Layers}
      orderField="order_index"
      orderBy={[{ column: "order_index" }]}
      seedRows={DEFAULT_SERVICES.map(({ title, description, tags, icon, order_index }) => ({ title, description, tags, icon, order_index }))}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea", required: true, rows: 3 },
        { name: "tags", label: "Technology tags", type: "tags", placeholder: "React, Next.js, Supabase", help: "Comma separated." },
        { name: "icon", label: "Icon", type: "select", defaultValue: "layers", options: ICON_OPTIONS },
        { name: "order_index", label: "Order", type: "number", help: "Lower numbers appear first. Leave empty to add at the end." },
      ]}
      renderItem={(b) => ({ title: b.title, meta: b.tags?.join(", "), body: b.description })}
    />
  );
}
