import { Router } from "express";

import {
  updateMemberRole,
  getMyRole,
  getMyPermissions,
} from "./organization.controller.js";

export const organizationRouter = Router();

organizationRouter.patch("/members/role", updateMemberRole);
organizationRouter.get("/members/me/role", getMyRole);
organizationRouter.get("/members/me/permissions", getMyPermissions);