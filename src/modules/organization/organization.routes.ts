import { Router } from "express";

import {
  getMyPermissionsController,
  getMyRoleController,
  listInvitationsController,
  listMembersController,
  removeMemberController,
  updateMemberRoleController,
} from "./organization.controller.js";
import {
  requireActiveOrganization,
  requirePermission,
} from "../../middleware/access.middleware.js";

export const organizationRouter = Router();

organizationRouter.use(requireActiveOrganization);

organizationRouter.get(
  "/members",
  requirePermission("member", "read"),
  listMembersController,
);
organizationRouter.get(
  "/invitations",
  requirePermission("member", "read"),
  listInvitationsController,
);
organizationRouter.patch(
  "/members/role",
  requirePermission("member", "update"),
  updateMemberRoleController,
);
organizationRouter.delete(
  "/members/:memberIdOrEmail",
  requirePermission("member", "delete"),
  removeMemberController,
);
organizationRouter.get("/members/me/role", getMyRoleController);
organizationRouter.get("/members/me/permissions", getMyPermissionsController);