"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, Star, Users, Building2, CheckCircle2 } from "lucide-react";

const trustStats = [
  { icon: Building2, value: "1,200+", label: "Verified Properties" },
  { icon: Users, value: "8,000+", label: "Happy Renters" },
  { icon: ShieldCheck, value: "340+", label: "Trusted Agents" },
  { icon: Star, value: "4.8 / 5", label: "Average Rating" },
];

const trustPoints = [
  "Every agent is verified before gaining access to list properties",
  "All listings are reviewed by our moderation team",
  "Fake or duplicate properties are removed immediately",
  "Real photos and accurate descriptions — always",
];

export default function TrustSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Faint grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, var(--background) 30%, transparent 100%)",
        }}
      />

      <div className="container-home relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] mb-6">
                <ShieldCheck size={12} className="text-[var(--success)]" />
                <span className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">
                  Trust & Safety
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                <span className="text-[var(--text-primary)]">Every listing.</span>
                <br />
                <span className="gradient-text">Verified and trusted.</span>
              </h2>

              <p className="text-[var(--text-muted)] text-base leading-relaxed mb-8 max-w-md">
                Fraud and fake listings are a real problem in Ghana&apos;s rental market.
                We built Home to change that — with strict agent verification,
                property moderation, and transparency at every step.
              </p>

              <ul className="space-y-4">
                {trustPoints.map((point, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[var(--surface)] border border-[var(--success)] border-opacity-40 flex items-center justify-center">
                      <CheckCircle2 size={12} className="text-[var(--success)]" />
                    </div>
                    <span className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {point}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Right: stat cards */}
          <motion.div
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            className="grid grid-cols-2 gap-4"
          >
            {trustStats.map(({ icon: Icon, value, label }) => (
              <motion.div
                key={label}
                variants={{
                  hidden: { opacity: 0, scale: 0.9, y: 20 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: { duration: 0.45, ease: "easeOut" },
                  },
                }}
                className="glass rounded-2xl border border-[var(--border)] p-6 text-center hover:border-[var(--accent)] hover:shadow-[0_0_24px_var(--accent-glow)] transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)] transition-all duration-300">
                  <Icon
                    size={18}
                    className="text-[var(--accent)] group-hover:text-white transition-colors duration-300"
                  />
                </div>
                <div className="text-2xl font-bold gradient-text mb-1">{value}</div>
                <div className="text-xs text-[var(--text-faint)] uppercase tracking-wider">
                  {label}
                </div>
              </motion.div>
            ))}

            {/* Verified badge card */}
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9, y: 20 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: { duration: 0.45, ease: "easeOut", delay: 0.4 },
                },
              }}
              className="col-span-2 glass rounded-2xl border border-[var(--accent)] p-6 flex items-center gap-5 glow-subtle"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--accent)] bg-opacity-10 border border-[var(--accent)] border-opacity-30 flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={28} className="text-[var(--accent)]" />
              </div>
              <div>
                <div className="font-semibold text-[var(--text-primary)] mb-1">
                  Home Trust Certificate
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Properties and agents displaying this badge have passed our full verification process. Your safety is our priority.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
