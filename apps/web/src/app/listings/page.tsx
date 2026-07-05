import Link from "next/link";
import Image from "next/image";
import { MapPin, BedDouble, Bath, ShieldCheck, Home } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { propertySearchService } from "@/services/properties/propertySearchService";

export default async function PublicListingsPage() {
  const properties = await propertySearchService.listPublished();

  return (
    <main>
      <Navbar />
      <div className="container-home pt-32 pb-20 min-h-screen">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)] mb-2">
            Browse Properties
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Every verified listing currently available on nowe.ai.
          </p>
        </div>

        {properties.length === 0 ? (
          <div className="glass rounded-2xl border border-[var(--border)] p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[var(--surface)] flex items-center justify-center mx-auto mb-4">
              <Home size={24} className="text-[var(--accent)]" />
            </div>
            <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2">No listings published yet</h2>
            <p className="text-sm text-[var(--text-muted)] max-w-sm mx-auto mb-5">
              Agents are onboarding — check back soon, or sign up to be notified when new homes go live.
            </p>
            <Link
              href="/signup"
              className="inline-block text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-5 py-2.5 rounded-xl transition-colors focus-ring"
            >
              Create an account
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Link
                key={property.id}
                href={`/listings/${property.id}`}
                className="group bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] rounded-2xl overflow-hidden transition-colors"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={property.imageUrl}
                    alt={property.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {property.isVerified && (
                    <span className="absolute top-3 left-3 flex items-center gap-1 text-[11px] font-medium bg-[var(--background)]/90 backdrop-blur text-[var(--text-primary)] px-2.5 py-1 rounded-full border border-[var(--border)]">
                      <ShieldCheck size={11} className="text-[var(--success)]" />
                      Verified
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1 truncate">{property.title}</h3>
                  <p className="flex items-center gap-1 text-xs text-[var(--text-muted)] mb-3">
                    <MapPin size={11} />
                    {property.neighborhood}, {property.location}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[var(--text-primary)]">
                      {property.currency} {property.price.toLocaleString()}
                      <span className="text-xs font-normal text-[var(--text-faint)]">/{property.priceUnit}</span>
                    </span>
                    <div className="flex items-center gap-2.5 text-xs text-[var(--text-muted)]">
                      <span className="flex items-center gap-1">
                        <BedDouble size={12} /> {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath size={12} /> {property.bathrooms}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
