"use server";

import { createClient } from "@/utils/supabase/server";
import { scoreProperty, type ParsedIntent, type ScoredProperty } from "./scoreProperty";
import type { MockProperty } from "./mockProperties";
import { getSignedMediaUrls } from "@/services/properties/propertyMediaUrl";

/**
 * Phase 5 replacement for services/ai/searchProperties.ts — same
 * SIMULATED ranking (scoreProperty is still a deterministic stand-in for
 * real AI/search-ranking, see scoreProperty.ts), but the property DATA is
 * now real: published rows from `properties`/`property_media` instead of
 * the hardcoded mock dataset. This is the swap the whole
 * PropertySearchService interface was built for — propertySearchService.ts
 * is the only file that needed to change to point here instead of the mock.
 */

const MAX_RESULTS = 5;
const DEFAULT_SAFETY_SCORE = 70;
const DEFAULT_COMMUTE_MINUTES = 25;

const SELECT_COLUMNS =
  "id, title, description, price, currency, price_unit, bedrooms, bathrooms, area, address, city, region, neighborhood, amenities, is_furnished, is_verified, safety_score, avg_commute_minutes, created_at, owner_id, profiles(full_name), property_media(file_url, sort_order)";

interface PublishedPropertyRow {
  id: string;
  title: string;
  description: string | null;
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
  safety_score: number | null;
  avg_commute_minutes: number | null;
  created_at: string;
  owner_id: string;
  profiles: { full_name: string | null } | { full_name: string | null }[] | null;
  property_media: { file_url: string; sort_order: number }[] | null;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80";

function toMockProperty(row: PublishedPropertyRow, urlMap: Map<string, string>): MockProperty {
  const media = (row.property_media ?? []).slice().sort((a, b) => a.sort_order - b.sort_order);
  const ownerProfile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
  const landlordName = ownerProfile?.full_name ?? "Listing agent";
  const tags = row.is_furnished ? [...row.amenities, "Furnished"] : row.amenities;
  const resolvedImageUrl = media[0]?.file_url ? urlMap.get(media[0].file_url) : undefined;

  return {
    id: row.id,
    title: row.title,
    location: [row.region, row.city].filter(Boolean).join(", ") || row.city,
    neighborhood: row.neighborhood ?? row.city,
    price: row.price,
    priceUnit: row.price_unit,
    currency: row.currency,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    area: row.area ?? 0,
    imageUrl: resolvedImageUrl ?? FALLBACK_IMAGE,
    tags,
    isVerified: row.is_verified,
    isAIMatched: true,
    agentName: landlordName,
    agentAvatar: "",
    description: row.description ?? "",
    amenities: row.amenities,
    landlordName,
    landlordAvatar: "",
    baseSafetyScore: row.safety_score ?? DEFAULT_SAFETY_SCORE,
    baseCommuteMinutes: row.avg_commute_minutes ?? DEFAULT_COMMUTE_MINUTES,
    createdAt: row.created_at,
    ownerId: row.owner_id,
  };
}

async function fetchPublishedProperties(): Promise<MockProperty[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("properties").select(SELECT_COLUMNS).eq("status", "published");

  if (error || !data) return [];
  const rows = data as unknown as PublishedPropertyRow[];
  const paths = rows.flatMap((row) => (row.property_media ?? []).map((m) => m.file_url));
  const urlMap = await getSignedMediaUrls(paths);
  return rows.map((row) => toMockProperty(row, urlMap));
}

export async function searchRealProperties(
  intent: ParsedIntent,
  rawQuery: string
): Promise<ScoredProperty[]> {
  const properties = await fetchPublishedProperties();
  return properties
    .map((property) => scoreProperty(property, intent, rawQuery))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, MAX_RESULTS);
}

/** Plain (unscored) published-listings feed for the public /listings browse page. */
export async function listPublishedProperties(): Promise<MockProperty[]> {
  return fetchPublishedProperties();
}

export async function getRealPropertyById(id: string): Promise<MockProperty | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select(SELECT_COLUMNS)
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;
  const row = data as unknown as PublishedPropertyRow;
  const paths = (row.property_media ?? []).map((m) => m.file_url);
  const urlMap = await getSignedMediaUrls(paths);
  return toMockProperty(row, urlMap);
}
