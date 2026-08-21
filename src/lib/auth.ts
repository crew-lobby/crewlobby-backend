import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { organization } from "better-auth/plugins";

import { db } from "../db/index.js";
import * as schema from "../db/schema/index.js";
import { ac, user, manager, admin, owner } from "./permissions.js";
import { env } from "../config/env.js";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.FRONTEND_URL],

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
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

  plugins: [
    organization({
      ac,
      roles: { user, manager, admin, owner },
      creatorRole: "owner",
      async sendInvitationEmail(data) {
        console.log(
          `Invite for ${data.email} -> org ${data.organization.name}: /accept-invitation/${data.id}`
        );
      },
    }),
  ],
});