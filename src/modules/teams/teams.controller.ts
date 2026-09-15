import type { RequestHandler } from "express";

import { createTeamSchema, updateTeamSchema } from "./teams.schemas.js";
import { TeamsService } from "./teams.service.js";

const teamsService = new TeamsService();

export const createTeamController: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const payload = createTeamSchema.parse(request.body);
    const team = await teamsService.create(
      response.locals.auth.organizationId,
      payload.name,
    );

    return response.status(201).json(team);
  } catch (error) {
    return next(error);
  }
};

export const listTeamsController: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const teams = await teamsService.list(response.locals.auth.organizationId);

    return response.json({ data: teams });
  } catch (error) {
    return next(error);
  }
};

export const getTeamController: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const team = await teamsService.getById(
      response.locals.auth.organizationId,
      String(request.params.id),
    );

    return response.json(team);
  } catch (error) {
    return next(error);
  }
};

export const updateTeamController: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const payload = updateTeamSchema.parse(request.body);
    const team = await teamsService.update(
      response.locals.auth.organizationId,
      String(request.params.id),
      payload,
    );

    return response.json(team);
  } catch (error) {
    return next(error);
  }
};

export const deleteTeamController: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    await teamsService.delete(
      response.locals.auth.organizationId,
      String(request.params.id),
    );

    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
};