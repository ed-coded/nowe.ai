import "server-only";

/**
 * Server-only environment variables — separate from lib/env.ts because these
 * must never be readable from a client bundle. The `server-only` import
 * above makes any accidental import from a Client Component a build-time
 * error instead of a confusing runtime crash (Next.js resolves non-
 * `NEXT_PUBLIC_*` vars to `undefined` in the browser, which would otherwise
 * make this module's eager validation throw for every page load).
 */

const rawServerEnv = {
  ADMIN_ACCESS_PASSPHRASE: process.env.ADMIN_ACCESS_PASSPHRASE,
} as const;

type RequiredServerEnvKey = keyof typeof rawServerEnv;
type ValidatedServerEnv = { [K in RequiredServerEnvKey]: string };

function validateServerEnv(vars: typeof rawServerEnv): ValidatedServerEnv {
  const missing = (Object.keys(vars) as RequiredServerEnvKey[]).filter(
    (key) => !vars[key]
  );

  if (missing.length > 0) {
    throw new Error(
      `\n❌ Missing required server environment variable${missing.length > 1 ? "s" : ""}:\n` +
        missing.map((key) => `  - ${key}`).join("\n") +
        `\n\nAdd ${missing.length > 1 ? "them" : "it"} to your .env.local file before starting the application.\n` +
        `See .env.example for the full list of required variables.\n`
    );
  }

  return vars as ValidatedServerEnv;
}

export const serverEnv: ValidatedServerEnv = validateServerEnv(rawServerEnv);
