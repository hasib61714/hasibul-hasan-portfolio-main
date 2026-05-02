"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, Upload, Award } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import type { Certificate } from "@/types";

const certSchema = z.object({
  title:          z.string().min(1),
  issuer:         z.string().min(1),
  issue_date:     z.string().min(1),
  expiry_date:    z.string().optional(),
  credential_url: z.string().url().optional().or(z.literal("")),
  description:    z.string().optional(),
});
type CertFormData = z.input<typeof certSchema>;

export default function AdminCertificatesPage() {
  const [certs,     setCerts]     = useState<Certificate[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [modalOpen,    setModalOpen]    = useState(false);
  const [editing,      setEditing]      = useState<Certificate | null>(null);
  const [uploading,    setUploading]    = useState(false);
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [pendingPdf,   setPendingPdf]   = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm<CertFormData>({ resolver: zodResolver(certSchema) });

  const fetchCerts = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("certificates").select("*").order("issue_date", { ascending: false });
    setCerts(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchCerts(); }, [fetchCerts]);

  const handleFileUpload = async (file: File, certId: string, type: "image" | "file") => {
    const supabase = createClient();
    setUploading(true);
    const ext  = file.name.split(".").pop();
    const path = `${certId}/${type}.${ext}`;
    const { error, data } = await supabase.storage
      .from("certificates")
      .upload(path, file, { upsert: true });
    if (error) { toast.error("Upload failed"); setUploading(false); return null; }
    const { data: url } = supabase.storage.from("certificates").getPublicUrl(path);
    setUploading(false);
    return url.publicUrl;
  };

  const openCreate = () => {
    setEditing(null);
    setPendingImage(null);
    setPendingPdf(null);
    reset({ issue_date: new Date().toISOString().split("T")[0] });
    setModalOpen(true);
  };

  const openEdit = (cert: Certificate) => {
    setEditing(cert);
    setPendingImage(null);
    setPendingPdf(null);
    reset({
      title: cert.title, issuer: cert.issuer,
      issue_date: cert.issue_date,
      expiry_date: cert.expiry_date ?? "",
      credential_url: cert.credential_url ?? "",
      description: cert.description ?? "",
    });
    setModalOpen(true);
  };

  const onSubmit = async (data: CertFormData) => {
    const supabase = createClient();
    const payload: Record<string, unknown> = {
      ...data,
      credential_url: data.credential_url || null,
      expiry_date:    data.expiry_date    || null,
    };

    let certId: string;
    if (editing) {
      const { error } = await supabase.from("certificates").update(payload).eq("id", editing.id);
      if (error) { toast.error("Failed to update"); return; }
      certId = editing.id;
    } else {
      const { data: inserted, error } = await supabase.from("certificates").insert(payload).select("id").single();
      if (error || !inserted) { toast.error("Failed to create"); return; }
      certId = inserted.id;
    }

    // Upload pending files
    if (pendingImage) {
      const url = await handleFileUpload(pendingImage, certId, "image");
      if (url) await supabase.from("certificates").update({ image_url: url }).eq("id", certId);
    }
    if (pendingPdf) {
      const url = await handleFileUpload(pendingPdf, certId, "file");
      if (url) await supabase.from("certificates").update({ file_url: url }).eq("id", certId);
    }

    toast.success(editing ? "Certificate updated!" : "Certificate added!");
    setModalOpen(false);
    setPendingImage(null);
    setPendingPdf(null);
    fetchCerts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this certificate?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("certificates").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else { toast.success("Deleted"); fetchCerts(); }
  };

  return (
    <>
      <AdminHeader title="Certificates" subtitle="Manage your certifications" />

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-end mb-6">
          <Button onClick={openCreate} leftIcon={<Plus className="w-4 h-4" />}>Add Certificate</Button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {certs.map((cert) => (
              <div key={cert.id} className="card-premium rounded-2xl overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center relative">
                  <Award className="w-10 h-10 text-white opacity-80" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2 mb-1">{cert.title}</h3>
                  <p className="text-xs text-brand-500 font-medium">{cert.issuer}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{cert.issue_date ? formatDate(cert.issue_date) : "—"}</p>

                  {/* File upload */}
                  <div className="mt-3 flex gap-1.5">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const url = await handleFileUpload(file, cert.id, "image");
                          if (url) {
                            const supabase = createClient();
                            await supabase.from("certificates").update({ image_url: url }).eq("id", cert.id);
                            toast.success("Image uploaded!");
                            fetchCerts();
                          }
                        }}
                      />
                      <div className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400">
                        <Upload className="w-3 h-3" />
                        Image
                      </div>
                    </label>
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const url = await handleFileUpload(file, cert.id, "file");
                          if (url) {
                            const supabase = createClient();
                            await supabase.from("certificates").update({ file_url: url }).eq("id", cert.id);
                            toast.success("PDF uploaded!");
                            fetchCerts();
                          }
                        }}
                      />
                      <div className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400">
                        <Upload className="w-3 h-3" />
                        PDF
                      </div>
                    </label>
                  </div>

                  <div className="flex gap-1.5 mt-2">
                    <button onClick={() => openEdit(cert)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium hover:bg-brand-50 dark:hover:bg-brand-900/20 text-gray-500 hover:text-brand-500 transition-colors border border-gray-200 dark:border-gray-700">
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                    <button onClick={() => handleDelete(cert.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors border border-gray-200 dark:border-gray-700">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Certificate" : "Add Certificate"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Certificate Title *" error={errors.title?.message} {...register("title")} />
          <Input label="Issuing Organization *" placeholder="AWS, Google, etc." error={errors.issuer?.message} {...register("issuer")} />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Issue Date *" type="date" error={errors.issue_date?.message} {...register("issue_date")} />
            <Input label="Expiry Date" type="date" {...register("expiry_date")} />
          </div>
          <Input label="Credential URL" type="url" placeholder="https://..." error={errors.credential_url?.message} {...register("credential_url")} />
          <Input label="Description" placeholder="Brief description..." {...register("description")} />

          {/* File uploads */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Certificate Image</p>
              <label className="cursor-pointer block">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setPendingImage(e.target.files?.[0] ?? null)} />
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 hover:border-brand-400 dark:hover:border-brand-500 transition-colors text-sm text-gray-500 dark:text-gray-400">
                  <Upload className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{pendingImage ? pendingImage.name : "Choose image..."}</span>
                </div>
              </label>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">PDF Certificate</p>
              <label className="cursor-pointer block">
                <input type="file" accept=".pdf" className="hidden" onChange={(e) => setPendingPdf(e.target.files?.[0] ?? null)} />
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 hover:border-brand-400 dark:hover:border-brand-500 transition-colors text-sm text-gray-500 dark:text-gray-400">
                  <Upload className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{pendingPdf ? pendingPdf.name : "Choose PDF..."}</span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" isLoading={isSubmitting || uploading}>{editing ? "Update" : "Add"}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
