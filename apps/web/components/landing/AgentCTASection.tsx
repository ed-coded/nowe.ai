"use client";

import { motion } from "framer-motion";
import { Search, ArrowRight, Building, ClipboardCheck, Star, Zap } from "lucide-react";

const renterFeatures = [
  { icon: Search, text: "Describe homes naturally in plain language" },
  { icon: Zap, text: "Get 5 AI-curated matches instantly" },
  { icon: Star, text: "Save favorites and book viewings" },
];

const agentFeatures = [
  { icon: Building, text: "Upload and manage your property listings" },
  { icon: ClipboardCheck, text: "Get verified and build your reputation" },
  { icon: Zap, text: "Connect with serious, intent-driven renters" },
];

export default function AgentCTASection() {
  return (
    <section id="agents" className="py-24 md:py-32 bg-[var(--surface)] relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,106,247,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="container-home relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-[var(--text-primary)]">One platform.</span>
            <br />
            <span className="gradient-text">Two powerful experiences.</span>
          </h2>
          <p className="text-[var(--text-muted)] text-base max-w-md mx-auto">
            Whether you&apos;re searching for a home or listing one — Home is designed for you.
          </p>
        </motion.div>

        {/* Dual panel grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Renter panel */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="relative gradient-border p-8 md:p-10 group overflow-hidden"
          >
            {/* BG accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)] opacity-5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent)] bg-opacity-10 border border-[var(--accent)] border-opacity-20 flex items-center justify-center mb-6">
                <Search size={22} className="text-[var(--accent)]" />
              </div>

              <div className="inline-block text-xs font-semibold uppercase tracking-wider text-[var(--accent)] bg-[var(--accent)] bg-opacity-10 border border-[var(--accent)] border-opacity-20 rounded-full px-3 py-1 mb-4">
                For Renters
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">
                Find your perfect home
              </h3>
              <p className="text-[var(--text-muted)] text-sm mb-8 leading-relaxed max-w-sm">
                Stop scrolling through hundreds of listings. Describe what you
                want and let our AI do the work. We return only the homes that
                truly match.
              </p>

              <ul className="space-y-3 mb-10">
                {renterFeatures.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
                      <Icon size={13} className="text-[var(--accent)]" />
                    </div>
                    <span className="text-sm text-[var(--text-secondary)]">{text}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className="inline-flex items-center gap-2.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium text-sm px-7 py-3.5 rounded-xl transition-all duration-200 hover:shadow-[0_0_28px_var(--accent-glow-strong)] focus-ring"
              >
                Start searching
                <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>

          {/* Agent panel */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="relative bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 md:p-10 hover:border-[var(--border)] transition-all overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-600 opacity-5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-6">
                <Building size={22} className="text-[var(--text-muted)]" />
              </div>

              <div className="inline-block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] bg-[var(--surface)] border border-[var(--border)] rounded-full px-3 py-1 mb-4">
                For Agents
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">
                List your properties
              </h3>
              <p className="text-[var(--text-muted)] text-sm mb-8 leading-relaxed max-w-sm">
                Join Ghana&apos;s most trusted property platform. Get verified,
                upload listings, and connect with renters who are ready to move.
              </p>

              <ul className="space-y-3 mb-10">
                {agentFeatures.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
                      <Icon size={13} className="text-[var(--text-muted)]" />
                    </div>
                    <span className="text-sm text-[var(--text-secondary)]">{text}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className="inline-flex items-center gap-2.5 border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium text-sm px-7 py-3.5 rounded-xl transition-all duration-200 hover:bg-[var(--surface)] focus-ring"
              >
                Apply as agent
                <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
