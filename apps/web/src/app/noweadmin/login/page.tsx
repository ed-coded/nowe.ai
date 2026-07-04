"use client";

import { useActionState } from "react";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { loginAdmin, type AdminLoginState } from "./actions";

const initialState: AdminLoginState = { error: null };

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden dot-grid px-4 py-16">
      <div className="relative z-10 w-full max-w-md">
        <div className="glass rounded-2xl border border-[var(--border)] p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <span className="font-semibold text-[var(--text-primary)] text-lg tracking-tight">
              Admin Access
            </span>
          </div>

          <p className="text-sm text-[var(--text-muted)] mb-8">
            Restricted area. Sign in with an admin account and the access
            passphrase.
          </p>

          <form action={formAction} className="flex flex-col gap-4">
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
                  autoComplete="username"
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
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Your password"
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="passphrase"
                className="block text-xs font-medium text-[var(--text-muted)] mb-1.5"
              >
                Access passphrase
              </label>
              <div className="relative">
                <ShieldCheck
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]"
                />
                <input
                  id="passphrase"
                  name="passphrase"
                  type="password"
                  required
                  autoComplete="off"
                  placeholder="Access passphrase"
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
            </div>

            {state.error && (
              <p className="text-xs text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-lg px-3 py-2">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="mt-2 flex items-center justify-center gap-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-3 rounded-xl transition-all duration-200 focus-ring"
            >
              {pending ? "Verifying..." : "Enter"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
