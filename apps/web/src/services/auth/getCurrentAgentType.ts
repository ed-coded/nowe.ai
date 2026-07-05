import { cache } from "react";
import { createClient } from "@/utils/supabase/server";
import type { AgentType } from "@/types/auth";

/**
 * Reads the current agent's `profiles.agent_type` (real_estate_agent /
 * landlord / developer) — used only to tailor which CRM nav items/pages are
 * shown, never as an authorization boundary. The `agent` role gate
 * (requireRole) already enforces access to /agent/dashboard/*; this is
 * read-only personalization on top of that, memoized per-request like
 * getCurrentUserRole.
 */
export const getCurrentAgentType = cache(async (): Promise<AgentType | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("agent_type")
    .eq("id", user.id)
    .single();

  if (error || !data) return null;

  return (data.agent_type as AgentType | null) ?? null;
});
