import { and, eq } from "drizzle-orm";

import { db } from "../../db/index.js";
import { member, teams } from "../../db/schema/organization.js";
import { users } from "../../db/schema/users.js";
import type { CreateTeamInput, Team, UpdateTeamInput } from "./teams.types.js";

export class TeamsRepository {
  async create(data: CreateTeamInput): Promise<Team> {
    const [team] = await db.insert(teams).values(data).returning();

    return team;
  }

  async findById(organizationId: string, teamId: string): Promise<Team | null> {
    const [team] = await db
      .select()
      .from(teams)
      .where(and(eq(teams.id, teamId), eq(teams.organizationId, organizationId)))
      .limit(1);

    return team ?? null;
  }

  async list(organizationId: string): Promise<Team[]> {
    return db.select().from(teams).where(eq(teams.organizationId, organizationId));
  }

  async listMembers(teamId: string) {
    return db
      .select({
        id: member.id,
        userId: member.userId,
        name: users.name,
        email: users.email,
        image: users.image,
        jobTitle: member.jobTitle,
      })
      .from(member)
      .innerJoin(users, eq(users.id, member.userId))
      .where(eq(member.teamId, teamId));
  }

  async update(
    organizationId: string,
    teamId: string,
    data: UpdateTeamInput,
  ): Promise<Team | null> {
    const [team] = await db
      .update(teams)
      .set(data)
      .where(and(eq(teams.id, teamId), eq(teams.organizationId, organizationId)))
      .returning();

    return team ?? null;
  }

  async delete(organizationId: string, teamId: string): Promise<void> {
    await db
      .delete(teams)
      .where(and(eq(teams.id, teamId), eq(teams.organizationId, organizationId)));
  }
}