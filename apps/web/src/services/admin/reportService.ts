"use server";

import { createClient } from "@/utils/supabase/server";

export type ReportStatus = "open" | "reviewing" | "resolved" | "dismissed";

export interface ReportRecord {
  id: string;
  reporterName: string;
  targetType: string;
  targetId: string;
  reason: string;
  details: string | null;
  status: ReportStatus;
  createdAt: string;
}

/** Real `reports` table — RLS ("Reporters and admins view reports") lets admins see every row. */
export async function listReports(): Promise<ReportRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reports")
    .select("id, reporter_id, target_type, target_id, reason, details, status, created_at, profiles(full_name)")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      id: row.id,
      reporterName: profile?.full_name ?? "Unknown",
      targetType: row.target_type,
      targetId: row.target_id,
      reason: row.reason,
      details: row.details,
      status: row.status as ReportStatus,
      createdAt: row.created_at,
    };
  });
}

export async function updateReportStatus(id: string, status: ReportStatus): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("reports")
    .update({
      status,
      resolved_by: status === "resolved" || status === "dismissed" ? user.id : null,
      resolved_at: status === "resolved" || status === "dismissed" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) throw new Error("Failed to update report");
}
