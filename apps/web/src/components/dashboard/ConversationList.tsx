"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pin, PinOff, Pencil, Trash2, MoreHorizontal, Sparkles, Search, History } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { listChatHistory, deleteChat, type ChatSummary } from "@/services/chat/chatService";
import { useConversationMetaStore } from "@/store/conversationMetaStore";
import { useActiveChatStore } from "@/store/activeChatStore";

interface ConversationListProps {
  onNavigate?: () => void;
}

function groupByRecency(chats: ChatSummary[]) {
  const now = Date.now();
  const groups: { label: string; items: ChatSummary[] }[] = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "Previous 7 Days", items: [] },
    { label: "Previous 30 Days", items: [] },
    { label: "Older", items: [] },
  ];

  for (const chat of chats) {
    const ageDays = (now - new Date(chat.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays < 1) groups[0].items.push(chat);
    else if (ageDays < 2) groups[1].items.push(chat);
    else if (ageDays < 7) groups[2].items.push(chat);
    else if (ageDays < 30) groups[3].items.push(chat);
    else groups[4].items.push(chat);
  }

  return groups.filter((g) => g.items.length > 0);
}

function ConversationRow({
  chat,
  onNavigate,
}: {
  chat: ChatSummary;
  onNavigate?: () => void;
}) {
  const queryClient = useQueryClient();
  const activeChatId = useActiveChatStore((s) => s.chatId);
  const meta = useConversationMetaStore((s) => s.meta[chat.id]);
  const togglePin = useConversationMetaStore((s) => s.togglePin);
  const rename = useConversationMetaStore((s) => s.rename);
  const clearMeta = useConversationMetaStore((s) => s.clear);

  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const title = meta?.customTitle ?? chat.preview;
  const isActive = activeChatId === chat.id;

  const commitRename = () => {
    if (draft.trim()) rename(chat.id, draft.trim());
    setRenaming(false);
  };

  const handleDelete = async () => {
    try {
      await deleteChat(chat.id);
      clearMeta(chat.id);
      queryClient.invalidateQueries({ queryKey: ["chat-history"] });
      toast.success("Conversation deleted");
    } catch {
      toast.error("Couldn't delete conversation");
    }
  };

  if (renaming) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") commitRename();
          if (e.key === "Escape") setRenaming(false);
        }}
        onBlur={commitRename}
        className="w-full bg-[var(--surface)] border border-[var(--accent)] rounded-lg px-2.5 py-1.5 text-sm text-[var(--text-primary)] outline-none"
      />
    );
  }

  if (confirmingDelete) {
    return (
      <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-[var(--surface)]">
        <span className="text-xs text-[var(--text-muted)]">Delete this conversation?</span>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={handleDelete}
            className="text-xs font-medium text-rose-400 hover:text-rose-300 px-1.5 py-0.5"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => setConfirmingDelete(false)}
            className="text-xs text-[var(--text-faint)] hover:text-[var(--text-muted)] px-1.5 py-0.5"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative flex items-center gap-2 rounded-lg pl-2.5 pr-1 py-1.5 transition-colors ${
        isActive ? "bg-[var(--accent)] bg-opacity-15" : "hover:bg-[var(--card)]"
      }`}
    >
      <Link
        href={`/dashboard?chat=${chat.id}`}
        onClick={onNavigate}
        className="flex-1 min-w-0 text-sm text-[var(--text-secondary)] truncate focus-ring rounded"
        title={title}
      >
        {title}
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Conversation options"
          className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 data-[popup-open]:opacity-100 w-6 h-6 rounded-md flex items-center justify-center text-[var(--text-faint)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] transition-opacity flex-shrink-0 focus-ring"
        >
          <MoreHorizontal size={14} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-[var(--card)] border border-[var(--border)] min-w-40">
          <DropdownMenuItem onClick={() => togglePin(chat.id)}>
            {meta?.pinned ? <PinOff size={13} /> : <Pin size={13} />}
            {meta?.pinned ? "Unpin" : "Pin"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setDraft(title);
              setRenaming(true);
            }}
          >
            <Pencil size={13} />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => setConfirmingDelete(true)}>
            <Trash2 size={13} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function ConversationList({ onNavigate }: ConversationListProps) {
  const { data: history = [], isLoading } = useQuery({
    queryKey: ["chat-history"],
    queryFn: listChatHistory,
  });
  const metaMap = useConversationMetaStore((s) => s.meta);
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? history.filter((chat) =>
        (metaMap[chat.id]?.customTitle ?? chat.preview).toLowerCase().includes(query.trim().toLowerCase())
      )
    : history;

  const pinned = filtered.filter((chat) => metaMap[chat.id]?.pinned);
  const unpinned = filtered.filter((chat) => !metaMap[chat.id]?.pinned);
  const groups = groupByRecency(unpinned);

  if (isLoading) {
    return (
      <div className="space-y-1.5 px-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-7 rounded-lg bg-[var(--surface)] animate-pulse" />
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="px-3 py-4 text-center">
        <Sparkles size={18} className="text-[var(--text-faint)] mx-auto mb-2" />
        <p className="text-xs text-[var(--text-faint)]">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="px-3">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations"
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="px-3 text-xs text-[var(--text-faint)]">No conversations match &quot;{query}&quot;</p>
      )}

      <div className="px-1.5">
        <Link
          href="/dashboard/history"
          onClick={onNavigate}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-[var(--text-faint)] hover:text-[var(--accent)] hover:bg-[var(--card)] transition-colors focus-ring"
        >
          <History size={13} />
          View full history
        </Link>
      </div>

      {pinned.length > 0 && (
        <div>
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)] mb-1">
            Pinned
          </p>
          <div className="space-y-0.5 px-1.5">
            {pinned.map((chat) => (
              <ConversationRow key={chat.id} chat={chat} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      )}

      {groups.map(({ label, items }) => (
        <div key={label}>
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-faint)] mb-1">
            {label}
          </p>
          <div className="space-y-0.5 px-1.5">
            {items.map((chat) => (
              <ConversationRow key={chat.id} chat={chat} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
