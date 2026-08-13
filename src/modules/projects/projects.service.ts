import { AppError } from "../../shared/errors/app-error.js";
import { ProjectsRepository } from "./projects.repository.js";
import type {
  CreateProjectInput,
  ListProjectsFilters,
  PaginatedResult,
  Project,
  UpdateProjectInput,
} from "./projects.types.js";

export class ProjectsService {
  constructor(private readonly projectsRepository = new ProjectsRepository()) {}

  async create(data: CreateProjectInput): Promise<Project> {
    return this.projectsRepository.create(data);
  }

  async list(filters: ListProjectsFilters): Promise<PaginatedResult<Project>> {
    return this.projectsRepository.list(filters);
  }

  async update(id: string, data: UpdateProjectInput): Promise<Project> {
    if (Object.keys(data).length === 0) {
      throw new AppError(400, "No fields to update");
    }

    const project = await this.projectsRepository.update(id, data);

    if (!project) {
      throw new AppError(404, "Project not found");
    }

    return project;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.projectsRepository.delete(id);

    if (!deleted) {
      throw new AppError(404, "Project not found");
    }
  }
}