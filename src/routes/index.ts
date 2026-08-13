import { Router } from "express";

import { authRouter } from "../modules/auth/auth.routes.js";
import { healthRouter } from "../modules/health/health.routes.js";
import { organizationRouter } from "../modules/organization/organization.routes.js";
import { userRouter } from "../modules/user/user.routes.js";
import { projectsRouter } from "../modules/projects/projects.routes.js";

export const routes = Router();

routes.use("/health", healthRouter);
routes.use("/auth", authRouter);
routes.use("/organizations", organizationRouter);
routes.use("/projects", projectsRouter);
routes.use("/users", userRouter);