"use client";

import { useEffect, useState, useCallback } from "react";
import { Upload, FileText, FileCheck, Trash2, ExternalLink, CheckCircle } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import type { Document } from "@/types";

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  const fetchDocs = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("documents").select("*").order("updated_at", { ascending: false });
    setDocuments(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const handleUpload = async (file: File, type: "cv" | "cover_letter") => {
    const supabase = createClient();
    setUploading(type);

    const ext  = file.name.split(".").pop();
    const path = `${type}/latest.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast.error("Upload failed: " + uploadError.message);
      setUploading(null);
      return;
    }

    const { data: urlData } = supabase.storage.from("documents").getPublicUrl(path);
    const fileUrl = urlData.publicUrl;

    // Deactivate previous docs of same type
    await supabase.from("documents").update({ is_active: false }).eq("type", type);

    // Insert new doc record
    const { error: dbError } = await supabase.from("documents").insert({
      type,
      title:     type === "cv" ? "Curriculum Vitae" : "Cover Letter",
      file_url:  fileUrl,
      file_name: file.name,
      is_active: true,
    });

    if (dbError) {
      toast.error("Failed to save document record");
    } else {
      toast.success(`${type === "cv" ? "CV" : "Cover Letter"} uploaded successfully!`);
      fetchDocs();
    }
    setUploading(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this document?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("documents").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else { toast.success("Deleted"); fetchDocs(); }
  };

  const setActive = async (id: string, type: string) => {
    const supabase = createClient();
    await supabase.from("documents").update({ is_active: false }).eq("type", type);
    await supabase.from("documents").update({ is_active: true }).eq("id", id);
    toast.success("Document set as active");
    fetchDocs();
  };

  const cv           = documents.filter((d) => d.type === "cv");
  const coverLetters = documents.filter((d) => d.type === "cover_letter");

  const UploadCard = ({ type, title, icon: Icon, color }: { type: "cv" | "cover_letter"; title: string; icon: typeof FileText; color: string }) => (
    <div className="card-premium rounded-2xl p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-600 transition-colors">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Upload a PDF file (max 10MB)
      </p>
      <label className="cursor-pointer block">
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file, type);
          }}
        />
        <Button
          type="button"
          variant="outline"
          className="w-full pointer-events-none"
          isLoading={uploading === type}
          leftIcon={<Upload className="w-4 h-4" />}
        >
          {uploading === type ? "Uploading..." : "Choose File"}
        </Button>
      </label>
    </div>
  );

  const DocList = ({ docs, type }: { docs: Document[]; type: string }) => (
    <div className="space-y-3">
      {docs.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
          No {type === "cv" ? "CV" : "cover letter"} uploaded yet
        </p>
      ) : (
        docs.map((doc) => (
          <div key={doc.id} className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${doc.is_active ? "bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800" : "bg-gray-50 dark:bg-gray-800/50"}`}>
            <FileText className={`w-5 h-5 flex-shrink-0 ${doc.is_active ? "text-brand-500" : "text-gray-400"}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{doc.file_name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Uploaded: {formatDate(doc.updated_at)}</p>
            </div>
            {doc.is_active && (
              <span className="flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 font-medium flex-shrink-0">
                <CheckCircle className="w-3.5 h-3.5" /> Active
              </span>
            )}
            <div className="flex gap-1.5">
              {!doc.is_active && (
                <button onClick={() => setActive(doc.id, doc.type)} title="Set as active" className="p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 text-gray-400 hover:text-brand-500 transition-colors">
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}
              <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-brand-500 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </a>
              <button onClick={() => handleDelete(doc.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <>
      <AdminHeader title="Documents" subtitle="Manage your CV and cover letter" />

      <main className="flex-1 p-6">
        {/* Upload cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <UploadCard type="cv"           title="Upload CV"           icon={FileText}  color="from-brand-500 to-brand-600"   />
          <UploadCard type="cover_letter" title="Upload Cover Letter" icon={FileCheck} color="from-accent-500 to-accent-600" />
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-premium rounded-2xl p-6">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4">CV History</h2>
              <DocList docs={cv} type="cv" />
            </div>
            <div className="card-premium rounded-2xl p-6">
              <h2 className="font-bold text-gray-900 dark:text-white mb-4">Cover Letter History</h2>
              <DocList docs={coverLetters} type="cover_letter" />
            </div>
          </div>
        )}
      </main>
    </>
  );
}
