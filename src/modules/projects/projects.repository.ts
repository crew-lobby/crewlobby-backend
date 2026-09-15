import { and, count, desc, eq, gte, ilike, lte, or } from "drizzle-orm";

import { db } from "../../db/index.js";
import { projects } from "../../db/schema/projects.js";
import type {
  CreateProjectRecord,
  ListProjectsFilters,
  PaginatedResult,
  Project,
  UpdateProjectInput,
} from "./projects.types.js";

export class ProjectsRepository {
  async create(data: CreateProjectRecord): Promise<Project> {
    const [project] = await db.insert(projects).values(data).returning();

    return project;
  }

  async findById(id: string): Promise<Project | null> {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    return project ?? null;
  }

  async list(filters: ListProjectsFilters): Promise<PaginatedResult<Project>> {
    const {
      page,
      perPage,
      status,
      priority,
      search,
      dueDateFrom,
      dueDateTo,
      companyId,
    } = filters;

    const conditions = [];

    if (status) conditions.push(eq(projects.status, status));
    if (priority) conditions.push(eq(projects.priority, priority));
    conditions.push(eq(projects.companyId, companyId));
    if (dueDateFrom) conditions.push(gte(projects.dueDate, dueDateFrom));
    if (dueDateTo) conditions.push(lte(projects.dueDate, dueDateTo));
    if (search) {
      conditions.push(
        or(
          ilike(projects.name, `%${search}%`),
          ilike(projects.code, `%${search}%`),
          ilike(projects.description, `%${search}%`),
        ),
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [items, [{ total }]] = await Promise.all([
      db
        .select()
        .from(projects)
        .where(where)
        .orderBy(desc(projects.createdAt))
        .limit(perPage)
        .offset((page - 1) * perPage),
      db.select({ total: count() }).from(projects).where(where),
    ]);

    return {
      data: items,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async update(
    id: string,
    companyId: string,
    data: UpdateProjectInput,
  ): Promise<Project | null> {
    const [project] = await db
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(projects.id, id), eq(projects.companyId, companyId)))
      .returning();

    return project ?? null;
  }

  async delete(id: string, companyId: string): Promise<boolean> {
    const [deleted] = await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.companyId, companyId)))
      .returning({ id: projects.id });

    return Boolean(deleted);
  }
}
