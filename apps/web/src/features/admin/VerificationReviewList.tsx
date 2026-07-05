"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { reviewVerificationRequest, type PendingVerificationRequest } from "@/services/verification/verificationService";

export function VerificationReviewList({ requests }: { requests: PendingVerificationRequest[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleReview = (id: string, decision: "approved" | "rejected") => {
    startTransition(async () => {
      try {
        await reviewVerificationRequest(id, decision);
        router.refresh();
        toast.success(decision === "approved" ? "Request approved" : "Request rejected");
      } catch {
        toast.error("Couldn't submit review");
      }
    });
  };

  if (requests.length === 0) {
    return (
      <div className="glass rounded-2xl border border-[var(--border)] p-10 text-center">
        <ShieldCheck size={28} className="text-[var(--text-faint)] mx-auto mb-3" />
        <p className="text-sm text-[var(--text-muted)]">No pending verification requests.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <div key={request.id} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)]">{request.agentName}</p>
              <p className="text-xs text-[var(--text-faint)]">{request.agentEmail}</p>
              <p className="text-xs text-[var(--text-faint)] mt-1">
                Submitted {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => handleReview(request.id, "approved")}
                disabled={isPending}
                className="flex items-center gap-1.5 text-xs font-medium bg-[var(--success)] hover:opacity-90 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg transition-opacity focus-ring"
              >
                <CheckCircle2 size={13} />
                Approve
              </button>
              <button
                type="button"
                onClick={() => handleReview(request.id, "rejected")}
                disabled={isPending}
                className="flex items-center gap-1.5 text-xs font-medium bg-rose-500 hover:opacity-90 disabled:opacity-60 text-white px-3 py-1.5 rounded-lg transition-opacity focus-ring"
              >
                <XCircle size={13} />
                Reject
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--border-subtle)] text-sm text-[var(--text-secondary)] space-y-1">
            <p>
              <span className="text-[var(--text-faint)]">Business name: </span>
              {request.businessName || "—"}
            </p>
            {request.additionalInfo && (
              <p>
                <span className="text-[var(--text-faint)]">Additional info: </span>
                {request.additionalInfo}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
