"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MoreHorizontal, Wallet, MapPin, Clock, CalendarClock, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { listMyLeads, moveLeadStage, createLead, type Lead } from "@/services/leads/leadService";
import { LEAD_STAGES, type LeadStage } from "@/services/leads/leadStages";

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffDays = Math.round(diffMs / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays > 1) return `${diffDays} days ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function groupByStage(leads: Lead[]): Record<LeadStage, Lead[]> {
  const grouped = Object.fromEntries(LEAD_STAGES.map((s) => [s.value, [] as Lead[]])) as Record<LeadStage, Lead[]>;
  for (const lead of leads) grouped[lead.stage].push(lead);
  return grouped;
}

function LeadCard({ lead, onMove }: { lead: Lead; onMove: (id: string, stage: LeadStage) => void }) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] rounded-xl p-4 transition-colors group">
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{lead.customerName}</p>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Move lead"
            className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 data-[popup-open]:opacity-100 w-6 h-6 rounded-md flex items-center justify-center text-[var(--text-faint)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] transition-opacity flex-shrink-0 focus-ring"
          >
            <MoreHorizontal size={14} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[var(--card)] border border-[var(--border)] min-w-44">
            {LEAD_STAGES.filter((s) => s.value !== lead.stage).map((s) => (
              <DropdownMenuItem key={s.value} onClick={() => onMove(lead.id, s.value)}>
                Move to {s.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-1.5 text-xs text-[var(--text-muted)]">
        <p className="flex items-center gap-1.5">
          <Wallet size={12} /> {lead.budget}
        </p>
        <p className="flex items-center gap-1.5">
          <MapPin size={12} /> {lead.preferredLocation}
        </p>
        <p className="flex items-center gap-1.5">
          <Clock size={12} /> Last activity: {relativeTime(lead.lastActivityAt)}
        </p>
        {lead.nextFollowUpAt && (
          <p className="flex items-center gap-1.5 text-[var(--accent)]">
            <CalendarClock size={12} />
            Follow-up {new Date(lead.nextFollowUpAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </p>
        )}
      </div>
    </div>
  );
}

function AddLeadDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");

  const create = useMutation({
    mutationFn: () =>
      createLead({
        fullName,
        email: email || null,
        phone: phone || null,
        budget: budget || null,
        preferredLocation: preferredLocation || null,
        source: "Manual entry",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-leads"] });
      toast.success("Lead added");
      setFullName("");
      setEmail("");
      setPhone("");
      setBudget("");
      setPreferredLocation("");
      onOpenChange(false);
    },
    onError: () => toast.error("Couldn't add lead"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[var(--card)] border-[var(--border)]">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-primary)]">Add a lead</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate();
          }}
          className="flex flex-col gap-3"
        >
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full name"
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (optional)"
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone (optional)"
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
          />
          <input
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Budget (e.g. GHS 2,000 - 2,800)"
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
          />
          <input
            value={preferredLocation}
            onChange={(e) => setPreferredLocation(e.target.value)}
            placeholder="Preferred location"
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
          />
          <DialogFooter>
            <DialogClose className="px-4 py-2.5 rounded-xl text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              Cancel
            </DialogClose>
            <button
              type="submit"
              disabled={create.isPending}
              className="px-4 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-60 text-white text-sm font-medium transition-colors focus-ring"
            >
              {create.isPending ? "Adding..." : "Add Lead"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function LeadsPipelinePage() {
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const { data: leads = [], isLoading } = useQuery({ queryKey: ["my-leads"], queryFn: listMyLeads });

  const move = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: LeadStage }) => moveLeadStage(id, stage),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-leads"] }),
    onError: () => toast.error("Couldn't move lead"),
  });

  const grouped = groupByStage(leads);

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Leads Pipeline</h1>
          <p className="text-sm text-[var(--text-muted)]">Track every prospect from first contact to close.</p>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4 py-2.5 rounded-xl transition-colors focus-ring flex-shrink-0"
        >
          <Plus size={15} />
          Add Lead
        </button>
      </div>

      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {LEAD_STAGES.map(({ value }) => (
            <div key={value} className="flex-shrink-0 w-72 h-40 rounded-xl bg-[var(--surface)] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          {LEAD_STAGES.map(({ value, label }) => {
            const stageLeads = grouped[value];
            return (
              <div key={value} className="flex-shrink-0 w-72">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--text-faint)]">{label}</h2>
                  <span className="text-xs text-[var(--text-faint)] bg-[var(--surface)] px-2 py-0.5 rounded-full">
                    {stageLeads.length}
                  </span>
                </div>
                <div className="space-y-3 min-h-24">
                  {stageLeads.length === 0 ? (
                    <div className="border border-dashed border-[var(--border)] rounded-xl p-4 text-center">
                      <p className="text-xs text-[var(--text-faint)]">No leads here</p>
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <LeadCard key={lead.id} lead={lead} onMove={(id, stage) => move.mutate({ id, stage })} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddLeadDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
