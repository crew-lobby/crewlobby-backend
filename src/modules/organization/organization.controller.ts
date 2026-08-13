import type { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";

import { auth } from "../../lib/auth.js";
import { user, manager, admin, owner } from "../../lib/permissions.js";

const roles = { user, manager, admin, owner };

export async function updateMemberRole(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { memberId, role, organizationId } = request.body;

    const result = await auth.api.updateMemberRole({
      body: { memberId, role, organizationId },
      headers: fromNodeHeaders(request.headers),
    });

    return response.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getMyRole(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { role } = await auth.api.getActiveMemberRole({
      headers: fromNodeHeaders(request.headers),
    });

    return response.json({ role });
  } catch (error) {
    next(error);
  }
}

export async function getMyPermissions(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { role } = await auth.api.getActiveMemberRole({
      headers: fromNodeHeaders(request.headers),
    });

    const permissions: Record<string, string[]> = {};

    for (const roleName of role.split(",")) {
      const definition = roles[roleName as keyof typeof roles];
      if (!definition) continue;

      for (const [resource, actions] of Object.entries(
        definition.statements
      )) {
        permissions[resource] = Array.from(
          new Set([...(permissions[resource] ?? []), ...(actions as string[])])
        );
      }
    }

    return response.json({ role, permissions });
  } catch (error) {
    next(error);
  }
}