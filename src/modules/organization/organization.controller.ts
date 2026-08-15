import type { RequestHandler } from "express";

import { updateMemberRoleSchema } from "./organization.schemas.js";
import { OrganizationService } from "./organization.service.js";

const organizationService = new OrganizationService();

export const updateMemberRoleController: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const payload = updateMemberRoleSchema.parse(request.body);
    const result = await organizationService.updateMemberRole(
      payload,
      request.headers,
    );

    return response.json(result);
  } catch (error) {
    return next(error);
  }
};

export const getMyRoleController: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const result = await organizationService.getMyRole(request.headers);

    return response.json(result);
  } catch (error) {
    return next(error);
  }
};

export const getMyPermissionsController: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const result = await organizationService.getMyPermissions(request.headers);

    return response.json(result);
  } catch (error) {
    return next(error);
  }
};