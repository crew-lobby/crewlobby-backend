import type { auth } from "../lib/auth.js";

type AuthSession = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>;

declare global {
  namespace Express {
    interface Locals {
      auth: {
        user: AuthSession["user"];
        session: AuthSession["session"];
        organizationId: string;
      };
    }
  }
}

export {};
