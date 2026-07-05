"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Mail, Phone, Wallet, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { customerService, type Customer, type CustomerStatus } from "@/services/customers/customerService";

const STATUS_VARIANT: Record<CustomerStatus, "default" | "secondary" | "outline"> = {
  active: "default",
  prospect: "secondary",
  past: "outline",
};

function NotesField({ customer }: { customer: Customer }) {
  const [notes, setNotes] = useState(() => customerService.getNotes(customer.id));
  const [saved, setSaved] = useState(true);

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-faint)] mb-1.5">Notes</p>
      <textarea
        value={notes}
        onChange={(e) => {
          setNotes(e.target.value);
          setSaved(false);
        }}
        onBlur={() => {
          customerService.setNotes(customer.id, notes);
          setSaved(true);
        }}
        placeholder="Add a note about this customer..."
        rows={2}
        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text-secondary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors resize-none"
      />
      {!saved && <p className="text-[10px] text-[var(--text-faint)] mt-1">Unsaved — saves when you click away</p>}
    </div>
  );
}

function CustomerCard({ customer }: { customer: Customer }) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{customer.name}</p>
          <p className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mt-1">
            <Mail size={11} /> {customer.email}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mt-0.5">
            <Phone size={11} /> {customer.phone}
          </p>
        </div>
        <Badge variant={STATUS_VARIANT[customer.status]} className="capitalize flex-shrink-0">
          {customer.status}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-[var(--text-secondary)] pb-4 border-b border-[var(--border-subtle)]">
        <span className="flex items-center gap-1.5">
          <Wallet size={12} /> GHS {customer.budgetMin.toLocaleString()}–{customer.budgetMax.toLocaleString()}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin size={12} /> {customer.preferredArea}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={12} /> Last contact {new Date(customer.lastContactAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </span>
      </div>

      {customer.interestedProperties.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-faint)] mb-1.5">
            Interested Properties
          </p>
          <div className="flex flex-wrap gap-1.5">
            {customer.interestedProperties.map((p) => (
              <span key={p} className="text-xs text-[var(--text-muted)] bg-[var(--surface)] border border-[var(--border)] px-2.5 py-1 rounded-full">
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-faint)] mb-1.5">Timeline</p>
        <div className="space-y-1.5">
          {customer.timeline.map((entry) => (
            <div key={entry.label} className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-secondary)]">{entry.label}</span>
              <span className="text-[var(--text-faint)]">
                {new Date(entry.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
          ))}
        </div>
      </div>

      <NotesField customer={customer} />
    </div>
  );
}

function CustomersPageContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const customers = customerService.list();
  const filtered = query.trim()
    ? customers.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()) || c.preferredArea.toLowerCase().includes(query.trim().toLowerCase()))
    : customers;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Customers</h1>
        <p className="text-sm text-[var(--text-muted)]">Every renter you&apos;ve worked with, in one place.</p>
      </div>

      <div className="relative max-w-sm mb-6">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or area..."
          className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg pl-9 pr-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl border border-[var(--border)] p-10 text-center">
          <p className="text-sm text-[var(--text-muted)]">No customers match &quot;{query}&quot;.</p>
        </div>
      ) : (
        <div className={cn("grid gap-5", "sm:grid-cols-2 xl:grid-cols-3")}>
          {filtered.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CustomersPage() {
  return (
    <Suspense fallback={null}>
      <CustomersPageContent />
    </Suspense>
  );
}
