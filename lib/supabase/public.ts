import { createClient } from "@supabase/supabase-js";

/**
 * Cookie-less anon client for reading public content on the server.
 * Returns null when Supabase isn't configured so callers can fall back to seed data.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
