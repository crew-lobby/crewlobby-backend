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
      schema: {
        organization: {
          additionalFields: {
            addressLine1: { type: "string", required: true },
            addressLine2: { type: "string", required: false },
            city: { type: "string", required: true },
            state: { type: "string", required: true },
            country: { type: "string", required: true },
            zip: { type: "string", required: true },
            employeeCount: { type: "number", required: true },
            sector: { type: "string", required: true },
          },
        },
      },
      async sendInvitationEmail(data) {
        console.log(
          `Invite for ${data.email} -> org ${data.organization.name}: /accept-invitation/${data.id}`
        );
      },
    }),
  ],
});