export type LeadStage = "new" | "contacted" | "interested" | "negotiating" | "closed" | "lost";

export const LEAD_STAGES: { value: LeadStage; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "interested", label: "Interested" },
  { value: "negotiating", label: "Negotiating" },
  { value: "closed", label: "Closed" },
  { value: "lost", label: "Lost" },
];
