"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { listAgentConversations } from "@/services/messaging/conversationService";
import { ConversationPanel } from "@/features/messaging/ConversationPanel";

type Filter = "all" | "recent";

function isWithinLastDay(iso: string | null): boolean {
  if (!iso) return false;
  return Date.now() - new Date(iso).getTime() < 86400000;
}

export default function AgentMessagesPage() {
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["agent-conversations"],
    queryFn: listAgentConversations,
  });
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = conversations.filter((c) => {
    const matchesQuery = query.trim() ? c.renterName.toLowerCase().includes(query.trim().toLowerCase()) : true;
    const matchesFilter = filter === "all" || (filter === "recent" && isWithinLastDay(c.lastMessageAt));
    return matchesQuery && matchesFilter;
  });

  const selected = filtered.find((c) => c.id === selectedId) ?? filtered[0] ?? null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Messages</h1>
        <p className="text-sm text-[var(--text-muted)]">Conversations with renters interested in your listings.</p>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-5 bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden min-h-[480px]">
        <div className="border-b md:border-b-0 md:border-r border-[var(--border)] flex flex-col">
          <div className="p-3 border-b border-[var(--border)] space-y-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search conversations"
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
            <div className="flex gap-1.5">
              {(["all", "recent"] as Filter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={cn(
                    "text-[11px] font-medium px-2.5 py-1 rounded-full border capitalize transition-colors",
                    filter === f
                      ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                      : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)]"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-3 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 rounded-xl bg-[var(--surface)] animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-center">
                <MessageSquare size={22} className="text-[var(--text-faint)] mx-auto mb-2" />
                <p className="text-xs text-[var(--text-faint)]">
                  No conversations yet — they&apos;ll appear here once a renter messages you about a listing.
                </p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {filtered.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-colors",
                      selected?.id === c.id ? "bg-[var(--accent)] bg-opacity-15" : "hover:bg-[var(--surface)]"
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-[var(--surface)] flex items-center justify-center flex-shrink-0 text-xs font-semibold text-[var(--accent)]">
                      {c.renterName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-[var(--text-primary)] truncate">{c.renterName}</p>
                      <p className="text-[11px] text-[var(--text-faint)]">
                        {c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleDateString() : "No messages yet"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {selected ? (
          <ConversationPanel
            key={selected.id}
            conversationId={selected.id}
            title={selected.renterName}
            listQueryKey={["agent-conversations"]}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <MessageSquare size={28} className="text-[var(--text-faint)] mb-3" />
            <p className="text-sm text-[var(--text-muted)]">Select a conversation to view it here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
