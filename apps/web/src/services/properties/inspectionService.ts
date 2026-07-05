"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * Real `inspections` table (Phase 2 schema, renamed from `bookings`). RLS
 * ("Users can view/create their own inspections", "Users or property owners
 * can update inspection status") already scopes reads/writes to the
 * requesting renter or the property's owning agent.
 */

export type InspectionStatus = "pending" | "approved" | "rejected" | "completed";

export interface InspectionRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImageUrl: string;
  requestedDate: string;
  status: InspectionStatus;
  createdAt: string;
}

export async function requestInspection(input: { propertyId: string; requestedDate: string }): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("inspections").insert({
    user_id: user.id,
    property_id: input.propertyId,
    booking_date: input.requestedDate,
    status: "pending",
  });

  if (error) throw new Error("Failed to request inspection");
}

export async function listMyInspections(): Promise<InspectionRequest[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("inspections")
    .select("id, property_id, booking_date, status, created_at, properties(title, property_media(file_url, sort_order))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => {
    const property = Array.isArray(row.properties) ? row.properties[0] : row.properties;
    const media = (property?.property_media ?? []).slice().sort((a, b) => a.sort_order - b.sort_order);
    return {
      id: row.id,
      propertyId: row.property_id,
      propertyTitle: property?.title ?? "Property",
      propertyImageUrl: media[0]?.file_url ?? "",
      requestedDate: row.booking_date,
      status: row.status as InspectionStatus,
      createdAt: row.created_at,
    };
  });
}

export interface AgentInspectionRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  renterName: string;
  requestedDate: string;
  status: InspectionStatus;
  createdAt: string;
}

/** Agent-side — inspections requested on any property this agent owns. */
export async function listInspectionsForMyProperties(): Promise<AgentInspectionRequest[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("inspections")
    .select("id, property_id, booking_date, status, created_at, user_id, properties!inner(title, owner_id)")
    .eq("properties.owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  const renterIds = [...new Set(data.map((row) => row.user_id))];
  const { data: renters } = await supabase.from("profiles").select("id, full_name").in("id", renterIds);
  const renterNameById = new Map((renters ?? []).map((r) => [r.id, r.full_name]));

  return data.map((row) => {
    const property = Array.isArray(row.properties) ? row.properties[0] : row.properties;
    return {
      id: row.id,
      propertyId: row.property_id,
      propertyTitle: property?.title ?? "Property",
      renterName: renterNameById.get(row.user_id) ?? "Renter",
      requestedDate: row.booking_date,
      status: row.status as InspectionStatus,
      createdAt: row.created_at,
    };
  });
}

export async function updateInspectionStatus(id: string, status: InspectionStatus): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("inspections").update({ status }).eq("id", id);
  if (error) throw new Error("Failed to update inspection status");
}
