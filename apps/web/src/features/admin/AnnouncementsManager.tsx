"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Megaphone, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  createAnnouncement,
  setAnnouncementPublished,
  deleteAnnouncement,
  type AnnouncementRecord,
} from "@/services/admin/announcementService";

export function AnnouncementsManager({ announcements }: { announcements: AnnouncementRecord[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createAnnouncement({ title, body, audience: "all" });
      toast.success("Announcement created as draft");
      setTitle("");
      setBody("");
      router.refresh();
    } catch {
      toast.error("Couldn't create announcement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = (id: string, published: boolean) => {
    startTransition(async () => {
      try {
        await setAnnouncementPublished(id, published);
        router.refresh();
        toast.success(published ? "Published" : "Unpublished");
      } catch {
        toast.error("Couldn't update announcement");
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteAnnouncement(id);
        router.refresh();
        toast.success("Announcement deleted");
      } catch {
        toast.error("Couldn't delete announcement");
      }
    });
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreate} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">New announcement</h2>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
        />
        <textarea
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Body"
          rows={3}
          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors resize-none"
        />
        <button
          type="submit"
          disabled={submitting}
          className="text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-60 text-white px-5 py-2.5 rounded-xl transition-colors focus-ring"
        >
          {submitting ? "Creating..." : "Create as draft"}
        </button>
      </form>

      {announcements.length === 0 ? (
        <div className="glass rounded-2xl border border-[var(--border)] p-10 text-center">
          <Megaphone size={28} className="text-[var(--text-faint)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)]">No announcements yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{a.title}</p>
                  <p className="text-xs text-[var(--text-faint)]">
                    {a.publishedAt
                      ? `Published ${new Date(a.publishedAt).toLocaleDateString()}`
                      : `Created ${new Date(a.createdAt).toLocaleDateString()}`}
                  </p>
                </div>
                <Badge variant={a.publishedAt ? "default" : "secondary"} className="flex-shrink-0">
                  {a.publishedAt ? "Published" : "Draft"}
                </Badge>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-3">{a.body}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleTogglePublish(a.id, !a.publishedAt)}
                  className="text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] disabled:opacity-60 transition-colors"
                >
                  {a.publishedAt ? "Unpublish" : "Publish"}
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleDelete(a.id)}
                  aria-label="Delete announcement"
                  className="text-xs font-medium text-rose-400 hover:text-rose-300 disabled:opacity-60 transition-colors flex items-center gap-1"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
