import { authRouter } from "../modules/auth/auth.routes";
import { healthRouter } from "../modules/health/health.routes";
import { organizationRouter } from "../modules/organization/organization.routes";
import { Router } from "express";

export const routes = Router();

routes.use("/health", healthRouter);
routes.use("/auth", authRouter);
routes.use("/organizations", organizationRouter);