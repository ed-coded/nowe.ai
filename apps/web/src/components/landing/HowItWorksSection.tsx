"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MessageSquare, Cpu, CalendarCheck } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Describe your home",
    description:
      "Type what you want in plain language. No forms, no checkboxes — just tell us what matters to you.",
    example: '"I need a quiet flat near East Legon with parking and good natural light."',
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI finds your match",
    description:
      "Our AI understands your intent, extracts your preferences, and ranks the most relevant properties.",
    example: "Returning 5 curated homes tailored to exactly what you described.",
  },
  {
    icon: CalendarCheck,
    step: "03",
    title: "Book a viewing",
    description:
      "Connect directly with verified agents, schedule a viewing, and move at your own pace.",
    example: "Every agent is vetted. Every listing is quality-checked.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export default function HowItWorksSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="py-24 md:py-32 relative overflow-hidden">
      {/* Section background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 80% 50%, rgba(124,106,247,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="container-home relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            <span className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">
              How It Works
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-[var(--text-primary)]">Simple. Intelligent.</span>
            <br />
            <span className="gradient-text">Built for how you think.</span>
          </h2>
          <p className="text-[var(--text-muted)] text-base md:text-lg max-w-lg mx-auto">
            We removed the complexity of traditional property search. Here&apos;s
            how Home works.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative"
        >
          {/* Connecting line (desktop) */}
          <div
            className="hidden md:block absolute top-12 left-[16.5%] right-[16.5%] h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--accent) 20%, var(--border) 50%, var(--accent) 80%, transparent)",
              opacity: 0.3,
            }}
          />

          {steps.map(({ icon: Icon, step, title, description, example }) => (
            <motion.div
              key={step}
              variants={itemVariants}
              className="relative group"
            >
              <div className="glass rounded-2xl border border-[var(--border)] p-7 h-full hover:border-[var(--accent)] transition-all duration-300 hover:shadow-[0_0_30px_var(--accent-glow)] card-shine">
                {/* Step number */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)] transition-all duration-300">
                    <Icon
                      size={20}
                      className="text-[var(--text-muted)] group-hover:text-white transition-colors duration-300"
                    />
                  </div>
                  <span className="text-5xl font-bold text-[var(--border)] group-hover:text-[var(--accent)] transition-colors duration-300 opacity-60 select-none">
                    {step}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                  {title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] mb-5 leading-relaxed">
                  {description}
                </p>

                {/* Example callout */}
                <div className="rounded-xl bg-[var(--surface)] border border-[var(--border-subtle)] p-4">
                  <p className="text-xs text-[var(--text-faint)] italic leading-relaxed">
                    {example}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
