import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";

import users from "./users";

import { db } from "@/db/drizzle";
import { env } from "@/lib/env";

export const runtime = "nodejs";

type AppEnv = {
  Variables: {
    requestId: string;
  };
};

function getCorsOrigin() {
  if (env.CORS_ORIGIN === "*") {
    return "*";
  }

  return env.CORS_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const app = new Hono<AppEnv>().basePath("/api");

app.use("*", cors({ origin: getCorsOrigin() }));

app.use("*", async (c, next) => {
  const requestId = crypto.randomUUID();
  c.set("requestId", requestId);
  c.header("x-request-id", requestId);

  await next();
});

app.get("/health", (c) => {
  return c.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
    },
    200,
  );
});

app.get("/ready", async (c) => {
  try {
    await db.execute(sql`select 1`);

    return c.json(
      {
        status: "ready",
      },
      200,
    );
  } catch (error) {
    console.error("Database readiness check failed", error);

    return c.json(
      {
        error: {
          message: "Database not reachable",
          requestId: c.get("requestId"),
        },
      },
      503,
    );
  }
});

app.route("/users", users);

app.notFound((c) => {
  return c.json(
    {
      error: {
        message: "Route not found",
        requestId: c.get("requestId"),
      },
    },
    404,
  );
});

app.onError((error, c) => {
  console.error("Unhandled API error", error);

  return c.json(
    {
      error: {
        message: "Internal server error",
        requestId: c.get("requestId"),
      },
    },
    500,
  );
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
export const OPTIONS = handle(app);

export type AppType = typeof app;
