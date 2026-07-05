import { requireAdminAccess } from "@/services/auth/requireAdminAccess";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { listAllProfiles } from "@/services/admin/adminUserService";
import { UsersAgentsList } from "@/features/admin/UsersAgentsList";

export default async function AdminUsersPage() {
  const { user, role } = await requireAdminAccess();
  const profiles = await listAllProfiles();

  return (
    <DashboardShell role={role} email={user.email ?? ""} title="Users & Agents">
      <UsersAgentsList profiles={profiles} />
    </DashboardShell>
  );
}
