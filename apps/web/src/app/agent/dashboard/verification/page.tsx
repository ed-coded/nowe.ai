import { CheckCircle2, Clock, CircleDashed, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getVerificationSummary,
  getMyLatestVerificationRequest,
  type VerificationItemStatus,
} from "@/services/verification/verificationService";
import { VerificationSubmitForm } from "@/features/agent/VerificationSubmitForm";

const STATUS_META: Record<VerificationItemStatus, { label: string; icon: typeof CheckCircle2; className: string }> = {
  verified: { label: "Verified", icon: CheckCircle2, className: "text-[var(--success)]" },
  pending: { label: "Pending review", icon: Clock, className: "text-amber-400" },
  not_started: { label: "Not started", icon: CircleDashed, className: "text-[var(--text-faint)]" },
  unavailable: { label: "Not yet available", icon: MinusCircle, className: "text-[var(--text-faint)]" },
};

export default async function VerificationPage() {
  const [summary, latestRequest] = await Promise.all([getVerificationSummary(), getMyLatestVerificationRequest()]);

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Verification</h1>
        <p className="text-sm text-[var(--text-muted)]">
          Build trust with renters by completing your verification checklist.
        </p>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-[var(--text-primary)]">Overall progress</span>
          <span className="text-sm font-bold text-[var(--accent)]">{summary.percentComplete}%</span>
        </div>
        <div className="h-2 rounded-full bg-[var(--surface)] overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
            style={{ width: `${summary.percentComplete}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {summary.items.map((item) => {
          const meta = STATUS_META[item.status];
          const Icon = meta.icon;
          return (
            <div
              key={item.key}
              className="flex items-center justify-between gap-3 bg-[var(--card)] border border-[var(--border)] rounded-xl p-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)]">{item.label}</p>
                {item.detail && <p className="text-xs text-[var(--text-faint)] truncate">{item.detail}</p>}
              </div>
              <span className={cn("flex items-center gap-1.5 text-xs font-medium flex-shrink-0", meta.className)}>
                <Icon size={14} />
                {meta.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <VerificationSubmitForm latestRequest={latestRequest} />
      </div>
    </div>
  );
}
