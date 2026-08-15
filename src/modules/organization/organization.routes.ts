import { Router } from "express";

import {
  getMyPermissionsController,
  getMyRoleController,
  updateMemberRoleController,
} from "./organization.controller.js";

export const organizationRouter = Router();

organizationRouter.patch("/members/role", updateMemberRoleController);
organizationRouter.get("/members/me/role", getMyRoleController);
organizationRouter.get("/members/me/permissions", getMyPermissionsController);