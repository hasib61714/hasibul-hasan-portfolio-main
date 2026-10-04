"use client";

import { HelpCircle } from "lucide-react";
import { CrudPage } from "@/components/admin/CrudPage";
import { DEFAULT_FAQS } from "@/lib/defaults";
import type { Faq } from "@/types";

export default function AdminFaqsPage() {
  return (
    <CrudPage<Faq>
      table="faqs"
      title="FAQ"
      subtitle="Frequently asked questions. Until you add your own, the site shows a sensible default set."
      singular="Question"
      icon={HelpCircle}
      orderField="order_index"
      orderBy={[{ column: "order_index" }]}
      seedRows={DEFAULT_FAQS.map(({ question, answer, order_index }) => ({ question, answer, order_index }))}
      fields={[
        { name: "question", label: "Question", type: "text", required: true },
        { name: "answer", label: "Answer", type: "textarea", required: true, rows: 5 },
        { name: "order_index", label: "Order", type: "number", help: "Lower numbers appear first. Leave empty to add at the end." },
      ]}
      renderItem={(f) => ({ title: f.question, body: f.answer })}
    />
  );
}
