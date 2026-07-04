import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { serverEnv } from "@/lib/env.server";

/**
 * Second-factor "vault door" for the admin portal, on top of normal
 * Supabase auth + role RBAC. Without this, anyone who already holds valid
 * admin credentials via the ordinary /signin page could navigate straight
 * to /noweadmin — the passphrase must be entered specifically at
 * /noweadmin/login before the gate cookie below is ever set.
 *
 * The cookie value is an HMAC of the user's id keyed by the passphrase
 * itself (never a bare boolean flag), so it can't be copy-pasted onto a
 * different account and can't be forged without knowing the passphrase.
 */

export const ADMIN_GATE_COOKIE_NAME = "nowe_admin_gate";
export const ADMIN_GATE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function sign(userId: string): string {
  return createHmac("sha256", serverEnv.ADMIN_ACCESS_PASSPHRASE)
    .update(userId)
    .digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

/** Verifies the passphrase entered at /noweadmin/login. */
export function verifyAdminPassphrase(input: string): boolean {
  return safeEqual(serverEnv.ADMIN_ACCESS_PASSPHRASE, input);
}

/** Value to store in the gate cookie after a successful passphrase check. */
export function signAdminGateCookie(userId: string): string {
  return sign(userId);
}

/** Verifies an existing gate cookie belongs to this specific user. */
export function isAdminGateCookieValid(
  userId: string,
  cookieValue: string | undefined
): boolean {
  if (!cookieValue) return false;
  return safeEqual(sign(userId), cookieValue);
}
