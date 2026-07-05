import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BedDouble,
  Bath,
  Ruler,
  ShieldCheck,
  Clock,
  MapPin,
  Sparkles,
} from "lucide-react";
import { getMockPropertyById } from "@/services/ai/searchProperties";
import { PropertyDetailActions } from "@/features/ai/PropertyDetailActions";

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params;
  const property = getMockPropertyById(id);

  if (!property) notFound();

  return (
    <div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-6 focus-ring rounded-lg"
      >
        <ArrowLeft size={16} />
        Back to search
      </Link>

      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6 border border-[var(--border)]">
        <Image src={property.imageUrl} alt={property.title} fill sizes="100vw" className="object-cover" />
        {property.isVerified && (
          <span className="absolute top-4 left-4 flex items-center gap-1 text-xs font-medium bg-[var(--background)]/90 backdrop-blur text-[var(--text-primary)] px-3 py-1.5 rounded-full border border-[var(--border)]">
            <ShieldCheck size={13} className="text-[var(--success)]" />
            Verified Listing
          </span>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-2 tracking-tight">
            {property.title}
          </h1>
          <p className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] mb-4">
            <MapPin size={14} />
            {property.neighborhood}, {property.location}
          </p>

          <div className="flex items-center gap-6 text-sm text-[var(--text-secondary)] mb-6 pb-6 border-b border-[var(--border)]">
            <span className="flex items-center gap-1.5">
              <BedDouble size={15} /> {property.bedrooms} beds
            </span>
            <span className="flex items-center gap-1.5">
              <Bath size={15} /> {property.bathrooms} baths
            </span>
            <span className="flex items-center gap-1.5">
              <Ruler size={15} /> {property.area}m²
            </span>
          </div>

          <div className="mb-8 glass rounded-2xl border border-[var(--border)] p-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-[var(--accent)]" />
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
                AI Summary
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              This {property.bedrooms}-bedroom home in {property.neighborhood} has a safety rating of{" "}
              {property.baseSafetyScore}/100 and an estimated {property.baseCommuteMinutes}-minute
              commute to the city center. {property.description}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="text-xs text-[var(--text-muted)] bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 rounded-full"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Neighbourhood &amp; Map</h2>
            <div className="aspect-[21/9] rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-xs text-[var(--text-faint)]">
              Map preview coming soon
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="glass rounded-2xl border border-[var(--border)] p-5 sticky top-6 space-y-5">
            <div>
              <span className="text-2xl font-bold text-[var(--text-primary)]">
                {property.currency} {property.price.toLocaleString()}
              </span>
              <span className="text-xs text-[var(--text-faint)]"> / {property.priceUnit}</span>
            </div>

            <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-subtle)]">
              <Image
                src={property.landlordAvatar}
                alt={property.landlordName}
                width={36}
                height={36}
                className="rounded-full"
              />
              <div>
                <p className="text-sm text-[var(--text-primary)] font-medium">{property.landlordName}</p>
                <p className="text-xs text-[var(--text-faint)]">Listing agent</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-[var(--surface)] rounded-xl py-3">
                <p className="text-lg font-bold text-[var(--success)]">{property.baseSafetyScore}</p>
                <p className="text-[10px] text-[var(--text-faint)] uppercase tracking-wide">Safety Score</p>
              </div>
              <div className="bg-[var(--surface)] rounded-xl py-3">
                <p className="flex items-center justify-center gap-1 text-lg font-bold text-[var(--text-primary)]">
                  <Clock size={14} />
                  {property.baseCommuteMinutes}
                </p>
                <p className="text-[10px] text-[var(--text-faint)] uppercase tracking-wide">Min Commute</p>
              </div>
            </div>

            <PropertyDetailActions property={property} />

            <a
              href={`mailto:hello@nowe.ai?subject=Inquiry about ${encodeURIComponent(property.title)}`}
              className="block text-center text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              Contact agent
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
