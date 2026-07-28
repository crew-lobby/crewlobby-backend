import type { RequestHandler } from "express";

export const loginController: RequestHandler = async (_request, response) => {
return response.status(501).json({
message: "Auth module base created",
});
};