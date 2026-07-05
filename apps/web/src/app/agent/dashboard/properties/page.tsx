import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { getCurrentAgentType } from "@/services/auth/getCurrentAgentType";
import { landlordPropertyService } from "@/services/landlord/landlordPropertyService";

const STATUS_STYLES: Record<string, string> = {
  occupied: "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20",
  vacant: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  under_maintenance: "bg-rose-400/10 text-rose-400 border-rose-400/20",
};

const STATUS_LABEL: Record<string, string> = {
  occupied: "Occupied",
  vacant: "Vacant",
  under_maintenance: "Under Maintenance",
};

export default async function LandlordPropertiesPage() {
  const agentType = await getCurrentAgentType();
  if (agentType !== "landlord") redirect("/agent/dashboard");

  const properties = landlordPropertyService.list();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">My Properties</h1>
        <p className="text-sm text-[var(--text-muted)]">A read-only view of your portfolio — editing arrives in Phase 5.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {properties.map((property) => (
          <div key={property.id} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
            <div className="relative aspect-[16/10] bg-[var(--surface)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-5">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{property.title}</h3>
              <p className="text-xs text-[var(--text-muted)] mb-3">{property.neighborhood}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {property.currency} {property.monthlyRent.toLocaleString()}
                  <span className="text-xs font-normal text-[var(--text-faint)]">/mo</span>
                </span>
                <span className={cn("text-[11px] font-medium px-2.5 py-1 rounded-full border", STATUS_STYLES[property.status])}>
                  {STATUS_LABEL[property.status]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
