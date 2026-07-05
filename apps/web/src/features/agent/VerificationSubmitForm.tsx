"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, Clock } from "lucide-react";
import { submitVerificationRequest, type LatestVerificationRequest } from "@/services/verification/verificationService";

export function VerificationSubmitForm({ latestRequest }: { latestRequest: LatestVerificationRequest | null }) {
  const router = useRouter();
  const [businessName, setBusinessName] = useState(latestRequest?.businessName ?? "");
  const [additionalInfo, setAdditionalInfo] = useState(latestRequest?.additionalInfo ?? "");
  const [submitting, setSubmitting] = useState(false);

  if (latestRequest?.status === "pending") {
    return (
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 flex items-center gap-3">
        <Clock size={18} className="text-amber-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-[var(--text-primary)]">Verification request submitted</p>
          <p className="text-xs text-[var(--text-faint)]">
            Submitted {new Date(latestRequest.createdAt).toLocaleDateString()} — an admin will review it soon.
          </p>
        </div>
      </div>
    );
  }

  if (latestRequest?.status === "approved") {
    return (
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 flex items-center gap-3">
        <CheckCircle2 size={18} className="text-[var(--success)] flex-shrink-0" />
        <p className="text-sm font-medium text-[var(--text-primary)]">Your verification has been approved.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitVerificationRequest({ businessName, additionalInfo });
      toast.success("Verification request submitted");
      router.refresh();
    } catch {
      toast.error("Couldn't submit verification request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
          {latestRequest?.status === "rejected" ? "Resubmit verification" : "Submit for verification"}
        </h2>
        <p className="text-xs text-[var(--text-muted)]">
          {latestRequest?.status === "rejected"
            ? "Your previous request wasn't approved — update the details and resubmit."
            : "Provide your business details so an admin can review and verify your account."}
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Business name</label>
        <input
          required
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Additional info (optional)</label>
        <textarea
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          rows={3}
          placeholder="Registration number, years in business, licenses held, etc."
          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-60 text-white px-5 py-2.5 rounded-xl transition-colors focus-ring"
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
