import { Router } from "express";

import {
  createTeamController,
  deleteTeamController,
  getTeamController,
  listTeamsController,
  updateTeamController,
} from "./teams.controller.js";
import {
  requireActiveOrganization,
  requirePermission,
} from "../../middleware/access.middleware.js";

export const teamsRouter = Router();

teamsRouter.use(requireActiveOrganization);

teamsRouter.get("/", requirePermission("team", "read"), listTeamsController);
teamsRouter.post(
  "/",
  requirePermission("team", "create"),
  createTeamController,
);
teamsRouter.get("/:id", requirePermission("team", "read"), getTeamController);
teamsRouter.patch(
  "/:id",
  requirePermission("team", "update"),
  updateTeamController,
);
teamsRouter.delete(
  "/:id",
  requirePermission("team", "delete"),
  deleteTeamController,
);