"use server";

import { createClient } from "@/utils/supabase/server";

export interface AnnouncementRecord {
  id: string;
  title: string;
  body: string;
  audience: string;
  publishedAt: string | null;
  createdAt: string;
}

/** Real `announcements` table — RLS ("Admins manage announcements") gives admins full CRUD, including drafts. */
export async function listAnnouncements(): Promise<AnnouncementRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("id, title, body, audience, published_at, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    body: row.body,
    audience: row.audience,
    publishedAt: row.published_at,
    createdAt: row.created_at,
  }));
}

export async function createAnnouncement(input: { title: string; body: string; audience: string }): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("announcements").insert({
    title: input.title,
    body: input.body,
    audience: input.audience,
    created_by: user.id,
  });

  if (error) throw new Error("Failed to create announcement");
}

export async function setAnnouncementPublished(id: string, published: boolean): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("announcements")
    .update({ published_at: published ? new Date().toISOString() : null })
    .eq("id", id);

  if (error) throw new Error("Failed to update announcement");
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) throw new Error("Failed to delete announcement");
}
