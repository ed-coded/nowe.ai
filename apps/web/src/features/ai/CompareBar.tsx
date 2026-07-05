"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { X, Scale } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCompareStore } from "@/store/compareStore";
import { propertySearchService, type MockProperty } from "@/services/properties/propertySearchService";

const ROWS: { label: string; render: (p: MockProperty) => React.ReactNode }[] = [
  { label: "Price", render: (p) => `${p.currency} ${p.price.toLocaleString()}/${p.priceUnit}` },
  { label: "Neighbourhood", render: (p) => p.neighborhood },
  { label: "Bedrooms", render: (p) => p.bedrooms },
  { label: "Bathrooms", render: (p) => p.bathrooms },
  { label: "Area", render: (p) => `${p.area}m²` },
  { label: "Safety Score", render: (p) => `${p.baseSafetyScore}/100` },
  { label: "Commute", render: (p) => `${p.baseCommuteMinutes} min` },
  { label: "Amenities", render: (p) => p.amenities.join(", ") },
];

export function CompareBar() {
  const ids = useCompareStore((s) => s.ids);
  const toggle = useCompareStore((s) => s.toggle);
  const clear = useCompareStore((s) => s.clear);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: properties = [] } = useQuery({
    queryKey: ["compare-properties", ids],
    queryFn: async () => {
      const results = await Promise.all(ids.map((id) => propertySearchService.getById(id)));
      return results.filter((p): p is MockProperty => p !== null);
    },
    enabled: ids.length >= 2,
  });

  if (ids.length < 2) return null;

  return (
    <>
      <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-[var(--card)] border border-[var(--border)] rounded-full shadow-lg px-2 py-2 pl-4">
        <span className="text-xs font-medium text-[var(--text-primary)] flex items-center gap-1.5">
          <Scale size={13} className="text-[var(--accent)]" />
          Compare ({ids.length})
        </span>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="text-xs font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4 py-1.5 rounded-full transition-colors focus-ring"
        >
          View
        </button>
        <button
          type="button"
          onClick={clear}
          aria-label="Clear comparison"
          className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-faint)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors focus-ring"
        >
          <X size={14} />
        </button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)] max-w-2xl sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[var(--text-primary)]">Compare Properties</DialogTitle>
          </DialogHeader>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-xs text-[var(--text-faint)] font-medium pb-3 pr-3 w-28">
                    &nbsp;
                  </th>
                  {properties.map((p) => (
                    <th key={p.id} className="text-left pb-3 pr-3 min-w-36">
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-1.5">
                        <Image src={p.imageUrl} alt={p.title} fill sizes="200px" className="object-cover" />
                      </div>
                      <span className="text-xs font-semibold text-[var(--text-primary)] block truncate">
                        {p.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggle(p.id)}
                        className="text-[10px] text-[var(--text-faint)] hover:text-rose-400 mt-0.5"
                      >
                        Remove
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map(({ label, render }) => (
                  <tr key={label} className="border-t border-[var(--border-subtle)]">
                    <td className="text-xs text-[var(--text-faint)] py-2.5 pr-3 align-top">{label}</td>
                    {properties.map((p) => (
                      <td key={p.id} className="text-xs text-[var(--text-secondary)] py-2.5 pr-3 align-top">
                        {render(p)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
