"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { AssistantInput } from "./AssistantInput";
import { PropertyResultCard } from "./PropertyResultCard";
import { PropertyCardSkeleton } from "./PropertyCardSkeleton";
import { CompareBar } from "./CompareBar";
import {
  propertySearchService,
  parseQuery,
  mergeIntent,
  getFollowUpQuestion,
  type ParsedIntent,
  type ScoredProperty,
} from "@/services/properties/propertySearchService";
import { createChat, appendMessage, listChatMessages } from "@/services/chat/chatService";
import { useSavedPropertiesStore } from "@/store/savedPropertiesStore";
import { useActiveChatStore } from "@/store/activeChatStore";

interface Turn {
  id: string;
  role: "user" | "assistant";
  text: string;
  results?: ScoredProperty[];
}

const QUICK_PROMPTS = [
  "Find a furnished apartment in East Legon",
  "Student apartments under GH₵1,500",
  "Safe neighbourhoods near UPSA",
  "Family homes around Spintex",
  "Apartments close to Airport Residential",
];

interface AssistantThreadProps {
  initialChatId?: string;
}

export function AssistantThread({ initialChatId }: AssistantThreadProps) {
  const [chatId, setChatId] = useState<string | null>(initialChatId ?? null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [loading, setLoading] = useState(false);
  const [cumulativeIntent, setCumulativeIntent] = useState<ParsedIntent>({});
  const [askedFollowUps, setAskedFollowUps] = useState<Set<string>>(new Set());
  const savedIds = useSavedPropertiesStore((s) => s.savedIds);
  const toggleSaved = useSavedPropertiesStore((s) => s.toggle);
  const setActiveChat = useActiveChatStore((s) => s.setActiveChat);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialChatId) return;
    listChatMessages(initialChatId).then((messages) => {
      const loaded = messages.map((m) => ({ id: m.id, role: m.senderType, text: m.message }));
      setTurns(loaded);
      const firstUserTurn = loaded.find((t) => t.role === "user");
      setActiveChat(initialChatId, firstUserTurn?.text ?? "Conversation");
    });
  }, [initialChatId, setActiveChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, loading]);

  const runSearch = async (query: string) => {
    setLoading(true);

    let activeChatId = chatId;
    if (!activeChatId) {
      activeChatId = await createChat();
      setChatId(activeChatId);
      setActiveChat(activeChatId, query);
    }

    const userTurn: Turn = { id: crypto.randomUUID(), role: "user", text: query };
    setTurns((prev) => [...prev, userTurn]);
    await appendMessage(activeChatId, "user", query);

    const mergedIntent = mergeIntent(cumulativeIntent, parseQuery(query));
    setCumulativeIntent(mergedIntent);

    const results = await propertySearchService.search(mergedIntent, query);

    let summary =
      results.length > 0
        ? `Here are the top ${results.length} homes that match "${query}".`
        : "I couldn't find a strong match — try describing your budget, neighborhood, or must-haves.";

    const followUp = getFollowUpQuestion(mergedIntent, askedFollowUps);
    if (followUp) {
      summary += ` ${followUp}`;
      setAskedFollowUps((prev) => new Set(prev).add(followUp));
    }

    const assistantTurn: Turn = {
      id: crypto.randomUUID(),
      role: "assistant",
      text: summary,
      results,
    };
    setTurns((prev) => [...prev, assistantTurn]);
    await appendMessage(activeChatId, "assistant", summary);

    setLoading(false);
  };

  const hasStarted = turns.length > 0;

  if (!hasStarted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[var(--accent)] border-opacity-30 mb-8">
          <Sparkles size={14} className="text-[var(--accent)]" />
          <span className="text-xs font-medium text-[var(--text-muted)] tracking-wide uppercase">
            AI Property Assistant
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)] mb-4">
          Where would you like to move today?
        </h1>
        <p className="text-sm md:text-base text-[var(--text-muted)] max-w-lg mb-10">
          Describe your ideal home in plain language — budget, neighborhood, must-haves — and I&apos;ll find the best matches.
        </p>
        <AssistantInput onSubmit={runSearch} loading={loading} autoFocus />
        <div className="flex flex-wrap justify-center gap-2 mt-8 max-w-2xl">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => runSearch(prompt)}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--surface)] hover:bg-[var(--card)] border border-[var(--border)] px-3 py-1.5 rounded-full transition-all duration-200 focus-ring"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[70vh]">
      <div className="flex-1 space-y-8 pb-6">
        {turns.map((turn) =>
          turn.role === "user" ? (
            <div key={turn.id} className="flex justify-end">
              <div className="max-w-lg bg-[var(--accent)] text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-sm">
                {turn.text}
              </div>
            </div>
          ) : (
            <div key={turn.id} className="space-y-5">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles size={13} className="text-white" />
                </div>
                <p className="text-sm text-[var(--text-secondary)] pt-1">{turn.text}</p>
              </div>
              {turn.results && turn.results.length > 0 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 pl-9">
                  {turn.results.map((property, i) => (
                    <PropertyResultCard
                      key={property.id}
                      property={property}
                      index={i}
                      isSaved={savedIds.includes(property.id)}
                      onToggleSave={toggleSaved}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        )}
        {loading && (
          <div className="space-y-5">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
                <Sparkles size={13} className="text-white animate-pulse" />
              </div>
              <div className="flex gap-1 pt-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-faint)] animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-faint)] animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-faint)] animate-bounce" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 pl-9">
              {Array.from({ length: 3 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="sticky bottom-4">
        <AssistantInput onSubmit={runSearch} loading={loading} variant="compact" />
      </div>
      <CompareBar />
    </div>
  );
}
