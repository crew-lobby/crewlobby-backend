import type { RequestHandler } from "express";

export const listOrganizationsController: RequestHandler = async (
_request,
response,
) => {
return response.status(501).json({
message: "Organization module base created",
});
};