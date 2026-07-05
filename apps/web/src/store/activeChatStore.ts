import { create } from "zustand";

/** Ephemeral (not persisted) — tracks which conversation is currently open so DashboardTopBar can show/edit its title. */
interface ActiveChatState {
  chatId: string | null;
  title: string | null;
  setActiveChat: (chatId: string | null, title: string | null) => void;
}

export const useActiveChatStore = create<ActiveChatState>((set) => ({
  chatId: null,
  title: null,
  setActiveChat: (chatId, title) => set({ chatId, title }),
}));
