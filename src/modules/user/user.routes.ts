import { Router } from "express";

import { createUserController } from "./user.controller.js";

export const userRouter = Router();

userRouter.post("/", createUserController);