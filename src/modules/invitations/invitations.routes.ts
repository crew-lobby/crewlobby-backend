import { Router } from "express";

import { getInvitationPreviewController } from "./invitations.controller.js";

export const invitationsRouter = Router();

invitationsRouter.get("/:invitationId/preview", getInvitationPreviewController);