import type { RequestHandler } from "express";

import { updateProfileSchema } from "./profile.schemas.js";
import { ProfileService } from "./profile.service.js";

const profileService = new ProfileService();

export const getProfileController: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const result = await profileService.getProfile(
      response.locals.auth.organizationId,
      String(request.params.userId),
    );

    return response.json(result);
  } catch (error) {
    return next(error);
  }
};

export const updateProfileController: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const payload = updateProfileSchema.parse(
      request.body,
    );

    const targetUserId = String(request.params.userId);
    const currentUserId = response.locals.auth.user.id;

    const result = await profileService.updateProfile(
      response.locals.auth.organizationId,
      targetUserId,
      payload,
      {
        currentUserId,
        isSelfEdit: currentUserId === targetUserId,
      },
    );

    return response.json(result);
  } catch (error) {
    return next(error);
  }
};