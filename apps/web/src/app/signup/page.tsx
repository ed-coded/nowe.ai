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
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { brand } from "@/lib/branding";

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
        data: { full_name: form.name },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      // New signups always default to role 'user' (see handle_new_user()).
      router.push("/dashboard");
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
            Click it to activate your account.
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden dot-grid px-4 py-16">
      {/* Gradient blobs for consistency with hero */}
      <div className="absolute w-[500px] h-[500px] -top-40 -left-40 bg-[var(--accent)] opacity-10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] bottom-0 -right-40 bg-purple-500 opacity-8 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-8 focus-ring rounded-lg px-1 py-1"
        >
          <ArrowLeft size={16} />
          Back to home
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
            </span>
          </div>

          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Create your account
          </h1>
          <p className="text-sm text-[var(--text-muted)] mb-8">
            Join thousands finding their ideal home across Ghana.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                  placeholder="Ama Owusu"
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-[var(--text-muted)] mb-1.5"
              >
                Email address
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
                  placeholder="you@example.com"
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
              {loading ? "Creating account..." : "Create account"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="text-xs text-[var(--text-faint)] text-center mt-6">
            By signing up, you agree to our Terms of Service and Privacy
            Policy.
          </p>

          <p className="text-sm text-[var(--text-muted)] text-center mt-6">
            Already have an account?{" "}
            <Link
              href="/signin"
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
