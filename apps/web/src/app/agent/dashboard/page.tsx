import Link from "next/link";
import {
  Home,
  FileEdit,
  ClipboardCheck,
  Users,
  CalendarClock,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { listMyLeads } from "@/services/leads/leadService";
import { taskService } from "@/services/tasks/taskService";
import { calendarService } from "@/services/calendar/calendarService";
import { listAgentConversations } from "@/services/messaging/conversationService";
import { getVerificationSummary } from "@/services/verification/verificationService";
import { listMyProperties } from "@/services/properties/propertyService";
import { listInspectionsForMyProperties } from "@/services/properties/inspectionService";

const AI_INSIGHTS = [
  "3 leads haven't been contacted in over 48 hours — consider a follow-up today.",
  "Listings with 5+ photos get 40% more inquiries on average.",
  "Your East Legon inspections this week are clustered on Thursday — room to spread them out.",
];

export default async function AgentCrmHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [leads, upcomingEvents, conversations, verification, properties, inspections] = await Promise.all([
    listMyLeads(),
    Promise.resolve(calendarService.listUpcoming(3)),
    listAgentConversations(),
    getVerificationSummary(),
    listMyProperties(),
    listInspectionsForMyProperties(),
  ]);

  const tasksByStatus = taskService.listByStatus();
  const newLeadsCount = leads.filter((l) => l.stage === "new").length;
  const scheduledInspections = inspections.filter((i) => i.status === "pending" || i.status === "approved").length;
  const activeListings = properties.filter((p) => p.status === "published").length;
  const draftListings = properties.filter((p) => p.status === "draft").length;

  const stats = [
    { label: "Active Listings", value: activeListings, hint: "Published & searchable", icon: Home },
    { label: "Draft Listings", value: draftListings, hint: "Not yet published", icon: FileEdit },
    { label: "Pending Reviews", value: tasksByStatus.in_progress.length, hint: "Tasks in progress", icon: ClipboardCheck },
    { label: "New Leads", value: newLeadsCount, hint: "In the New stage", icon: Users },
    { label: "Scheduled Inspections", value: scheduledInspections, hint: "Pending + approved", icon: CalendarClock },
    { label: "Messages", value: conversations.length, hint: "Conversations with renters", icon: MessageSquare },
    { label: "Verification Status", value: `${verification.percentComplete}%`, hint: "Complete", icon: ShieldCheck },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
          Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
        </h1>
        <p className="text-sm text-[var(--text-muted)]">Here&apos;s what&apos;s happening across your workspace.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, hint, icon: Icon }) => (
          <div key={label} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--surface)] flex items-center justify-center">
                <Icon size={16} className="text-[var(--accent)]" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)] mb-0.5">{value}</p>
            <p className="text-xs text-[var(--text-muted)]">{label}</p>
            <p className="text-[11px] text-[var(--text-faint)] mt-1">{hint}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Upcoming</h2>
            <Link href="/agent/dashboard/calendar" className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
              View calendar
            </Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-[var(--text-faint)]">Nothing scheduled — enjoy the quiet.</p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[var(--surface)] flex items-center justify-center flex-shrink-0">
                    <CalendarClock size={14} className="text-[var(--accent)]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-[var(--text-primary)] truncate">{event.title}</p>
                    <p className="text-xs text-[var(--text-faint)]">
                      {new Date(event.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })} at {event.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
              <Sparkles size={13} className="text-white" />
            </div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">AI Insights</h2>
          </div>
          <ul className="space-y-3">
            {AI_INSIGHTS.map((insight) => (
              <li key={insight} className="text-sm text-[var(--text-secondary)] leading-relaxed flex gap-2">
                <span className="text-[var(--accent)] flex-shrink-0">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
