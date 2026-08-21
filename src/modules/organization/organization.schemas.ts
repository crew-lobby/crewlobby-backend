import { z } from "zod";

import { roleValues } from "./organization.types.js";

export const updateMemberRoleSchema = z.object({
  memberId: z.string().min(1, "Member id is required"),
  role: z.enum(roleValues),
  organizationId: z.string().min(1, "Organization id is required"),
});

export type UpdateMemberRoleSchema = z.infer<typeof updateMemberRoleSchema>;

export const listMembersQuerySchema = z.object({
  organizationId: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export type ListMembersQuerySchema = z.infer<typeof listMembersQuerySchema>;

export const removeMemberSchema = z.object({
  memberIdOrEmail: z.string().min(1, "Member id or email is required"),
  organizationId: z.string().min(1, "Organization id is required"),
});

export type RemoveMemberSchema = z.infer<typeof removeMemberSchema>;