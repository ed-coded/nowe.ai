import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Client-persisted pin/rename overlay for conversations. The real `chats`
 * table (Phase 2) has no `title`/`is_pinned` columns — adding them would be
 * a schema change, which this UX-refinement phase was explicitly scoped to
 * avoid unless required. This keyed-by-chat-id local overlay delivers
 * genuinely persistent pin/rename today; migrating it to real columns
 * later is a additive, non-breaking schema change with a one-time backfill
 * from localStorage if desired.
 */
export interface ConversationMeta {
  pinned: boolean;
  pinnedAt: string | null;
  customTitle: string | null;
}

const EMPTY_META: ConversationMeta = { pinned: false, pinnedAt: null, customTitle: null };

interface ConversationMetaState {
  meta: Record<string, ConversationMeta>;
  togglePin: (chatId: string) => void;
  rename: (chatId: string, title: string) => void;
  clear: (chatId: string) => void;
  getMeta: (chatId: string) => ConversationMeta;
}

export const useConversationMetaStore = create<ConversationMetaState>()(
  persist(
    (set, get) => ({
      meta: {},
      togglePin: (chatId) =>
        set((state) => {
          const current = state.meta[chatId] ?? EMPTY_META;
          return {
            meta: {
              ...state.meta,
              [chatId]: {
                ...current,
                pinned: !current.pinned,
                pinnedAt: !current.pinned ? new Date().toISOString() : null,
              },
            },
          };
        }),
      rename: (chatId, title) =>
        set((state) => ({
          meta: {
            ...state.meta,
            [chatId]: { ...(state.meta[chatId] ?? EMPTY_META), customTitle: title },
          },
        })),
      clear: (chatId) =>
        set((state) => {
          const next = { ...state.meta };
          delete next[chatId];
          return { meta: next };
        }),
      getMeta: (chatId) => get().meta[chatId] ?? EMPTY_META,
    }),
    { name: "nowe-conversation-meta" }
  )
);
