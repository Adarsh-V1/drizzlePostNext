import { desc } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { env } from "@/lib/env";

const app = new Hono();

const createUserSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  image: z.string().trim().url().optional(),
});

const querySchema = z.object({
  limit: z.coerce.number().int().positive().max(env.API_MAX_USERS_LIMIT).default(25),
});

app.get("/", async (c) => {
  const queryResult = querySchema.safeParse({
    limit: c.req.query("limit"),
  });

  if (!queryResult.success) {
    return c.json(
      {
        error: {
          message: "Invalid query parameters",
          details: queryResult.error.flatten(),
        },
      },
      400,
    );
  }

  const users = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
    .from(user)
    .orderBy(desc(user.createdAt))
    .limit(queryResult.data.limit);

  return c.json({ data: users }, 200);
});

app.post("/", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = createUserSchema.safeParse(body);

  if (!parsed.success) {
    return c.json(
      {
        error: {
          message: "Invalid request body",
          details: parsed.error.flatten(),
        },
      },
      400,
    );
  }

  const payload = parsed.data;

  const [createdUser] = await db
    .insert(user)
    .values({
      id: payload.id ?? crypto.randomUUID(),
      name: payload.name,
      email: payload.email,
      image: payload.image,
    })
    .returning({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

  return c.json({ data: createdUser }, 201);
});

export default app;
