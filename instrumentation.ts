// This file is required for Sentry to work with Next.js
// It initializes Sentry on both client and server

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Server-side initialization
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "browser") {
    // Browser initialization
    await import("./sentry.client.config");
  }
}