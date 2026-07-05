"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * Real `conversations`/`messages` tables (Phase 2 schema) — unlike
 * favorites/inspections, `conversations.property_id` is nullable, so this
 * doesn't hit the mock-property FK conflict. Expect this to render empty in
 * practice for now: no real agent has ever started a conversation with a
 * renter yet (that flow lands with Agent CRM/Messaging, a later phase).
 */

export interface ConversationSummary {
  id: string;
  agentName: string;
  lastMessageAt: string | null;
}

export async function listConversations(): Promise<ConversationSummary[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: conversations, error } = await supabase
    .from("conversations")
    .select("id, agent_id, last_message_at")
    .eq("renter_id", user.id)
    .order("last_message_at", { ascending: false });

  if (error || !conversations || conversations.length === 0) return [];

  const agentIds = [...new Set(conversations.map((c) => c.agent_id as string))];
  const { data: agents } = await supabase.from("profiles").select("id, full_name").in("id", agentIds);

  const agentNameById = new Map((agents ?? []).map((a) => [a.id as string, a.full_name as string | null]));

  return conversations.map((c) => ({
    id: c.id as string,
    agentName: agentNameById.get(c.agent_id as string) ?? "Agent",
    lastMessageAt: c.last_message_at as string | null,
  }));
}
