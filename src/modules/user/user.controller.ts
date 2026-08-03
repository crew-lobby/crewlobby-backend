import type { RequestHandler } from "express";

import { createUserSchema } from "./user.schemas.js";
import { UserService } from "./user.service.js";

const userService = new UserService();

export const createUserController: RequestHandler = async (request, response, next) => {
try {
const payload = createUserSchema.parse(request.body);
const user = await userService.create(payload);

return response.status(201).json(user);
} catch (error) {
return next(error);
}
};