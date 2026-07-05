"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchNotifications, markNotificationRead } from "@/services/notifications/notificationService";

export default function AgentNotificationsPage() {
  const queryClient = useQueryClient();
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["agent-notifications"],
    queryFn: fetchNotifications,
  });

  const markRead = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["agent-notifications"] }),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Notifications</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">
        New leads, inspection requests, verification updates, AI suggestions, and listing moderation.
      </p>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : !notifications || notifications.length === 0 ? (
        <div className="glass rounded-2xl border border-[var(--border)] p-10 text-center">
          <Bell size={28} className="text-[var(--text-faint)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">
            You&apos;re all caught up — new leads and updates will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={cn(
                "flex items-start gap-3 border rounded-xl p-4 transition-colors",
                n.readAt
                  ? "bg-[var(--card)] border-[var(--border)]"
                  : "bg-[var(--surface)] border-[var(--accent)] border-opacity-30"
              )}
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--background)] flex items-center justify-center flex-shrink-0">
                <Bell size={14} className="text-[var(--accent)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--text-primary)]">{n.title}</p>
                {n.body && <p className="text-xs text-[var(--text-muted)] mt-0.5">{n.body}</p>}
                <p className="text-xs text-[var(--text-faint)] mt-1">
                  {new Date(n.createdAt).toLocaleDateString()}
                </p>
              </div>
              {!n.readAt && (
                <button
                  type="button"
                  onClick={() => markRead.mutate(n.id)}
                  aria-label="Mark as read"
                  className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--background)] transition-colors focus-ring"
                >
                  <Check size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
