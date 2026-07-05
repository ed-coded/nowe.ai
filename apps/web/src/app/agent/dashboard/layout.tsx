import { requireRole } from "@/services/auth/requireRole";
import { getCurrentAgentType } from "@/services/auth/getCurrentAgentType";
import { createClient } from "@/utils/supabase/server";
import { AgentSidebar } from "@/components/agent/AgentSidebar";
import { AgentTopBar } from "@/components/agent/AgentTopBar";
import { AgentMobileNav } from "@/components/agent/AgentMobileNav";
import { AgentAssistantDock } from "@/features/ai/AgentAssistantDock";

// Gates the entire /agent/dashboard/* route group in one place — same
// requireRole() call the old page.tsx made directly, just relocated here so
// every new CRM sub-route (leads, customers, calendar, ...) is covered too.
// No change to requireRole's behavior or the agent role gate itself.
export default async function AgentCrmLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["agent"], { unauthenticatedRedirect: "/agent/signin" });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const agentType = await getCurrentAgentType();

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <AgentSidebar agentType={agentType} />
      <div className="flex-1 min-w-0 flex flex-col pb-20 md:pb-0">
        <AgentTopBar userEmail={user?.email ?? ""} />
        <div className="container-home py-6 md:py-10 max-w-6xl flex-1 w-full">{children}</div>
      </div>
      <AgentMobileNav agentType={agentType} />
      <AgentAssistantDock />
    </div>
  );
}
