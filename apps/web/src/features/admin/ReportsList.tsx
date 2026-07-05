"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { updateReportStatus, type ReportRecord, type ReportStatus } from "@/services/admin/reportService";

const STATUS_VARIANT: Record<ReportStatus, "default" | "secondary" | "destructive" | "outline"> = {
  open: "destructive",
  reviewing: "secondary",
  resolved: "default",
  dismissed: "outline",
};

export function ReportsList({ reports }: { reports: ReportRecord[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (id: string, status: ReportStatus) => {
    startTransition(async () => {
      try {
        await updateReportStatus(id, status);
        router.refresh();
        toast.success("Report updated");
      } catch {
        toast.error("Couldn't update report");
      }
    });
  };

  if (reports.length === 0) {
    return (
      <div className="glass rounded-2xl border border-[var(--border)] p-10 text-center">
        <Flag size={28} className="text-[var(--text-faint)] mx-auto mb-3" />
        <p className="text-sm text-[var(--text-muted)]">No reports filed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <div key={report.id} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {report.reason}{" "}
                <span className="text-xs font-normal text-[var(--text-faint)] capitalize">
                  · {report.targetType}
                </span>
              </p>
              <p className="text-xs text-[var(--text-faint)]">
                Reported by {report.reporterName} · {new Date(report.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Badge variant={STATUS_VARIANT[report.status]} className="capitalize flex-shrink-0">
              {report.status}
            </Badge>
          </div>

          {report.details && <p className="text-sm text-[var(--text-secondary)] mb-3">{report.details}</p>}

          {(report.status === "open" || report.status === "reviewing") && (
            <div className="flex items-center gap-2">
              {report.status === "open" && (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleUpdate(report.id, "reviewing")}
                  className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-60 border border-[var(--border)] px-3 py-1.5 rounded-lg transition-colors"
                >
                  Start reviewing
                </button>
              )}
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleUpdate(report.id, "resolved")}
                className="text-xs font-medium bg-[var(--success)] hover:opacity-90 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg transition-opacity"
              >
                Resolve
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleUpdate(report.id, "dismissed")}
                className="text-xs font-medium bg-[var(--surface)] hover:bg-[var(--card)] border border-[var(--border)] disabled:opacity-60 text-[var(--text-primary)] px-3 py-1.5 rounded-lg transition-colors"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
