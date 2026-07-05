"use server";

import { createClient } from "@/utils/supabase/server";
import { getSignedMediaUrls } from "./propertyMediaUrl";

/**
 * Real `properties`/`property_media` tables (Phase 2 schema, extended by
 * 20260707100000_extend_properties_for_listing_management.sql). RLS
 * ("Owners can manage their own listings") already scopes every mutation to
 * the authenticated agent — these functions don't re-check ownership beyond
 * filtering by owner_id, since a mismatched id simply matches zero rows.
 */

export type PropertyStatus = "draft" | "published" | "archived";

export interface AgentPropertyInput {
  title: string;
  description: string;
  propertyType: string;
  price: number;
  priceUnit: "month" | "year";
  bedrooms: number;
  bathrooms: number;
  area: number | null;
  address: string;
  city: string;
  region: string;
  neighborhood: string;
  amenities: string[];
  isFurnished: boolean;
  safetyScore: number | null;
  avgCommuteMinutes: number | null;
}

export interface PropertyMediaRecord {
  id: string;
  fileUrl: string;
  mediaType: string;
  sortOrder: number;
}

export interface AgentProperty extends AgentPropertyInput {
  id: string;
  currency: string;
  status: PropertyStatus;
  isVerified: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  media: PropertyMediaRecord[];
}

const SELECT_COLUMNS =
  "id, title, description, property_type, price, currency, price_unit, bedrooms, bathrooms, area, address, city, region, neighborhood, amenities, is_furnished, is_verified, is_featured, safety_score, avg_commute_minutes, status, created_at, updated_at, property_media(id, file_url, media_type, sort_order)";

interface PropertyRow {
  id: string;
  title: string;
  description: string | null;
  property_type: string;
  price: number;
  currency: string;
  price_unit: "month" | "year";
  bedrooms: number;
  bathrooms: number;
  area: number | null;
  address: string | null;
  city: string;
  region: string | null;
  neighborhood: string | null;
  amenities: string[];
  is_furnished: boolean;
  is_verified: boolean;
  is_featured: boolean;
  safety_score: number | null;
  avg_commute_minutes: number | null;
  status: PropertyStatus;
  created_at: string;
  updated_at: string;
  property_media: { id: string; file_url: string; media_type: string; sort_order: number }[] | null;
}

function toAgentProperty(row: PropertyRow, urlMap: Map<string, string>): AgentProperty {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    propertyType: row.property_type,
    price: row.price,
    currency: row.currency,
    priceUnit: row.price_unit,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    area: row.area,
    address: row.address ?? "",
    city: row.city,
    region: row.region ?? "",
    neighborhood: row.neighborhood ?? row.city,
    amenities: row.amenities ?? [],
    isFurnished: row.is_furnished,
    isVerified: row.is_verified,
    isFeatured: row.is_featured,
    safetyScore: row.safety_score,
    avgCommuteMinutes: row.avg_commute_minutes,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    media: (row.property_media ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((m) => ({
        id: m.id,
        fileUrl: urlMap.get(m.file_url) ?? "",
        mediaType: m.media_type,
        sortOrder: m.sort_order,
      })),
  };
}

function collectMediaPaths(rows: PropertyRow[]): string[] {
  return rows.flatMap((row) => (row.property_media ?? []).map((m) => m.file_url));
}

export async function listMyProperties(): Promise<AgentProperty[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("properties")
    .select(SELECT_COLUMNS)
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  const rows = data as unknown as PropertyRow[];
  const urlMap = await getSignedMediaUrls(collectMediaPaths(rows));
  return rows.map((row) => toAgentProperty(row, urlMap));
}

export async function getMyPropertyById(id: string): Promise<AgentProperty | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("properties")
    .select(SELECT_COLUMNS)
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (error || !data) return null;
  const row = data as unknown as PropertyRow;
  const urlMap = await getSignedMediaUrls(collectMediaPaths([row]));
  return toAgentProperty(row, urlMap);
}

export async function createProperty(input: AgentPropertyInput): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("properties")
    .insert({
      owner_id: user.id,
      title: input.title,
      description: input.description,
      property_type: input.propertyType,
      price: input.price,
      price_unit: input.priceUnit,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      area: input.area,
      address: input.address,
      city: input.city,
      region: input.region,
      neighborhood: input.neighborhood,
      amenities: input.amenities,
      is_furnished: input.isFurnished,
      safety_score: input.safetyScore,
      avg_commute_minutes: input.avgCommuteMinutes,
      status: "draft",
    })
    .select("id")
    .single();

  if (error || !data) throw new Error("Failed to create listing");
  return data.id;
}

export async function updateProperty(id: string, input: AgentPropertyInput): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("properties")
    .update({
      title: input.title,
      description: input.description,
      property_type: input.propertyType,
      price: input.price,
      price_unit: input.priceUnit,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      area: input.area,
      address: input.address,
      city: input.city,
      region: input.region,
      neighborhood: input.neighborhood,
      amenities: input.amenities,
      is_furnished: input.isFurnished,
      safety_score: input.safetyScore,
      avg_commute_minutes: input.avgCommuteMinutes,
    })
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) throw new Error("Failed to update listing");
}

export async function setPropertyStatus(id: string, status: PropertyStatus): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("properties").update({ status }).eq("id", id).eq("owner_id", user.id);
  if (error) throw new Error("Failed to update listing status");
}

export async function deleteProperty(id: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("properties").delete().eq("id", id).eq("owner_id", user.id);
  if (error) throw new Error("Failed to delete listing");
}

export async function deletePropertyMedia(mediaId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("property_media").delete().eq("id", mediaId);
  if (error) throw new Error("Failed to remove media");
}
