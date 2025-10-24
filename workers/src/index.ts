import { Router, IRequest } from "itty-router";
import { TodoAPI } from "./api/todos";
import { errorHandler } from "./middleware/error";
import { corsHandler } from "./middleware/cors";
import { Env } from "./types";

// Create router
const router = Router();

// CORS middleware
router.all("*", corsHandler);

// Sentry DSN endpoint - serves the DSN from Cloudflare Secrets
router.get("/api/sentry-dsn", async (req: IRequest, env: Env) => {
  const sentryDsn = env.SENTRY_DSN;
  if (!sentryDsn) {
    return new Response(
      JSON.stringify({ error: "Sentry DSN not configured" }),
      { status: 500 }
    );
  }
  return new Response(JSON.stringify({ dsn: sentryDsn }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

// API routes
router.get("/api/todos", async (req: IRequest, env: Env) => {
  const todoAPI = new TodoAPI(env.TODOS);
  return todoAPI.getAll(req, env);
});

router.get("/api/todos/:id", async (req: IRequest, env: Env) => {
  const todoAPI = new TodoAPI(env.TODOS);
  return todoAPI.getById(req, env);
});

router.post("/api/todos", async (req: IRequest, env: Env) => {
  const todoAPI = new TodoAPI(env.TODOS);
  return todoAPI.create(req, env);
});

router.put("/api/todos/:id", async (req: IRequest, env: Env) => {
  const todoAPI = new TodoAPI(env.TODOS);
  return todoAPI.update(req, env);
});

router.delete("/api/todos/:id", async (req: IRequest, env: Env) => {
  const todoAPI = new TodoAPI(env.TODOS);
  return todoAPI.delete(req, env);
});

// 404 handler
router.all("*", () =>
  new Response(JSON.stringify({ error: "Not found" }), { status: 404 })
);

export default {
  fetch: errorHandler(router.handle),
} as ExportedHandler;