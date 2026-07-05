"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { listMessages, sendMessage, markConversationRead } from "@/services/messaging/conversationService";

interface ConversationPanelProps {
  conversationId: string;
  title: string;
  /** Invalidated after a send so the parent's conversation list re-sorts/refreshes last-message-at. */
  listQueryKey: unknown[];
}

export function ConversationPanel({ conversationId, title, listQueryKey }: ConversationPanelProps) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: messages = [] } = useQuery({
    queryKey: ["conversation-messages", conversationId],
    queryFn: () => listMessages(conversationId),
    refetchInterval: 5000,
  });

  useEffect(() => {
    markConversationRead(conversationId);
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || sending) return;
    setSending(true);
    try {
      await sendMessage(conversationId, draft.trim());
      setDraft("");
      queryClient.invalidateQueries({ queryKey: ["conversation-messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: listQueryKey });
    } catch {
      toast.error("Couldn't send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[var(--border)] flex-shrink-0">
        <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-sm text-[var(--text-faint)] text-center mt-8">
            No messages yet — say hello.
          </p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={cn("flex", m.isMine ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-xs sm:max-w-sm px-4 py-2.5 rounded-2xl text-sm",
                  m.isMine
                    ? "bg-[var(--accent)] text-white rounded-br-sm"
                    : "bg-[var(--surface)] text-[var(--text-primary)] rounded-bl-sm"
                )}
              >
                {m.body}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 border-t border-[var(--border)] flex items-center gap-2 flex-shrink-0">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write a message..."
          disabled={sending}
          className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          aria-label="Send message"
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 text-white transition-colors focus-ring flex-shrink-0"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
