import express from "express";
import { toNodeHandler } from "better-auth/node";

import { errorMiddleware } from "./middleware/error.middleware.js";
import { routes } from "./routes/index.js";
import { auth } from "./lib/auth.js";

export const app = express();

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use(routes);
app.use(errorMiddleware);