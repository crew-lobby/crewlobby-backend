import { Router } from "express";

import {
  createProjectController,
  deleteProjectController,
  listProjectsController,
  updateProjectController,
} from "./projects.controller.js";

export const projectsRouter = Router();

projectsRouter.post("/", createProjectController);
projectsRouter.get("/", listProjectsController);
projectsRouter.patch("/:id", updateProjectController);
projectsRouter.delete("/:id", deleteProjectController);