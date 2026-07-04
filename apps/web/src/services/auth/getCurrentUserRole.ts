import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import type { UserRole } from "@/types/auth";

/**
 * Reads the current request's authenticated user's role from `profiles`.
 * Memoized per-request via React `cache()` so multiple call sites (layout,
 * page, nested Server Components) share one DB round trip instead of one
 * each. Server Component / Server Action / Route Handler use only — relies
 * on utils/supabase/server.ts's cookie-based client, not valid in
 * middleware (see proxy.ts for the edge-compatible equivalent).
 */
export const getCurrentUserRole = cache(async (): Promise<UserRole | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !data) return null;

  return data.role as UserRole;
});
