import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { dashboardPathForRole } from "@/lib/dashboard-path";
import type { UserRole } from "@/types/auth";

/**
 * Edge gate — a fast first filter only. It redirects obviously-unauthorized
 * requests before any rendering happens, but is never the sole enforcement
 * layer: every gated page/Server Action/Route Handler re-checks the role
 * itself via requireRole() (services/auth/requireRole.ts), and RLS enforces
 * it again at the database layer. The admin portal also requires a separate
 * passphrase-gate cookie, verified at the page level (services/auth/adminGate.ts)
 * where Node's crypto module is available — this file intentionally does
 * NOT check that cookie's signature, since middleware runs on the Edge
 * runtime.
 */

const ADMIN_PATH_PREFIX = "/noweadmin";
const ADMIN_LOGIN_PATH = "/noweadmin/login";
// Only the agent DASHBOARD is gated — /agent, /agent/signup, and
// /agent/signin are the public agent-facing marketing/auth pages and must
// stay reachable by anyone.
const AGENT_DASHBOARD_PATH_PREFIX = "/agent/dashboard";
const AGENT_SIGNIN_PATH = "/agent/signin";
const USER_PATH_PREFIX = "/dashboard";

export async function proxy(request: NextRequest) {
  const { response, user, supabase } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isAdminPath =
    pathname === ADMIN_PATH_PREFIX || pathname.startsWith(`${ADMIN_PATH_PREFIX}/`);
  const isAdminLoginPath = pathname === ADMIN_LOGIN_PATH;
  const isAgentDashboardPath =
    pathname === AGENT_DASHBOARD_PATH_PREFIX ||
    pathname.startsWith(`${AGENT_DASHBOARD_PATH_PREFIX}/`);
  const isUserPath =
    pathname === USER_PATH_PREFIX || pathname.startsWith(`${USER_PATH_PREFIX}/`);

  if (isAdminPath && !isAdminLoginPath) {
    if (!user) {
      return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
    }

    const role = await getRole(supabase, user.id);

    // No resolvable profile at all (e.g. missing `profiles` row) — treat
    // like unauthenticated rather than defaulting to "user", which would
    // redirect to /dashboard, re-run this same lookup on a different path,
    // and eventually loop back through a gate that fails identically.
    if (!role) {
      return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
    }

    // Signed in but not an admin: silently send them to their own
    // dashboard rather than a 403 — the admin portal's existence is meant
    // to stay undiscoverable, and a 403 would confirm something gated
    // lives at this path.
    if (role !== "admin") {
      return NextResponse.redirect(new URL(dashboardPathForRole(role), request.url));
    }
  }

  if (isAgentDashboardPath) {
    if (!user) {
      return NextResponse.redirect(new URL(AGENT_SIGNIN_PATH, request.url));
    }

    const role = await getRole(supabase, user.id);

    if (!role) {
      return NextResponse.redirect(new URL(AGENT_SIGNIN_PATH, request.url));
    }

    if (role !== "agent") {
      return NextResponse.redirect(new URL(dashboardPathForRole(role), request.url));
    }
  }

  if (isUserPath) {
    if (!user) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    const role = await getRole(supabase, user.id);

    if (!role) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    if (role !== "user" && role !== "landlord") {
      return NextResponse.redirect(new URL(dashboardPathForRole(role), request.url));
    }
  }

  return response;
}

async function getRole(
  supabase: Awaited<ReturnType<typeof updateSession>>["supabase"],
  userId: string
): Promise<UserRole | null> {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  return (data?.role as UserRole | undefined) ?? null;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
