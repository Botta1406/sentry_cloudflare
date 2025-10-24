import { addCorsHeaders } from "./cors";

// Simple Sentry error reporter for Cloudflare Workers
async function reportErrorToSentry(error: any, request: Request, env: any) {
  const DSN = env.SENTRY_DSN;

  if (!DSN) {
    console.warn("Sentry DSN not configured in env.SENTRY_DSN, skipping error report");
    return;
  }

  try {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "";

    // Parse DSN to get key and project ID
    const dsnUrl = new URL(DSN);
    const key = dsnUrl.username;
    const projectId = dsnUrl.pathname.split("/").pop();

    const sentryUrl = `https://${dsnUrl.host}/api/${projectId}/store/?sentry_key=${key}&sentry_version=7`;

    const payload = {
      event_id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      level: "error",
      logger: "cloudflare-worker",
      environment: env.ENVIRONMENT || "development",
      message: errorMessage,
      exception: {
        values: [
          {
            type: error.name || "Error",
            value: errorMessage,
            stacktrace: {
              frames: [
                {
                  function: "errorHandler",
                  filename: "middleware/error.ts",
                  lineno: 1,
                },
              ],
            },
          },
        ],
      },
      request: {
        method: request.method,
        url: request.url,
        headers: {
          "user-agent": request.headers.get("user-agent") || "unknown",
        },
      },
      tags: {
        "request.method": request.method,
        "request.path": new URL(request.url).pathname,
      },
    };

    await fetch(sentryUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("[Sentry] Error reported to Sentry successfully");
  } catch (sentryError) {
    console.error("[Sentry] Failed to report error to Sentry:", sentryError);
  }
}

export function errorHandler(handler: any) {
  return async (request: Request, env: any, ctx: any) => {
    try {
      const response = await handler(request, env, ctx);
      return addCorsHeaders(response);
    } catch (error) {
      console.error("Error handling request:", error);

      // Report error to Sentry
      await reportErrorToSentry(error, request, env);

      const errorMessage = error instanceof Error ? error.message : "Internal server error";
      const response = new Response(
        JSON.stringify({
          success: false,
          error: errorMessage,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return addCorsHeaders(response);
    }
  };
}