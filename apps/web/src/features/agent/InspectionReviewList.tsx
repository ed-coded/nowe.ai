"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, XCircle, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { updateInspectionStatus, type AgentInspectionRequest } from "@/services/properties/inspectionService";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
  completed: "outline",
};

export function InspectionReviewList({ requests }: { requests: AgentInspectionRequest[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (id: string, status: "approved" | "rejected" | "completed") => {
    startTransition(async () => {
      try {
        await updateInspectionStatus(id, status);
        router.refresh();
        toast.success(`Inspection marked ${status}`);
      } catch {
        toast.error("Couldn't update inspection");
      }
    });
  };

  if (requests.length === 0) {
    return (
      <div className="glass rounded-2xl border border-[var(--border)] p-10 text-center">
        <CalendarClock size={28} className="text-[var(--text-faint)] mx-auto mb-3" />
        <p className="text-sm text-[var(--text-muted)]">No inspection requests yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <div key={request.id} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <Link
                href={`/agent/dashboard/listings`}
                className="text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors truncate block"
              >
                {request.propertyTitle}
              </Link>
              <p className="text-xs text-[var(--text-muted)]">
                Requested by {request.renterName} for{" "}
                {new Date(request.requestedDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <Badge variant={STATUS_VARIANT[request.status]} className="capitalize flex-shrink-0">
              {request.status}
            </Badge>
          </div>

          {request.status === "pending" && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleUpdate(request.id, "approved")}
                disabled={isPending}
                className="flex items-center gap-1.5 text-xs font-medium bg-[var(--success)] hover:opacity-90 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg transition-opacity focus-ring"
              >
                <CheckCircle2 size={13} />
                Approve
              </button>
              <button
                type="button"
                onClick={() => handleUpdate(request.id, "rejected")}
                disabled={isPending}
                className="flex items-center gap-1.5 text-xs font-medium bg-rose-500 hover:opacity-90 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg transition-opacity focus-ring"
              >
                <XCircle size={13} />
                Decline
              </button>
            </div>
          )}
          {request.status === "approved" && (
            <button
              type="button"
              onClick={() => handleUpdate(request.id, "completed")}
              disabled={isPending}
              className="text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] disabled:opacity-60 transition-colors"
            >
              Mark as completed
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
