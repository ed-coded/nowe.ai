"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConversationPanel } from "@/features/messaging/ConversationPanel";
import type { ConversationSummary } from "@/services/messaging/conversationService";

function AgentConversationsPanelContent({ conversations }: { conversations: ConversationSummary[] }) {
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get("conversation"));

  const selected = conversations.find((c) => c.id === selectedId) ?? conversations[0] ?? null;

  if (conversations.length === 0) {
    return (
      <div className="glass rounded-2xl border border-[var(--border)] p-10 text-center">
        <MessageSquare size={28} className="text-[var(--text-faint)] mx-auto mb-3" />
        <p className="text-sm text-[var(--text-muted)]">
          No conversations with agents yet — message an agent from a property&apos;s detail page.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-5 bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden min-h-[420px]">
      <div className="border-b md:border-b-0 md:border-r border-[var(--border)] overflow-y-auto p-2 space-y-1">
        {conversations.map((c) => (
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
              {c.agentName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-[var(--text-primary)] truncate">{c.agentName}</p>
              <p className="text-[11px] text-[var(--text-faint)]">
                {c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleDateString() : "No messages yet"}
              </p>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <ConversationPanel
          key={selected.id}
          conversationId={selected.id}
          title={selected.agentName}
          listQueryKey={["renter-conversations"]}
        />
      )}
    </div>
  );
}

export function AgentConversationsPanel({ conversations }: { conversations: ConversationSummary[] }) {
  return (
    <Suspense fallback={null}>
      <AgentConversationsPanelContent conversations={conversations} />
    </Suspense>
  );
}
