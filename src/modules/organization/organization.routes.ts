import { Router } from "express";

import { accessMiddleware } from "../../middleware/access.middleware.js";
import { listOrganizationsController } from "./organization.controller.js";

export const organizationRouter = Router();

organizationRouter.get("/", accessMiddleware, listOrganizationsController);