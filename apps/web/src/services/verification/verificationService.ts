"use server";

import { createClient } from "@/utils/supabase/server";

export type VerificationItemStatus = "verified" | "pending" | "not_started" | "unavailable";

export interface VerificationItem {
  key: string;
  label: string;
  status: VerificationItemStatus;
  detail?: string;
}

export interface VerificationSummary {
  items: VerificationItem[];
  percentComplete: number;
}

/**
 * Reads real verification signals where they exist: auth.users' email/phone
 * confirmation timestamps, and the real `verification_requests` table
 * (business_name/id_document_url/status) from Phase 2's schema. Government
 * ID and Business Registration are backed by that table; "Professional
 * License" has no backing column anywhere yet, so it's honestly reported as
 * `unavailable` rather than faked. Approval itself happens admin-side (see
 * /noweadmin/verification) — RLS already restricts the UPDATE that sets
 * status to admins only.
 */
export async function getVerificationSummary(): Promise<VerificationSummary> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const items: VerificationItem[] = [];

  if (!user) {
    return { items: [], percentComplete: 0 };
  }

  items.push({
    key: "email",
    label: "Email",
    status: user.email_confirmed_at ? "verified" : "pending",
    detail: user.email ?? undefined,
  });

  items.push({
    key: "phone",
    label: "Phone",
    status: user.phone_confirmed_at ? "verified" : user.phone ? "pending" : "not_started",
    detail: user.phone ?? undefined,
  });

  const { data: request } = await supabase
    .from("verification_requests")
    .select("business_name, id_document_url, status")
    .eq("agent_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  items.push({
    key: "government_id",
    label: "Government ID",
    status: !request
      ? "not_started"
      : !request.id_document_url
        ? "not_started"
        : request.status === "approved"
          ? "verified"
          : request.status === "rejected"
            ? "not_started"
            : "pending",
  });

  items.push({
    key: "business_registration",
    label: "Business Registration",
    status: !request
      ? "not_started"
      : !request.business_name
        ? "not_started"
        : request.status === "approved"
          ? "verified"
          : request.status === "rejected"
            ? "not_started"
            : "pending",
    detail: request?.business_name ?? undefined,
  });

  items.push({
    key: "professional_license",
    label: "Professional License",
    status: "unavailable",
    detail: "Not yet supported — coming in a later phase",
  });

  const applicable = items.filter((i) => i.status !== "unavailable");
  const verifiedCount = applicable.filter((i) => i.status === "verified").length;
  const percentComplete = applicable.length > 0 ? Math.round((verifiedCount / applicable.length) * 100) : 0;

  return { items, percentComplete };
}

export interface LatestVerificationRequest {
  status: "pending" | "approved" | "rejected";
  businessName: string | null;
  additionalInfo: string | null;
  createdAt: string;
}

export async function getMyLatestVerificationRequest(): Promise<LatestVerificationRequest | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("verification_requests")
    .select("status, business_name, additional_info, created_at")
    .eq("agent_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;
  return {
    status: data.status,
    businessName: data.business_name,
    additionalInfo: data.additional_info,
    createdAt: data.created_at,
  };
}

export async function submitVerificationRequest(input: {
  businessName: string;
  additionalInfo: string;
}): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("verification_requests").insert({
    agent_id: user.id,
    business_name: input.businessName,
    additional_info: input.additionalInfo,
    status: "pending",
  });

  if (error) throw new Error("Failed to submit verification request");
}

export interface PendingVerificationRequest {
  id: string;
  agentId: string;
  agentName: string;
  agentEmail: string;
  businessName: string | null;
  additionalInfo: string | null;
  createdAt: string;
}

/** Admin-only reads/writes — RLS ("Agents and admins view..." / "Admins review...") already scopes this. */
export async function listPendingVerificationRequests(): Promise<PendingVerificationRequest[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("verification_requests")
    .select("id, agent_id, business_name, additional_info, created_at, profiles(full_name, email)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      id: row.id,
      agentId: row.agent_id,
      agentName: profile?.full_name ?? "Unnamed agent",
      agentEmail: profile?.email ?? "",
      businessName: row.business_name,
      additionalInfo: row.additional_info,
      createdAt: row.created_at,
    };
  });
}

export async function reviewVerificationRequest(
  id: string,
  decision: "approved" | "rejected"
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("verification_requests")
    .update({ status: decision, reviewed_by: user.id, reviewed_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error("Failed to review verification request");
}
