import type { RequestHandler } from "express";
import { fromNodeHeaders } from "better-auth/node";

import { auth } from "../lib/auth.js";

export type ProjectAction = "list" | "create" | "update" | "delete";

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

/** Uses Better Auth Organization's official permission endpoint. */
export const requireProjectPermission = (
  action: ProjectAction,
): RequestHandler => {
  return async (request, response, next) => {
    try {
      const authContext = response.locals.auth;

      if (!authContext) {
        return response.status(401).json({ message: "Unauthorized" });
      }

      const result = await auth.api.hasPermission({
        headers: fromNodeHeaders(request.headers),
        body: {
          organizationId: authContext.organizationId,
          permissions: { project: [action] },
        },
      });

      if (!result.success) {
        return response.status(403).json({ message: "Forbidden" });
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};

