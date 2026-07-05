"use client";

import { useState } from "react";
import type { AgentPropertyInput } from "@/services/properties/propertyService";

const PROPERTY_TYPES = ["Apartment", "House", "Studio", "Office", "Land"];

interface PropertyFormProps {
  initial?: Partial<AgentPropertyInput>;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (input: AgentPropertyInput) => void;
}

const EMPTY: AgentPropertyInput = {
  title: "",
  description: "",
  propertyType: "Apartment",
  price: 0,
  priceUnit: "month",
  bedrooms: 1,
  bathrooms: 1,
  area: null,
  address: "",
  city: "",
  region: "",
  neighborhood: "",
  amenities: [],
  isFurnished: false,
  safetyScore: null,
  avgCommuteMinutes: null,
};

export function PropertyForm({ initial, submitLabel, submitting, onSubmit }: PropertyFormProps) {
  const [form, setForm] = useState<AgentPropertyInput>({ ...EMPTY, ...initial });
  const [amenitiesText, setAmenitiesText] = useState((initial?.amenities ?? []).join(", "));

  const update = <K extends keyof AgentPropertyInput>(key: K, value: AgentPropertyInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      amenities: amenitiesText
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">Basics</h2>

        <div>
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. Modern 2-Bedroom Apartment in East Legon"
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Description</label>
          <textarea
            required
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            placeholder="Describe the property — layout, condition, standout features..."
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Property type</label>
            <select
              value={form.propertyType}
              onChange={(e) => update("propertyType", e.target.value)}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors"
            >
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Area (m²)</label>
            <input
              type="number"
              min={0}
              value={form.area ?? ""}
              onChange={(e) => update("area", e.target.value ? Number(e.target.value) : null)}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">Pricing</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Price (GHS)</label>
            <input
              required
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => update("price", Number(e.target.value))}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Per</label>
            <select
              value={form.priceUnit}
              onChange={(e) => update("priceUnit", e.target.value as "month" | "year")}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors"
            >
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">Details</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Bedrooms</label>
            <input
              type="number"
              min={0}
              value={form.bedrooms}
              onChange={(e) => update("bedrooms", Number(e.target.value))}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Bathrooms</label>
            <input
              type="number"
              min={0}
              value={form.bathrooms}
              onChange={(e) => update("bathrooms", Number(e.target.value))}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Amenities (comma-separated)</label>
          <input
            value={amenitiesText}
            onChange={(e) => setAmenitiesText(e.target.value)}
            placeholder="24/7 security, Parking, Fitted kitchen, Gated community"
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        <label className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
          <input
            type="checkbox"
            checked={form.isFurnished}
            onChange={(e) => update("isFurnished", e.target.checked)}
            className="w-4 h-4 rounded accent-[var(--accent)]"
          />
          Furnished
        </label>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
              Safety score (0–100, optional)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={form.safetyScore ?? ""}
              onChange={(e) => update("safetyScore", e.target.value ? Number(e.target.value) : null)}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
              Avg. commute (minutes, optional)
            </label>
            <input
              type="number"
              min={0}
              value={form.avgCommuteMinutes ?? ""}
              onChange={(e) => update("avgCommuteMinutes", e.target.value ? Number(e.target.value) : null)}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">Location</h2>
        <div>
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Address</label>
          <input
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Neighbourhood</label>
            <input
              required
              value={form.neighborhood}
              onChange={(e) => update("neighborhood", e.target.value)}
              placeholder="e.g. East Legon"
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">City</label>
            <input
              required
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder="e.g. Accra"
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Region</label>
          <input
            value={form.region}
            onChange={(e) => update("region", e.target.value)}
            placeholder="e.g. Greater Accra"
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-60 text-white px-6 py-3 rounded-xl transition-colors focus-ring"
      >
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
