import { Router } from "express";

import {
  createProjectController,
  deleteProjectController,
  listProjectsController,
  updateProjectController,
} from "./projects.controller.js";
import {
  requireActiveOrganization,
  requirePermission,
} from "../../middleware/access.middleware.js";

export const projectsRouter = Router();

projectsRouter.use(requireActiveOrganization);

projectsRouter.get(
  "/",
  requirePermission("project", "list"),
  listProjectsController,
);
projectsRouter.post(
  "/",
  requirePermission("project", "create"),
  createProjectController,
);
projectsRouter.patch(
  "/:id",
  requirePermission("project", "update"),
  updateProjectController,
);
projectsRouter.delete(
  "/:id",
  requirePermission("project", "delete"),
  deleteProjectController,
);