import * as Sentry from "@sentry/nextjs";

// Note: Sentry is initialized at runtime by sentry-init.tsx component
// which fetches the DSN from the Cloudflare backend (/api/sentry-dsn)
// This keeps the DSN secret and not exposed in source code

console.log("[Sentry Client] Client configuration loaded - DSN will be fetched at runtime");