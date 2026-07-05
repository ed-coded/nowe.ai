"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Search,
  Sparkles,
  Pin,
  PinOff,
  Pencil,
  Trash2,
  MoreHorizontal,
  Download,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { listChatHistory, deleteChat, exportChatHistory, type ChatSummary } from "@/services/chat/chatService";
import { useConversationMetaStore } from "@/store/conversationMetaStore";

type SortBy = "recent" | "oldest" | "az";
type DateFilter = "all" | "today" | "week" | "month";

function withinDateFilter(createdAt: string, filter: DateFilter): boolean {
  if (filter === "all") return true;
  const ageDays = (Date.now() - new Date(createdAt).getTime()) / 86400000;
  if (filter === "today") return ageDays < 1;
  if (filter === "week") return ageDays < 7;
  return ageDays < 30;
}

function HistoryRow({ chat }: { chat: ChatSummary }) {
  const queryClient = useQueryClient();
  const meta = useConversationMetaStore((s) => s.meta[chat.id]);
  const togglePin = useConversationMetaStore((s) => s.togglePin);
  const rename = useConversationMetaStore((s) => s.rename);
  const clearMeta = useConversationMetaStore((s) => s.clear);

  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const title = meta?.customTitle ?? chat.preview;

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

  return (
    <div className="flex items-center gap-3 bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] rounded-xl p-4 transition-colors group">
      <div className="w-9 h-9 rounded-lg bg-[var(--surface)] flex items-center justify-center flex-shrink-0">
        <Sparkles size={14} className="text-[var(--accent)]" />
      </div>

      <div className="flex-1 min-w-0">
        {renaming ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename();
              if (e.key === "Escape") setRenaming(false);
            }}
            onBlur={commitRename}
            className="w-full bg-[var(--surface)] border border-[var(--accent)] rounded-lg px-2.5 py-1 text-sm text-[var(--text-primary)] outline-none"
          />
        ) : confirmingDelete ? (
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-[var(--text-muted)]">Delete this conversation?</span>
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleDelete} className="text-xs font-medium text-rose-400 hover:text-rose-300">
                Delete
              </button>
              <button type="button" onClick={() => setConfirmingDelete(false)} className="text-xs text-[var(--text-faint)] hover:text-[var(--text-muted)]">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <Link href={`/dashboard?chat=${chat.id}`} className="block focus-ring rounded" title={title}>
            <p className="text-sm text-[var(--text-primary)] truncate hover:text-[var(--accent)] transition-colors">
              {meta?.pinned && <Pin size={11} className="inline mr-1.5 -mt-0.5 text-[var(--accent)]" />}
              {title}
            </p>
            <p className="text-xs text-[var(--text-faint)] flex items-center gap-1 mt-0.5">
              <Clock size={11} />
              {new Date(chat.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </Link>
        )}
      </div>

      {!renaming && !confirmingDelete && (
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Conversation options"
            className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 data-[popup-open]:opacity-100 w-7 h-7 rounded-md flex items-center justify-center text-[var(--text-faint)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] transition-opacity flex-shrink-0 focus-ring"
          >
            <MoreHorizontal size={15} />
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
      )}
    </div>
  );
}

export default function SearchHistoryPage() {
  const { data: history = [], isLoading } = useQuery({
    queryKey: ["chat-history"],
    queryFn: listChatHistory,
  });
  const metaMap = useConversationMetaStore((s) => s.meta);

  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("recent");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");

  const handleExport = async () => {
    try {
      await exportChatHistory();
    } catch {
      toast.info("Export is coming in a future phase");
    }
  };

  const titleFor = (chat: ChatSummary) => metaMap[chat.id]?.customTitle ?? chat.preview;

  const filtered = history
    .filter((chat) => (query.trim() ? titleFor(chat).toLowerCase().includes(query.trim().toLowerCase()) : true))
    .filter((chat) => withinDateFilter(chat.createdAt, dateFilter));

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "az") return titleFor(a).localeCompare(titleFor(b));
    const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return sortBy === "recent" ? diff : -diff;
  });

  const pinned = sorted.filter((c) => metaMap[c.id]?.pinned);
  const unpinned = sorted.filter((c) => !metaMap[c.id]?.pinned);

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Search History</h1>
          <p className="text-sm text-[var(--text-muted)]">
            Every conversation you&apos;ve had with the assistant — search, organize, and pick one up where you left off.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--surface)] hover:bg-[var(--card)] border border-[var(--border)] px-3 py-2 rounded-lg transition-colors focus-ring flex-shrink-0"
        >
          <Download size={13} />
          Export
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg pl-9 pr-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors"
        >
          <option value="recent">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="az">A–Z</option>
        </select>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value as DateFilter)}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors"
        >
          <option value="all">All time</option>
          <option value="today">Today</option>
          <option value="week">Past 7 days</option>
          <option value="month">Past 30 days</option>
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-[var(--surface)] animate-pulse" />
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="glass rounded-2xl border border-[var(--border)] p-10 text-center">
          <Clock size={28} className="text-[var(--text-faint)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)] mb-4">
            No searches yet — start a conversation to see your history here.
          </p>
          <Link
            href="/dashboard"
            className="inline-block text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-5 py-2.5 rounded-xl transition-colors focus-ring"
          >
            Start a search
          </Link>
        </div>
      ) : sorted.length === 0 ? (
        <div className="glass rounded-2xl border border-[var(--border)] p-10 text-center">
          <p className="text-sm text-[var(--text-muted)]">No conversations match your filters.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {pinned.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-faint)] mb-2">Pinned</p>
              <div className="space-y-2.5">
                {pinned.map((chat) => (
                  <HistoryRow key={chat.id} chat={chat} />
                ))}
              </div>
            </div>
          )}
          {unpinned.length > 0 && (
            <div>
              {pinned.length > 0 && (
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-faint)] mb-2">All Conversations</p>
              )}
              <div className="space-y-2.5">
                {unpinned.map((chat) => (
                  <HistoryRow key={chat.id} chat={chat} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
