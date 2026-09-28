import type { RequestHandler } from "express";

import { invitationParamsSchema } from "./invitations.schemas.js";
import { InvitationsService } from "./invitations.service.js";

const invitationsService = new InvitationsService();

export const getInvitationPreviewController: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const { invitationId } = invitationParamsSchema.parse(request.params);
    const preview = await invitationsService.getPreview(invitationId);

    response.setHeader("Cache-Control", "no-store");

    return response.json(preview);
  } catch (error) {
    return next(error);
  }
};