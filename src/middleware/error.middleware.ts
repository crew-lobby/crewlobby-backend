import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { AppError } from "../shared/errors/app-error.js";

function isBetterAuthAPIError(error: unknown): error is {
  name: string;
  statusCode: number;
  body?: { message?: string; code?: string };
  message: string;
} {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { name?: string }).name === "APIError" &&
    "statusCode" in error
  );
}

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

  if (isBetterAuthAPIError(error)) {
    return response.status(error.statusCode ?? 400).json({
      message: error.body?.message ?? error.message,
      code: error.body?.code,
    });
  }

  return response.status(500).json({
    message: "Internal server error",
  });
};