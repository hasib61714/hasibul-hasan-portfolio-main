export type UploadKind = "image" | "pdf";

const RULES: Record<UploadKind, { mimes: string[]; maxBytes: number; label: string }> = {
  image: {
    mimes: ["image/jpeg", "image/png", "image/webp"],
    maxBytes: 5 * 1024 * 1024,
    label: "JPG, PNG or WebP image up to 5 MB",
  },
  pdf: {
    mimes: ["application/pdf"],
    maxBytes: 10 * 1024 * 1024,
    label: "PDF up to 10 MB",
  },
};

const EXTENSIONS: Record<string, string> = {
  "image/jpeg":      "jpg",
  "image/png":       "png",
  "image/webp":      "webp",
  "application/pdf": "pdf",
};

async function matchesSignature(file: File): Promise<boolean> {
  const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const startsWith = (...bytes: number[]) => bytes.every((b, i) => head[i] === b);
  switch (file.type) {
    case "application/pdf": return startsWith(0x25, 0x50, 0x44, 0x46);
    case "image/png":       return startsWith(0x89, 0x50, 0x4e, 0x47);
    case "image/jpeg":      return startsWith(0xff, 0xd8, 0xff);
    case "image/webp":
      return startsWith(0x52, 0x49, 0x46, 0x46) && head[8] === 0x57 && head[9] === 0x45 && head[10] === 0x42 && head[11] === 0x50;
    default: return false;
  }
}

/** Returns an error message, or null when the file is acceptable. */
export async function validateUpload(file: File, kind: UploadKind): Promise<string | null> {
  const rule = RULES[kind];
  if (!rule.mimes.includes(file.type)) return `Unsupported file type. Use a ${rule.label}.`;
  if (file.size > rule.maxBytes) return `File is too large. Use a ${rule.label}.`;
  if (!(await matchesSignature(file))) return "File content does not match its type.";
  return null;
}

/** Collision-free storage path; the extension comes from the verified MIME type, never the file name. */
export function buildStoragePath(folder: string, file: File): string {
  const ext = EXTENSIONS[file.type] ?? "bin";
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().slice(0, 8)
    : Math.random().toString(36).slice(2, 10);
  return `${folder}/${Date.now()}-${id}.${ext}`;
}

/** Extracts the object path from a public storage URL so replaced/deleted files can be cleaned up. */
export function storagePathFromUrl(url: string | null | undefined, bucket: string): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length).split("?")[0]);
}
