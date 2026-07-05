import { useInspectionRequestsStore, type InspectionRequest } from "@/store/inspectionRequestsStore";

/**
 * Formal contract over the current client-persisted inspection-requests
 * store. Swap the internals for real Supabase `inspections` reads/writes in
 * Phase 5 without touching any call site.
 */
export interface InspectionService {
  request: (input: Omit<InspectionRequest, "id" | "status" | "createdAt">) => void;
  list: () => InspectionRequest[];
}

export const inspectionService: InspectionService = {
  request: (input) => useInspectionRequestsStore.getState().addRequest(input),
  list: () => useInspectionRequestsStore.getState().requests,
};

export { useInspectionRequestsStore };
export type { InspectionRequest };
