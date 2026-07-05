"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Heart, BedDouble, Bath, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSavedPropertiesStore, savedPropertiesService } from "@/services/properties/savedPropertiesService";
import { propertySearchService, type MockProperty } from "@/services/properties/propertySearchService";

export default function SavedPropertiesPage() {
  const savedIds = useSavedPropertiesStore((s) => s.savedIds);
  const toggleSaved = savedPropertiesService.toggle;

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["saved-properties", savedIds],
    queryFn: async () => {
      const results = await Promise.all(savedIds.map((id) => propertySearchService.getById(id)));
      return results.filter((p): p is MockProperty => p !== null);
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Saved Properties</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">
        Properties you&apos;ve saved while searching — revisit them anytime.
      </p>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="aspect-[16/10] rounded-2xl" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="glass rounded-2xl border border-[var(--border)] p-10 text-center">
          <Heart size={28} className="text-[var(--text-faint)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Nothing saved yet — tap the heart on any property to add it here.
          </p>
          <Link
            href="/dashboard"
            className="inline-block text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-5 py-2.5 rounded-xl transition-colors focus-ring"
          >
            Start a search
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden"
            >
              <div className="relative aspect-[16/10]">
                <Image src={property.imageUrl} alt={property.title} fill sizes="400px" className="object-cover" />
                <button
                  type="button"
                  onClick={() => toggleSaved(property.id)}
                  aria-label="Remove from saved"
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[var(--background)]/90 backdrop-blur border border-[var(--border)] flex items-center justify-center focus-ring"
                >
                  <Heart size={15} className="fill-[var(--accent)] text-[var(--accent)]" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{property.title}</h3>
                <p className="flex items-center gap-1 text-xs text-[var(--text-muted)] mb-3">
                  <MapPin size={11} />
                  {property.neighborhood}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-[var(--text-primary)]">
                    {property.currency} {property.price.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                      <BedDouble size={12} /> {property.bedrooms}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath size={12} /> {property.bathrooms}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/dashboard/properties/${property.id}`}
                  className="block text-center text-xs font-medium bg-[var(--surface)] hover:bg-[var(--accent)] hover:text-white text-[var(--text-primary)] px-3 py-2 rounded-lg transition-all focus-ring"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
