import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ADMIN_GATE_COOKIE_NAME, isAdminGateCookieValid } from "./adminGate";

/**
 * Full server-side gate for every /noweadmin/* page: valid Supabase session,
 * profiles.role === 'admin', AND the passphrase-gate cookie set at
 * /noweadmin/login. All three in one helper so every admin page does
 * exactly one auth round trip instead of duplicating these checks.
 */
export async function requireAdminAccess() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/noweadmin/login");
  }

  const cookieStore = await cookies();
  const gateCookie = cookieStore.get(ADMIN_GATE_COOKIE_NAME)?.value;

  if (!isAdminGateCookieValid(user.id, gateCookie)) {
    redirect("/noweadmin/login");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Signed in, passphrase satisfied, but not an admin: silently redirect
  // home rather than 403 — same obscurity reasoning as the edge gate.
  if (error || data?.role !== "admin") {
    redirect("/");
  }

  return { user, role: "admin" as const };
}
