"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, BedDouble, Bath, ShieldCheck, Sparkles, Heart, ArrowRight } from "lucide-react";
import { type Property } from "@/types/property";

const featuredProperties: Property[] = [
  {
    id: "prop-001",
    title: "Modern Apartment in East Legon",
    location: "Accra, Ghana",
    neighborhood: "East Legon",
    price: 2800,
    priceUnit: "month",
    currency: "GHS",
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    tags: ["Air Conditioned", "Parking", "Security"],
    isVerified: true,
    isAIMatched: true,
    agentName: "Kwame Mensah",
    agentAvatar: "https://i.pravatar.cc/40?img=3",
  },
  {
    id: "prop-002",
    title: "Executive Studio — Airport Residential",
    location: "Accra, Ghana",
    neighborhood: "Airport Residential",
    price: 1900,
    priceUnit: "month",
    currency: "GHS",
    bedrooms: 1,
    bathrooms: 1,
    area: 58,
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    tags: ["Furnished", "Fiber Internet", "Gym"],
    isVerified: true,
    isAIMatched: false,
    agentName: "Abena Boateng",
    agentAvatar: "https://i.pravatar.cc/40?img=5",
  },
  {
    id: "prop-003",
    title: "Spacious Family House — Cantonments",
    location: "Accra, Ghana",
    neighborhood: "Cantonments",
    price: 6500,
    priceUnit: "month",
    currency: "GHS",
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    tags: ["Garden", "Pool", "Security"],
    isVerified: true,
    isAIMatched: true,
    agentName: "Kofi Asante",
    agentAvatar: "https://i.pravatar.cc/40?img=8",
  },
];

function PropertyCard({
  property,
  index,
}: {
  property: Property;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="group relative bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden hover:border-[var(--accent)] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.4),0_0_30px_var(--accent-glow)] hover:-translate-y-1 card-shine"
      aria-label={`Property: ${property.title}`}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-[var(--surface)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={property.imageUrl}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] via-transparent to-transparent opacity-60" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.isVerified && (
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide bg-[var(--card)] text-[var(--success)] border border-[var(--success)] border-opacity-30 px-2.5 py-1 rounded-full backdrop-blur-sm">
              <ShieldCheck size={10} />
              Verified
            </span>
          )}
          {property.isAIMatched && (
            <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide bg-[var(--accent)] text-white px-2.5 py-1 rounded-full">
              <Sparkles size={10} />
              AI Pick
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center text-[var(--text-muted)] hover:text-rose-400 transition-colors focus-ring"
          aria-label={`Save ${property.title} to favorites`}
        >
          <Heart size={15} />
        </button>

        {/* Price overlay at bottom of image */}
        <div className="absolute bottom-3 left-4">
          <div className="text-white font-bold text-lg drop-shadow-lg">
            GHS {property.price.toLocaleString()}
            <span className="text-xs font-normal text-white/70">
              &nbsp;/ {property.priceUnit}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-semibold text-[var(--text-primary)] text-base mb-1.5 line-clamp-1">
          {property.title}
        </h3>

        <div className="flex items-center gap-1.5 text-[var(--text-muted)] text-xs mb-4">
          <MapPin size={11} />
          <span>{property.neighborhood}, {property.location}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mb-4">
          <div className="flex items-center gap-1.5">
            <BedDouble size={14} className="text-[var(--text-muted)]" />
            <span>{property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath size={14} className="text-[var(--text-muted)]" />
            <span>{property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}</span>
          </div>
          <div className="text-[var(--text-muted)] text-xs ml-auto">
            {property.area} m²
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {property.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-1 rounded-md bg-[var(--surface)] text-[var(--text-faint)] border border-[var(--border-subtle)]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Agent + CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={property.agentAvatar}
              alt={property.agentName}
              className="w-7 h-7 rounded-full border border-[var(--border)]"
            />
            <span className="text-xs text-[var(--text-muted)]">{property.agentName}</span>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors focus-ring rounded-lg px-1 py-1">
            View <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default function FeaturedListings() {
  return (
    <section id="featured" className="py-24 md:py-32 bg-[var(--surface)] relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 20% 60%, rgba(124,106,247,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="container-home relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              <span className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">
                Featured Properties
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              <span className="text-[var(--text-primary)]">Curated homes,</span>
              <br />
              <span className="gradient-text">just for you.</span>
            </h2>
          </div>
          <p className="text-[var(--text-muted)] text-sm max-w-xs md:text-right leading-relaxed">
            Every listing is verified by our team before going live. No fake
            properties, no scams.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>

        {/* Browse all CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/listings"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] hover:bg-[var(--card)] transition-all duration-300 text-sm font-medium focus-ring"
          >
            Browse all properties
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
