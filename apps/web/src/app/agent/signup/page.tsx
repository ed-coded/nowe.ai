"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Building2,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { brand } from "@/lib/branding";

type AgentType = "real_estate_agent" | "landlord" | "developer";

const AGENT_TYPES: { value: AgentType; label: string }[] = [
  { value: "real_estate_agent", label: "Real Estate Agent" },
  { value: "landlord", label: "Landlord" },
  { value: "developer", label: "Developer" },
];

export default function AgentSignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [agentType, setAgentType] = useState<AgentType>("real_estate_agent");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.name,
          requested_role: "agent",
          agent_type: agentType,
        },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      router.push("/agent/dashboard");
      router.refresh();
    } else {
      setCheckEmail(true);
    }
  };

  if (checkEmail) {
    return (
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden dot-grid px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md text-center glass rounded-2xl border border-[var(--border)] p-8"
        >
          <div className="w-14 h-14 rounded-2xl bg-[var(--accent)] bg-opacity-10 border border-[var(--accent)] border-opacity-30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={28} className="text-[var(--accent)]" />
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            Check your email
          </h1>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            We sent a confirmation link to <strong className="text-[var(--text-secondary)]">{form.email}</strong>.
            Click it to activate your professional account.
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden dot-grid px-4 py-16">
      <div className="absolute w-[500px] h-[500px] -top-40 -left-40 bg-[var(--accent)] opacity-10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bottom-0 -right-40 bg-indigo-500 opacity-8 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Link
          href="/agent"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-8 focus-ring rounded-lg px-1 py-1"
        >
          <ArrowLeft size={16} />
          Back to nowe.ai for Professionals
        </Link>

        <div className="glass rounded-2xl border border-[var(--border)] p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center overflow-hidden">
              <Image
                src={brand.logo.icon}
                alt={brand.logo.alt}
                width={36}
                height={36}
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <span className="font-semibold text-[var(--text-primary)] text-lg tracking-tight">
              {brand.name}
              <span className="text-[var(--text-faint)] font-normal"> for Professionals</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Join as a Professional
          </h1>
          <p className="text-sm text-[var(--text-muted)] mb-8">
            List properties and connect with serious renters and buyers.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
                I am a
              </label>
              <div className="grid grid-cols-3 gap-2">
                {AGENT_TYPES.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setAgentType(value)}
                    aria-pressed={agentType === value}
                    className={`text-xs font-medium px-2 py-2.5 rounded-xl border transition-colors focus-ring ${
                      agentType === value
                        ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                        : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-xs font-medium text-[var(--text-muted)] mb-1.5"
              >
                Full name
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]"
                />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Kwame Mensah"
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-[var(--text-muted)] mb-1.5"
              >
                Business email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@agency.com"
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-[var(--text-muted)] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pl-10 pr-10 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)] hover:text-[var(--text-muted)] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-3 rounded-xl transition-all duration-200 hover:shadow-[0_0_24px_var(--accent-glow-strong)] focus-ring"
            >
              {loading ? "Creating account..." : "Create professional account"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="text-xs text-[var(--text-faint)] text-center mt-6 flex items-center justify-center gap-1.5">
            <Building2 size={12} />
            Applications are reviewed before listings go live.
          </p>

          <p className="text-sm text-[var(--text-muted)] text-center mt-6">
            Already have a professional account?{" "}
            <Link
              href="/agent/signin"
              className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium focus-ring rounded"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
