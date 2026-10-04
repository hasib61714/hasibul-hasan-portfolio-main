"use client";

import { Trophy } from "lucide-react";
import { CrudPage } from "@/components/admin/CrudPage";
import { formatDate } from "@/lib/utils";
import type { Achievement } from "@/types";

export default function AdminAchievementsPage() {
  return (
    <CrudPage<Achievement>
      table="achievements"
      title="Achievements"
      subtitle="Awards, open-source contributions, talks and publications"
      singular="Achievement"
      icon={Trophy}
      orderField="order_index"
      orderBy={[{ column: "order_index" }, { column: "achieved_on", ascending: false }]}
      fields={[
        { name: "title", label: "Title", type: "text", required: true, placeholder: "e.g. 2nd place — National Programming Contest" },
        {
          name: "kind", label: "Type", type: "select", defaultValue: "award",
          options: [
            { value: "award", label: "Award" },
            { value: "open-source", label: "Open source" },
            { value: "talk", label: "Talk" },
            { value: "publication", label: "Publication" },
            { value: "other", label: "Other" },
          ],
        },
        { name: "organization", label: "Organisation / event", type: "text" },
        { name: "achieved_on", label: "Date", type: "date" },
        { name: "description", label: "Description", type: "textarea", rows: 3 },
        { name: "url", label: "Link", type: "url", placeholder: "https://…" },
        { name: "order_index", label: "Order", type: "number", help: "Lower numbers appear first. Leave empty to add at the end." },
      ]}
      renderItem={(a) => ({
        title: a.title,
        meta: [a.kind, a.organization, a.achieved_on ? formatDate(a.achieved_on) : null].filter(Boolean).join(" · "),
        body: a.description ?? undefined,
      })}
    />
  );
}
