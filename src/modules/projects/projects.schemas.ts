import { z } from "zod";

export const projectStatusValues = [
  "planned",
  "active",
  "on_hold",
  "completed",
  "cancelled",
] as const;

export const projectPriorityValues = [
  "low",
  "medium",
  "high",
  "critical",
] as const;

export const createProjectSchema = z.object({
  companyId: z.string().uuid(),
  projectManagerId: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required").max(150),
  code: z.string().min(1, "Code is required").max(30),
  description: z.string().optional(),
  status: z.enum(projectStatusValues).optional(),
  priority: z.enum(projectPriorityValues).optional(),
  startDate: z.string().date().optional(),
  dueDate: z.string().date().optional(),
  budgetAmount: z.coerce
    .number()
    .nonnegative()
    .optional()
    .transform((value) => (value === undefined ? undefined : value.toFixed(2))),
  currencyCode: z.string().length(3).optional(),
  progressPercent: z.number().int().min(0).max(100).optional(),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = createProjectSchema.partial();

export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;

export const listProjectsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(projectStatusValues).optional(),
  priority: z.enum(projectPriorityValues).optional(),
  search: z.string().min(1).optional(),
  dueDateFrom: z.string().date().optional(),
  dueDateTo: z.string().date().optional(),
  companyId: z.string().uuid().optional(),
});

export type ListProjectsQuerySchema = z.infer<typeof listProjectsQuerySchema>;

export const projectIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type ProjectIdParamSchema = z.infer<typeof projectIdParamSchema>;