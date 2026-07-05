"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * Persists the AI assistant's conversation history to the real `chats`/
 * `chat_messages` tables (Phase 2 schema, RLS-scoped to the owning user).
 * Only the assistant's *reply content* is simulated (services/ai/*) — the
 * conversation itself is genuinely saved and resumable.
 */

export interface ChatSummary {
  id: string;
  createdAt: string;
  preview: string;
}

export interface ChatMessageRecord {
  id: string;
  chatId: string;
  senderType: "user" | "assistant";
  message: string;
  createdAt: string;
}

export async function createChat(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("chats")
    .insert({ user_id: user.id })
    .select("id")
    .single();

  if (error || !data) throw new Error("Failed to start a new search");

  return data.id;
}

export async function appendMessage(
  chatId: string,
  senderType: "user" | "assistant",
  message: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("chat_messages").insert({
    chat_id: chatId,
    sender_type: senderType,
    message,
  });

  if (error) throw new Error("Failed to save message");
}

export async function listChatMessages(chatId: string): Promise<ChatMessageRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chat_messages")
    .select("id, chat_id, sender_type, message, created_at")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    chatId: row.chat_id,
    senderType: row.sender_type as "user" | "assistant",
    message: row.message,
    createdAt: row.created_at,
  }));
}

export async function listChatHistory(): Promise<ChatSummary[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: chats, error } = await supabase
    .from("chats")
    .select("id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !chats) return [];

  return Promise.all(
    chats.map(async (chat) => {
      const { data: firstMessage } = await supabase
        .from("chat_messages")
        .select("message")
        .eq("chat_id", chat.id)
        .eq("sender_type", "user")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      return {
        id: chat.id,
        createdAt: chat.created_at,
        preview: firstMessage?.message ?? "New search",
      };
    })
  );
}

/** RLS ("Users can manage their own chats") already scopes this to the caller's own rows; chat_messages cascade-delete. */
export async function deleteChat(chatId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("chats").delete().eq("id", chatId);
  if (error) throw new Error("Failed to delete conversation");
}

/**
 * Future-ready stub for the History page's Export action — wires up the UI
 * now so a real implementation (e.g. a signed JSON/PDF download) can replace
 * just this function later with no changes to the calling page.
 */
export async function exportChatHistory(): Promise<never> {
  throw new Error("Export isn't available yet — coming in a future phase");
}
