"use client";

import { useState } from "react";
import { Heart, CalendarPlus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useSavedPropertiesStore, savedPropertiesService } from "@/services/properties/savedPropertiesService";
import { inspectionService } from "@/services/properties/inspectionService";
import type { MockProperty } from "@/services/ai/mockProperties";

export function PropertyDetailActions({ property }: { property: MockProperty }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [date, setDate] = useState("");
  const savedIds = useSavedPropertiesStore((s) => s.savedIds);
  const isSaved = savedIds.includes(property.id);

  const handleSave = () => {
    savedPropertiesService.toggle(property.id);
    toast.success(isSaved ? "Removed from saved properties" : "Saved to your properties");
  };

  const handleRequestInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    inspectionService.request({
      propertyId: property.id,
      propertyTitle: property.title,
      propertyImageUrl: property.imageUrl,
      requestedDate: date,
    });
    toast.success("Inspection requested — we'll notify you once it's confirmed");
    setDialogOpen(false);
    setDate("");
  };

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={handleSave}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] text-sm text-[var(--text-primary)] transition-colors focus-ring"
      >
        <Heart size={15} className={isSaved ? "fill-[var(--accent)] text-[var(--accent)]" : ""} />
        {isSaved ? "Saved" : "Save"}
      </button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--text-primary)]">Request an inspection</DialogTitle>
            <DialogDescription>
              Choose a preferred date for viewing {property.title}. We&apos;ll track its status here.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRequestInspection} className="flex flex-col gap-4">
            <input
              type="date"
              required
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors"
            />
            <DialogFooter>
              <DialogClose className="px-4 py-2.5 rounded-xl text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                Cancel
              </DialogClose>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium transition-colors focus-ring"
              >
                Request Inspection
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium transition-colors focus-ring"
        >
          <CalendarPlus size={15} />
          Book Inspection
        </button>
      </Dialog>
    </div>
  );
}
