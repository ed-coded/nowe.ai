import Link from "next/link";
import { Plus, Home } from "lucide-react";
import { listMyProperties } from "@/services/properties/propertyService";
import { ListingCard } from "@/features/agent/ListingCard";

export default async function ListingsPage() {
  const properties = await listMyProperties();

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Listings</h1>
          <p className="text-sm text-[var(--text-muted)]">Manage your property listings — create, edit, and publish.</p>
        </div>
        <Link
          href="/agent/dashboard/listings/new"
          className="flex items-center gap-1.5 text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4 py-2.5 rounded-xl transition-colors focus-ring flex-shrink-0"
        >
          <Plus size={15} />
          New Listing
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="glass rounded-2xl border border-[var(--border)] p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[var(--surface)] flex items-center justify-center mx-auto mb-4">
            <Home size={24} className="text-[var(--accent)]" />
          </div>
          <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">No listings yet</h2>
          <p className="text-sm text-[var(--text-muted)] max-w-sm mx-auto mb-5">
            Create your first listing to start appearing in renter searches.
          </p>
          <Link
            href="/agent/dashboard/listings/new"
            className="inline-flex items-center gap-1.5 text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-5 py-2.5 rounded-xl transition-colors focus-ring"
          >
            <Plus size={15} />
            Create Listing
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.map((property) => (
            <ListingCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
