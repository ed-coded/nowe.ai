import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { getCurrentAgentType } from "@/services/auth/getCurrentAgentType";
import { tenantService } from "@/services/landlord/tenantService";

const STATUS_STYLES: Record<string, string> = {
  current: "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20",
  ending_soon: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  past: "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]",
};

const STATUS_LABEL: Record<string, string> = {
  current: "Current",
  ending_soon: "Ending Soon",
  past: "Past",
};

export default async function TenantsPage() {
  const agentType = await getCurrentAgentType();
  if (agentType !== "landlord") redirect("/agent/dashboard");

  const tenants = tenantService.list();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Tenants</h1>
        <p className="text-sm text-[var(--text-muted)]">Everyone currently leasing one of your properties.</p>
      </div>

      {tenants.length === 0 ? (
        <div className="glass rounded-2xl border border-[var(--border)] p-10 text-center">
          <p className="text-sm text-[var(--text-muted)]">No tenants yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tenants.map((tenant) => (
            <div
              key={tenant.id}
              className="flex items-center justify-between gap-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{tenant.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{tenant.propertyTitle}</p>
                <p className="text-xs text-[var(--text-faint)] mt-1">
                  Lease: {new Date(tenant.leaseStart).toLocaleDateString(undefined, { month: "short", year: "numeric" })} –{" "}
                  {new Date(tenant.leaseEnd).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-[var(--text-primary)] mb-1.5">
                  {tenant.currency} {tenant.monthlyRent.toLocaleString()}
                  <span className="text-xs font-normal text-[var(--text-faint)]">/mo</span>
                </p>
                <span className={cn("text-[11px] font-medium px-2.5 py-1 rounded-full border", STATUS_STYLES[tenant.status])}>
                  {STATUS_LABEL[tenant.status]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
