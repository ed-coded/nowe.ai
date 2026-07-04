"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/utils/supabase/server";
import {
  ADMIN_GATE_COOKIE_MAX_AGE_SECONDS,
  ADMIN_GATE_COOKIE_NAME,
  signAdminGateCookie,
  verifyAdminPassphrase,
} from "@/services/auth/adminGate";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  passphrase: z.string().min(1),
});

export interface AdminLoginState {
  error: string | null;
}

// One generic message for every failure mode (bad credentials, wrong
// passphrase, or a non-admin account) — distinguishing them would let an
// attacker learn which part of the three-factor check they got right.
const GENERIC_ERROR = "Invalid credentials.";

export async function loginAdmin(
  _prevState: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    passphrase: formData.get("passphrase"),
  });

  if (!parsed.success) {
    return { error: GENERIC_ERROR };
  }

  const { email, password, passphrase } = parsed.data;

  const supabase = await createClient();
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (signInError || !signInData.user) {
    return { error: GENERIC_ERROR };
  }

  if (!verifyAdminPassphrase(passphrase)) {
    return { error: GENERIC_ERROR };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", signInData.user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    return { error: GENERIC_ERROR };
  }

  const cookieStore = await cookies();
  cookieStore.set(
    ADMIN_GATE_COOKIE_NAME,
    signAdminGateCookie(signInData.user.id),
    {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_GATE_COOKIE_MAX_AGE_SECONDS,
    }
  );

  redirect("/noweadmin");
}
