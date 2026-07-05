import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getCurrentUserRole } from "./getCurrentUserRole";
import { dashboardPathForRole } from "@/lib/dashboard-path";
import type { UserRole } from "@/types/auth";

interface RequireRoleOptions {
  /** Where to send a request with no session at all. */
  unauthenticatedRedirect: string;
  /**
   * Where to send a request that IS signed in but holds the wrong role.
   * Defaults to that user's own dashboard (dashboardPathForRole) so, e.g., an
   * agent hitting /noweadmin lands on /agent instead of a dead end.
   */
  unauthorizedRedirect?: string;
}

/**
 * Server-side role gate for page.tsx / Server Actions / Route Handlers.
 * Distinguishes "not signed in" from "signed in but wrong role" so callers
 * can send each case somewhere different (e.g. the admin portal sends an
 * unauthenticated visitor to its login page, but silently redirects a
 * signed-in non-admin to their own dashboard instead of exposing a 403).
 *
 * This is the real enforcement layer — the edge gate in proxy.ts is a fast
 * first filter only, never a substitute for this check.
 */
export async function requireRole(
  allowedRoles: UserRole[],
  options: RequireRoleOptions
): Promise<UserRole> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(options.unauthenticatedRedirect);
  }

  const role = await getCurrentUserRole();

  // No resolvable profile at all (e.g. missing `profiles` row) — treat like
  // unauthenticated rather than defaulting to "user", which would redirect
  // to /dashboard and re-run this exact same failing check, looping forever.
  if (!role) {
    redirect(options.unauthenticatedRedirect);
  }

  if (!allowedRoles.includes(role)) {
    redirect(options.unauthorizedRedirect ?? dashboardPathForRole(role));
  }

  return role;
}
