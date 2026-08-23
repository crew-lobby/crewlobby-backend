import { Router } from "express";

import {
  createProjectController,
  deleteProjectController,
  listProjectsController,
  updateProjectController,
} from "./projects.controller.js";
import {
  requireActiveOrganization,
  requireProjectPermission,
} from "../../middleware/access.middleware.js";

export const projectsRouter = Router();

projectsRouter.use(requireActiveOrganization);

projectsRouter.get("/", requireProjectPermission("list"), listProjectsController);
projectsRouter.post("/", requireProjectPermission("create"), createProjectController);
projectsRouter.patch(
  "/:id",
  requireProjectPermission("update"),
  updateProjectController,
);
projectsRouter.delete(
  "/:id",
  requireProjectPermission("delete"),
  deleteProjectController,
);
