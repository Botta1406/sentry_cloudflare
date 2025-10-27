"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { BrowserTracing, Replay } from "@sentry/react";

/**
 * Client-side Sentry initialization
 * Fetches DSN from Cloudflare backend and initializes Sentry
 */
export function SentryInit() {
  useEffect(() => {
    const initializeSentry =
        async () => {
      console.log("[Sentry Init] Component mounted");

      // Check if Sentry is already initialized
      const client = Sentry.getClient();

      if (client) {
        console.log("[Sentry Init] ✅ Sentry already initialized");
        console.log("[Sentry Init] DSN:", client.getDsn()?.toString());

        // Send app initialization message
        try {
          Sentry.captureMessage("App initialized and ready", "info");
          console.log("[Sentry Init] ✅ Sent initialization message to Sentry");
        } catch (error) {
          console.error("[Sentry Init] Error sending message:", error);
        }
        return;
      }

      // Fetch DSN from Cloudflare backend
      try {
        console.log("[Sentry Init] Fetching DSN from Cloudflare backend...");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787"}/api/sentry-dsn`
        );

        if (!response.ok) {
          console.error(
            "[Sentry Init] Failed to fetch DSN:",
            response.statusText
          );
          return;
        }

        const data = await response.json();
        const DSN = data.dsn;

        if (!DSN) {
          console.warn("[Sentry Init] DSN not received from backend");
          return;
        }

        console.log("[Sentry Init] ✅ DSN fetched from backend");

        // Initialize Sentry with fetched DSN
        Sentry.init({
          dsn: DSN,
          integrations: [
            new Replay({
              maskAllText: false,
              blockAllMedia: false,
            }),
            new BrowserTracing(),
          ],
          tracesSampleRate: 1.0,
          replaysSessionSampleRate: 0.1,
          replaysOnErrorSampleRate: 1.0,
          environment: typeof window !== "undefined" ? "development" : "unknown",
          debug: true,
          allowUrls: [/.*/],
          ignoreErrors: [
            "top.GLOBALS",
            "chrome-extension://",
            "moz-extension://",
          ],
          // Enable Logs feature for Sentry
          enableLogs: true,
          sendDefaultPii: true,
        });

        console.log("[Sentry Init] ✅ Sentry initialized successfully");

        // Send app initialization message
        try {
          Sentry.captureMessage("App initialized and ready", "info");
          console.log("[Sentry Init] ✅ Sent initialization message to Sentry");
        } catch (error) {
          console.error("[Sentry Init] Error sending message:", error);
        }
      } catch (error) {
        console.error(
          "[Sentry Init] Error initializing Sentry:",
          error instanceof Error ? error.message : String(error)
        );
      }
    };

    initializeSentry();
  }, []);

  return null;
}