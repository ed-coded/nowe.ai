import { listInspectionsForMyProperties } from "@/services/properties/inspectionService";
import { InspectionReviewList } from "@/features/agent/InspectionReviewList";

export default async function AgentInspectionsPage() {
  const requests = await listInspectionsForMyProperties();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Inspection Requests</h1>
        <p className="text-sm text-[var(--text-muted)]">Renters requesting to view your listings.</p>
      </div>
      <InspectionReviewList requests={requests} />
    </div>
  );
}
