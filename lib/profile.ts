import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { mergeProfile, type Profile, type SettingsRow } from "@/lib/profile-defaults";

/** Loads the editable profile (merged over the built-in defaults). De-duplicated per request. */
export const getProfile = cache(async (): Promise<Profile> => {
  const supabase = createPublicClient();
  if (!supabase) return mergeProfile(null);
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return mergeProfile(error ? null : (data as SettingsRow | null));
});
