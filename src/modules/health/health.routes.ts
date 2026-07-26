import { Router } from "express";
import { sql } from "drizzle-orm";

import { db } from "../../db";

export const healthRouter = Router();

healthRouter.get("/", async (_request, response) => {
  try {
    await db.execute(sql`select 1`);

    return response.status(200).json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return response.status(503).json({
      status: "error",
      database: "unavailable",
    });
  }
});