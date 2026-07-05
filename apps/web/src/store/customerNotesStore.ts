import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Client-persisted notes overlay, same pattern as conversationMetaStore — additive, no schema change. */
interface CustomerNotesState {
  notes: Record<string, string>;
  setNote: (customerId: string, note: string) => void;
}

export const useCustomerNotesStore = create<CustomerNotesState>()(
  persist(
    (set, get) => ({
      notes: {},
      setNote: (customerId, note) => set({ notes: { ...get().notes, [customerId]: note } }),
    }),
    { name: "nowe-agent-customer-notes" }
  )
);
