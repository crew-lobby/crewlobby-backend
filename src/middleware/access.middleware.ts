import type { RequestHandler } from "express";
import { fromNodeHeaders } from "better-auth/node";

import { auth } from "../lib/auth.js";
import type { statement } from "../lib/permissions.js";

type Resource = keyof typeof statement;
type Action<R extends Resource> = (typeof statement)[R][number];

/**
 * Loads the Better Auth cookie session and establishes the request tenant.
 * The active organization from the session is the only source of tenant data.
 */
export const requireActiveOrganization: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const result = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!result) {
      return response.status(401).json({ message: "Unauthorized" });
    }

    const organizationId = result.session.activeOrganizationId;

    if (!organizationId) {
      return response.status(400).json({
        message: "An active organization is required",
      });
    }

    response.locals.auth = {
      user: result.user,
      session: result.session,
      organizationId,
    };

    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Verifies the authenticated user has the given resource/action permission
 * inside the request's active organization. Always defers to Better Auth's
 * own access control — never trusts a role or permission sent by the client.
 */
export const requirePermission = <R extends Resource>(
  resource: R,
  action: Action<R>,
): RequestHandler => {
  return async (request, response, next) => {
    try {
      const authContext = response.locals.auth;

      if (!authContext) {
        return response.status(401).json({ message: "Unauthorized" });
      }

      const permissions: Record<string, string[]> = {
        [resource]: [action],
      };

      const result = await auth.api.hasPermission({
        headers: fromNodeHeaders(request.headers),
        body: {
          organizationId: authContext.organizationId,
          permissions,
        },
      } as Parameters<typeof auth.api.hasPermission>[0]);

      if (!result.success) {
        return response.status(403).json({ message: "Forbidden" });
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};