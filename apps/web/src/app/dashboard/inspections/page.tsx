"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { listMyInspections } from "@/services/properties/inspectionService";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
  completed: "outline",
};

export default function InspectionsPage() {
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["my-inspections"],
    queryFn: listMyInspections,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Inspection Requests</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">
        Track the viewings you&apos;ve requested and their status.
      </p>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="glass rounded-2xl border border-[var(--border)] p-10 text-center">
          <CalendarClock size={28} className="text-[var(--text-faint)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)] mb-4">
            No inspections requested yet — book one from a property&apos;s detail page.
          </p>
          <Link
            href="/dashboard"
            className="inline-block text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-5 py-2.5 rounded-xl transition-colors focus-ring"
          >
            Start a search
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex items-center gap-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4"
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--surface)]">
                {request.propertyImageUrl && (
                  <Image src={request.propertyImageUrl} alt={request.propertyTitle} fill sizes="64px" className="object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/dashboard/properties/${request.propertyId}`}
                  className="text-sm font-semibold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors truncate block"
                >
                  {request.propertyTitle}
                </Link>
                <p className="text-xs text-[var(--text-muted)]">
                  Requested for {new Date(request.requestedDate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <Badge variant={STATUS_VARIANT[request.status]} className="capitalize flex-shrink-0">
                {request.status}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
