import { redirect } from "next/navigation";
import { Wallet } from "lucide-react";
import { getCurrentAgentType } from "@/services/auth/getCurrentAgentType";

export default async function RentCollectionPage() {
  const agentType = await getCurrentAgentType();
  if (agentType !== "landlord") redirect("/agent/dashboard");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Rent Collection</h1>
        <p className="text-sm text-[var(--text-muted)]">Track and collect rent payments from your tenants.</p>
      </div>

      <div className="glass rounded-2xl border border-[var(--border)] p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[var(--surface)] flex items-center justify-center mx-auto mb-4">
          <Wallet size={24} className="text-[var(--accent)]" />
        </div>
        <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">Coming Soon</h2>
        <p className="text-sm text-[var(--text-muted)] max-w-sm mx-auto">
          Automated rent tracking, payment reminders, and collection history will land in a future phase.
        </p>
      </div>
    </div>
  );
}
