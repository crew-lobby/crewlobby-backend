import { alias } from "drizzle-orm/pg-core";
import { and, eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { member, teams, users } from "../../db/schema/index.js";
import { profiles } from "../../db/schema/profile.js";
import type {
  MembershipEmployment,
  ProfileRecord,
  UpdateProfileInput,
} from "./profile.types.js";

export class ProfileRepository {
  async findMembership(
    organizationId: string,
    userId: string,
  ) {
    const [row] = await db
      .select()
      .from(member)
      .where(
        and(
          eq(member.organizationId, organizationId),
          eq(member.userId, userId),
        ),
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

  async findProfile(
    userId: string,
  ): Promise<ProfileRecord | null> {
    const [row] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    return row ?? null;
  }

  async findEmploymentRelations(
    organizationId: string,
    userId: string,
  ) {
    const managerMember = alias(member, "manager_member");

    const [row] = await db
      .select({
        teamId: teams.id,
        teamName: teams.name,

        managerUserId: managerMember.userId,
        managerName: users.name,
        managerImage: users.image,
      })
      .from(member)
      .leftJoin(
        teams,
        and(
          eq(member.teamId, teams.id),
          eq(member.organizationId, teams.organizationId),
        ),
      )
      .leftJoin(
        managerMember,
        and(
          eq(member.managerId, managerMember.id),
          eq(member.organizationId, managerMember.organizationId),
        ),
      )
      .leftJoin(
        users,
        eq(managerMember.userId, users.id),
      )
      .where(
        and(
          eq(member.organizationId, organizationId),
          eq(member.userId, userId),
        ),
      )
      .limit(1);

    if (!row) {
      return {
        team: null,
        manager: null,
      };
    }

    return {
      team:
        row.teamId && row.teamName
          ? {
              id: row.teamId,
              name: row.teamName,
            }
          : null,

      manager:
        row.managerUserId && row.managerName
          ? {
              userId: row.managerUserId,
              name: row.managerName,
              image: row.managerImage,
            }
          : null,
    };
  }

  async findTeamInOrganization(
    organizationId: string,
    teamId: string,
  ) {
    const [row] = await db
      .select()
      .from(teams)
      .where(
        and(
          eq(teams.id, teamId),
          eq(teams.organizationId, organizationId),
        ),
      )
      .limit(1);

    return row ?? null;
  }

  async findMemberInOrganization(
    organizationId: string,
    memberId: string,
  ) {
    const [row] = await db
      .select()
      .from(member)
      .where(
        and(
          eq(member.id, memberId),
          eq(member.organizationId, organizationId),
        ),
      )
      .limit(1);

    return row ?? null;
  }

  async upsertProfile(
    userId: string,
    data: UpdateProfileInput,
  ): Promise<ProfileRecord> {
    const {
      jobTitle,
      workEmail,
      startDate,
      teamId,
      managerId,
      ...profileFields
    } = data;

    const [row] = await db
      .insert(profiles)
      .values({
        userId,
        ...profileFields,
      })
      .onConflictDoUpdate({
        target: profiles.userId,
        set: {
          ...profileFields,
          updatedAt: new Date(),
        },
      })
      .returning();

    return row;
  }

  async updateEmployment(
    organizationId: string,
    userId: string,
    data: Pick<
      UpdateProfileInput,
      | "jobTitle"
      | "workEmail"
      | "startDate"
      | "teamId"
      | "managerId"
    >,
  ): Promise<MembershipEmployment | null> {
    const fields = Object.fromEntries(
      Object.entries(data).filter(
        ([, value]) => value !== undefined,
      ),
    );

    if (Object.keys(fields).length === 0) {
      const membership = await this.findMembership(
        organizationId,
        userId,
      );

      if (!membership) {
        return null;
      }

      const relations = await this.findEmploymentRelations(
        organizationId,
        userId,
      );

      return {
        jobTitle: membership.jobTitle,
        workEmail: membership.workEmail,
        startDate: membership.startDate,
        teamId: membership.teamId,
        managerId: membership.managerId,
        team: relations.team,
        manager: relations.manager,
      };
    }

    const [row] = await db
      .update(member)
      .set(fields)
      .where(
        and(
          eq(member.organizationId, organizationId),
          eq(member.userId, userId),
        ),
      )
      .returning();

    if (!row) {
      return null;
    }

    const relations = await this.findEmploymentRelations(
      organizationId,
      userId,
    );

    return {
      jobTitle: row.jobTitle,
      workEmail: row.workEmail,
      startDate: row.startDate,
      teamId: row.teamId,
      managerId: row.managerId,
      team: relations.team,
      manager: relations.manager,
    };
  }
}