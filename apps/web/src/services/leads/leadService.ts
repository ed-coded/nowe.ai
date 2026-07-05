"use server";

import { createClient } from "@/utils/supabase/server";
import type { LeadStage } from "./leadStages";

/**
 * Real `leads` table (Phase 2 schema, pipeline reconciled with the CRM's
 * Kanban stages by 20260707100400_extend_leads_for_crm_pipeline.sql). RLS
 * ("Agents manage their own leads") already scopes every read/write to the
 * authenticated agent.
 *
 * `LEAD_STAGES` lives in ./leadStages.ts, not here — a "use server" file can
 * only export async functions (plus type-only exports, which are erased at
 * compile time); a plain runtime constant array isn't allowed.
 */

export interface Lead {
  id: string;
  customerName: string;
  budget: string;
  preferredLocation: string;
  lastActivityAt: string;
  nextFollowUpAt: string | null;
  stage: LeadStage;
}

export interface NewLeadInput {
  fullName: string;
  email: string | null;
  phone: string | null;
  budget: string | null;
  preferredLocation: string | null;
  source: string | null;
}

export async function listMyLeads(): Promise<Lead[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("leads")
    .select("id, full_name, budget, preferred_location, status, updated_at, next_follow_up_at")
    .eq("agent_id", user.id)
    .order("updated_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    customerName: row.full_name,
    budget: row.budget ?? "Not specified",
    preferredLocation: row.preferred_location ?? "Not specified",
    lastActivityAt: row.updated_at,
    nextFollowUpAt: row.next_follow_up_at,
    stage: row.status as LeadStage,
  }));
}

export async function moveLeadStage(id: string, stage: LeadStage): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("leads").update({ status: stage }).eq("id", id).eq("agent_id", user.id);
  if (error) throw new Error("Failed to update lead");
}

export async function createLead(input: NewLeadInput): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("leads")
    .insert({
      agent_id: user.id,
      full_name: input.fullName,
      email: input.email,
      phone: input.phone,
      budget: input.budget,
      preferred_location: input.preferredLocation,
      source: input.source ?? "Manual entry",
      status: "new",
    })
    .select("id")
    .single();

  if (error || !data) throw new Error("Failed to create lead");
  return data.id;
}
