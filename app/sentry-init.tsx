"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

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
            new Sentry.Replay({
              maskAllText: false,
              blockAllMedia: false,
            }),
            new Sentry.BrowserTracing(),
            // Capture console logs
            Sentry.consoleIntegration(),
          ],
          tracesSampleRate: 1.0,
          replaysSessionSampleRate: 0.1,
          replaysOnErrorSampleRate: 1.0,
          environment: typeof window !== "undefined" ? "development" : "unknown",
          debug: false,
          allowUrls: [/.*/],
          ignoreErrors: [
            "top.GLOBALS",
            "chrome-extension://",
            "moz-extension://",
          ],
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

  // Capture console logs as Sentry events (with filtering for Sentry internal logs)
  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;
    const originalDebug = console.debug;

    // Helper function to check if message should be filtered
    const shouldFilterLog = (args: unknown[]): boolean => {
      const message = String(args.join(" "));
      // Filter out Sentry internal logs
      return (
        message.includes("Sentry Logger") ||
        message.includes("[Sentry") ||
        message.includes("Integration installed") ||
        message.includes("[Tracing]")
      );
    };

    console.log = function (...args) {
      originalLog.apply(console, args);
      if (!shouldFilterLog(args)) {
        Sentry.captureMessage(String(args.join(" ")), "info");
      }
    };

    console.error = function (...args) {
      originalError.apply(console, args);
      if (!shouldFilterLog(args)) {
        Sentry.captureMessage(String(args.join(" ")), "error");
      }
    };

    console.warn = function (...args) {
      originalWarn.apply(console, args);
      if (!shouldFilterLog(args)) {
        Sentry.captureMessage(String(args.join(" ")), "warning");
      }
    };

    console.info = function (...args) {
      originalInfo.apply(console, args);
      if (!shouldFilterLog(args)) {
        Sentry.captureMessage(String(args.join(" ")), "info");
      }
    };

    console.debug = function (...args) {
      originalDebug.apply(console, args);
      if (!shouldFilterLog(args)) {
        Sentry.captureMessage(String(args.join(" ")), "debug");
      }
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      console.info = originalInfo;
      console.debug = originalDebug;
    };
  }, []);

  return null;
}