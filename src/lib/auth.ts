import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";

import { db } from "../db/index.js";
import * as schema from "../db/schema/index.js";

const baseURL =
  process.env.BETTER_AUTH_URL ?? "http://localhost:3333";

const trustedOrigin =
  process.env.FRONTEND_URL ?? "http://localhost:3000";

export const auth = betterAuth({
  baseURL,

  trustedOrigins: [trustedOrigin],

  database: drizzleAdapter(db, {
    provider: "pg",

    schema: {
      ...schema,

      // Seu banco chama a tabela de "users",
      // enquanto o Better Auth chama o modelo de "user".
      user: schema.users,
    },
  }),

  emailAndPassword: {
    enabled: true,
  },

  advanced: {
    database: {
      generateId: "uuid",
    },
  },
});