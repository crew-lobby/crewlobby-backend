import { z } from "zod";

import { roleValues } from "./organization.types.js";

export const updateMemberRoleSchema = z.object({
  memberId: z.string().min(1, "Member id is required"),
  role: z.enum(roleValues),
  organizationId: z.string().min(1, "Organization id is required"),
});

export type UpdateMemberRoleSchema = z.infer<typeof updateMemberRoleSchema>;