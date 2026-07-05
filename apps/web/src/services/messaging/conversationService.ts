"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * Real `conversations`/`messages` tables (Phase 2 schema). RLS
 * ("Participants manage their own conversations" / "...send messages in
 * their own conversations") scopes every read/write to the two participants.
 * `touch_conversation_on_message` (DB trigger) keeps `last_message_at`
 * current automatically on every insert.
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

export interface AgentConversationSummary {
  id: string;
  renterName: string;
  lastMessageAt: string | null;
}

/** Agent-side mirror of listConversations() — same real tables, filtered by agent_id instead of renter_id. */
export async function listAgentConversations(): Promise<AgentConversationSummary[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: conversations, error } = await supabase
    .from("conversations")
    .select("id, renter_id, last_message_at")
    .eq("agent_id", user.id)
    .order("last_message_at", { ascending: false });

  if (error || !conversations || conversations.length === 0) return [];

  const renterIds = [...new Set(conversations.map((c) => c.renter_id as string))];
  const { data: renters } = await supabase.from("profiles").select("id, full_name").in("id", renterIds);

  const renterNameById = new Map((renters ?? []).map((r) => [r.id as string, r.full_name as string | null]));

  return conversations.map((c) => ({
    id: c.id as string,
    renterName: renterNameById.get(c.renter_id as string) ?? "Renter",
    lastMessageAt: c.last_message_at as string | null,
  }));
}

export interface MessageRecord {
  id: string;
  senderId: string;
  body: string;
  createdAt: string;
  isMine: boolean;
}

/** Renter-initiated — called from a property's detail page to message its owning agent. */
export async function getOrCreateConversation(agentId: string, propertyId: string): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("renter_id", user.id)
    .eq("agent_id", agentId)
    .eq("property_id", propertyId)
    .maybeSingle();

  if (existing) return existing.id;

  const { data, error } = await supabase
    .from("conversations")
    .insert({ renter_id: user.id, agent_id: agentId, property_id: propertyId })
    .select("id")
    .single();

  if (error || !data) throw new Error("Failed to start conversation");
  return data.id;
}

export async function listMessages(conversationId: string): Promise<MessageRecord[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("messages")
    .select("id, sender_id, body, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return data.map((m) => ({
    id: m.id,
    senderId: m.sender_id,
    body: m.body,
    createdAt: m.created_at,
    isMine: m.sender_id === user.id,
  }));
}

export async function sendMessage(conversationId: string, body: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("messages")
    .insert({ conversation_id: conversationId, sender_id: user.id, body });

  if (error) throw new Error("Failed to send message");
}

export async function markConversationRead(conversationId: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .neq("sender_id", user.id)
    .is("read_at", null);
}
