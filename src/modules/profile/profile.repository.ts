import { and, eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { member, users } from "../../db/schema/index.js";
import { profiles } from "../../db/schema/profile.js";
import type {
  MembershipEmployment,
  ProfileRecord,
  UpdateProfileInput,
} from "./profile.types.js";

export class ProfileRepository {
  async findMembership(organizationId: string, userId: string) {
    const [row] = await db
      .select()
      .from(member)
      .where(
        and(eq(member.organizationId, organizationId), eq(member.userId, userId)),
      )
      .limit(1);

    return row ?? null;
  }

  async findUser(userId: string) {
    const [row] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return row ?? null;
  }

  async findProfile(userId: string): Promise<ProfileRecord | null> {
    const [row] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    return row ?? null;
  }

  async upsertProfile(
    userId: string,
    data: UpdateProfileInput,
  ): Promise<ProfileRecord> {
    const { jobTitle, workEmail, startDate, teamId, managerId, ...profileFields } =
      data;

    const [row] = await db
      .insert(profiles)
      .values({ userId, ...profileFields })
      .onConflictDoUpdate({
        target: profiles.userId,
        set: { ...profileFields, updatedAt: new Date() },
      })
      .returning();

    return row;
  }

  async updateEmployment(
    organizationId: string,
    userId: string,
    data: Pick<UpdateProfileInput, "jobTitle" | "workEmail" | "startDate" | "teamId" | "managerId">,
  ): Promise<MembershipEmployment | null> {
    const fields = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    );

    if (Object.keys(fields).length === 0) {
      const membership = await this.findMembership(organizationId, userId);
      return membership
        ? {
            jobTitle: membership.jobTitle,
            workEmail: membership.workEmail,
            startDate: membership.startDate,
            teamId: membership.teamId,
            managerId: membership.managerId,
          }
        : null;
    }

    const [row] = await db
      .update(member)
      .set(fields)
      .where(and(eq(member.organizationId, organizationId), eq(member.userId, userId)))
      .returning();

    return row
      ? {
          jobTitle: row.jobTitle,
          workEmail: row.workEmail,
          startDate: row.startDate,
          teamId: row.teamId,
          managerId: row.managerId,
        }
      : null;
  }
}