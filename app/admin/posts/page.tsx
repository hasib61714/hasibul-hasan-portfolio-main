"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Eye, EyeOff, ImagePlus, Pencil, PenLine, Plus, Trash2, Upload } from "lucide-react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { createClient } from "@/lib/supabase/client";
import { buildStoragePath, storagePathFromUrl, validateUpload } from "@/lib/upload";
import { formatDate, safeUrl, slugify } from "@/lib/utils";
import type { Post } from "@/types";

interface Form {
  title: string;
  slug: string;
  excerpt: string;
  tags: string;
  content: string;
  cover_url: string;
  published: boolean;
}

const EMPTY: Form = { title: "", slug: "", excerpt: "", tags: "", content: "", cover_url: "", published: false };

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [preview, setPreview] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const load = useCallback(async () => {
    const { data, error } = await createClient().from("posts").select("*").order("created_at", { ascending: false });
    if (error) toast.error("Failed to load posts: " + error.message);
    setPosts((data as Post[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const update = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => ({ ...f, [key]: value }));

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setSlugTouched(false);
    setPreview(false);
    setErrors({});
    setOpen(true);
  };

  const openEdit = (post: Post) => {
    setEditing(post);
    setForm({
      title: post.title, slug: post.slug, excerpt: post.excerpt ?? "", tags: post.tags.join(", "),
      content: post.content, cover_url: post.cover_url ?? "", published: post.published,
    });
    setSlugTouched(true);
    setPreview(false);
    setErrors({});
    setOpen(true);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const problem = await validateUpload(file, "image");
    if (problem) { toast.error(problem); return null; }
    setUploading(true);
    const supabase = createClient();
    const path = buildStoragePath("posts", file);
    const { error } = await supabase.storage.from("blog").upload(path, file, { contentType: file.type });
    setUploading(false);
    if (error) { toast.error("Upload failed: " + error.message); return null; }
    return supabase.storage.from("blog").getPublicUrl(path).data.publicUrl;
  };

  const onCover = async (file?: File) => {
    if (!file) return;
    const url = await uploadImage(file);
    if (url) update("cover_url", url);
  };

  const onInlineImage = async (file?: File) => {
    if (!file) return;
    const url = await uploadImage(file);
    if (!url) return;
    const el = contentRef.current;
    const snippet = `\n\n![${file.name.replace(/\.[^.]+$/, "")}](${url})\n\n`;
    const pos = el?.selectionStart ?? form.content.length;
    update("content", form.content.slice(0, pos) + snippet + form.content.slice(pos));
    toast.success("Image inserted into the post");
  };

  const validate = () => {
    const next: typeof errors = {};
    if (!form.title.trim()) next.title = "Title is required";
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(form.slug)) next.slug = "Use lowercase letters, numbers and single hyphens";
    if (form.cover_url.trim() && !/^https?:\/\/\S+$/i.test(form.cover_url.trim())) next.cover_url = "Must be a valid http(s) URL";
    if (form.published && !form.content.trim()) next.content = "Write some content before publishing";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      slug: form.slug,
      excerpt: form.excerpt.trim() || null,
      content: form.content,
      cover_url: form.cover_url.trim() || null,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      published: form.published,
      published_at: form.published ? editing?.published_at ?? new Date().toISOString() : null,
    };
    const supabase = createClient();
    const { error } = editing
      ? await supabase.from("posts").update(payload).eq("id", editing.id)
      : await supabase.from("posts").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.code === "23505" ? "That URL slug is already used by another post" : "Failed to save: " + error.message);
      return;
    }
    toast.success(form.published ? "Post published" : "Draft saved");
    setOpen(false);
    load();
  };

  const remove = async (post: Post) => {
    if (!confirm(`Delete “${post.title}”?`)) return;
    const supabase = createClient();
    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    if (error) { toast.error("Failed to delete"); return; }
    const cover = storagePathFromUrl(post.cover_url, "blog");
    if (cover) await supabase.storage.from("blog").remove([cover]);
    toast.success("Post deleted");
    load();
  };

  const togglePublish = async (post: Post) => {
    const publish = !post.published;
    const { error } = await createClient()
      .from("posts")
      .update({ published: publish, published_at: publish ? post.published_at ?? new Date().toISOString() : null })
      .eq("id", post.id);
    if (error) toast.error("Failed to update");
    else { toast.success(publish ? "Published" : "Moved to drafts"); load(); }
  };

  const cover = safeUrl(form.cover_url);

  return (
    <>
      <AdminHeader title="Blog" subtitle="Write posts in Markdown — drafts stay private until you publish" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex justify-end">
          <Button onClick={openCreate} leftIcon={<Plus className="h-4 w-4" />}>New post</Button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : posts.length === 0 ? (
          <EmptyState icon={PenLine} title="No posts yet" description="Click “New post” to write your first article." />
        ) : (
          <ul className="space-y-3">
            {posts.map((post) => (
              <li key={post.id} className="card-premium flex flex-wrap items-center gap-4 rounded-2xl p-5">
                <div className="relative z-10 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-gray-900 dark:text-white">{post.title}</p>
                    <Badge variant={post.published ? "success" : "warning"}>{post.published ? "Published" : "Draft"}</Badge>
                  </div>
                  <p className="mt-0.5 font-mono text-xs text-gray-500">/blog/{post.slug} · {formatDate(post.published_at ?? post.created_at)}</p>
                </div>
                <div className="relative z-10 flex gap-1.5">
                  <button onClick={() => togglePublish(post)} aria-label={post.published ? "Unpublish" : "Publish"} className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:text-brand-500 dark:border-white/10">
                    {post.published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                  <button onClick={() => openEdit(post)} aria-label="Edit" className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:text-brand-500 dark:border-white/10"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => remove(post)} aria-label="Delete" className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:text-red-500 dark:border-white/10"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={editing ? "Edit post" : "New post"} size="xl">
        <form onSubmit={save} noValidate className="space-y-4">
          <Input
            label="Title *"
            value={form.title}
            error={errors.title}
            onChange={(e) => {
              update("title", e.target.value);
              if (!slugTouched) update("slug", slugify(e.target.value));
            }}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="URL slug *" value={form.slug} error={errors.slug} onChange={(e) => { setSlugTouched(true); update("slug", e.target.value); }} />
            <Input label="Tags" value={form.tags} placeholder="nextjs, supabase, ml" onChange={(e) => update("tags", e.target.value)} />
          </div>
          <Textarea label="Excerpt (shown in lists and search results)" rows={2} value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} />

          <div>
            <p className="mb-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">Cover image</p>
            <div className="flex flex-wrap items-center gap-3">
              {cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cover} alt="Cover preview" className="h-16 w-28 rounded-lg border border-gray-200 object-cover dark:border-white/10" />
              )}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600 hover:border-brand-400 dark:border-white/20 dark:text-gray-400">
                <Upload className="h-4 w-4" /> {uploading ? "Uploading…" : "Upload cover"}
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={uploading}
                  onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; onCover(f); }} />
              </label>
              {form.cover_url && <button type="button" onClick={() => update("cover_url", "")} className="text-xs text-red-500">Remove</button>}
            </div>
            {errors.cover_url && <p className="mt-1 text-xs text-red-500">{errors.cover_url}</p>}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Content (Markdown)</p>
              <div className="flex items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:text-brand-500 dark:border-white/10 dark:text-gray-400">
                  <ImagePlus className="h-3.5 w-3.5" /> Insert image
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={uploading}
                    onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; onInlineImage(f); }} />
                </label>
                <div className="inline-flex overflow-hidden rounded-lg border border-gray-200 text-xs dark:border-white/10" role="group" aria-label="Editor mode">
                  <button type="button" onClick={() => setPreview(false)} aria-pressed={!preview} className={`px-3 py-1 ${!preview ? "bg-brand-500 text-white" : "text-gray-600 dark:text-gray-400"}`}>Write</button>
                  <button type="button" onClick={() => setPreview(true)} aria-pressed={preview} className={`px-3 py-1 ${preview ? "bg-brand-500 text-white" : "text-gray-600 dark:text-gray-400"}`}>Preview</button>
                </div>
              </div>
            </div>
            {preview ? (
              <div className="max-h-[28rem] min-h-[16rem] overflow-y-auto rounded-xl border border-gray-200 bg-white p-5 text-sm dark:border-white/10 dark:bg-white/[0.03]">
                <div className="prose-preview [&_a]:text-brand-500 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 dark:[&_code]:bg-white/10 [&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:mt-5 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mt-4 [&_h3]:font-bold [&_img]:my-3 [&_img]:rounded-lg [&_li]:ml-5 [&_li]:list-disc [&_p]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-gray-950 [&_pre]:p-3 [&_pre]:text-gray-100">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content || "*Nothing to preview yet.*"}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <Textarea
                ref={contentRef}
                aria-label="Post content"
                rows={14}
                value={form.content}
                error={errors.content}
                placeholder={"## A heading\n\nWrite in **Markdown**. Use the “Insert image” button to add pictures."}
                className="font-mono"
                onChange={(e) => update("content", e.target.value)}
              />
            )}
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <input type="checkbox" checked={form.published} onChange={(e) => update("published", e.target.checked)} className="h-4 w-4 accent-brand-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Published (visible on the site)</span>
          </label>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={saving || uploading}>{editing ? "Save changes" : "Create post"}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
