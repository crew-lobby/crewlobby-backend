import { Router } from "express";

import {
  getProfileController,
  updateProfileController,
} from "./profile.controller.js";
import {
  requireActiveOrganization,
  requirePermission,
  requireSelfOrPermission,
} from "../../middleware/access.middleware.js";

export const profileRouter = Router();

profileRouter.use(requireActiveOrganization);

profileRouter.get(
  "/:userId",
  requirePermission("profile", "read"),
  getProfileController,
);

profileRouter.patch(
  "/:userId",
  requireSelfOrPermission(
    (request) => String(request.params.userId),
    "profile",
    "update",
  ),
  updateProfileController,
);