"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  BedDouble,
  Bath,
  Ruler,
  ShieldCheck,
  Sparkles,
  Heart,
  MapPin,
  Clock,
  CheckCircle2,
  Scale,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buildRecommendationSummary, type ScoredProperty } from "@/services/ai/scoreProperty";
import { useCompareStore, MAX_COMPARE } from "@/store/compareStore";

interface PropertyResultCardProps {
  property: ScoredProperty;
  isSaved?: boolean;
  onToggleSave?: (propertyId: string) => void;
  index?: number;
}

export function PropertyResultCard({
  property,
  isSaved = false,
  onToggleSave,
  index = 0,
}: PropertyResultCardProps) {
  const compareIds = useCompareStore((s) => s.ids);
  const toggleCompare = useCompareStore((s) => s.toggle);
  const isComparing = compareIds.includes(property.id);
  const compareDisabled = !isComparing && compareIds.length >= MAX_COMPARE;

  const handleShare = async () => {
    const url = `${window.location.origin}/dashboard/properties/${property.id}`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: property.title, url });
      } catch {
        // user cancelled the native share sheet — no-op
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--accent)] transition-colors"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={property.imageUrl}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {property.isVerified && (
            <span className="flex items-center gap-1 text-[11px] font-medium bg-[var(--background)]/90 backdrop-blur text-[var(--text-primary)] px-2.5 py-1 rounded-full border border-[var(--border)]">
              <ShieldCheck size={12} className="text-[var(--success)]" />
              Verified
            </span>
          )}
          {property.tags.some((t) => t.toLowerCase().includes("furnish")) && (
            <span className="text-[11px] font-medium bg-[var(--background)]/90 backdrop-blur text-[var(--text-primary)] px-2.5 py-1 rounded-full border border-[var(--border)]">
              Furnished
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-semibold bg-[var(--accent)] text-white px-2.5 py-1 rounded-full">
          <Sparkles size={11} />
          {property.matchScore}% Match
        </div>
        <button
          type="button"
          onClick={() => onToggleSave?.(property.id)}
          aria-label={isSaved ? "Remove from saved" : "Save property"}
          aria-pressed={isSaved}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[var(--background)]/90 backdrop-blur border border-[var(--border)] flex items-center justify-center hover:border-[var(--accent)] transition-colors focus-ring"
        >
          <Heart
            size={15}
            className={cn(
              "transition-colors",
              isSaved ? "fill-[var(--accent)] text-[var(--accent)]" : "text-[var(--text-muted)]"
            )}
          />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug">
            {property.title}
          </h3>
        </div>
        <p className="flex items-center gap-1 text-xs text-[var(--text-muted)] mb-3">
          <MapPin size={12} />
          {property.neighborhood}, {property.location}
        </p>

        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-lg font-bold text-[var(--text-primary)]">
            {property.currency} {property.price.toLocaleString()}
          </span>
          <span className="text-xs text-[var(--text-faint)]">/ {property.priceUnit}</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] mb-4 pb-4 border-b border-[var(--border-subtle)]">
          <span className="flex items-center gap-1">
            <BedDouble size={13} /> {property.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath size={13} /> {property.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Ruler size={13} /> {property.area}m²
          </span>
          <span className="flex items-center gap-1">
            <Clock size={13} /> {property.commuteMinutes} min
          </span>
        </div>

        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-faint)] mb-2">
            Why AI picked this
          </p>
          <p className="text-xs text-[var(--text-secondary)] mb-2.5 leading-relaxed">
            {buildRecommendationSummary(property.matchReasons)}
          </p>
          <ul className="space-y-1.5">
            {property.matchReasons.slice(0, 3).map((reason) => (
              <li key={reason} className="flex items-start gap-1.5 text-xs text-[var(--text-secondary)]">
                <CheckCircle2 size={13} className="text-[var(--success)] flex-shrink-0 mt-0.5" />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/properties/${property.id}`}
            className="flex-1 block text-center text-sm font-medium bg-[var(--surface)] hover:bg-[var(--accent)] hover:text-white text-[var(--text-primary)] px-4 py-2.5 rounded-xl transition-all duration-200 focus-ring"
          >
            View Details
          </Link>
          <button
            type="button"
            onClick={() => toggleCompare(property.id)}
            disabled={compareDisabled}
            aria-label={isComparing ? "Remove from comparison" : "Add to comparison"}
            aria-pressed={isComparing}
            className={cn(
              "w-9 h-9 flex-shrink-0 rounded-xl border flex items-center justify-center transition-colors focus-ring",
              isComparing
                ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]",
              compareDisabled && "opacity-40 cursor-not-allowed"
            )}
          >
            <Scale size={15} />
          </button>
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share property"
            className="w-9 h-9 flex-shrink-0 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--text-primary)] flex items-center justify-center transition-colors focus-ring"
          >
            <Share2 size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
