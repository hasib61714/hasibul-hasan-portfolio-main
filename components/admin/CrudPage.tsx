"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Pencil, Plus, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import toast from "react-hot-toast";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { createClient } from "@/lib/supabase/client";

export interface CrudField {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "url" | "select" | "lines" | "tags" | "boolean";
  required?: boolean;
  placeholder?: string;
  help?: string;
  rows?: number;
  options?: { value: string; label: string }[];
  /** Value used when creating a new row. */
  defaultValue?: string;
}

interface CrudPageProps<T extends { id: string }> {
  table: string;
  title: string;
  subtitle: string;
  singular: string;
  icon: LucideIcon;
  fields: CrudField[];
  orderBy: { column: string; ascending?: boolean }[];
  /** Name of an integer column that should default to "last position" on create. */
  orderField?: string;
  /** Only show / create rows where `column` equals `value` (for tables shared by several pages). */
  filter?: { column: string; value: string };
  /** Built-in content that can be imported into the table in one click, so it can then be edited here. */
  seedRows?: Record<string, unknown>[];
  renderItem: (item: T) => { title: string; meta?: string; body?: string };
}

type FormValues = Record<string, string>;

const HTTP_URL = /^https?:\/\/\S+$/i;

export function CrudPage<T extends { id: string }>({
  table, title, subtitle, singular, icon: Icon, fields, orderBy, orderField, filter, seedRows, renderItem,
}: CrudPageProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);

  // `orderBy` is usually an inline literal; key it by value so it can't retrigger loading every render.
  const orderKey = JSON.stringify(orderBy);
  const filterColumn = filter?.column;
  const filterValue = filter?.value;

  const load = useCallback(async () => {
    const supabase = createClient();
    let query = supabase.from(table).select("*");
    if (filterColumn && filterValue) query = query.eq(filterColumn, filterValue);
    (JSON.parse(orderKey) as CrudPageProps<T>["orderBy"]).forEach((o) => { query = query.order(o.column, { ascending: o.ascending ?? true }); });
    const { data, error } = await query;
    if (error) toast.error(`Failed to load ${title.toLowerCase()}: ${error.message}`);
    setItems((data as T[]) ?? []);
    setLoading(false);
  }, [table, title, orderKey, filterColumn, filterValue]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setErrors({});
    const initial: FormValues = {};
    fields.forEach((f) => { initial[f.name] = f.defaultValue ?? ""; });
    setValues(initial);
    setOpen(true);
  };

  const openEdit = (item: T) => {
    setEditing(item);
    setErrors({});
    const initial: FormValues = {};
    const record = item as unknown as Record<string, unknown>;
    fields.forEach((f) => {
      const v = record[f.name];
      initial[f.name] =
        v == null ? ""
        : f.type === "lines" && Array.isArray(v) ? v.join("\n")
        : f.type === "tags" && Array.isArray(v) ? v.join(", ")
        : String(v);
    });
    setValues(initial);
    setOpen(true);
  };

  const validate = () => {
    const next: Record<string, string> = {};
    fields.forEach((f) => {
      const v = (values[f.name] ?? "").trim();
      if (f.required && !v) next[f.name] = `${f.label} is required`;
      else if (f.type === "url" && v && !HTTP_URL.test(v)) next[f.name] = "Must be a valid http(s) URL";
      else if (f.type === "number" && v && Number.isNaN(Number(v))) next[f.name] = "Must be a number";
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload: Record<string, unknown> = {};
    fields.forEach((f) => {
      const v = (values[f.name] ?? "").trim();
      payload[f.name] =
        f.type === "number" ? (v === "" ? 0 : Number(v))
        : f.type === "boolean" ? v === "true"
        : f.type === "lines" ? (values[f.name] ?? "").split("\n").map((l) => l.trim()).filter(Boolean)
        : f.type === "tags" ? v.split(",").map((t) => t.trim()).filter(Boolean)
        : v === "" ? null : v;
    });
    if (filter && !editing) payload[filter.column] = filter.value;
    if (orderField && !editing && payload[orderField] == null) payload[orderField] = items.length;

    const supabase = createClient();
    const { error } = editing
      ? await supabase.from(table).update(payload).eq("id", editing.id)
      : await supabase.from(table).insert(payload);
    setSaving(false);
    if (error) { toast.error(`Failed to save: ${error.message}`); return; }
    toast.success(editing ? `${singular} updated` : `${singular} added`);
    setOpen(false);
    load();
  };

  const importSeed = async () => {
    if (!seedRows?.length) return;
    setImporting(true);
    const rows = seedRows.map((r) => (filter ? { ...r, [filter.column]: filter.value } : r));
    const { error } = await createClient().from(table).insert(rows);
    setImporting(false);
    if (error) { toast.error(`Import failed: ${error.message}`); return; }
    toast.success(`Imported ${rows.length} item${rows.length > 1 ? "s" : ""} — you can now edit them`);
    load();
  };

  const remove = async (item: T) => {
    if (!confirm(`Delete this ${singular.toLowerCase()}?`)) return;
    const { error } = await createClient().from(table).delete().eq("id", item.id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Deleted");
    load();
  };

  return (
    <>
      <AdminHeader title={title} subtitle={subtitle} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex justify-end">
          <Button onClick={openCreate} leftIcon={<Plus className="h-4 w-4" />}>Add {singular}</Button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : items.length === 0 ? (
          <div>
            <EmptyState icon={Icon} title={`No ${title.toLowerCase()} yet`} description={`Click “Add ${singular}” to create the first one.`} />
            {seedRows && seedRows.length > 0 && (
              <div className="mx-auto mt-2 max-w-md rounded-2xl border border-dashed border-gray-300 p-5 text-center dark:border-white/15">
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                  Your website currently shows built-in content here. Import it to edit, reorder or delete each item.
                </p>
                <Button type="button" variant="outline" isLoading={importing} onClick={importSeed} leftIcon={<Download className="h-4 w-4" />}>
                  Import current website content ({seedRows.length})
                </Button>
              </div>
            )}
          </div>
        ) : (
          <ul className="grid gap-4 lg:grid-cols-2">
            {items.map((item) => {
              const view = renderItem(item);
              return (
                <li key={item.id} className="card-premium flex items-start gap-4 rounded-2xl p-5">
                  <div className="relative z-10 min-w-0 flex-1">
                    <p className="font-bold text-gray-900 dark:text-white">{view.title}</p>
                    {view.meta && <p className="mt-0.5 text-xs font-medium text-brand-600 dark:text-brand-300">{view.meta}</p>}
                    {view.body && <p className="mt-2 line-clamp-3 text-sm text-gray-600 dark:text-gray-400">{view.body}</p>}
                  </div>
                  <div className="relative z-10 flex shrink-0 gap-1.5">
                    <button onClick={() => openEdit(item)} aria-label={`Edit ${view.title}`} className="rounded-lg border border-gray-200 p-2 text-gray-500 transition-colors hover:text-brand-500 dark:border-white/10">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => remove(item)} aria-label={`Delete ${view.title}`} className="rounded-lg border border-gray-200 p-2 text-gray-500 transition-colors hover:text-red-500 dark:border-white/10">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={editing ? `Edit ${singular}` : `Add ${singular}`} size="lg">
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {fields.map((f) => {
            const common = {
              label: f.label + (f.required ? " *" : ""),
              value: values[f.name] ?? "",
              error: errors[f.name],
              placeholder: f.placeholder,
            };
            const set = (v: string) => setValues((prev) => ({ ...prev, [f.name]: v }));
            return (
              <div key={f.name}>
                {f.type === "textarea" || f.type === "lines" ? (
                  <Textarea {...common} rows={f.rows ?? 4} onChange={(e) => set(e.target.value)} />
                ) : f.type === "select" || f.type === "boolean" ? (
                  <Select label={common.label} error={common.error} value={common.value} onChange={(e) => set(e.target.value)}>
                    {(f.type === "boolean"
                      ? [{ value: "false", label: "No" }, { value: "true", label: "Yes" }]
                      : f.options
                    )?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Select>
                ) : (
                  <Input
                    {...common}
                    type={f.type === "url" ? "url" : f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                    onChange={(e) => set(e.target.value)}
                  />
                )}
                {f.help && <p className="mt-1 text-xs text-gray-500">{f.help}</p>}
              </div>
            );
          })}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={saving}>{editing ? "Update" : "Add"}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
