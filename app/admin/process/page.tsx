"use client";

import { ListOrdered } from "lucide-react";
import { CrudPage } from "@/components/admin/CrudPage";
import { DEFAULT_PROCESS } from "@/lib/defaults";
import type { ContentBlock } from "@/types";

export default function AdminProcessPage() {
  return (
    <CrudPage<ContentBlock>
      table="content_blocks"
      filter={{ column: "section", value: "process" }}
      title="Work process"
      subtitle="The steps shown in the “Process” section, in order"
      singular="Step"
      icon={ListOrdered}
      orderField="order_index"
      orderBy={[{ column: "order_index" }]}
      seedRows={DEFAULT_PROCESS.map(({ title, description, order_index }) => ({ title, description, order_index }))}
      fields={[
        { name: "title", label: "Step name", type: "text", required: true, placeholder: "Discover" },
        { name: "description", label: "Description", type: "textarea", required: true, rows: 3 },
        { name: "order_index", label: "Order", type: "number", help: "Lower numbers appear first. Leave empty to add at the end." },
      ]}
      renderItem={(b) => ({ title: `${b.order_index}. ${b.title}`, body: b.description })}
    />
  );
}
