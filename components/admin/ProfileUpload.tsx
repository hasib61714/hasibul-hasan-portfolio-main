"use client";

import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export function ProfileUpload() {
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const { data } = supabase.storage.from("profile").getPublicUrl("avatar/current");
    setAvatarUrl(data.publicUrl);
  }, []);

  const handleUpload = async (file: File) => {
    const supabase = createClient();
    setUploading(true);
    setHasError(false);

    const { error } = await supabase.storage
      .from("profile")
      .upload("avatar/current", file, { upsert: true, contentType: file.type });

    if (error) {
      toast.error("Upload failed: " + error.message);
    } else {
      const { data } = supabase.storage.from("profile").getPublicUrl("avatar/current");
      setAvatarUrl(data.publicUrl + "?t=" + Date.now());
      toast.success("Profile picture updated!");
    }
    setUploading(false);
  };

  return (
    <div className="card-premium rounded-2xl p-5">
      <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
        Hero Profile Picture
      </h2>
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center ring-2 ring-brand-500/30 flex-shrink-0 text-4xl">
          {avatarUrl && !hasError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={() => setHasError(true)}
            />
          ) : (
            "👨‍💻"
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Hero section এ এই ছবি দেখাবে।
          </p>
          <label className="cursor-pointer inline-block">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all shadow-md shadow-brand-500/20 ${
                uploading
                  ? "bg-brand-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 cursor-pointer"
              }`}
            >
              {uploading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {uploading ? "Uploading..." : "Upload Photo"}
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
