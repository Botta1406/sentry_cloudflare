"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    console.error("[Global Error Handler] Caught error:", error.message);
    Sentry.captureException(error, {
      tags: {
        errorType: "GlobalError",
      },
      level: "error",
    });
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
          <h2>Something went wrong!</h2>
          <p style={{ color: "#666", marginBottom: "20px" }}>
            {error.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: "10px 20px",
              backgroundColor: "#333",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {error.digest && (
            <p style={{ marginTop: "20px", fontSize: "12px", color: "#999" }}>
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}