/**
 * SIMULATED AI assistant — deterministic, template-based stand-in for a real
 * LLM call. Replace with an actual AI integration in Phase 9; the UI (the
 * AgentAssistantDock and anything else that calls `generate`) only depends
 * on this function's signature and return shape, not on how the text is
 * produced, so swapping the implementation later requires no UI changes.
 */

export type AssistantActionType =
  | "listing_description"
  | "improve_title"
  | "pricing_suggestion"
  | "marketing_ideas"
  | "follow_up_email"
  | "lead_summary";

export const ASSISTANT_ACTIONS: { value: AssistantActionType; label: string; placeholder: string }[] = [
  {
    value: "listing_description",
    label: "Write listing description",
    placeholder: "e.g. 2-bed apartment, East Legon, furnished, gated community",
  },
  {
    value: "improve_title",
    label: "Improve a title",
    placeholder: "Paste the current listing title",
  },
  {
    value: "pricing_suggestion",
    label: "Pricing suggestion",
    placeholder: "e.g. 2-bed, East Legon, 95m², furnished",
  },
  {
    value: "marketing_ideas",
    label: "Marketing ideas",
    placeholder: "Describe the property or campaign goal",
  },
  {
    value: "follow_up_email",
    label: "Follow-up email draft",
    placeholder: "e.g. Client viewed East Legon apartment last week",
  },
  {
    value: "lead_summary",
    label: "Lead summary",
    placeholder: "Paste notes or context about the lead",
  },
];

function summarizeInput(input: string): string {
  const trimmed = input.trim();
  return trimmed.length > 0 ? trimmed : "your property";
}

const TEMPLATES: Record<AssistantActionType, (input: string) => string> = {
  listing_description: (input) =>
    `Discover this beautifully presented home — ${summarizeInput(input)}. Thoughtfully designed for comfort and convenience, it offers easy access to shopping, dining, and transport links. Schedule a viewing today to experience it in person.`,
  improve_title: (input) =>
    `Suggested title: "Stunning ${summarizeInput(input).replace(/^the current listing title\s*/i, "") || "Home"} — Move-In Ready"`,
  pricing_suggestion: (input) =>
    `Based on comparable listings for "${summarizeInput(input)}", a competitive monthly rate would fall between GHS 2,400 and GHS 2,900 — positioning it slightly below premium East Legon units while reflecting the property's condition and amenities.`,
  marketing_ideas: (input) =>
    `A few ideas for "${summarizeInput(input)}": 1) Share a short walkthrough video on social media. 2) Highlight nearby schools and transit in the listing. 3) Offer a limited-time waived agency fee for early applicants. 4) Cross-post to renter WhatsApp/Telegram community groups.`,
  follow_up_email: (input) =>
    `Subject: Following up on your recent viewing\n\nHi there,\n\nThank you for taking the time to view the property — ${summarizeInput(input)}. I wanted to check in and see if you had any questions, or if you'd like to schedule a second visit. I'm happy to help with next steps whenever you're ready.\n\nBest regards`,
  lead_summary: (input) =>
    `Summary: ${summarizeInput(input)}. This lead shows steady engagement and a clear budget range — recommend prioritizing a follow-up call within the next 48 hours to maintain momentum.`,
};

export interface AssistantService {
  generate: (actionType: AssistantActionType, input: string) => Promise<string>;
}

export const assistantService: AssistantService = {
  generate: async (actionType, input) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return TEMPLATES[actionType](input);
  },
};
