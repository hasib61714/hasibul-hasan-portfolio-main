"use client";

import { Sparkles } from "lucide-react";
import { CrudPage } from "@/components/admin/CrudPage";
import { DEFAULT_PILLARS } from "@/lib/defaults";
import type { ContentBlock } from "@/types";

const ICONS = ["layers", "building", "lightbulb", "brain", "code", "server", "shield", "rocket", "search", "glasses", "database", "smartphone", "cloud", "palette"]
  .map((v) => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }));

export default function AdminHighlightsPage() {
  return (
    <CrudPage<ContentBlock>
      table="content_blocks"
      filter={{ column: "section", value: "pillar" }}
      title="About highlights"
      subtitle="The small cards under “My story” in the About section"
      singular="Highlight"
      icon={Sparkles}
      orderField="order_index"
      orderBy={[{ column: "order_index" }]}
      seedRows={DEFAULT_PILLARS.map(({ title, description, icon, order_index }) => ({ title, description, icon, order_index }))}
      fields={[
        { name: "title", label: "Title", type: "text", required: true, placeholder: "What I do" },
        { name: "description", label: "Text", type: "textarea", required: true, rows: 3 },
        { name: "icon", label: "Icon", type: "select", defaultValue: "layers", options: ICONS },
        { name: "order_index", label: "Order", type: "number", help: "Lower numbers appear first. Leave empty to add at the end." },
      ]}
      renderItem={(b) => ({ title: b.title, body: b.description })}
    />
  );
}
