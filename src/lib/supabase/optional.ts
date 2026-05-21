import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function tryCreateSupabaseBrowserClient(): SupabaseClient<Database> | null {
  try {
    return createSupabaseBrowserClient() as unknown as SupabaseClient<Database>;
  } catch {
    return null;
  }
}
