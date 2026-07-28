import type { RequestHandler } from "express";

export const accessMiddleware: RequestHandler = (request, response, next) => {
const authorization = request.headers.authorization;

if (!authorization) {
return response.status(401).json({
message: "Unauthorized",
});
}

return next();
};

