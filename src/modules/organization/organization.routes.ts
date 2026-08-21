import { Router } from "express";

import {
  getMyPermissionsController,
  getMyRoleController,
  listMembersController,
  removeMemberController,
  updateMemberRoleController,
} from "./organization.controller.js";

export const organizationRouter = Router();

organizationRouter.get("/members", listMembersController);
organizationRouter.patch("/members/role", updateMemberRoleController);
organizationRouter.delete(
  "/members/:memberIdOrEmail",
  removeMemberController,
);
organizationRouter.get("/members/me/role", getMyRoleController);
organizationRouter.get("/members/me/permissions", getMyPermissionsController);