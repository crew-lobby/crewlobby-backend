import { AppError } from "../../shared/errors/app-error.js";
import { ProjectsRepository } from "./projects.repository.js";
import type {
  CreateProjectInput,
  ListProjectsFilters,
  ListProjectsQuery,
  PaginatedResult,
  Project,
  UpdateProjectInput,
} from "./projects.types.js";

export class ProjectsService {
  constructor(private readonly projectsRepository = new ProjectsRepository()) {}

  async create(data: CreateProjectInput, companyId: string): Promise<Project> {
    return this.projectsRepository.create({ ...data, companyId });
  }

  async list(
    filters: ListProjectsQuery,
    companyId: string,
  ): Promise<PaginatedResult<Project>> {
    return this.projectsRepository.list({ ...filters, companyId });
  }

  async update(
    id: string,
    data: UpdateProjectInput,
    companyId: string,
  ): Promise<Project> {
    if (Object.keys(data).length === 0) {
      throw new AppError(400, "No fields to update");
    }

    const project = await this.projectsRepository.update(id, companyId, data);

    if (!project) {
      throw new AppError(404, "Project not found");
    }

    return project;
  }

  async delete(id: string, companyId: string): Promise<void> {
    const deleted = await this.projectsRepository.delete(id, companyId);

    if (!deleted) {
      throw new AppError(404, "Project not found");
    }
  }
}
