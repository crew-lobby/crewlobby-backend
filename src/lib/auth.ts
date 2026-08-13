import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { organization } from "better-auth/plugins";

import { db } from "../db/index.js";
import * as schema from "../db/schema/index.js";
import { ac, user, manager, admin, owner } from "./permissions.js";

const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3333";
const trustedOrigin = process.env.FRONTEND_URL ?? "http://localhost:3000";

export const auth = betterAuth({
  baseURL,
  trustedOrigins: [trustedOrigin],

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