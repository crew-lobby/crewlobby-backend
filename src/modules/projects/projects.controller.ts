import type { RequestHandler } from "express";

import {
  createProjectSchema,
  listProjectsQuerySchema,
  projectIdParamSchema,
  updateProjectSchema,
} from "./projects.schemas.js";
import { ProjectsService } from "./projects.service.js";

const projectsService = new ProjectsService();

export const createProjectController: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const payload = createProjectSchema.parse(request.body);
    const project = await projectsService.create(payload);

    return response.status(201).json(project);
  } catch (error) {
    return next(error);
  }
};

export const listProjectsController: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const query = listProjectsQuerySchema.parse(request.query);
    const result = await projectsService.list(query);

    return response.json(result);
  } catch (error) {
    return next(error);
  }
};

export const updateProjectController: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const { id } = projectIdParamSchema.parse(request.params);
    const payload = updateProjectSchema.parse(request.body);
    const project = await projectsService.update(id, payload);

    return response.json(project);
  } catch (error) {
    return next(error);
  }
};

export const deleteProjectController: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const { id } = projectIdParamSchema.parse(request.params);
    await projectsService.delete(id);

    return response.status(204).send();
  } catch (error) {
    return next(error);
  }
};