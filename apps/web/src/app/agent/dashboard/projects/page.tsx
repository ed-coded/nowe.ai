import { redirect } from "next/navigation";
import { Building2 } from "lucide-react";
import { getCurrentAgentType } from "@/services/auth/getCurrentAgentType";
import { projectService } from "@/services/projects/projectService";

const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  published: "Published",
  sold_out: "Sold Out",
};

export default async function ProjectsPage() {
  const agentType = await getCurrentAgentType();
  if (agentType !== "developer") redirect("/agent/dashboard");

  const projects = projectService.list();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Projects</h1>
        <p className="text-sm text-[var(--text-muted)]">Your multi-unit developments and their sales progress.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project) => {
          const soldPercent = project.totalUnits > 0 ? Math.round((project.soldUnits / project.totalUnits) * 100) : 0;
          return (
            <div key={project.id} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
              <div className="relative aspect-[16/10] bg-[var(--surface)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={project.coverImageUrl} alt={project.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 flex items-center gap-1 text-[11px] font-medium bg-[var(--background)]/90 backdrop-blur text-[var(--text-primary)] px-2.5 py-1 rounded-full border border-[var(--border)]">
                  <Building2 size={11} />
                  {STATUS_LABEL[project.status]}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{project.name}</h3>
                <p className="text-xs text-[var(--text-muted)] mb-4">{project.city}</p>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[var(--text-muted)]">Sales progress</span>
                    <span className="font-medium text-[var(--text-primary)]">{soldPercent}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[var(--surface)] overflow-hidden">
                    <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${soldPercent}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-[var(--surface)] rounded-lg py-2">
                    <p className="text-sm font-bold text-[var(--text-primary)]">{project.availableUnits}</p>
                    <p className="text-[10px] text-[var(--text-faint)] uppercase">Available</p>
                  </div>
                  <div className="bg-[var(--surface)] rounded-lg py-2">
                    <p className="text-sm font-bold text-[var(--text-primary)]">{project.reservedUnits}</p>
                    <p className="text-[10px] text-[var(--text-faint)] uppercase">Reserved</p>
                  </div>
                  <div className="bg-[var(--surface)] rounded-lg py-2">
                    <p className="text-sm font-bold text-[var(--text-primary)]">{project.soldUnits}</p>
                    <p className="text-[10px] text-[var(--text-faint)] uppercase">Sold</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
