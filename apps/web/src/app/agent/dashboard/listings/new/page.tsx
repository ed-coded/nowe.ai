"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PropertyForm } from "@/features/agent/PropertyForm";
import { createProperty, type AgentPropertyInput } from "@/services/properties/propertyService";

export default function NewListingPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (input: AgentPropertyInput) => {
    setSubmitting(true);
    try {
      const id = await createProperty(input);
      toast.success("Listing created as a draft — add photos and publish when ready.");
      router.push(`/agent/dashboard/listings/${id}/edit`);
    } catch {
      toast.error("Couldn't create listing");
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">New Listing</h1>
        <p className="text-sm text-[var(--text-muted)]">
          It&apos;s saved as a draft first — you can add photos and publish from the next screen.
        </p>
      </div>

      <PropertyForm submitLabel="Create Listing" submitting={submitting} onSubmit={handleSubmit} />
    </div>
  );
}
