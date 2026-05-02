"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import type { Skill } from "@/types";

const skillSchema = z.object({
  name:        z.string().min(1),
  category:    z.string().min(1),
  proficiency: z.number().min(1).max(100),
  order_index: z.number().int().default(0),
});
type SkillFormData = z.input<typeof skillSchema>;

const CATEGORIES = ["Frontend", "Backend", "Database", "DevOps", "ML/AI", "Other"];
const CAT_COLORS: Record<string, string> = {
  Frontend: "from-brand-500 to-cyan-500",
  Backend:  "from-green-500 to-emerald-600",
  Database: "from-purple-500 to-violet-600",
  DevOps:   "from-orange-500 to-amber-500",
  "ML/AI":  "from-pink-500 to-rose-500",
  Other:    "from-gray-500 to-gray-600",
};

export default function AdminSkillsPage() {
  const [skills,    setSkills]    = useState<Skill[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing,   setEditing]   = useState<Skill | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } =
    useForm<SkillFormData>({ resolver: zodResolver(skillSchema) });

  const proficiencyValue = watch("proficiency", 80);

  const fetchSkills = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("skills").select("*").order("order_index");
    setSkills(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  const openCreate = () => {
    setEditing(null);
    reset({ proficiency: 80, order_index: skills.length });
    setModalOpen(true);
  };

  const openEdit = (skill: Skill) => {
    setEditing(skill);
    reset({ name: skill.name, category: skill.category, proficiency: skill.proficiency, order_index: skill.order_index });
    setModalOpen(true);
  };

  const onSubmit = async (data: SkillFormData) => {
    const supabase = createClient();
    if (editing) {
      const { error } = await supabase.from("skills").update(data).eq("id", editing.id);
      if (error) { toast.error("Failed to update"); return; }
      toast.success("Skill updated!");
    } else {
      const { error } = await supabase.from("skills").insert(data);
      if (error) { toast.error("Failed to create"); return; }
      toast.success("Skill added!");
    }
    setModalOpen(false);
    fetchSkills();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else { toast.success("Deleted"); fetchSkills(); }
  };

  const grouped = CATEGORIES.reduce<Record<string, Skill[]>>((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat);
    return acc;
  }, {});

  return (
    <>
      <AdminHeader title="Skills" subtitle="Manage your technical skills" />

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-end mb-6">
          <Button onClick={openCreate} leftIcon={<Plus className="w-4 h-4" />}>Add Skill</Button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-8">
            {CATEGORIES.map((cat) => {
              const catSkills = grouped[cat];
              if (catSkills.length === 0) return null;
              return (
                <div key={cat}>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">{cat}</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {catSkills.map((skill) => (
                      <div key={skill.id} className="card-premium rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold text-sm text-gray-900 dark:text-white">{skill.name}</span>
                          <div className="flex gap-1">
                            <button onClick={() => openEdit(skill)} className="p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 text-gray-400 hover:text-brand-500 transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDelete(skill.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${CAT_COLORS[cat] ?? CAT_COLORS.Other}`}
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 w-8 text-right">{skill.proficiency}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Skill" : "Add Skill"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Skill Name *" placeholder="React, TypeScript..." error={errors.name?.message} {...register("name")} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category *</label>
            <select className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500" {...register("category")}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Proficiency: <span className="text-brand-500 font-bold">{proficiencyValue}%</span>
            </label>
            <input type="range" min={1} max={100} className="w-full accent-brand-500" {...register("proficiency", { valueAsNumber: true })} />
          </div>
          <Input label="Order Index" type="number" {...register("order_index", { valueAsNumber: true })} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={isSubmitting}>{editing ? "Update" : "Add"}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
