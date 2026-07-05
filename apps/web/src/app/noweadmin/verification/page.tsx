import { requireAdminAccess } from "@/services/auth/requireAdminAccess";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { listPendingVerificationRequests } from "@/services/verification/verificationService";
import { VerificationReviewList } from "@/features/admin/VerificationReviewList";

export default async function AdminVerificationPage() {
  const { user, role } = await requireAdminAccess();
  const requests = await listPendingVerificationRequests();

  return (
    <DashboardShell role={role} email={user.email ?? ""} title="Verification Review">
      <VerificationReviewList requests={requests} />
    </DashboardShell>
  );
}
