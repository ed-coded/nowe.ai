"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, ArrowRight } from "lucide-react";

const placeholders = [
  "A modern 2-bedroom apartment in East Legon...",
  "A quiet studio near Cantonments for remote work...",
  "Family house close to good schools in Accra...",
  "Affordable furnished flat near the airport...",
  "Penthouse with a view in Airport Residential...",
];

function AnimatedGradientBlob({
  className,
}: {
  className: string;
}) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      animate={{
        scale: [1, 1.15, 0.95, 1],
        opacity: [0.4, 0.55, 0.35, 0.4],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const [typedForIdx, setTypedForIdx] = useState(placeholderIdx);

  const rotatePlaceholder = useCallback(() => {
    setPlaceholderIdx((prev) => (prev + 1) % placeholders.length);
  }, []);

  // Reset the typed text the moment placeholderIdx changes, computed during
  // render rather than in the effect below — React's documented pattern
  // for "adjusting state when a prop changes"
  // (https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes).
  // React re-runs the component immediately when this fires, before the
  // browser paints, so the reset is visually instantaneous — identical
  // timing to the previous effect-based reset.
  if (placeholderIdx !== typedForIdx) {
    setTypedForIdx(placeholderIdx);
    setDisplayedPlaceholder("");
  }

  useEffect(() => {
    if (isTyping) return;
    const interval = setInterval(rotatePlaceholder, 3500);
    return () => clearInterval(interval);
  }, [isTyping, rotatePlaceholder]);

  useEffect(() => {
    const target = placeholders[placeholderIdx];
    let i = 0;

    const typeTimeout = setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (i <= target.length) {
          setDisplayedPlaceholder(target.slice(0, i));
          i++;
        } else {
          clearInterval(typeInterval);
        }
      }, 28);
      return () => clearInterval(typeInterval);
    }, 400);

    return () => clearTimeout(typeTimeout);
  }, [placeholderIdx]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden dot-grid pt-16">
      {/* Gradient blobs */}
      <AnimatedGradientBlob className="w-[600px] h-[600px] -top-40 -left-60 bg-[var(--accent)] opacity-10" />
      <AnimatedGradientBlob className="w-[500px] h-[500px] top-20 -right-60 bg-purple-500 opacity-8" />
      <AnimatedGradientBlob className="w-[400px] h-[400px] bottom-0 left-1/3 bg-indigo-500 opacity-8" />

      {/* Radial spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 30%, rgba(124,106,247,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="container-home relative z-10 text-center pt-24 pb-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[var(--accent)] border-opacity-30 mb-8"
        >
          <Sparkles size={14} className="text-[var(--accent)]" />
          <span className="text-xs font-medium text-[var(--text-muted)] tracking-wide uppercase">
            AI-Powered Property Discovery · Ghana
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6"
        >
          <span className="gradient-text">Describe your</span>
          <br />
          <span className="text-[var(--text-primary)]">ideal home.</span>
          <br />
          <span className="gradient-text-subtle text-4xl md:text-6xl font-semibold">
            We&apos;ll find it.
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.35 }}
          className="text-base md:text-lg text-[var(--text-muted)] max-w-xl mx-auto mb-12 leading-relaxed"
        >
          Skip the endless scrolling. Tell us what you want in plain language —
          our AI understands your intent and returns the homes that truly match.
        </motion.p>

        {/* Search bar */}
        <motion.form
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.45 }}
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto mb-6"
        >
          <div className="relative group">
            {/* Glow ring on focus */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[var(--accent)] via-purple-500 to-indigo-500 opacity-0 group-focus-within:opacity-40 transition-opacity duration-300 blur-sm" />

            <div className="relative glass rounded-2xl border border-[var(--border)] group-focus-within:border-[var(--accent)] transition-colors duration-300 overflow-hidden">
              <div className="flex items-center">
                <div className="pl-5 pr-3 flex-shrink-0">
                  <Search
                    size={20}
                    className="text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors"
                  />
                </div>
                <div className="flex-1 relative py-4 pr-2">
                  <input
                    type="text"
                    id="hero-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsTyping(true)}
                    onBlur={() => setIsTyping(query.length > 0)}
                    className="w-full bg-transparent text-[var(--text-primary)] text-base outline-none placeholder:text-transparent"
                    aria-label="Describe your ideal home"
                    autoComplete="off"
                  />
                  {/* Animated placeholder */}
                  {!query && !isTyping && (
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={placeholderIdx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center text-[var(--text-faint)] text-base pointer-events-none"
                        aria-hidden="true"
                      >
                        {displayedPlaceholder}
                        <span className="inline-block w-[2px] h-[1em] bg-[var(--accent)] ml-[1px] animate-pulse" />
                      </motion.span>
                    </AnimatePresence>
                  )}
                </div>
                <div className="pr-2 py-2 flex-shrink-0">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium px-5 py-3 rounded-xl transition-all duration-200 hover:shadow-[0_0_24px_var(--accent-glow-strong)] focus-ring"
                    aria-label="Search properties"
                  >
                    <span className="hidden sm:inline">Find Homes</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.form>

        {/* Example queries */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-2 mb-16"
        >
          {[
            "2-bed in East Legon",
            "Near Airport Residential",
            "Student apartment Legon",
            "Furnished studio",
          ].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setQuery(tag);
                setIsTyping(true);
              }}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--surface)] hover:bg-[var(--card)] border border-[var(--border)] px-3 py-1.5 rounded-full transition-all duration-200 focus-ring"
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.75 }}
          className="flex flex-wrap justify-center gap-8 md:gap-16"
        >
          {[
            { value: "1,200+", label: "Verified Listings" },
            { value: "340+", label: "Trusted Agents" },
            { value: "8,000+", label: "Happy Renters" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold gradient-text">{value}</div>
              <div className="text-xs text-[var(--text-faint)] mt-0.5 uppercase tracking-wider">
                {label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-t from-[var(--background)] to-transparent" />
    </section>
  );
}
