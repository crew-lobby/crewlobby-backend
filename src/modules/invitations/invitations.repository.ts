import { eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { invitation, organization } from "../../db/schema/organization.js";
import { users } from "../../db/schema/users.js";
import type { InvitationPreviewRecord } from "./invitations.types.js";

export class InvitationsRepository {
  async findPreviewById(
    invitationId: string,
  ): Promise<InvitationPreviewRecord | null> {
    const [record] = await db
      .select({
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        expiresAt: invitation.expiresAt,
        organizationId: organization.id,
        organizationName: organization.name,
        inviterName: users.name,
      })
      .from(invitation)
      .innerJoin(organization, eq(invitation.organizationId, organization.id))
      .innerJoin(users, eq(invitation.inviterId, users.id))
      .where(eq(invitation.id, invitationId))
      .limit(1);

    return record ?? null;
  }
}