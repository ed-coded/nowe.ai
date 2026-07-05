import Link from "next/link";
import { Clock, Sparkles } from "lucide-react";
import { listChatHistory } from "@/services/chat/chatService";

export default async function SearchHistoryPage() {
  const history = await listChatHistory();

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Search History</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">
        Every conversation you&apos;ve had with the assistant — pick one up where you left off.
      </p>

      {history.length === 0 ? (
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
      ) : (
        <div className="space-y-2">
          {history.map((chat) => (
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
                  {new Date(chat.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
