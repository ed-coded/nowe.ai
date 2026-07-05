"use server";

import { createClient } from "@/utils/supabase/server";
import type { UserRole } from "@/types/auth";

/**
 * Admin-only user/agent directory. RLS ("Users can view all profiles")
 * already permits reading every row; role changes go through
 * admin_set_user_role() (Phase 3 RPC) rather than a direct UPDATE, since
 * profiles.role is hardened against direct writes by
 * prevent_profiles_role_update.
 */

export interface AdminProfileRecord {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
  agentType: string | null;
  createdAt: string;
}

export async function listAllProfiles(): Promise<AdminProfileRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, agent_type, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role as UserRole,
    agentType: row.agent_type,
    createdAt: row.created_at,
  }));
}

/** Deliberately only permits 'user' <-> 'agent' — granting 'admin' isn't exposed through this simple UI. */
export async function setUserRole(targetId: string, role: "user" | "agent"): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_set_user_role", { target_id: targetId, new_role: role });
  if (error) throw new Error("Failed to update role");
}
