import { AppError } from "../../shared/errors/app-error.js";
import { TeamsRepository } from "./teams.repository.js";
import type {
  Team,
  TeamWithMembers,
  UpdateTeamInput,
} from "./teams.types.js";

export class TeamsService {
  private readonly repository = new TeamsRepository();

  async create(organizationId: string, name: string): Promise<Team> {
    return this.repository.create({ organizationId, name });
  }

  async list(organizationId: string): Promise<Team[]> {
    return this.repository.list(organizationId);
  }

  async getById(
    organizationId: string,
    teamId: string,
  ): Promise<TeamWithMembers> {
    const team = await this.repository.findById(organizationId, teamId);

    if (!team) {
      throw new AppError(404, "Team not found");
    }

    const members = await this.repository.listMembers(teamId);

    return { ...team, members };
  }

  async update(
    organizationId: string,
    teamId: string,
    input: UpdateTeamInput,
  ): Promise<Team> {
    const team = await this.repository.update(organizationId, teamId, input);

    if (!team) {
      throw new AppError(404, "Team not found");
    }

    return team;
  }

  async delete(organizationId: string, teamId: string): Promise<void> {
    const team = await this.repository.findById(organizationId, teamId);

    if (!team) {
      throw new AppError(404, "Team not found");
    }

    await this.repository.delete(organizationId, teamId);
  }
}
