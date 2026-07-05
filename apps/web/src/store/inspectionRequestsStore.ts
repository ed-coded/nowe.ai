import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Client-persisted for the same reason as savedPropertiesStore.ts:
 * `inspections.property_id` has a hard NOT NULL FK to `properties(id)`,
 * which mock property IDs can't satisfy. Swap for real `inspections`
 * reads/writes once Phase 5 seeds real listings.
 */
export interface InspectionRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImageUrl: string;
  requestedDate: string;
  status: "pending" | "approved" | "rejected" | "completed";
  createdAt: string;
}

interface InspectionRequestsState {
  requests: InspectionRequest[];
  addRequest: (request: Omit<InspectionRequest, "id" | "status" | "createdAt">) => void;
}

export const useInspectionRequestsStore = create<InspectionRequestsState>()(
  persist(
    (set) => ({
      requests: [],
      addRequest: (request) =>
        set((state) => ({
          requests: [
            {
              ...request,
              id: crypto.randomUUID(),
              status: "pending",
              createdAt: new Date().toISOString(),
            },
            ...state.requests,
          ],
        })),
    }),
    { name: "nowe-inspection-requests" }
  )
);
