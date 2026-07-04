import { requireAdminAccess } from "@/services/auth/requireAdminAccess";

// Placeholder shell only — proves the RBAC/passphrase gate end-to-end.
// The real admin dashboard (user/agent management, moderation, analytics,
// system settings) is built in a later phase.
export default async function NoweAdminPage() {
  const { user } = await requireAdminAccess();

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="glass rounded-2xl border border-[var(--border)] p-8 max-w-md w-full text-center">
        <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">
          Admin Portal
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Signed in as <strong className="text-[var(--text-secondary)]">{user.email}</strong>.
        </p>
        <p className="text-xs text-[var(--text-faint)] mt-4">
          This is a placeholder — the full admin dashboard lands in a later phase.
        </p>
      </div>
    </main>
  );
}
