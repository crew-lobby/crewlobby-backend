import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

import { errorMiddleware } from "./middleware/error.middleware.js";
import { routes } from "./routes/index.js";
import { auth } from "./lib/auth.js";

export const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true,
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());
app.use(routes);
app.use(errorMiddleware);