export const roleValues = ["user", "manager", "admin", "owner"] as const;

export type RoleName = (typeof roleValues)[number];

export type UpdateMemberRoleInput = {
  memberId: string;
  role: RoleName;
  organizationId: string;
};

export type MemberRole = {
  role: string;
};

export type MemberPermissions = {
  role: string;
  permissions: Record<string, string[]>;
};