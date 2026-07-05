/**
 * SIMULATED reasoning — a deterministic, rule-based stand-in for real
 * ranking/NLP. Replace with an actual AI/search-ranking service in Phase 9;
 * everything downstream (UI components) only depends on this function's
 * return shape (`ScoredProperty`), not on how it's computed, so swapping
 * the implementation later requires no UI changes.
 */
import type { MockProperty } from "./mockProperties";

export interface ParsedIntent {
  budgetMax?: number;
  wantsFurnished?: boolean;
  wantsSecurity?: boolean;
  neighborhood?: string;
  bedroomsMin?: number;
  wantsTransitAccess?: boolean;
  wantsGatedCommunity?: boolean;
}

/**
 * Merges a newly-parsed turn's intent into the conversation's cumulative
 * intent — later values override earlier ones for the same slot, but slots
 * not mentioned again carry over. This is how the assistant "remembers"
 * budget/neighborhood from earlier turns while still picking up new
 * constraints ("actually make it furnished").
 */
export function mergeIntent(previous: ParsedIntent, next: ParsedIntent): ParsedIntent {
  return { ...previous, ...next };
}

/** Which intent slots the follow-up-question logic can ask about, and their prompts. */
const FOLLOW_UP_PROMPTS: { slot: keyof ParsedIntent; question: string }[] = [
  { slot: "wantsFurnished", question: "Would you prefer it furnished or unfurnished?" },
  { slot: "wantsTransitAccess", question: "Is proximity to public transport important to you?" },
  { slot: "wantsGatedCommunity", question: "Would you like it to be in a gated community?" },
  { slot: "budgetMax", question: "What's your budget range for this?" },
  { slot: "neighborhood", question: "Do you have a preferred neighbourhood in mind?" },
];

/** Picks one unfilled intent slot to ask about, skipping any already asked this conversation. */
export function getFollowUpQuestion(intent: ParsedIntent, alreadyAsked: Set<string>): string | null {
  const candidate = FOLLOW_UP_PROMPTS.find(
    ({ slot }) => intent[slot] === undefined && !alreadyAsked.has(slot)
  );
  return candidate ? candidate.question : null;
}

/** Composes the short bullet reasons into one natural-language sentence. */
export function buildRecommendationSummary(reasons: string[]): string {
  if (reasons.length === 0) return "Recommended based on your search.";
  const lower = reasons.map((r) => r.charAt(0).toLowerCase() + r.slice(1));
  if (lower.length === 1) return `Recommended because it ${lower[0]}.`;
  const head = lower.slice(0, -1).join(", ");
  const tail = lower[lower.length - 1];
  return `Recommended because it ${head} and ${tail}.`;
}

export interface ScoredProperty extends MockProperty {
  matchScore: number;
  matchReasons: string[];
  safetyScore: number;
  commuteMinutes: number;
}

const NEIGHBORHOODS = [
  "east legon",
  "airport residential",
  "cantonments",
  "legon",
  "madina",
  "spintex",
  "osu",
  "labone",
  "dzorwulu",
];

export function parseQuery(query: string): ParsedIntent {
  const lower = query.toLowerCase();
  const intent: ParsedIntent = {};

  const budgetMatch = lower.match(/(?:under|below|less than|budget of)\s*(?:ghs|gh₵|₵)?\s*([\d,]+)/);
  if (budgetMatch) {
    intent.budgetMax = Number(budgetMatch[1].replace(/,/g, ""));
  }

  if (/furnish/.test(lower)) intent.wantsFurnished = true;
  else if (/unfurnish/.test(lower)) intent.wantsFurnished = false;
  if (/safe|security|secure/.test(lower)) intent.wantsSecurity = true;
  if (/transport|trotro|bus|train station/.test(lower)) intent.wantsTransitAccess = true;
  if (/gated|estate community/.test(lower)) intent.wantsGatedCommunity = true;

  const bedroomMatch = lower.match(/(\d+)\s*(?:-|\s)?bed/);
  if (bedroomMatch) intent.bedroomsMin = Number(bedroomMatch[1]);

  const neighborhood = NEIGHBORHOODS.find((n) => lower.includes(n));
  if (neighborhood) intent.neighborhood = neighborhood;

  return intent;
}

/** Deterministic pseudo-variation so the same property+query always renders the same reasons. */
function seededJitter(seed: string, range: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % range;
}

export function scoreProperty(property: MockProperty, intent: ParsedIntent, query: string): ScoredProperty {
  let score = 62;
  const reasons: string[] = [];

  const isRecent =
    Date.now() - new Date(property.createdAt).getTime() < 14 * 24 * 60 * 60 * 1000;

  if (intent.budgetMax && property.price <= intent.budgetMax) {
    score += 15;
    reasons.push("Matches your budget");
  }

  if (intent.neighborhood && property.neighborhood.toLowerCase().includes(intent.neighborhood)) {
    score += 12;
    reasons.push(`In ${property.neighborhood}`);
  }

  if (intent.wantsFurnished === true && property.tags.some((t) => t.toLowerCase().includes("furnish"))) {
    score += 10;
    reasons.push("Furnished");
  } else if (
    intent.wantsFurnished === false &&
    !property.tags.some((t) => t.toLowerCase().includes("furnish"))
  ) {
    score += 6;
    reasons.push("Unfurnished, as requested");
  }

  if (intent.wantsTransitAccess && property.baseCommuteMinutes <= 15) {
    score += 7;
    reasons.push("Well-connected to public transport");
  }

  if (
    intent.wantsGatedCommunity &&
    property.amenities.some((a) => /gated|security/i.test(a))
  ) {
    score += 7;
    reasons.push("Gated community");
  }

  if (intent.wantsSecurity && property.baseSafetyScore >= 85) {
    score += 8;
    reasons.push("Excellent safety rating");
  }

  if (intent.bedroomsMin && property.bedrooms >= intent.bedroomsMin) {
    score += 6;
    reasons.push(`${property.bedrooms} bedrooms`);
  }

  if (isRecent) {
    score += 4;
    reasons.push("Recently listed");
  }

  const commuteMinutes = property.baseCommuteMinutes + seededJitter(property.id + query, 5);
  reasons.push(`${commuteMinutes} minutes from your workplace`);

  if (reasons.length < 3) {
    if (property.isVerified && !reasons.includes("Verified listing")) {
      reasons.unshift("Verified listing");
    }
  }

  return {
    ...property,
    matchScore: Math.min(99, score),
    matchReasons: reasons.slice(0, 5),
    safetyScore: property.baseSafetyScore,
    commuteMinutes,
  };
}
