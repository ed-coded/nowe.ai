/**
 * SIMULATED search — replace with real semantic search over Supabase
 * `properties` in Phase 9. Returns at most the top 5 matches, per the
 * product requirement to never overwhelm users with dozens of listings.
 */
import { mockProperties } from "./mockProperties";
import { scoreProperty, type ParsedIntent, type ScoredProperty } from "./scoreProperty";

const MAX_RESULTS = 5;

/**
 * Takes an already-parsed (and possibly multi-turn-merged) intent rather
 * than a raw query, so callers can accumulate conversational context
 * across turns before searching — see AssistantThread's cumulative intent.
 */
export async function searchProperties(
  intent: ParsedIntent,
  rawQuery: string
): Promise<ScoredProperty[]> {
  // Simulated latency so the "thinking" state in the UI reads as intentional,
  // not a glitch.
  await new Promise((resolve) => setTimeout(resolve, 500));

  return mockProperties
    .map((property) => scoreProperty(property, intent, rawQuery))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, MAX_RESULTS);
}

export function getMockPropertyById(id: string) {
  return mockProperties.find((property) => property.id === id) ?? null;
}
