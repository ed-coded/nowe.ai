"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PropertyForm } from "@/features/agent/PropertyForm";
import { PropertyMediaManager } from "@/features/agent/PropertyMediaManager";
import {
  updateProperty,
  setPropertyStatus,
  type AgentProperty,
  type AgentPropertyInput,
  type PropertyStatus,
} from "@/services/properties/propertyService";

const STATUS_STYLES: Record<PropertyStatus, string> = {
  draft: "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]",
  published: "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20",
  archived: "bg-rose-400/10 text-rose-400 border-rose-400/20",
};

export function EditListingClient({ property }: { property: AgentProperty }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (input: AgentPropertyInput) => {
    setSubmitting(true);
    try {
      await updateProperty(property.id, input);
      toast.success("Listing updated");
      router.refresh();
    } catch {
      toast.error("Couldn't update listing");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = (status: PropertyStatus) => {
    if (status === "published" && property.media.length === 0) {
      toast.error("Add at least one photo before publishing");
      return;
    }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Edit Listing</h1>
          <span className={cn("inline-block text-[11px] font-medium capitalize px-2.5 py-1 rounded-full border", STATUS_STYLES[property.status])}>
            {property.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {property.status !== "published" && (
            <button
              type="button"
              onClick={() => handleStatusChange("published")}
              disabled={isPending}
              className="text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-60 text-white px-4 py-2 rounded-xl transition-colors focus-ring"
            >
              Publish
            </button>
          )}
          {property.status === "published" && (
            <button
              type="button"
              onClick={() => handleStatusChange("draft")}
              disabled={isPending}
              className="text-sm font-medium bg-[var(--surface)] hover:bg-[var(--card)] border border-[var(--border)] disabled:opacity-60 text-[var(--text-primary)] px-4 py-2 rounded-xl transition-colors focus-ring"
            >
              Unpublish
            </button>
          )}
          {property.status !== "archived" && (
            <button
              type="button"
              onClick={() => handleStatusChange("archived")}
              disabled={isPending}
              className="text-sm font-medium bg-[var(--surface)] hover:bg-[var(--card)] border border-[var(--border)] disabled:opacity-60 text-[var(--text-primary)] px-4 py-2 rounded-xl transition-colors focus-ring"
            >
              Archive
            </button>
          )}
        </div>
      </div>

      <PropertyMediaManager propertyId={property.id} />

      <PropertyForm
        submitLabel="Save Changes"
        submitting={submitting}
        onSubmit={handleSubmit}
        initial={{
          title: property.title,
          description: property.description,
          propertyType: property.propertyType,
          price: property.price,
          priceUnit: property.priceUnit,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area: property.area,
          address: property.address,
          city: property.city,
          region: property.region,
          neighborhood: property.neighborhood,
          amenities: property.amenities,
          isFurnished: property.isFurnished,
          safetyScore: property.safetyScore,
          avgCommuteMinutes: property.avgCommuteMinutes,
        }}
      />
    </div>
  );
}
