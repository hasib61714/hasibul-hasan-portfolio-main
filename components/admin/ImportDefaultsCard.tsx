"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

/**
 * Shown while a table is empty: the website then displays built-in content, and this
 * button copies it into the database so each item can be edited, reordered or deleted.
 */
export function ImportDefaultsCard({
  table, rows, onDone,
}: { table: string; rows: Record<string, unknown>[]; onDone: () => void }) {
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    const { error } = await createClient().from(table).insert(rows);
    setBusy(false);
    if (error) { toast.error(`Import failed: ${error.message}`); return; }
    toast.success(`Imported ${rows.length} items — you can now edit them`);
    onDone();
  };

  return (
    <div className="mx-auto mb-6 max-w-lg rounded-2xl border border-dashed border-gray-300 p-5 text-center dark:border-white/15">
      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
        Nothing saved here yet, so your website shows built-in content. Import it to edit, reorder or delete each item.
      </p>
      <Button type="button" variant="outline" isLoading={busy} onClick={run} leftIcon={<Download className="h-4 w-4" />}>
        Import current website content ({rows.length})
      </Button>
    </div>
  );
}
