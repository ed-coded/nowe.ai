/**
 * Single source of truth for environment variables.
 *
 * NEXT_PUBLIC_* variables are inlined by Next.js at build time, so a missing
 * value here means the app was built or started without the required
 * .env.local entries. Validating eagerly at module load means the first
 * import (client, server, or middleware) fails fast with a readable list of
 * what's missing, instead of the generic error Supabase throws when it
 * receives `undefined` for a URL or key.
 *
 * Add new required variables only in this file — every other module should
 * import `env` from here rather than reading `process.env` directly.
 */

const rawEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
} as const;

type RequiredEnvKey = keyof typeof rawEnv;
type ValidatedEnv = { [K in RequiredEnvKey]: string };

function validateEnv(vars: typeof rawEnv): ValidatedEnv {
  const missing = (Object.keys(vars) as RequiredEnvKey[]).filter(
    (key) => !vars[key]
  );

  if (missing.length > 0) {
    throw new Error(
      `\n❌ Missing required environment variable${missing.length > 1 ? "s" : ""}:\n` +
        missing.map((key) => `  - ${key}`).join("\n") +
        `\n\nAdd ${missing.length > 1 ? "them" : "it"} to your .env.local file before starting the application.\n` +
        `See .env.example for the full list of required variables and where to find their values.\n`
    );
  }

  return vars as ValidatedEnv;
}

export const env: ValidatedEnv = validateEnv(rawEnv);
