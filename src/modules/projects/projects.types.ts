export type ProjectStatus =
  | "planned"
  | "active"
  | "on_hold"
  | "completed"
  | "cancelled";

export type ProjectPriority = "low" | "medium" | "high" | "critical";

export type Project = {
  id: string;
  companyId: string;
  projectManagerId: string | null;
  name: string;
  code: string;
  description: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string | null;
  dueDate: string | null;
  completedAt: Date | null;
  budgetAmount: string | null;
  currencyCode: string;
  progressPercent: number;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
};

export type CreateProjectInput = {
  companyId: string;
  projectManagerId?: string;
  name: string;
  code: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  startDate?: string;
  dueDate?: string;
  budgetAmount?: string;
  currencyCode?: string;
  progressPercent?: number;
};

export type UpdateProjectInput = Partial<CreateProjectInput>;

export type ListProjectsFilters = {
  page: number;
  perPage: number;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  search?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  companyId?: string;
};

export type PaginatedResult<T> = {
  data: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
};