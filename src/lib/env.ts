import { z } from "zod";

export const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  CORS_ORIGIN: z.string().default("*"),
  API_MAX_USERS_LIMIT: z.coerce.number().int().positive().max(200).default(50),
});

function formatIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.length ? issue.path.join(".") : "root";
      return `${path}: ${issue.message}`;
    })
    .join("; ");
}

export function parseServerEnv(input: NodeJS.ProcessEnv) {
  const result = serverEnvSchema.safeParse(input);
  if (!result.success) {
    throw new Error(`Invalid environment configuration: ${formatIssues(result.error)}`);
  }

  return result.data;
}

export const env = parseServerEnv(process.env);

export const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export function parsePublicEnv(input: Pick<NodeJS.ProcessEnv, "NEXT_PUBLIC_APP_URL">) {
  return publicEnvSchema.parse(input);
}

export const publicEnv = parsePublicEnv({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});
