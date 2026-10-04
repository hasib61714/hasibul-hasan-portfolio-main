import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Admin = a signed-in user listed in `public.admin_users` (see supabase/schema.sql).
 * The same `is_admin()` function backs every RLS policy, so the UI guard and the
 * database always agree about who may write.
 */
export async function isAdmin(supabase: SupabaseClient): Promise<boolean> {
  const { data, error } = await supabase.rpc("is_admin");
  return !error && data === true;
}
