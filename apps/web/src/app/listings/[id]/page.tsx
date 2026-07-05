import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BedDouble, Bath, Ruler, ShieldCheck, Clock, MapPin, Sparkles } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { propertySearchService } from "@/services/properties/propertySearchService";

interface PublicListingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicListingDetailPage({ params }: PublicListingDetailPageProps) {
  const { id } = await params;
  const property = await propertySearchService.getById(id);

  if (!property) notFound();

  return (
    <main>
      <Navbar />
      <div className="container-home pt-28 pb-20 max-w-5xl">
        <Link
          href="/listings"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-6 focus-ring rounded-lg"
        >
          <ArrowLeft size={16} />
          Back to listings
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
              {property.area > 0 && (
                <span className="flex items-center gap-1.5">
                  <Ruler size={15} /> {property.area}m²
                </span>
              )}
            </div>

            {property.description && (
              <div className="mb-8 glass rounded-2xl border border-[var(--border)] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-[var(--accent)]" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Overview</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{property.description}</p>
              </div>
            )}

            {property.amenities.length > 0 && (
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
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="glass rounded-2xl border border-[var(--border)] p-5 sticky top-24 space-y-5">
              <div>
                <span className="text-2xl font-bold text-[var(--text-primary)]">
                  {property.currency} {property.price.toLocaleString()}
                </span>
                <span className="text-xs text-[var(--text-faint)]"> / {property.priceUnit}</span>
              </div>

              <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-subtle)]">
                <Avatar className="w-9 h-9">
                  <AvatarFallback className="bg-[var(--accent)] text-white text-xs">
                    {property.landlordName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
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

              <Link
                href="/signup"
                className="block text-center text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4 py-2.5 rounded-xl transition-colors focus-ring"
              >
                Sign up to save or request a viewing
              </Link>
              <p className="text-xs text-center text-[var(--text-faint)]">
                Already have an account?{" "}
                <Link href="/signin" className="text-[var(--accent)] hover:text-[var(--accent-hover)]">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
