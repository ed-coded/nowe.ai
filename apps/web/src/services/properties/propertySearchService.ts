import { searchRealProperties, getRealPropertyById, listPublishedProperties } from "@/services/ai/realPropertySearch";
import {
  parseQuery,
  mergeIntent,
  getFollowUpQuestion,
  buildRecommendationSummary,
  type ParsedIntent,
  type ScoredProperty,
} from "@/services/ai/scoreProperty";
import type { MockProperty } from "@/services/ai/mockProperties";

/**
 * Single contract for property retrieval — the UI (AssistantThread,
 * property detail page, etc.) only ever imports from this file, never
 * directly from services/ai/*. Phase 5: swapped from the mock dataset
 * (services/ai/searchProperties.ts, kept around for reference/tests) to a
 * real Supabase-backed implementation (services/ai/realPropertySearch.ts) —
 * no UI changes were needed, since both satisfy the same interface.
 */
export interface PropertySearchService {
  search: (intent: ParsedIntent, rawQuery: string) => Promise<ScoredProperty[]>;
  getById: (id: string) => Promise<MockProperty | null>;
  listPublished: () => Promise<MockProperty[]>;
}

export const propertySearchService: PropertySearchService = {
  search: searchRealProperties,
  getById: getRealPropertyById,
  listPublished: listPublishedProperties,
};

export { parseQuery, mergeIntent, getFollowUpQuestion, buildRecommendationSummary };
export type { ParsedIntent, ScoredProperty, MockProperty };
