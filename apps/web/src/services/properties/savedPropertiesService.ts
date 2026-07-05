import { useSavedPropertiesStore } from "@/store/savedPropertiesStore";

/**
 * Formal contract over the current client-persisted (localStorage) saved-
 * properties store. Swap the internals for real Supabase `favorites`
 * reads/writes in Phase 5 (once real property rows exist) without touching
 * any call site — components only ever import from this file.
 */
export interface SavedPropertiesService {
  isSaved: (propertyId: string) => boolean;
  toggle: (propertyId: string) => void;
  list: () => string[];
}

export const savedPropertiesService: SavedPropertiesService = {
  isSaved: (propertyId) => useSavedPropertiesStore.getState().savedIds.includes(propertyId),
  toggle: (propertyId) => useSavedPropertiesStore.getState().toggle(propertyId),
  list: () => useSavedPropertiesStore.getState().savedIds,
};

// Re-exported for reactive reads in components — Zustand requires the hook
// itself (not the imperative getState() calls above) to subscribe to
// changes and trigger re-renders.
export { useSavedPropertiesStore };
