import { Router } from "express";

import { accessMiddleware } from "../../middleware/access.middleware";
import { listOrganizationsController } from "./organization.controller";

export const organizationRouter = Router();

organizationRouter.get("/", accessMiddleware, listOrganizationsController);