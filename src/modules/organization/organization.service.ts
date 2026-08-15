import { fromNodeHeaders } from "better-auth/node";
import type { IncomingHttpHeaders } from "node:http";

import { auth } from "../../lib/auth.js";
import { user, manager, admin, owner } from "../../lib/permissions.js";
import type {
  MemberPermissions,
  MemberRole,
  UpdateMemberRoleInput,
} from "./organization.types.js";

const roles = { user, manager, admin, owner };

export class OrganizationService {
  async updateMemberRole(
    input: UpdateMemberRoleInput,
    headers: IncomingHttpHeaders,
  ) {
    return auth.api.updateMemberRole({
      body: input,
      headers: fromNodeHeaders(headers),
    });
  }

  async getMyRole(headers: IncomingHttpHeaders): Promise<MemberRole> {
    const { role } = await auth.api.getActiveMemberRole({
      headers: fromNodeHeaders(headers),
    });

    return { role };
  }

  async getMyPermissions(
    headers: IncomingHttpHeaders,
  ): Promise<MemberPermissions> {
    const { role } = await auth.api.getActiveMemberRole({
      headers: fromNodeHeaders(headers),
    });

    const permissions: Record<string, string[]> = {};

    for (const roleName of role.split(",")) {
      const definition = roles[roleName as keyof typeof roles];
      if (!definition) continue;

      for (const [resource, actions] of Object.entries(
        definition.statements,
      )) {
        permissions[resource] = Array.from(
          new Set([...(permissions[resource] ?? []), ...(actions as string[])]),
        );
      }
    }

    return { role, permissions };
  }
}