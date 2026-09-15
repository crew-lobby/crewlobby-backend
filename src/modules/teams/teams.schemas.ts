import { z } from "zod";

export const createTeamSchema = z
  .object({
    name: z.string().min(1, "Team name is required").max(120),
  })
  .strict();

export const updateTeamSchema = z
  .object({
    name: z.string().min(1).max(120),
  })
  .partial()
  .strict();

export type CreateTeamSchema = z.infer<typeof createTeamSchema>;
export type UpdateTeamSchema = z.infer<typeof updateTeamSchema>;