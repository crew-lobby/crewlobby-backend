import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
} from "better-auth/plugins/organization/access";

export const statement = {
  ...defaultStatements,
  project: ["list", "create", "update", "delete"],
  member: ["read", "create", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
  project: ["list"],
});

export const manager = ac.newRole({
  project: ["list", "update", "create"],
});

export const admin = ac.newRole({
  ...adminAc.statements,
  project: ["list", "create", "update", "delete"],
  member: ["read", "create", "update", "delete"],
});

export const owner = ac.newRole({
  project: ["list", "create", "update", "delete"],
  organization: ["update", "delete"],
  member: ["read", "create", "update", "delete"],
  invitation: ["create", "cancel"],
});