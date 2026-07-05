import Link from "next/link";
import { Sparkles, MessageSquare } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { listChatHistory } from "@/services/chat/chatService";
import { listConversations } from "@/services/messaging/conversationService";

export default async function MessagesPage() {
  const [chatHistory, conversations] = await Promise.all([listChatHistory(), listConversations()]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Messages</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">
        Conversations with the AI assistant and with agents, kept separate.
      </p>

      <Tabs defaultValue="ai">
        <TabsList>
          <TabsTrigger value="ai">AI Assistant</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="pt-4">
          {chatHistory.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              message="No conversations with the assistant yet."
              ctaHref="/dashboard"
              ctaLabel="Start a search"
            />
          ) : (
            <div className="space-y-2">
              {chatHistory.map((chat) => (
                <Link
                  key={chat.id}
                  href={`/dashboard?chat=${chat.id}`}
                  className="flex items-center gap-3 bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] rounded-xl p-4 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[var(--surface)] flex items-center justify-center flex-shrink-0">
                    <Sparkles size={14} className="text-[var(--accent)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--text-primary)] truncate group-hover:text-[var(--accent)] transition-colors">
                      {chat.preview}
                    </p>
                    <p className="text-xs text-[var(--text-faint)]">
                      {new Date(chat.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="agents" className="pt-4">
          {conversations.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              message="No conversations with agents yet — message an agent from a property's detail page once available."
            />
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="flex items-center gap-3 bg-[var(--card)] border border-[var(--border)] rounded-xl p-4"
                >
                  <div className="w-8 h-8 rounded-lg bg-[var(--surface)] flex items-center justify-center flex-shrink-0">
                    <MessageSquare size={14} className="text-[var(--accent)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--text-primary)] truncate">{conversation.agentName}</p>
                    {conversation.lastMessageAt && (
                      <p className="text-xs text-[var(--text-faint)]">
                        {new Date(conversation.lastMessageAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  message,
  ctaHref,
  ctaLabel,
}: {
  icon: typeof Sparkles;
  message: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="glass rounded-2xl border border-[var(--border)] p-10 text-center">
      <Icon size={28} className="text-[var(--text-faint)] mx-auto mb-3" />
      <p className="text-sm text-[var(--text-muted)] mb-4">{message}</p>
      {ctaHref && ctaLabel && (
        <Link
          href={ctaHref}
          className="inline-block text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-5 py-2.5 rounded-xl transition-colors focus-ring"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
