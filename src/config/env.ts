import "dotenv/config";
import { z } from "zod";

const originSchema = z
  .url()
  .transform((value) => new URL(value).origin);

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3333),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive(),
  DB_NAME: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  BETTER_AUTH_URL: originSchema.default("http://localhost:3333"),
  FRONTEND_URL: originSchema.default("http://localhost:3000"),
});

export const env = envSchema.parse(process.env);
