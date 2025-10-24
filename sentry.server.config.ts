import * as Sentry from "@sentry/nextjs";

const DSN = process.env.SENTRY_DSN;

if (DSN) {
  Sentry.init({
    dsn: DSN,
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV || "development",
    debug: true,
  });

  console.log("[Sentry Server] Initialized successfully");
}