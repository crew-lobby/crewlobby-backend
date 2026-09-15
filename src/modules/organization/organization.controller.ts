import type { RequestHandler } from "express";

import {
  listMembersQuerySchema,
  removeMemberSchema,
  updateMemberRoleSchema,
} from "./organization.schemas.js";
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
      { ...payload, organizationId: response.locals.auth.organizationId },
      request.headers,
    );

    return response.json(result);
  } catch (error) {
    return next(error);
  }
};

export const listMembersController: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const query = listMembersQuerySchema.parse(request.query);
    const result = await organizationService.listMembers(
      { ...query, organizationId: response.locals.auth.organizationId },
      request.headers,
    );

    return response.json(result);
  } catch (error) {
    return next(error);
  }
};

export const removeMemberController: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const payload = removeMemberSchema.parse({
      memberIdOrEmail: request.params.memberIdOrEmail,
    });
    const result = await organizationService.removeMember(
      { ...payload, organizationId: response.locals.auth.organizationId },
      request.headers,
    );

    return response.json(result);
  } catch (error) {
    return next(error);
  }
};

export const listInvitationsController: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const result = await organizationService.listInvitations(
      { organizationId: response.locals.auth.organizationId },
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