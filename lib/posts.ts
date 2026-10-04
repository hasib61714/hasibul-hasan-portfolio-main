import { createPublicClient } from "@/lib/supabase/public";
import type { Post } from "@/types";

export function readingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export async function getPublishedPosts(): Promise<Post[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });
  return error ? [] : ((data as Post[]) ?? []);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return error ? null : ((data as Post | null) ?? null);
}
