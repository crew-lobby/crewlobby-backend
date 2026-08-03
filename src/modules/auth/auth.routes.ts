import { Router } from "express";
import { fromNodeHeaders } from "better-auth/node";

import { auth } from "../../lib/auth.js";

export const authRouter = Router();

authRouter.get("/me", async (request, response) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(request.headers),
  });

  return response.json(session);
});