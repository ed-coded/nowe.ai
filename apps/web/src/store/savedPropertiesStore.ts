import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Client-persisted (not the real `favorites` table) because
 * `favorites.property_id` has a hard NOT NULL FK to `properties(id)`, and
 * this phase's search results are simulated mock properties, not real rows
 * (see services/ai/mockProperties.ts) — writing to `favorites` would fail
 * every save with a foreign-key violation. Swap this store's internals for
 * real `favorites` reads/writes once Property Management (Phase 5) seeds
 * real listings; the `isSaved`/`onToggleSave` props this feeds stay the same.
 */
interface SavedPropertiesState {
  savedIds: string[];
  toggle: (propertyId: string) => void;
}

export const useSavedPropertiesStore = create<SavedPropertiesState>()(
  persist(
    (set) => ({
      savedIds: [],
      toggle: (propertyId) =>
        set((state) => ({
          savedIds: state.savedIds.includes(propertyId)
            ? state.savedIds.filter((id) => id !== propertyId)
            : [...state.savedIds, propertyId],
        })),
    }),
    { name: "nowe-saved-properties" }
  )
);
