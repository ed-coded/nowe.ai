"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash2, Eye, EyeOff, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setPropertyStatus, deleteProperty, type AgentProperty } from "@/services/properties/propertyService";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]",
  published: "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20",
  archived: "bg-rose-400/10 text-rose-400 border-rose-400/20",
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80";

export function ListingCard({ property }: { property: AgentProperty }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const coverImage = property.media[0]?.fileUrl ?? FALLBACK_IMAGE;

  const handleStatusChange = (status: "draft" | "published" | "archived") => {
    startTransition(async () => {
      try {
        await setPropertyStatus(property.id, status);
        router.refresh();
        toast.success(status === "published" ? "Listing published" : status === "archived" ? "Listing archived" : "Listing moved to draft");
      } catch {
        toast.error("Couldn't update listing status");
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteProperty(property.id);
        router.refresh();
        toast.success("Listing deleted");
      } catch {
        toast.error("Couldn't delete listing");
      }
    });
  };

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="relative aspect-[16/10] bg-[var(--surface)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={coverImage} alt={property.title} className="w-full h-full object-cover" />
        <span className={cn("absolute top-3 left-3 text-[11px] font-medium capitalize px-2.5 py-1 rounded-full border", STATUS_STYLES[property.status])}>
          {property.status}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1 truncate">{property.title}</h3>
        <p className="text-xs text-[var(--text-muted)] mb-3">{property.neighborhood || property.city}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[var(--text-primary)]">
            {property.currency} {property.price.toLocaleString()}
            <span className="text-xs font-normal text-[var(--text-faint)]">/{property.priceUnit}</span>
          </span>

          {confirmingDelete ? (
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleDelete} disabled={isPending} className="text-xs font-medium text-rose-400 hover:text-rose-300">
                Delete
              </button>
              <button type="button" onClick={() => setConfirmingDelete(false)} className="text-xs text-[var(--text-faint)] hover:text-[var(--text-muted)]">
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Link
                href={`/agent/dashboard/listings/${property.id}/edit`}
                aria-label="Edit listing"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors focus-ring"
              >
                <Pencil size={13} />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="Listing options"
                  disabled={isPending}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors focus-ring"
                >
                  <MoreHorizontal size={14} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[var(--card)] border border-[var(--border)] min-w-44">
                  {property.status !== "published" && (
                    <DropdownMenuItem onClick={() => handleStatusChange("published")}>
                      <Eye size={13} /> Publish
                    </DropdownMenuItem>
                  )}
                  {property.status === "published" && (
                    <DropdownMenuItem onClick={() => handleStatusChange("draft")}>
                      <EyeOff size={13} /> Unpublish
                    </DropdownMenuItem>
                  )}
                  {property.status !== "archived" && (
                    <DropdownMenuItem onClick={() => handleStatusChange("archived")}>
                      <Archive size={13} /> Archive
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem variant="destructive" onClick={() => setConfirmingDelete(true)}>
                    <Trash2 size={13} /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
