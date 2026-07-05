import { create } from "zustand";

const MAX_COMPARE = 3;

/** Ephemeral (not persisted) — comparison selection is a short-lived task within a session. */
interface CompareState {
  ids: string[];
  toggle: (id: string) => void;
  clear: () => void;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  ids: [],
  toggle: (id) => {
    const { ids } = get();
    if (ids.includes(id)) {
      set({ ids: ids.filter((i) => i !== id) });
    } else if (ids.length < MAX_COMPARE) {
      set({ ids: [...ids, id] });
    }
  },
  clear: () => set({ ids: [] }),
}));

export { MAX_COMPARE };
