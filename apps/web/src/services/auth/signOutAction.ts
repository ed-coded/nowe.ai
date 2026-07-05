"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ADMIN_GATE_COOKIE_NAME } from "./adminGate";

/**
 * Shared sign-out for all three dashboards. When `clearAdminGate` is set
 * (the admin dashboard's sign-out form includes it), the passphrase-gate
 * cookie is cleared too — otherwise a plain sign-in/sign-out cycle through
 * the normal /signin page would leave the gate cookie valid and let someone
 * back into /noweadmin without re-entering the passphrase.
 */
export async function signOutAction(formData: FormData) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  if (formData.get("clearAdminGate") === "true") {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_GATE_COOKIE_NAME);
  }

  redirect("/");
}
