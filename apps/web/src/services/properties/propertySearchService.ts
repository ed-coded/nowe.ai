import { searchProperties, getMockPropertyById } from "@/services/ai/searchProperties";
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
 * directly from services/ai/*. Swapping `propertySearchService` for a
 * Supabase-backed implementation in Phase 5 requires no UI changes, since
 * both implementations satisfy the same interface.
 */
export interface PropertySearchService {
  search: (intent: ParsedIntent, rawQuery: string) => Promise<ScoredProperty[]>;
  getById: (id: string) => Promise<MockProperty | null>;
}

/** Current mock implementation, wrapping the existing (unchanged) scoring logic. */
export const propertySearchService: PropertySearchService = {
  search: searchProperties,
  getById: async (id) => getMockPropertyById(id),
};

export { parseQuery, mergeIntent, getFollowUpQuestion, buildRecommendationSummary };
export type { ParsedIntent, ScoredProperty, MockProperty };
