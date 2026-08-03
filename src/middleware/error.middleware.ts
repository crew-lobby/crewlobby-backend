import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { AppError } from "../shared/errors/app-error.js";

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  console.error(error);

  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "Validation error",
      issues: error.issues,
    });
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
  }

  return response.status(500).json({
    message: "Internal server error",
  });
};