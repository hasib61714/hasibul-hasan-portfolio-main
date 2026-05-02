"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, ExternalLink, Github, Upload, Image as ImageIcon } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import type { Project } from "@/types";

const projectSchema = z.object({
  title:            z.string().min(1, "Title is required"),
  description:      z.string().min(1, "Description is required"),
  long_description: z.string().optional(),
  tech_stack:       z.string().min(1, "Add at least one technology"),
  category:         z.string().min(1, "Category is required"),
  image_url:        z.string().url("Must be a valid URL").optional().or(z.literal("")),
  live_url:         z.string().url("Must be a valid URL").optional().or(z.literal("")),
  github_url:       z.string().url("Must be a valid URL").optional().or(z.literal("")),
  featured:         z.boolean().optional().default(false),
  order_index:      z.number().int().optional().default(0),
});

type ProjectFormData = z.input<typeof projectSchema>;

export default function AdminProjectsPage() {
  const [projects,  setProjects]  = useState<Project[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing,   setEditing]   = useState<Project | null>(null);
  const [deleting,  setDeleting]  = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ProjectFormData>({ resolver: zodResolver(projectSchema) });

  const fetchProjects = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("order_index");
    setProjects(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const openCreate = () => {
    setEditing(null);
    reset({ featured: false, order_index: projects.length });
    setModalOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    reset({
      title:            project.title,
      description:      project.description,
      long_description: project.long_description ?? "",
      tech_stack:       project.tech_stack.join(", "),
      category:         project.category,
      image_url:        project.image_url ?? "",
      live_url:         project.live_url ?? "",
      github_url:       project.github_url ?? "",
      featured:         project.featured,
      order_index:      project.order_index,
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (file: File, projectId: string) => {
    const supabase = createClient();
    setUploading(projectId);
    const ext  = file.name.split(".").pop();
    const path = `${projectId}/cover.${ext}`;
    const { error } = await supabase.storage
      .from("projects")
      .upload(path, file, { upsert: true });
    if (error) { toast.error("Upload failed"); setUploading(null); return; }
    const { data: url } = supabase.storage.from("projects").getPublicUrl(path);
    await supabase.from("projects").update({ image_url: url.publicUrl, updated_at: new Date().toISOString() }).eq("id", projectId);
    toast.success("Image uploaded!");
    setUploading(null);
    fetchProjects();
  };

  const onSubmit = async (data: ProjectFormData) => {
    const supabase = createClient();
    const payload = {
      ...data,
      tech_stack: data.tech_stack.split(",").map((t) => t.trim()).filter(Boolean),
      image_url:  data.image_url  || null,
      live_url:   data.live_url   || null,
      github_url: data.github_url || null,
    };

    if (editing) {
      const { error } = await supabase
        .from("projects")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", editing.id);
      if (error) { toast.error("Failed to update project"); return; }
      toast.success("Project updated!");
    } else {
      const { error } = await supabase.from("projects").insert(payload);
      if (error) { toast.error("Failed to create project"); return; }
      toast.success("Project created!");
    }

    setModalOpen(false);
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    setDeleting(id);
    const supabase = createClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); }
    else { toast.success("Project deleted"); fetchProjects(); }
    setDeleting(null);
  };

  return (
    <>
      <AdminHeader title="Projects" subtitle="Manage your portfolio projects" />

      <main className="flex-1 p-6">
        <div className="flex justify-end mb-6">
          <Button onClick={openCreate} leftIcon={<Plus className="w-4 h-4" />}>
            Add Project
          </Button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {projects.map((project) => (
              <div key={project.id} className="card-premium rounded-2xl overflow-hidden flex flex-col gap-0">
                {/* Image thumbnail */}
                <div className="relative h-36 bg-gradient-to-br from-brand-500/20 to-accent-500/20 flex items-center justify-center overflow-hidden">
                  {project.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                  )}
                  {/* Upload overlay */}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-colors cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, project.id);
                      }}
                    />
                    {uploading === project.id ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-white">
                        <Upload className="w-5 h-5" />
                        <span className="text-xs font-medium">{project.image_url ? "Replace" : "Upload"}</span>
                      </div>
                    )}
                  </label>
                </div>

                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white truncate">{project.title}</h3>
                      <Badge variant="primary" className="mt-1">{project.category}</Badge>
                    </div>
                    {project.featured && <Badge variant="success">Featured</Badge>}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech_stack.slice(0, 4).map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex gap-2 flex-1">
                      {project.live_url   && <a href={project.live_url}   target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-brand-500 transition-colors"><ExternalLink className="w-3.5 h-3.5" /></a>}
                      {project.github_url && <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-brand-500 transition-colors"><Github className="w-3.5 h-3.5" /></a>}
                    </div>
                    <button onClick={() => openEdit(project)} className="p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 text-gray-500 hover:text-brand-500 transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(project.id)} disabled={deleting === project.id} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Project" : "Add New Project"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Title *" error={errors.title?.message} {...register("title")} />
          <Textarea label="Short Description *" rows={3} error={errors.description?.message} {...register("description")} />
          <Textarea label="Detailed Description" rows={4} {...register("long_description")} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Category *" placeholder="Full-Stack, SaaS, etc." error={errors.category?.message} {...register("category")} />
            <Input label="Order Index" type="number" {...register("order_index", { valueAsNumber: true })} />
          </div>
          <Input label="Tech Stack *" placeholder="React, TypeScript, Node.js" error={errors.tech_stack?.message} {...register("tech_stack")} />
          <Input label="Image URL" type="url" placeholder="https://... (or upload via card after saving)" error={errors.image_url?.message} {...register("image_url")} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Live URL" type="url" placeholder="https://..." error={errors.live_url?.message} {...register("live_url")} />
            <Input label="GitHub URL" type="url" placeholder="https://github.com/..." error={errors.github_url?.message} {...register("github_url")} />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded text-brand-500 accent-brand-500" {...register("featured")} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mark as Featured</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={isSubmitting}>{editing ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
